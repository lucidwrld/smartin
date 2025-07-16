import React from "react";
import InputWithFullBoarder from "../InputWithFullBoarder";
import { countryCodes } from "@/utils/countryCodes";

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
  const codeLength = countryCodes.find(({ code }) => number.startsWith(code))
    .code.length;

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

const PhoneInput = ({ value, onChange, className, onValidityChange }) => {
  const [countryCode, setCountryCode] = React.useState(() => {
    return localStorage.getItem("lastUsedCountryCode") || "+1";
  });
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [isValid, setIsValid] = React.useState(true);

  React.useEffect(() => {
    if (value) {
      const code = countryCodes.find((c) => value.startsWith(c.code));
      if (code) {
        setCountryCode(code.code);
        setPhoneNumber(value.slice(code.code.length));
      } else {
        setPhoneNumber(value);
      }
    }
  }, []);

  const formatPhoneNumber = (number) => {
    const digits = number.replace(/\D/g, "");
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    if (digits.length <= 10)
      return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(
        6,
        10
      )}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 11)}`;
  };

  const handleCountryChange = (e) => {
    const newCode = e.target.value;
    setCountryCode(newCode);
    localStorage.setItem("lastUsedCountryCode", newCode);
    const numberWithoutLeadingZero = phoneNumber.replace(/^0+/, "");
    const newValue = newCode + numberWithoutLeadingZero;
    onChange(newValue);
    const valid = validatePhoneNumber(newValue);
    setIsValid(valid);
    onValidityChange(valid);
  };

  const handlePhoneChange = (e) => {
    const cleaned = e.target.value.replace(/\D/g, "");
    if (cleaned.length <= 11) {
      const formatted = formatPhoneNumber(cleaned);
      setPhoneNumber(formatted);
      const numberWithoutLeadingZero = cleaned.replace(/^0+/, "");
      const newValue = countryCode + numberWithoutLeadingZero;
      onChange(newValue);
      const valid = validatePhoneNumber(newValue);
      setIsValid(valid);
      onValidityChange(valid);
    }
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex">
        <select
          value={countryCode}
          onChange={handleCountryChange}
          className="border rounded-l px-2 py-1 bg-gray-50"
        >
          {countryCodes.map(({ code, country, flag }) => (
            <option key={code + country} value={code}>
              {flag} {code}
            </option>
          ))}
        </select>
        <input
          type="tel"
          value={phoneNumber}
          onChange={handlePhoneChange}
          className={`border rounded-r px-2 py-1 flex-1 ${
            !isValid ? "border-red-500" : ""
          }`}
          placeholder="Phone number"
        />
      </div>
      {!isValid && (
        <span className="text-red-500 text-sm mt-1">
          Please enter a valid phone number
        </span>
      )}
    </div>
  );
};

export const GuestListStep = ({ formData, onFormDataChange }) => {
  const [validations, setValidations] = React.useState({});
  const [uploadErrors, setUploadErrors] = React.useState([]);

  const validateGuest = (guest) => {
    return {
      name: !!guest.name.trim(),
      email: validateEmail(guest.email),
      phone: validatePhoneNumber(guest.phone),
    };
  };

  const validateUploadedGuest = (guest, index) => {
    const errors = [];
    if (!guest.name?.trim()) {
      errors.push(`Row ${index + 2}: Name is required`); // +2 because of header row and 0-based index
    }
    if (guest.email && !validateEmail(guest.email)) {
      errors.push(`Row ${index + 2}: Invalid email format`);
    }
    if (!guest.phone?.trim()) {
      errors.push(`Row ${index + 2}: Phone number is required`);
    } else if (!validatePhoneNumber(guest.phone)) {
      errors.push(
        `Row ${
          index + 2
        }: Invalid phone number format. Must include country code and valid number`
      );
    }
    return errors;
  };

  const downloadTemplate = () => {
    // Create XLS content with text formatting for the phone column
    const xlsContent = [
      [
        "Name*",
        "Email",
        "Phone* (with country code)",
        "Do not change the format of this column",
      ],
      [
        "John Doe",
        "john@example.com",
        "'+2348012345678",
        "Example: always add ' before the number to keep the format",
      ],
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([xlsContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "guest_list_template.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const parsePhoneNumber = (phone) => {
    if (!phone) return "";

    // Handle scientific notation (e.g., 2.34807E+12)
    if (phone.includes("E+")) {
      const num = Number(phone);
      if (!isNaN(num)) {
        return "+" + num.toFixed(0); // Convert to regular number format
      }
    }

    // Remove any formatting characters added by Excel
    return phone.replace(/[^0-9+]/g, "");
  };

  const handleCsvUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const text = await file.text();
        const rows = text
          .split("\n")
          .map((row) => row.split(",").map((cell) => cell.trim()));

        // Skip header row and filter out empty rows
        const guests = rows
          .slice(1)
          .filter(row => row.some(cell => cell && cell.trim())) // Filter out empty rows
          .map(([name, email, phone]) => ({
            name: name || "",
            email: email || "",
            phone: parsePhoneNumber(phone) || "",
          }));

        const allErrors = [];
        guests.forEach((guest, index) => {
          const errors = validateUploadedGuest(guest, index);
          allErrors.push(...errors);
        });

        if (allErrors.length > 0) {
          setUploadErrors(allErrors);
        } else {
          onFormDataChange("guestList", [
            ...(formData.guestList || []),
            ...guests,
          ]);
          setUploadErrors([]);
          e.target.value = ""; // Reset file input
        }
      } catch (error) {
        setUploadErrors(["Failed to parse CSV file. Please check the format."]);
      }
    }
  };

  const handleAddGuest = () => {
    const newGuests = [
      ...(formData.guestList || []),
      { name: "", email: "", phone: "" },
    ];
    onFormDataChange("guestList", newGuests);
  };

  const handleGuestChange = (index, field, value) => {
    const newGuests = [...(formData.guestList || [])];
    newGuests[index] = { ...newGuests[index], [field]: value };
    onFormDataChange("guestList", newGuests);

    // Update validations
    const newValidations = { ...validations };
    newValidations[index] = validateGuest(newGuests[index]);
    setValidations(newValidations);
  };

  const removeGuest = (indexToRemove) => {
    const newGuests = (formData.guestList || []).filter(
      (_, index) => index !== indexToRemove
    );
    onFormDataChange("guestList", newGuests);

    // Remove validations for removed guest
    const newValidations = { ...validations };
    delete newValidations[indexToRemove];
    setValidations(newValidations);
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex justify-between items-center">
        <div className="space-x-2">
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={handleAddGuest}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Add Guest
            </button>
            <button
              onClick={downloadTemplate}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Download Template
            </button>
            <label className="px-4 py-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200">
              Upload CSV
              <input
                type="file"
                accept=".csv"
                onChange={handleCsvUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      {uploadErrors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-medium mb-2">
            Please fix the following errors:
          </h3>
          <ul className="list-disc list-inside space-y-1">
            {uploadErrors.map((error, index) => (
              <li key={index} className="text-red-600">
                {error}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border p-2 bg-gray-50">Name*</th>
              <th className="border p-2 bg-gray-50">Email</th>
              <th className="border p-2 bg-gray-50">Phone*</th>
              <th className="border p-2 bg-gray-50">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(formData.guestList || []).map((guest, index) => {
              const validation = validations[index] || validateGuest(guest);
              return (
                <tr key={index}>
                  <td className="border p-2">
                    <div className="flex flex-col">
                      <InputWithFullBoarder
                        value={guest.name}
                        onChange={(e) =>
                          handleGuestChange(index, "name", e.target.value)
                        }
                        className={!validation.name ? "border-red-500" : ""}
                      />
                      {!validation.name && (
                        <span className="text-red-500 text-sm">Required</span>
                      )}
                    </div>
                  </td>
                  <td className="border p-2">
                    <div className="flex flex-col">
                      <InputWithFullBoarder
                        value={guest.email}
                        onChange={(e) =>
                          handleGuestChange(index, "email", e.target.value)
                        }
                        className={
                          guest.email && !validation.email
                            ? "border-red-500"
                            : ""
                        }
                      />
                      {guest.email && !validation.email && (
                        <span className="text-red-500 text-sm">
                          Invalid email
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="border p-2">
                    <PhoneInput
                      value={guest.phone}
                      onChange={(value) =>
                        handleGuestChange(index, "phone", value)
                      }
                      onValidityChange={(valid) => {
                        const newValidations = { ...validations };
                        newValidations[index] = { ...validation, phone: valid };
                        setValidations(newValidations);
                      }}
                    />
                  </td>
                  <td className="border p-2">
                    <button
                      onClick={() => removeGuest(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GuestListStep;
