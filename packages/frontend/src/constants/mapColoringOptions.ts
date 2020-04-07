import { IMapColoring } from "../typings/mapType";
import { getNumberWithUndefined } from "../utils";

export const MAP_COLORING_OPTIONS: IMapColoring[] = [
    {
        description: "The absolute number of corona cases.",
        label: "Total cases",
        getDataPoint: data => getNumberWithUndefined(data?.totalCases),
        getLabel: num => (num === undefined ? "N/A" : num.toLocaleString()),
        colors: {
            start: "#EAF2F8",
            middle: "#5499C7",
            end: "#154360",
        },
    },
    {
        description: "The percentage of the population that has corona.",
        label: "Infection rate",
        getDataPoint: data => {
            const totalCases = getNumberWithUndefined(data?.totalCases);
            const population = getNumberWithUndefined(data?.population);
            if (totalCases === undefined || population === undefined) {
                return undefined;
            }
            return (totalCases / population) * 100;
        },
        getLabel: num => (num === undefined ? "N/A" : `${num.toFixed(3)}%`),
        colors: {
            start: "#FBEEE6",
            middle: "#DC7633",
            end: "#6E2C00",
        },
    },
    {
        description: "The absolute number of deaths due to corona.",
        label: "Total deaths",
        getDataPoint: data => getNumberWithUndefined(data?.deaths),
        getLabel: num => (num === undefined ? "N/A" : num.toLocaleString()),
        colors: {
            start: "#EBEDEF",
            middle: "#85929E",
            end: "#283747",
        },
    },
];
