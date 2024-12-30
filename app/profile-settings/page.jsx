"use client";
import ProfileSection from "@/components/ProfileSection";
import ChangePasswordSection from "@/components/profile/ChangePasswordSection";
import PersonalProfileSection from "@/components/profile/PersonalProfileSection";

import React, { useEffect, useState } from "react";
import useGetUserDetailsManager from "./controllers/get_UserDetails_controller";
import { useSearchParams } from "next/navigation";
import BaseDashboardNavigation from "@/components/BaseDashboardNavigation";
import { transactions } from "@/public/icons";
import { Divider } from "@mui/material";

const ProfileSettingsPage = () => {
  const search = useSearchParams();
  const view = search.get("view");

  const {
    data: userDetail,
    isLoading,
    refetch,
  } = useGetUserDetailsManager(true);
  const [currentView, setCurrentView] = useState(0);
  useEffect(() => {
    if (view) {
      setCurrentView(Number(view));
    }
  }, [search]);

  return (
    <BaseDashboardNavigation title={"Profile Settings"}>
      <div className="flex flex-col md:flex-row relative w-[90%] mx-auto md:w-full gap-10 mt-10 md:mt-0">
        <div className=" w-full flex flex-col gap-10">
          <PersonalProfileSection
            refetch={() => refetch()}
            userDetails={userDetail?.data?.user}
          />
          <Divider />
          <ChangePasswordSection refetch={() => refetch()} />
        </div>
      </div>
    </BaseDashboardNavigation>
  );
};

export default ProfileSettingsPage;
