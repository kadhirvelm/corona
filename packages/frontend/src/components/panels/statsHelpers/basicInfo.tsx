import * as React from "react";
import { ICoronaDataPoint } from "@corona/api";
import { connect } from "react-redux";
import { IStoreState, getCurrentCoronaDataPointFromGeography } from "../../../store";
import styles from "./basicInfo.module.scss";

interface IStateProps {
    dataPointForBasicInfo: ICoronaDataPoint | undefined;
}

type IProps = IStateProps;

function maybeGetDateString(date?: Date) {
    if (date === undefined) {
        return "N/A";
    }

    return new Intl.DateTimeFormat("en-US", {
        year: "2-digit",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
    }).format(new Date(date));
}

function renderLastUpdated(date: Date | undefined) {
    return (
        <div className={styles.dateInfo}>
            <div className={styles.dateLabel}>Last updated</div>
            <div className={styles.dateValue}>{maybeGetDateString(date)}</div>
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

function maybeRenderPopulationPercent(totalCases?: number, population?: number) {
    if (totalCases === undefined || population === undefined) {
        return null;
    }

    return renderSingleLabel("Infection rate", `${Math.abs((totalCases / population) * 100).toFixed(3)}%`);
}

function UnconnectedBasicInfo(props: IProps) {
    const { dataPointForBasicInfo } = props;

    return (
        <div className={styles.basicInfo} key={dataPointForBasicInfo?.fipsCode}>
            {renderSingleLabel("Total", dataPointForBasicInfo?.totalCases.toLocaleString())}
            {renderSingleLabel("Recovered", dataPointForBasicInfo?.recovered?.toLocaleString())}
            {renderSingleLabel("Active", dataPointForBasicInfo?.activeCases?.toLocaleString())}
            {renderSingleLabel("Deaths", dataPointForBasicInfo?.deaths?.toLocaleString())}
            {renderSingleLabel("Population", dataPointForBasicInfo?.population?.toLocaleString())}
            {maybeRenderPopulationPercent(dataPointForBasicInfo?.totalCases, dataPointForBasicInfo?.population)}
            {renderLastUpdated(dataPointForBasicInfo?.lastUpdated)}
        </div>
    );
}

function mapStateToProps(state: IStoreState): IStateProps {
    return {
        dataPointForBasicInfo: getCurrentCoronaDataPointFromGeography(state),
    };
}

export const BasicInfo = connect(mapStateToProps)(UnconnectedBasicInfo);
