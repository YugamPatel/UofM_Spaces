import fetch from "node-fetch";
import { URLSearchParams } from "url";

// Function to get today's date in YYYY-MM-DD format
const getFormattedDate = (daysToAdd = 0) => {
  const date = new Date();
  date.setDate(date.getDate() + daysToAdd); // Add days if needed (0 for today, 1 for tomorrow)
  return date.toISOString().split("T")[0]; // Extract YYYY-MM-DD
};

/**
 * Fetches seat availability from the external API.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const fetchAvailability = async (req, res) => {
  try {
    const formData = new URLSearchParams({
      lid: "2644",
      gid: "0",
      eid: "-1",
      seat: "1",
      seatId: "0",
      zone: "0",
      start: getFormattedDate(0), // Today's date
      end: getFormattedDate(1), // Tomorrow's date
      pageIndex: "0",
      pageSize: "18",
    }).toString();

    const response = await fetch(
      "https://lib-umanitoba.libcal.com/spaces/availability/grid",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          Accept: "application/json, text/javascript, */*; q=0.01",
          Origin: "https://lib-umanitoba.libcal.com",
          Referer: "https://lib-umanitoba.libcal.com/reserve/QuietPods",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
        },
        body: formData,
      }
    );

    const text = await response.text();

    // Debugging: Check if the response is JSON
    console.log("Raw Response:", text);

    // If response is not JSON, return it as plain text
    try {
      const data = JSON.parse(text);
      return res.status(response.status).json(data);
    } catch (error) {
      console.warn("Response is not JSON, returning as plain text.");
      return res.status(response.status).send(text);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(500).json({ error: error.message });
  }
};
