import { IGeography } from "../typings";

export function getGeograhyTitle(geography: IGeography): string {
    if (IGeography.isNationGeography(geography)) {
        return "United states";
    }

    if (IGeography.isStateGeography(geography)) {
        return geography.name;
    }

    return "County";
}
