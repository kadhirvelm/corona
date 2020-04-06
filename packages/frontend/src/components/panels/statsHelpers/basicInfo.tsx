import * as React from "react";
import { ICoronaDataPoint, ICoronaTestingInformation } from "@corona/api";
import { connect } from "react-redux";
import { IStoreState, getCurrentCoronaDataPointFromGeography } from "../../../store";
import styles from "./basicInfo.module.scss";
import { getDateTimeString } from "../../../utils";

interface IStateProps {
    dataPointForBasicInfo: ICoronaDataPoint | undefined;
}

type IProps = IStateProps;

function renderLastUpdated(date: string | undefined) {
    return (
        <div className={styles.dateInfo}>
            <div className={styles.dateLabel}>Last updated</div>
            <div className={styles.dateValue}>{getDateTimeString(date)}</div>
        </div>
    );
}

function renderSingleLabel(label: string, value?: string) {
    return (
        <div className={styles.info}>
            <div className={styles.label}>{label}</div>
            <div className={styles.connector} />
            <div className={styles.value}>{value ?? "No data"}</div>
        </div>
    );
}

function maybeRenderPopulationPercent(totalCases?: number | "N/A", population?: number | "N/A") {
    if (totalCases === undefined || totalCases === "N/A" || population === undefined || population === "N/A") {
        return "N/A";
    }

    return renderSingleLabel("Infection rate", `${Math.abs((totalCases / population) * 100).toFixed(3)}%`);
}

function maybeRenderTestingInformation(testingInformation: ICoronaTestingInformation | undefined) {
    if (testingInformation === undefined) {
        return null;
    }

    const formatTimeString = (time: string) => `${time.split(" ")[0]}/20`;

    return (
        <div className={styles.testingInformation}>
            <span className={styles.title}>State level testing</span>
            {renderSingleLabel("Total tested", testingInformation.totalTests.toLocaleString())}
            {renderSingleLabel("Negative", testingInformation.negative.toLocaleString())}
            {renderSingleLabel("Positive", testingInformation.positive.toLocaleString())}
            {renderSingleLabel("Pending", testingInformation.pending.toLocaleString())}
            {renderSingleLabel("Hospitalized", testingInformation.hospitalized.toLocaleString())}
            {renderSingleLabel("In ICUs", testingInformation.inIcu.toLocaleString())}
            {renderSingleLabel("On ventilators", testingInformation.onVentilator.toLocaleString())}
            {renderLastUpdated(formatTimeString(testingInformation?.lastUpdated))}
        </div>
    );
}

function maybeRenderGeneralInformation(dataPoint: ICoronaDataPoint | undefined) {
    if (dataPoint === undefined) {
        return null;
    }

    return (
        <div className={styles.generalInfo}>
            <span className={styles.title}>General</span>
            {renderSingleLabel("Total", dataPoint.totalCases.toLocaleString())}
            {renderSingleLabel("Recovered", dataPoint.recovered?.toLocaleString())}
            {renderSingleLabel("Active", dataPoint.activeCases?.toLocaleString())}
            {renderSingleLabel("Deaths", dataPoint.deaths?.toLocaleString())}
            {renderSingleLabel("Population", dataPoint.population?.toLocaleString())}
            {maybeRenderPopulationPercent(dataPoint.totalCases, dataPoint.population)}
            {renderLastUpdated(dataPoint.lastUpdated)}
        </div>
    );
}

function UnconnectedBasicInfo(props: IProps) {
    const { dataPointForBasicInfo } = props;

    return (
        <div className={styles.basicInfoContainer}>
            {maybeRenderGeneralInformation(dataPointForBasicInfo)}
            {maybeRenderTestingInformation(dataPointForBasicInfo?.testingInformation)}
        </div>
    );
}

function mapStateToProps(state: IStoreState): IStateProps {
    return {
        dataPointForBasicInfo: getCurrentCoronaDataPointFromGeography(state),
    };
}

export const BasicInfo = connect(mapStateToProps)(UnconnectedBasicInfo);
