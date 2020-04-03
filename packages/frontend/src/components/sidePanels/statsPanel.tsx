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
    SET_DEEP_DIVE_FIPS_CODE,
    SET_BASIC_INFO_FIPS,
    REMOVE_BASIC_INFO_FIPS,
} from "../../store";
import styles from "./statsPanel.module.scss";
import { IGeography, IDataBreakdown, IDeviceType, IDevice } from "../../typings";

interface IStateProps {
    geography: IGeography;
    data: ICoronaBreakdown | undefined;
    deviceType: IDeviceType | undefined;
    dataBreakdown: IDataBreakdown[];
    deepDiveFipsCode: string | undefined;
}

interface IDispatchProps {
    backToNation: () => void;
    setDeepDiveFipsCode: (fipsCode: string | undefined) => void;
    setBasicInfoFips: (fipsCode: string | undefined) => void;
    removeBasicInfoFips: (fipsCode: string | undefined) => void;
}

type IProps = IStateProps & IDispatchProps;

function renderDataBreakdown(
    dataBreakdown: IDataBreakdown[],
    filter: string,
    deviceType: IDeviceType | undefined,
    fips: {
        deepDiveFipsCode: string | undefined;
        setDeepDiveFipsCode: (fipsCode: string | undefined) => void;
        setBasicInfoFips: (fipsCode: string | undefined) => void;
        removeBasicInfoFips: (fipsCode: string | undefined) => void;
    },
) {
    const isMobileOrTablet = IDevice.isMobile(deviceType) || IDevice.isTablet(deviceType);

    const handleClick = (fipsCode: string) => () => {
        if (fips.deepDiveFipsCode === fipsCode) {
            fips.setDeepDiveFipsCode(undefined);
        } else {
            fips.setDeepDiveFipsCode(fipsCode);
        }

        if (fips.deepDiveFipsCode === fipsCode && isMobileOrTablet) {
            fips.removeBasicInfoFips(fipsCode);
        } else if (isMobileOrTablet) {
            fips.setBasicInfoFips(fipsCode);
        }
    };

    return (
        <div className={classNames(styles.caseBreakdownContainer, { [styles.browser]: IDevice.isBrowser(deviceType) })}>
            {dataBreakdown
                .filter(breakdown => breakdown.name.toLowerCase().includes(filter.toLowerCase()))
                .map(breakdown => (
                    <div
                        className={classNames(styles.singleBreakdown, {
                            [styles.isOpen]: fips.deepDiveFipsCode === breakdown.dataPoint.fipsCode,
                            [styles.browser]: IDevice.isBrowser(deviceType),
                        })}
                        onClick={handleClick(breakdown.dataPoint.fipsCode)}
                    >
                        <span className={styles.text}>{breakdown.name}</span>
                        <span className={styles.text}>{breakdown.dataPoint.totalCases.toLocaleString()}</span>
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
        deviceType,
        backToNation,
        geography,
        deepDiveFipsCode,
        setDeepDiveFipsCode,
        setBasicInfoFips,
        removeBasicInfoFips,
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
            {renderDataBreakdown(dataBreakdown, filter, deviceType, {
                deepDiveFipsCode,
                setDeepDiveFipsCode,
                setBasicInfoFips,
                removeBasicInfoFips,
            })}
        </div>
    );
}

function mapStateToProps(state: IStoreState): IStateProps {
    return {
        geography: state.interface.geography,
        data: maybeGetDataForGeography(state),
        deviceType: state.interface.deviceType,
        dataBreakdown: getSortedDataBreakdown(state),
        deepDiveFipsCode: state.interface.deepDiveFipsCode,
    };
}

function mapDispatchToProps(dispatch: Dispatch): IDispatchProps {
    return {
        ...bindActionCreators(
            {
                setDeepDiveFipsCode: SET_DEEP_DIVE_FIPS_CODE.create,
                setBasicInfoFips: SET_BASIC_INFO_FIPS.create,
                removeBasicInfoFips: REMOVE_BASIC_INFO_FIPS.create,
            },
            dispatch,
        ),
        backToNation: () => dispatch(UPDATE_GEOGRAPHY.create(IGeography.nationGeography())),
    };
}

export const StatsPanel = connect(mapStateToProps, mapDispatchToProps)(UnconnectedStatsPanel);
