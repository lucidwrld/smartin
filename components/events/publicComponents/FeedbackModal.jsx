"use client";

import React, { useState, useEffect } from "react";
import { X, Star, Send } from "lucide-react";
import InputWithFullBoarder from "@/components/InputWithFullBoarder";
import CustomButton from "@/components/Button";
import MediaCapture from "./MediaCapture";

import useGetInviteByCodeManager from "@/app/events/controllers/getInviteByCodeController";
import useFileUpload from "@/utils/fileUploadController";
import { SubmitFeedbackManager } from "@/app/events/controllers/feedbacks/submitFeedbackController";

const StarRating = ({ rating, onRatingChange }) => {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log("Star clicked:", star);
            onRatingChange(star);
          }}
          onMouseEnter={() => setHoverRating(star)}
          onMouseLeave={() => setHoverRating(0)}
          className="focus:outline-none"
        >
          <Star
            size={32}
            className={`transition-colors ${
              star <= (hoverRating || rating)
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300"
            }`}
          />
        </button>
      ))}
    </div>
  );
};

const FeedbackModal = ({ isOpen, onClose, eventId }) => {
  const [step, setStep] = useState(1); 
  const [inviteCode, setInviteCode] = useState("");
  const [codeToValidate, setCodeToValidate] = useState("");  
  const [validatedInvite, setValidatedInvite] = useState(null);
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState("");

  // Feedback form state
  const [formData, setFormData] = useState({
    rating: 0,
    comment: "",
    designation: "",
    company: "",
    media: [],
  });
  const [capturedMedia, setCapturedMedia] = useState(null);

  // Debug logging
  useEffect(() => {
    console.log("FeedbackModal state:", {
      step,
      inviteCode,
      codeToValidate,
      isValidating,
      formData,
      capturedMedia,
    });
  }, [step, inviteCode, codeToValidate, isValidating, formData, capturedMedia]);

  // Hooks
  const {
    submitFeedback,
    isLoading: submitting,
    isSuccess,
  } = SubmitFeedbackManager();
  const { handleFileUpload, isLoading: uploadingFile } = useFileUpload();

  // ✅ FIX: Only call API when we actually have a code to validate
  const { data: inviteData, isLoading: checkingCode } =
    useGetInviteByCodeManager({
      code: codeToValidate,
      enabled: Boolean(codeToValidate && codeToValidate.trim().length > 0), // Only call when we have a code
    });

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      console.log("Modal opened - resetting form");
      setStep(1);
      setInviteCode("");
      setCodeToValidate(""); // ✅ FIX: This prevents immediate API calls
      setValidatedInvite(null);
      setValidationError("");
      setFormData({
        rating: 0,
        comment: "",
        designation: "",
        company: "",
        media: [],
      });
      setCapturedMedia(null);
    }
  }, [isOpen]);

  // Handle successful feedback submission
  useEffect(() => {
    if (isSuccess) {
      console.log("Feedback submitted successfully - closing modal");
      onClose();
      // You can add a success toast here
    }
  }, [isSuccess, onClose]);

  // Handle invite validation response
  useEffect(() => {
    if (codeToValidate && inviteData) {
      console.log("Invite validation response:", inviteData);
      setIsValidating(false);
      if (inviteData?.event?.id === eventId) {
        setValidatedInvite(inviteData);
        setStep(2);
        setValidationError("");
      } else {
        setValidationError("This invitation code is not valid for this event");
      }
    } else if (codeToValidate && !checkingCode && !inviteData) {
      console.log("Invalid invite code");
      setIsValidating(false);
      setValidationError(
        "Invalid invitation code. Please check and try again."
      );
    }
  }, [inviteData, codeToValidate, eventId, checkingCode]);

  // Validate invite code - only triggers when user clicks button
  const validateInviteCode = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    console.log("Validating invite code:", inviteCode);

    if (!inviteCode.trim()) {
      setValidationError("Please enter your invitation code");
      return;
    }

    setIsValidating(true);
    setValidationError("");
    setCodeToValidate(inviteCode.trim()); // ✅ This triggers the API call ONLY when user clicks
  };

  // Handle form input changes
  const handleInputChange = (field, value) => {
    console.log("Form input changed:", field, value);
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle media capture
  const handleMediaCapture = (mediaFile) => {
    console.log("Media captured:", mediaFile);
    setCapturedMedia(mediaFile);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    console.log("Form submission started");

    // Validation: User must provide either a comment OR media (not both required)
    const hasComment = formData.comment.trim().length > 0;
    const hasMedia = capturedMedia !== null;

    console.log("Validation check:", { hasComment, hasMedia });

    if (!hasComment && !hasMedia) {
      alert(
        "Please provide either a comment or upload a photo/video to share your feedback"
      );
      return;
    }

    try {
      let mediaUrls = [];

      // Upload media if present
      if (capturedMedia) {
        console.log("Uploading media...");
        const mediaUrl = await handleFileUpload(capturedMedia);
        mediaUrls.push(mediaUrl);
      }

      const feedbackData = {
        event: eventId,
        invitee_code: inviteCode,
        rating: formData.rating || 0, // Default to 0 if not provided
        comment: formData.comment.trim(),
        designation: formData.designation.trim(),
        company: formData.company.trim(),
        media: mediaUrls,
      };

      console.log("Submitting feedback:", feedbackData);
      await submitFeedback(feedbackData);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Failed to submit feedback. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">
            {step === 1 ? "Verify Your Invitation" : "Share Your Feedback"}
          </h2>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log("Closing modal");
              onClose();
            }}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 1 ? (
            // Step 1: Validate invite code
            <div className="space-y-4">
              <p className="text-gray-600">
                Please enter your invitation code to leave feedback for this
                event.
              </p>

              <InputWithFullBoarder
                label="Invitation Code"
                value={inviteCode}
                onChange={(e) => {
                  console.log("Invite code input changed:", e.target.value);
                  setInviteCode(e.target.value);
                  // ✅ Clear validation error when user types
                  if (validationError) {
                    setValidationError("");
                  }
                }}
                placeholder="Enter your invitation code"
                isRequired
                onKeyPress={(e) => {
                  // Allow Enter key to trigger validation
                  if (e.key === "Enter") {
                    e.preventDefault();
                    validateInviteCode(e);
                  }
                }}
              />

              {validationError && (
                <p className="text-red-500 text-sm">{validationError}</p>
              )}

              <div className="flex justify-end gap-3">
                <CustomButton
                  buttonText="Cancel"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onClose();
                  }}
                  buttonColor="bg-gray-100"
                  textColor="text-gray-700"
                  radius="rounded-full"
                />
                <CustomButton
                  buttonText="Verify Code"
                  onClick={validateInviteCode}
                  isLoading={isValidating || checkingCode}
                  radius="rounded-full"
                  disabled={!inviteCode.trim()}
                />
              </div>
            </div>
          ) : (
            // Step 2: Feedback form
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="text-center">
                <p className="text-gray-600 mb-2">
                  Hello {validatedInvite?.name}! How was your experience?
                </p>
                <p className="text-sm text-gray-500">
                  Please share either a comment or upload media to tell us about
                  your experience.
                </p>
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rate your experience (optional)
                </label>
                <div className="flex justify-center">
                  <StarRating
                    rating={formData.rating}
                    onRatingChange={(rating) =>
                      handleInputChange("rating", rating)
                    }
                  />
                </div>
              </div>

              {/* Comment */}
              <InputWithFullBoarder
                label="Your Feedback"
                value={formData.comment}
                onChange={(e) => handleInputChange("comment", e.target.value)}
                placeholder="Tell us about your experience... (required if no media uploaded)"
                isTextArea
                rows={4}
                maxLength={500}
                className={"h-[200px]"}
                showCharacterCount
              />

              {/* Media Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Share a photo or video (required if no comment provided)
                </label>
                <MediaCapture
                  onMediaCapture={handleMediaCapture}
                  currentMedia={capturedMedia}
                />
              </div>

              {/* Optional fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputWithFullBoarder
                  label="Your Title/Position (optional)"
                  value={formData.designation}
                  onChange={(e) =>
                    handleInputChange("designation", e.target.value)
                  }
                  placeholder="e.g., Manager, Director"
                />

                <InputWithFullBoarder
                  label="Company/Organization (optional)"
                  value={formData.company}
                  onChange={(e) => handleInputChange("company", e.target.value)}
                  placeholder="e.g., ABC Corporation"
                />
              </div>

              {/* Submit buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <CustomButton
                  buttonText="Back"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log("Going back to step 1");
                    setStep(1);
                  }}
                  buttonColor="bg-gray-100"
                  textColor="text-gray-700"
                  radius="rounded-full"
                />
                <CustomButton
                  buttonText="Submit Feedback"
                  type="submit"
                  isLoading={submitting || uploadingFile}
                  prefixIcon={<Send size={16} />}
                  radius="rounded-full"
                />
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;
