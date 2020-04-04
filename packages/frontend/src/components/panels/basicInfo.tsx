import * as React from "react";
import { ICoronaDataPoint } from "@corona/api";
import { connect } from "react-redux";
import { IStoreState, maybeGetDataForHighlightedFips } from "../../store";
import styles from "./basicInfo.module.scss";
import { Transitioner } from "../../common";

interface IStateProps {
    basicInfoDataPoint: ICoronaDataPoint | undefined;
}

type IProps = IStateProps;

function maybeGetDateString(date?: Date) {
    if (date === undefined) {
        return "No timestamp available";
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
    const { basicInfoDataPoint } = props;

    return (
        <div className={styles.internalContainer}>
            <Transitioner<ICoronaDataPoint | undefined>
                className={styles.transitioner}
                show={basicInfoDataPoint !== undefined}
                transitionProps={basicInfoDataPoint}
            >
                {basicInfoDataPointCopy => (
                    <div className={styles.hoverInfo}>
                        <div className={styles.title}>
                            {basicInfoDataPointCopy?.county ?? basicInfoDataPointCopy?.state ?? "None selected"}
                        </div>
                        <div className={styles.infoContainer}>
                            {renderSingleLabel("Total", basicInfoDataPointCopy?.totalCases.toLocaleString())}
                            {renderSingleLabel("Recovered", basicInfoDataPointCopy?.recovered?.toLocaleString())}
                            {renderSingleLabel("Active", basicInfoDataPointCopy?.activeCases?.toLocaleString())}
                            {renderSingleLabel("Deaths", basicInfoDataPointCopy?.deaths?.toLocaleString())}
                            {renderSingleLabel("Population", basicInfoDataPointCopy?.population?.toLocaleString())}
                            {maybeRenderPopulationPercent(
                                basicInfoDataPointCopy?.totalCases,
                                basicInfoDataPointCopy?.population,
                            )}
                            {renderLastUpdated(basicInfoDataPointCopy?.lastUpdated)}
                        </div>
                    </div>
                )}
            </Transitioner>
        </div>
    );
}

function mapStateToProps(state: IStoreState): IStateProps {
    return {
        basicInfoDataPoint: maybeGetDataForHighlightedFips(state),
    };
}

export const BasicInfo = connect(mapStateToProps)(UnconnectedBasicInfo);
