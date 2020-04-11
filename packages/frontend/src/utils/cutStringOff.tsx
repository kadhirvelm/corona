import * as React from "react";

export function cutStringOff(str: string, maxCharacters: number) {
    if (str.length < maxCharacters) {
        return str;
    }

    return <span title={str}>{`${str.slice(0, maxCharacters)}…`}</span>;
}
