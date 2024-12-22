"use client";
import InputWithFullBoarder from "@/components/InputWithFullBoarder";
import AuthShell from "@/components/auth/AuthShell";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import useLoginManager from "./controller/login_controller";
// Add these imports at the top
import { useRef } from "react"; // Add useRef to existing React imports
import { validateFormSubmission } from "@/utils/validateForm";

const LoginPage = () => {
  const router = useRouter();
  const formRef = useRef(null);
  const [viewPassword, setViewPassword] = useState(false);

  const initialData = {
    email: "",
    password: "",
  };

  const [loginDetails, setLoginDetails] = useState(initialData);

  const { login, isLoading } = useLoginManager();
  return (
    <AuthShell
      title={`Welcome Back 👋`}
      subtitle1={`Don’t have an account?`}
      isLoading={isLoading}
      subtitle2={`Sign up`}
      form="loginForm"
      buttonText={`Login`}
      subtitle2Click={() => {
        router.push("/auth/create-account");
      }}
    >
      <form
        id="loginForm"
        className="w-full"
        ref={formRef}
        onSubmit={async (e) => {
          e.preventDefault();

          if (!validateFormSubmission(formRef, loginDetails)) {
            return;
          }

          await login(loginDetails);
        }}
      >
        <div className="w-full ">
          <InputWithFullBoarder
            label={`Email Address`}
            customErrorMessage={"Enter a valid email"}
            type={"email"}
            isRequired={true}
            value={loginDetails.email}
            onChange={(e) => {
              setLoginDetails({ ...loginDetails, email: e.target.value });
            }}
          />
          <InputWithFullBoarder
            hasSuffix={true}
            label={`Password`}
            isRequired={true}
            type={viewPassword ? `text` : `password`}
            value={loginDetails.password}
            customValidator={(value) => ({
              isValid: value.length > 0,
              message: value ? "" : "Password is required",
            })}
            onChange={(e) => {
              setLoginDetails({ ...loginDetails, password: e.target.value });
            }}
            icon={
              viewPassword ? (
                <AiOutlineEyeInvisible
                  onClick={() => setViewPassword(!viewPassword)}
                />
              ) : (
                <AiOutlineEye onClick={() => setViewPassword(!viewPassword)} />
              )
            }
          />
        </div>
      </form>
    </AuthShell>
  );
};

export default LoginPage;
