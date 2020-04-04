import { IGeography } from "../typings";
import { DEFAULT_DATA_KEY } from "../common";

export function getDataKeyFromGeography(geography: IGeography) {
    if (IGeography.isNationGeography(geography)) {
        return DEFAULT_DATA_KEY;
    }

    if (IGeography.isStateGeography(geography)) {
        return geography.name;
    }

    return geography.stateGeography.name;
}
