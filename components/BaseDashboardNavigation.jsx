"use client";
import React, { useEffect, useState } from "react";

import IconsWithText from "./IconsWithText";
// import NotificationList from "../modules/notification/NotificationList";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { IoCloseSharp } from "react-icons/io5";
import { RiMenu2Fill } from "react-icons/ri";

import Image from "next/image";

import { logo, logoMain } from "@/public/images";

import { adminMenu, mainMenu } from "@/utils/menu";
import useGetUserDetailsManager from "@/app/profile-settings/controllers/get_UserDetails_controller";
import { notificationWithAlert } from "@/public/icons";
import NotificationPopup from "./notifications/NotificationPopup";

const BaseDashboardNavigation = ({ children, title }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const { data, isError, error, isLoading, isSuccess } =
    useGetUserDetailsManager();

  const handleOpenMenu = () => {
    setShowMenu(!showMenu);
  };
  const router = useRouter();
  const tokenExists =
    typeof window !== "undefined" && localStorage.getItem("token") !== null;

  useEffect(() => {
    if (!tokenExists) {
      router.push("/auth/login");
    }
  }, [tokenExists]);
  const handleLogout = (e) => {
    // e.preventDefault();
    localStorage.removeItem("token");
    router.push("/auth/login");
  };

  return (
    <div className="relative md:fixed flex h-[100vh] w-full bg-[#F9FAFB] text-whiteColor pr-3">
      <div
        className={` hidden md:flex flex-col items-start justify-between w-[20%] h-full bg-backgroundPurple pt-2 pb-10 z-50 md:overflow-auto  scrollbar-hide relative`}
      >
        <div className="flex flex-col items-start ease-in-out duration-500 gap-2 w-full relative">
          <div className="pt-3 py-2 w-full mx-auto relative">
            <img
              className="object-contain w-[60%] h-[51px] mx-2"
              src={logoMain.src}
              alt="The Confidant logo"
            />
          </div>

          {mainMenu.map((el, i) =>
            el?.text === "Log Out" ? (
              <div
                key={i}
                onClick={handleLogout}
                className="w-full mx-auto cursor-pointer"
              >
                <IconsWithText
                  icon={el?.inactive.src}
                  activeIcon={el?.active.src}
                  path={el?.url}
                  iconSize="28px"
                  text={el?.title}
                />
              </div>
            ) : (
              <Link
                key={i}
                className="w-full mx-auto cursor-pointer"
                href={el?.url}
              >
                <IconsWithText
                  icon={el?.inactive.src}
                  activeIcon={el?.active.src}
                  path={el?.url}
                  iconSize="28px"
                  text={el?.title}
                />
              </Link>
            )
          )}
        </div>
        {/* <IconsWithText
          onClick={handleLogout}
          icon={svg_logouticon}
          className="w-full mb-20"
          // activeIcon={el?.activeIcon}
          // path={el?.url}
          iconSize="28px"
          text={"Logout"}
        /> */}
      </div>
      {/* this is where the mobile menu is */}

      <div
        className={`fixed md:hidden ${
          showMenu ? "left-0" : "left-[-100%]"
        } ease-in-out duration-500 w-4/5 bg-backgroundPurple z-50 h-full pt-4  flex flex-col  items-start space-y-10 mr-7 overflow-y-scroll`}
      >
        <img
          className="object-contain w-[64px] h-[67.98px] mx-7"
          src={logo.src}
          alt="The Confidant logo"
        />
        {mainMenu.map((el, i) => (
          <Link
            key={i}
            className="w-[90%] mx-auto cursor-pointer"
            href={el?.url}
          >
            <IconsWithText
              icon={el?.inactive.src}
              activeIcon={el?.active.src}
              path={el?.url}
              iconSize="28px"
              text={el?.title}
            />
          </Link>
        ))}
        {/* <IconsWithText
          onClick={handleLogout}
          icon={svg_logouticon}
          className="w-full ml-4"
          iconSize="28px"
          text={"Logout"}
        /> */}
      </div>

      {/* this is where the top section starts */}
      <div className="w-full relative bg-[#F9FAFB]">
        <div className="flex flex-col w-full relative max-h-[100vh] overflow-auto">
          <div className="flex flex-col md:flex-row items-center justify-between text-left z-40 bg-white px-4 py-[15px] mb-[12px]">
            <div className="w-full md:w-auto flex items-center justify-between">
              <h3 className="text-[20px] font-medium text-brandBlack">
                {title}
              </h3>
              <div
                onClick={handleOpenMenu}
                className=" md:hidden  bg-white shadow-md p-3.5 h-14 border w-14 rounded-full"
              >
                {showMenu ? (
                  <IoCloseSharp size={25} color="black" />
                ) : (
                  <RiMenu2Fill size={25} color="black" />
                )}
              </div>
            </div>
            <div className="hidden md:flex justify-end items-center">
              {/* <button
                onClick={() => setShowNotification(!showNotification)}
                className="mr-[10px] rounded-[50%] bg-gray-100 w-[41.8px] h-[41.8px] flex justify-center items-center ml-4 "
              >
                <Image src={notificationWithAlert} alt="notification bell" />
              </button> */}
              <div className="relative">
                <button
                  onClick={() => setShowNotification(!showNotification)}
                  className="mr-[10px] rounded-[50%] bg-gray-100 w-[41.8px] h-[41.8px] flex justify-center items-center ml-4"
                >
                  <Image src={notificationWithAlert} alt="notification bell" />
                </button>
                <NotificationPopup isOpen={showNotification} />
              </div>

              {/* notification display */}
              {/* {showNotification && (
                <NotificationList showNotification={showNotification} />
              )} */}
              <div className="rounded-full border-brandRed border-solid border-2 mr-[13px] cursor-pointer">
                {" "}
                <img
                  className=" object-cover h-[44px] w-[44px] p-[0.7px] rounded-full "
                  src={
                    data?.data?.user?.profile_picture !== ""
                      ? data?.data?.user?.profile_picture
                      : `https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png`
                  }
                  alt="user avatar"
                />
              </div>
              <div>
                {/* <p className="flex items-center text-brandRed text-[13px] font-semibold leading-tight">
                  {data?.data?.user?.firstName} {data?.data?.user?.lastName}
                </p> */}
                {/* <p className="text-[#8E8E8E] text-[10px] capitalize">
                  {data?.data?.user?.role?.name === "admin" ? "Admin" : "User"}
                </p> */}
              </div>
            </div>
          </div>
          <div className="max-h-[90%] ml-0 relative w-full md:w-[90%] md:mx-auto pb-10 mt-10">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BaseDashboardNavigation;
