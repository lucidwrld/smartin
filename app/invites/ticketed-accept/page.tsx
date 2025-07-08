"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getQueryParams } from "@/utils/getQueryParams";
import useGetInviteByCodeManager from "@/app/events/controllers/getInviteByCodeController";
import { RespondToInviteManager } from "@/app/events/controllers/respondToInviteController";
import { logoMain1 } from "@/public/images";
import Image from "next/image";
import Link from "next/link";
import Loader from "@/components/Loader";
import TicketSelectionStep from "@/components/TicketSelectionStep";
import InvitationPaymentStep from "@/components/InvitationPaymentStep";
import CustomButton from "@/components/Button";
import { Check, Calendar, MapPin, Clock, ArrowLeft } from "lucide-react";
import { formatDateToLongString } from "@/utils/formatDateToLongString";
import { convertToAmPm } from "@/utils/timeStringToAMPM";
import { addToGoogleCalendar } from "@/utils/addtoGoogleCalendar";

const TicketedInviteAcceptPage = () => {
  const router = useRouter();
  const { code } = getQueryParams(["code"]);
  const { data, isLoading } = useGetInviteByCodeManager({ code: code });
  const { sendResponse, isLoading: sending, isSuccess } = RespondToInviteManager();
  
  const [currentStep, setCurrentStep] = useState(1); // 1: Tickets, 2: Payment, 3: Success
  const [selectedTickets, setSelectedTickets] = useState([]);
  const [paymentResult, setPaymentResult] = useState(null);

  const event = data?.event;
  const guestInfo = data;

  useEffect(() => {
    if (isSuccess && paymentResult) {
      setCurrentStep(3);
    }
  }, [isSuccess, paymentResult]);

  const handleTicketSelection = (tickets) => {
    setSelectedTickets(tickets);
  };

  const handlePaymentComplete = async (result) => {
    setPaymentResult(result);
    
    // Submit invitation acceptance with ticket purchase info
    const detail = {
      code: code,
      response: "accepted",
      tickets: result.tickets,
      payment_info: {
        transaction_id: result.transactionId,
        amount: result.amount,
        payment_method: result.paymentMethod
      }
    };
    
    await sendResponse(detail);
  };

  const canProceedToPayment = () => {
    return selectedTickets.length > 0 && selectedTickets.some(ticket => ticket.selectedQuantity > 0);
  };

  const getTotalAmount = () => {
    return selectedTickets.reduce((total, ticket) => total + ticket.subtotal, 0);
  };

  const formatCurrency = (amount, currency = "USD") => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  if (isLoading) {
    return <Loader />;
  }

  if (!event?.enable_ticketing) {
    // Redirect to regular invitation page if ticketing is not enabled
    router.replace(`/invites?code=${code}`);
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col text-brandBlack bg-gray-50">
      {/* Header */}
      <header className="w-full bg-white shadow-sm py-4 px-6">
        <div className="container mx-auto flex justify-between items-center">
          <Image src={logoMain1} alt="Logo" className="h-10 w-auto" />
          <h1 className="text-xl font-medium text-brandBlack">{event?.name}</h1>
        </div>
      </header>

      {/* Progress Indicator */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-center space-x-4">
            <div className={`flex items-center ${currentStep >= 1 ? 'text-purple-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                currentStep >= 1 ? 'border-purple-600 bg-purple-600 text-white' : 'border-gray-300'
              }`}>
                {currentStep > 1 ? <Check className="w-4 h-4" /> : '1'}
              </div>
              <span className="ml-2 font-medium">Select Tickets</span>
            </div>
            
            <div className={`w-8 h-0.5 ${currentStep >= 2 ? 'bg-purple-600' : 'bg-gray-300'}`} />
            
            <div className={`flex items-center ${currentStep >= 2 ? 'text-purple-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                currentStep >= 2 ? 'border-purple-600 bg-purple-600 text-white' : 'border-gray-300'
              }`}>
                {currentStep > 2 ? <Check className="w-4 h-4" /> : '2'}
              </div>
              <span className="ml-2 font-medium">Payment</span>
            </div>
            
            <div className={`w-8 h-0.5 ${currentStep >= 3 ? 'bg-purple-600' : 'bg-gray-300'}`} />
            
            <div className={`flex items-center ${currentStep >= 3 ? 'text-purple-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                currentStep >= 3 ? 'border-purple-600 bg-purple-600 text-white' : 'border-gray-300'
              }`}>
                {currentStep >= 3 ? <Check className="w-4 h-4" /> : '3'}
              </div>
              <span className="ml-2 font-medium">Confirmation</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Event Info Header */}
          <div className="bg-white rounded-lg p-6 mb-8 shadow-sm">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-1/3">
                <img
                  src={event?.image}
                  alt={event?.name}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-semibold mb-2">{event?.name}</h2>
                <p className="text-gray-600 mb-4">{event?.description}</p>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDateToLongString(event?.date)}</span>
                    <Clock className="w-4 h-4 ml-2" />
                    <span>{convertToAmPm(event?.time)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{event?.venue}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step Content */}
          <div className="bg-white rounded-lg shadow-sm">
            {currentStep === 1 && (
              <div className="p-6">
                <TicketSelectionStep
                  event={event}
                  onTicketSelection={handleTicketSelection}
                  selectedTickets={selectedTickets}
                  isLoading={sending}
                />
                
                {/* Navigation */}
                <div className="flex justify-between mt-8 pt-6 border-t">
                  <CustomButton
                    buttonText="Back to Invitation"
                    buttonColor="bg-gray-300"
                    textColor="text-gray-700"
                    radius="rounded-full"
                    prefixIcon={<ArrowLeft className="w-4 h-4" />}
                    onClick={() => router.push(`/invites?code=${code}`)}
                  />
                  
                  <CustomButton
                    buttonText={`Proceed to Payment (${formatCurrency(getTotalAmount(), selectedTickets[0]?.currency || 'USD')})`}
                    buttonColor="bg-purple-600"
                    radius="rounded-full"
                    disabled={!canProceedToPayment()}
                    onClick={() => setCurrentStep(2)}
                  />
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="p-6">
                <InvitationPaymentStep
                  selectedTickets={selectedTickets}
                  guestInfo={guestInfo}
                  onPaymentComplete={handlePaymentComplete}
                  isLoading={sending}
                />
                
                {/* Navigation */}
                <div className="flex justify-between mt-8 pt-6 border-t">
                  <CustomButton
                    buttonText="Back to Tickets"
                    buttonColor="bg-gray-300"
                    textColor="text-gray-700"
                    radius="rounded-full"
                    prefixIcon={<ArrowLeft className="w-4 h-4" />}
                    onClick={() => setCurrentStep(1)}
                    disabled={sending}
                  />
                </div>
              </div>
            )}

            {currentStep === 3 && paymentResult && (
              <div className="p-6 text-center">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-green-600" />
                  </div>
                  
                  <h2 className="text-2xl font-semibold mb-2">Payment Successful!</h2>
                  <p className="text-gray-600 mb-6">
                    Your invitation has been accepted and your tickets have been purchased successfully.
                  </p>
                  
                  <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                    <h3 className="font-semibold mb-2">Order Details</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Transaction ID: {paymentResult.transactionId}
                    </p>
                    <p className="text-sm text-gray-600 mb-2">
                      Total Amount: {formatCurrency(paymentResult.amount, selectedTickets[0]?.currency)}
                    </p>
                    <div className="space-y-1">
                      {selectedTickets.map((ticket) => (
                        <p key={ticket.id} className="text-sm">
                          {ticket.name} × {ticket.selectedQuantity}
                        </p>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <CustomButton
                      buttonText="Add Event to Calendar"
                      buttonColor="bg-purple-600"
                      radius="rounded-full w-full"
                      onClick={() =>
                        addToGoogleCalendar({
                          date: event?.date,
                          time: event?.time,
                          eventName: event?.name,
                          location: event?.venue,
                          durationHours: 2,
                        })
                      }
                    />
                    
                    <CustomButton
                      buttonText="View Invitation Details"
                      buttonColor="bg-gray-300"
                      textColor="text-gray-700"
                      radius="rounded-full w-full"
                      onClick={() => router.push(`/invites?code=${code}`)}
                    />
                  </div>
                  
                  <p className="text-sm text-gray-500 mt-4">
                    Your tickets and receipt have been sent to {guestInfo?.email}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-600">
            <p>
              Powered by{" "}
              <Link
                href="https://smartinvites.xyz"
                className="underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Smart Invites
              </Link>{" "}
              © {new Date().getFullYear()}
            </p>
            <div className="flex gap-6">
              <a href="/privacy" className="hover:text-brandPurple">
                Privacy Policy
              </a>
              <a href="/terms-and-condition" className="hover:text-brandPurple">
                Terms & Conditions
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TicketedInviteAcceptPage;