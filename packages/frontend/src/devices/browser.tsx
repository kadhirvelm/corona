import classNames from "classnames";
import * as React from "react";
import { PanelContainer, VirusDataRenderer } from "../components";
import { MapColoringSelection } from "../components/helpers/mapColoringSelection";
import { Information } from "../components/information/information";
import styles from "./browser.module.scss";

export class Browser extends React.PureComponent {
    public render() {
        return (
            <div className={classNames(styles.browserContainer, "browser")}>
                <div className={styles.panelContainer}>
                    <PanelContainer />
                </div>
                <VirusDataRenderer />
                <MapColoringSelection />
                <Information className={styles.infoContainer} />
            </div>
        );
    }
}
