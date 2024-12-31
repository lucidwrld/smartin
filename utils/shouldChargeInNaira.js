// utils/currencyUtils.js

export async function shouldChargeInNaira() {
  try {
    const response = await fetch("https://ipapi.co/json/");
    const data = await response.json();

    return data.country_code === "NG";
  } catch (error) {
    console.error("Error checking location:", error);
    return false; // Default to USD if we can't determine location
  }
}
