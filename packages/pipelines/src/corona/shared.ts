import { ICoronaDataPoint } from "@corona/api";
import lodash from "lodash";
import { STATE_TO_TWO } from "@corona/utils";

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

    Object.keys(STATE_TO_TWO).forEach(state => {
        totalBreakdown[state] = {
            stateTotal: stateData[state],
            countiesBreakdown: lodash.keyBy(counties[state], "fipsCode"),
        };
    });

    return totalBreakdown;
}
