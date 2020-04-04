import { NonIdealState } from "@blueprintjs/core";
import * as React from "react";
import { connect } from "react-redux";
import { BasicInfo, BreakdownList, GrowthCurve, VirusDataRenderer } from "../components";
import { CurrentPath } from "../components/helpers/currentPath";
import { IStoreState } from "../store";
import styles from "./tabletOrMobile.module.scss";

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
                <CurrentPath />
                <div className={styles.leftContainer}>
                    <BreakdownList />
                </div>
                <div className={styles.rightContainer}>
                    {maybeRenderNonIdealState()}
                    <GrowthCurve />
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
