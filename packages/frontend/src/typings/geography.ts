// eslint-disable-next-line max-classes-per-file
export type IGeographyTypes = "nation" | "state";

interface IGenericGeography {
    type: IGeographyTypes;
}

/**
 * Indicates the map should be rendering the entire nation.
 */
export interface INationGeography extends IGenericGeography {
    type: "nation";
}

/**
 * Provides information related to which state to render.
 */
export interface IStateGeography extends IGenericGeography {
    type: "state";
    stateFipsCode: string;
    name: string;
}

/**
 * The different kinds of geographies the USMap can render.
 */
export type IGeography = INationGeography | IStateGeography;

/**
 * Some instantiator methods and type guards.
 */
export namespace IGeography {
    /**
     * Returns a basic nation geography.
     */
    export const nationGeography = (): INationGeography => {
        return {
            type: "nation",
        };
    };
    /**
     * Returns a state geography provided the state's fips code and the state's name.
     */
    export const stateGeography = (entry: { stateFipsCode: string; name: string }): IStateGeography => {
        const { name, stateFipsCode } = entry;

        return {
            name,
            stateFipsCode,
            type: "state",
        };
    };
    /**
     * Type guard for nation geographies.
     */
    export const isNationGeography = (geography: IGeography): geography is INationGeography => {
        return geography.type === "nation";
    };
    /**
     * Type guard for state geographies.
     */
    export const isStateGeography = (geography: IGeography): geography is IStateGeography => {
        return geography.type === "state";
    };
}
