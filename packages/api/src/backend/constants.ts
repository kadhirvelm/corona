import { IGetCoronaDataEndpoints, STATE } from "../definitions/coronaData";

export const PORT = 3000;

export const CORONA_ENDPOINTS: IGetCoronaDataEndpoints = {
    getUnitedStatesData: () => "/data/united-states",
    getStateData: (state: STATE | ":state") => `/data/${state}`,
};
