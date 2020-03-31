import * as React from "react";
import { Legend } from "./legend";
import styles from "./mapHelpers.module.scss";
import { HoveringOverFeatureInfo } from "./hoveringOverFeatureInfo";

interface IProps {
    range: number[];
}

export function MapHelpers(props: IProps) {
    const { range } = props;

    return (
        <div className={styles.mapHelpersContainer}>
            <Legend range={range} />
            <HoveringOverFeatureInfo />
        </div>
    );
}
