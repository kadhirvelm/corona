import { IMapColoring } from "../typings/mapType";
import { getNumber } from "../utils";

export const MAP_COLORING_OPTIONS: IMapColoring[] = [
    {
        description: "The absolute number of corona cases.",
        label: "Total cases",
        getDataPoint: data => getNumber(data?.totalCases),
    },
    {
        description: "The percentage of the population that has corona.",
        label: "Infection rate",
        getDataPoint: data => getNumber(data?.totalCases) / getNumber(data?.population),
    },
    {
        description: "The absolute number of deaths due to corona.",
        label: "Total deaths",
        getDataPoint: data => getNumber(data?.deaths),
    },
];
