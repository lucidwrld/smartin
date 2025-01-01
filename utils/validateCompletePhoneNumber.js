import { countryCodes } from "./countryCodes";

// Validate complete phone number format
export const validateCompletePhoneNumber = (value) => {
  // First check if empty
  if (!value) {
    return {
      isValid: false,
      message: "Please enter your phone number",
    };
  }

  // Check if it starts with + and has at least one number after
  const hasCountryCode = /^\+\d/.test(value);
  if (!hasCountryCode) {
    return {
      isValid: false,
      message: `Please add your country code starting with + ( like ${countryCodes[0].code} for ${countryCodes[0].country} or ${countryCodes[1].code} for ${countryCodes[1].country})`,
    };
  }

  // Check if the country code is valid
  const validCode = countryCodes.find(({ code }) => value.startsWith(code));
  if (!validCode) {
    return {
      isValid: false,
      message: `Hmm, we don't recognize that country code. Try something like ${countryCodes[0].code} for ${countryCodes[0].country} or ${countryCodes[1].code} for ${countryCodes[1].country}`,
    };
  }

  // Get the number part after the country code
  const numberPart = value.slice(validCode.code.length);

  // If starts with 0, must be exactly 11 digits
  if (numberPart.startsWith("0")) {
    if (numberPart.length !== 11) {
      return {
        isValid: false,
        message:
          "Your number seems incomplete. When starting with 0, please enter your full 11-digit number after the country code",
      };
    }
  } else {
    // Without leading 0, must be exactly 10 digits
    if (numberPart.length !== 10) {
      return {
        isValid: false,
        message:
          "Your number seems incomplete. Please enter your full 10-digit phone number after the country code",
      };
    }
  }

  return {
    isValid: true,
    message: "",
  };
};
