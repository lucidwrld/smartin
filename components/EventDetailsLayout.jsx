"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { IoCloseSharp, IoChevronBackOutline } from "react-icons/io5";
import { RiMenu2Fill } from "react-icons/ri";
import Image from "next/image";
import { logoMain } from "@/public/images";
import useGetUserDetailsManager from "@/app/profile-settings/controllers/get_UserDetails_controller";
import { notificationWithAlert } from "@/public/icons";
import NotificationPopup from "./notifications/NotificationPopup";

const EventDetailsLayout = ({ children, title, eventName }) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [showMainNav, setShowMainNav] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const { data } = useGetUserDetailsManager();

  const tokenExists =
    typeof window !== "undefined" && localStorage.getItem("token") !== null;

  useEffect(() => {
    if (!tokenExists) {
      router.push("/auth/login");
    }
  }, [tokenExists]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/auth/login");
  };

  return (
    <div className="flex h-screen w-full bg-gray-50 overflow-hidden">
      {/* Collapsible Main Navigation */}
      <div
        className={`${
          showMainNav ? "w-64" : "w-16"
        } hidden md:flex flex-col bg-backgroundPurple transition-all duration-300 ease-in-out relative z-40`}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setShowMainNav(!showMainNav)}
          className="absolute -right-3 top-6 bg-white border border-gray-200 rounded-full p-1 shadow-sm hover:shadow-md transition-shadow"
        >
          <IoChevronBackOutline
            className={`w-4 h-4 text-gray-600 transition-transform ${
              showMainNav ? "" : "rotate-180"
            }`}
          />
        </button>

        <div className={`${showMainNav ? "p-4" : "p-2"} transition-all duration-300`}>
          <img
            className={`object-contain transition-all duration-300 mx-auto ${
              showMainNav ? "w-32 h-8" : "w-8 h-8"
            }`}
            src={logoMain.src}
            alt="Smart Invites logo"
          />
        </div>

        <div className={`flex-1 ${showMainNav ? "px-4" : "px-2"} pb-4 transition-all duration-300`}>
          <nav className="space-y-2">
            <Link
              href="/dashboard"
              className={`flex items-center ${
                showMainNav ? "px-3 py-2" : "px-2 py-2 justify-center"
              } text-sm font-medium text-white rounded-md hover:bg-white hover:bg-opacity-10 transition-colors`}
            >
              {showMainNav ? "Dashboard" : "🏠"}
            </Link>
            <Link
              href="/events"
              className={`flex items-center ${
                showMainNav ? "px-3 py-2" : "px-2 py-2 justify-center"
              } text-sm font-medium text-white rounded-md hover:bg-white hover:bg-opacity-10 transition-colors bg-white bg-opacity-10`}
            >
              {showMainNav ? "Events" : "📅"}
            </Link>
            <Link
              href="/transactions"
              className={`flex items-center ${
                showMainNav ? "px-3 py-2" : "px-2 py-2 justify-center"
              } text-sm font-medium text-white rounded-md hover:bg-white hover:bg-opacity-10 transition-colors`}
            >
              {showMainNav ? "Transactions" : "💳"}
            </Link>
            <Link
              href="/notifications"
              className={`flex items-center ${
                showMainNav ? "px-3 py-2" : "px-2 py-2 justify-center"
              } text-sm font-medium text-white rounded-md hover:bg-white hover:bg-opacity-10 transition-colors`}
            >
              {showMainNav ? "Notifications" : "🔔"}
            </Link>
            <Link
              href="/support"
              className={`flex items-center ${
                showMainNav ? "px-3 py-2" : "px-2 py-2 justify-center"
              } text-sm font-medium text-white rounded-md hover:bg-white hover:bg-opacity-10 transition-colors`}
            >
              {showMainNav ? "Support" : "❓"}
            </Link>
          </nav>
        </div>

        {showMainNav && (
          <div className="px-4 pb-4">
            <div className="flex items-center space-x-3 p-3 bg-white bg-opacity-10 rounded-lg">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-purple-600 text-sm font-medium">
                  {data?.data?.user?.fullname?.charAt(0)?.toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">
                  {data?.data?.user?.fullname}
                </p>
                <button
                  onClick={handleLogout}
                  className="text-white text-xs hover:underline"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed md:hidden ${
          showMobileMenu ? "left-0" : "left-[-100%]"
        } w-4/5 bg-backgroundPurple z-50 h-full transition-all duration-300 ease-in-out shadow-lg`}
      >
        <div className="p-4 border-b border-white border-opacity-20">
          <img
            className="object-contain w-32 h-8"
            src={logoMain.src}
            alt="Smart Invites logo"
          />
        </div>
        <nav className="p-4 space-y-2">
          <Link
            href="/dashboard"
            className="block px-3 py-2 text-sm font-medium text-white rounded-md hover:bg-white hover:bg-opacity-10"
          >
            🏠 Dashboard
          </Link>
          <Link
            href="/events"
            className="block px-3 py-2 text-sm font-medium text-white rounded-md hover:bg-white hover:bg-opacity-10 bg-white bg-opacity-10"
          >
            📅 Events
          </Link>
          <Link
            href="/transactions"
            className="block px-3 py-2 text-sm font-medium text-white rounded-md hover:bg-white hover:bg-opacity-10"
          >
            💳 Transactions
          </Link>
          <Link
            href="/notifications"
            className="block px-3 py-2 text-sm font-medium text-white rounded-md hover:bg-white hover:bg-opacity-10"
          >
            🔔 Notifications
          </Link>
          <Link
            href="/support"
            className="block px-3 py-2 text-sm font-medium text-white rounded-md hover:bg-white hover:bg-opacity-10"
          >
            ❓ Support
          </Link>
          <div className="pt-4 mt-4 border-t border-white border-opacity-20">
            <div className="flex items-center space-x-3 p-3 bg-white bg-opacity-10 rounded-lg mb-3">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-purple-600 text-sm font-medium">
                  {data?.data?.user?.fullname?.charAt(0)?.toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">
                  {data?.data?.user?.fullname}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-3 py-2 text-sm font-medium text-white rounded-md hover:bg-red-500 hover:bg-opacity-20"
            >
              🚪 Sign out
            </button>
          </div>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="md:hidden p-2 rounded-md hover:bg-gray-100"
              >
                {showMobileMenu ? (
                  <IoCloseSharp className="w-6 h-6" />
                ) : (
                  <RiMenu2Fill className="w-6 h-6" />
                )}
              </button>
              
              <div className="flex items-center space-x-2">
                <Link
                  href="/events"
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Events
                </Link>
                <span className="text-gray-400">/</span>
                <h1 className="text-xl font-semibold text-gray-900 truncate">
                  {eventName || "Event Details"}
                </h1>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <button
                  onClick={() => setShowNotification(!showNotification)}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <Image
                    src={notificationWithAlert}
                    alt="notifications"
                    className="w-5 h-5"
                  />
                </button>
                <NotificationPopup isOpen={showNotification} />
              </div>

              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {data?.data?.user?.fullname}
                  </p>
                  <p className="text-xs text-gray-500">
                    {data?.data?.user?.email}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {data?.data?.user?.fullname?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area - Full width, no padding constraints */}
        <main className="flex-1 overflow-auto bg-gray-50">
          {children}
        </main>
      </div>

      {/* Mobile menu overlay */}
      {showMobileMenu && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setShowMobileMenu(false)}
        />
      )}
    </div>
  );
};

export default EventDetailsLayout;