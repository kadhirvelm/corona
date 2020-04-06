import { TypedAction } from "redoodle";
import { IGeography } from "../../typings/geography";
import { IDeviceType } from "../../typings";
import { IMapColoring } from "../../typings/mapType";

export const UPDATE_GEOGRAPHY = TypedAction.define("@corona/frontend/update-geography")<IGeography>();

export const SET_DEVICE_TYPE = TypedAction.define("@corona/frontend/set-device-type")<IDeviceType>();

export const SET_MAP_COLORING = TypedAction.define("@corona/frontend/set-map-coloring")<IMapColoring>();
