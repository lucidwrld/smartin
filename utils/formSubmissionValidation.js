import { countryCodes } from "./countryCodes";

export const handleSubmission = (section, formData, id) => {
  if (section && section.toLowerCase() === "guest list") {
    if (formData.guestList?.length > 0) {
      // Validation helper functions
      const validateEmail = (email) => {
        if (!email) return true; // Optional field
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      };

      const validatePhoneNumber = (number) => {
        if (!number) return false;

        // Find if the number starts with a valid country code
        const hasValidCountryCode = countryCodes.some(({ code }) =>
          number.startsWith(code)
        );
        if (!hasValidCountryCode) return false;

        // Get the actual phone number part (after country code)
        const codeLength = countryCodes.find(({ code }) =>
          number.startsWith(code)
        ).code.length;

        const phonePartOnly = number.slice(codeLength);
        const cleanNumber = phonePartOnly.replace(/\D/g, "");

        // Standard length is 10 digits
        const EXPECTED_LENGTH = 10;

        if (cleanNumber.startsWith("0")) {
          // If starts with 0, must be EXPECTED_LENGTH + 1 (including the 0)
          return cleanNumber.length === EXPECTED_LENGTH + 1;
        } else {
          // If doesn't start with 0, must be EXPECTED_LENGTH
          return cleanNumber.length === EXPECTED_LENGTH;
        }
      };

      // Validate each guest in the list
      const validationErrors = [];

      formData.guestList.forEach((guest, index) => {
        const rowNumber = index + 1;

        // Validate name (required)
        if (!guest.name?.trim()) {
          validationErrors.push(`Guest ${rowNumber}: Name is required`);
        }

        // Validate email (optional but must be valid if provided)
        if (guest.email && !validateEmail(guest.email)) {
          validationErrors.push(`Guest ${rowNumber}: Invalid email format`);
        }

        // Validate phone (required and must include country code)
        if (!guest.phone) {
          validationErrors.push(`Guest ${rowNumber}: Phone number is required`);
        } else if (!validatePhoneNumber(guest.phone)) {
          validationErrors.push(
            `Guest ${rowNumber}: Invalid phone number format. Must include country code and valid number`
          );
        }
      });

      // If there are any validation errors, alert and prevent submission
      if (validationErrors.length > 0) {
        alert(
          "Please fix the following issues:\n\n" + validationErrors.join("\n")
        );
        return false;
      }

      return true;
    } else {
      alert("Please add at least one guest");
      return false;
    }
  }
  return true; // For other sections
};
