import { IVirusData } from "@corona/api";
import { MOCK_US_DATA, MOCK_STATE_DATA } from "./mockData";

export async function getUSCoronaData(): Promise<IVirusData> {
    return new Promise(resolve => {
        resolve(MOCK_US_DATA);
    });
}

export async function getStateCoronaData(): Promise<IVirusData> {
    return new Promise(resolve => {
        resolve(MOCK_STATE_DATA);
    });
}
