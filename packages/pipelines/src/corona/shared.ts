import { ICoronaDataPoint, STATE } from "@corona/api";
import lodash from "lodash";

export interface IStatesKeyed {
    [state: string]: ICoronaDataPoint;
}

export interface ICountiesKeyed {
    [state: string]: ICoronaDataPoint[];
}

export interface ITotalBreakdown {
    [state: string]: {
        stateTotal?: ICoronaDataPoint;
        countiesBreakdown: { [fipsCode: string]: ICoronaDataPoint };
    };
}

export function getTotalBreakdowns(stateData: IStatesKeyed, counties: ICountiesKeyed) {
    const totalBreakdown: ITotalBreakdown = {};

    Object.values(STATE).forEach(state => {
        totalBreakdown[state] = {
            stateTotal: stateData[state],
            countiesBreakdown: lodash.keyBy(counties[state], "fipsCode"),
        };
    });

    return totalBreakdown;
}
