import { IInterfaceState, EMPTY_INTERFACE_STATE } from "./interface/reducer";
import { IApplicationState, EMPTY_APPLICATION_STATE } from "./application/reducer";

export interface IStoreState {
    interface: IInterfaceState;
    application: IApplicationState;
}

export const EMPTY_STATE: IStoreState = {
    interface: EMPTY_INTERFACE_STATE,
    application: EMPTY_APPLICATION_STATE,
};
