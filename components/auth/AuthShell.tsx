"use client";

import CustomButton from "@/components/Button";
import { logoMain, logoMain1, wedding } from "@/public/images";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

interface AuthShellProps {
  children: React.ReactNode;
  title: string;
  subtitle1: string;
  subtitle2: string;
  progress?: any;
  isLoading: boolean;
  buttonText: string;
  form: string;
  onClick?: () => void;
  subtitle2Click: () => void;
}

const AuthShell: React.FC<AuthShellProps> = ({
  children,
  title,
  subtitle1,
  subtitle2,
  progress,
  isLoading,
  buttonText,
  form,
  onClick,
  subtitle2Click,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const tokenExists =
    typeof window !== "undefined" && localStorage.getItem("token") !== null;

  return (
    <div className="w-full h-screen py-0 flex relative items-center justify-center text-brandBlack ">
      <div className={`h-full max-w-[50%] w-full relative hidden md:flex`}>
        <img src={wedding.src} className={`w-full h-full object-cover`} />
      </div>
      <div className={`h-full md:max-w-[50%] w-full relative p-10`}>
        <Link href={"/"} className="w-full flex items-start justify-start">
          <img
            src={logoMain1.src}
            alt=""
            className="max-w-[80%] md:max-w-[30%]"
          />
        </Link>
        <div className=" max-w-[95%] md:max-w-[452px] w-full mx-auto h-full flex flex-col items-center justify-center gap-10 relative">
          <div className="flex flex-col items-start w-full">
            <p className="font-semibold text-[36px]">{title}</p>
            <p className="text-14px text-textGrey ">
              {subtitle1}
              <span
                role="button"
                className="text-brandOrange ml-2"
                onClick={subtitle2Click}
              >
                {subtitle2}
              </span>
            </p>
          </div>
          {children}
          <CustomButton
            buttonText={buttonText}
            progress={progress}
            isLoading={isLoading}
            form={form} // Add this
            type="submit"
            // onClick={onClick}
            className={`w-full py-3 h-[50px]`}
          />
          {pathname.includes("/login") && (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthShell;
