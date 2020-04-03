import { TypedAction } from "redoodle";
import { IGeography } from "../../typings/geography";
import { IDeviceType } from "../../typings";

export const UPDATE_GEOGRAPHY = TypedAction.define("@corona/frontend/update-geography")<IGeography>();

export const SET_BASIC_INFO_FIPS = TypedAction.define("@corona/frontend/set-basic-info-fips")<string | undefined>();

export const REMOVE_BASIC_INFO_FIPS = TypedAction.define("@corona/frontend/remove-basic-info-fips")<
    string | undefined
>();

export const SET_DEEP_DIVE_FIPS_CODE = TypedAction.define("@corona/frontend/set-information-for-fips")<
    string | undefined
>();

export const SET_DEVICE_TYPE = TypedAction.define("@corona/frontend/set-device-type")<IDeviceType>();
