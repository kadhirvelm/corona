import { CoronaService, ICoronaBreakdown } from "@corona/api";
import { isValidState } from "@corona/utils";
import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { DEFAULT_DATA_KEY, Transitioner } from "../../common";
import { ADD_DATA, IStoreState, UPDATE_GEOGRAPHY } from "../../store";
import { IDataEntry, IGeography } from "../../typings";
import { getDataKeyFromGeography, nationTopology, stateTopology } from "../../utils";
import { USMap } from "./usMap";

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
    const { cachedData, geography, updateGeography } = props;

    React.useEffect(() => {
        const { addData } = props;
        if (IGeography.isNationGeography(geography)) {
            return;
        }

        const geographyName = IGeography.isStateGeography(geography) ? geography.name : geography.stateGeography.name;
        if (cachedData[geographyName] !== undefined) {
            return;
        }

        getDataForState(geographyName, addData);
    }, [geography]);

    const onFeatureSelect = (feature: GeoJSON.Feature<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>) => {
        if (IGeography.isNationGeography(geography)) {
            updateGeography(
                IGeography.stateGeography({
                    fipsCode: feature.id?.toString() ?? "",
                    name: feature.properties?.name ?? "",
                }),
            );
            return;
        }

        updateGeography(
            IGeography.countyGeography({
                countyStateGeography: IGeography.isStateGeography(geography) ? geography : geography.stateGeography,
                fipsCode: feature.id?.toString() ?? "",
                name: feature.properties?.name ?? "",
            }),
        );
    };

    const sharedProps = {
        highlightFips: IGeography.isCountyGeography(geography) ? geography.fipsCode : undefined,
        onFeatureSelect,
    };

    return (
        <>
            <Transitioner<ICoronaBreakdown>
                show={IGeography.isNationGeography(geography)}
                transitionProps={cachedData[DEFAULT_DATA_KEY]}
            >
                {dataCopy => <USMap id="nation" mapTopology={nationTopology()} data={dataCopy} {...sharedProps} />}
            </Transitioner>
            <Transitioner<ICoronaBreakdown>
                show={IGeography.isStateGeography(geography) || IGeography.isCountyGeography(geography)}
                transitionProps={cachedData[getDataKeyFromGeography(geography)]}
            >
                {dataCopy => (
                    <USMap id="state" mapTopology={stateTopology(geography)} data={dataCopy} {...sharedProps} />
                )}
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
