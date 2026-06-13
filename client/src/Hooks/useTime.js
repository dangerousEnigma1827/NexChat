import { useCallback } from "react";

export default function useTime() {

    const formatTime = useCallback((time) => {
        if (!time) return "";

        const diff = Date.now() - new Date(time).getTime();

        // < 24 hours → show time
        if (diff < 24 * 60 * 60 * 1000) {
            return new Date(time).toLocaleTimeString([], {
                hour: "numeric",
                minute: "2-digit",
            });
        }

        // < 48 hours → yesterday
        if (diff < 2 * 24 * 60 * 60 * 1000) {
            return "Yesterday";
        }

        // older → date
        return new Date(time).toLocaleDateString([], {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });

    }, []);

    return { formatTime };
}