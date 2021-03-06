import { ICoronaBreakdown, ICoronaDataPoint, PROJECTION, IProjectionPoint } from "@corona/api";
import { createSelector } from "reselect";
import { isValidProjection } from "@corona/utils";
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

export const getCurrentCoronaDataPointFromGeography = createSelector(
    maybeGetDataForGeography,
    (state: IStoreState) => state.interface.geography,
    (data: ICoronaBreakdown | undefined, geography: IGeography): ICoronaDataPoint | undefined => {
        if (data === undefined) {
            return undefined;
        }

        if (IGeography.isNationGeography(geography) || IGeography.isStateGeography(geography)) {
            return data.totalData;
        }

        return data.breakdown[geography.fipsCode];
    },
);

export const maybeGetProjectionData = createSelector(
    (state: IStoreState) => state.application.cachedProjectionData,
    (state: IStoreState) => state.interface.geography,
    (
        cachedProjectionData: { [projection: string]: IProjectionPoint },
        geography: IGeography,
    ): IProjectionPoint | undefined => {
        if (IGeography.isNationGeography(geography)) {
            return cachedProjectionData[PROJECTION.UNITED_STATES];
        }

        if (IGeography.isStateGeography(geography) && isValidProjection(geography.name)) {
            return cachedProjectionData[geography.name];
        }

        return undefined;
    },
);
