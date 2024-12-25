"use client";

import CustomButton from "@/components/Button";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

const AuthShell = ({
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
        <img
          src={
            "https://img.freepik.com/free-photo/pyramid-cocktails-decorated-with-cherries-stands-table_8353-556.jpg"
          }
          className={`w-full h-full object-cover`}
        />
      </div>
      <div className={`h-full md:max-w-[50%] w-full relative`}>
        <div className=" max-w-[80%] md:max-w-[452px] w-full mx-auto h-full flex flex-col items-center justify-center gap-10 relative">
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
