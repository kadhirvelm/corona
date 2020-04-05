import { ICoronaDataPoint, STATE, ICoronaDatapointTimeseriesDatapoint } from "@corona/api";
import lodash from "lodash";

export interface IStatesKeyed {
    [state: string]: ICoronaDataPoint;
}

export interface ICountiesKeyed {
    [state: string]: ICoronaDataPoint[];
}

export interface ISingleBreakdown {
    stateTotal?: ICoronaDataPoint;
    countiesBreakdown: { [fipsCode: string]: ICoronaDataPoint };
}

export interface ITotalBreakdown {
    [state: string]: ISingleBreakdown;
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

export interface ISingleTimeseriesBreakdown {
    population?: number;
    fipsCode: string;
    state?: string;
    county?: string;
    timeseries: {
        [dates: string]: ICoronaDatapointTimeseriesDatapoint;
    };
}

export interface ITimeseriesBreakdown {
    [fipsCode: string]: ISingleTimeseriesBreakdown;
}
