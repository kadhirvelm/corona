import * as React from "react";
import { IVirusData } from "@corona/api";
import { convertTwoLetterCodeToState } from "@corona/utils";
import styles from "./virusDataRenderer.module.scss";

interface IProps {
    getData: () => Promise<IVirusData>;
    onItemClick: (item: string) => void;
}

function maybeRenderList(data: IVirusData | undefined, handleClick: (item: string) => () => void) {
    return (
        <div className={styles.valueContainer}>
            {Object.keys(data?.breakdown ?? {}).map(twoLetterCode => (
                <span onClick={handleClick(convertTwoLetterCodeToState(twoLetterCode))}>
                    {convertTwoLetterCodeToState(twoLetterCode)} – {data?.breakdown[twoLetterCode].cases}
                </span>
            ))}
        </div>
    );
}

export function VirusDataRenderer(props: IProps) {
    const [data, setData] = React.useState<IVirusData | undefined>(undefined);

    React.useEffect(() => {
        const { getData } = props;
        getData().then(setData);
    }, []);

    const handleClick = (item: string) => () => {
        const { onItemClick } = props;
        onItemClick(item);
    };

    return (
        <div>
            Total cases: {data?.total}
            {maybeRenderList(data, handleClick)}
        </div>
    );
}
