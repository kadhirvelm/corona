import { ICoronaBreakdown } from "@corona/api";
import { scaleLinear } from "d3-scale";
import colors from "./variables.scss";

export function getLinearColorScale(data: ICoronaBreakdown) {
    const average = (numbers: number[]) => numbers.reduce((previous, next) => previous + next, 0) / numbers.length;

    const numbers = Object.values(data.breakdown).map(dataPoint => dataPoint.totalCases);
    const range = [0, average(numbers), Math.max(...numbers)];

    return {
        range,
        colorScale: scaleLinear()
            .domain(range)
            .range([colors.start, colors.middle, colors.end] as any),
    };
}
