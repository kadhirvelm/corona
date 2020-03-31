import { TypedAction } from "redoodle";
import { IGeography } from "../../typings/geography";

export const UPDATE_GEOGRAPHY = TypedAction.define("@corona/frontend/update-geography")<IGeography>();

export const SET_HOVERING_OVER_FIPS = TypedAction.define("@corona/frontend/set-hovering-over-fips")<
    string | undefined
>();

export const REMOVE_HOVERING_OVER_FIPS = TypedAction.define("@corona/frontend/remove-hovering-over-fips")<
    string | undefined
>();
