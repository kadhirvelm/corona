import * as React from "react";
import * as topology from "topojson-client";
import { IVirusData } from "@corona/api";
import { USMap } from "./usMap";
import { IGeographyKind, IGeography } from "../../typings/map";
import usStates from "../static/us-state-topology.json";
import usCounties from "../static/us-county-topology.json";

interface IProps {
    getData: () => Promise<IVirusData>;
    onItemClick: (item: string) => void;
    geography: IGeographyKind;
}

function getGeography(geographyType: IGeographyKind): IGeography {
    if (geographyType === "states") {
        return {
            topologyLocation: (usStates as unknown) as string,
            extractFeatures: json => (topology.feature(json, json.objects.states) as any).features,
        };
    }

    return {
        topologyLocation: (usCounties as unknown) as string,
        extractFeatures: json => (topology.feature(json, json.objects.counties) as any).features,
    };
}

export function VirusDataRenderer(props: IProps) {
    const [data, setData] = React.useState<IVirusData | undefined>(undefined);
    const { geography, onItemClick } = props;

    React.useEffect(() => {
        const { getData } = props;
        getData().then(setData);
    }, []);

    if (data === undefined) {
        return null;
    }

    return <USMap data={data} geography={getGeography(geography)} onClick={onItemClick} />;
}
