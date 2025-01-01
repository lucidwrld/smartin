import React, { useState } from "react";
import { X } from "lucide-react";
import useGetDiscountsManager from "@/app/admin/settings/controllers/getDiscountsController";

const DiscountModal = () => {
  const { data: discounts, isLoading } = useGetDiscountsManager();
  const [isOpen, setIsOpen] = useState(false);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setIsOpen(false);
    }
  };

  const data = discounts?.data || [];

  // Filter out partner discounts
  const defaultDiscounts = data.filter(
    (discount) => discount.type === "default"
  );

  const formatDiscountDisplay = (discount) => {
    const nextTier = defaultDiscounts.find(
      (d) => d.no_of_invites > discount.no_of_invites
    );
    if (nextTier) {
      return `${discount.no_of_invites}-${nextTier.no_of_invites - 1}`;
    }
    return `${discount.no_of_invites}+`;
  };

  // Sort default discounts by number of invites
  const sortedDiscounts = [...defaultDiscounts].sort(
    (a, b) => a.no_of_invites - b.no_of_invites
  );

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="mt-4 bg-white text-brandPurple px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
      >
        Learn More
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
          onClick={handleOverlayClick}
        >
          <div className="bg-white rounded-lg w-full max-w-md relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>

            <div className="bg-purple-600 text-white p-6 rounded-t-lg">
              <h2 className="text-2xl font-bold">Special Discount Offers</h2>
              <p className="mt-2 text-purple-100">
                The more invites you send, the more you save!
              </p>
            </div>

            <div className="p-6">
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading discounts...</p>
                </div>
              ) : sortedDiscounts.length === 0 ? (
                <div className="text-center py-8 text-gray-600">
                  No discounts available at the moment
                </div>
              ) : (
                <div className="space-y-4">
                  {sortedDiscounts.map((discount) => (
                    <div
                      key={discount.id}
                      className="flex justify-between items-center p-4 bg-purple-50 rounded-lg"
                    >
                      <div className="space-y-1">
                        <span className="font-semibold text-purple-900">
                          {formatDiscountDisplay(discount)} invites
                        </span>
                      </div>
                      <div className="text-purple-600 font-bold text-lg">
                        {discount.percent}% OFF
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={() => setIsOpen(false)}
                className="mt-6 w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscountModal;
