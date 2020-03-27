import { IVirusData } from "@corona/api";
import * as React from "react";
import { USMap } from "./usMap";

interface IProps {
    getData: () => Promise<IVirusData>;
    onItemClick: (item: string) => void;
}

export function VirusDataRenderer(props: IProps) {
    const [data, setData] = React.useState<IVirusData | undefined>(undefined);

    React.useEffect(() => {
        const { getData } = props;
        getData().then(setData);
    }, []);

    if (data === undefined) {
        return null;
    }

    return <USMap data={data} />;
}
