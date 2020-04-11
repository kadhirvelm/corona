import { IMapColoring } from "../typings/mapType";
import { getNumberWithUndefined } from "../utils";

export const MAP_COLORING_OPTIONS: IMapColoring[] = [
    {
        description: "The absolute number of coronavirus cases.",
        label: "Cases",
        getDataPoint: data => getNumberWithUndefined(data?.totalCases),
        getLabel: num => (num === undefined ? "N/A" : num.toLocaleString()),
        colors: {
            start: "#EAF2F8",
            middle: "#7FB3D5",
            end: "#154360",
        },
    },
    {
        description: "The percentage of the population that has coronavirus.",
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
            middle: "#E59866",
            end: "#6E2C00",
        },
    },
    {
        description: "The absolute number of deaths due to coronavirus.",
        label: "Deaths",
        getDataPoint: data => getNumberWithUndefined(data?.deaths),
        getLabel: num => (num === undefined ? "N/A" : num.toLocaleString()),
        colors: {
            start: "#F9EBEA",
            middle: "#D98880",
            end: "#641E16",
        },
    },
    {
        description: "The percentage of the population that has died due to coronavirus.",
        label: "Mortality rate",
        getDataPoint: data => {
            const deaths = getNumberWithUndefined(data?.deaths);
            const population = getNumberWithUndefined(data?.population);
            if (deaths === undefined || population === undefined) {
                return undefined;
            }
            return (deaths / population) * 100;
        },
        getLabel: num => (num === undefined ? "N/A" : `${num.toFixed(3)}%`),
        colors: {
            start: "#F5EEF8",
            middle: "#C39BD3",
            end: "#512E5F",
        },
    },
];
