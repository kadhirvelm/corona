import * as React from "react";
import { ICoronaBreakdown, ICoronaDataPoint } from "@corona/api";
import { connect } from "react-redux";
import { InputGroup, Button } from "@blueprintjs/core";
import { Dispatch, bindActionCreators } from "redux";
import classNames from "classnames";
import { IStoreState, maybeGetDataForGeography, getSortedDataBreakdown, UPDATE_GEOGRAPHY } from "../../store";
import styles from "./breakdownList.module.scss";
import { IGeography, IDataBreakdown, IDeviceType, IDevice } from "../../typings";

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
        if (IGeography.isNationGeography(geography)) {
            updateGeography(
                IGeography.stateGeography({
                    fipsCode: dataPoint.fipsCode,
                    name: dataPoint.state ?? "Unknown state",
                }),
            );
        }

        if (IGeography.isStateGeography(geography)) {
            updateGeography(
                IGeography.countyGeography({
                    countyStateGeography: geography,
                    fipsCode: dataPoint.fipsCode,
                    name: dataPoint.county ?? "Unknown county",
                }),
            );
        }

        if (IGeography.isCountyGeography(geography)) {
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

function UnconnectedBreakdownList(props: IProps) {
    const [filter, setFilter] = React.useState("");

    const { data, dataBreakdown, backToNation, geography } = props;
    if (data === undefined) {
        return <div className={styles.breakdownListContainer} />;
    }

    const updateFilterValue = (event: React.ChangeEvent<HTMLInputElement>) => setFilter(event.currentTarget.value);

    return (
        <div className={styles.breakdownListContainer}>
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
            {renderDataBreakdown(
                dataBreakdown.filter(breakdown => breakdown.name.toLowerCase().includes(filter.toLowerCase())),
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
        dataBreakdown: getSortedDataBreakdown(state),
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
