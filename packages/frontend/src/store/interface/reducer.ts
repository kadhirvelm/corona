import { TypedReducer, setWith } from "redoodle";
import { UPDATE_GEOGRAPHY } from "./actions";
import { IGeography } from "../../typings/geography";

export interface IInterfaceState {
    geography: IGeography;
}

export const EMPTY_INTERFACE_STATE: IInterfaceState = {
    geography: IGeography.nationGeography(),
};

export const interfaceReducer = TypedReducer.builder<IInterfaceState>()
    .withHandler(UPDATE_GEOGRAPHY.TYPE, (state, geography) => setWith(state, { geography }))
    .build();
