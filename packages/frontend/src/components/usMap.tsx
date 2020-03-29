import { IVirusData } from "@corona/api";
import classNames from "classnames";
import { json } from "d3-fetch";
import { geoAlbersUsa, geoPath, GeoPath, GeoPermissibleObjects } from "d3-geo";
import { BaseType, select, Selection } from "d3-selection";
import GeoJSON from "geojson";
import * as React from "react";
import { Dispatch, bindActionCreators } from "redux";
import { connect } from "react-redux";
import { isValidState } from "@corona/utils";
import styles from "./usMap.module.scss";
import { IMapTopology } from "../typings/map";
import { IGeography } from "../typings/geography";
import { UPDATE_GEOGRAPHY } from "../store/interface/actions";

const PADDING = 100;

interface IOwnProps {
    id: string;
    data: IVirusData;
    mapTopology: IMapTopology;
}

interface IDispatchProps {
    updateGeography: (selection: IGeography) => void;
}

type IProps = IOwnProps & IDispatchProps;

function renderMap(
    props: IProps,
    svg: Selection<BaseType, unknown, HTMLElement, any>,
    features: GeoJSON.Feature[],
    path: GeoPath<any, GeoPermissibleObjects>,
) {
    const { data, updateGeography } = props;

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
            if (isValidState(feature.properties?.name)) {
                updateGeography(
                    IGeography.stateGeography({
                        stateFipsCode: feature.id?.toString() ?? "",
                        name: feature.properties?.name ?? "",
                    }),
                );
            } else {
                updateGeography(IGeography.nationGeography());
            }
        })
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

function UnconnectedUSMap(props: IProps) {
    const { id } = props;

    React.useEffect(() => {
        setupMap(props);
    }, []);

    return <svg className={styles.svgMap} id={id} width={window.innerWidth - 5} height={window.innerHeight - 5} />;
}

function mapDispatchToProps(dispatch: Dispatch): IDispatchProps {
    return bindActionCreators({ updateGeography: UPDATE_GEOGRAPHY.create }, dispatch);
}

export const USMap = connect(undefined, mapDispatchToProps)(UnconnectedUSMap);
