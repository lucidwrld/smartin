"use client";
import InputWithFullBoarder from "@/components/InputWithFullBoarder";
import AuthShell from "@/components/auth/AuthShell";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { ForgotPasswordManager } from "./controller/forgotpassword_controller";

const ForgotPasswordPage = () => {
  const router = useRouter();

  const [email, setEmail] = useState();
  const { sendEmail, isLoading } = ForgotPasswordManager(email);
  return (
    <AuthShell
      title={`Forgot Password`}
      subtitle1={`Enter your registered email address to reset your password`}
      onClick={() => {
        sendEmail({ email: email });
      }}
      isLoading={isLoading}
      buttonText={`Reset Password`}
    >
      <div className="w-full">
        <InputWithFullBoarder
          label={`Email Address`}
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
      </div>
    </AuthShell>
  );
};

export default ForgotPasswordPage;
