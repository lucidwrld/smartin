import InputWithFullBoarder from "../InputWithFullBoarder";

// InvitationSettingsStep.js
export const InvitationSettingsStep = ({ formData, onFormDataChange }) => {
  const handleInputChange = (field, value) => {
    onFormDataChange(field, value);
  };

  return (
    <div className="space-y-4 w-full max-w-2xl mx-auto">
      <InputWithFullBoarder
        label="Host Names"
        id="hostNames"
        isRequired={true}
        value={formData.hostNames}
        onChange={(e) => handleInputChange("hostNames", e.target.value)}
      />

      <InputWithFullBoarder
        label="Verification Method"
        id="verificationMethod"
        type="select"
        isRequired={true}
        value={formData.verificationMethod}
        options={[
          { value: "facial", label: "Facial Recognition" },
          { value: "accessCode", label: "Access Code" },
        ]}
        onChange={(e) =>
          handleInputChange("verificationMethod", e.target.value)
        }
      />
    </div>
  );
};
