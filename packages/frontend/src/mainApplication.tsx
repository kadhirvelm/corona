import * as React from "react";
import { IVirusData, CoronaService, STATE } from "@corona/api";
import styles from "./mainApplication.module.scss";

interface IState {
    data: IVirusData | undefined;
}

export class MainApplication extends React.PureComponent<{}, IState> {
    public state: IState = {
        data: undefined,
    };

    public async componentDidMount() {
        await CoronaService.getStateData.frontend(STATE.CALIFORNIA);
        const data = await CoronaService.getUnitedStatesData.frontend({});
        this.setState({ data });
    }

    public render() {
        const { data } = this.state;
        return (
            <div>
                Total cases: {data?.total}
                {this.maybeRenderList()}
            </div>
        );
    }

    private maybeRenderList() {
        const { data } = this.state;
        return (
            <div className={styles.valueContainer}>
                {Object.keys(data?.breakdown ?? {}).map(state => (
                    <span>
                        {state}
                        {data?.breakdown[state]}
                    </span>
                ))}
            </div>
        );
    }
}
