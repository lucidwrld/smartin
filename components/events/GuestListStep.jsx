import InputWithFullBoarder from "../InputWithFullBoarder";

// GuestListStep.js
export const GuestListStep = ({ formData, onFormDataChange }) => {
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
  };

  const removeGuest = (indexToRemove) => {
    const newGuests = (formData.guestList || []).filter(
      (_, index) => index !== indexToRemove
    );
    onFormDataChange("guestList", newGuests);
  };

  const handleCsvUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const text = await file.text();
      // Simple CSV parsing (you might want to use a library like Papa Parse)
      const rows = text.split("\n").map((row) => row.split(","));
      const guests = rows.slice(1).map(([name, email, phone]) => ({
        name: name?.trim() || "",
        email: email?.trim() || "",
        phone: phone?.trim() || "",
      }));
      onFormDataChange("guestList", [...(formData.guestList || []), ...guests]);
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex justify-between items-center">
        <div className="space-x-2">
          <button
            type="button"
            onClick={handleAddGuest}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            Add Guest
          </button>
          <label className="px-4 py-2 bg-gray-100 rounded-lg cursor-pointer">
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

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border p-2 bg-gray-50">Name</th>
              <th className="border p-2 bg-gray-50">Email</th>
              <th className="border p-2 bg-gray-50">Phone</th>
              <th className="border p-2 bg-gray-50">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(formData.guestList || []).map((guest, index) => (
              <tr key={index}>
                <td className="border p-2">
                  <InputWithFullBoarder
                    value={guest.name}
                    onChange={(e) =>
                      handleGuestChange(index, "name", e.target.value)
                    }
                  />
                </td>
                <td className="border p-2">
                  <InputWithFullBoarder
                    value={guest.email}
                    onChange={(e) =>
                      handleGuestChange(index, "email", e.target.value)
                    }
                  />
                </td>
                <td className="border p-2">
                  <InputWithFullBoarder
                    value={guest.phone}
                    onChange={(e) =>
                      handleGuestChange(index, "phone", e.target.value)
                    }
                  />
                </td>
                <td className="border p-2">
                  <button
                    onClick={() => removeGuest(index)}
                    className="text-red-500"
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
