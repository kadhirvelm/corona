import GeoJSON from "geojson";
import { ScaleLinear } from "d3-scale";

export interface IMapTopology {
    /**
     * Where to get fetch the topologyJSON from. In production, webpack should try and
     * fetch this from its server.
     */
    topologyLocation: string;
    /**
     * Given the json file from the topology location, this should use the topology-client package
     * to extract the features out.
     */
    extractFeatures: (json: any) => GeoJSON.Feature[];
}

export interface IDimensionOptions {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
}

export interface IDimensions {
    height: number;
    width: number;
    margin?: IDimensionOptions;
    style?: React.CSSProperties;
}

export interface IMapOptions {
    colorScale: ScaleLinear<number, number>;
    dimensions: IDimensions;
}
