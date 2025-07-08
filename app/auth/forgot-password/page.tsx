"use client";
import InputWithFullBoarder from "@/components/InputWithFullBoarder";
import AuthShell from "@/components/auth/AuthShell";
import { useRouter } from "next/navigation";
import React, { useState, useRef } from "react";
import { ForgotPasswordManager } from "./controller/forgotpassword_controller";
import { validateFormSubmission } from "@/utils/validateForm";

const ForgotPasswordPage = () => {
  const router = useRouter();
  const formRef = useRef(null);

  const initialData = {
    email: "",
  };

  const [formData, setFormData] = useState(initialData);
  const { sendEmail, isLoading, isSuccess } = ForgotPasswordManager(
    formData.email
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateFormSubmission(formRef, formData)) {
      return;
    }

    await sendEmail({ email: formData.email });
  };

  return (
    <AuthShell
      title="Forgot Password"
      subtitle1="Enter your registered email address to reset your password"
      isLoading={isLoading}
      buttonText="Reset Password"
      form="forgotPasswordForm"
    >
      <div className="w-full h-fit">
        <form id="forgotPasswordForm" ref={formRef} onSubmit={handleSubmit}>
          <div className="flex flex-col w-full relative">
            <InputWithFullBoarder
              id="email"
              label="Email Address"
              type="email"
              isRequired={true}
              value={formData.email}
              customErrorMessage="Please input a valid email"
              onChange={(e) => {
                setFormData({
                  ...formData,
                  email: e.target.value.toLowerCase(),
                });
              }}
            />
          </div>
        </form>
      </div>
    </AuthShell>
  );
};

export default ForgotPasswordPage;
