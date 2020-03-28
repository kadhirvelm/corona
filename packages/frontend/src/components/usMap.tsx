import { IVirusData } from "@corona/api";
import { geoAlbersUsa, geoPath, GeoPath, GeoPermissibleObjects } from "d3-geo";
import * as React from "react";
import GeoJSON from "geojson";
import { Spinner } from "@blueprintjs/core";
import { select, Selection, BaseType } from "d3-selection";
import { json } from "d3-fetch";
import classNames from "classnames";
import styles from "./usMap.module.scss";
import { IGeography } from "../../typings/map";

interface IProps {
    data: IVirusData;
    geography: IGeography;
    onClick: (name: string) => void;
}

interface IState {
    isLoading: boolean;
}

export class USMap extends React.PureComponent<IProps, IState> {
    public state: IState = {
        isLoading: false,
    };

    public componentDidMount() {
        this.setupMap();
    }

    public render() {
        return (
            <>
                {this.maybeRenderLoadingIndicator()}
                <svg id="map" width={window.innerWidth} height={window.innerHeight} />
            </>
        );
    }

    private maybeRenderLoadingIndicator() {
        const { isLoading } = this.state;
        if (!isLoading) {
            return null;
        }

        return <Spinner />;
    }

    private async setupMap() {
        const { geography } = this.props;

        const svg = select("#map");
        const projection = geoAlbersUsa()
            .scale(2000)
            .translate([window.innerWidth / 2, window.innerHeight / 2]);

        const path = geoPath().projection(projection);
        const usTopology = await json(geography.topologyLocation);
        const features = geography.extractFeatures(usTopology);

        this.renderMap(svg, features, path);
    }

    private renderMap = (
        svg: Selection<BaseType, unknown, HTMLElement, any>,
        features: GeoJSON.Feature[],
        path: GeoPath<any, GeoPermissibleObjects>,
    ) => {
        const { data, onClick } = this.props;

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
    };
}
