import { ICoronaBreakdown, ICoronaDataPoint, STATE } from "@corona/api";
import lodash from "lodash";
import { getCoronaDataArc } from "./getCoronaDataArc";
import { getCoronaDataCoronaScraper } from "./getCoronaDataCoronaScraper";
import { ITotalBreakdown, ISingleBreakdown } from "./shared";

export interface IStateCoronaData {
    [stateName: string]: ICoronaBreakdown;
}

export interface ICoronaData {
    nation: ICoronaBreakdown;
    states: IStateCoronaData;
}

function mergeCoronaDatapoints(dataPointA?: ICoronaDataPoint, dataPointB?: ICoronaDataPoint) {
    return lodash.mergeWith(dataPointA, dataPointB, (a, b) => {
        if (a != null && b == null) {
            return a;
        }

        if (a == null && b != null) {
            return b;
        }

        if ((a === 0 && b > 0) || (a === "" && b !== "")) {
            return b;
        }

        return a;
    });
}

function mergeCoronaBreakdowns(breakdownA: ITotalBreakdown, breakdownB: ITotalBreakdown): ITotalBreakdown {
    return lodash.mergeWith(
        breakdownA,
        breakdownB,
        (a: ISingleBreakdown, b: ISingleBreakdown): ISingleBreakdown => {
            return {
                stateTotal: mergeCoronaDatapoints(a.stateTotal, b.stateTotal),
                countiesBreakdown: lodash.mergeWith(a.countiesBreakdown, b.countiesBreakdown, (c, d) =>
                    mergeCoronaDatapoints(c, d),
                ),
            };
        },
    );
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
    const [usDataArc, usDataCoronaScraper] = await Promise.all([getCoronaDataArc(), getCoronaDataCoronaScraper()]);

    const mergedStateData = mergeCoronaBreakdowns(usDataArc, usDataCoronaScraper.states);

    return {
        nation: getNationData(usDataCoronaScraper.nation, mergedStateData),
        states: getStateData(mergedStateData),
    };
}
