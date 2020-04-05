import { ICoronaBreakdown, IProjectionPoint } from "@corona/api";
import { setWith, TypedReducer } from "redoodle";
import { ADD_DATA, ADD_PROJECTION_DATA } from "./actions";

export interface IApplicationState {
    /**
     * The cached data from all the network calls made to the backend data endpoints. This is
     * mostly to help keep the load off the backend given that the data is quite light.
     */
    cachedData: {
        [typeOfData: string]: ICoronaBreakdown;
    };
    /**
     * Similar to cached data except for projections.
     */
    cachedProjectionData: {
        [projectionName: string]: IProjectionPoint;
    };
}

export const EMPTY_APPLICATION_STATE: IApplicationState = {
    cachedData: {},
    cachedProjectionData: {},
};

export const applicationReducer = TypedReducer.builder<IApplicationState>()
    .withHandler(ADD_DATA.TYPE, (state, newData) =>
        setWith(state, { cachedData: { ...state.cachedData, [newData.key]: newData.data } }),
    )
    .withHandler(ADD_PROJECTION_DATA.TYPE, (state, projectionData) =>
        setWith(state, {
            cachedProjectionData: { ...state.cachedProjectionData, [projectionData.projection]: projectionData.data },
        }),
    )
    .build();
