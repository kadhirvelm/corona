import classNames from "classnames";
import * as React from "react";
import { PanelContainer, VirusDataRenderer } from "../components";
import { MapColoringSelection } from "../components/helpers/mapColoringSelection";
import { Information } from "../components/information/information";
import styles from "./tabletOrMobile.module.scss";

export function TabletOrMobile() {
    return (
        <div className={classNames(styles.tabletContainer, "mobile")}>
            <div className={styles.mapContainer}>
                <VirusDataRenderer />
                <MapColoringSelection />
                <Information className={styles.information} />
            </div>
            <div className={styles.statsContainer}>
                <PanelContainer />
            </div>
        </div>
    );
}
