import LRU from "lru-cache";
import { PROJECTION, IProjectionPoint } from "@corona/api";
import { getProjections } from "@corona/pipeline";

const PROJECTION_KEY = "data";

// NOTE: every 24 hours the cache will expire and update its value
const CACHE = new LRU({ max: 1, maxAge: 86400000 });

export function getProjection(projection: PROJECTION): Promise<IProjectionPoint> {
    return new Promise(async resolve => {
        const cachedData = CACHE.get(PROJECTION_KEY) as IProjectionPoint | undefined;

        if (cachedData !== undefined) {
            resolve(cachedData);
        }

        const data = await getProjections(projection);
        resolve(data);
    });
}
