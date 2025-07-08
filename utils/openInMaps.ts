// utils/openInMaps.js

/**
 * Opens a location in Google Maps in a new tab
 * @param {Object} params - Location parameters
 * @param {string} params.address - Full address or location name
 * @param {Object} [params.coordinates] - Optional coordinates object
 * @param {number} params.coordinates.lat - Latitude
 * @param {number} params.coordinates.lng - Longitude
 * @returns {void}
 */
export const openInMaps = ({ address, coordinates = null }) => {
  try {
    let mapsUrl;

    // If coordinates are provided, use them
    if (coordinates?.lat && coordinates?.lng) {
      mapsUrl = `https://www.google.com/maps/search/?api=1&query=${coordinates.lat},${coordinates.lng}`;
    }
    // Otherwise use the address
    else if (address) {
      mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        address
      )}`;
    } else {
      throw new Error("Either address or coordinates must be provided");
    }

    window.open(mapsUrl, "_blank");
  } catch (error) {
    console.error("Error opening location in maps:", error);
    throw new Error("Failed to open location in maps");
  }
};
