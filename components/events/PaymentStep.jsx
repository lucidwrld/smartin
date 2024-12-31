import React from "react";
import {
  ArrowUpRight,
  Building2,
  Clock,
  AlertCircle,
  Copy,
} from "lucide-react";
import useGetDiscountsManager from "@/app/admin/settings/controllers/getDiscountsController";
import useGetPricingsManager from "@/app/admin/settings/controllers/getPricingController";
import useGetUserDetailsManager from "@/app/profile-settings/controllers/get_UserDetails_controller";
import { calculateTotal } from "@/utils/calculateTotal";

const PAYMENT_METHODS = [
  {
    id: "online",
    icon: ArrowUpRight,
    title: "Pay Online Now",
    description: "Pay using gateway.",
  },
  {
    id: "bank",
    icon: Building2,
    title: "Pay With Bank Transfer",
    description: "Pay to the given account.",
  },
  {
    id: "later",
    icon: Clock,
    title: "Pay Later",
    description: "Event inactive until payment.",
  },
];

const PaymentOption = ({ method, selected, onClick }) => (
  <button
    onClick={() => onClick(method.id)}
    className={`flex items-start p-6 rounded-xl border transition-all
      ${
        selected
          ? "border-brandPurple bg-blue-50"
          : "border-gray-200 hover:border-gray-300"
      }`}
  >
    <div className="flex-1">
      <div className="flex items-start gap-4 mb-2">
        <method.icon size={20} className="mt-1" />
        <div className="flex-1">
          <h4 className="font-medium text-gray-900">{method.title}</h4>
          <p className="text-gray-600 text-sm">{method.description}</p>
        </div>
      </div>
    </div>
    <div
      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
      ${selected ? "border-brandPurple bg-brandPurple" : "border-gray-300"}`}
    >
      {selected && <div className="w-2 h-2 rounded-full bg-white" />}
    </div>
  </button>
);

const SummaryItem = ({ label, value, className = "" }) => (
  <div className={`flex justify-between items-center py-2 ${className}`}>
    <span className="text-gray-900">{label}</span>
    <span className="text-gray-900 font-medium">{value}</span>
  </div>
);

const BankDetails = ({ onCopy }) => (
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
          onClick={() => onCopy("2345678905")}
          className="text-purple-600 flex items-center gap-1 text-sm hover:text-purple-700"
        >
          Copy
          <Copy size={16} />
        </button>
      </div>
    </div>
  </div>
);

const PaymentStep = ({
  formData,
  onFormDataChange,
  isEditMode = false,
  event,
}) => {
  const handleCopyClick = (text) => navigator.clipboard.writeText(text);
  const { data: discounts, isLoading: loadingDiscounts } =
    useGetDiscountsManager();
  const { data: pricing, isLoading } = useGetPricingsManager();
  const { data: userDetails } = useGetUserDetailsManager();

  const isPartner = userDetails?.data?.user?.isPartner;
  const noOfGuests = parseInt(formData.no_of_invitees) || 0;
  const currency = "NGN"; // Replace with your currency determination logic

  const priceCalculation =
    pricing?.data && discounts?.data
      ? calculateTotal(
          noOfGuests,
          pricing.data,
          discounts.data,
          isPartner,
          currency
        )
      : null;

  const formatCurrency = (amount) => {
    return `${amount.toLocaleString()} ${currency}`;
  };

  if (isLoading || loadingDiscounts) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full max-w-[70%]">
      <h2 className="text-xl font-semibold mb-6">Payment Summary</h2>

      <div className="space-y-4 mb-8 bg-whiteColor p-6 rounded-lg">
        <SummaryItem
          label="Event Base Price"
          value={formatCurrency(priceCalculation?.eventPrice || 0)}
        />
        <SummaryItem
          label="Price per Guest"
          value={formatCurrency(priceCalculation?.pricePerInvite || 0)}
        />
        <SummaryItem
          label={`Guest Total (${noOfGuests} guests)`}
          value={formatCurrency(
            priceCalculation?.pricePerInvite * noOfGuests || 0
          )}
        />
        <SummaryItem
          label="Subtotal"
          value={formatCurrency(priceCalculation?.subtotal || 0)}
          className="border-t pt-3"
        />

        {priceCalculation?.discountPercent > 0 && (
          <>
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="text-green-700 text-sm font-medium">
                {isPartner
                  ? "Partner Discount Applied!"
                  : "Volume Discount Applied!"}
              </p>
              <p className="text-green-600 text-sm mt-1">
                {priceCalculation.discountPercent}% off for {noOfGuests} guests
              </p>
            </div>
            <SummaryItem
              label="Discount"
              value={`-${formatCurrency(priceCalculation.discountAmount)}`}
              className="text-green-600"
            />
          </>
        )}

        <SummaryItem
          label="Total"
          value={formatCurrency(priceCalculation?.total || 0)}
          className="border-t pt-3 text-lg font-semibold"
        />
      </div>

      {(!isEditMode || !event?.isPaid) && (
        <div className="flex p-4 mb-8 bg-red-50 border border-red-100 rounded-lg">
          <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
          <div className="ml-3">
            <h3 className="text-red-500 font-medium">Event Is Not Active</h3>
            <p className="text-gray-600 mt-1">
              Payment is needed to activate the event
            </p>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <h3 className="text-gray-900">Select payment method</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PAYMENT_METHODS.map((method) => (
            <PaymentOption
              key={method.id}
              method={method}
              selected={formData.payment_type === method.id}
              onClick={(id) => onFormDataChange("payment_type", id)}
            />
          ))}
        </div>

        {formData.payment_type === "bank" && (
          <BankDetails onCopy={handleCopyClick} />
        )}
      </div>
    </div>
  );
};

export default PaymentStep;
