import { TypedReducer, setWith } from "redoodle";
import { UPDATE_GEOGRAPHY, SET_HOVERING_OVER_FIPS, REMOVE_HOVERING_OVER_FIPS } from "./actions";
import { IGeography } from "../../typings/geography";

export interface IInterfaceState {
    /**
     * The current geography to render on the USMap. See IGeography for more information.
     */
    geography: IGeography;
    /**
     * What the user is currently hovering over.
     */
    hoveringOverFipsCode: string | undefined;
}

export const EMPTY_INTERFACE_STATE: IInterfaceState = {
    geography: IGeography.nationGeography(),
    hoveringOverFipsCode: undefined,
};

export const interfaceReducer = TypedReducer.builder<IInterfaceState>()
    .withHandler(SET_HOVERING_OVER_FIPS.TYPE, (state, hoveringOverFipsCode) => setWith(state, { hoveringOverFipsCode }))
    .withHandler(REMOVE_HOVERING_OVER_FIPS.TYPE, (state, hoveringOverFipsCode) => {
        if (state.hoveringOverFipsCode === hoveringOverFipsCode) {
            return setWith(state, { hoveringOverFipsCode: undefined });
        }

        return state;
    })
    .withHandler(UPDATE_GEOGRAPHY.TYPE, (state, geography) => setWith(state, { geography }))
    .build();
