"use client";

import React, { useState } from "react";
import { 
  ShoppingBag, 
  Calendar, 
  Ticket, 
  Building2, 
  Megaphone, 
  Search,
  ChevronRight,
  Mail,
  MapPin,
  Clock
} from "lucide-react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import InputWithFullBorder from "@/components/InputWithFullBoarder";
import { 
  useGetCustomerEventsManager 
} from "@/app/tickets/controllers/ticketController";
import { 
  useGetCustomerBoothEventsManager 
} from "@/app/booths/controllers/boothController";
import { 
  useGetCustomerAdvertEventsManager 
} from "@/app/adverts/controllers/advertController";

const MyPurchasesPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [searchEmail, setSearchEmail] = useState(""); // Only this triggers API calls

  // API calls - only triggered when searchEmail is set
  const { data: ticketEvents, isLoading: loadingTickets } = useGetCustomerEventsManager(searchEmail);
  const { data: boothEvents, isLoading: loadingBooths } = useGetCustomerBoothEventsManager(searchEmail);
  const { data: advertEvents, isLoading: loadingAdverts } = useGetCustomerAdvertEventsManager(searchEmail);

  const handleSearch = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSearchEmail(email.trim());
    }
  };

  const isLoading = loadingTickets || loadingBooths || loadingAdverts;
  const hasSearched = !!searchEmail;

  // Combine all events from different sources
  const allEvents = React.useMemo(() => {
    const eventMap = new Map();

    // Add ticket events
    if (ticketEvents?.data) {
      ticketEvents.data.forEach(event => {
        eventMap.set(event._id, {
          ...event,
          hasTickets: true,
          hasBooths: false,
          hasAdverts: false
        });
      });
    }

    // Add booth events
    if (boothEvents?.data) {
      boothEvents.data.forEach(event => {
        if (eventMap.has(event._id)) {
          eventMap.get(event._id).hasBooths = true;
        } else {
          eventMap.set(event._id, {
            ...event,
            hasTickets: false,
            hasBooths: true,
            hasAdverts: false
          });
        }
      });
    }

    // Add advert events
    if (advertEvents?.data) {
      advertEvents.data.forEach(event => {
        if (eventMap.has(event._id)) {
          eventMap.get(event._id).hasAdverts = true;
        } else {
          eventMap.set(event._id, {
            ...event,
            hasTickets: false,
            hasBooths: false,
            hasAdverts: true
          });
        }
      });
    }

    return Array.from(eventMap.values()).sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [ticketEvents, boothEvents, advertEvents]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3 mb-4">
            <ShoppingBag className="text-blue-600" size={32} />
            <h1 className="text-3xl font-bold text-gray-900">My Purchases</h1>
          </div>
          <p className="text-gray-600 max-w-2xl">
            View and manage your event tickets, booth bookings, and advertisement purchases. 
            Enter your email address to access your purchase history.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Email Search Form */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <div className="max-w-md mx-auto">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="text-center mb-6">
                <Mail className="mx-auto text-gray-400 mb-3" size={48} />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Access Your Purchases
                </h2>
                <p className="text-gray-600">
                  Enter the email address you used when making purchases
                </p>
              </div>

              <InputWithFullBorder
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                isRequired
                icon={<Mail size={20} />}
              />

              <Button
                buttonText="View My Purchases"
                type="submit"
                buttonColor="bg-blue-600"
                textColor="text-white"
                className="w-full py-3"
                isLoading={isLoading}
                prefixIcon={<Search size={18} />}
                disabled={!email.trim()}
              />
            </form>
          </div>
        </div>

        {/* Results */}
        {hasSearched && (
          <div className="space-y-6">
            {isLoading ? (
              <div className="bg-white rounded-xl shadow-sm border p-8">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading your purchases...</p>
                </div>
              </div>
            ) : allEvents.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border p-8">
                <div className="text-center">
                  <ShoppingBag className="mx-auto text-gray-400 mb-4" size={48} />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No purchases found
                  </h3>
                  <p className="text-gray-600">
                    We couldn't find any purchases for <strong>{searchEmail}</strong>
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Make sure you entered the correct email address used during purchase
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-white rounded-lg shadow-sm border p-4">
                    <div className="flex items-center">
                      <Calendar className="text-blue-600 mr-3" size={24} />
                      <div>
                        <p className="text-sm text-gray-600">Total Events</p>
                        <p className="text-2xl font-bold text-gray-900">{allEvents.length}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg shadow-sm border p-4">
                    <div className="flex items-center">
                      <Ticket className="text-orange-600 mr-3" size={24} />
                      <div>
                        <p className="text-sm text-gray-600">Ticket Events</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {allEvents.filter(e => e.hasTickets).length}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg shadow-sm border p-4">
                    <div className="flex items-center">
                      <Building2 className="text-blue-600 mr-3" size={24} />
                      <div>
                        <p className="text-sm text-gray-600">Booth Events</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {allEvents.filter(e => e.hasBooths).length}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg shadow-sm border p-4">
                    <div className="flex items-center">
                      <Megaphone className="text-purple-600 mr-3" size={24} />
                      <div>
                        <p className="text-sm text-gray-600">Ad Events</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {allEvents.filter(e => e.hasAdverts).length}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Event List */}
                <div className="bg-white rounded-xl shadow-sm border">
                  <div className="p-6 border-b">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Your Event Purchases
                    </h2>
                    <p className="text-gray-600 mt-1">
                      Click on any event to manage your purchases
                    </p>
                  </div>

                  <div className="divide-y divide-gray-200">
                    {allEvents.map((event) => (
                      <div
                        key={event._id}
                        className="p-6 hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => router.push(`/my-purchases/${event._id}?email=${encodeURIComponent(searchEmail)}`)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="text-lg font-medium text-gray-900 mb-1">
                                {event.name}
                              </h3>
                              <ChevronRight className="text-gray-400" size={20} />
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                              <div className="flex items-center text-sm text-gray-600">
                                <Calendar size={16} className="mr-2" />
                                {new Date(event.date).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </div>
                              {event.time && (
                                <div className="flex items-center text-sm text-gray-600">
                                  <Clock size={16} className="mr-2" />
                                  {event.time}
                                </div>
                              )}
                              {event.location && (
                                <div className="flex items-center text-sm text-gray-600">
                                  <MapPin size={16} className="mr-2" />
                                  {event.location}
                                </div>
                              )}
                            </div>

                            {/* Purchase Types */}
                            <div className="flex gap-2 flex-wrap">
                              {event.hasTickets && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                  <Ticket size={12} className="mr-1" />
                                  Tickets
                                </span>
                              )}
                              {event.hasBooths && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  <Building2 size={12} className="mr-1" />
                                  Booths
                                </span>
                              )}
                              {event.hasAdverts && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                  <Megaphone size={12} className="mr-1" />
                                  Advertisements
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Info Section */}
        {!hasSearched && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="text-lg font-medium text-blue-900 mb-2">
              What you can do here:
            </h3>
            <ul className="space-y-2 text-blue-800">
              <li className="flex items-center">
                <Ticket className="mr-2" size={16} />
                View and edit your event ticket details
              </li>
              <li className="flex items-center">
                <Building2 className="mr-2" size={16} />
                Manage your exhibition booth information
              </li>
              <li className="flex items-center">
                <Megaphone className="mr-2" size={16} />
                Update your advertisement content and details
              </li>
            </ul>
            <p className="text-sm text-blue-700 mt-4">
              <strong>Note:</strong> You'll need to verify your identity with an OTP code before making any changes.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPurchasesPage;