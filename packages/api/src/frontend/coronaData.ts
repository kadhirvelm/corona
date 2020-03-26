import { IGetCoronaData, IVirusData, STATE } from "../definitions/coronaData";
import { CORONA_ENDPOINTS, PORT } from "../backend/constants";

export const getCoronaDataService: IGetCoronaData = {
    getUnitedStatesData: () => {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await fetch(`http://localhost:${PORT}${CORONA_ENDPOINTS.getUnitedStatesData()}`);
                const virusData = (await result.json()) as IVirusData;
                resolve(virusData);
            } catch (e) {
                reject(e);
            }
        });
    },
    getStateData: (state: STATE) => {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await fetch(`http://localhost:${PORT}${CORONA_ENDPOINTS.getStateData(state)}`);
                const virusData = (await result.json()) as IVirusData;
                resolve(virusData);
            } catch (e) {
                reject(e);
            }
        });
    },
};
