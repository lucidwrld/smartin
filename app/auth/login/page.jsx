"use client";
import InputWithFullBoarder from "@/components/InputWithFullBoarder";
import AuthShell from "@/components/auth/AuthShell";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import useLoginManager from "./controller/login_controller";
import { toast } from "react-toastify";

const CreateAccountPage = () => {
  const router = useRouter();

  const [viewPassword, setViewPassword] = useState(false);

  useEffect(() => {
    const getToken = async () => {
      if (typeof window !== "undefined") {
        let token = localStorage.getItem("deviceToken");

        if (!token) {
          await requestNotificationPermission();
          token = localStorage.getItem("deviceToken");
        }

        if (token) {
          setLoginDetails((prevDetails) => ({
            ...prevDetails,
            device_token: token,
          }));
          setFirebaseToken(token);
        } else {
        }
      }
    };

    getToken();
  }, []);

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
      onClick={async (e) => {
        e.preventDefault();
        // await requestNotificationPermission();

        await login(loginDetails);
      }}
      buttonText={`Login`}
      subtitle2Click={() => {
        router.push("/auth/create-account");
      }}
    >
      <div className="w-full ">
        <InputWithFullBoarder
          label={`Email Address`}
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
    </AuthShell>
  );
};

export default CreateAccountPage;
