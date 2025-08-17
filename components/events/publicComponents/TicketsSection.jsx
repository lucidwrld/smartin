"use client";

import React, { useState } from "react";
import { Ticket, ShoppingCart, Plus, Minus, Clock, DollarSign, X, Trash2 } from "lucide-react";
import { useGetEventTicketsManager, BuyTicketManager, BuyTicketMobileManager } from "@/app/tickets/controllers/ticketController";
import Button from "@/components/Button";
import InputWithFullBorder from "@/components/InputWithFullBoarder";

const TicketPurchaseModal = ({ isOpen, onClose, tickets, eventId }) => {
  const [cart, setCart] = useState([]); // Array of {ticketId, quantity, ticket}
  const [customerData, setCustomerData] = useState({
    email: "",
    name: "",
    phone: "",
  });
  const [couponCode, setCouponCode] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  const { buyTicket, isLoading: buyingTicket } = BuyTicketManager();
  const { buyTicketMobile, isLoading: buyingTicketMobile } = BuyTicketMobileManager();

  const addToCart = (ticket) => {
    const existingItem = cart.find(item => item.ticketId === ticket._id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.ticketId === ticket._id 
          ? { ...item, quantity: Math.min(item.quantity + 1, ticket.max_per_order || 10) }
          : item
      ));
    } else {
      setCart([...cart, { ticketId: ticket._id, quantity: 1, ticket }]);
    }
  };

  const updateQuantity = (ticketId, newQuantity) => {
    if (newQuantity <= 0) {
      setCart(cart.filter(item => item.ticketId !== ticketId));
    } else {
      setCart(cart.map(item => 
        item.ticketId === ticketId 
          ? { ...item, quantity: newQuantity }
          : item
      ));
    }
  };

  const removeFromCart = (ticketId) => {
    setCart(cart.filter(item => item.ticketId !== ticketId));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.ticket.price * item.quantity), 0);
  };

  const handlePurchase = async (e) => {
    e.preventDefault();
    
    if (!customerData.email || !customerData.name) {
      return;
    }

    if (cart.length === 0) {
      return;
    }

    const purchaseData = {
      email: customerData.email,
      name: customerData.name,
      path: window.location.href,
      tickets: cart.map(item => ({
        ticketId: item.ticketId,
        quantity: item.quantity,
      })),
      ...(couponCode && { couponCode }),
    };

    try {
      if (isMobile) {
        await buyTicketMobile(eventId, purchaseData);
      } else {
        await buyTicket(eventId, purchaseData);
      }
      onClose();
      setCart([]);
      setCustomerData({ email: "", name: "", phone: "" });
      setCouponCode("");
    } catch (error) {
      // Controller handles error notifications
    }
  };

  const resetModal = () => {
    setCart([]);
    setCustomerData({ email: "", name: "", phone: "" });
    setCouponCode("");
    setIsMobile(false);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold">Purchase Tickets</h3>
            <button 
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Left: Available Tickets */}
            <div>
              <h4 className="font-medium mb-4">Available Tickets</h4>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {tickets.map((ticket) => (
                  <div
                    key={ticket._id}
                    className="border rounded-lg p-4 hover:bg-gray-50"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h5 className="font-medium">{ticket.name}</h5>
                        <p className="text-sm text-gray-600">{ticket.category?.name}</p>
                      </div>
                      <span className="text-lg font-bold text-green-600">
                        {ticket.currency} {ticket.price}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{ticket.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        {ticket.quantity_remaining} remaining
                      </span>
                      <Button
                        buttonText="Add to Cart"
                        onClick={() => addToCart(ticket)}
                        disabled={ticket.sold_out || !ticket.is_active}
                        buttonColor="bg-orange-500"
                        textColor="text-white"
                        className="text-sm py-1 px-3"
                        prefixIcon={<Plus size={14} />}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Cart & Checkout */}
            <div>
              <h4 className="font-medium mb-4">Your Cart ({cart.length})</h4>
              
              {cart.length === 0 ? (
                <div className="bg-gray-50 p-8 rounded-lg text-center">
                  <ShoppingCart size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">Your cart is empty</p>
                  <p className="text-sm text-gray-400">Add tickets from the left to get started</p>
                </div>
              ) : (
                <>
                  {/* Cart Items */}
                  <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                    {cart.map((item) => (
                      <div key={item.ticketId} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h6 className="font-medium">{item.ticket.name}</h6>
                            <span className="text-sm text-gray-600">
                              {item.ticket.currency} {item.ticket.price} each
                            </span>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.ticketId)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.ticketId, item.quantity - 1)}
                              className="p-1 border rounded hover:bg-gray-100"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="px-3 py-1 border rounded min-w-[50px] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.ticketId, item.quantity + 1)}
                              className="p-1 border rounded hover:bg-gray-100"
                              disabled={item.quantity >= (item.ticket.max_per_order || 10)}
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <span className="font-medium">
                            {item.ticket.currency} {item.ticket.price * item.quantity}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Customer Information Form */}
                  <form onSubmit={handlePurchase} className="space-y-4">
                    <InputWithFullBorder
                      label="Email Address"
                      type="email"
                      value={customerData.email}
                      onChange={(e) => setCustomerData({...customerData, email: e.target.value})}
                      isRequired
                      placeholder="your@email.com"
                    />

                    <InputWithFullBorder
                      label="Full Name"
                      value={customerData.name}
                      onChange={(e) => setCustomerData({...customerData, name: e.target.value})}
                      isRequired
                      placeholder="Your full name"
                    />

                    <InputWithFullBorder
                      label="Phone Number (Optional)"
                      value={customerData.phone}
                      onChange={(e) => setCustomerData({...customerData, phone: e.target.value})}
                      placeholder="+1234567890"
                    />

                    <InputWithFullBorder
                      label="Coupon Code (Optional)"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Enter coupon code"
                    />

                    {/* Payment Method */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Payment Method</label>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="paymentMethod"
                            checked={!isMobile}
                            onChange={() => setIsMobile(false)}
                            className="mr-2"
                          />
                          Web Payment
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="paymentMethod"
                            checked={isMobile}
                            onChange={() => setIsMobile(true)}
                            className="mr-2"
                          />
                          Mobile Payment
                        </label>
                      </div>
                    </div>

                    {/* Total */}
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold">Total:</span>
                        <span className="text-2xl font-bold text-orange-600">
                          {cart[0]?.ticket.currency} {calculateTotal()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {cart.reduce((total, item) => total + item.quantity, 0)} ticket(s)
                      </p>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3">
                      <Button
                        buttonText="Cancel"
                        onClick={handleClose}
                        buttonColor="bg-gray-200"
                        textColor="text-gray-700"
                        className="flex-1"
                      />
                      <Button
                        buttonText="Complete Purchase"
                        type="submit"
                        isLoading={buyingTicket || buyingTicketMobile}
                        buttonColor="bg-orange-500"
                        textColor="text-white"
                        className="flex-1"
                        disabled={cart.length === 0 || !customerData.email || !customerData.name}
                      />
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TicketsSection = ({ eventId }) => {
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  const { data: ticketsData, isLoading, error } = useGetEventTicketsManager(eventId);

  const tickets = ticketsData?.data || [];

  if (isLoading) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-96 mx-auto"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !tickets.length) {
    return null; // Don't show section if no tickets available
  }

  return (
    <>
      <section id="tickets" className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              Event Tickets
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Secure your spot at this amazing event. Choose from our available ticket options.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {tickets.map((ticket) => (
              <div
                key={ticket._id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                {/* Ticket Header */}
                <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 text-white">
                  <div className="flex items-center gap-3 mb-2">
                    <Ticket size={24} />
                    <h3 className="text-xl font-bold">{ticket.name}</h3>
                  </div>
                  <p className="text-orange-100">{ticket.category?.name}</p>
                </div>

                {/* Ticket Content */}
                <div className="p-6">
                  <p className="text-gray-600 mb-4">{ticket.description}</p>
                  
                  {/* Ticket Details */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign size={16} className="text-green-500" />
                      <span className="font-semibold text-2xl text-green-600">
                        {ticket.currency} {ticket.price}
                      </span>
                    </div>
                    
                    {ticket.sale_start_date && ticket.sale_end_date && (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock size={16} />
                        <span>
                          Sale: {new Date(ticket.sale_start_date).toLocaleDateString()} - {new Date(ticket.sale_end_date).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Available:</span>
                      <span className={`font-medium ${ticket.quantity_remaining <= 10 ? 'text-red-500' : 'text-green-500'}`}>
                        {ticket.quantity_remaining} left
                      </span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-orange-500 h-2 rounded-full transition-all"
                        style={{ width: `${ticket.sales_progress || 0}%` }}
                      ></div>
                    </div>
                  </div>

                  {ticket.requires_approval && (
                    <p className="text-xs text-yellow-600 mb-4 text-center">
                      * Requires approval after purchase
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Central Purchase Button */}
          <div className="text-center">
            <Button
              buttonText="Purchase Tickets"
              onClick={() => setShowPurchaseModal(true)}
              buttonColor="bg-orange-500"
              textColor="text-white"
              className="px-8 py-4 text-lg"
              prefixIcon={<ShoppingCart size={20} />}
            />
            <p className="text-sm text-gray-600 mt-2">
              Select multiple ticket types and quantities in one purchase
            </p>
          </div>
        </div>
      </section>

      {/* Purchase Modal */}
      <TicketPurchaseModal
        isOpen={showPurchaseModal}
        onClose={() => setShowPurchaseModal(false)}
        tickets={tickets}
        eventId={eventId}
      />
    </>
  );
};

export default TicketsSection;