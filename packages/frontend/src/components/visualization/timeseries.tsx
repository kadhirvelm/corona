import * as React from "react";
import { ICoronaDatapointTimeseriesDatapoint } from "@corona/api";
import { scaleTime, scaleLinear } from "d3-scale";
import { line, curveMonotoneX } from "d3-shape";
import { select, Selection } from "d3-selection";
import { extent } from "d3-array";
import { axisBottom, axisLeft } from "d3-axis";
import { timeFormat } from "d3-time-format";
import { NonIdealState } from "@blueprintjs/core";
import { connect } from "react-redux";
import styles from "./timeseries.module.scss";
import { IDeviceType, IDimensions } from "../../typings";
import { IStoreState } from "../../store";
import { getDimensionsForTimeseries, getTotalDimensionSpacing, getNumber, PARSE_TIME } from "../../utils";

interface IStateProps {
    deviceType: IDeviceType | undefined;
}

interface IOwnProps {
    timeseries: { [date: string]: ICoronaDatapointTimeseriesDatapoint };
}

type IProps = IStateProps & IOwnProps;

interface ICleanedPoint {
    x: Date | null;
    cases: number;
    active: number;
    deaths: number;
    recovered: number;
}

function cleanDataPoint(timeseries: { [date: string]: ICoronaDatapointTimeseriesDatapoint }): ICleanedPoint[] {
    return Object.entries(timeseries)
        .map(entry => ({
            x: PARSE_TIME(entry[0]),
            cases: getNumber(entry[1].cases),
            active: getNumber(entry[1].active),
            deaths: getNumber(entry[1].deaths),
            recovered: getNumber(entry[1].recovered),
        }))
        .filter(dataPoint => dataPoint.x != null && dataPoint.cases != null && dataPoint.cases > 0);
}

function addLegend(graph: Selection<SVGGElement, unknown, HTMLElement, any>, dimensions: IDimensions) {
    const legend = graph.append("g");

    legend
        .append("circle")
        .attr("cx", 0)
        .attr("cy", dimensions.height + (dimensions.margin?.bottom ?? 0) - 40)
        .attr("r", 4)
        .style("fill", "#5DADE2");

    legend
        .append("text")
        .attr("x", 10)
        .attr("y", dimensions.height + (dimensions.margin?.bottom ?? 0) - 35)
        .text("Total cases")
        .style("fill", "#5DADE2")
        .attr("text-anchor", "left");

    legend
        .append("circle")
        .attr("cx", 0)
        .attr("cy", dimensions.height + (dimensions.margin?.bottom ?? 0) - 20)
        .attr("r", 4)
        .style("fill", "#B03A2E");

    legend
        .append("text")
        .attr("x", 10)
        .attr("y", dimensions.height + (dimensions.margin?.bottom ?? 0) - 15)
        .text("Active cases")
        .style("fill", "#B03A2E")
        .attr("text-anchor", "left");

    legend
        .append("circle")
        .attr("cx", 130)
        .attr("cy", dimensions.height + (dimensions.margin?.bottom ?? 0) - 40)
        .attr("r", 4)
        .style("fill", "#52BE80");

    legend
        .append("text")
        .attr("x", 140)
        .attr("y", dimensions.height + (dimensions.margin?.bottom ?? 0) - 35)
        .text("Recovered")
        .style("fill", "#52BE80")
        .attr("text-anchor", "left");

    legend
        .append("circle")
        .attr("cx", 130)
        .attr("cy", dimensions.height + (dimensions.margin?.bottom ?? 0) - 20)
        .attr("r", 4)
        .style("fill", "#566573");

    legend
        .append("text")
        .attr("x", 140)
        .attr("y", dimensions.height + (dimensions.margin?.bottom ?? 0) - 15)
        .text("Deaths")
        .style("fill", "#566573")
        .attr("text-anchor", "left");
}

function setupGraph(datapoints: ICleanedPoint[], deviceType: IDeviceType | undefined) {
    const dimensions = getDimensionsForTimeseries(deviceType);
    const { widthSpacing, heightSpacing } = getTotalDimensionSpacing(dimensions);

    const xValues = datapoints.map(point => point.x);
    const yValues = datapoints.map(point => point.cases);

    const x = scaleTime()
        .range([0, dimensions.width])
        .domain(extent(xValues as any) as any);
    const y = scaleLinear()
        .range([dimensions.height, 0])
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
        .attr("width", dimensions.width + widthSpacing)
        .attr("height", dimensions.height + heightSpacing)
        .append("g")
        .attr("transform", `translate(${dimensions.margin?.left ?? 0}, ${dimensions.margin?.top ?? 0})`);

    graph
        .append("g")
        .attr("transform", `translate(0, ${dimensions.height})`)
        .call(axisBottom(x).tickFormat(timeFormat("%m-%d") as any) as any)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)");

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

    addLegend(graph, dimensions);
}

function UnconnectedTimeseries(props: IProps) {
    const { deviceType, timeseries } = props;
    const cleanedDataPoints = cleanDataPoint(timeseries);

    if (cleanedDataPoints.length === 0) {
        return <NonIdealState description="No timeseries data to display." />;
    }

    React.useEffect(() => setupGraph(cleanedDataPoints, deviceType), []);

    return <svg className={styles.svgContainer} id="line-graph" />;
}

function mapStateToProps(state: IStoreState): IStateProps {
    return {
        deviceType: state.interface.deviceType,
    };
}

export const TimeSeries = connect(mapStateToProps)(UnconnectedTimeseries);
