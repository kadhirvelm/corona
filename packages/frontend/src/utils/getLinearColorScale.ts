import { ICoronaBreakdown } from "@corona/api";
import { scaleLinear } from "d3-scale";
import colors from "./variables.scss";
import { getNumber } from "./getNumber";

export function getLinearColorScale(data: ICoronaBreakdown) {
    const average = (numbers: number[]) => numbers.reduce((previous, next) => previous + next, 0) / numbers.length;

    const isValidFips = (fips: string) => fips.length === 2 || fips.length === 5;

    const numbers = Object.values(data.breakdown)
        .filter(dataPoint => isValidFips(dataPoint.fipsCode))
        .map(dataPoint => getNumber(dataPoint.totalCases));
    const range = [0, average(numbers), Math.max(...numbers)];

    return {
        range,
        colorScale: scaleLinear()
            .domain(range)
            .range([colors.start, colors.middle, colors.end] as any),
    };
}
