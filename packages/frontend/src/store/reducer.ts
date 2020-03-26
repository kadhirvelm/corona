import { combineReducers } from "redoodle";
import { IStoreState } from "./state";
import { applicationReducer } from "./application";
import { interfaceReducer } from "./interface";

export const reducer = combineReducers<IStoreState>({
    application: applicationReducer,
    interface: interfaceReducer,
});
