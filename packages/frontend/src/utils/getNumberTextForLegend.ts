export function getNumberTextForLegend(num: number) {
    if (num < 1000) {
        return Math.round(num);
    }

    const rounded = Math.round(num / 1000) * 1000;
    return `${Math.abs(rounded) / 1000}k`;
}
