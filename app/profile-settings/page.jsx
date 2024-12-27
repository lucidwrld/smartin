"use client";
import ProfileSection from "@/components/ProfileSection";
import ChangePasswordSection from "@/components/profile/ChangePasswordSection";
import PersonalProfileSection from "@/components/profile/PersonalProfileSection";

import React, { useEffect, useState } from "react";
import useGetUserDetailsManager from "./controllers/get_UserDetails_controller";
import { useSearchParams } from "next/navigation";
import BaseDashboardNavigation from "@/components/BaseDashboardNavigation";
import { transactions } from "@/public/icons";

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
  const menu = [
    {
      name: "Personal Profile",
      active: transactions,
      inactive: transactions,
    },
    {
      name: "Change Password",
      active: transactions,
      inactive: transactions,
    },
  ];
  return (
    <BaseDashboardNavigation title={"Profile Settings"}>
      <div className="flex flex-col md:flex-row relative w-[90%] mx-auto md:w-full gap-10 mt-10 md:mt-0">
        <div className="md:max-w-[17%] w-full flex flex-col relative gap-5">
          {menu.map((el, i) => (
            <ProfileSection
              onClick={() => setCurrentView(i)}
              key={i}
              settings={true}
              refetch={() => refetch()}
              selected={currentView === i}
              icon={currentView === i ? el.active.src : el.inactive.src}
              title={el.name}
            />
          ))}
        </div>
        <div className=" md:max-w-[70%] w-full border border-transparent md:border-l-lightGrey md:pl-10 flex flex-col">
          {currentView === 0 && (
            <PersonalProfileSection
              refetch={() => refetch()}
              userDetails={userDetail?.data?.user}
            />
          )}

          {currentView === 1 && (
            <ChangePasswordSection refetch={() => refetch()} />
          )}
        </div>
      </div>
    </BaseDashboardNavigation>
  );
};

export default ProfileSettingsPage;
