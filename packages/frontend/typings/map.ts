import GeoJSON from "geojson";

export interface IGeography {
    topologyLocation: string;
    extractFeatures: (json: any) => GeoJSON.Feature[];
}

export type IGeographyKind = "states" | "counties";

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
