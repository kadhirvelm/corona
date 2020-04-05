import { ICoronaBreakdown, ICoronaDataPoint, STATE, ICoronaDatapointTimeseriesDatapoint } from "@corona/api";
import { PIPELINE_LOGGER } from "@corona/logger";
import { stateToFips } from "@corona/utils";
import lodash from "lodash";
import { getCoronaDataArc } from "./getCoronaDataArc";
import { getCoronaDataCoronaScraper } from "./getCoronaDataCoronaScraper";
import { ISingleBreakdown, ITotalBreakdown, ITimeseriesBreakdown, ISingleTimeseriesBreakdown } from "./shared";
import { getTimeseriesCoronaScraper } from "./getTimeseriesCoronaScraper";
import { getTimeseriesNYTimes } from "./getTimeseriesNYTimes";

export interface IStateCoronaData {
    [stateName: string]: ICoronaBreakdown;
}

export interface ICoronaData {
    nation: ICoronaBreakdown;
    states: IStateCoronaData;
}

function mergeCoronaDatapoints(dataPointA?: ICoronaDataPoint, dataPointB?: ICoronaDataPoint): ICoronaDataPoint {
    if (dataPointA === undefined && dataPointB === undefined) {
        PIPELINE_LOGGER.log({
            level: "error",
            message: "Something went wrong in the data pipeline, attempted to merge two undefined data points.",
        });

        return {
            fipsCode: "",
            totalCases: 0,
        };
    }

    return lodash.mergeWith(dataPointA, dataPointB, (a, b) => {
        if (a != null && b == null) {
            return a;
        }

        if (a == null && b != null) {
            return b;
        }

        if (b - a > 0 || (a === "" && b !== "")) {
            return b;
        }

        return a;
    }) as ICoronaDataPoint;
}

function mergeCoronaDatasets(usDataArc: ITotalBreakdown, usDataCoronaScraper: ITotalBreakdown): ITotalBreakdown {
    return lodash.mergeWith(
        usDataArc,
        usDataCoronaScraper,
        (dataArcState?: ISingleBreakdown, coronaScraperState?: ISingleBreakdown): ISingleBreakdown => {
            const stateDataMerged = mergeCoronaDatapoints(dataArcState?.stateTotal, coronaScraperState?.stateTotal);

            return {
                stateTotal: stateDataMerged,
                countiesBreakdown:
                    lodash.mergeWith(
                        dataArcState?.countiesBreakdown,
                        coronaScraperState?.countiesBreakdown,
                        (
                            dataArcCounty?: ICoronaDataPoint,
                            coronaScraperCounty?: ICoronaDataPoint,
                        ): ICoronaDataPoint => {
                            return mergeCoronaDatapoints(dataArcCounty, coronaScraperCounty);
                        },
                    ) ?? {},
            };
        },
    );
}

function mergeTimeseriesDatasets(
    coronaScraper: ITimeseriesBreakdown,
    nyTimes: ITimeseriesBreakdown,
): ITimeseriesBreakdown {
    return lodash.mergeWith(
        coronaScraper,
        nyTimes,
        (
            coronaScraperPoint: ISingleTimeseriesBreakdown,
            nyTimesPoint: ISingleTimeseriesBreakdown,
        ): ISingleTimeseriesBreakdown => {
            return {
                fipsCode: coronaScraperPoint?.fipsCode ?? nyTimesPoint?.fipsCode,
                state: coronaScraperPoint?.state ?? nyTimesPoint?.state,
                county: coronaScraperPoint?.county ?? nyTimesPoint?.county,
                population: coronaScraperPoint?.population ?? nyTimesPoint?.population,
                timeseries: lodash.mergeWith(
                    coronaScraperPoint?.timeseries,
                    nyTimesPoint?.timeseries,
                    (
                        coronaScraperDatePoint?: ICoronaDatapointTimeseriesDatapoint,
                        nyTimesDatePoint?: ICoronaDatapointTimeseriesDatapoint,
                    ): ICoronaDatapointTimeseriesDatapoint => {
                        return {
                            cases: coronaScraperDatePoint?.cases ?? nyTimesDatePoint?.cases ?? "N/A",
                            deaths: coronaScraperDatePoint?.deaths ?? nyTimesDatePoint?.deaths ?? "N/A",
                            recovered: coronaScraperDatePoint?.recovered ?? "N/A",
                            active: coronaScraperDatePoint?.active ?? "N/A",
                            growthFactor: coronaScraperDatePoint?.growthFactor ?? "N/A",
                        };
                    },
                ),
            };
        },
    );
}

