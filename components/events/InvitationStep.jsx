import InputWithFullBoarder from "../InputWithFullBoarder";
import { KeySquare, Scan } from "lucide-react";

const VerificationOption = ({
  icon: Icon,
  title,
  description,
  selected,
  onClick,
}) => (
  <button
    onClick={onClick}
    className={`flex items-start p-6 rounded-xl border transition-all
      ${
        selected
          ? "border-brandPurple bg-purple-50"
          : "border-gray-200 hover:border-gray-300"
      }`}
  >
    <div className="flex gap-4">
      <div className="mt-1">
        <Icon
          size={24}
          className={selected ? "text-brandPurple" : "text-gray-700"}
        />
      </div>
      <div className="text-left">
        <h3 className="font-medium text-gray-900 mb-1">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
    </div>
    <div className="ml-auto">
      <div
        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
          ${
            selected ? "border-brandPurple bg-brandPurple" : "border-gray-300"
          }`}
      >
        {selected && <div className="w-2 h-2 rounded-full bg-white" />}
      </div>
    </div>
  </button>
);

const verificationOptions = [
  {
    id: "accessCode",
    icon: KeySquare,
    title: "Access Code",
    description: "Guests will receive a unique code to enter at the event.",
  },
  {
    id: "facial",
    icon: Scan,
    title: "Facial Recognition",
    description: "Guests will verify their identity using facial recognition.",
  },
];

export const InvitationSettingsStep = ({ formData, onFormDataChange }) => {
  const handleInputChange = (field, value) => {
    onFormDataChange(field, value);
  };

  return (
    <div className="space-y-4 w-full max-w-2xl md:mr-auto">
      <InputWithFullBoarder
        label="Host Names"
        id="host"
        isRequired={true}
        value={formData.host}
        onChange={(e) => handleInputChange("host", e.target.value)}
      />

      <div className="w-full max-w-3xl">
        <h2 className="text-2xl font-semibold mb-2">Choose Access Type</h2>
        <p className="text-gray-600 mb-6">
          Choose a method to verify your guest before entry.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {verificationOptions.map((option) => (
            <VerificationOption
              key={option.id}
              icon={option.icon}
              title={option.title}
              description={option.description}
              selected={formData.verification_type === option.id}
              onClick={() => handleInputChange("verification_type", option.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
