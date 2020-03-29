import { TypedReducer, setWith } from "redoodle";
import { UPDATE_GEOGRAPHY } from "./actions";
import { IGeography } from "../../typings/geography";

export interface IInterfaceState {
    /**
     * The current geography to render on the USMap. See IGeography for more information.
     */
    geography: IGeography;
}

export const EMPTY_INTERFACE_STATE: IInterfaceState = {
    geography: IGeography.nationGeography(),
};

export const interfaceReducer = TypedReducer.builder<IInterfaceState>()
    .withHandler(UPDATE_GEOGRAPHY.TYPE, (state, geography) => setWith(state, { geography }))
    .build();
