import * as React from "react";
import styles from "./stats.module.scss";
import { BasicInfo } from "./statsHelpers/basicInfo";

export function Stats() {
    return (
        <div className={styles.statsContainer}>
            <BasicInfo />
        </div>
    );
}
