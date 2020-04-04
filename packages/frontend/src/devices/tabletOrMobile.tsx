import * as React from "react";
import { PanelContainer, VirusDataRenderer } from "../components";
import styles from "./tabletOrMobile.module.scss";

export function TabletOrMobile() {
    return (
        <div className={styles.tabletContainer}>
            <div className={styles.mapContainer}>
                <VirusDataRenderer />
            </div>
            <div className={styles.statsContainer}>
                <PanelContainer />
            </div>
        </div>
    );
}
