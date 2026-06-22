export const formatDayLabel = (time) => {
    if (!time) return "";

    const msgDate = new Date(time);
    const today = new Date();
    const yesterday = new Date();

    yesterday.setDate(today.getDate() - 1);

    if (msgDate.toDateString() === today.toDateString()) {
        return "Today";
    }

    if (msgDate.toDateString() === yesterday.toDateString()) {
        return "Yesterday";
    }

    return msgDate.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};
