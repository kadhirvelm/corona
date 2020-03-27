import { STATE } from "@corona/api";

const VALID_STATES = Object.values(STATE).map(state => state.toLowerCase());

export function isValidState(stateString: string): stateString is STATE {
    return VALID_STATES.includes(stateString.toLowerCase() as STATE);
}
