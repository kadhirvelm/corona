import { TypedAction } from "redoodle";
import { IGeography } from "../../typings/geography";

export const UPDATE_GEOGRAPHY = TypedAction.define("@corona/frontend/update-geography")<IGeography>();
