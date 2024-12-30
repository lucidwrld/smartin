// PaymentProofModal.js
import React, { useEffect, useState } from "react";
import { Upload } from "lucide-react";
import { SubmitBankPaymentManager } from "@/app/events/controllers/submitBankPaymentController";
import useFileUpload from "@/utils/fileUploadController";
import CustomButton from "../Button";

export const PaymentProofModal = ({
  isOpen,
  onClose,
  eventId,
  setIsCancel,
}) => {
  const [image, setImage] = useState(null);
  const {
    submitPayment,
    isLoading: submittingProof,
    isSuccess,
  } = SubmitBankPaymentManager();
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      onClose();
    }
  }, [isSuccess]);

  const {
    progress,
    handleFileUpload,
    isLoading: uploadingFile,
  } = useFileUpload();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-2">Proof of Payment</h2>
        <p className="text-gray-600 mb-6">
          Please upload payment proof to create the event.
        </p>

        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="payment-proof"
            />
            <label
              htmlFor="payment-proof"
              className="flex flex-col items-center cursor-pointer"
            >
              <Upload className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-sm text-gray-600">
                Upload your image here
              </span>
              <span className="mt-2 px-4 py-2 bg-gray-100 rounded-md text-sm">
                Browse files
              </span>
            </label>
          </div>

          {image && (
            <p className="text-sm text-green-600">
              Selected file: {image.name}
            </p>
          )}

          <div className="flex justify-end gap-3">
            <CustomButton
              buttonText={"Cancel"}
              buttonColor={"bg-whiteColor border border-brandBlack"}
              textColor={"text-brandBlack"}
              className={"w-1/3"}
              onClick={() => {
                setIsCancel(true);
                onClose();
              }}
            />

            <CustomButton
              buttonText={"Submit Proof of Payment"}
              isLoading={submittingProof || uploadingFile}
              className={"w-2/3"}
              onClick={async () => {
                let imageUrl = "";
                if (image) {
                  imageUrl = await handleFileUpload(image);
                  // updatedFormData.image = imageUrl;
                }
                const details = {
                  eventId: eventId,
                  image: imageUrl,
                  currency: "NGN",
                };
                await submitPayment(details);
              }}
              disabled={!image}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
