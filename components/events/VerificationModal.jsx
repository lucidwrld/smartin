// VerificationModal.js
export const VerificationModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-2">Payment Verification</h2>
        <p className="text-gray-600 mb-6">
          Please hold on while we verify your payment. We will notify you once
          the payment is verified.
        </p>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg"
          >
            Okay
          </button>
        </div>
      </div>
    </div>
  );
};
