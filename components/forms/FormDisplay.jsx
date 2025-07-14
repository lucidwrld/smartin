"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, Send, CheckCircle, AlertCircle } from "lucide-react";
import CustomButton from "@/components/Button";
import InputWithFullBoarder from "@/components/InputWithFullBoarder";
import Loader from "@/components/Loader";
import { GetPublicFormManager } from "@/app/events/controllers/forms/getPublicFormController";

import { toast } from "react-toastify";
import CreateFormSubmissionManager from "@/app/events/controllers/forms/createFormSubmissionController";

const FormDisplay = ({
  formId,
  eventId,
  onClose,
  onSubmitSuccess,
  showBackButton = true,
  headerTitle = "Complete Form",
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    responses: [],
  });
  const [validationErrors, setValidationErrors] = useState({});

  // Controllers
  const {
    data: formResponse,
    isLoading: loadingForm,
    error: formError,
  } = GetPublicFormManager({
    formId,
    enabled: Boolean(formId),
  });

  const {
    createFormSubmission,
    isLoading: submitting,
    isSuccess: submitSuccess,
    error: submitError,
  } = CreateFormSubmissionManager(eventId, formId);

  const form = formResponse?.data;

  useEffect(() => {
    if (form && form.fields) {
      // Initialize responses array based on form fields
      const initialResponses = form.fields.map((field) => ({
        type: field.type,
        label: field.label,
        response: "",
      }));
      setFormData((prev) => ({ ...prev, responses: initialResponses }));
    }
  }, [form]);

  useEffect(() => {
    if (submitSuccess) {
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
    }
  }, [submitSuccess, onSubmitSuccess]);

  const handleInputChange = (fieldIndex, value) => {
    setFormData((prev) => {
      const newResponses = [...prev.responses];
      newResponses[fieldIndex] = {
        ...newResponses[fieldIndex],
        response: value,
      };
      return { ...prev, responses: newResponses };
    });

    // Clear validation error for this field
    if (validationErrors[`field_${fieldIndex}`]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[`field_${fieldIndex}`];
        return newErrors;
      });
    }
  };

  const handleBasicInfoChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear validation error
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const errors = {};

    // Validate basic info
    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    }

    // Validate form fields
    form.fields.forEach((field, index) => {
      if (field.required && !formData.responses[index]?.response?.trim()) {
        errors[`field_${index}`] = `${field.label} is required`;
      }
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }

    await createFormSubmission(formData);
  };

  const renderFormField = (field, index) => {
    const value = formData.responses[index]?.response || "";
    const error = validationErrors[`field_${index}`];

    switch (field.type) {
      case "text":
      case "email":
      case "phone":
        return (
          <InputWithFullBoarder
            key={index}
            label={field.label}
            type={field.type}
            value={value}
            onChange={(e) => handleInputChange(index, e.target.value)}
            placeholder={
              field.placeholder || `Enter ${field.label.toLowerCase()}`
            }
            isRequired={field.required}
            customErrorMessage={error}
          />
        );

      case "textarea":
        return (
          <InputWithFullBoarder
            key={index}
            label={field.label}
            value={value}
            onChange={(e) => handleInputChange(index, e.target.value)}
            placeholder={
              field.placeholder || `Enter ${field.label.toLowerCase()}`
            }
            isTextArea={true}
            rows={4}
            isRequired={field.required}
            customErrorMessage={error}
          />
        );

      case "select":
        return (
          <div key={index} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label}
              {field.required && <span className="text-red-600 ml-1">*</span>}
            </label>
            <select
              value={value}
              onChange={(e) => handleInputChange(index, e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 ${
                error ? "border-red-500" : "border-gray-300"
              }`}
              required={field.required}
            >
              <option value="">Select {field.label}</option>
              {field.options?.map((option, optionIndex) => (
                <option key={optionIndex} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>
        );

      case "radio":
        return (
          <div key={index} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {field.label}
              {field.required && <span className="text-red-600 ml-1">*</span>}
            </label>
            <div className="space-y-2">
              {field.options?.map((option, optionIndex) => (
                <label key={optionIndex} className="flex items-center">
                  <input
                    type="radio"
                    name={`field_${index}`}
                    value={option}
                    checked={value === option}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    className="mr-2 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm">{option}</span>
                </label>
              ))}
            </div>
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>
        );

      case "checkbox":
        return (
          <div key={index} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {field.label}
              {field.required && <span className="text-red-600 ml-1">*</span>}
            </label>
            <div className="space-y-2">
              {field.options?.map((option, optionIndex) => (
                <label key={optionIndex} className="flex items-center">
                  <input
                    type="checkbox"
                    value={option}
                    checked={value.includes(option)}
                    onChange={(e) => {
                      const currentValues = value
                        .split(",")
                        .filter((v) => v.trim());
                      if (e.target.checked) {
                        handleInputChange(
                          index,
                          [...currentValues, option].join(", ")
                        );
                      } else {
                        handleInputChange(
                          index,
                          currentValues.filter((v) => v !== option).join(", ")
                        );
                      }
                    }}
                    className="mr-2 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm">{option}</span>
                </label>
              ))}
            </div>
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>
        );

      default:
        return (
          <InputWithFullBoarder
            key={index}
            label={field.label}
            value={value}
            onChange={(e) => handleInputChange(index, e.target.value)}
            placeholder={
              field.placeholder || `Enter ${field.label.toLowerCase()}`
            }
            isRequired={field.required}
            customErrorMessage={error}
          />
        );
    }
  };

  if (loadingForm) {
    return <Loader />;
  }

  if (formError || !form) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Form Not Available
          </h2>
          <p className="text-gray-600 mb-4">
            {formError?.message || "The requested form could not be loaded."}
          </p>
          {showBackButton && onClose && (
            <CustomButton
              buttonText="Go Back"
              onClick={onClose}
              prefixIcon={<ArrowLeft className="w-4 h-4" />}
              buttonColor="bg-gray-600"
              radius="rounded-md"
            />
          )}
        </div>
      </div>
    );
  }

  if (submitSuccess) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="text-center">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Form Submitted Successfully!
          </h2>
          <p className="text-gray-600 mb-4">
            Thank you for completing the form. Your information has been
            recorded.
          </p>
          {onClose && (
            <CustomButton
              buttonText="Continue"
              onClick={onClose}
              buttonColor="bg-green-600"
              radius="rounded-md"
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          {showBackButton && onClose && (
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 rounded"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              {headerTitle}
            </h1>
            <p className="text-gray-600">{form.name}</p>
          </div>
        </div>
      </div>

      {/* Form Description */}
      {form.description && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-gray-700">{form.description}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputWithFullBoarder
            label="Full Name"
            value={formData.name}
            onChange={(e) => handleBasicInfoChange("name", e.target.value)}
            placeholder="Enter your full name"
            isRequired={true}
            customErrorMessage={validationErrors.name}
          />
          <InputWithFullBoarder
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(e) => handleBasicInfoChange("email", e.target.value)}
            placeholder="Enter your email address"
            isRequired={true}
            customErrorMessage={validationErrors.email}
          />
        </div>

        {/* Dynamic Form Fields */}
        {form.fields && form.fields.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Form Details</h3>
            {form.fields.map((field, index) => renderFormField(field, index))}
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end pt-6">
          <CustomButton
            buttonText="Submit Form"
            type="submit"
            isLoading={submitting}
            prefixIcon={<Send className="w-4 h-4" />}
            buttonColor="bg-purple-600"
            radius="rounded-md"
          />
        </div>
      </form>
    </div>
  );
};

export default FormDisplay;