function getNumber(num: number | "N/A" | undefined) {
    if (num === undefined) {
        return undefined;
    }

    if (num === "N/A") {
        return 0;
    }

    return num;
}

function getHigherValueFromCounties(
    counties: ICoronaDataPoint[],
    key: "activeCases" | "deaths" | "recovered" | "totalCases",
    originalNumber?: number | "N/A",
) {
    const aggregatedValue = counties.reduce((previous, next) => previous + (getNumber(next[key]) ?? 0), 0);
    return Math.max(getNumber(originalNumber) ?? 0, aggregatedValue);
}

function verifyDatapoints(totalBreakdown: ITotalBreakdown): ITotalBreakdown {
    return Object.keys(totalBreakdown)
        .map((state): { [state: string]: ISingleBreakdown } => {
            const { stateTotal } = totalBreakdown[state];
            // NOTE: we only want the proper county counts here, we don't want to include the regions and other multi-county counts
            const counties = Object.values(totalBreakdown[state].countiesBreakdown).filter(
                // eslint-disable-next-line no-restricted-globals
                point => !isNaN(parseInt(point.fipsCode, 10)),
            );

            return {
                [state]: {
                    ...totalBreakdown[state],
                    stateTotal: {
                        ...stateTotal,
                        activeCases: getHigherValueFromCounties(counties, "activeCases", stateTotal?.activeCases),
                        deaths: getHigherValueFromCounties(counties, "deaths", stateTotal?.deaths),
                        recovered: getHigherValueFromCounties(counties, "recovered", stateTotal?.recovered),
                        totalCases: getHigherValueFromCounties(counties, "totalCases", stateTotal?.totalCases),
                        fipsCode: stateTotal?.fipsCode ?? stateToFips(state),
                    },
                },
            };
        })
        .reduce((previous, next) => ({ ...previous, ...next }), {});
}

function addTimeseriesDataPoint(
    dataPoint?: ICoronaDataPoint,
    timeseriesBreakdown?: ISingleTimeseriesBreakdown,
): ICoronaDataPoint {
    if (timeseriesBreakdown === undefined && dataPoint === undefined) {
        return { fipsCode: "N/A", totalCases: "N/A" };
    }

    if (timeseriesBreakdown === undefined && dataPoint !== undefined) {
        return dataPoint;
    }

    const mostRecent = Object.entries(timeseriesBreakdown?.timeseries ?? {}).sort((a, b) =>
        new Date(a[0]).valueOf() > new Date(b[0]).valueOf() ? -1 : 1,
    )[0];

    return {
        ...timeseriesBreakdown,
        ...dataPoint,
        activeCases: dataPoint?.activeCases ?? mostRecent[1].active ?? "N/A",
        deaths: dataPoint?.deaths ?? mostRecent[1].deaths ?? "N/A",
        fipsCode: dataPoint?.fipsCode ?? timeseriesBreakdown?.fipsCode ?? "N/A",
        lastUpdated: dataPoint?.lastUpdated ?? mostRecent[0],
        recovered: dataPoint?.recovered ?? mostRecent[1].recovered,
        totalCases: dataPoint?.totalCases ?? mostRecent[1].cases ?? "N/A",
    };
}

