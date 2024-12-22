import useLoginManager from "@/app/auth/login/controller/login_controller";

import React, { useState } from "react";
import ModalManagement from "../ModalManagement";
import InputWithFullBoarder from "../InputWithFullBoarder";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { google } from "@/public/images";
import CustomButton from "../Button";
import { useRouter } from "next/navigation";

const LoginModal = () => {
  const router = useRouter();
  const index = 0;
  const [viewPassword, setViewPassword] = useState(false);
  const initialData = { username: "", password: "" };
  const [loginDetails, setLoginDetails] = useState(initialData);

  const { login, isLoading } = useLoginManager();
  return (
    <ModalManagement id={`login`}>
      <div className="flex flex-col w-[400px] relative">
        <div className="flex flex-col items-start w-full mb-4">
          <p className="font-semibold text-[36px] mb-5 text-center">{`Login`}</p>
          <p className="text-14px text-textGrey ">
            {`Don’t have an account?`}
            <span
              role="button"
              className="text-brandOrange ml-2"
              onClick={() => {
                router.push("/auth/choose-type");
              }}
            >
              {`Sign up`}
            </span>
          </p>
        </div>
        <div className="w-full ">
          <div className="border border-[#D0D5DD] rounded-[8px] w-full flex items-center justify-center gap-3  py-2">
            <img src={google.src} alt="" />
            <p className="text-[#344054] text-16px font-medium">Google</p>
          </div>
          <div className="w-full divider py-5 text-14px">Or</div>
          <InputWithFullBoarder
            label={`Email Address`}
            type={"email"}
            value={loginDetails.username}
            onChange={(e) => {
              setLoginDetails({ ...loginDetails, username: e.target.value });
            }}
          />
          <InputWithFullBoarder
            hasSuffix={true}
            label={`Password`}
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
        <CustomButton
          buttonText={`Login`}
          isLoading={isLoading}
          onClick={async (e) => {
            e.preventDefault();
            
            await login(loginDetails);
            setLoginDetails(initialData);
          }}
          className={`w-full py-3 my-4`}
        />
        <p className="text-14px text-textGrey  text-center w-full">
          Forgot password?
          <span
            role="button"
            className="text-brandOrange ml-2"
            onClick={() => {
              router.push("/auth/forgot-password");
            }}
          >
            Recover
          </span>
        </p>
      </div>
    </ModalManagement>
  );
};

export default LoginModal;
