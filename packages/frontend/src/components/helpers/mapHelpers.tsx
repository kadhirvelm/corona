import * as React from "react";
import { Legend } from "./legend";
import styles from "./mapHelpers.module.scss";
import { MapColoringSelection } from "./mapColoringSelection";

interface IProps {
    range: number[];
}

export function MapHelpers(props: IProps) {
    const { range } = props;

    return (
        <div className={styles.mapHelpersContainer}>
            <Legend range={range} />
            <MapColoringSelection />
        </div>
    );
}
