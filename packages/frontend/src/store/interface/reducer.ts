import { TypedReducer, setWith } from "redoodle";
import {
    UPDATE_GEOGRAPHY,
    SET_BASIC_INFO_FIPS,
    REMOVE_BASIC_INFO_FIPS,
    SET_DEEP_DIVE_FIPS_CODE,
    SET_DEVICE_TYPE,
} from "./actions";
import { IGeography } from "../../typings/geography";
import { IDeviceType } from "../../typings";

export interface IInterfaceState {
    /**
     * The current geography to render on the USMap. See IGeography for more information.
     */
    geography: IGeography;
    /**
     * What the user is currently hovering over. This pops up the highlightedFeatureInfo, which displays various stats.
     */
    basicInfoFipsCode: string | undefined;
    /**
     * When the user clicks on a value in the statsPanel, this will open a growths curve panel.
     */
    deepDiveFipsCode: string | undefined;
    /**
     * The type of device the user is on, calculated through ua-parser-js.
     */
    deviceType: IDeviceType | undefined;
}

export const EMPTY_INTERFACE_STATE: IInterfaceState = {
    geography: IGeography.nationGeography(),
    basicInfoFipsCode: undefined,
    deepDiveFipsCode: undefined,
    deviceType: undefined,
};

export const interfaceReducer = TypedReducer.builder<IInterfaceState>()
    .withHandler(SET_BASIC_INFO_FIPS.TYPE, (state, basicInfoFipsCode) => setWith(state, { basicInfoFipsCode }))
    .withHandler(REMOVE_BASIC_INFO_FIPS.TYPE, (state, basicInfoFipsCode) => {
        if (state.basicInfoFipsCode === basicInfoFipsCode) {
            return setWith(state, { basicInfoFipsCode: undefined });
        }

        return state;
    })
    .withHandler(SET_DEEP_DIVE_FIPS_CODE.TYPE, (state, deepDiveFipsCode) => setWith(state, { deepDiveFipsCode }))
    .withHandler(UPDATE_GEOGRAPHY.TYPE, (state, geography) =>
        setWith(state, { geography, basicInfoFipsCode: undefined, deepDiveFipsCode: undefined }),
    )
    .withHandler(SET_DEVICE_TYPE.TYPE, (state, deviceType) => setWith(state, { deviceType }))
    .build();
