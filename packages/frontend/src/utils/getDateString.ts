export function getDateTimeString(date?: string | undefined | null) {
    // eslint-disable-next-line no-restricted-globals
    if (date == null || isNaN(Date.parse(date).valueOf())) {
        return "N/A";
    }

    return new Intl.DateTimeFormat("en-US", {
        year: "2-digit",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
    }).format(new Date(date));
}

export function getDateString(date?: Date | null) {
    if (date == null) {
        return "N/A";
    }

    return new Intl.DateTimeFormat("en-US", {
        year: "2-digit",
        month: "numeric",
        day: "numeric",
    }).format(date);
}
