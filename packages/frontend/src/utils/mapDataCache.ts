import LRU from "lru-cache";
import { json } from "d3-fetch";

const CACHE = new LRU({ max: 2 });

export async function getTopology(topologyLocation: string, setLoading: (isLoading: boolean) => void): Promise<any> {
    const item = CACHE.get(topologyLocation);

    if (item !== undefined) {
        return item;
    }

    setLoading(true);
    const topologyJson = await json(topologyLocation);
    CACHE.set(topologyLocation, topologyJson);
    setLoading(false);

    return topologyJson;
}
