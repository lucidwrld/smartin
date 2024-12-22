"use client";
import InputWithFullBoarder from "@/components/InputWithFullBoarder";
import AuthShell from "@/components/auth/AuthShell";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import OTPInput from "react-otp-input";
import { ForgotPasswordManager } from "../forgot-password/controller/forgotpassword_controller";
import { ResetPasswordManager } from "./controller/reset_password_controller";
import validatePassword from "@/components/ValidatePassword";
import { toast } from "react-toastify";

const ResetPasswordPage = () => {
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const router = useRouter();
  const index = 0;
  const [viewPassword, setViewPassword] = useState(false);
  const [otpValue, setOTPValue] = useState("");
  const search = useSearchParams();
  const email = search.get("email");
  const [password, setPassword] = useState("");
  const { sendEmail, isLoading } = ForgotPasswordManager(email);
  const {
    resetPassword,
    isLoading: resetting,
    isSuccess,
  } = ResetPasswordManager({
    password: password
  });
  useEffect(() => {
    if (isSuccess) {
      router.push("/auth/login");
    }
  }, [isSuccess]);
  return (
    <AuthShell
      title={`Reset Password`}
      subtitle1={`Enter OTP code and a new password for your account`}
      isLoading={resetting}
      onClick={() => {
        if(validatePassword(password)){
          var details = { token: otpValue, password: password };
          
          resetPassword(details);;
        }else{
          toast.error(
            "Ensure your new password has atleast One uppercase, lowercase, special character and number"
          )
        }
        
      }}
      buttonText={`Reset Password`}
    >
      <OTPInput
        containerStyle="w-full items-center text-black text-[24px] font-normal justify-center flex mb-0"
        // inputStyle={`bg-[#f4f4f4] w-20  h-[88px] rounded-[5px] flex justify-center items-center border border-black`}
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
        value={otpValue}
        onChange={setOTPValue}
        placeholder={0}
        numInputs={4}
        renderSeparator={<span className="mr-3"></span>}
        renderInput={(props) => (
          <input className="w-16 border border-black" {...props} />
        )}
      />
      <div className="w-full">
        <InputWithFullBoarder
          hasSuffix={true}
          label={`Password`}
          id={"password"}
          isRequired={true}
          type={viewPassword ? `text` : `password`}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
      <p className="text-14px text-textGrey  text-center w-full">
        Didn’t receive code?
        <span
          role="button"
          className="text-brandOrange ml-2"
          onClick={() => {
             
            sendEmail({ email: email });
          }}
        >
          {isLoading ? "Resending..." : "Resend again"}
        </span>
      </p>
    </AuthShell>
  );
};

export default ResetPasswordPage;
