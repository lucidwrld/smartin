"use client";
import InputWithFullBoarder from "@/components/InputWithFullBoarder";
import AuthShell from "@/components/auth/AuthShell";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import useRegisterUser from "./controller/register_controller";
import { toast } from "react-toastify";
import validateNoLeadingOrTrailingSpaces from "@/components/ValidateNoSpaces";
import validatePassword from "@/components/ValidatePassword";

import TermsModal from "@/components/TermsModal";
import PrivacyModal from "@/components/privacyModal";

const CreateAccountPage = () => {
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const router = useRouter();
  const [accountType, setAccountType] = useState("Client");

  const initialData = {
    fullname: "",
    email: "",
    password: "",
    phone: "",
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

  const validateForm = () => {
    const isValidSpaces = validateNoLeadingOrTrailingSpaces(formData);

    return (
      isValidSpaces &&
      formData.fullname !== "" &&
      formData.phone !== "" &&
      formData.email !== "" &&
      validatePassword(formData.password) &&
      agreedToTerms
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      await registerUser(formData);
    } else {
      toast.info(
        "Please fill all fields, ensure the password meets the criteria and agree to the terms and conditions."
      );
    }
  };

  return (
    <AuthShell
      isLoading={isLoading}
      title={`Create Account`}
      subtitle1={`Already have an account?`}
      subtitle2={`Login`}
      onClick={handleSubmit}
      buttonText={`Sign up`}
      subtitle2Click={() => {
        router.push("/auth/login");
      }}
    >
      {accountType === "Consultant" && (
        <div className="flex w-full items-center gap-2">
          <div
            className="w-full bg-brandOrange h-2 rounded-full 
          
          "
          ></div>
          <div className="w-full bg-[#CDCDCE] h-2 rounded-full "></div>
        </div>
      )}
      <div className="w-full h-fit">
        <div className="flex flex-col w-full relative">
          <div className=" w-full flex flex-col md:flex-row gap-3">
            <div className="w-full">
              <InputWithFullBoarder
                label={`Phone Number`}
                id={`phone_number`}
                isRequired={true}
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>
          </div>
          <div className="w-full">
            <InputWithFullBoarder
              id={`fullname`}
              label={`Full Name`}
              value={formData.fullname}
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
      </div>
      <PrivacyModal />
      <TermsModal />
    </AuthShell>
  );
};

export default CreateAccountPage;
