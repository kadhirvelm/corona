import { TypedReducer, setWith } from "redoodle";
import { ICoronaBreakdown } from "@corona/api";
import { ADD_DATA } from "./actions";

export interface IApplicationState {
    /**
     * The cached data from all the network calls made to the backend. This is
     * mostly to help keep the load off the backend given that the data is quite light.
     */
    cachedData: {
        [typeOfData: string]: ICoronaBreakdown;
    };
}

export const EMPTY_APPLICATION_STATE: IApplicationState = {
    cachedData: {},
};

export const applicationReducer = TypedReducer.builder<IApplicationState>()
    .withHandler(ADD_DATA.TYPE, (state, newData) =>
        setWith(state, { cachedData: { ...state.cachedData, [newData.key]: newData.data } }),
    )
    .build();
