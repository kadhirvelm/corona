export function getNumberTextForLegend(num: number) {
    const rounded = Math.round(num / 1000) * 1000;
    if (rounded === 0) {
        return rounded;
    }

    return `${Math.abs(rounded) / 1000}k`;
}
