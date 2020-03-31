import { ICoronaBreakdown, ICoronaDataPoint } from "@corona/api";
import lodash from "lodash";
import { STATE_TO_TWO } from "@corona/utils";
import { getCoronaDataArc } from "./getCoronaDataArc";
import { getCoronaDataCoronaScraper, ICoronaDataScraperBreakdown } from "./getCoronaDataCoronaScraper";
import { ITotalBreakdown } from "./shared";

export interface IStateCoronaData {
    [stateName: string]: ICoronaBreakdown;
}

export interface ICoronaData {
    nation: ICoronaBreakdown;
    states: IStateCoronaData;
}

function mergeAndKeyCoronaDataPoints(
    usDataArc: Array<ICoronaDataPoint | undefined>,
    usDataCoronaScraper: Array<ICoronaDataPoint | undefined>,
): { [fipsCode: string]: ICoronaDataPoint } {
    // NOTE: through keyBy the last key for a particular value will take precedence. In this case we want the usDataArc to
    // be the more reliable value, so it gets added second.
    const dataPoints = [...usDataCoronaScraper, ...usDataArc].filter(
        dataPoint => !lodash.isUndefined(dataPoint),
    ) as ICoronaDataPoint[];

    return lodash.keyBy(dataPoints, dataPoint => dataPoint.fipsCode);
}

function getNationData(usDataArc: ITotalBreakdown, usDataCoronaScraper: ICoronaDataScraperBreakdown): ICoronaBreakdown {
    const usDataArcStates = Object.values(usDataArc).map(dataPoint => dataPoint.stateTotal);
    const usDataCoronaScraperStates = Object.values(usDataCoronaScraper.states).map(dataPoint => dataPoint.stateTotal);

    return {
        description: "United States",
        totalData: usDataCoronaScraper.nation,
        breakdown: mergeAndKeyCoronaDataPoints(usDataArcStates, usDataCoronaScraperStates),
    };
}

function getStateData(usDataArc: ITotalBreakdown, usDataCoronaScraper: ICoronaDataScraperBreakdown): IStateCoronaData {
    return Object.keys(STATE_TO_TWO)
        .map(state => ({
            [state]: {
                description: state,
                totalData: usDataCoronaScraper.states[state].stateTotal ?? usDataArc[state].stateTotal,
                breakdown: mergeAndKeyCoronaDataPoints(
                    Object.values(usDataArc[state].countiesBreakdown),
                    Object.values(usDataCoronaScraper.states[state].countiesBreakdown),
                ),
            },
        }))
        .reduce((previous, next) => ({ ...previous, ...next }), {}) as IStateCoronaData;
}

export async function getCoronaData(): Promise<ICoronaData> {
    const [usDataArc, usDataCoronaScraper] = await Promise.all([getCoronaDataArc(), getCoronaDataCoronaScraper()]);

    return {
        nation: getNationData(usDataArc, usDataCoronaScraper),
        states: getStateData(usDataArc, usDataCoronaScraper),
    };
}
