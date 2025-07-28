"use client";
import React, { useState, useEffect } from "react";
import { X, AlertCircle, CheckCircle, Clock } from "lucide-react";
import Button from "../Button";
import InputWithFullBoarder from "../InputWithFullBoarder";
import Dropdown from "../Dropdown";
import Loader from "../Loader";
import { toast } from "react-toastify";

// Import wallet controllers
import { useGetBankListManager } from "@/app/transactions/controllers/wallet/getBankListController";
import { useResolveBankAccountManager } from "@/app/transactions/controllers/wallet/resolveBankAccountController";
import { WithdrawalManager } from "@/app/transactions/controllers/wallet/withdrawalController";
import { VerifyWithdrawalOtpManager } from "@/app/transactions/controllers/wallet/verifyWithdrawalOtpController";
import { formatAmount } from "@/utils/formatAmount";

interface WithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
  walletBalance: number;
}

const WithdrawalModal: React.FC<WithdrawalModalProps> = ({ isOpen, onClose, walletBalance }) => {
  const [step, setStep] = useState("amount"); // amount, bank, otp, success
  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const [selectedBank, setSelectedBank] = useState(null);
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [withdrawalId, setWithdrawalId] = useState(null);

  // Initialize controllers
  const { data: bankList, isLoading: loadingBanks } = useGetBankListManager();
  const { data: resolvedAccount, isLoading: resolvingAccount } = useResolveBankAccountManager(
    accountNumber,
    selectedBank?.code || ""
  );
  const { processWithdrawal, isLoading: processingWithdrawal } = WithdrawalManager();
  const { verifyWithdrawalOtp, isLoading: verifyingOtp } = VerifyWithdrawalOtpManager();

  const currency = "NGN";

  // Update account name when account is resolved
  useEffect(() => {
    if (resolvedAccount?.data?.account_name) {
      setAccountName(resolvedAccount.data.account_name);
    }
  }, [resolvedAccount]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    setStep("amount");
    setWithdrawalAmount("");
    setSelectedBank(null);
    setAccountNumber("");
    setAccountName("");
    setOtpCode("");
    setWithdrawalId(null);
  };

  const handleWithdrawalSubmit = async () => {
    if (!withdrawalAmount || !selectedBank || !accountNumber || !accountName) {
      toast.error("Please fill all required fields");
      return;
    }

    const amount = parseFloat(withdrawalAmount);
    if (amount <= 0 || amount > walletBalance) {
      toast.error("Invalid withdrawal amount");
      return;
    }

    const withdrawalData = {
      amount: amount,
      bank_name: selectedBank.name,
      bank_code: selectedBank.code,
      account_number: accountNumber,
      account_name: accountName
    };

    try {
      const result = await processWithdrawal(withdrawalData);
      if (result?.data?.withdrawal_id) {
        setWithdrawalId(result.data.withdrawal_id);
        setStep("otp");
      }
    } catch (error) {
      console.error("Withdrawal error:", error);
    }
  };

  const handleOtpVerification = async () => {
    if (!otpCode || !withdrawalId) {
      toast.error("Please enter the OTP code");
      return;
    }

    const otpData = {
      withdrawal_id: withdrawalId,
      otp: otpCode
    };

    try {
      await verifyWithdrawalOtp(otpData);
      setStep("success");
      // Auto close after success
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (error) {
      console.error("OTP verification error:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Withdraw Funds</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === "amount" && (
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Available Balance</p>
                <p className="text-2xl font-bold text-purple-600">
                  {currency} {formatAmount(walletBalance)}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Withdrawal Amount
                </label>
                <InputWithFullBoarder
                  type="number"
                  placeholder="0.00"
                  value={withdrawalAmount}
                  onChange={(e) => setWithdrawalAmount(e.target.value)}
                  label=""
                />
              </div>
              
              <Button
                buttonText="Continue"
                buttonColor="bg-purple-600"
                textColor="text-white"
                onClick={() => setStep("bank")}
                disabled={!withdrawalAmount || parseFloat(withdrawalAmount) <= 0}
              />
            </div>
          )}

          {step === "bank" && (
            <div className="space-y-6">
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-gray-600">Withdrawing</p>
                <p className="text-xl font-bold text-purple-600">
                  {currency} {formatAmount(withdrawalAmount)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Bank
                </label>
                {loadingBanks ? (
                  <Loader />
                ) : (
                  <Dropdown
                    label="Select Bank"
                    id="bank_selection"
                    type="select"
                    value={selectedBank?.code || ""}
                    options={bankList?.data?.map(bank => ({ value: bank.code, label: bank.name })) || []}
                    onChange={(e) => {
                      const bank = bankList?.data?.find(b => b.code === e.target.value);
                      setSelectedBank(bank);
                    }}
                    placeholder="Choose your bank"
                  />
                )}
              </div>

              {selectedBank && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Number
                  </label>
                  <InputWithFullBoarder
                    type="text"
                    placeholder="Enter account number"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    maxLength={10}
                    label=""
                  />
                </div>
              )}

              {resolvingAccount && (
                <div className="flex items-center space-x-2 text-blue-600">
                  <Clock size={16} />
                  <span className="text-sm">Resolving account...</span>
                </div>
              )}

              {accountName && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <CheckCircle size={16} className="text-green-600" />
                    <span className="text-sm font-medium text-green-800">Account Name:</span>
                    <span className="text-sm text-green-700">{accountName}</span>
                  </div>
                </div>
              )}

              <div className="flex space-x-3">
                <Button
                  buttonText="Back"
                  buttonColor="bg-gray-200"
                  textColor="text-gray-700"
                  onClick={() => setStep("amount")}
                />
                <Button
                  buttonText={processingWithdrawal ? "Processing..." : "Proceed"}
                  buttonColor="bg-purple-600"
                  textColor="text-white"
                  onClick={handleWithdrawalSubmit}
                  disabled={!accountName || processingWithdrawal}
                  isLoading={processingWithdrawal}
                />
              </div>
            </div>
          )}

          {step === "otp" && (
            <div className="space-y-6 text-center">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <AlertCircle size={24} className="text-blue-600 mx-auto mb-2" />
                <p className="text-sm text-blue-800">
                  An OTP has been sent to your registered phone number. Please enter it below to complete the withdrawal.
                </p>
              </div>

              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-gray-600">Withdrawing</p>
                <p className="text-xl font-bold text-purple-600">
                  {currency} {formatAmount(withdrawalAmount)}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  to {selectedBank?.name} - {accountNumber}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter OTP Code
                </label>
                <InputWithFullBoarder
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  maxLength={6}
                  label=""
                />
              </div>

              <div className="flex space-x-3 justify-center">
                <Button
                  buttonText="Back"
                  buttonColor="bg-gray-200"
                  textColor="text-gray-700"
                  onClick={() => setStep("bank")}
                />
                <Button
                  buttonText={verifyingOtp ? "Verifying..." : "Verify & Complete"}
                  buttonColor="bg-purple-600"
                  textColor="text-white"
                  onClick={handleOtpVerification}
                  disabled={!otpCode || verifyingOtp}
                  isLoading={verifyingOtp}
                />
              </div>
            </div>
          )}

          {step === "success" && (
            <div className="space-y-6 text-center">
              <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle size={48} className="text-green-600 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-green-800 mb-2">Withdrawal Successful!</h4>
                <p className="text-sm text-green-700 mb-2">
                  Your withdrawal of {currency} {formatAmount(withdrawalAmount)} has been processed successfully.
                </p>
                <p className="text-sm text-green-700">
                  The funds will be credited to your {selectedBank?.name} account ({accountNumber}) within 24 hours.
                </p>
              </div>

              <Button
                buttonText="Close"
                buttonColor="bg-purple-600"
                textColor="text-white"
                onClick={onClose}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WithdrawalModal;