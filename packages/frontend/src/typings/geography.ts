// eslint-disable-next-line max-classes-per-file
export type IGeographyTypes = "nation" | "state" | "county";

interface IGenericGeography {
    type: IGeographyTypes;
    fipsCode: string;
}

/**
 * Indicates the map should be rendering the entire nation.
 */
export interface INationGeography extends IGenericGeography {
    type: "nation";
    fipsCode: "999";
}

/**
 * Provides information related to which state to render.
 */
export interface IStateGeography extends IGenericGeography {
    type: "state";
    nationGeography: INationGeography;
    fipsCode: string;
    name: string;
}

/**
 * Provides information related to which county to render.
 */
export interface ICountyGeography extends IGenericGeography {
    type: "county";
    stateGeography: IStateGeography;
    fipsCode: string;
    name: string;
}

/**
 * The different kinds of geographies the USMap can render.
 */
export type IGeography = INationGeography | IStateGeography | ICountyGeography;

/**
 * Used for the visitor pattern.
 */
interface IVisitor<T = any> {
    nation: (geography: INationGeography) => T;
    state: (geography: IStateGeography) => T;
    county: (geography: ICountyGeography) => T;
}

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
            fipsCode: "999",
        };
    };
    /**
     * Returns a state geography provided the state's fips code and the state's name.
     */
    export const stateGeography = (entry: { fipsCode: string; name: string }): IStateGeography => {
        const { name, fipsCode } = entry;

        return {
            name,
            nationGeography: nationGeography(),
            fipsCode,
            type: "state",
        };
    };
    /** Returns a county geography provided its state's fips code, the county's fips code, and the county's name. */
    export const countyGeography = (entry: {
        countyStateGeography: IStateGeography;
        fipsCode: string;
        name: string;
    }): ICountyGeography => {
        const { countyStateGeography, fipsCode, name } = entry;

        return {
            fipsCode,
            name,
            stateGeography: countyStateGeography,
            type: "county",
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
    /**
     * Type guard for county geographies.
     */
    export const isCountyGeography = (geography: IGeography): geography is ICountyGeography => {
        return geography.type === "county";
    };
    /**
     * Used to visit each type of geography.
     */
    export const visit = <T = any>(geography: IGeography, callbacks: IVisitor<T>) => {
        if (isNationGeography(geography)) {
            return callbacks.nation(geography);
        }

        if (isStateGeography(geography)) {
            return callbacks.state(geography);
        }

        return callbacks.county(geography);
    };
}
