"use client";
import CustomButton from "@/components/Button";
import LandingPage from "@/components/LandingPage";
import { useRouter } from "next/navigation";

import React from "react";

const HomePage: React.FC = () => {
  const router = useRouter();
  return <LandingPage />;
};

export default HomePage;
