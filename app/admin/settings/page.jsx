"use client";
import BaseDashboardNavigation from "@/components/BaseDashboardNavigation";
import MyEditor from "@/components/MyEditor";

import ConfigurationSection from "@/components/settings/ConfigurationSection";
import React, { useEffect, useState } from "react";
import useGetTermsManager from "./controllers/getTermsController";

const AdminSettingsPage = () => {
  const [currentView, setCurrentView] = useState(0);
  const [type, setType] = useState("");
  const { data, isLoading } = useGetTermsManager({ type: type });
  // const { data: settings, isLoading: loading } = useGetSettingsManager();

  useEffect(() => {
    if (currentView === 1) {
      setType("signup");
    }
    if (currentView === 2) {
      setType("privacy");
    }
    if (currentView === 3) {
      setType("consultant");
    }
  }, [currentView]);

  return (
    <BaseDashboardNavigation title={`Settings`}>
      <div className="flex items-center w-full justify-start relative gap-0 mt-5">
        {[
          "Configuration",
          "Terms & Conditions",
          "Privacy Policy",
          "Consultant T&C",
          "General Categories",
        ].map((el, i) => (
          <p
            key={i}
            role="button"
            onClick={() => setCurrentView(i)}
            className={`text-13px whitespace-nowrap pb-2 px-6 ${
              currentView === i
                ? "font-medium text-brandBlack border border-transparent border-b-2 border-b-brandBlack"
                : "text-textGrey2"
            }`}
          >
            {el}
          </p>
        ))}
        <div className="divider divider-[#E4E7EC] inset-y-0 absolute top-1.5 w-full"></div>
      </div>
      <div className="w-full mt-5">
        {currentView === 0 && <ConfigurationSection />}
        {currentView !== 0 && currentView !== 4 && currentView !== 5 && (
          <MyEditor isLoading={isLoading} content={data?.data} />
        )}
        {currentView === 4 && <GeneralCategoriesSection />}
      </div>
    </BaseDashboardNavigation>
  );
};

export default AdminSettingsPage;
