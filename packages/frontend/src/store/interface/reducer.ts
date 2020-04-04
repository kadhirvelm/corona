import { setWith, TypedReducer } from "redoodle";
import { IDeviceType } from "../../typings";
import { IGeography } from "../../typings/geography";
import { SET_DEVICE_TYPE, UPDATE_GEOGRAPHY } from "./actions";

export interface IInterfaceState {
    /**
     * The current geography to render on the USMap. See IGeography for more information.
     */
    geography: IGeography;
    /**
     * The type of device the user is on, calculated through ua-parser-js.
     */
    deviceType: IDeviceType | undefined;
}

export const EMPTY_INTERFACE_STATE: IInterfaceState = {
    geography: IGeography.nationGeography(),
    deviceType: undefined,
};

export const interfaceReducer = TypedReducer.builder<IInterfaceState>()
    .withHandler(UPDATE_GEOGRAPHY.TYPE, (state, geography) => setWith(state, { geography }))
    .withHandler(SET_DEVICE_TYPE.TYPE, (state, deviceType) => setWith(state, { deviceType }))
    .build();
