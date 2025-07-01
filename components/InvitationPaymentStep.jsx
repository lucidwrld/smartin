import React, { useState } from "react";
import { CreditCard, Shield, Lock, Check, AlertCircle } from "lucide-react";
import CustomButton from "./Button";
import InputWithFullBoarder from "./InputWithFullBoarder";

const InvitationPaymentStep = ({ 
  selectedTickets, 
  guestInfo, 
  onPaymentComplete, 
  isLoading 
}) => {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    nameOnCard: "",
    email: guestInfo?.email || "",
    phone: guestInfo?.phone || "",
  });
  const [processing, setProcessing] = useState(false);

  const getTotalAmount = () => {
    return selectedTickets.reduce((total, ticket) => total + ticket.subtotal, 0);
  };

  const getTotalTickets = () => {
    return selectedTickets.reduce((total, ticket) => total + ticket.selectedQuantity, 0);
  };

  const formatCurrency = (amount, currency = "USD") => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const handleInputChange = (field, value) => {
    setPaymentData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePayment = async () => {
    setProcessing(true);
    
    // Simulate payment processing
    try {
      // In real implementation, this would integrate with payment gateway
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const paymentResult = {
        success: true,
        transactionId: `txn_${Date.now()}`,
        amount: getTotalAmount(),
        tickets: selectedTickets,
        paymentMethod: paymentMethod,
        guestInfo: guestInfo
      };
      
      onPaymentComplete(paymentResult);
    } catch (error) {
      console.error("Payment failed:", error);
    } finally {
      setProcessing(false);
    }
  };

  const formatCardNumber = (value) => {
    // Remove all non-digits
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    // Add spaces every 4 digits
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-2">Complete Your Purchase</h2>
        <p className="text-gray-600">
          Secure payment for your event tickets
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Order Summary */}
        <div className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-4">Order Summary</h3>
            
            <div className="space-y-3">
              {selectedTickets.map((ticket) => (
                <div key={ticket.id} className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium">{ticket.name}</h4>
                    <p className="text-sm text-gray-500">{ticket.category}</p>
                    <p className="text-sm text-gray-600">
                      {formatCurrency(ticket.price, ticket.currency)} × {ticket.selectedQuantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {formatCurrency(ticket.subtotal, ticket.currency)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t mt-4 pt-4">
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total ({getTotalTickets()} ticket{getTotalTickets() > 1 ? 's' : ''})</span>
                <span className="text-purple-600">
                  {formatCurrency(getTotalAmount(), selectedTickets[0]?.currency)}
                </span>
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-green-800">Secure Payment</h4>
                <p className="text-sm text-green-700">
                  Your payment information is encrypted and secure. We never store your card details.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <div className="space-y-6">
          <div className="bg-white border rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Payment Details
            </h3>

            {/* Payment Method Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Method
              </label>
              <div className="grid grid-cols-1 gap-2">
                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <CreditCard className="w-5 h-5 mr-2" />
                  <span>Credit/Debit Card</span>
                </label>
              </div>
            </div>

            {/* Card Details Form */}
            {paymentMethod === "card" && (
              <div className="space-y-4">
                <InputWithFullBoarder
                  label="Name on Card"
                  placeholder="John Doe"
                  value={paymentData.nameOnCard}
                  onChange={(e) => handleInputChange("nameOnCard", e.target.value)}
                  isRequired={true}
                />

                <InputWithFullBoarder
                  label="Card Number"
                  placeholder="1234 5678 9012 3456"
                  value={paymentData.cardNumber}
                  onChange={(e) => {
                    const formatted = formatCardNumber(e.target.value);
                    if (formatted.length <= 19) {
                      handleInputChange("cardNumber", formatted);
                    }
                  }}
                  isRequired={true}
                />

                <div className="grid grid-cols-2 gap-4">
                  <InputWithFullBoarder
                    label="Expiry Date"
                    placeholder="MM/YY"
                    value={paymentData.expiryDate}
                    onChange={(e) => {
                      const formatted = formatExpiryDate(e.target.value);
                      if (formatted.length <= 5) {
                        handleInputChange("expiryDate", formatted);
                      }
                    }}
                    isRequired={true}
                  />
                  <InputWithFullBoarder
                    label="CVV"
                    placeholder="123"
                    value={paymentData.cvv}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      if (value.length <= 4) {
                        handleInputChange("cvv", value);
                      }
                    }}
                    isRequired={true}
                  />
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">Contact Information</h4>
                  <div className="space-y-4">
                    <InputWithFullBoarder
                      label="Email"
                      type="email"
                      placeholder="john@example.com"
                      value={paymentData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      isRequired={true}
                    />
                    <InputWithFullBoarder
                      label="Phone Number"
                      placeholder="+1 (555) 123-4567"
                      value={paymentData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      isRequired={true}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Complete Payment Button */}
          <CustomButton
            buttonText={
              processing 
                ? "Processing Payment..." 
                : `Pay ${formatCurrency(getTotalAmount(), selectedTickets[0]?.currency)}`
            }
            buttonColor="bg-purple-600"
            radius="rounded-full w-full"
            isLoading={processing || isLoading}
            prefixIcon={processing ? null : <Lock className="w-4 h-4" />}
            onClick={handlePayment}
            disabled={
              !paymentData.nameOnCard ||
              !paymentData.cardNumber ||
              !paymentData.expiryDate ||
              !paymentData.cvv ||
              !paymentData.email ||
              processing
            }
          />

          {/* Terms */}
          <div className="text-xs text-gray-500 text-center">
            By completing this purchase, you agree to our{" "}
            <a href="/terms-and-condition" className="text-purple-600 hover:underline">
              Terms & Conditions
            </a>{" "}
            and{" "}
            <a href="/privacy" className="text-purple-600 hover:underline">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvitationPaymentStep;