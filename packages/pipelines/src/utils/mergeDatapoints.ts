import { ICoronaDatapointTimeseriesDatapoint } from "@corona/api";
import { ISingleTimeseriesBreakdown } from "../corona/shared";

export function combineDataPoint(...points: Array<number | undefined | "N/A">) {
    const filteredValues = points.filter(p => p !== undefined && p !== "N/A") as number[];
    if (filteredValues.length === 0) {
        return "N/A";
    }

    return Math.max(...filteredValues);
}

export function getMostRecentDate(...points: Array<string | undefined>) {
    const filteredValues = points.filter(p => p !== undefined) as string[];
    if (filteredValues.length === 0) {
        return "N/A";
    }

    return new Date(Math.max(...filteredValues.map(v => new Date(v).valueOf()))).toISOString();
}

export function getPoint<T extends keyof ISingleTimeseriesBreakdown, K extends any>(
    key: T,
    defaultValue: K,
    ...objects: Array<ISingleTimeseriesBreakdown | undefined>
) {
    return objects.find(o => o?.[key] !== undefined)?.[key] ?? defaultValue;
}

export function getHighestPoint<T extends keyof ICoronaDatapointTimeseriesDatapoint, K extends any>(
    key: T,
    ...objects: Array<ICoronaDatapointTimeseriesDatapoint | undefined>
) {
    const mappedValues = objects.map(o => o?.[key]);
    const filteredValues = mappedValues.filter(o => o !== undefined && o !== "N/A") as number[];
    if (filteredValues.length === 0) {
        return "N/A";
    }

    return Math.max(...filteredValues);
}
