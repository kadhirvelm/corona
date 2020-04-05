import * as React from "react";
import { connect } from "react-redux";
import { NonIdealState } from "@blueprintjs/core";
import { BasicInfo } from "./statsHelpers/basicInfo";
import { GrowthCurve } from "./statsHelpers/growthCurve";
import styles from "./stats.module.scss";
import { IDeviceType, IDevice } from "../../typings";
import { IStoreState } from "../../store";

interface IStateProps {
    deviceType: IDeviceType | undefined;
}

type IProps = IStateProps;

function UnconnectedStats(props: IProps) {
    const { deviceType } = props;

    return (
        <div className={styles.statsContainer}>
            <BasicInfo />
            <div className={styles.divider} />
            {IDevice.isBrowser(deviceType) ? (
                <GrowthCurve />
            ) : (
                <div className={styles.growthCurveNonIdeal}>View on a browser to see growth curves.</div>
            )}
        </div>
    );
}

function mapStateToProps(state: IStoreState): IStateProps {
    return {
        deviceType: state.interface.deviceType,
    };
}

export const Stats = connect(mapStateToProps)(UnconnectedStats);
