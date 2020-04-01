import { TypedReducer, setWith } from "redoodle";
import { UPDATE_GEOGRAPHY, SET_HIGHLIGHTED_FIPS, REMOVE_HIGHLIGHTED_FIPS, SET_DEEP_DIVE_FIPS_CODE } from "./actions";
import { IGeography } from "../../typings/geography";

export interface IInterfaceState {
    /**
     * The current geography to render on the USMap. See IGeography for more information.
     */
    geography: IGeography;
    /**
     * What the user is currently hovering over. This pops up the highlightedFeatureInfo, which displays various stats.
     */
    highlightedFipsCode: string | undefined;
    /**
     * When the user clicks on a value in the statsPanel, this will open a growths curve panel.
     */
    deepDiveFipsCode: string | undefined;
}

export const EMPTY_INTERFACE_STATE: IInterfaceState = {
    geography: IGeography.nationGeography(),
    highlightedFipsCode: undefined,
    deepDiveFipsCode: undefined,
};

export const interfaceReducer = TypedReducer.builder<IInterfaceState>()
    .withHandler(SET_HIGHLIGHTED_FIPS.TYPE, (state, highlightedFipsCode) => setWith(state, { highlightedFipsCode }))
    .withHandler(REMOVE_HIGHLIGHTED_FIPS.TYPE, (state, highlightedFipsCode) => {
        if (state.highlightedFipsCode === highlightedFipsCode) {
            return setWith(state, { highlightedFipsCode: undefined });
        }

        return state;
    })
    .withHandler(SET_DEEP_DIVE_FIPS_CODE.TYPE, (state, deepDiveFipsCode) => setWith(state, { deepDiveFipsCode }))
    .withHandler(UPDATE_GEOGRAPHY.TYPE, (state, geography) =>
        setWith(state, { geography, highlightedFipsCode: undefined, deepDiveFipsCode: undefined }),
    )
    .build();
