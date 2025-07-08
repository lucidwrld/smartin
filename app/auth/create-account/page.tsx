"use client";
import InputWithFullBoarder from "@/components/InputWithFullBoarder";
import AuthShell from "@/components/auth/AuthShell";

import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import useRegisterUser from "./controller/register_controller";
import { toast } from "react-toastify";

import TermsModal from "@/components/TermsModal";
import PrivacyModal from "@/components/privacyModal";
import { validateFormSubmission } from "@/utils/validateForm";
import { shouldChargeInNaira } from "@/utils/shouldChargeInNaira";
import { validateCompletePhoneNumber } from "@/utils/validateCompletePhoneNumber";

const CreateAccountPage = () => {
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const router = useRouter();

  const initialData = {
    fullname: "",
    email: "",
    password: "",
    phone: "",
    currency: "USD",
  };
  const [formData, setFormData] = useState(initialData);

  const [viewPassword, setViewPassword] = useState(false);
  const { registerUser, isLoading, isSuccess } = useRegisterUser(
    formData.email
  );

  useEffect(() => {
    if (isSuccess) {
      router.push(
        `/auth/verify-account?email=${encodeURIComponent(formData.email)}`
      );
      setFormData(initialData);
    }
  }, [isSuccess]);

  const formRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!agreedToTerms) {
      toast.info("Please agree to the terms and conditions.");
      return;
    }

    if (!validateFormSubmission(formRef, formData, undefined)) {
      return;
    }
    const isNairaCharge = await shouldChargeInNaira();
    const currencyValue = isNairaCharge ? "NGN" : "USD";
    const updatedFormData = {
      ...formData,
      currency: currencyValue,
    };
    await registerUser(updatedFormData);
  };

  return (
    <AuthShell
      isLoading={isLoading}
      title={`Create Account`}
      subtitle1={`Already have an account?`}
      subtitle2={`Login`}
      progress={undefined}
      onClick={undefined}
      buttonText={`Sign up`}
      form="registrationForm"
      subtitle2Click={() => {
        router.push("/auth/login");
      }}
    >
      <div className="w-full h-fit">
        <form id="registrationForm" ref={formRef} onSubmit={handleSubmit}>
          <div className="flex flex-col w-full relative">
            <div className=" w-full flex flex-col md:flex-row gap-3">
              <div className="w-full">
                <InputWithFullBoarder
                  label="Phone Number"
                  id="phone_number"
                  isRequired={true}
                  placeholder="e.g. +1 for US, +44 for UK"
                  value={formData.phone}
                  type="tel"
                  customValidator={validateCompletePhoneNumber}
                  onChange={(e) => {
                    let value = e.target.value;
                    // Ensure the + is always there
                    if (!value.startsWith("+")) {
                      value = "+" + value;
                    }
                    // Remove any non-digit characters except the +
                    value = value.replace(/[^\d+]/g, "");

                    setFormData({ ...formData, phone: value });
                  }}
                />
              </div>
            </div>
            <div className="w-full">
              <InputWithFullBoarder
                id={`fullname`}
                label={`Full Name`}
                value={formData.fullname}
                customErrorMessage={"Your full name is required"}
                isRequired={true}
                onChange={(e) =>
                  setFormData({ ...formData, fullname: e.target.value })
                }
              />
              <InputWithFullBoarder
                id={"email"}
                label={`Email Address`}
                isRequired={true}
                type={"email"}
                value={formData.email}
                customErrorMessage={"please input a valid email"}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    email: e.target.value.toLowerCase(),
                  });
                }}
              />

              <InputWithFullBoarder
                hasSuffix={true}
                isRequired={true}
                id={"password"}
                label={"Password"}
                type={viewPassword ? `text` : `password`}
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
              <label className="flex items-start gap-2">
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                />
                <div className="flex h-fit flex-wrap gap-1 w-auto ">
                  <p className="text-sm w-fit     text-gray-600">
                    I understand and agree to the
                  </p>
                  <span
                    className="text-brandOrange w-auto text-sm   cursor-pointer"
                    onClick={() =>
                      document.getElementById("term_modal").showModal()
                    }
                  >
                    Terms and Conditions
                  </span>
                  and
                  <span
                    onClick={() =>
                      document.getElementById("privacy_modal").showModal()
                    }
                    className="text-brandOrange text-sm w-auto cursor-pointer"
                  >
                    Privacy Policy
                  </span>
                </div>
              </label>
            </div>
          </div>
        </form>
      </div>
      <PrivacyModal />
      <TermsModal />
    </AuthShell>
  );
};

export default CreateAccountPage;
