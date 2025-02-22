/**
 * Returns whether a space is open or closed based on its timings.
 * @param {Object} timings - The timings object for the space.
 * @returns {string} - "Open" or "Closed"
 */

export const checkIfOpen = (timings) => {
  if (!timings) return "Closed";

  const [start, end] = timings.split(" - ");

  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes(); // Convert to minutes

  const [startHours, startMinutes] = start.split(":").map(Number);
  const [endHours, endMinutes] = end.split(":").map(Number);
  const startTime = startHours * 60 + startMinutes;
  const endTime = endHours * 60 + endMinutes;

  return currentTime >= startTime && currentTime <= endTime ? "Open" : "Closed";
};

/**
 * Adds a highlighting effect to a space's card when clicked on the map.
 * @param {Object} space - The space object containing name and timings.
 */
export const highlightSpaceCard = (space) => {
  document
    .querySelectorAll(".outer-card")
    .forEach((el) => el.classList.remove("highlighted"));

  const cardId = `card-${space.name.replace(/\s+/g, "-")}`;
  const cardEl = document.getElementById(cardId);
  if (!cardEl) return;

  const status = checkIfOpen(space.timings);
  const highlightClass =
    status === "Closed" ? "highlighted-closed" : "highlighted-open";

  cardEl.classList.add(highlightClass);
  setTimeout(() => cardEl.classList.remove(highlightClass), 1500);
  cardEl.scrollIntoView({ behavior: "smooth", block: "start" });
};

/**
 * Attempts to get the user's location via geolocation API;
 * if that fails, falls back to IP-based geolocation.
 *
 * @returns {Promise<[number, number]>} Promise resolving to [latitude, longitude]
 */
export async function getUserLocation() {
  // 1) Try HTML5 Geolocation
  if ("geolocation" in navigator) {
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000, // 10 seconds
        });
      });
      const { latitude, longitude } = position.coords;
      console.log("Geolocation successful:", latitude, longitude);
      return [latitude, longitude];
    } catch (err) {
      console.warn("Geolocation permission denied or error:", err);
      // proceed to IP-based fallback
    }
  }

  // 2) Fallback: IP-based geolocation
  try {
    const response = await fetch("https://ipapi.co/json");
    const data = await response.json();
    if (data && data.latitude && data.longitude) {
      console.log(
        "IP-based geolocation successful:",
        data.latitude,
        data.longitude
      );
      return [data.latitude, data.longitude];
    } else {
      console.warn("IP-based geolocation failed; missing lat/lng in response.");
      return [0, 0]; // fallback coords
    }
  } catch (error) {
    console.error("Error using IP-based geolocation:", error);
    // If all else fails, return a default location (e.g., center of campus)
    return [49.80958, -97.13283];
  }
}

/**
 * Fetches the current weather (temp in Celsius + icon) based on the user's IP-based city.
 * @returns {Promise<{ tempC: number, icon: string }>} Weather data (temperature in °C and icon code)
 */
export async function fetchWeather() {
  const API_KEY = "a1321a705a5d2ebee71f51cd279649e1";
  let cityName = "Winnipeg"; // Default fallback city

  try {
    // 🌍 Fetch user's city using IP-based geolocation
    const geoResponse = await fetch("https://ipapi.co/json");
    if (geoResponse.ok) {
      const geoData = await geoResponse.json();
      if (geoData.city) cityName = geoData.city;
    } else {
      console.warn("Failed to fetch city from IP geolocation.");
    }
  } catch (error) {
    console.error("Error fetching city from IP geolocation:", error);
  }

  try {
    // 🌡️ Fetch weather data using detected city
    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${API_KEY}`
    );

    if (!weatherResponse.ok) {
      throw new Error(`Weather fetch failed: ${weatherResponse.status}`);
    }

    const weatherData = await weatherResponse.json();
    return {
      tempC: Math.round(weatherData.main.temp), // Temperature in °C (rounded)
      icon: weatherData.weather[0].icon, // Weather icon code (e.g., "10d")
    };
  } catch (error) {
    console.error("Error fetching weather:", error);
    return { tempC: null, icon: null }; // Fallback in case of failure
  }
}
