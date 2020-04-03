import { TypedAction } from "redoodle";
import { IDataEntry } from "../../typings";

export const ADD_DATA = TypedAction.define("@corona/frontend/add-data")<IDataEntry>();
