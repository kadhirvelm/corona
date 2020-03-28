import { IVirusData } from "@corona/api";
import classNames from "classnames";
import { json } from "d3-fetch";
import { geoAlbersUsa, geoPath, GeoPath, GeoPermissibleObjects } from "d3-geo";
import { BaseType, select, Selection } from "d3-selection";
import GeoJSON from "geojson";
import * as React from "react";
import { IGeography } from "../../typings/map";
import styles from "./usMap.module.scss";

interface IProps {
    data: IVirusData;
    geography: IGeography;
    onClick: (name: string) => void;
}

function renderMap(
    props: IProps,
    svg: Selection<BaseType, unknown, HTMLElement, any>,
    features: GeoJSON.Feature[],
    path: GeoPath<any, GeoPermissibleObjects>,
) {
    const { data, onClick } = props;

    svg.selectAll("path")
        .data(features)
        .enter()
        .append("path")
        .attr("class", feature => {
            return classNames(styles.state, {
                [styles.stateNoData]: data.breakdown[feature.id ?? ""] === undefined,
            });
        })
        .on("click", feature => {
            onClick(feature.properties?.name ?? feature.id);
        })
        .attr("d", path);
}

async function setupMap(props: IProps) {
    const { geography } = props;

    const svg = select("#map");
    const projection = geoAlbersUsa()
        .scale(2000)
        .translate([window.innerWidth / 2, window.innerHeight / 2]);

    const path = geoPath().projection(projection);
    const usTopology = await json(geography.topologyLocation);
    const features = geography.extractFeatures(usTopology);

    renderMap(props, svg, features, path);
}

export function USMap(props: IProps) {
    React.useEffect(() => {
        setupMap(props);
    }, []);

    return <svg id="map" width={window.innerWidth} height={window.innerHeight} />;
}
