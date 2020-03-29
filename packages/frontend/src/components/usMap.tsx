import { IVirusData } from "@corona/api";
import classNames from "classnames";
import { json } from "d3-fetch";
import { geoAlbersUsa, geoPath, GeoPath, GeoPermissibleObjects } from "d3-geo";
import { BaseType, select, Selection } from "d3-selection";
import GeoJSON from "geojson";
import * as React from "react";
import { IFeatureSeletion, IGeography } from "../typings/map";
import styles from "./usMap.module.scss";

const PADDING = 100;

interface IProps {
    id: string;
    data: IVirusData;
    geography: IGeography;
    onClick: (selection: IFeatureSeletion) => void;
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
            onClick({ fipsCode: feature.id?.toString() ?? "", name: feature.properties?.name ?? "" });
        })
        .attr("d", path);
}

async function setupMap(props: IProps) {
    const { geography, id } = props;

    const svg = select(`#${id}`);

    const usTopology = await json(geography.topologyLocation);
    const features = geography.extractFeatures(usTopology);

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
