import { Spinner } from "@blueprintjs/core";
import { ICoronaBreakdown } from "@corona/api";
import classNames from "classnames";
import { geoAlbersUsa, geoPath, GeoPath, GeoPermissibleObjects } from "d3-geo";
import { ScaleLinear } from "d3-scale";
import { BaseType, select, Selection } from "d3-selection";
import GeoJSON from "geojson";
import * as React from "react";
import { IMapTopology } from "../../typings";
import { getLinearColorScale } from "../../utils";
import { MapHelpers } from "../helpers";
import styles from "./usMap.module.scss";
import { getTopology } from "../../utils/mapDataCache";

const PADDING = 100;
const MARGIN_LEFT = 75;

interface IOwnProps {
    /**
     * The unique identifier given to the svg for the map. If there are multiple d3-geo maps on the page, they
     * must have different identifiers to prevent them from rendering over one another.
     */
    id: string;
    /**
     * The corona virus data to render on top of the topology data.
     */
    data?: ICoronaBreakdown;
    /**
     * Provides information related to how to render this map with d3-geo, specifically where to get the topology from
     * and how to extract the features from said topology.
     */
    mapTopology: IMapTopology;
    /**
     * Callback when a feature is clicked on.
     */
    onFeatureSelect: (feature: GeoJSON.Feature<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>) => void;
    /**
     * Callback when the user hovers over a feature.
     */
    onMouseEnter: (feature: GeoJSON.Feature<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>) => void;
    /**
     * Callback when the user hovers out of a feature.
     */
    onMouseLeave: (feature: GeoJSON.Feature<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>) => void;
}

type IProps = IOwnProps;

interface IMapOptions {
    colorScale: ScaleLinear<number, number>;
}

function renderMap(
    props: IProps,
    svg: Selection<BaseType, unknown, HTMLElement, any>,
    features: GeoJSON.Feature[],
    path: GeoPath<any, GeoPermissibleObjects>,
    mapOptions: IMapOptions,
) {
    const { data, onFeatureSelect, onMouseEnter, onMouseLeave } = props;
    const { colorScale } = mapOptions;

    if (data === undefined) {
        throw new Error("Should not reach here");
    }

    svg.selectAll("path")
        .data(features)
        .enter()
        .append("path")
        .attr("class", feature => {
            const cases: number | undefined = data.breakdown[feature.id ?? ""]?.totalCases;

            console.log(data.breakdown, feature.id);

            return classNames(styles.state, {
                [styles.stateNoData]: cases === undefined,
            });
        })
        .attr("fill", feature => {
            const cases: number | undefined = data.breakdown[feature.id ?? ""]?.totalCases;

            if (cases === undefined) {
                return styles.defaultGray;
            }

            return colorScale(cases);
        })
        .on("click", onFeatureSelect)
        .on("mouseenter", onMouseEnter)
        .on("mouseleave", onMouseLeave)
        .attr("d", path);
}

async function setupMap(props: IProps, setLoading: (isLoading: boolean) => void, mapOptions: IMapOptions) {
    const { mapTopology, id } = props;

    const svg = select(`#${id}`);

    const usTopology = await getTopology(mapTopology.topologyLocation, setLoading);
    const features = mapTopology.extractFeatures(usTopology);

    const projection = geoAlbersUsa().fitSize(
        [window.innerWidth - MARGIN_LEFT - PADDING * 2, window.innerHeight - PADDING * 2],
        features[0],
    );
    const path = geoPath().projection(projection);

    renderMap(props, svg, features, path, mapOptions);
}

function maybeRenderLoadingState(isLoading: boolean) {
    if (!isLoading) {
        return null;
    }

    return <Spinner className={styles.centerSpinner} />;
}

export function USMap(props: IProps) {
    const { data, id } = props;

    if (data === undefined) {
        return <Spinner className={styles.centerSpinner} />;
    }

    const [isLoading, setLoading] = React.useState(false);
    const { range, colorScale } = getLinearColorScale(data);

    React.useEffect(() => {
        setupMap(props, setLoading, { colorScale });
    }, []);

    // Note: reducing the width and height to prevent a scroll container on the svg element
    return (
        <>
            {maybeRenderLoadingState(isLoading)}
            <MapHelpers range={range} />
            <svg
                className={styles.svgMap}
                id={id}
                width={window.innerWidth - MARGIN_LEFT}
                height={window.innerHeight - 5}
            />
        </>
    );
}
