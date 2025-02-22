/**
 * Returns whether a space is open or closed based on its timings.
 * @param {Object} timings - The timings object for the space.
 * @returns {string} - "Open" or "Closed"
 */

// export const checkIfOpen = (timings) => {
//   if (!timings) return "Closed";

//   const [start, end] = timings.split(" - ");

//   const now = new Date();
//   const currentTime = now.getHours() * 60 + now.getMinutes(); // Convert to minutes

//   const [startHours, startMinutes] = start.split(":").map(Number);
//   const [endHours, endMinutes] = end.split(":").map(Number);
//   const startTime = startHours * 60 + startMinutes;
//   const endTime = endHours * 60 + endMinutes;

//   return currentTime >= startTime && currentTime <= endTime ? "Open" : "Closed";
// };

export const checkIfOpen = (timings) => {
  if (!timings) return "Closed";

  // Get current date and time
  const now = new Date();
  const currentDay = now.toLocaleDateString("en-US", { weekday: "long" }); // Example: "Monday"
  const currentTime = now.getHours() * 60 + now.getMinutes(); // Convert to minutes

  // Convert timings to an array of lines
  const timingLines = timings.split("\n");

  for (let line of timingLines) {
      let [dayRange, timeRange] = line.split(" : ").map((item) => item.trim());

      if (!timeRange || timeRange.toLowerCase() === "closed") {
          continue; // Skip closed days
      }

      // Handle different day types
      if (
          (dayRange === "Weekdays" && ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].includes(currentDay)) ||
          (dayRange === "Saturday" && currentDay === "Saturday") ||
          (dayRange === "Sunday" && currentDay === "Sunday")
      ) {
          // Extract start and end times
          const [start, end] = timeRange.split(" - ").map((time) => time.trim());
          const [startHours, startMinutes] = start.split(":").map(Number);
          const [endHours, endMinutes] = end.split(":").map(Number);
          const startTime = startHours * 60 + startMinutes;
          const endTime = endHours * 60 + endMinutes;

          // Check if current time is within the range
          if (currentTime >= startTime && currentTime <= endTime) {
              return "Open";
          } else {
              return "Closed";
          }
      }
  }

  return "Closed"; // Default return if no matching day is found
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

/**
 * Fetches stops near a given lat/lon in Winnipeg. Returns the first stop found.
 *
 * @param {number} lat - The latitude (e.g. 49.895)
 * @param {number} lon - The longitude (e.g. -97.138)
 * @param {number} distance - Distance in meters (default 250)
 * @returns {Promise<{ name: string, distance: number } | null>}
 *   Object containing the stop's name and distance (in meters), or null if none found
 */
export async function getNearestBusStopWinnipeg(lat, lon, distance = 250) {
  const API_KEY = "fCjRlr57oQAJWqGMJ7ls";

  // Winnipeg Transit stops endpoint
  const url = `https://api.winnipegtransit.com/v3/stops.json?lat=${lat}&lon=${lon}&distance=${distance}&api-key=${API_KEY}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(
        `WinnipegTransit fetch failed: status ${response.status}`
      );
    }

    const data = await response.json();
    // data.stops is an array of stops
    console.log("Fetched stops:", data.stops);

    if (!data.stops || data.stops.length === 0) {
      return null; // No stops found within the distance
    }

    // The array may already be in ascending order by distance,
    // but let's ensure we pick the truly nearest:
    data.stops.sort((a, b) => {
      const distA = parseFloat(a.distances.direct) || Infinity;
      const distB = parseFloat(b.distances.direct) || Infinity;
      return distA - distB;
    });

    // The first item is the nearest
    const nearest = data.stops[0];
    const stopName = nearest.name;
    // distances.direct is in meters, but it's a string; parse it
    const stopDistance = parseFloat(nearest.distances.direct);

    return {
      name: stopName,
      distance: stopDistance,
    };
  } catch (err) {
    console.error("Error fetching bus stop:", err);
    return null;
  }
}
