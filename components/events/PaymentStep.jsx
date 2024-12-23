import InputWithFullBoarder from "../InputWithFullBoarder";

// PaymentStep.js
export const PaymentStep = ({ formData, onFormDataChange }) => {
  const totalAmount = 1000; // Replace with your actual calculation

  const handleInputChange = (field, value) => {
    onFormDataChange(field, value);
  };

  return (
    <div className="space-y-6 w-full max-w-2xl mx-auto text-brandBlack">
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Payment Summary</h3>
        <div className="flex justify-between mb-4">
          <span>Total Amount:</span>
          <span className="font-semibold">${totalAmount}</span>
        </div>
      </div>

      <div className="space-y-4">
        <InputWithFullBoarder
          label="Payment Method"
          id="paymentMethod"
          type="select"
          isRequired={true}
          value={formData.paymentMethod}
          options={[
            { value: "online", label: "Pay Online" },
            { value: "bank", label: "Bank Transfer" },
            { value: "later", label: "Pay Later" },
          ]}
          onChange={(e) => handleInputChange("paymentMethod", e.target.value)}
        />
      </div>
    </div>
  );
};
