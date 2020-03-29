import { IVirusData } from "@corona/api";
import * as React from "react";
import * as topology from "topojson-client";
import {
    IGeography,
    IFeatureSeletion,
    IGeographyKind,
    isStateGeography,
    IGeographyTypes,
    isCountyGeography,
} from "../../typings/map";
import { Transitioner } from "../common/transitioner";
import usCounties from "../static/us-county-topology.json";
import usStates from "../static/us-state-topology.json";
import { USMap } from "./usMap";

interface IProps {
    getData: () => Promise<IVirusData>;
    onItemClick: (selection: IFeatureSeletion) => void;
    geography: IGeographyKind;
}

function stateGeography(): IGeography {
    return {
        // NOTE: in production, the JSON import gets turned into a location string
        topologyLocation: (usStates as unknown) as string,
        extractFeatures: json => (topology.feature(json, json.objects.states) as any).features,
    };
}

function countyGeography(geographyType: IGeographyKind): IGeography {
    if (isStateGeography(geographyType)) {
        return stateGeography();
    }

    return {
        // NOTE: in production, the JSON import gets turned into a location string
        topologyLocation: (usCounties as unknown) as string,
        extractFeatures: json => (topology.feature(json, json.objects.counties) as any).features,
    };
}

export function VirusDataRenderer(props: IProps) {
    const [data, setData] = React.useState<{ typeOfDataLoaded: IGeographyTypes; virusData: IVirusData } | undefined>(
        undefined,
    );
    const { geography, onItemClick } = props;

    React.useEffect(() => {
        const { getData } = props;
        getData().then(virusData => setData({ typeOfDataLoaded: geography.type, virusData }));
    }, [geography]);

    if (data === undefined) {
        return null;
    }

    const sharedProps = {
        data: data.virusData,
        onClick: onItemClick,
    };

    return (
        <>
            <Transitioner show={isStateGeography(geography) && data.typeOfDataLoaded === "counties"}>
                <USMap id="counties" geography={countyGeography(geography)} {...sharedProps} />
            </Transitioner>
            <Transitioner show={isCountyGeography(geography) && data.typeOfDataLoaded === "states"}>
                <USMap id="states" geography={stateGeography()} {...sharedProps} />
            </Transitioner>
        </>
    );
}
