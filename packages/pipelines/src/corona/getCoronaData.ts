import { ICoronaBreakdown, ICoronaDataPoint, STATE, ICoronaTestingInformation } from "@corona/api";
import { PIPELINE_LOGGER } from "@corona/logger";
import lodash from "lodash";
import { getMergedCoronaDatasets } from "./datasets/getCoronaDatasets";
import { ISingleBreakdown, ISingleTimeseriesBreakdown, ITimeseriesBreakdown, ITotalBreakdown } from "./shared";
import { getMergedCoronaTimeseries } from "./timeseries/getTimeseriesData";
import { getTestingInformation } from "./testing/getTestingInformation";
import { combineDataPoint, getMostRecentDate } from "../utils/mergeDatapoints";

export interface IStateCoronaData {
    [stateName: string]: ICoronaBreakdown;
}

export interface ICoronaData {
    nation: ICoronaBreakdown;
    states: IStateCoronaData;
    timeseries?: ITimeseriesBreakdown;
}

interface IWithMetadata {
    nation: ICoronaDataPoint;
    states: { [fips: string]: ISingleBreakdown };
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
        activeCases: combineDataPoint(dataPoint?.activeCases, mostRecent[1].active),
        deaths: combineDataPoint(dataPoint?.deaths, mostRecent[1].deaths),
        fipsCode: dataPoint?.fipsCode ?? timeseriesBreakdown?.fipsCode ?? "N/A",
        population: dataPoint?.population ?? timeseriesBreakdown?.population ?? "N/A",
        lastUpdated: getMostRecentDate(dataPoint?.lastUpdated, mostRecent[0]),
        recovered: combineDataPoint(dataPoint?.recovered, mostRecent[1].recovered),
        totalCases: combineDataPoint(dataPoint?.totalCases, mostRecent[1].cases),
    };
}

function addTimeSeriesData(
    dataPoints: { nation: ICoronaDataPoint; verifiedDataPoints: ITotalBreakdown },
    timeseries: ITimeseriesBreakdown,
): IWithMetadata {
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

function addTestingInformation(
    stateTotal: ICoronaDataPoint | undefined,
    testingInformation: { [fips: string]: ICoronaTestingInformation },
): ICoronaDataPoint | undefined {
    if (stateTotal === undefined) {
        return undefined;
    }

    const testingInfoState = testingInformation[stateTotal.fipsCode];

    return {
        ...stateTotal,
        deaths: combineDataPoint(stateTotal.deaths, testingInfoState.death),
        totalCases: combineDataPoint(stateTotal.totalCases, testingInfoState.positive),
        testingInformation: testingInformation[stateTotal.fipsCode],
    };
}

function getStateData(
    mergedStateData: ITotalBreakdown,
    testingInformation: { [fips: string]: ICoronaTestingInformation },
): IStateCoronaData {
    return Object.values(STATE)
        .map(state => ({
            [state]: {
                description: state,
                totalData: addTestingInformation(mergedStateData[state].stateTotal, testingInformation),
                breakdown: mergedStateData[state].countiesBreakdown,
            },
        }))
        .reduce((previous, next) => ({ ...previous, ...next }), {}) as IStateCoronaData;
}

function getNationData(nation: ICoronaDataPoint, states: IStateCoronaData): ICoronaBreakdown {
    const allStateDatapointsMerged = Object.values(states)
        .map(dataPoint => dataPoint.totalData)
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

export async function getCoronaData(): Promise<ICoronaData> {
    const [dataPoints, timeseries, testInformation] = await Promise.all([
        getMergedCoronaDatasets(),
        getMergedCoronaTimeseries(),
        getTestingInformation(),
    ]);

    const withTimeSeries = addTimeSeriesData(dataPoints, timeseries);
    const stateData = getStateData(withTimeSeries.states, testInformation);

    return {
        nation: getNationData(withTimeSeries.nation, stateData),
        states: stateData,
        timeseries,
    };
}
