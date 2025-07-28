"use client";
import React, { useState, useEffect } from "react";
import BaseDashboardNavigation from "@/components/BaseDashboardNavigation";
import Button from "@/components/Button";
import InputWithFullBoarder from "@/components/InputWithFullBoarder";
import Dropdown from "@/components/Dropdown";
import TablesComponent from "@/components/TablesComponent";
import Loader from "@/components/Loader";
import { toast } from "react-toastify";
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Eye, 
  EyeOff, 
  Plus, 
  History,
  CreditCard,
  Building2,
  CheckCircle,
  AlertCircle,
  Clock
} from "lucide-react";

// Import wallet controllers
import { useGetUserBalanceManager } from "@/app/transactions/controllers/wallet/getUserBalanceController";
import { useGetBankListManager } from "@/app/transactions/controllers/wallet/getBankListController";
import { useResolveBankAccountManager } from "@/app/transactions/controllers/wallet/resolveBankAccountController";
import { WithdrawalManager } from "@/app/transactions/controllers/wallet/withdrawalController";
import { VerifyWithdrawalOtpManager } from "@/app/transactions/controllers/wallet/verifyWithdrawalOtpController";
import { useGetUserWithdrawalsManager } from "@/app/transactions/controllers/wallet/getUserWithdrawalsController";
import { useGetWalletTransactionsManager } from "@/app/transactions/controllers/wallet/walletTransactionController";
import { formatAmount } from "@/utils/formatAmount";
import { formatDateTime } from "@/utils/formatDateTime";

