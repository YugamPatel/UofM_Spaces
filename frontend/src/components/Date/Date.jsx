import React, { useState, useEffect } from "react";
import "./Date.css"
function DateComponent() {
    const [currentDate, setCurrentDate] = useState("");

    useEffect(() => {
        // Function to update date and time
        const updateDate = () => {
            const today = new Date();
            const formattedDate = today.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
            });
            const formattedTime = today.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true, // Use 12-hour format
            });

            setCurrentDate(`${formattedDate} - ${formattedTime}`);
        };

        // Update every second
        const interval = setInterval(updateDate, 1000);
        
        // Run once immediately to avoid waiting 1s for the first update
        updateDate();

        return () => clearInterval(interval); // Cleanup interval on unmount
    }, []);

    return <h4 className="date">{currentDate}</h4>;
}

export default DateComponent;
