import InputWithFullBoarder from "../InputWithFullBoarder";

// GiftRegistryStep.js
export const GiftRegistryStep = ({ formData, onFormDataChange }) => {
  const handleAddGift = () => {
    const newGifts = [
      ...(formData.giftRegistry || []),
      { itemName: "", itemLink: "", price: "" },
    ];
    onFormDataChange("giftRegistry", newGifts);
  };

  const handleGiftChange = (index, field, value) => {
    const newGifts = [...(formData.giftRegistry || [])];
    newGifts[index] = { ...newGifts[index], [field]: value };
    onFormDataChange("giftRegistry", newGifts);
  };

  const removeGift = (indexToRemove) => {
    const newGifts = (formData.giftRegistry || []).filter(
      (_, index) => index !== indexToRemove
    );
    onFormDataChange("giftRegistry", newGifts);
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 w-full">
      {/* Left side - Gift List */}
      <div className="w-full md:w-1/2 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Gift Registry</h3>
          <button
            type="button"
            onClick={handleAddGift}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            Add Gift
          </button>
        </div>

        <div className="space-y-4">
          {(formData.giftRegistry || []).map((gift, index) => (
            <div key={index} className="relative border rounded-lg p-4">
              <button
                onClick={() => removeGift(index)}
                className="absolute top-2 right-2 text-red-500"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <div className="space-y-2">
                <InputWithFullBoarder
                  label="Item Name"
                  value={gift.itemName}
                  onChange={(e) =>
                    handleGiftChange(index, "itemName", e.target.value)
                  }
                />
                <InputWithFullBoarder
                  label="Item Link"
                  value={gift.itemLink}
                  onChange={(e) =>
                    handleGiftChange(index, "itemLink", e.target.value)
                  }
                />
                <InputWithFullBoarder
                  label="Price"
                  type="number"
                  value={gift.price}
                  onChange={(e) =>
                    handleGiftChange(index, "price", e.target.value)
                  }
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right side - Account Details */}
      <div className="w-full md:w-1/2 space-y-4">
        <h3 className="text-lg font-semibold">Account Details</h3>
        <InputWithFullBoarder
          label="Bank Name"
          value={formData.bankName}
          onChange={(e) => onFormDataChange("bankName", e.target.value)}
        />
        <InputWithFullBoarder
          label="Account Number"
          value={formData.accountNumber}
          onChange={(e) => onFormDataChange("accountNumber", e.target.value)}
        />
        <InputWithFullBoarder
          label="Account Name"
          value={formData.accountName}
          onChange={(e) => onFormDataChange("accountName", e.target.value)}
        />
      </div>
    </div>
  );
};
