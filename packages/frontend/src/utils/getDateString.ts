export function getDateTimeString(date?: string | undefined | null) {
    if (date == null) {
        return "N/A";
    }

    console.log(date);

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
