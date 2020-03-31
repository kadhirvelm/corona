import { ICoronaBreakdown, STATE } from "@corona/api";
import { getCoronaData, ICoronaData } from "@corona/pipeline";
import LRU from "lru-cache";

const DATA_KEY = "data";

// NOTE: every 3 hours the cache will expire and update its value
const CACHE = new LRU({ max: 1, maxAge: 10800000 });

export function getCountryCoronaData(): Promise<ICoronaBreakdown> {
    return new Promise(async resolve => {
        const cachedData = CACHE.get(DATA_KEY) as ICoronaData;

        if (cachedData !== undefined) {
            resolve(cachedData.nation);
        } else {
            // eslint-disable-next-line @typescript-eslint/await-thenable
            const data = await getCoronaData();
            CACHE.set(DATA_KEY, data);
            resolve(data.nation);
        }
    });
}

export async function getStateCoronaData(state: STATE): Promise<ICoronaBreakdown> {
    return new Promise(async resolve => {
        const cachedData = CACHE.get(DATA_KEY) as ICoronaData;

        if (cachedData !== undefined) {
            resolve(cachedData.states[state]);
        } else {
            const data = await getCoronaData();
            CACHE.set(DATA_KEY, data);
            resolve(data.states[state]);
        }
    });
}
