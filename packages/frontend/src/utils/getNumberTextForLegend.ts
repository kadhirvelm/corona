export function getNumberTextForLegend(num: number) {
    if (num === 0) {
        return 0;
    }

    // NOTE: this is for infection rate percents
    if (num < 1) {
        return (num * 100).toFixed(3);
    }

    if (num < 1000) {
        return Math.round(num);
    }

    const rounded = Math.round(num / 1000) * 1000;
    return `${Math.abs(rounded) / 1000}k`;
}
