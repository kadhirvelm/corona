import * as React from "react";
import { connect } from "react-redux";
import { NonIdealState } from "@blueprintjs/core";
import { StatsPanel, VirusDataRenderer, DeepDivePanel, BasicInfo } from "../components";
import styles from "./tabletOrMobile.module.scss";
import { IStoreState } from "../store";

interface IStateProps {
    deepDiveFipsCode: string | undefined;
}

type IProps = IStateProps;

function UnconnectedTabletOrMobile(props: IProps) {
    const { deepDiveFipsCode } = props;

    const maybeRenderNonIdealState = () => {
        if (deepDiveFipsCode !== undefined) {
            return null;
        }
        return <NonIdealState icon="search" description="Use the panel to the left to see more details." />;
    };

    return (
        <div className={styles.tabletContainer}>
            <div className={styles.mapContainer}>
                <VirusDataRenderer />
            </div>
            <div className={styles.statsContainer}>
                <div className={styles.leftContainer}>
                    <StatsPanel />
                </div>
                <div className={styles.rightContainer}>
                    {maybeRenderNonIdealState()}
                    <DeepDivePanel />
                    <div className={styles.basicInfoContainer}>
                        <BasicInfo />
                    </div>
                </div>
            </div>
        </div>
    );
}

function mapStateToProps(state: IStoreState): IStateProps {
    return {
        deepDiveFipsCode: state.interface.deepDiveFipsCode,
    };
}

export const TabletOrMobile = connect(mapStateToProps)(UnconnectedTabletOrMobile);
