// Helper validation functions
const validateEmail = (email) => {
  if (!email) return true; // Optional field
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const validatePhoneNumber = (number) => {
  if (!number) return false;

  // Standard length is 10 digits after removing country code and any leading zero
  const EXPECTED_LENGTH = 10;

  // Clean the number of any formatting
  const cleanNumber = number.replace(/\D/g, "");

  if (cleanNumber.startsWith("0")) {
    // If starts with 0, must be EXPECTED_LENGTH + 1 (including the 0)
    return cleanNumber.length === EXPECTED_LENGTH + 1;
  } else {
    // If doesn't start with 0, must be EXPECTED_LENGTH
    return cleanNumber.length === EXPECTED_LENGTH;
  }
};

// Main submission handler
const handleSubmission = (section, formData, id) => {
  if (section && section.toLowerCase() === "guest list") {
    if (formData.guestList?.length > 0) {
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

        // Validate phone (required)
        if (!validatePhoneNumber(guest.phone)) {
          validationErrors.push(
            `Guest ${rowNumber}: Invalid phone number format`
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

      // If validation passes, proceed with submission
      const details = {
        eventId: id,
        invitees: formData.guestList,
      };
      addInvitees(details);
      router.back();
      return true;
    } else {
      alert("Please add at least one guest");
      return false;
    }
  }
  return true; // For other sections
};

export { handleSubmission };
