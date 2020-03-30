import { IGeography } from "../typings";
import { DEFAULT_DATA_KEY } from "../common";

export function getDataKeyFromGeography(geography: IGeography) {
    return IGeography.isStateGeography(geography) ? geography.name : DEFAULT_DATA_KEY;
}
