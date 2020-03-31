import { CoronaService, ICoronaBreakdown } from "@corona/api";
import { isValidState } from "@corona/utils";
import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { IGeography, IDataEntry } from "../../typings";
import { Transitioner, DEFAULT_DATA_KEY } from "../../common";
import { USMap } from "./usMap";
import { nationTopology, stateTopology } from "../../utils";
import { IStoreState, ADD_DATA, UPDATE_GEOGRAPHY } from "../../store";
import { getDataKeyFromGeography } from "../../utils/getDataKeyFromGeography";

interface IStateProps {
    cachedData: { [key: string]: ICoronaBreakdown };
    geography: IGeography;
}

interface IDispatchProps {
    addData: (newData: { key: string; data: ICoronaBreakdown }) => void;
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
    const { geography, cachedData, updateGeography } = props;

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
            updateGeography(IGeography.nationGeography());
        }
    };

    return (
        <>
            <Transitioner show={IGeography.isNationGeography(geography)}>
                <USMap
                    id="nation"
                    mapTopology={nationTopology()}
                    data={cachedData[DEFAULT_DATA_KEY]}
                    onFeatureSelect={onFeatureSelect}
                />
            </Transitioner>
            <Transitioner show={IGeography.isStateGeography(geography)}>
                <USMap
                    id="state"
                    mapTopology={stateTopology(geography)}
                    data={cachedData[getDataKeyFromGeography(geography)]}
                    onFeatureSelect={onFeatureSelect}
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
            updateGeography: UPDATE_GEOGRAPHY.create,
        },
        dispatch,
    );
}

export const VirusDataRenderer = connect(mapStateToProps, mapDispatchToProps)(UnconnectedVirusDataRenderer);
