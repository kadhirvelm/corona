import { IVirusData } from "@corona/api";
import classNames from "classnames";
import { json } from "d3-fetch";
import { geoAlbersUsa, geoPath, GeoPath, GeoPermissibleObjects } from "d3-geo";
import { BaseType, select, Selection } from "d3-selection";
import GeoJSON from "geojson";
import * as React from "react";
import styles from "./usMap.module.scss";
import { IMapTopology } from "../typings";

const PADDING = 100;

interface IOwnProps {
    /**
     * The unique identifier given to the svg for the map. If there are multiple d3-geo maps on the page, they
     * must have different identifiers to prevent them from rendering over one another.
     */
    id: string;
    /**
     * The corona virus data to render on top of the topology data.
     */
    data: IVirusData;
    /**
     * Provides information related to how to render this map with d3-geo, specifically where to get the topology from
     * and how to extract the features from said topology.
     */
    mapTopology: IMapTopology;
    /**
     * Callback when a feature is clicked on.
     */
    onFeatureSelect: (feature: GeoJSON.Feature<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>) => void;
}

type IProps = IOwnProps;

function renderMap(
    props: IProps,
    svg: Selection<BaseType, unknown, HTMLElement, any>,
    features: GeoJSON.Feature[],
    path: GeoPath<any, GeoPermissibleObjects>,
) {
    const { data, onFeatureSelect } = props;

    svg.selectAll("path")
        .data(features)
        .enter()
        .append("path")
        .attr("class", feature => {
            return classNames(styles.state, {
                [styles.stateNoData]: data.breakdown[feature.id ?? ""] === undefined,
            });
        })
        .on("click", onFeatureSelect)
        .attr("d", path);
}

async function setupMap(props: IProps) {
    const { mapTopology, id } = props;

    const svg = select(`#${id}`);

    const usTopology = await json(mapTopology.topologyLocation);
    const features = mapTopology.extractFeatures(usTopology);

    const projection = geoAlbersUsa().fitSize(
        [window.innerWidth - PADDING * 2, window.innerHeight - PADDING * 2],
        features[0],
    );
    const path = geoPath().projection(projection);

    renderMap(props, svg, features, path);
}

export function USMap(props: IProps) {
    const { id } = props;

    React.useEffect(() => {
        setupMap(props);
    }, []);

    return <svg className={styles.svgMap} id={id} width={window.innerWidth - 5} height={window.innerHeight - 5} />;
}
