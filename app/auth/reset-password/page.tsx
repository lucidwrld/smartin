"use client";
import InputWithFullBoarder from "@/components/InputWithFullBoarder";
import AuthShell from "@/components/auth/AuthShell";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import OTPInput from "react-otp-input";
import { ForgotPasswordManager } from "../forgot-password/controller/forgotpassword_controller";
import { ResetPasswordManager } from "./controller/reset_password_controller";
import { validateFormSubmission } from "@/utils/validateForm";

const ResetPasswordPage = () => {
  const router = useRouter();
  const formRef = useRef(null);
  const search = useSearchParams();
  const email = search.get("email");

  const initialData = {
    password: "",
    otp: "",
  };

  const [formData, setFormData] = useState(initialData);
  const [viewPassword, setViewPassword] = useState(false);

  const { sendEmail, isLoading } = ForgotPasswordManager(email);
  const {
    resetPassword,
    isLoading: resetting,
    isSuccess,
  } = ResetPasswordManager({
    password: formData.password,
  });

  useEffect(() => {
    if (isSuccess) {
      router.push("/auth/login");
    }
  }, [isSuccess]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateFormSubmission(formRef, formData)) {
      return;
    }

    const details = {
      token: formData.otp,
      password: formData.password,
    };

    await resetPassword(details);
  };

  return (
    <AuthShell
      title="Reset Password"
      subtitle1="Enter OTP code and a new password for your account"
      isLoading={resetting}
      buttonText="Reset Password"
      form="resetPasswordForm"
    >
      <div className="w-full h-fit">
        <form id="resetPasswordForm" ref={formRef} onSubmit={handleSubmit}>
          <div className="flex flex-col w-full relative gap-7">
            <OTPInput
              containerStyle="w-full items-center text-black text-[24px] font-normal justify-center flex mb-0"
              inputStyle={{
                backgroundColor: "#F4F4F4",
                width: 50,
                height: 50,
                borderRadius: "5px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                accentColor: "#000000",
                border: 2,
                borderColor: `#000000`,
              }}
              inputType="tel"
              value={formData.otp}
              onChange={(value) => setFormData({ ...formData, otp: value })}
              placeholder={0}
              numInputs={6}
              renderSeparator={<span className="mr-3"></span>}
              renderInput={(props) => (
                <input className="w-16 border border-black" {...props} />
              )}
            />

            <InputWithFullBoarder
              hasSuffix={true}
              label="Password"
              id="password"
              isRequired={true}
              type={viewPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              icon={
                viewPassword ? (
                  <AiOutlineEyeInvisible
                    onClick={() => setViewPassword(!viewPassword)}
                  />
                ) : (
                  <AiOutlineEye
                    onClick={() => setViewPassword(!viewPassword)}
                  />
                )
              }
            />
          </div>
        </form>
      </div>

      <p className="text-14px text-textGrey text-center w-full">
        Didn't receive code?
        <span
          role="button"
          className="text-brandOrange ml-2"
          onClick={() => sendEmail({ email: email })}
        >
          {isLoading ? "Resending..." : "Resend again"}
        </span>
      </p>
    </AuthShell>
  );
};

export default ResetPasswordPage;
