import { TypedAction } from "redoodle";
import { IGeography } from "../../typings/geography";

export const UPDATE_GEOGRAPHY = TypedAction.define("@corona/frontend/update-geography")<IGeography>();

export const SET_HIGHLIGHTED_FIPS = TypedAction.define("@corona/frontend/set-hovering-over-fips")<string | undefined>();

export const REMOVE_HIGHLIGHTED_FIPS = TypedAction.define("@corona/frontend/remove-hovering-over-fips")<
    string | undefined
>();

export const SET_DEEP_DIVE_FIPS_CODE = TypedAction.define("@corona/frontend/set-information-for-fips")<
    string | undefined
>();
