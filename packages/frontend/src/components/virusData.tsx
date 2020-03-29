import { IVirusData, CoronaService } from "@corona/api";
import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import * as topology from "topojson-client";
import { isValidState } from "@corona/utils";
import { Transitioner } from "../common/transitioner";
import usCounties from "../static/us-county-topology.json";
import usStates from "../static/us-state-topology.json";
import { IStoreState } from "../store";
import { ADD_DATA } from "../store/application/actions";
import { USMap } from "./usMap";
import { IDataEntry } from "../typings/data";
import { DEFAULT_DATA_KEY } from "../common/constants";
import { IGeography } from "../typings/geography";
import { IMapTopology } from "../typings/map";

interface IStateProps {
    cachedData: { [key: string]: IVirusData };
    geography: IGeography;
}

interface IDispatchProps {
    addData: (newData: { key: string; data: IVirusData }) => void;
}

type IProps = IStateProps & IDispatchProps;

function nationTopology(): IMapTopology {
    return {
        // NOTE: in production, the JSON import gets turned into a location string
        topologyLocation: (usStates as unknown) as string,
        extractFeatures: json => {
            return [
                ...(topology.feature(json, json.objects.nation) as any).features,
                ...(topology.feature(json, json.objects.states) as any).features,
            ];
        },
    };
}

function stateTopology(geography: IGeography): IMapTopology {
    if (IGeography.isNationGeography(geography)) {
        return nationTopology();
    }

    return {
        // NOTE: in production, the JSON import gets turned into a location string
        topologyLocation: (usCounties as unknown) as string,
        extractFeatures: json => {
            const state = (topology.feature(json, json.objects.states) as any).features.find(
                (feature: any) => feature.id === geography.stateFipsCode,
            );

            return [
                state,
                ...(topology.feature(json, json.objects.counties) as any).features.filter((feature: any) =>
                    feature.id.startsWith(geography.stateFipsCode),
                ),
            ];
        },
    };
}

async function getDataForState(stateName: string, addData: (dataEntry: IDataEntry) => void) {
    if (!isValidState(stateName)) {
        throw new Error(`Attempted to fetch data for an invalid state: ${stateName}`);
    }

    const data = await CoronaService.getStateData.frontend(stateName);
    addData({ key: stateName, data });
}

function UnconnectedVirusDataRenderer(props: IProps) {
    const { geography, cachedData } = props;

    React.useEffect(() => {
        const { addData } = props;
        if (IGeography.isNationGeography(geography) || cachedData[geography.name] !== undefined) {
            return;
        }

        getDataForState(geography.name, addData);
    }, [geography]);

    const keyForData = IGeography.isStateGeography(geography) ? geography.name : DEFAULT_DATA_KEY;
    const data = cachedData[keyForData];

    return (
        <>
            <Transitioner show={IGeography.isNationGeography(geography) && data !== undefined}>
                <USMap id="nation" mapTopology={nationTopology()} data={data} />
            </Transitioner>
            <Transitioner show={IGeography.isStateGeography(geography) && data !== undefined}>
                <USMap id="state" mapTopology={stateTopology(geography)} data={data} />
            </Transitioner>
        </>
    );
}

function mapStateToProps(state: IStoreState): IStateProps {
    return {
        cachedData: state.application.data,
        geography: state.interface.geography,
    };
}

function mapDispatchToProps(dispatch: Dispatch): IDispatchProps {
    return bindActionCreators(
        {
            addData: ADD_DATA.create,
        },
        dispatch,
    );
}

export const VirusDataRenderer = connect(mapStateToProps, mapDispatchToProps)(UnconnectedVirusDataRenderer);
