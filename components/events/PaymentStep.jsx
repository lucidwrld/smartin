import React from "react";
import {
  ArrowUpRight,
  Building2,
  Clock,
  AlertCircle,
  Copy,
} from "lucide-react";

const PaymentStep = ({ formData, onFormDataChange }) => {
  const handlePaymentMethodChange = (method) => {
    onFormDataChange("paymentMethod", method);
  };

  const handleCopyClick = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="w-full max-w-[70%]">
      {/* Payment Summary Section */}
      <h2 className="text-xl font-semibold mb-6">Payment Summary</h2>

      <div className="space-y-4 mb-8 bg-whiteColor p-4 rounded-lg">
        <div className="flex justify-between items-center py-2">
          <span className="text-gray-900">Guests</span>
          <span className="text-gray-900">50</span>
        </div>

        <div className="flex justify-between items-center py-2">
          <span className="text-gray-900">Amount per guest</span>
          <span className="text-gray-900">50 NGN</span>
        </div>

        <div className="flex justify-between items-center py-2">
          <span className="text-gray-900">Total</span>
          <span className="text-gray-900 font-medium">6000</span>
        </div>
      </div>

      {/* Custom Alert */}
      <div className="flex p-4 mb-8 bg-red-50 border border-red-100 rounded-lg">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
          <div className="ml-3">
            <h3 className="text-red-500 font-medium">Event Is Not Active</h3>
            <p className="text-gray-600 mt-1">
              Payment is needed to activate the event
            </p>
          </div>
        </div>
      </div>

      {/* Payment Method Selection */}
      <div className="space-y-4">
        <h3 className="text-gray-900">Select payment method</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Pay Online Now */}
          <button
            onClick={() => handlePaymentMethodChange("online")}
            className={`flex items-start p-6 rounded-xl border transition-all
              ${
                formData.paymentMethod === "online"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }
            `}
          >
            <div className="flex-1">
              <div className="flex items-start gap-4 mb-2">
                <ArrowUpRight size={20} className="mt-1" />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">Pay Online Now</h4>
                  <p className="text-gray-600 text-sm">Pay using gateway.</p>
                </div>
              </div>
            </div>
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
              ${
                formData.paymentMethod === "online"
                  ? "border-blue-500 bg-blue-500"
                  : "border-gray-300"
              }`}
            >
              {formData.paymentMethod === "online" && (
                <div className="w-2 h-2 rounded-full bg-white" />
              )}
            </div>
          </button>

          {/* Pay With Bank Transfer */}
          <button
            onClick={() => handlePaymentMethodChange("bank")}
            className={`flex items-start p-6 rounded-xl border transition-all
              ${
                formData.paymentMethod === "bank"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }
            `}
          >
            <div className="flex-1">
              <div className="flex items-start gap-4 mb-2">
                <Building2 size={20} className="mt-1" />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">
                    Pay With Bank Transfer
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Pay to the given account.
                  </p>
                </div>
              </div>
            </div>
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
              ${
                formData.paymentMethod === "bank"
                  ? "border-blue-500 bg-blue-500"
                  : "border-gray-300"
              }`}
            >
              {formData.paymentMethod === "bank" && (
                <div className="w-2 h-2 rounded-full bg-white" />
              )}
            </div>
          </button>

          {/* Pay Later */}
          <button
            onClick={() => handlePaymentMethodChange("later")}
            className={`flex items-start p-6 rounded-xl border transition-all
              ${
                formData.paymentMethod === "later"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }
            `}
          >
            <div className="flex-1">
              <div className="flex items-start gap-4 mb-2">
                <Clock size={20} className="mt-1" />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">Pay Later</h4>
                  <p className="text-gray-600 text-sm">
                    Event inactive until payment.
                  </p>
                </div>
              </div>
            </div>
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
              ${
                formData.paymentMethod === "later"
                  ? "border-blue-500 bg-blue-500"
                  : "border-gray-300"
              }`}
            >
              {formData.paymentMethod === "later" && (
                <div className="w-2 h-2 rounded-full bg-white" />
              )}
            </div>
          </button>
        </div>

        {/* Bank Details Section */}
        {formData.paymentMethod === "bank" && (
          <div className="mt-6 space-y-4 bg-whiteColor p-6 rounded-lg">
            <div>
              <h4 className="text-gray-700 text-sm mb-1">Bank</h4>
              <p className="text-gray-900 font-medium">Sterling bank</p>
            </div>

            <div>
              <h4 className="text-gray-700 text-sm mb-1">Account Number</h4>
              <div className="flex items-center justify-between">
                <p className="text-gray-900 font-medium">2345678905</p>
                <button
                  onClick={() => handleCopyClick("2345678905")}
                  className="text-purple-600 flex items-center gap-1 text-sm hover:text-purple-700"
                >
                  Copy
                  <Copy size={16} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentStep;
