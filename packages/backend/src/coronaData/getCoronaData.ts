import { ICoronaBreakdown, STATE } from "@corona/api";
import { getCoronaData, ICoronaData } from "@corona/pipeline";
import LRU from "lru-cache";

const DATA_KEY = "data";

// NOTE: every 3 hours the cache will expire and update its value
const CACHE = new LRU({ max: 1, maxAge: 10800000 });

async function getValueFromCache() {
    const cachedData = CACHE.get(DATA_KEY) as ICoronaData | undefined;

    if (cachedData !== undefined) {
        return cachedData;
    }

    const data = await getCoronaData();
    CACHE.set(DATA_KEY, data);

    return data;
}

export function getCountryCoronaData(): Promise<ICoronaBreakdown> {
    return new Promise(async resolve => {
        const data = await getValueFromCache();
        resolve(data.nation);
    });
}

export async function getStateCoronaData(state: STATE): Promise<ICoronaBreakdown> {
    return new Promise(async resolve => {
        const data = await getValueFromCache();
        resolve(data.states[state]);
    });
}
