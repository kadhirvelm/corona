import { IVirusData, STATE } from "@corona/api";
import { getUSCoronaData } from "@corona/pipeline";
import { convertStateToTwoLetterCode, twoLetterCodeToFips } from "@corona/utils";
import LRU from "lru-cache";

const US_DATA_KEY = "us-data";
const US_STATE_KEY = "us-state-data";

const CACHE = new LRU({ max: 2, maxAge: 3600000 });

export async function getCountryCoronaData(): Promise<IVirusData> {
    return new Promise(async resolve => {
        const cachedData = CACHE.get(US_DATA_KEY) as IVirusData;

        if (cachedData !== undefined) {
            resolve(cachedData);
        } else {
            // eslint-disable-next-line @typescript-eslint/await-thenable
            const data = await getUSCoronaData();
            CACHE.set(US_DATA_KEY, data.country);
            resolve(data.country);
        }
    });
}

export async function getStateCoronaData(state: STATE): Promise<IVirusData> {
    return new Promise(async resolve => {
        const stateKey = twoLetterCodeToFips(convertStateToTwoLetterCode(state));
        const cachedData = CACHE.get(US_STATE_KEY) as any;

        if (cachedData !== undefined) {
            resolve(cachedData[stateKey]);
        } else {
            // eslint-disable-next-line @typescript-eslint/await-thenable
            const data = await getUSCoronaData();
            CACHE.set(US_STATE_KEY, data.states);
            resolve(data.states[stateKey]);
        }
    });
}
