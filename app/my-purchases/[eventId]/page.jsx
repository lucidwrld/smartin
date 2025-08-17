"use client";

import React, { useState, useEffect } from "react";
import { 
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  Ticket,
  Building2,
  Megaphone,
  Edit,
  Shield,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import BoothEditForm from "@/components/forms/BoothEditForm";
import AdvertEditForm from "@/components/forms/AdvertEditForm";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import Button from "@/components/Button";
import useGetSingleEventPublicManager from "@/app/events/controllers/getSingleEventPublicController";
import { 
  useGetCustomerTicketsForEventManager,
  RequestTicketEditCodeManager,
  EditTicketDetailsManager
} from "@/app/tickets/controllers/ticketController";
import { 
  useGetCustomerBoothsForEventManager,
  RequestBoothEditCodeManager,
  EditBoothDetailsManager
} from "@/app/booths/controllers/boothController";
import { 
  useGetCustomerAdvertsForEventManager,
  RequestAdvertEditCodeManager,
  EditAdvertDetailsManager
} from "@/app/adverts/controllers/advertController";

// OTP Verification Component
const OTPVerificationModal = ({ isOpen, onClose, onVerify, type, isLoading }) => {
  const [otpCode, setOtpCode] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (otpCode.trim()) {
      onVerify(otpCode.trim());
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md">
        <div className="p-6">
          <div className="text-center mb-6">
            <Shield className="mx-auto text-blue-600 mb-3" size={48} />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Verify Your Identity
            </h3>
            <p className="text-gray-600">
              Enter the verification code sent to your email to edit your {type} details
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Verification Code
              </label>
              <input
                type="text"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="Enter 6-digit code"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg font-mono"
                maxLength={6}
                required
              />
            </div>

            <div className="flex gap-3">
              <Button
                buttonText="Cancel"
                onClick={onClose}
                buttonColor="bg-gray-200"
                textColor="text-gray-700"
                className="flex-1"
              />
              <Button
                buttonText="Verify"
                type="submit"
                isLoading={isLoading}
                buttonColor="bg-blue-600"
                textColor="text-white"
                className="flex-1"
                disabled={!otpCode.trim()}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Purchase Item Component
const PurchaseItem = ({ item, type, onEdit, icon: Icon, colorClass }) => {
  return (
    <div className="border rounded-lg p-4 hover:bg-gray-50">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <Icon className={colorClass} size={24} />
          <div>
            <h4 className="font-medium text-gray-900">{item.name || `${type} Purchase`}</h4>
            {item.category && (
              <p className="text-sm text-gray-600">{item.category.name}</p>
            )}
          </div>
        </div>
        <Button
          buttonText="Edit"
          onClick={() => onEdit(item)}
          buttonColor="bg-blue-600"
          textColor="text-white"
          className="text-sm px-3 py-1"
          prefixIcon={<Edit size={14} />}
        />
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-gray-500">Quantity:</span>
          <span className="ml-2 font-medium">{item.quantity}</span>
        </div>
        <div>
          <span className="text-gray-500">Price:</span>
          <span className="ml-2 font-medium">{item.currency} {item.total_price || item.price}</span>
        </div>
        {item.size && (
          <div>
            <span className="text-gray-500">Size:</span>
            <span className="ml-2 font-medium">{item.size}</span>
          </div>
        )}
        {item.location && (
          <div>
            <span className="text-gray-500">Location:</span>
            <span className="ml-2 font-medium">{item.location}</span>
          </div>
        )}
        {item.format && (
          <div>
            <span className="text-gray-500">Format:</span>
            <span className="ml-2 font-medium">{item.format}</span>
          </div>
        )}
        {item.placement && (
          <div>
            <span className="text-gray-500">Placement:</span>
            <span className="ml-2 font-medium">{item.placement}</span>
          </div>
        )}
      </div>

      {item.content_url && (
        <div className="mt-3 pt-3 border-t">
          <p className="text-sm text-gray-500">Content URL:</p>
          <a 
            href={item.content_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 text-sm break-all"
          >
            {item.content_url}
          </a>
        </div>
      )}
    </div>
  );
};

const EventPurchaseManagementPage = () => {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  
  const eventId = params?.eventId;
  const email = searchParams?.get('email');

  const [showOTPModal, setShowOTPModal] = useState(false);
  const [editingType, setEditingType] = useState(null); // 'tickets', 'booths', 'adverts'
  const [editingItem, setEditingItem] = useState(null);
  const [verificationCode, setVerificationCode] = useState("");
  const [showBoothEditForm, setShowBoothEditForm] = useState(false);
  const [showAdvertEditForm, setShowAdvertEditForm] = useState(false);

  // API calls
  const { data: eventInfo, isLoading: loadingEvent } = useGetSingleEventPublicManager({ 
    eventId, 
    enabled: !!eventId 
  });

  const { data: tickets, isLoading: loadingTickets } = useGetCustomerTicketsForEventManager(email, eventId);
  const { data: booths, isLoading: loadingBooths } = useGetCustomerBoothsForEventManager(email, eventId);
  const { data: adverts, isLoading: loadingAdverts } = useGetCustomerAdvertsForEventManager(email, eventId);

  // OTP and Edit controllers
  const { requestEditCode: requestTicketCode, isLoading: requestingTicketCode } = RequestTicketEditCodeManager();
  const { requestEditCode: requestBoothCode, isLoading: requestingBoothCode } = RequestBoothEditCodeManager();
  const { requestEditCode: requestAdvertCode, isLoading: requestingAdvertCode } = RequestAdvertEditCodeManager();

  const { editTicketDetails, isLoading: editingTickets } = EditTicketDetailsManager();
  const { editBoothDetails, isLoading: editingBooths } = EditBoothDetailsManager();
  const { editAdvertDetails, isLoading: editingAdverts } = EditAdvertDetailsManager();

  // Redirect if no email
  useEffect(() => {
    if (!email) {
      router.push('/my-purchases');
    }
  }, [email, router]);

  const handleStartEdit = async (type, item) => {
    setEditingType(type);
    setEditingItem(item);

    // Request OTP code
    try {
      switch (type) {
        case 'tickets':
          await requestTicketCode(email, eventId);
          break;
        case 'booths':
          await requestBoothCode(email, eventId);
          break;
        case 'adverts':
          await requestAdvertCode(email, eventId);
          break;
      }
      setShowOTPModal(true);
    } catch (error) {
      console.error("Error requesting edit code:", error);
    }
  };

  const handleOTPVerify = (code) => {
    setVerificationCode(code);
    setShowOTPModal(false);
    
    // Show appropriate edit form based on type
    if (editingType === 'booths') {
      setShowBoothEditForm(true);
    } else if (editingType === 'adverts') {
      setShowAdvertEditForm(true);
    } else {
      // For tickets, show alert for now (will be implemented later)
      alert(`Verification successful! You can now edit your ${editingType}.`);
    }
  };

  const handleBoothSave = async (formData) => {
    try {
      const boothData = {
        email,
        eventId,
        code: verificationCode,
        booths: [{
          boothId: editingItem._id,
          ...formData
        }]
      };
      
      await editBoothDetails(boothData);
      setShowBoothEditForm(false);
      setEditingItem(null);
      setEditingType(null);
      setVerificationCode("");
    } catch (error) {
      console.error("Error saving booth details:", error);
    }
  };

  const handleBoothCancel = () => {
    setShowBoothEditForm(false);
    setEditingItem(null);
    setEditingType(null);
    setVerificationCode("");
  };

  const handleAdvertSave = async (formData) => {
    try {
      const advertData = {
        email,
        eventId,
        code: verificationCode,
        adverts: [{
          advertId: editingItem._id,
          ...formData
        }]
      };
      
      await editAdvertDetails(advertData);
      setShowAdvertEditForm(false);
      setEditingItem(null);
      setEditingType(null);
      setVerificationCode("");
    } catch (error) {
      console.error("Error saving advert details:", error);
    }
  };

  const handleAdvertCancel = () => {
    setShowAdvertEditForm(false);
    setEditingItem(null);
    setEditingType(null);
    setVerificationCode("");
  };

  const isLoading = loadingEvent || loadingTickets || loadingBooths || loadingAdverts;
  const event = eventInfo?.data;

  if (!email) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Button
              buttonText=""
              onClick={() => router.push('/my-purchases')}
              buttonColor="bg-gray-100"
              textColor="text-gray-600"
              className="p-2"
              prefixIcon={<ArrowLeft size={20} />}
            />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {isLoading ? "Loading..." : event?.name || "Event Purchases"}
              </h1>
              <p className="text-gray-600">
                Manage your purchases for this event
              </p>
            </div>
          </div>

          {/* Event Info */}
          {event && (
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                {new Date(event.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              {event.time && (
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  {event.time}
                </div>
              )}
              {event.location && (
                <div className="flex items-center gap-2">
                  <MapPin size={16} />
                  {event.location}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="bg-white rounded-xl shadow-sm border p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your purchases...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Tickets Section */}
            {tickets?.data?.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border">
                <div className="p-6 border-b">
                  <div className="flex items-center gap-3">
                    <Ticket className="text-orange-600" size={24} />
                    <h2 className="text-xl font-semibold text-gray-900">
                      Your Tickets ({tickets.data.length})
                    </h2>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  {tickets.data.map((ticket, index) => (
                    <PurchaseItem
                      key={index}
                      item={ticket}
                      type="Ticket"
                      onEdit={() => handleStartEdit('tickets', ticket)}
                      icon={Ticket}
                      colorClass="text-orange-600"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Booths Section */}
            {booths?.data?.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border">
                <div className="p-6 border-b">
                  <div className="flex items-center gap-3">
                    <Building2 className="text-blue-600" size={24} />
                    <h2 className="text-xl font-semibold text-gray-900">
                      Your Booths ({booths.data.length})
                    </h2>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  {booths.data.map((booth, index) => (
                    <PurchaseItem
                      key={index}
                      item={booth}
                      type="Booth"
                      onEdit={() => handleStartEdit('booths', booth)}
                      icon={Building2}
                      colorClass="text-blue-600"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Adverts Section */}
            {adverts?.data?.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border">
                <div className="p-6 border-b">
                  <div className="flex items-center gap-3">
                    <Megaphone className="text-purple-600" size={24} />
                    <h2 className="text-xl font-semibold text-gray-900">
                      Your Advertisements ({adverts.data.length})
                    </h2>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  {adverts.data.map((advert, index) => (
                    <PurchaseItem
                      key={index}
                      item={advert}
                      type="Advertisement"
                      onEdit={() => handleStartEdit('adverts', advert)}
                      icon={Megaphone}
                      colorClass="text-purple-600"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* No Purchases */}
            {(!tickets?.data?.length && !booths?.data?.length && !adverts?.data?.length) && (
              <div className="bg-white rounded-xl shadow-sm border p-8">
                <div className="text-center">
                  <AlertCircle className="mx-auto text-gray-400 mb-4" size={48} />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No purchases found
                  </h3>
                  <p className="text-gray-600">
                    We couldn't find any purchases for <strong>{email}</strong> at this event.
                  </p>
                </div>
              </div>
            )}

            {/* Security Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Shield className="text-blue-600 mt-0.5" size={20} />
                <div>
                  <h4 className="font-medium text-blue-900 mb-1">Security Notice</h4>
                  <p className="text-sm text-blue-800">
                    To protect your information, we'll send a verification code to your email 
                    before allowing any changes to your purchase details.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* OTP Verification Modal */}
      <OTPVerificationModal
        isOpen={showOTPModal}
        onClose={() => setShowOTPModal(false)}
        onVerify={handleOTPVerify}
        type={editingType}
        isLoading={requestingTicketCode || requestingBoothCode || requestingAdvertCode}
      />

      {/* Booth Edit Form */}
      {showBoothEditForm && editingItem && (
        <BoothEditForm
          booth={editingItem}
          onSave={handleBoothSave}
          onCancel={handleBoothCancel}
          isLoading={editingBooths}
        />
      )}

      {/* Advert Edit Form */}
      {showAdvertEditForm && editingItem && (
        <AdvertEditForm
          advert={editingItem}
          onSave={handleAdvertSave}
          onCancel={handleAdvertCancel}
          isLoading={editingAdverts}
        />
      )}
    </div>
  );
};

export default EventPurchaseManagementPage;