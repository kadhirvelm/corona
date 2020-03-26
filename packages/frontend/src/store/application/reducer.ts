import { TypedReducer } from "redoodle";

export interface IApplicationState {}

export const EMPTY_APPLICATION_STATE: IApplicationState = {};

export const applicationReducer = TypedReducer.builder<IApplicationState>().build();
