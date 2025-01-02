import useGetUserDetailsManager from "@/app/profile-settings/controllers/get_UserDetails_controller";
import InputWithFullBoarder from "../InputWithFullBoarder";

// GiftRegistryStep.js
export const GiftRegistryStep = ({ formData, onFormDataChange }) => {
  const { data: userDetail } = useGetUserDetailsManager();
  const handleAddGift = () => {
    const newGifts = [
      ...(formData.items || []),
      { itemName: "", itemLink: "", price: "" },
    ];
    onFormDataChange("items", newGifts);
  };

  const handleGiftChange = (index, field, value) => {
    const newGifts = [...(formData.items || [])];
    newGifts[index] = { ...newGifts[index], [field]: value };
    onFormDataChange("items", newGifts);
  };

  const removeGift = (indexToRemove) => {
    const newGifts = (formData.items || []).filter(
      (_, index) => index !== indexToRemove
    );
    onFormDataChange("items", newGifts);
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
            className="px-4 py-2 bg-brandPurple text-white rounded-lg"
          >
            Add Gift
          </button>
        </div>

        <div className="space-y-4">
          {(formData.items || []).map((gift, index) => (
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
                  value={gift.name}
                  onChange={(e) =>
                    handleGiftChange(index, "name", e.target.value)
                  }
                />
                <InputWithFullBoarder
                  label="Item Link"
                  value={gift.link}
                  onChange={(e) =>
                    handleGiftChange(index, "link", e.target.value)
                  }
                />
                <InputWithFullBoarder
                  label={`Price (${
                    userDetail?.data?.user?.currency === "NGN" ? "NGN" : "USD"
                  })`}
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
          value={formData.donation?.bank_name}
          onChange={(e) =>
            onFormDataChange("donation.bank_name", e.target.value)
          }
        />
        <InputWithFullBoarder
          label="Account Number"
          value={formData.donation?.account_number}
          onChange={(e) =>
            onFormDataChange("donation.account_number", e.target.value)
          }
        />
        <InputWithFullBoarder
          label="Account Name"
          value={formData.donation.account_name}
          onChange={(e) =>
            onFormDataChange("donation.account_name", e.target.value)
          }
        />
      </div>
    </div>
  );
};
