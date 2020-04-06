import { setWith, TypedReducer } from "redoodle";
import { IDeviceType } from "../../typings";
import { IGeography } from "../../typings/geography";
import { SET_DEVICE_TYPE, UPDATE_GEOGRAPHY, SET_MAP_COLORING } from "./actions";
import { IMapColoring } from "../../typings/mapType";
import { MAP_COLORING_OPTIONS } from "../../constants";

export interface IInterfaceState {
    /**
     * The current geography to render on the USMap. See IGeography for more information.
     */
    geography: IGeography;
    /**
     * The type of device the user is on, calculated through ua-parser-js.
     */
    deviceType: IDeviceType | undefined;
    /**
     * Determines how to set the color for the map.
     */
    mapColoring: IMapColoring;
}

export const EMPTY_INTERFACE_STATE: IInterfaceState = {
    geography: IGeography.nationGeography(),
    deviceType: undefined,
    mapColoring: MAP_COLORING_OPTIONS[0],
};

export const interfaceReducer = TypedReducer.builder<IInterfaceState>()
    .withHandler(UPDATE_GEOGRAPHY.TYPE, (state, geography) => setWith(state, { geography }))
    .withHandler(SET_DEVICE_TYPE.TYPE, (state, deviceType) => setWith(state, { deviceType }))
    .withHandler(SET_MAP_COLORING.TYPE, (state, mapColoring) => setWith(state, { mapColoring }))
    .build();
