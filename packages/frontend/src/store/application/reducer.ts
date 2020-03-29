import { TypedReducer, setWith } from "redoodle";
import { IVirusData } from "@corona/api";
import { ADD_DATA } from "./actions";

export interface IApplicationState {
    data: {
        [typeOfData: string]: IVirusData;
    };
}

export const EMPTY_APPLICATION_STATE: IApplicationState = {
    data: {},
};

export const applicationReducer = TypedReducer.builder<IApplicationState>()
    .withHandler(ADD_DATA.TYPE, (state, newData) =>
        setWith(state, { data: { ...state.data, [newData.key]: newData.data } }),
    )
    .build();
