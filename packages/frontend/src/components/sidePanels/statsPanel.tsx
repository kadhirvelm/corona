import * as React from "react";
import { IVirusData } from "@corona/api";
import { connect } from "react-redux";
import { InputGroup } from "@blueprintjs/core";
import { IStoreState, maybeGetDataForGeography, getSortedDataBreakdown } from "../../store";
import styles from "./statsPanel.module.scss";
import { IGeography, IDataBreakdown } from "../../typings";

interface IStateProps {
    geography: IGeography;
    data: IVirusData | undefined;
    dataBreakdown: IDataBreakdown[];
}

type IProps = IStateProps;

function renderTitle(geography: IGeography) {
    return IGeography.isNationGeography(geography) ? "United States" : geography.name;
}

function renderDataBreakdown(dataBreakdown: IDataBreakdown[], filter: string) {
    return (
        <div className={styles.caseBreakdownContainer}>
            {dataBreakdown
                .filter(breakdown => breakdown.name.toLowerCase().includes(filter.toLowerCase()))
                .map(breakdown => (
                    <div className={styles.singleBreakdown}>
                        <span>{breakdown.name}</span>
                        <span>{breakdown.cases.toLocaleString()}</span>
                    </div>
                ))}
        </div>
    );
}

function UnconnectedStatsPanel(props: IProps) {
    const [filter, setFilter] = React.useState("");

    const { data, dataBreakdown, geography } = props;
    if (data === undefined) {
        return <div className={styles.statsPanelContainer} />;
    }

    const updateFilterValue = (event: React.ChangeEvent<HTMLInputElement>) => setFilter(event.currentTarget.value);

    return (
        <div className={styles.statsPanelContainer}>
            <div className={styles.titleContainer}>{renderTitle(geography)}</div>
            <div className={styles.totalCasesContainer}>{data.total.toLocaleString()} Total Cases</div>
            <div className={styles.filterContainer}>
                <InputGroup leftIcon="search" onChange={updateFilterValue} value={filter} />
            </div>
            {renderDataBreakdown(dataBreakdown, filter)}
        </div>
    );
}

function mapStateToProps(state: IStoreState): IStateProps {
    return {
        geography: state.interface.geography,
        data: maybeGetDataForGeography(state),
        dataBreakdown: getSortedDataBreakdown(state),
    };
}

export const StatsPanel = connect(mapStateToProps)(UnconnectedStatsPanel);
