"use client";

import React from "react";
import { useParams } from "next/navigation";
import FormDisplay from "@/components/forms/FormDisplay";

export default function PublicFormPage() {
  const params = useParams();
  const eventId = params?.eventId as string;
  const formId = params?.formId as string;

  return (
    <div className="min-h-screen bg-gray-50">
      <FormDisplay
        formId={formId}
        eventId={eventId}
        showBackButton={false}
        headerTitle="Complete Form"
      />
    </div>
  );
}