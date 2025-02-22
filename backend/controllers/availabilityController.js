import fetch from "node-fetch"; // Required for Node <18
import { URLSearchParams } from "url";

/**
 * Fetches seat availability from the external API.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const fetchAvailability = async (req, res) => {
  try {
    // Define form data for the request
    const formData = new URLSearchParams({
      lid: "2644",
      gid: "0",
      eid: "-1",
      seat: "1",
      seatId: "0",
      zone: "0",
      start: "2025-02-21",
      end: "2025-02-22",
      pageIndex: "0",
      pageSize: "18",
    }).toString();

    // Send the POST request to the external API
    const response = await fetch(
      "https://lib-umanitoba.libcal.com/spaces/availability/grid",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          Accept: "application/json, text/javascript, */*; q=0.01",
          "User-Agent":
            "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Mobile Safari/537.36",
        },
        body: formData,
      }
    );

    // Read response as text first (to handle both JSON and raw text)
    const text = await response.text();

    // Log the response for debugging
    console.log("Remote server status:", response.status, response.statusText);

    // Try parsing as JSON, else return raw text
    try {
      const data = JSON.parse(text);
      return res.status(response.status).json(data);
    } catch (error) {
      console.error("Invalid JSON response. Returning raw text.");
      return res.status(response.status).send(text);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(500).json({ error: error.message });
  }
};
