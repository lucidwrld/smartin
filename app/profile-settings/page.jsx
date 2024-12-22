"use client";
import CustomButton from "@/components/Button";
import HeaderFooter from "@/components/HeaderFooter";
import InputWithFullBoarder from "@/components/InputWithFullBoarder";
import ProfileSection from "@/components/ProfileSection";
import ChangePasswordSection from "@/components/profile/ChangePasswordSection";
import PersonalProfileSection from "@/components/profile/PersonalProfileSection";
import ProfessionalProfileSection from "@/components/profile/ProfessionalProfileSection";
import {
  camera,
  changePassword,
  changePasswordActive,
  deleteIcon,
  professionalProfile,
  professionalProfileActive,
  profile,
  profileActive,
} from "@/public/icons";
import React, { useEffect, useState } from "react";
import useGetUserDetailsManager from "./controllers/get_UserDetails_controller";
import ConsultantApplicationModal from "@/components/consultants/ConsultantApplicationModal";
import { useSearchParams } from "next/navigation";

const ProfileSettingsPage = () => {
  const search = useSearchParams()
  const view = search.get("view")
   
  const { data: userDetail, isLoading, refetch } = useGetUserDetailsManager(true);
  const [currentView, setCurrentView] = useState(0);
  useEffect(() => {
     
    if(view){
      setCurrentView(Number(view))
    }
  }, [search])
  const menu = [
    {
      name: "Personal Profile",
      active: profileActive,
      inactive: profile,
    },
    {
      name: "Professional Profile",
      active: professionalProfileActive,
      inactive: professionalProfile,
    },
    {
      name: "Change Password",
      active: changePasswordActive,
      inactive: changePassword,
    },
  ];
  return (
    <HeaderFooter showMainMenu={false}>
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
            <PersonalProfileSection refetch={() => refetch()} userDetails={userDetail?.data?.user} />
          )}
          {currentView === 1 && (
            <ProfessionalProfileSection
              isLoading={isLoading}
              refetch={() => refetch()}
              userDetails={userDetail?.data?.user}
            />
          )}

          {currentView === 2 && <ChangePasswordSection refetch={() => refetch()} />}
        </div>
      </div>
      <ConsultantApplicationModal />
    </HeaderFooter>
  );
};

export default ProfileSettingsPage;
