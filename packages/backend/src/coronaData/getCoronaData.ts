import { IGetCoronaData } from "@corona/api";

export const getCoronaData: IGetCoronaData = {
    getUnitedStatesData: () => {
        return new Promise(resolve => {
            resolve({ total: 0, breakdown: {} });
        });
    },
    getStateData: () => {
        return new Promise(resolve => {
            resolve({ total: 0, breakdown: {} });
        });
    },
};
