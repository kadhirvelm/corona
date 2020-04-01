import { ICoronaBreakdown, ICoronaDataPoint } from "@corona/api";
import { createSelector } from "reselect";
import { IDataBreakdown, IGeography } from "../typings";
import { getDataKeyFromGeography } from "../utils/getDataKeyFromGeography";
import { IStoreState } from "./state";
import { DEFAULT_DATA_KEY } from "../common";

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
            const maybeNationalDatapoint: IDataBreakdown[] =
                data.totalData === undefined ? [] : [{ name: "USA (Nation)", dataPoint: data.totalData }];

            return Object.values(data.breakdown)
                .map(dataPoint => ({
                    name: dataPoint.state ?? "Unknown",
                    dataPoint,
                }))
                .concat(maybeNationalDatapoint);
        }

        const maybeStateDatapoint: IDataBreakdown[] =
            data.totalData === undefined
                ? []
                : [{ name: `${data.totalData.state} (State)` ?? "State", dataPoint: data.totalData }];

        return Object.values(data.breakdown)
            .map(dataPoint => ({
                name: dataPoint.county ?? "Unknown",
                dataPoint,
            }))
            .concat(maybeStateDatapoint);
    },
);

export const getSortedDataBreakdown = createSelector(getDataBreakdown, (data: IDataBreakdown[]) => {
    return data.sort((a, b) => (a.dataPoint.totalCases > b.dataPoint.totalCases ? -1 : 1));
});

export const maybeGetDataForHighlightedFips = createSelector(
    maybeGetDataForGeography,
    (state: IStoreState) => state.interface.highlightedFipsCode,
    (data: ICoronaBreakdown | undefined, highlightedFips: string | undefined): ICoronaDataPoint | undefined => {
        if (data === undefined || highlightedFips === undefined) {
            return undefined;
        }

        return data.breakdown[highlightedFips];
    },
);

export const maybeGetDataForDeepDiveFips = createSelector(
    maybeGetDataForGeography,
    (state: IStoreState) => state.interface.deepDiveFipsCode,
    (state: IStoreState) => state.interface.geography,
    (
        data: ICoronaBreakdown | undefined,
        deepDiveFipsCode: string | undefined,
        geography: IGeography,
    ): ICoronaDataPoint | undefined => {
        if (data === undefined || deepDiveFipsCode === undefined) {
            return undefined;
        }

        if (IGeography.isNationGeography(geography) && deepDiveFipsCode === "999") {
            return data.totalData;
        }

        if (IGeography.isStateGeography(geography) && deepDiveFipsCode === data.totalData?.fipsCode) {
            return data.totalData;
        }

        return data.breakdown[deepDiveFipsCode];
    },
);
