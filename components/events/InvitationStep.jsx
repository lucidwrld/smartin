import InputWithFullBoarder from "../InputWithFullBoarder";
import { KeySquare, Scan } from "lucide-react";

// InvitationSettingsStep.js
export const InvitationSettingsStep = ({ formData, onFormDataChange }) => {
  const handleInputChange = (field, value) => {
    onFormDataChange(field, value);
  };

  return (
    <div className="space-y-4 w-full max-w-2xl md:mr-auto">
      <InputWithFullBoarder
        label="Host Names"
        id="hostNames"
        isRequired={true}
        value={formData.hostNames}
        onChange={(e) => handleInputChange("hostNames", e.target.value)}
      />

      <div className="w-full max-w-3xl">
        <h2 className="text-2xl font-semibold mb-2">Choose Access Type</h2>
        <p className="text-gray-600 mb-6">
          Choose a method to verify your guest before entry.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Access Code Option */}
          <button
            onClick={() =>
              handleInputChange("verificationMethod", "accessCode")
            }
            className={`flex items-start p-6 rounded-xl border transition-all
            ${
              formData.verificationMethod === "accessCode"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            }
          `}
          >
            <div className="flex gap-4">
              <div className="mt-1">
                <KeySquare
                  size={24}
                  className={
                    formData.verificationMethod === "accessCode"
                      ? "text-blue-500"
                      : "text-gray-700"
                  }
                />
              </div>
              <div className="text-left">
                <h3 className="font-medium text-gray-900 mb-1">Access Code</h3>
                <p className="text-gray-600 text-sm">
                  Guests will receive a unique code to enter at the event.
                </p>
              </div>
            </div>
            <div className="ml-auto">
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
              ${
                formData.verificationMethod === "accessCode"
                  ? "border-blue-500 bg-blue-500"
                  : "border-gray-300"
              }`}
              >
                {formData.verificationMethod === "accessCode" && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>
            </div>
          </button>

          {/* Facial Recognition Option */}
          <button
            onClick={() => handleInputChange("verificationMethod", "facial")}
            className={`flex items-start p-6 rounded-xl border transition-all
            ${
              formData.verificationMethod === "facial"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            }
          `}
          >
            <div className="flex gap-4">
              <div className="mt-1">
                <Scan
                  size={24}
                  className={
                    formData.verificationMethod === "facial"
                      ? "text-blue-500"
                      : "text-gray-700"
                  }
                />
              </div>
              <div className="text-left">
                <h3 className="font-medium text-gray-900 mb-1">
                  Facial Recognition
                </h3>
                <p className="text-gray-600 text-sm">
                  Guests will verify their identity using facial recognition.
                </p>
              </div>
            </div>
            <div className="ml-auto">
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
              ${
                formData.verificationMethod === "facial"
                  ? "border-blue-500 bg-blue-500"
                  : "border-gray-300"
              }`}
              >
                {formData.verificationMethod === "facial" && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