function addTimeSeriesData(
    dataPoints: { nation: ICoronaDataPoint; verifiedDataPoints: ITotalBreakdown },
    timeseries: ITimeseriesBreakdown,
) {
    return {
        nation: addTimeseriesDataPoint(dataPoints.nation, timeseries["999"]),
        states: lodash.mapValues(
            dataPoints.verifiedDataPoints,
            (statePoint): ISingleBreakdown => {
                const finalStateTotal = addTimeseriesDataPoint(
                    statePoint.stateTotal,
                    timeseries[statePoint.stateTotal?.fipsCode ?? ""],
                );

                return {
                    stateTotal: finalStateTotal,
                    countiesBreakdown: lodash.mergeWith(
                        statePoint.countiesBreakdown,
                        lodash.pickBy(
                            timeseries,
                            key =>
                                (key.fipsCode.startsWith(finalStateTotal.fipsCode) && key.fipsCode.length === 5) ||
                                key.fipsCode.includes(finalStateTotal.state ?? finalStateTotal.fipsCode),
                        ),
                        (
                            dataCountyPoint?: ICoronaDataPoint,
                            timeseriesPoint?: ISingleTimeseriesBreakdown,
                        ): ICoronaDataPoint => {
                            return addTimeseriesDataPoint(dataCountyPoint, timeseriesPoint);
                        },
                    ),
                };
            },
        ),
    };
}

function getNationData(nation: ICoronaDataPoint, states: ITotalBreakdown): ICoronaBreakdown {
    const allStateDatapointsMerged = Object.values(states)
        .map(dataPoint => dataPoint.stateTotal)
        .filter(dataPoint => dataPoint !== undefined) as ICoronaDataPoint[];

    if (allStateDatapointsMerged.length < 52) {
        const stateNames = allStateDatapointsMerged.map(point => point.state);
        const missingStates = Object.values(STATE).filter(state => !stateNames.includes(state));

        PIPELINE_LOGGER.log({ level: "error", message: `Missing some states: ${missingStates.join(", ")}` });
    }

    return {
        description: "United States",
        totalData: nation,
        breakdown: lodash.keyBy(allStateDatapointsMerged, dataPoint => dataPoint?.fipsCode),
    };
}

function getStateData(mergedStateData: ITotalBreakdown): IStateCoronaData {
    return Object.values(STATE)
        .map(state => ({
            [state]: {
                description: state,
                totalData: mergedStateData[state].stateTotal,
                breakdown: mergedStateData[state].countiesBreakdown,
            },
        }))
        .reduce((previous, next) => ({ ...previous, ...next }), {}) as IStateCoronaData;
}

async function getMergedCoronaDatasets() {
    const [arcGis, coronaDataScraper] = await Promise.all([getCoronaDataArc(), getCoronaDataCoronaScraper()]);

    PIPELINE_LOGGER.log({ level: "info", message: "Fetched data from arcgis and coronadatascraper." });

    const mergedDataPoints = mergeCoronaDatasets(arcGis, coronaDataScraper.states);

    return { nation: coronaDataScraper.nation, verifiedDataPoints: verifyDatapoints(mergedDataPoints) };
}

async function getMergedCoronaTimeseries() {
    const [coronaDataScraper, nyTimes] = await Promise.all([getTimeseriesCoronaScraper(), getTimeseriesNYTimes()]);

    PIPELINE_LOGGER.log({ level: "info", message: "Fetched timeseries from coronascraper and nytimes." });

    return mergeTimeseriesDatasets(coronaDataScraper, nyTimes);
}

export async function getCoronaData(): Promise<ICoronaData> {
    const [dataPoints, timeseries] = await Promise.all([getMergedCoronaDatasets(), getMergedCoronaTimeseries()]);

    const withTimeSeries = addTimeSeriesData(dataPoints, timeseries);

    return {
        nation: getNationData(withTimeSeries.nation, withTimeSeries.states),
        states: getStateData(withTimeSeries.states),
    };
}
