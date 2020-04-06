import { debounce } from "lodash-es";
import * as React from "react";
import { v4 } from "uuid";
import classNames from "classnames";
import { PanelContainer, VirusDataRenderer } from "../components";
import styles from "./browser.module.scss";
import { Information } from "../components/information/information";

interface IState {
    resizeId: string;
}

export class Browser extends React.PureComponent<{}, IState> {
    public state: IState = {
        resizeId: v4(),
    };

    private debounceResize: () => void;

    public constructor(props: {}, context: any) {
        super(props, context);
        this.debounceResize = debounce(this.handleResize, 500);
    }

    public componentDidMount() {
        window.addEventListener("resize", this.debounceResize);
    }

    public componentWillUnmount() {
        window.removeEventListener("resize", this.debounceResize);
    }

    public render() {
        const { resizeId } = this.state;

        return (
            <div className={classNames(styles.browserContainer, "browser")} key={resizeId}>
                <div className={styles.panelContainer}>
                    <PanelContainer />
                </div>
                <VirusDataRenderer />
                <Information className={styles.infoContainer} text="About" />
            </div>
        );
    }

    private handleResize = () => this.setState({ resizeId: v4() });
}