const WalletPage = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showBalance, setShowBalance] = useState(true);
  const [withdrawalStep, setWithdrawalStep] = useState("amount"); // amount, bank, otp, success
  const [currentPage, setCurrentPage] = useState(1);
  
  // Withdrawal form states
  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const [selectedBank, setSelectedBank] = useState(null);
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [withdrawalId, setWithdrawalId] = useState(null);

  // Initialize controllers
  const { data: balanceData, isLoading: loadingBalance } = useGetUserBalanceManager({ enabled: true });
  const { data: bankList, isLoading: loadingBanks } = useGetBankListManager();
  const { data: resolvedAccount, isLoading: resolvingAccount } = useResolveBankAccountManager(
    accountNumber, 
    selectedBank?.code || ""
  );
  const { processWithdrawal, isLoading: processingWithdrawal } = WithdrawalManager();
  const { verifyWithdrawalOtp, isLoading: verifyingOtp } = VerifyWithdrawalOtpManager();
  const { data: withdrawalsData, isLoading: loadingWithdrawals } = useGetUserWithdrawalsManager({
    page: currentPage,
    pageSize: 10,
    enabled: activeTab === "withdrawals"
  });
  const { data: transactionsData, isLoading: loadingTransactions } = useGetWalletTransactionsManager({
    page: currentPage,
    pageSize: 10,
    enabled: activeTab === "transactions"
  });

  const walletBalance = balanceData?.data?.balance || 0;
  const currency = "NGN";

  const tabs = [
    { id: "overview", name: "Overview", icon: Wallet },
    { id: "withdraw", name: "Withdraw", icon: ArrowUpRight },
    { id: "transactions", name: "Transactions", icon: History },
    { id: "withdrawals", name: "Withdrawals", icon: ArrowDownLeft }
  ];

  // Update account name when account is resolved
  useEffect(() => {
    if (resolvedAccount?.data?.account_name) {
      setAccountName(resolvedAccount.data.account_name);
    }
  }, [resolvedAccount]);

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
        setWithdrawalStep("otp");
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
      setWithdrawalStep("success");
      // Reset form
      setTimeout(() => {
        resetWithdrawalForm();
      }, 3000);
    } catch (error) {
      console.error("OTP verification error:", error);
    }
  };

  const resetWithdrawalForm = () => {
    setWithdrawalStep("amount");
    setWithdrawalAmount("");
    setSelectedBank(null);
    setAccountNumber("");
    setAccountName("");
    setOtpCode("");
    setWithdrawalId(null);
  };

  const getTransactionHeaders = () => ["Type", "Amount", "Description", "Date", "Status"];
  
  const getTransactionFormattedValue = (el, index) => {
    return [
      <div className="flex items-center space-x-2">
        {el.type === "credit" ? (
          <ArrowDownLeft className="h-4 w-4 text-green-500" />
        ) : (
          <ArrowUpRight className="h-4 w-4 text-red-500" />
        )}
        <span className="capitalize">{el.type}</span>
      </div>,
      <span className={el.type === "credit" ? "text-green-600" : "text-red-600"}>
        {el.type === "credit" ? "+" : "-"}{currency} {formatAmount(el.amount)}
      </span>,
      el.description || "Wallet transaction",
      formatDateTime(el.createdAt),
      <span className={`px-2 py-1 rounded-full text-xs ${
        el.status === "completed" ? "bg-green-100 text-green-800" :
        el.status === "pending" ? "bg-yellow-100 text-yellow-800" :
        "bg-red-100 text-red-800"
      }`}>
        {el.status}
      </span>
    ];
  };

  const getWithdrawalHeaders = () => ["Amount", "Bank", "Account", "Date", "Status"];
  
  const getWithdrawalFormattedValue = (el, index) => {
    return [
      `${currency} ${formatAmount(el.amount)}`,
      el.bank_name,
      `${el.account_number} - ${el.account_name}`,
      formatDateTime(el.createdAt),
      <span className={`px-2 py-1 rounded-full text-xs ${
        el.status === "completed" ? "bg-green-100 text-green-800" :
        el.status === "pending" ? "bg-yellow-100 text-yellow-800" :
        el.status === "failed" ? "bg-red-100 text-red-800" :
        "bg-gray-100 text-gray-800"
      }`}>
        {el.status}
      </span>
    ];
  };

  if (loadingBalance) {
    return <Loader />;
  }

  return (
    <BaseDashboardNavigation title="Wallet">
      {/* Header */}
      <div className="bg-gradient-to-r from-olive to-forest rounded-xl p-6 mx-4 mb-6 text-cream">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-serif font-bold mb-2">My Wallet</h1>
            <div className="flex items-center space-x-3">
              <p className="text-3xl font-bold">
                {showBalance ? `${currency} ${formatAmount(walletBalance)}` : "****"}
              </p>
              <button
                onClick={() => setShowBalance(!showBalance)}
                className="p-1 hover:bg-forest/20 rounded"
              >
                {showBalance ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <p className="text-cream/80 text-sm mt-1">Available balance</p>
          </div>
          <div className="flex space-x-3">
            <Button
              buttonText="Withdraw"
              buttonColor="bg-cream"
              textColor="text-forest"
              prefixIcon={<ArrowUpRight className="h-4 w-4" />}
              onClick={() => setActiveTab("withdraw")}
            />
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-sand/30 mx-4 mb-6">
        <div className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? "border-olive text-olive"
                  : "border-transparent text-gray-500 hover:text-olive hover:border-sand"
              }`}
            >
              <tab.icon size={16} />
              <span>{tab.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="mx-4">
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white border border-sand/30 rounded-xl p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <ArrowDownLeft className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Received</p>
                    <p className="text-xl font-bold text-forest">{currency} {formatAmount(balanceData?.data?.total_received || 0)}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white border border-sand/30 rounded-xl p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <ArrowUpRight className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Withdrawn</p>
                    <p className="text-xl font-bold text-forest">{currency} {formatAmount(balanceData?.data?.total_withdrawn || 0)}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white border border-sand/30 rounded-xl p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Wallet className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Current Balance</p>
                    <p className="text-xl font-bold text-forest">{currency} {formatAmount(walletBalance)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white border border-sand/30 rounded-xl p-6">
              <h3 className="font-serif font-bold text-xl text-forest mb-4">Recent Transactions</h3>
              {loadingTransactions ? (
                <Loader />
              ) : (
                <TablesComponent
                  isLoading={loadingTransactions}
                  data={transactionsData?.data?.slice(0, 5) || []}
                  getFormattedValue={getTransactionFormattedValue}
                  headers={getTransactionHeaders()}
                  showCheckBox={false}
                />
              )}
              <div className="mt-4 text-center">
                <Button
                  buttonText="View All Transactions"
                  buttonColor="bg-olive"
                  textColor="text-cream"
                  onClick={() => setActiveTab("transactions")}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "withdraw" && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white border border-sand/30 rounded-xl p-6">
              <h3 className="font-serif font-bold text-xl text-forest mb-6">Withdraw Funds</h3>
              
              {withdrawalStep === "amount" && (
                <div className="space-y-6">
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
                    <p className="text-sm text-gray-500 mt-1">
                      Available: {currency} {formatAmount(walletBalance)}
                    </p>
                  </div>
                  <Button
                    buttonText="Continue"
                    buttonColor="bg-olive"
                    textColor="text-cream"
                    onClick={() => setWithdrawalStep("bank")}
                    disabled={!withdrawalAmount || parseFloat(withdrawalAmount) <= 0}
                  />
                </div>
              )}

              {withdrawalStep === "bank" && (
                <div className="space-y-6">
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
                      onClick={() => setWithdrawalStep("amount")}
                    />
                    <Button
                      buttonText={processingWithdrawal ? "Processing..." : "Proceed"}
                      buttonColor="bg-olive"
                      textColor="text-cream"
                      onClick={handleWithdrawalSubmit}
                      disabled={!accountName || processingWithdrawal}
                      isLoading={processingWithdrawal}
                    />
                  </div>
                </div>
              )}

              {withdrawalStep === "otp" && (
                <div className="space-y-6 text-center">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <AlertCircle size={24} className="text-blue-600 mx-auto mb-2" />
                    <p className="text-sm text-blue-800">
                      An OTP has been sent to your registered phone number. Please enter it below to complete the withdrawal.
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
                      onClick={() => setWithdrawalStep("bank")}
                    />
                    <Button
                      buttonText={verifyingOtp ? "Verifying..." : "Verify & Complete"}
                      buttonColor="bg-olive"
                      textColor="text-cream"
                      onClick={handleOtpVerification}
                      disabled={!otpCode || verifyingOtp}
                      isLoading={verifyingOtp}
                    />
                  </div>
                </div>
              )}

              {withdrawalStep === "success" && (
                <div className="space-y-6 text-center">
                  <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle size={48} className="text-green-600 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-green-800 mb-2">Withdrawal Successful!</h4>
                    <p className="text-sm text-green-700">
                      Your withdrawal of {currency} {formatAmount(withdrawalAmount)} has been processed successfully.
                      The funds will be credited to your account within 24 hours.
                    </p>
                  </div>
                  
                  <Button
                    buttonText="Make Another Withdrawal"
                    buttonColor="bg-olive"
                    textColor="text-cream"
                    onClick={resetWithdrawalForm}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "transactions" && (
          <div className="bg-white border border-sand/30 rounded-xl p-6">
            <h3 className="font-serif font-bold text-xl text-forest mb-6">Transaction History</h3>
            <TablesComponent
              isLoading={loadingTransactions}
              data={transactionsData?.data || []}
              getFormattedValue={getTransactionFormattedValue}
              headers={getTransactionHeaders()}
              showCheckBox={false}
            />
          </div>
        )}

        {activeTab === "withdrawals" && (
          <div className="bg-white border border-sand/30 rounded-xl p-6">
            <h3 className="font-serif font-bold text-xl text-forest mb-6">Withdrawal History</h3>
            <TablesComponent
              isLoading={loadingWithdrawals}
              data={withdrawalsData?.data || []}
              getFormattedValue={getWithdrawalFormattedValue}
              headers={getWithdrawalHeaders()}
              showCheckBox={false}
            />
          </div>
        )}
      </div>
    </BaseDashboardNavigation>
  );
};

export default WalletPage;