import * as topology from "topojson-client";
import { IMapTopology } from "../typings/map";
import { IGeography } from "../typings/geography";
import usCounties from "../static/us-county-topology.json";
import usStates from "../static/us-state-topology.json";

/**
 * Returns a basic map topology for the nation. See IMapTopology for more information.
 *
 * This will add the nation topology as the first feature. This is to help the USMap component
 * size all the states to fill the screen.
 */
export function nationTopology(): IMapTopology {
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

/**
 * Returns a basic state topology given the geography of a state. If the geography happens to be of a nation,
 * this method will return the nation topology instead.
 *
 * This will add the state provided in the geography as the first feature. This is to help the USMap component
 * size all the counties to fill the screen.
 */
export function stateTopology(geography: IGeography): IMapTopology {
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
