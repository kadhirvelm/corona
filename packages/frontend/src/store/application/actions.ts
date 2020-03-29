import { TypedAction } from "redoodle";
import { IDataEntry } from "../../typings/data";

export const ADD_DATA = TypedAction.define("@corona/frontend/add-data")<IDataEntry>();
