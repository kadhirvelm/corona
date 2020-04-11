import { ICoronaBreakdown } from "@corona/api";
import { scaleLinear } from "d3-scale";
import { IMapColoring } from "../typings/mapType";
import colors from "./variables.scss";

export function getColors(mapColoring: IMapColoring) {
    return {
        start: mapColoring.colors?.start ?? colors.start,
        middle: mapColoring.colors?.middle ?? colors.middle,
        end: mapColoring.colors?.end ?? colors.end,
    };
}

export function getLinearColorScale(data: ICoronaBreakdown, mapColoring: IMapColoring) {
    const average = (numbers: number[]) => numbers.reduce((previous, next) => previous + next, 0) / numbers.length;

    const isValidFips = (fips: string) => fips.length === 2 || fips.length === 5;

    const numbers = Object.values(data.breakdown)
        .filter(dataPoint => isValidFips(dataPoint.fipsCode))
        .map(num => mapColoring.getDataPoint(num) ?? 0);

    const range = numbers.length > 0 ? [0, average(numbers), Math.max(...numbers)] : [0, 0, 0];

    const { start, middle, end } = getColors(mapColoring);

    if (range[0] === range[1]) {
        return {
            range,
            colorScale: scaleLinear()
                .domain(range)
                .range([start, start, start] as any),
        };
    }

    return {
        range,
        colorScale: scaleLinear()
            .domain(range)
            .range([start, middle, end] as any),
    };
}
