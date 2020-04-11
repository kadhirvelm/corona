import { Spinner } from "@blueprintjs/core";
import { ICoronaBreakdown } from "@corona/api";
import classNames from "classnames";
import { geoPath, GeoPath, GeoPermissibleObjects } from "d3-geo";
import { geoAlbersUsaTerritories } from "d3-composite-projections";
import { BaseType, select, Selection } from "d3-selection";
import GeoJSON from "geojson";
import { noop } from "lodash-es";
import * as React from "react";
import { connect } from "react-redux";
import { IStoreState } from "../../store";
import { IDeviceType, IMapOptions, IMapTopology } from "../../typings";
import { IMapColoring } from "../../typings/mapType";
import { getDimensionsForMap, getLinearColorScale, getTotalDimensionSpacing } from "../../utils";
import { getTopology } from "../../utils/mapDataCache";
import { MapHelpers } from "../helpers";
import styles from "./usMap.module.scss";

interface IStateProps {
    deviceType: IDeviceType | undefined;
    mapColoring: IMapColoring;
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
     * If a feature matches the highlight fips ID, it will render as a highlighted value.
     */
    highlightFips: string | undefined;
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
    onMouseEnter?: (feature: GeoJSON.Feature<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>) => void;
    /**
     * Callback when the user hovers out of a feature.
     */
    onMouseLeave?: (feature: GeoJSON.Feature<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>) => void;
}

type IProps = IStateProps & IOwnProps;

function getClassNamesForFeature(
    data: ICoronaBreakdown | undefined,
    featureId: string | undefined,
    highlightFips?: string,
) {
    const cases = data?.breakdown[featureId ?? ""]?.totalCases;

    return classNames(styles.state, {
        [styles.stateNoData]: cases === undefined || cases === "N/A",
        [styles.highlightFeature]: featureId !== undefined && featureId === highlightFips,
    });
}

function addHighlightClassNames(props: IProps) {
    const { data, id, highlightFips } = props;

    const svg = select(`#${id}`);

    svg.selectAll("path").attr("class", (feature: any) => {
        return getClassNamesForFeature(data, feature?.id, highlightFips);
    });
}

function renderMap(
    props: IProps,
    svg: Selection<BaseType, unknown, HTMLElement, any>,
    features: GeoJSON.Feature[],
    path: GeoPath<any, GeoPermissibleObjects>,
    mapOptions: IMapOptions,
) {
    const { data, highlightFips, mapColoring, onFeatureSelect, onMouseEnter, onMouseLeave } = props;
    const { colorScale, dimensions } = mapOptions;

    svg.selectAll("path")
        .data(features)
        .enter()
        .append("path")
        .attr("class", (feature: any) => {
            return getClassNamesForFeature(data, feature?.id, highlightFips);
        })
        .attr("fill", feature => {
            const number = mapColoring.getDataPoint(data?.breakdown[feature.id ?? ""]);

            if (number === undefined) {
                return styles.defaultGray;
            }

            return colorScale(number);
        })
        .on("click", feature => {
            const number = mapColoring.getDataPoint(data?.breakdown[feature.id ?? ""]);

            if (number === undefined) {
                return;
            }

            onFeatureSelect(feature);
        })
        .on("mouseenter", onMouseEnter ?? noop)
        .on("mouseleave", onMouseLeave ?? noop)
        .attr("d", path)
        .attr("transform", `translate(${dimensions.margin?.left ?? 0}, ${dimensions.margin?.top ?? 0})`);
}

async function setupMap(props: IProps, setLoading: (isLoading: boolean) => void, mapOptions: IMapOptions) {
    const { mapTopology, id } = props;

    const usTopology = await getTopology(mapTopology.topologyLocation, setLoading);
    const features = mapTopology.extractFeatures(usTopology);

    const { dimensions } = mapOptions;
    const { widthSpacing, heightSpacing } = getTotalDimensionSpacing(dimensions);

    const svg = select(`#${id}`);

    const projection = geoAlbersUsaTerritories().fitSize(
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
    const { data, deviceType, highlightFips, mapColoring, id } = props;

    if (data === undefined) {
        return <Spinner className={styles.centerSpinner} />;
    }

    const [isLoading, setLoading] = React.useState(false);
    const { range, colorScale } = getLinearColorScale(data, mapColoring);

    const dimensions = getDimensionsForMap(deviceType);

    const refreshGraph = () => setupMap(props, setLoading, { colorScale, dimensions });

    React.useEffect(() => {
        refreshGraph();
    }, []);

    React.useEffect(() => {
        addHighlightClassNames(props);
    }, [highlightFips]);

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
        mapColoring: store.interface.mapColoring,
    };
}

export const USMap = connect(mapStateToProps)(UnconnectedUSMap);
