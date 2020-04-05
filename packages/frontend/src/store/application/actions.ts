import { TypedAction } from "redoodle";
import { PROJECTION, IProjectionPoint } from "@corona/api";
import { IDataEntry } from "../../typings";

export const ADD_DATA = TypedAction.define("@corona/frontend/add-data")<IDataEntry>();

export const ADD_PROJECTION_DATA = TypedAction.define("@corona/frontend/add-projection-data")<{
    projection: PROJECTION;
    data: IProjectionPoint;
}>();
