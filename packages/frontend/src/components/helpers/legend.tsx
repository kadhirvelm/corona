import * as React from "react";
import styles from "./legend.module.scss";
import { getNumberTextForLegend } from "../../utils";

interface IProps {
    range: number[];
}

export function Legend(props: IProps) {
    const { range } = props;

    return (
        <div className={styles.legendContainer}>
            <div className={styles.legend} />
            <div className={styles.legendTicks}>
                {range.map(num => (
                    <span key={num}>{getNumberTextForLegend(num)}</span>
                ))}
            </div>
        </div>
    );
}
