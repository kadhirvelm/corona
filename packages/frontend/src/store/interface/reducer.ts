import { TypedReducer } from "redoodle";

export interface IInterfaceState {}

export const EMPTY_INTERFACE_STATE: IInterfaceState = {};

export const interfaceReducer = TypedReducer.builder<IInterfaceState>().build();
