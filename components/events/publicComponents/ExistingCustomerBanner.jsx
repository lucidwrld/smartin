"use client";

import React, { useState } from "react";
import { CheckCircle, Settings, ArrowRight, X, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import InputWithFullBorder from "@/components/InputWithFullBoarder";
import { 
  useGetCustomerTicketsForEventManager
} from "@/app/tickets/controllers/ticketController";
import { 
  useGetCustomerBoothsForEventManager
} from "@/app/booths/controllers/boothController";
import { 
  useGetCustomerAdvertsForEventManager
} from "@/app/adverts/controllers/advertController";

const ExistingCustomerBanner = ({ eventId }) => {
  const router = useRouter();
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [email, setEmail] = useState("");
  const [searchEmail, setSearchEmail] = useState("");

  // API calls to check if customer has purchases
  const { data: tickets } = useGetCustomerTicketsForEventManager(searchEmail, eventId);
  const { data: booths } = useGetCustomerBoothsForEventManager(searchEmail, eventId);
  const { data: adverts } = useGetCustomerAdvertsForEventManager(searchEmail, eventId);

  const hasPurchases = (tickets?.data?.length > 0) || (booths?.data?.length > 0) || (adverts?.data?.length > 0);

  const handleCheckPurchases = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSearchEmail(email.trim());
    }
  };

  const handleManageBookings = () => {
    router.push(`/my-purchases/${eventId}?email=${encodeURIComponent(searchEmail)}`);
  };

  // If we've searched and found no purchases, don't show anything
  if (searchEmail && !hasPurchases) {
    return null;
  }

  return (
    <>
      {/* Initial Banner */}
      {!showEmailInput && !searchEmail && (
        <section className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle className="text-blue-600" size={24} />
              <div>
                <h4 className="font-medium text-blue-800">Already have bookings for this event?</h4>
                <p className="text-sm text-blue-600">
                  Manage your existing tickets, booths, and advertisements
                </p>
              </div>
            </div>
            <Button
              buttonText="Check My Bookings"
              onClick={() => setShowEmailInput(true)}
              buttonColor="bg-blue-600"
              textColor="text-white"
              className="text-sm"
              prefixIcon={<Settings size={16} />}
            />
          </div>
        </section>
      )}

      {/* Email Input Form */}
      {showEmailInput && !searchEmail && (
        <section className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <Mail className="text-blue-600" size={24} />
              <div>
                <h4 className="font-medium text-blue-800">Check Your Existing Bookings</h4>
                <p className="text-sm text-blue-600">
                  Enter your email address to view and manage your purchases for this event
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowEmailInput(false)}
              className="text-blue-400 hover:text-blue-600"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleCheckPurchases} className="max-w-md">
            <div className="flex gap-3">
              <div className="flex-1">
                <InputWithFullBorder
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  isRequired
                />
              </div>
              <Button
                buttonText="Check"
                type="submit"
                buttonColor="bg-blue-600"
                textColor="text-white"
                disabled={!email.trim()}
              />
            </div>
          </form>
        </section>
      )}

      {/* Results Banner - Show if purchases found */}
      {searchEmail && hasPurchases && (
        <section className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle className="text-green-600" size={24} />
              <div>
                <h4 className="font-medium text-green-800">
                  Existing bookings found for {searchEmail}
                </h4>
                <div className="flex gap-4 text-sm text-green-700 mt-1">
                  {tickets?.data?.length > 0 && (
                    <span>• {tickets.data.length} ticket purchase(s)</span>
                  )}
                  {booths?.data?.length > 0 && (
                    <span>• {booths.data.length} booth booking(s)</span>
                  )}
                  {adverts?.data?.length > 0 && (
                    <span>• {adverts.data.length} advertisement(s)</span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                buttonText="New Search"
                onClick={() => {
                  setSearchEmail("");
                  setEmail("");
                }}
                buttonColor="bg-gray-200"
                textColor="text-gray-700"
                className="text-sm"
              />
              <Button
                buttonText="Manage Bookings"
                onClick={handleManageBookings}
                buttonColor="bg-green-600"
                textColor="text-white"
                className="text-sm"
                suffixIcon={<ArrowRight size={16} />}
              />
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default ExistingCustomerBanner;