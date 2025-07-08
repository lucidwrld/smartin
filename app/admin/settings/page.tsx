"use client";

import BaseDashboardNavigation from "@/components/BaseDashboardNavigation";
import MyEditor from "@/components/MyEditor";
import ConfigurationSection from "@/components/settings/ConfigurationSection";
import React, { useEffect, useState } from "react";
import useGetTermsManager from "./controllers/getTermsController";
import { CreateTermsManager } from "./controllers/createTermsController";
import TabManager from "@/components/TabManager";

const AdminSettingsPage = () => {
  const [currentView, setCurrentView] = useState(0);
  const [type, setType] = useState("");
  const { data, isLoading, error } = useGetTermsManager({
    type: type,
  });
  const { createTerms, isLoading: creating } = CreateTermsManager();

  // First set the type based on view
  useEffect(() => {
    if (currentView === 1) {
      setType("signup");
    } else if (currentView === 2) {
      setType("privacy");
    } else {
      setType(""); // Reset type when on configuration view
    }
  }, [currentView]);

  // Handle 404 and create
  useEffect(() => {
    if (error?.message === "Sorry: Terms and Agreement not found" && type) {
      createTerms({
        content: `Content for ${type}`,
        type: type,
      });
    }
  }, [error, createTerms, type]);

  return (
    <BaseDashboardNavigation title={`Settings`}>
      <TabManager
        currentView={currentView}
        setCurrentView={setCurrentView}
        list={["Configuration", "Terms & Conditions", "Privacy Policy"]}
      />
      <div className="w-full mt-5">
        {currentView === 0 && <ConfigurationSection />}
        {currentView !== 0 && (
          <MyEditor isLoading={isLoading || creating} content={data?.data} />
        )}
      </div>
    </BaseDashboardNavigation>
  );
};

export default AdminSettingsPage;
