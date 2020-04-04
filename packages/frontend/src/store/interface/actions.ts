import { TypedAction } from "redoodle";
import { IGeography } from "../../typings/geography";
import { IDeviceType } from "../../typings";

export const UPDATE_GEOGRAPHY = TypedAction.define("@corona/frontend/update-geography")<IGeography>();

export const SET_DEVICE_TYPE = TypedAction.define("@corona/frontend/set-device-type")<IDeviceType>();
