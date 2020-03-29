interface IGenericGeography {
    type: IGeographyTypes;
}

export interface IStateGeography extends IGenericGeography {
    type: "states";
}

export interface ICountyGeography extends IGenericGeography {
    type: "counties";
    stateFipsCode: string;
}

export type IGeographyTypes = "states" | "counties";
export type IGeographyKind = IStateGeography | ICountyGeography;

export function isStateGeography(geography: IGeographyKind): geography is IStateGeography {
    return geography.type === "states";
}

export function isCountyGeography(geography: IGeographyKind): geography is ICountyGeography {
    return geography.type === "counties";
}

export function stateGeography(): IStateGeography {
    return {
        type: "states",
    };
}

export function countyGeography(stateFipsCode: string): ICountyGeography {
    return {
        type: "counties",
        stateFipsCode,
    };
}
