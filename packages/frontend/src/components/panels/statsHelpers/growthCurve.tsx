import { NonIdealState } from "@blueprintjs/core";
import { ICoronaDataPoint } from "@corona/api";
import * as React from "react";
import { connect } from "react-redux";
import { getCurrentCoronaDataPointFromGeography, IStoreState } from "../../../store";
import { TimeSeries } from "../../visualization";
import styles from "./growthCurve.module.scss";

interface IStateProps {
    dataPointForGrowthCurve: ICoronaDataPoint | undefined;
}

type IProps = IStateProps;

function UnconnectedGrowthCurve(props: IProps) {
    const { dataPointForGrowthCurve } = props;

    const maybeRenderGrowthCurve = () => {
        if (dataPointForGrowthCurve?.timeseries === undefined) {
            return <NonIdealState description="No timeseries data available" />;
        }

        return <TimeSeries timeseries={dataPointForGrowthCurve?.timeseries} />;
    };

    return (
        <div className={styles.growthCurveContainer} key={dataPointForGrowthCurve?.fipsCode}>
            {maybeRenderGrowthCurve()}
        </div>
    );
}

function mapStateToProps(state: IStoreState): IStateProps {
    return {
        dataPointForGrowthCurve: getCurrentCoronaDataPointFromGeography(state),
    };
}

export const GrowthCurve = connect(mapStateToProps)(UnconnectedGrowthCurve);
