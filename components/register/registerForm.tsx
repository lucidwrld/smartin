"use client"
import GetPublicFormManager from "@/app/events/controllers/forms/getPublicFormController";
import { X } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import UploadFileComponent from "../UploadFileComponent";
import { convertBytesToMB } from "@/utils/fileSize";
import CreateFormSubmissionManager from "@/app/events/controllers/forms/createFormSubmissionController";

export default function RegistrationForm({requiredForms, eventId,currentFormIndex, showRegistrationForms, setCurrentFormIndex, setShowRegistrationForms}){
    const [formData, setFormData] = useState({});
    const currentForm = requiredForms[currentFormIndex];
    const { createFormSubmission, isLoading: isSubmitting } =
        CreateFormSubmissionManager(eventId as string, currentForm?.id || "");
    const attachmentRef = useRef(null);
        const { data: currentFormData, isLoading: isFormLoading } =
          GetPublicFormManager({
            formId: currentForm?.id,
            enabled: Boolean(currentForm?.id && showRegistrationForms),
          });
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
      
            // Mark form as submitted
            setSubmittedForms((prev) => new Set([...prev, form._id]));
      
            // Move to next form or close if last form
            if (currentFormIndex < requiredForms.length - 1) {
              setCurrentFormIndex((prev) => prev + 1);
              setFormData({});
            } else {
              setShowRegistrationForms(false);
              setCurrentFormIndex(0);
              setFormData({});
              toast.success("Registration completed successfully!");
            }
          } catch (error) {
            toast.error("Failed to submit form. Please try again.");
          }
        };
      
        // Handle form navigation
        const handlePreviousForm = () => {
          if (currentFormIndex > 0) {
            setCurrentFormIndex((prev) => prev - 1);
          }
        };
      
        const handleNextForm = () => {
          if (currentFormIndex < requiredForms.length - 1) {
            setCurrentFormIndex((prev) => prev + 1);
          }
        };
      
        // Close registration forms
        const handleCloseRegistration = () => {
          setShowRegistrationForms(false);
          setCurrentFormIndex(0);
          setFormData({});
        };
        const handleFormFieldChange = (fieldId, value) => {
        setFormData((prev) => ({
          ...prev,
          [fieldId]: value,
        }));
      };
      
        // Render form field based on type
        const renderFormField = (field) => {
          const isRequired = currentFormData?.data?.is_required && field.required;
          const fieldValue = formData[field._id] || "";
      
          switch (field.type) {
            case "text":
            case "email":
            case "phone":
              return (
                <input
                  type={field.type}
                  id={field._id}
                  value={fieldValue}
                  onChange={(e) => handleFormFieldChange(field._id, e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder={field.placeholder}
                  required={isRequired}
                />
              );
            case "textarea":
              return (
                <textarea
                  id={field._id}
                  value={fieldValue}
                  onChange={(e) => handleFormFieldChange(field._id, e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder={field.placeholder}
                  rows={4}
                  required={isRequired}
                />
              );
            case "file":
                return(
                    <div className="w-full h-fit grid">
                        <UploadFileComponent 
                            description={`Upload your attachment`}
                            inputRef={attachmentRef}
                            isLoading={false}
                            format={`Image/PDF/Video`}
                            maxSize={
                            fieldValue ? convertBytesToMB(fieldValue.size) : `20`
                            }
                            fileName={fieldValue ? fieldValue.name : null}
                            progress={null}
                            accept={"video/*,application/pdf,image/*"}
                            files={[]} 
                            buttonClick={() => handleFormFieldChange(field._id, null)}
                            onChange={async (e) => {
                            const file = e.target.files[0];
                            handleFormFieldChange(field._id, file);
                            }}
                        />
                    </div> 
                )
            case "select":
              return (
                <select
                  id={field._id}
                  value={fieldValue}
                  onChange={(e) => handleFormFieldChange(field._id, e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  required={isRequired}
                >
                  <option value="">{field.placeholder || "Select an option"}</option>
                  {field.options.map((option, idx) => (
                    <option key={idx} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              );
            case "radio":
              return (
                <div className="space-y-2">
                  {field.options.map((option, idx) => (
                    <label key={idx} className="flex items-center">
                      <input
                        type="radio"
                        name={field._id}
                        value={option}
                        checked={fieldValue === option}
                        onChange={(e) =>
                          handleFormFieldChange(field._id, e.target.value)
                        }
                        className="mr-2 text-orange-500 focus:ring-orange-500"
                        required={isRequired}
                      />
                      <span className="text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
              );
            case "checkbox":
              return (
                <div className="space-y-2">
                  {field.options.map((option, idx) => (
                    <label key={idx} className="flex items-center">
                      <input
                        type="checkbox"
                        value={option}
                        checked={(fieldValue || []).includes(option)}
                        onChange={(e) => {
                          const currentValues = fieldValue || [];
                          if (e.target.checked) {
                            handleFormFieldChange(field._id, [
                              ...currentValues,
                              option,
                            ]);
                          } else {
                            handleFormFieldChange(
                              field._id,
                              currentValues.filter((v) => v !== option)
                            );
                          }
                        }}
                        className="mr-2 text-orange-500 focus:ring-orange-500"
                      />
                      <span className="text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
              );
            case "date":
              return (
                <input
                  type="date"
                  id={field._id}
                  value={fieldValue}
                  onChange={(e) => handleFormFieldChange(field._id, e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  required={isRequired}
                />
              );
            case "number":
              return (
                <input
                  type="number"
                  id={field._id}
                  value={fieldValue}
                  onChange={(e) => handleFormFieldChange(field._id, e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder={field.placeholder}
                  required={isRequired}
                />
              );
            default:
              return null;
          }
        };
    return(
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                          <div className="bg-[#FFF5FB] rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            <div className="pb-6">
                              {/* Header */}
                              <div className="flex p-6 items-center bg-[#F8EDFF] border-b-[1px] border-backgroundPurple justify-between mb-6">
                                <div>
                                  <h2 className="text-2xl font-bold text-gray-900">
                                    Event Registration
                                  </h2>
                                  <p className="text-gray-600 mt-1">
                                    Form {currentFormIndex + 1} of {requiredForms.length}
                                  </p>
                                </div>
                                <button
                                  onClick={handleCloseRegistration}
                                  className="text-gray-500 hover:text-gray-700"
                                >
                                  <X size={24} />
                                </button>
                              </div>
                
                              {/* Progress Bar */}
                              <div className="mb-6 px-6">
                                <div className="flex justify-between text-sm text-gray-600 mb-2">
                                  <span>Progress</span>
                                  <span>
                                    {Math.round(
                                      ((currentFormIndex + 1) / requiredForms.length) * 100
                                    )}
                                    %
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-signin h-2 rounded-full transition-all duration-300"
                                    style={{
                                      width: `${
                                        ((currentFormIndex + 1) / requiredForms.length) * 100
                                      }%`,
                                    }}
                                  />
                                </div>
                              </div>
                
                              {/* Form Content */}
                              {isFormLoading ? (
                                <div className="flex justify-center items-center py-8">
                                  <div className="animate-spin w-8 h-8 border-4 border-backgroundPurple border-t-transparent rounded-full"></div>
                                  <span className="ml-2 text-gray-600">Loading form...</span>
                                </div>
                              ) : currentFormData?.data ? (
                                <form onSubmit={handleFormSubmit} className="space-y-6 px-6">
                                  {/* Form Title */}
                                  <div className="text-center">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                      {currentFormData.data.description}
                                    </h3>
                                    {currentFormData.data.is_required && (
                                      <span className="inline-block px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                                        Required
                                      </span>
                                    )}
                                  </div>
                
                                  {/* Basic Fields */}
                                  {currentFormIndex === 0 && (
                                    <div className="space-y-4">
                                      <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                          Full Name *
                                        </label>
                                        <input
                                          type="text"
                                          value={formData.name || ""}
                                          onChange={(e) =>
                                            handleFormFieldChange("name", e.target.value)
                                          }
                                          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                          placeholder="Enter your full name"
                                          required
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                          Email Address *
                                        </label>
                                        <input
                                          type="email"
                                          value={formData.email || ""}
                                          onChange={(e) =>
                                            handleFormFieldChange("email", e.target.value)
                                          }
                                          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
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
                                        <label className="block text-sm capitalize font-medium text-gray-700 mb-2">
                                          {field.label}
                                          {currentFormData.data.is_required &&
                                            field.required && (
                                              <span className="text-red-500 ml-1">*</span>
                                            )}
                                        </label>
                                        {renderFormField(field)}
                                      </div>
                                    ))}
                                  </div>
                
                                  {/* Navigation Buttons */}
                                  <div className="flex justify-between items-center pt-6">
                                    <div>
                                      {currentFormIndex > 0 && (
                                        <button
                                          type="button"
                                          onClick={handlePreviousForm}
                                          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                                        >
                                          Previous
                                        </button>
                                      )}
                                    </div>
                
                                    <button
                                        type="submit" 
                                        className="px-6 py-3 w-full bg-signin text-white rounded-md hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                      >
                                        {  currentFormIndex === requiredForms.length - 1
                                          ? "Register"
                                          : "Next"}
                                      </button>
                                  </div>
                                </form>
                              ) : (
                                <div className="text-center py-8">
                                  <p className="text-gray-600">
                                    Unable to load form. Please try again.
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
    )
}