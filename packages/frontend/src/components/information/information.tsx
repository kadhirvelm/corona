import * as React from "react";
import { Dialog, Button, Classes } from "@blueprintjs/core";
import classNames from "classnames";
import styles from "./information.module.scss";

function getInformationContent() {
    return (
        <div className={Classes.DIALOG_BODY}>
            <div className={styles.data}>
                The data is sourced from <a href="https://coronadatascraper.com/#home">Corona Data Scraper</a>,{" "}
                <a href="https://coronavirus-disasterresponse.hub.arcgis.com/#get-data">Arcgis</a>,{" "}
                <a href="https://covid19.healthdata.org/projections">Covid 19 Healthdata</a>,{" "}
                <a href="https://github.com/nytimes/covid-19-data">The NY Times</a>,{" "}
                <a href="https://covidtracking.com/data">The Covid Tracking Project</a>,{" "}
                <a href="https://usafacts.org/visualizations/coronavirus-covid-19-spread-map/">USA Facts</a>, from
                health agency websites, county and state websites, executive orders, and the CDC. It is updated every 3
                hours.
            </div>
            <div className={styles.contact}>
                If you spot any issues, have feature requests, more data sources, or would like to just chat, please
                email us at <a href="mailto:covid19.map.2020@gmail.com">covid19.map.2020@gmail.com</a>.
            </div>
            <div className={styles.legal}>
                This website hereby disclaims any and all representations and warranties with respect to the
                visualizations and underlying data, including accuracy, fitness for use, and merchantability. Reliance
                on the website for medical guidance is strictly prohibited.
            </div>
        </div>
    );
}

interface IProps {
    className?: string;
    dialogClassName?: string;
    text?: string;
}

export function Information(props: IProps) {
    const { className, dialogClassName, text } = props;

    const [isOpen, setOpen] = React.useState(false);

    const close = () => setOpen(false);
    const open = () => setOpen(true);

    return (
        <>
            <Dialog
                className={classNames(dialogClassName)}
                icon="info-sign"
                isOpen={isOpen}
                onClose={close}
                title="Information"
            >
                {getInformationContent()}
            </Dialog>
            <Button
                className={classNames(styles.infoIcon, className)}
                icon="info-sign"
                text={text}
                minimal
                onClick={open}
            />
        </>
    );
}
