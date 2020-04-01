import { ICoronaBreakdown, ICoronaDataPoint, STATE } from "@corona/api";
import lodash from "lodash";
import { twoLetterCodeToFips, convertStateToTwoLetterCode } from "@corona/utils";
import { getCoronaDataArc } from "./getCoronaDataArc";
import { getCoronaDataCoronaScraper } from "./getCoronaDataCoronaScraper";
import { ITotalBreakdown, ISingleBreakdown } from "./shared";
import { getCoronaDataTimeseries, ICoronaDataScraperTimeseriesBreakdown } from "./getCoronaTimeseries";

export interface IStateCoronaData {
    [stateName: string]: ICoronaBreakdown;
}

export interface ICoronaData {
    nation: ICoronaBreakdown;
    states: IStateCoronaData;
}

function addTimeSeriesDataToDataPoint(
    dataPoint: ICoronaDataPoint,
    timeSeriesData: ICoronaDataScraperTimeseriesBreakdown,
): ICoronaDataPoint {
    return { ...dataPoint, ...timeSeriesData[dataPoint?.fipsCode ?? ""] };
}

function mergeCoronaDatapoints(dataPointA?: ICoronaDataPoint, dataPointB?: ICoronaDataPoint): ICoronaDataPoint {
    if (dataPointA === undefined && dataPointB === undefined) {
        throw new Error("Something went wrong in the data pipeline, attempted to merge two undefined data points.");
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

function mergeCoronaDatasets(
    usDataArc: ITotalBreakdown,
    usDataCoronaScraper: ITotalBreakdown,
    timeSeriesData: ICoronaDataScraperTimeseriesBreakdown,
): ITotalBreakdown {
    return lodash.mergeWith(
        usDataArc,
        usDataCoronaScraper,
        (dataArcState: ISingleBreakdown, coronaScraperState: ISingleBreakdown): ISingleBreakdown => {
            const stateDataMerged = mergeCoronaDatapoints(dataArcState.stateTotal, coronaScraperState.stateTotal);

            return {
                stateTotal: addTimeSeriesDataToDataPoint(stateDataMerged, timeSeriesData),
                countiesBreakdown: lodash.mergeWith(
                    dataArcState.countiesBreakdown,
                    coronaScraperState.countiesBreakdown,
                    (dataArcCounty: ICoronaDataPoint, coronaScraperCounty: ICoronaDataPoint): ICoronaDataPoint => {
                        const countyDataMerged = mergeCoronaDatapoints(dataArcCounty, coronaScraperCounty);

                        return addTimeSeriesDataToDataPoint(countyDataMerged, timeSeriesData);
                    },
                ),
            };
        },
    );
}

function getHigherValueFromCounties(
    counties: ICoronaDataPoint[],
    key: "activeCases" | "deaths" | "recovered" | "totalCases",
    originalNumber?: number,
) {
    const aggregatedValue = counties.reduce((previous, next) => previous + (next[key] ?? 0), 0);
    return Math.max(originalNumber ?? 0, aggregatedValue);
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
                        fipsCode: stateTotal?.fipsCode ?? twoLetterCodeToFips(convertStateToTwoLetterCode(state)),
                    },
                },
            };
        })
        .reduce((previous, next) => ({ ...previous, ...next }), {});
}

function getNationData(nation: ICoronaDataPoint, states: ITotalBreakdown): ICoronaBreakdown {
    const allDatapointsMerged = Object.values(states)
        .map(dataPoint => dataPoint.stateTotal)
        .filter(dataPoint => dataPoint !== undefined) as ICoronaDataPoint[];

    return {
        description: "United States",
        totalData: nation,
        breakdown: lodash.keyBy(allDatapointsMerged, dataPoint => dataPoint?.fipsCode),
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

export async function getCoronaData(): Promise<ICoronaData> {
    const [usDataArc, usDataCoronaScraper, usTimeSeries] = await Promise.all([
        getCoronaDataArc(),
        getCoronaDataCoronaScraper(),
        getCoronaDataTimeseries(),
    ]);

    const mergedStateData = mergeCoronaDatasets(usDataArc, usDataCoronaScraper.states, usTimeSeries);
    const verifiedDataPoints = verifyDatapoints(mergedStateData);

    return {
        nation: getNationData(
            addTimeSeriesDataToDataPoint(usDataCoronaScraper.nation, usTimeSeries),
            verifiedDataPoints,
        ),
        states: getStateData(verifiedDataPoints),
    };
}
