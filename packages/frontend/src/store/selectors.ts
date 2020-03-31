import { ICoronaBreakdown } from "@corona/api";
import { createSelector } from "reselect";
import { IDataBreakdown, IGeography } from "../typings";
import { getDataKeyFromGeography } from "../utils/getDataKeyFromGeography";
import { IStoreState } from "./state";

export const maybeGetDataForGeography = createSelector(
    (state: IStoreState) => state.application.cachedData,
    (state: IStoreState) => state.interface.geography,
    (cachedData: { [key: string]: ICoronaBreakdown }, geography: IGeography): ICoronaBreakdown | undefined => {
        return cachedData[getDataKeyFromGeography(geography)];
    },
);

export const getDataBreakdown = createSelector(
    maybeGetDataForGeography,
    (state: IStoreState) => state.interface.geography,
    (data: ICoronaBreakdown | undefined, geography: IGeography): IDataBreakdown[] => {
        if (data === undefined) {
            return [];
        }

        if (IGeography.isNationGeography(geography)) {
            return Object.values(data.breakdown).map(dataPoint => ({
                name: dataPoint.state ?? "Unknown",
                dataPoint,
            }));
        }

        return Object.values(data.breakdown).map(dataPoint => ({
            name: dataPoint.county ?? "Unknown",
            dataPoint,
        }));
    },
);

export const getSortedDataBreakdown = createSelector(getDataBreakdown, (data: IDataBreakdown[]) => {
    return data.sort((a, b) => (a.dataPoint.totalCases > b.dataPoint.totalCases ? -1 : 1));
});
