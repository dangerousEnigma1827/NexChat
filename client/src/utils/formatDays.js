import { useCallback } from "react";

export default function useTimeForDays() {

    const formatTime = useCallback((time) => {
        if (!time) return "";

        const msgDate = new Date(time);
        const today = new Date();
        const yesterday = new Date();

        yesterday.setDate(today.getDate() - 1);

        // compare calendar dates
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
    }, []);

    return { formatTime };
}