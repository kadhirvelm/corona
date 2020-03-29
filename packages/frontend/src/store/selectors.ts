import { createSelector } from "reselect";
import { IVirusData } from "@corona/api";
import { convertTwoLetterCodeToState } from "@corona/utils";
import { IStoreState } from "./state";
import { IGeography, IDataBreakdown } from "../typings";
import { getDataKeyFromGeography } from "../utils/getDataKeyFromGeography";

export const maybeGetDataForGeography = createSelector(
    (state: IStoreState) => state.application.cachedData,
    (state: IStoreState) => state.interface.geography,
    (cachedData: { [key: string]: IVirusData }, geography: IGeography): IVirusData | undefined => {
        return cachedData[getDataKeyFromGeography(geography)];
    },
);

export const getDataBreakdown = createSelector(
    maybeGetDataForGeography,
    (state: IStoreState) => state.interface.geography,
    (data: IVirusData | undefined, geography: IGeography): IDataBreakdown[] => {
        if (data === undefined) {
            return [];
        }

        if (IGeography.isNationGeography(geography)) {
            return Object.values(data.breakdown).map(dataPoint => ({
                name: convertTwoLetterCodeToState(dataPoint.name),
                cases: dataPoint.cases,
            }));
        }

        return Object.values(data.breakdown).map(dataPoint => ({
            name: dataPoint.name,
            cases: dataPoint.cases,
        }));
    },
);

export const getSortedDataBreakdown = createSelector(getDataBreakdown, (data: IDataBreakdown[]) => {
    return data.sort((a, b) => a.name.localeCompare(b.name));
});
