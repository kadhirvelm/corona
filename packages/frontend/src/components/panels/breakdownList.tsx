import { InputGroup } from "@blueprintjs/core";
import { ICoronaBreakdown, ICoronaDataPoint } from "@corona/api";
import classNames from "classnames";
import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { getDataBreakdown, IStoreState, maybeGetDataForGeography, UPDATE_GEOGRAPHY } from "../../store";
import { IDataBreakdown, IDevice, IDeviceType, IGeography } from "../../typings";
import styles from "./breakdownList.module.scss";

interface IStateProps {
    geography: IGeography;
    data: ICoronaBreakdown | undefined;
    deviceType: IDeviceType | undefined;
    dataBreakdown: IDataBreakdown[];
}

interface IDispatchProps {
    backToNation: () => void;
    updateGeography: (geography: IGeography) => void;
}

type IProps = IStateProps & IDispatchProps;

function renderDataBreakdown(dataBreakdown: IDataBreakdown[], dataBreakdownProps: IProps) {
    const { deviceType, geography, updateGeography } = dataBreakdownProps;

    const handleClick = (dataPoint: ICoronaDataPoint) => () => {
        if (IGeography.isNationGeography(geography) && geography.fipsCode !== dataPoint.fipsCode) {
            updateGeography(
                IGeography.stateGeography({
                    fipsCode: dataPoint.fipsCode,
                    name: dataPoint.state ?? "Unknown state",
                }),
            );
        }

        if (IGeography.isStateGeography(geography) && geography.fipsCode !== dataPoint.fipsCode) {
            updateGeography(
                IGeography.countyGeography({
                    countyStateGeography: geography,
                    fipsCode: dataPoint.fipsCode,
                    name: dataPoint.county ?? "Unknown county",
                }),
            );
        }

        if (IGeography.isCountyGeography(geography) && geography.fipsCode !== dataPoint.fipsCode) {
            updateGeography(
                IGeography.countyGeography({
                    countyStateGeography: geography.stateGeography,
                    fipsCode: dataPoint.fipsCode,
                    name: dataPoint.county ?? "Unknown county",
                }),
            );
        }
    };

    return (
        <div className={classNames(styles.caseBreakdownContainer, { [styles.browser]: IDevice.isBrowser(deviceType) })}>
            {dataBreakdown.map(breakdown => (
                <div
                    className={classNames(styles.singleBreakdown, {
                        [styles.isOpen]: geography.fipsCode === breakdown.dataPoint.fipsCode,
                        [styles.browser]: IDevice.isBrowser(deviceType),
                    })}
                    onClick={handleClick(breakdown.dataPoint)}
                >
                    <span>{breakdown.name}</span>
                    <span className={styles.totalCasesColumn}>{breakdown.dataPoint.totalCases.toLocaleString()}</span>
                </div>
            ))}
        </div>
    );
}

function UnconnectedBreakdownList(props: IProps) {
    const { data, dataBreakdown } = props;

    const [filter, setFilter] = React.useState("");

    if (data === undefined) {
        return <div className={styles.breakdownListContainer} />;
    }

    const updateFilterValue = (event: React.ChangeEvent<HTMLInputElement>) => setFilter(event.currentTarget.value);

    return (
        <div className={styles.breakdownListContainer}>
            <div className={styles.filterContainer}>
                <InputGroup leftIcon="search" onChange={updateFilterValue} value={filter} />
                <div className={styles.columnHeaders}>
                    <div>Name</div>
                    <div>Total cases</div>
                </div>
            </div>
            {renderDataBreakdown(
                dataBreakdown
                    .sort((a, b) => (a.dataPoint.totalCases > b.dataPoint.totalCases ? -1 : 1))
                    .filter(breakdown => breakdown.name.toLowerCase().includes(filter.toLowerCase())),
                props,
            )}
        </div>
    );
}

function mapStateToProps(state: IStoreState): IStateProps {
    return {
        geography: state.interface.geography,
        data: maybeGetDataForGeography(state),
        deviceType: state.interface.deviceType,
        dataBreakdown: getDataBreakdown(state),
    };
}

function mapDispatchToProps(dispatch: Dispatch): IDispatchProps {
    return {
        ...bindActionCreators(
            {
                updateGeography: UPDATE_GEOGRAPHY.create,
            },
            dispatch,
        ),
        backToNation: () => dispatch(UPDATE_GEOGRAPHY.create(IGeography.nationGeography())),
    };
}

export const BreakdownList = connect(mapStateToProps, mapDispatchToProps)(UnconnectedBreakdownList);
