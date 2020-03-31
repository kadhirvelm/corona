import * as React from "react";
import classNames from "classnames";
import styles from "./transitioner.module.scss";

interface IProps extends React.Props<{}> {
    className?: string;
    show: boolean;
}

export function Transitioner(props: IProps) {
    const { children, className, show } = props;

    const [shouldRender, setRender] = React.useState(false);

    React.useEffect(() => {
        if (show) {
            setRender(true);
        }
    }, [show]);

    const onAnimationEnd = () => {
        if (!show) {
            setRender(false);
        }
    };

    if (!shouldRender) {
        return null;
    }

    return (
        <div
            className={classNames({ [styles.fadeIn]: show, [styles.fadeOut]: !show }, className)}
            onAnimationEnd={onAnimationEnd}
        >
            {children}
        </div>
    );
}
