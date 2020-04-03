import { Spinner } from "@blueprintjs/core";
import { ICoronaBreakdown } from "@corona/api";
import classNames from "classnames";
import { geoAlbersUsa, geoPath, GeoPath, GeoPermissibleObjects } from "d3-geo";
import { BaseType, select, Selection } from "d3-selection";
import GeoJSON from "geojson";
import * as React from "react";
import { connect } from "react-redux";
import { IStoreState } from "../../store";
import { IDeviceType, IMapOptions, IMapTopology } from "../../typings";
import { getDimensionsForMap, getLinearColorScale, getTotalDimensionSpacing } from "../../utils";
import { getTopology } from "../../utils/mapDataCache";
import { MapHelpers } from "../helpers";
import styles from "./usMap.module.scss";

interface IStateProps {
    deviceType: IDeviceType | undefined;
}

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

type IProps = IStateProps & IOwnProps;

function renderMap(
    props: IProps,
    svg: Selection<BaseType, unknown, HTMLElement, any>,
    features: GeoJSON.Feature[],
    path: GeoPath<any, GeoPermissibleObjects>,
    mapOptions: IMapOptions,
) {
    const { data, onFeatureSelect, onMouseEnter, onMouseLeave } = props;
    const { colorScale, dimensions } = mapOptions;

    if (data === undefined) {
        throw new Error("Should not reach here");
    }

    svg.selectAll("path")
        .data(features)
        .enter()
        .append("path")
        .attr("class", feature => {
            const cases: number | undefined = data.breakdown[feature.id ?? ""]?.totalCases;

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
        .attr("d", path)
        .attr("transform", `translate(${dimensions.margin?.left ?? 0}, ${dimensions.margin?.top ?? 0})`);
}

async function setupMap(props: IProps, setLoading: (isLoading: boolean) => void, mapOptions: IMapOptions) {
    const { mapTopology, id } = props;

    const svg = select(`#${id}`);

    const usTopology = await getTopology(mapTopology.topologyLocation, setLoading);
    const features = mapTopology.extractFeatures(usTopology);

    const { dimensions } = mapOptions;
    const { widthSpacing, heightSpacing } = getTotalDimensionSpacing(dimensions);

    const projection = geoAlbersUsa().fitSize(
        [dimensions.width - widthSpacing, dimensions.height - heightSpacing],
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

function UnconnectedUSMap(props: IProps) {
    const { data, deviceType, id } = props;

    if (data === undefined) {
        return <Spinner className={styles.centerSpinner} />;
    }

    const [isLoading, setLoading] = React.useState(false);
    const { range, colorScale } = getLinearColorScale(data);

    const dimensions = getDimensionsForMap(deviceType);

    React.useEffect(() => {
        setupMap(props, setLoading, { colorScale, dimensions });
    }, []);

    return (
        <>
            {maybeRenderLoadingState(isLoading)}
            <MapHelpers range={range} />
            <svg className={styles.svgMap} id={id} width={dimensions.width} height={dimensions.height} />
        </>
    );
}

function mapStateToProps(store: IStoreState): IStateProps {
    return {
        deviceType: store.interface.deviceType,
    };
}

export const USMap = connect(mapStateToProps)(UnconnectedUSMap);
