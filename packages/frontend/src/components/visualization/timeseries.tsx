import * as React from "react";
import { ICoronaDatapointTimeseriesDatapoint } from "@corona/api";
import { scaleTime, scaleLinear } from "d3-scale";
import { line, curveMonotoneX } from "d3-shape";
import { select } from "d3-selection";
import { extent } from "d3-array";
import { axisBottom, axisLeft } from "d3-axis";
import styles from "./timeseries.module.scss";

interface IProps {
    timeseries: { [date: string]: ICoronaDatapointTimeseriesDatapoint };
}

interface ICleanedPoint {
    x: Date;
    cases: number;
    active: number;
    deaths: number;
    recovered: number;
}

function cleanDataPoint(timeseries: { [date: string]: ICoronaDatapointTimeseriesDatapoint }): ICleanedPoint[] {
    return Object.entries(timeseries).map(entry => ({
        x: new Date(entry[0]),
        cases: entry[1].cases ?? 0,
        active: entry[1].active ?? 0,
        deaths: entry[1].deaths ?? 0,
        recovered: entry[1].recovered ?? 0,
    }));
}

const WIDTH = 430;
const HEIGHT = 300;
const PADDING = { top: 20, right: 20, bottom: 30, left: 50 };

function setupGraph(datapoints: ICleanedPoint[]) {
    const xValues = datapoints.map(point => point.x);
    const yValues = datapoints.map(point => point.cases);

    const x = scaleTime()
        .range([0, WIDTH])
        .domain(extent(xValues) as any);
    const y = scaleLinear()
        .range([HEIGHT, 0])
        .domain([0, Math.max(...yValues)]);

    const casesLine = line()
        .x((point: any) => x(point.x))
        .y((point: any) => y(point.cases))
        .curve(curveMonotoneX);

    const activeLine = line()
        .x((point: any) => x(point.x))
        .y((point: any) => y(point.active))
        .curve(curveMonotoneX);

    const deathsLine = line()
        .x((point: any) => x(point.x))
        .y((point: any) => y(point.deaths))
        .curve(curveMonotoneX);

    const recoveredLine = line()
        .x((point: any) => x(point.x))
        .y((point: any) => y(point.recovered))
        .curve(curveMonotoneX);

    const graph = select("#line-graph")
        .attr("width", WIDTH + PADDING.left + PADDING.right)
        .attr("height", HEIGHT + PADDING.top + PADDING.bottom)
        .append("g")
        .attr("transform", `translate(${PADDING.left}, ${PADDING.top})`);

    graph
        .append("g")
        .attr("transform", `translate(0, ${HEIGHT})`)
        .call(axisBottom(x) as any);

    graph.append("g").call(axisLeft(y));

    graph
        .append("path")
        .data([datapoints])
        .attr("class", styles.cases)
        .attr("d", casesLine as any);

    graph
        .append("path")
        .data([datapoints])
        .attr("class", styles.activeCases)
        .attr("d", activeLine as any);

    graph
        .append("path")
        .data([datapoints])
        .attr("class", styles.deaths)
        .attr("d", deathsLine as any);

    graph
        .append("path")
        .data([datapoints])
        .attr("class", styles.recovered)
        .attr("d", recoveredLine as any);
}

export function Timeseries(props: IProps) {
    React.useEffect(() => setupGraph(cleanDataPoint(props.timeseries)), []);

    return <svg className={styles.svgContainer} id="line-graph" />;
}
