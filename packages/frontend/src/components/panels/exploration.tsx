import * as React from "react";
import { connect } from "react-redux";
import { IDeviceType, IDevice } from "../../typings";
import { IStoreState } from "../../store";
import { GrowthCurve } from "./statsHelpers/growthCurve";
import styles from "./exploration.module.scss";

interface IStateProps {
    deviceType: IDeviceType | undefined;
}

type IProps = IStateProps;

function UnconnectedExploration(props: IProps) {
    const { deviceType } = props;

    return (
        <div className={styles.explorationContainer}>
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

export const Exploration = connect(mapStateToProps)(UnconnectedExploration);
