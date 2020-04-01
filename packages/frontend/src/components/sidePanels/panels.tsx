import * as React from "react";
import { StatsPanel } from "./statsPanel";
import { DeepDivePanel } from "./deepDivePanel";
import styles from "./panels.module.scss";

export function Panels() {
    return (
        <div className={styles.panelContainer}>
            <StatsPanel />
            <DeepDivePanel />
        </div>
    );
}
