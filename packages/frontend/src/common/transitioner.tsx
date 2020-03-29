import * as React from "react";
import classNames from "classnames";
import styles from "./transitioner.module.scss";

interface IProps extends React.Props<{}> {
    show: boolean;
}

export function Transitioner(props: IProps) {
    const { children, show } = props;

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
        <div className={classNames({ [styles.fadeIn]: show, [styles.fadeOut]: !show })} onAnimationEnd={onAnimationEnd}>
            {children}
        </div>
    );
}
