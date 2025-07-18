"use client";

import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  User,
  Mail,
  Key,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";

// Import controllers
import useGetSingleSessionManager from "@/app/events/controllers/sessions/controllers/getSingleSessionController";
import SessionRegistrationManager from "@/app/events/controllers/sessions/controllers/sessionRegistrationController";
import useGetInviteByCodeManager from "@/app/events/controllers/getInviteByCodeController";
import GetEventFormsManager from "@/app/events/controllers/forms/getEventFormsController";
import GetPublicFormManager from "@/app/events/controllers/forms/getPublicFormController";
import CreateFormSubmissionManager from "@/app/events/controllers/forms/createFormSubmissionController";

interface SessionRegistrationProps {
  params: Promise<{ eventId: string; sessionId: string }>;
}

const SessionRegistration: React.FC<SessionRegistrationProps> = ({ params }) => {
  const { eventId, sessionId } = React.use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const accessCodeFromUrl = searchParams.get("accessCode") || searchParams.get("c");

  // State management
  const [registrationStep, setRegistrationStep] = useState<"code" | "forms" | "success">("code");
  const [currentFormIndex, setCurrentFormIndex] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [inviteCode, setInviteCode] = useState(accessCodeFromUrl || "");

  // Get session details
  const { data: sessionData, isLoading: loadingSession } = useGetSingleSessionManager({
    sessionId,
    enabled: Boolean(sessionId),
  });

  // Get invite details from code
  const { data: inviteData, isLoading: loadingInvite } = useGetInviteByCodeManager({
    code: inviteCode,
    enabled: Boolean(inviteCode),
  });

  // Get event forms
  const { data: formsData, isLoading: loadingForms } = GetEventFormsManager({
    eventId,
    enabled: Boolean(eventId),
  });

  // Session registration manager
  const { registerForSession, isLoading: registering, isSuccess: registrationSuccess } = 
    SessionRegistrationManager(sessionId);

  // Get session forms
  const sessionForms = formsData?.data?.filter(form => 
    sessionData?.data?.forms?.includes(form._id)
  ) || [];
  
  // Get current form data
  const currentForm = sessionForms[currentFormIndex];
  const { data: currentFormData, isLoading: isFormLoading } = GetPublicFormManager({
    formId: currentForm?._id,
    enabled: Boolean(currentForm?._id && registrationStep === "forms"),
  });

  // Form submission manager
  const { createFormSubmission, isLoading: isSubmitting } = CreateFormSubmissionManager(
    eventId,
    currentForm?._id || ""
  );

  // Handle invite code submission
  const handleSubmitCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCode.trim()) {
      toast.error("Please enter your invite code");
      return;
    }

    // The useGetInviteByCodeManager will automatically fetch when inviteCode changes
    // We just need to wait for the response
  };

  // Handle successful invite code verification
  useEffect(() => {
    if (inviteData && !loadingInvite && inviteCode) {
      // Check if we have forms to fill
      if (sessionForms.length > 0) {
        setRegistrationStep("forms");
        setCurrentFormIndex(0);
      } else {
        // No forms, register directly
        handleRegister();
      }
    }
  }, [inviteData, loadingInvite, sessionForms.length, inviteCode]);

  // Handle session registration
  const handleRegister = async () => {
    if (!inviteCode) {
      toast.error("Invite code is required for registration");
      return;
    }

    try {
      await registerForSession({
        invitee_code: inviteCode,
      });
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Failed to register for session");
    }
  };

  // Handle successful registration
  useEffect(() => {
    if (registrationSuccess) {
      setRegistrationStep("success");
    }
  }, [registrationSuccess]);

  // Handle form field changes
  const handleFormFieldChange = (fieldId: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  // Handle form submission
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentFormData?.data) return;

    const form = currentFormData.data;
    const responses = form.form_fields.map((field: any) => ({
      type: field.type,
      label: field.label,
      response: formData[field._id] || "",
    }));

    try {
      await createFormSubmission({
        email: inviteData?.email || "",
        name: inviteData?.name || "",
        responses,
      });

      // Move to next form or register for session
      if (currentFormIndex < sessionForms.length - 1) {
        setCurrentFormIndex(prev => prev + 1);
        setFormData({});
      } else {
        // All forms completed, now register for session
        await handleRegister();
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("Failed to submit form");
    }
  };

  // Render form field based on type
  const renderFormField = (field: any) => {
    const isRequired = field.required;
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
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
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
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            placeholder={field.placeholder}
            rows={4}
            required={isRequired}
          />
        );
      case "select":
        return (
          <select
            id={field._id}
            value={fieldValue}
            onChange={(e) => handleFormFieldChange(field._id, e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            required={isRequired}
          >
            <option value="">{field.placeholder || "Select an option"}</option>
            {field.options?.map((option: string, idx: number) => (
              <option key={idx} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      case "radio":
        return (
          <div className="space-y-2">
            {field.options?.map((option: string, idx: number) => (
              <label key={idx} className="flex items-center">
                <input
                  type="radio"
                  name={field._id}
                  value={option}
                  checked={fieldValue === option}
                  onChange={(e) => handleFormFieldChange(field._id, e.target.value)}
                  className="mr-2 text-purple-500 focus:ring-purple-500"
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
            {field.options?.map((option: string, idx: number) => (
              <label key={idx} className="flex items-center">
                <input
                  type="checkbox"
                  value={option}
                  checked={(fieldValue || []).includes(option)}
                  onChange={(e) => {
                    const currentValues = fieldValue || [];
                    const newValues = e.target.checked
                      ? [...currentValues, option]
                      : currentValues.filter((v: string) => v !== option);
                    handleFormFieldChange(field._id, newValues);
                  }}
                  className="mr-2 text-purple-500 focus:ring-purple-500"
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        );
      default:
        return (
          <input
            type="text"
            id={field._id}
            value={fieldValue}
            onChange={(e) => handleFormFieldChange(field._id, e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            placeholder={field.placeholder}
            required={isRequired}
          />
        );
    }
  };

  // Loading state
  if (loadingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  // Error state
  if (!sessionData?.data && !loadingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Session Not Found</h2>
          <p className="text-gray-600 mb-4">The session you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push(`/events/${eventId}`)}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            Back to Event
          </button>
        </div>
      </div>
    );
  }

  const session = sessionData?.data;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </button>
            <div className="text-sm text-gray-500">
              {registrationStep === "code" && "Enter Invite Code"}
              {registrationStep === "forms" && `Form ${currentFormIndex + 1} of ${sessionForms.length}`}
              {registrationStep === "success" && "Registration Complete"}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Session Info */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{session?.name}</h1>
              <p className="text-gray-600 mb-4">{session?.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>{new Date(session?.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span>{session?.start_time} - {session?.end_time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>{session?.location}</span>
                </div>
              </div>

              {session?.max_capacity && (
                <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                  <Users className="w-4 h-4" />
                  <span>Maximum capacity: {session.max_capacity} attendees</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Registration Content */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {registrationStep === "code" && (
            <div className="space-y-6">
              <div className="text-center">
                <Key className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Enter Your Invite Code
                </h2>
                <p className="text-gray-600 mb-6">
                  Please enter your invitation code to register for this session.
                </p>
              </div>

              <form onSubmit={handleSubmitCode} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Invite Code *
                  </label>
                  <input
                    type="text"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Enter your invite code"
                    required
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loadingInvite}
                    className="w-full px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loadingInvite ? "Verifying..." : "Continue"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {registrationStep === "forms" && inviteData && (
            <div className="space-y-6">
              {/* User Info Display */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-3">Registration Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span>{inviteData.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span>{inviteData.email}</span>
                  </div>
                </div>
              </div>

              {currentFormData?.data && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {currentFormData.data.description}
                  </h2>
                  <p className="text-sm text-gray-600 mb-6">
                    Form {currentFormIndex + 1} of {sessionForms.length}
                  </p>

                  <form onSubmit={handleFormSubmit} className="space-y-6">
                    <div className="space-y-4">
                      {currentFormData.data.form_fields.map((field: any) => (
                        <div key={field._id}>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {field.label}
                            {field.required && (
                              <span className="text-red-500 ml-1">*</span>
                            )}
                          </label>
                          {renderFormField(field)}
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-center pt-6">
                      <div>
                        {currentFormIndex > 0 && (
                          <button
                            type="button"
                            onClick={() => setCurrentFormIndex(prev => prev - 1)}
                            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                          >
                            Previous
                          </button>
                        )}
                      </div>
                      <button
                        type="submit"
                        disabled={isSubmitting || registering}
                        className="px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {isSubmitting || registering ? "Processing..." : 
                         currentFormIndex === sessionForms.length - 1 ? "Complete Registration" : "Next"}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {registrationStep === "success" && (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  Registration Complete!
                </h2>
                <p className="text-gray-600">
                  You have successfully registered for <strong>{session?.name}</strong>.
                </p>
                {inviteData && (
                  <p className="text-sm text-gray-500 mt-2">
                    Registered as: {inviteData.name} ({inviteData.email})
                  </p>
                )}
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">
                  You will receive a confirmation email shortly. Please keep this for your records.
                </p>
              </div>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => router.push(`/events/${eventId}/attendance?accessCode=${inviteCode}`)}
                  className="px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                >
                  View Event
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Register Another
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SessionRegistration;