import EventDetailsPage from "@/app/events/[eventId]/page";
import React from "react";

interface AdminEventPageProps {
  params: Promise<{ eventId: string }>;
}

const AdminEventPage: React.FC<AdminEventPageProps> = ({ params }) => {
  return <EventDetailsPage params={params} />;
};

export default AdminEventPage;
