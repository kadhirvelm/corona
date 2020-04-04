import * as React from "react";
import { Dispatch, bindActionCreators } from "redux";
import { connect } from "react-redux";
import { IGeography } from "../../typings";
import { IStoreState, UPDATE_GEOGRAPHY } from "../../store";

interface IStateProps {
    geography: IGeography;
}

interface IDispatchProps {
    updateGeography: (newGeography: IGeography) => void;
}

type IProps = IStateProps & IDispatchProps;

function UnconnectedCurrentPath(props: IProps) {
    const { geography } = props;

    if (IGeography.isNationGeography(geography)) {
        return <div>United states</div>;
    }

    if (IGeography.isStateGeography(geography)) {
        return <div>United states &gt; {geography.name}</div>;
    }

    return (
        <div>
            United states &gt; {geography.stateGeography.name} &gt; {geography.name}
        </div>
    );
}

function mapStateToProps(state: IStoreState): IStateProps {
    return {
        geography: state.interface.geography,
    };
}

function mapDispatchToProps(dispatch: Dispatch): IDispatchProps {
    return bindActionCreators(
        {
            updateGeography: UPDATE_GEOGRAPHY.create,
        },
        dispatch,
    );
}

export const CurrentPath = connect(mapStateToProps, mapDispatchToProps)(UnconnectedCurrentPath);
