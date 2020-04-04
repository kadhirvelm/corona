import * as React from "react";
import { BasicInfo } from "./statsHelpers/basicInfo";
import { GrowthCurve } from "./statsHelpers/growthCurve";
import styles from "./stats.module.scss";

export function Stats() {
    return (
        <div className={styles.statsContainer}>
            <BasicInfo />
            <GrowthCurve />
        </div>
    );
}
