import * as React from "react";
import { ICoronaDataPoint } from "@corona/api";
import { connect } from "react-redux";
import { IStoreState, maybeGetDataForHoveringOverFips } from "../../store";
import styles from "./hoveringOverFeatureInfo.module.scss";
import { Transitioner } from "../../common";

interface IStateProps {
    hoveringOverInfo: ICoronaDataPoint | undefined;
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

function UnconnectedHoveringOverFeatureInfo(props: IProps) {
    const { hoveringOverInfo } = props;

    return (
        <div className={styles.internalContainer}>
            <Transitioner className={styles.transitioner} show={hoveringOverInfo !== undefined}>
                <div className={styles.hoverInfo}>
                    <div className={styles.title}>
                        {hoveringOverInfo?.county ?? hoveringOverInfo?.state ?? "None selected"}
                    </div>
                    <div className={styles.infoContainer}>
                        {renderSingleLabel("Total", hoveringOverInfo?.totalCases.toLocaleString())}
                        {renderSingleLabel("Recovered", hoveringOverInfo?.recovered?.toLocaleString())}
                        {renderSingleLabel("Active", hoveringOverInfo?.activeCases?.toLocaleString())}
                        {renderSingleLabel("Deaths", hoveringOverInfo?.deaths?.toLocaleString())}
                        {renderSingleLabel("Population", hoveringOverInfo?.population?.toLocaleString())}
                        {maybeRenderPopulationPercent(hoveringOverInfo?.totalCases, hoveringOverInfo?.population)}
                        {renderLastUpdated(hoveringOverInfo?.lastUpdated)}
                    </div>
                </div>
            </Transitioner>
        </div>
    );
}

function mapStateToProps(state: IStoreState): IStateProps {
    return {
        hoveringOverInfo: maybeGetDataForHoveringOverFips(state),
    };
}

export const HoveringOverFeatureInfo = connect(mapStateToProps)(UnconnectedHoveringOverFeatureInfo);
