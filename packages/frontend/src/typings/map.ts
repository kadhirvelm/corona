import GeoJSON from "geojson";

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
