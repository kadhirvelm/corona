// eslint-disable-next-line max-classes-per-file
export type IGeographyTypes = "nation" | "state";

interface IGenericGeography {
    type: IGeographyTypes;
}

export interface INationGeography extends IGenericGeography {
    type: "nation";
}

export interface IStateGeography extends IGenericGeography {
    type: "state";
    stateFipsCode: string;
    name: string;
}

export type IGeography = INationGeography | IStateGeography;

export namespace IGeography {
    export const nationGeography = (): INationGeography => {
        return {
            type: "nation",
        };
    };

    export const stateGeography = (entry: { stateFipsCode: string; name: string }): IStateGeography => {
        const { name, stateFipsCode } = entry;

        return {
            name,
            stateFipsCode,
            type: "state",
        };
    };

    export const isNationGeography = (geography: IGeography): geography is INationGeography => {
        return geography.type === "nation";
    };

    export const isStateGeography = (geography: IGeography): geography is IStateGeography => {
        return geography.type === "state";
    };
}
