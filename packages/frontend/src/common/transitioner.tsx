import * as React from "react";
import classNames from "classnames";
import { clone } from "lodash-es";
import styles from "./transitioner.module.scss";

interface IProps<T = {}> extends React.Props<{}> {
    className?: string;
    show: boolean;
    transitionProps: T;
    children: (props: T | undefined) => React.ReactNode;
}

export function Transitioner<T = {}>(props: IProps<T>) {
    const { children, className, show, transitionProps } = props;

    const [renderOptions, setRender] = React.useState<{ shouldRender: Boolean; transitionProps: T | undefined }>({
        shouldRender: false,
        transitionProps: undefined,
    });

    React.useEffect(() => {
        if (show) {
            setRender({ shouldRender: true, transitionProps: clone(transitionProps) });
        }
    }, [show]);

    const onAnimationEnd = () => {
        if (!show) {
            setRender({ shouldRender: false, transitionProps: undefined });
        }
    };

    if (!renderOptions.shouldRender) {
        return null;
    }

    return (
        <div
            className={classNames({ [styles.fadeIn]: show, [styles.fadeOut]: !show }, className)}
            onAnimationEnd={onAnimationEnd}
        >
            {children(transitionProps ?? renderOptions.transitionProps)}
        </div>
    );
}
