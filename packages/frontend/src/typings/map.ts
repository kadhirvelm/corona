import GeoJSON from "geojson";

export interface IGeography {
    topologyLocation: string;
    extractFeatures: (json: any) => GeoJSON.Feature[];
}

export interface IFeature {
    type: "Feature";
    id: string;
    properties: {
        name: string;
    };
    geometry: {
        type: string;
        coorindates: Array<number[]>;
    };
}

export interface IFeatureSeletion {
    fipsCode: string;
    name: string;
}
