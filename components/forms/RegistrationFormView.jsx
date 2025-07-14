"use client";

import React, { useState } from "react";
import Image from "next/image";
import { logoMain1 } from "@/public/images";
import GetPublicFormManager from "@/app/events/controllers/forms/getPublicFormController";
import CreateFormSubmissionManager from "@/app/events/controllers/forms/createFormSubmissionController";
import { toast } from "react-toastify";

const RegistrationFormView = ({
  eventId,
  requiredForms,
  currentFormIndex,
  setCurrentFormIndex,
  onBackToInvitation,
  onFormSubmissionComplete,
  initialFormData = {},
}) => {
  const [formData, setFormData] = useState(initialFormData);

  // Current form for display
  const currentForm = requiredForms[currentFormIndex];

  // Fetch current form data
  const { data: currentFormData, isLoading: isFormLoading } = GetPublicFormManager({
    formId: currentForm?.id,
    enabled: Boolean(currentForm?.id),
  });

  // Form submission
  const { createFormSubmission, isLoading: isSubmitting } =
    CreateFormSubmissionManager(eventId, currentForm?.id || "");

  // Handle form field changes
  const handleFormFieldChange = (fieldId, value) => {
    setFormData((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!currentFormData?.data) return;

    const form = currentFormData.data;
    const responses = form.form_fields.map((field) => ({
      type: field.type,
      label: field.label,
      response: formData[field._id] || "",
    }));

    // Validate required fields
    if (!formData.name || !formData.name.trim()) {
      toast.error("Please enter your full name");
      return;
    }

    if (!formData.email || !formData.email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      await createFormSubmission({
        name: formData.name.trim(),
        email: formData.email.trim(),
        responses,
      });

      // Move to next form or complete registration
      if (currentFormIndex < requiredForms.length - 1) {
        setCurrentFormIndex((prev) => prev + 1);
        setFormData({
          name: formData.name, // Keep name and email for next form
          email: formData.email,
        });
      } else {
        // All forms completed
        onFormSubmissionComplete();
      }
    } catch (error) {
      toast.error("Failed to submit form. Please try again.");
    }
  };

  return (
    <div className="min-h-screen text-brandBlack">
      {/* Header */}
      <header className="w-full bg-white shadow-sm py-4 px-6">
        <div className="container mx-auto flex justify-between items-center">
          <Image src={logoMain1} alt="Logo" className="h-10 w-auto" />
          <div className="flex items-center gap-4">
            <button
              onClick={onBackToInvitation}
              className="text-gray-600 hover:text-gray-800"
            >
              ← Back to Invitation
            </button>
            <h1 className="text-xl font-medium text-brandBlack">Complete Registration</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 max-w-4xl py-8 pb-16">
        <div className="bg-white rounded-lg shadow-sm border p-8 w-full">
          {/* Form Progress */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-black">Registration Form</h2>
              <span className="text-gray-600">
                Form {currentFormIndex + 1} of {requiredForms.length}
              </span>
            </div>
            {/* Progress Bar */}
            <div className="bg-gray-200 rounded-full h-2">
              <div
                className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${((currentFormIndex + 1) / requiredForms.length) * 100}%`,
                }}
              ></div>
            </div>
          </div>

          {/* Form Content */}
          {isFormLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full"></div>
              <span className="ml-3 text-gray-600">Loading form...</span>
            </div>
          ) : currentFormData?.data ? (
            <form onSubmit={handleFormSubmit} className="space-y-6 w-full">
              {/* Form Title and Description */}
              <div className="text-center">
                <h3 className="text-xl font-semibold text-black mb-2">
                  {currentFormData.data.description}
                </h3>
              </div>

              {/* Basic Information - Only show for first form */}
              {currentFormIndex === 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name || ""}
                      onChange={(e) =>
                        handleFormFieldChange("name", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black bg-gray-50"
                      placeholder="Enter your full name"
                      required
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={formData.email || ""}
                      onChange={(e) =>
                        handleFormFieldChange("email", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black"
                      placeholder="Enter your email address"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Form Fields */}
              <div className="space-y-4">
                {currentFormData.data.form_fields?.map((field) => (
                  <div key={field._id}>
                    <label className="block text-sm font-medium text-black mb-2">
                      {field.label}
                      {currentFormData.data.is_required &&
                        field.required && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                    </label>
                    {field.type === "text" && (
                      <input
                        type="text"
                        value={formData[field._id] || ""}
                        onChange={(e) =>
                          handleFormFieldChange(field._id, e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black"
                        placeholder={field.placeholder || `Enter ${field.label}`}
                        required={field.required}
                      />
                    )}
                    {field.type === "textarea" && (
                      <textarea
                        value={formData[field._id] || ""}
                        onChange={(e) =>
                          handleFormFieldChange(field._id, e.target.value)
                        }
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black"
                        placeholder={field.placeholder || `Enter ${field.label}`}
                        required={field.required}
                      />
                    )}
                    {field.type === "select" && (
                      <select
                        value={formData[field._id] || ""}
                        onChange={(e) =>
                          handleFormFieldChange(field._id, e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black"
                        required={field.required}
                      >
                        <option value="">Select {field.label}</option>
                        {field.options?.map((option, idx) => (
                          <option key={idx} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    )}
                    {field.type === "radio" && (
                      <div className="space-y-2">
                        {field.options?.map((option, idx) => (
                          <label key={idx} className="flex items-center">
                            <input
                              type="radio"
                              name={field._id}
                              value={option}
                              checked={formData[field._id] === option}
                              onChange={(e) =>
                                handleFormFieldChange(field._id, e.target.value)
                              }
                              className="mr-2 text-orange-500"
                              required={field.required}
                            />
                            <span className="text-black">{option}</span>
                          </label>
                        ))}
                      </div>
                    )}
                    {field.type === "checkbox" && (
                      <div className="space-y-2">
                        {field.options?.map((option, idx) => (
                          <label key={idx} className="flex items-center">
                            <input
                              type="checkbox"
                              value={option}
                              checked={(formData[field._id] || "").includes(option)}
                              onChange={(e) => {
                                const currentValues = (formData[field._id] || "")
                                  .split(",")
                                  .filter((v) => v.trim());
                                if (e.target.checked) {
                                  handleFormFieldChange(
                                    field._id,
                                    [...currentValues, option].join(", ")
                                  );
                                } else {
                                  handleFormFieldChange(
                                    field._id,
                                    currentValues.filter((v) => v !== option).join(", ")
                                  );
                                }
                              }}
                              className="mr-2 text-orange-500"
                            />
                            <span className="text-black">{option}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center pt-6">
                <div>
                  {currentFormIndex > 0 && (
                    <button
                      type="button"
                      onClick={() => setCurrentFormIndex((prev) => prev - 1)}
                      className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Previous
                    </button>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Submitting...
                    </div>
                  ) : currentFormIndex === requiredForms.length - 1 ? (
                    "Complete Registration"
                  ) : (
                    "Next"
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center py-8">
              <p className="text-red-500">Failed to load form. Please try again.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default RegistrationFormView;