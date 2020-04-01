import { CoronaService, ICoronaBreakdown } from "@corona/api";
import { isValidState } from "@corona/utils";
import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { debounce } from "lodash-es";
import { IGeography, IDataEntry } from "../../typings";
import { Transitioner, DEFAULT_DATA_KEY } from "../../common";
import { USMap } from "./usMap";
import { nationTopology, stateTopology, getDataKeyFromGeography } from "../../utils";
import {
    IStoreState,
    ADD_DATA,
    UPDATE_GEOGRAPHY,
    SET_HIGHLIGHTED_FIPS,
    REMOVE_HIGHLIGHTED_FIPS,
    SET_DEEP_DIVE_FIPS_CODE,
} from "../../store";

interface IStateProps {
    cachedData: { [key: string]: ICoronaBreakdown };
    geography: IGeography;
}

interface IDispatchProps {
    addData: (newData: { key: string; data: ICoronaBreakdown }) => void;
    removeHighlightedFips: (fipsCode: string | undefined) => void;
    setHighlightedFips: (fipsCode: string | undefined) => void;
    setDeepDiveFips: (fipsCode: string | undefined) => void;
    updateGeography: (geography: IGeography) => void;
}

type IProps = IStateProps & IDispatchProps;

async function getDataForState(stateName: string, addData: (dataEntry: IDataEntry) => void) {
    if (!isValidState(stateName)) {
        throw new Error(`Attempted to fetch data for an invalid state: ${stateName}`);
    }

    const data = await CoronaService.getStateData.frontend(stateName);
    addData({ key: stateName, data });
}

function UnconnectedVirusDataRenderer(props: IProps) {
    const {
        cachedData,
        geography,
        setDeepDiveFips,
        removeHighlightedFips,
        setHighlightedFips,
        updateGeography,
    } = props;

    React.useEffect(() => {
        const { addData } = props;
        if (IGeography.isNationGeography(geography) || cachedData[geography.name] !== undefined) {
            return;
        }

        getDataForState(geography.name, addData);
    }, [geography]);

    const onFeatureSelect = (feature: GeoJSON.Feature<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>) => {
        if (isValidState(feature.properties?.name)) {
            updateGeography(
                IGeography.stateGeography({
                    stateFipsCode: feature.id?.toString() ?? "",
                    name: feature.properties?.name ?? "",
                }),
            );
        } else {
            setDeepDiveFips(feature.id?.toString());
        }
    };

    const onMouseEnter = (feature: GeoJSON.Feature<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>) => {
        setHighlightedFips(feature.id?.toString());
    };

    const onMouseLeave = (feature: GeoJSON.Feature<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>) => {
        removeHighlightedFips(feature.id?.toString());
    };

    const sharedProps = {
        onFeatureSelect,
        onMouseEnter: debounce(onMouseEnter, 100),
        onMouseLeave: debounce(onMouseLeave, 300),
    };

    return (
        <>
            <Transitioner show={IGeography.isNationGeography(geography)}>
                <USMap
                    id="nation"
                    mapTopology={nationTopology()}
                    data={cachedData[DEFAULT_DATA_KEY]}
                    {...sharedProps}
                />
            </Transitioner>
            <Transitioner show={IGeography.isStateGeography(geography)}>
                <USMap
                    id="state"
                    mapTopology={stateTopology(geography)}
                    data={cachedData[getDataKeyFromGeography(geography)]}
                    {...sharedProps}
                />
            </Transitioner>
        </>
    );
}

function mapStateToProps(state: IStoreState): IStateProps {
    return {
        cachedData: state.application.cachedData,
        geography: state.interface.geography,
    };
}

function mapDispatchToProps(dispatch: Dispatch): IDispatchProps {
    return bindActionCreators(
        {
            addData: ADD_DATA.create,
            removeHighlightedFips: REMOVE_HIGHLIGHTED_FIPS.create,
            setHighlightedFips: SET_HIGHLIGHTED_FIPS.create,
            setDeepDiveFips: SET_DEEP_DIVE_FIPS_CODE.create,
            updateGeography: UPDATE_GEOGRAPHY.create,
        },
        dispatch,
    );
}

export const VirusDataRenderer = connect(mapStateToProps, mapDispatchToProps)(UnconnectedVirusDataRenderer);
