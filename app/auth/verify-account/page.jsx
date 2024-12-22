"use client";
import InputWithFullBoarder from "@/components/InputWithFullBoarder";
import AuthShell from "@/components/auth/AuthShell";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import OTPInput from "react-otp-input";
import { useResendOtp } from "./controller/resend_otp_controller";
import useVerifyOtp from "./controller/verify_otp_controller";

const VerifyAccountPage = () => {
  const search = useSearchParams();
  const email = decodeURIComponent(search.get("email"));
  const [organization, setOrganization] = useState(false);
  const [type, setType] = useState("user") 
  const [accountType, setAccountType] = useState("Client");
  useEffect(() => {
    if (typeof window !== "undefined") {
      const accountType = localStorage.getItem("accountType"); 
      setAccountType(accountType);
    }
  }, []);
  useEffect(() => {
    const typey = search.get('type');
    const organization = search.get("organize")
    if(typey){ 
        setType(typey)
    }
    if(organization){
      setOrganization(organization)
    }
}, [search])
  const [otpValue, setOTPValue] = useState("");
  const { isLoading, refetch } = useVerifyOtp(
    Boolean(otpValue) && otpValue.length === 4,
    otpValue,
    accountType,
    type,
    organization
  );
  const { resendOtp, isLoading: resending } = useResendOtp();
  return (
    <AuthShell
      title={`Account Verification`}
      subtitle1={`Enter OTP code sent to your email for verification`}
      isLoading={isLoading}
      onClick={() => {
        refetch();
      }}
      buttonText={`Verify`}
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
        numInputs={4}
        renderSeparator={<span className="mr-3"></span>}
        renderInput={(props) => <input className="w-16" {...props} />}
      />

      <p className="text-14px text-textGrey  text-center w-full">
        Didn’t receive code?
        <span
          role="button"
          className="text-brandOrange ml-2"
          onClick={() => {
            resendOtp({ email: email });
          }}
        >
          {resending ? "Resending" : `Resend again`}
        </span>
      </p>
    </AuthShell>
  );
};

export default VerifyAccountPage;
