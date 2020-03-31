import * as React from "react";
import { ICoronaBreakdown } from "@corona/api";
import { connect } from "react-redux";
import { InputGroup, Button } from "@blueprintjs/core";
import { Dispatch, bindActionCreators } from "redux";
import classNames from "classnames";
import {
    IStoreState,
    maybeGetDataForGeography,
    getSortedDataBreakdown,
    UPDATE_GEOGRAPHY,
    SET_HOVERING_OVER_FIPS,
    REMOVE_HOVERING_OVER_FIPS,
} from "../../store";
import styles from "./statsPanel.module.scss";
import { IGeography, IDataBreakdown } from "../../typings";

interface IStateProps {
    geography: IGeography;
    data: ICoronaBreakdown | undefined;
    dataBreakdown: IDataBreakdown[];
    hoveringOverFipsCode: string | undefined;
}

interface IDispatchProps {
    backToNation: () => void;
    removeHoveringOverFipsCode: (fipsCode: string | undefined) => void;
    setHoveringOverFipsCode: (fipsCode: string | undefined) => void;
}

type IProps = IStateProps & IDispatchProps;

function renderDataBreakdown(
    dataBreakdown: IDataBreakdown[],
    filter: string,
    fips: {
        hoveringOverFipsCode: string | undefined;
        removeHoveringOverFipsCode: (fipsCode: string | undefined) => void;
        setHoveringOverFipsCode: (fipsCode: string | undefined) => void;
    },
) {
    const handleClick = (fipsCode: string) => () => {
        if (fips.hoveringOverFipsCode === fipsCode) {
            fips.removeHoveringOverFipsCode(fipsCode);
        } else {
            fips.setHoveringOverFipsCode(fipsCode);
        }
    };

    return (
        <div className={styles.caseBreakdownContainer}>
            {dataBreakdown
                .filter(breakdown => breakdown.name.toLowerCase().includes(filter.toLowerCase()))
                .map(breakdown => (
                    <div
                        className={classNames(styles.singleBreakdown, {
                            [styles.highlight]: fips.hoveringOverFipsCode === breakdown.dataPoint.fipsCode,
                        })}
                        onClick={handleClick(breakdown.dataPoint.fipsCode)}
                    >
                        <span>{breakdown.name}</span>
                        <span>{breakdown.dataPoint.totalCases.toLocaleString()}</span>
                    </div>
                ))}
        </div>
    );
}

function maybeRenderBackButton(geography: IGeography, backToNation: () => void) {
    if (IGeography.isNationGeography(geography)) {
        return null;
    }

    return <Button className={styles.titleBackButton} icon="arrow-left" minimal onClick={backToNation} />;
}

function UnconnectedStatsPanel(props: IProps) {
    const [filter, setFilter] = React.useState("");

    const {
        data,
        dataBreakdown,
        backToNation,
        geography,
        hoveringOverFipsCode,
        setHoveringOverFipsCode,
        removeHoveringOverFipsCode,
    } = props;
    if (data === undefined) {
        return <div className={styles.statsPanelContainer} />;
    }

    const updateFilterValue = (event: React.ChangeEvent<HTMLInputElement>) => setFilter(event.currentTarget.value);

    return (
        <div className={styles.statsPanelContainer}>
            <div className={styles.titleContainer}>
                {maybeRenderBackButton(geography, backToNation)}
                <span className={styles.titleText}>{data.description}</span>
            </div>
            <div className={styles.totalCasesContainer}>
                {data.totalData?.totalCases.toLocaleString() ?? "Unknown"} Total Cases
            </div>
            <div className={styles.filterContainer}>
                <InputGroup leftIcon="search" onChange={updateFilterValue} value={filter} />
            </div>
            {renderDataBreakdown(dataBreakdown, filter, {
                hoveringOverFipsCode,
                setHoveringOverFipsCode,
                removeHoveringOverFipsCode,
            })}
        </div>
    );
}

function mapStateToProps(state: IStoreState): IStateProps {
    return {
        geography: state.interface.geography,
        data: maybeGetDataForGeography(state),
        dataBreakdown: getSortedDataBreakdown(state),
        hoveringOverFipsCode: state.interface.hoveringOverFipsCode,
    };
}

function mapDispatchToProps(dispatch: Dispatch): IDispatchProps {
    return {
        ...bindActionCreators(
            {
                setHoveringOverFipsCode: SET_HOVERING_OVER_FIPS.create,
                removeHoveringOverFipsCode: REMOVE_HOVERING_OVER_FIPS.create,
            },
            dispatch,
        ),
        backToNation: () => dispatch(UPDATE_GEOGRAPHY.create(IGeography.nationGeography())),
    };
}

export const StatsPanel = connect(mapStateToProps, mapDispatchToProps)(UnconnectedStatsPanel);
