import React, { useState, useEffect } from "react";
import "./Date.css";
import { fetchWeather } from "../../helperFunctions/mapHelpers";

function DateComponent() {
  const [currentDate, setCurrentDate] = useState("");
  const [tempC, setTempC] = useState(null);
  const [weatherIcon, setWeatherIcon] = useState(null);

  useEffect(() => {
    // Function to update date and time
    const updateDate = () => {
      const today = new Date();
      const formattedDate = today.toLocaleDateString("en-US", {
        weekday: "short", // "Sat"
        month: "short", // "Feb"
        day: "2-digit", // "22"
      });

      // ⏰ Format: "7:32:31 AM"
      const formattedTime = today.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        hour12: true, // Use 12-hour format
      });

      // Combine date and time
      setCurrentDate(`${formattedDate} - ${formattedTime}`);
    };

    // Update every second
    const interval = setInterval(updateDate, 1000);

    updateDate();

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  useEffect(() => {
    // Call fetchWeather once on mount (or if city changes)
    fetchWeather() // or any city, e.g. "Toronto"
      .then((weather) => {
        if (weather.tempC !== null) {
          setTempC(weather.tempC);
        }
        if (weather.icon) {
          setWeatherIcon(weather.icon);
        }
      })
      .catch((err) => {
        console.error("Error in weather effect:", err);
      });
  }, []);

  return (
    <div className="date">
      <div className="time"> {currentDate}</div>
      <div className="temp">
        {/* If tempC is null, display "..." or something */}
        {tempC !== null ? `${tempC}°C` : "..."}
        {weatherIcon && (
          <img
            src={`https://openweathermap.org/img/wn/${weatherIcon}@2x.png`}
            alt="Weather Icon"
          />
        )}
      </div>
    </div>
  );
}

export default DateComponent;
