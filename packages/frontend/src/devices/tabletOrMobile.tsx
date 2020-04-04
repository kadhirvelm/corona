import * as React from "react";
import { debounce } from "lodash-es";
import { v4 } from "uuid";
import { PanelContainer, VirusDataRenderer } from "../components";
import styles from "./tabletOrMobile.module.scss";

let temporaryWindowHeight = 0;
let temporaryWindowWidth = 0;

export function TabletOrMobile() {
    const [resizeId, setResizeId] = React.useState(v4());

    const handleResize = () => {
        if (window.innerHeight > temporaryWindowHeight * 1.1 && window.innerWidth > temporaryWindowWidth * 1.1) {
            setResizeId(v4());
        } else {
            temporaryWindowHeight = window.innerHeight;
            temporaryWindowWidth = window.innerWidth;
        }
    };

    const debounceResize = debounce(handleResize, 500);

    React.useEffect(() => {
        temporaryWindowHeight = window.innerHeight;
        window.addEventListener("resize", debounceResize);

        return () => {
            window.removeEventListener("resize", debounceResize);
        };
    });

    return (
        <div className={styles.tabletContainer} key={resizeId}>
            <div className={styles.mapContainer}>
                <VirusDataRenderer />
            </div>
            <div className={styles.statsContainer}>
                <PanelContainer />
            </div>
        </div>
    );
}
