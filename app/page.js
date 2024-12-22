"use client";
import CustomButton from "@/components/Button";
import { useRouter } from "next/navigation";

import React from "react";

const HomePage = () => {
  const router = useRouter();
  return (
    <div className={`w-full h-full flex flex-col justify-center items-center`}>
      This is the home page.
      <CustomButton
        buttonText={"Go to login"}
        onClick={() => {
          router.push("/auth/login");
        }}
      />
    </div>
  );
};

export default HomePage;
