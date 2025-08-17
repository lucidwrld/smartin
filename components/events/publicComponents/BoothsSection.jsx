"use client";

import React, { useState } from "react";
import { Building2, ShoppingCart, Plus, Minus, MapPin, Ruler, DollarSign, Clock, X, Trash2 } from "lucide-react";
import { useGetEventBoothsManager, BuyBoothManager, BuyBoothMobileManager } from "@/app/booths/controllers/boothController";
import Button from "@/components/Button";
import InputWithFullBorder from "@/components/InputWithFullBoarder";

const BoothBookingModal = ({ isOpen, onClose, booths, eventId }) => {
  const [cart, setCart] = useState([]); // Array of {boothId, quantity, booth}
  const [customerData, setCustomerData] = useState({
    email: "",
    name: "",
    phone: "",
  });
  const [couponCode, setCouponCode] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  const { buyBooth, isLoading: buyingBooth } = BuyBoothManager();
  const { buyBoothMobile, isLoading: buyingBoothMobile } = BuyBoothMobileManager();

  const addToCart = (booth) => {
    const existingItem = cart.find(item => item.boothId === booth._id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.boothId === booth._id 
          ? { ...item, quantity: Math.min(item.quantity + 1, booth.max_per_order || 10) }
          : item
      ));
    } else {
      setCart([...cart, { boothId: booth._id, quantity: 1, booth }]);
    }
  };

  const updateQuantity = (boothId, newQuantity) => {
    if (newQuantity <= 0) {
      setCart(cart.filter(item => item.boothId !== boothId));
    } else {
      setCart(cart.map(item => 
        item.boothId === boothId 
          ? { ...item, quantity: newQuantity }
          : item
      ));
    }
  };

  const removeFromCart = (boothId) => {
    setCart(cart.filter(item => item.boothId !== boothId));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.booth.price * item.quantity), 0);
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    
    if (!customerData.email || !customerData.name) {
      return;
    }

    if (cart.length === 0) {
      return;
    }

    const bookingData = {
      email: customerData.email,
      name: customerData.name,
      path: window.location.href,
      booths: cart.map(item => ({
        boothId: item.boothId,
        quantity: item.quantity,
      })),
      ...(couponCode && { couponCode }),
    };

    try {
      if (isMobile) {
        await buyBoothMobile(eventId, bookingData);
      } else {
        await buyBooth(eventId, bookingData);
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
            <h3 className="text-xl font-semibold">Book Exhibition Booths</h3>
            <button 
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Left: Available Booths */}
            <div>
              <h4 className="font-medium mb-4">Available Booths</h4>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {booths.map((booth) => (
                  <div
                    key={booth._id}
                    className="border rounded-lg p-4 hover:bg-gray-50"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h5 className="font-medium">{booth.name}</h5>
                        <p className="text-sm text-gray-600">{booth.category?.name}</p>
                      </div>
                      <span className="text-lg font-bold text-green-600">
                        {booth.currency} {booth.price}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{booth.description}</p>
                    <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-3">
                      <span className="flex items-center gap-1">
                        <Ruler size={12} />
                        {booth.size}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin size={12} />
                        {booth.location}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        {booth.quantity_remaining} remaining
                      </span>
                      <Button
                        buttonText="Add to Cart"
                        onClick={() => addToCart(booth)}
                        disabled={booth.sold_out || !booth.is_active}
                        buttonColor="bg-blue-500"
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
                  <Building2 size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">Your cart is empty</p>
                  <p className="text-sm text-gray-400">Add booths from the left to get started</p>
                </div>
              ) : (
                <>
                  {/* Cart Items */}
                  <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                    {cart.map((item) => (
                      <div key={item.boothId} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h6 className="font-medium">{item.booth.name}</h6>
                            <div className="text-xs text-gray-500 flex gap-2">
                              <span>{item.booth.size}</span>
                              <span>•</span>
                              <span>{item.booth.location}</span>
                            </div>
                            <span className="text-sm text-gray-600">
                              {item.booth.currency} {item.booth.price} each
                            </span>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.boothId)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.boothId, item.quantity - 1)}
                              className="p-1 border rounded hover:bg-gray-100"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="px-3 py-1 border rounded min-w-[50px] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.boothId, item.quantity + 1)}
                              className="p-1 border rounded hover:bg-gray-100"
                              disabled={item.quantity >= (item.booth.max_per_order || 10)}
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <span className="font-medium">
                            {item.booth.currency} {item.booth.price * item.quantity}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Customer Information Form */}
                  <form onSubmit={handleBooking} className="space-y-4">
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
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold">Total:</span>
                        <span className="text-2xl font-bold text-blue-600">
                          {cart[0]?.booth.currency} {calculateTotal()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {cart.reduce((total, item) => total + item.quantity, 0)} booth(s)
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
                        buttonText="Complete Booking"
                        type="submit"
                        isLoading={buyingBooth || buyingBoothMobile}
                        buttonColor="bg-blue-500"
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

const BoothsSection = ({ eventId }) => {
  const [showBookingModal, setShowBookingModal] = useState(false);

  const { data: boothsData, isLoading, error } = useGetEventBoothsManager(eventId);

  const booths = boothsData?.data || [];

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

  if (error || !booths.length) {
    return null; // Don't show section if no booths available
  }

  return (
    <>
      <section id="booths" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              Exhibition Booths
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Showcase your business at our event. Book premium booth spaces to connect with attendees.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {booths.map((booth) => (
              <div
                key={booth._id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow border border-gray-200"
              >
                {/* Booth Header */}
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-6 text-white">
                  <div className="flex items-center gap-3 mb-2">
                    <Building2 size={24} />
                    <h3 className="text-xl font-bold">{booth.name}</h3>
                  </div>
                  <p className="text-blue-100">{booth.category?.name}</p>
                </div>

                {/* Booth Content */}
                <div className="p-6">
                  <p className="text-gray-600 mb-4">{booth.description}</p>
                  
                  {/* Booth Details */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign size={16} className="text-green-500" />
                      <span className="font-semibold text-2xl text-green-600">
                        {booth.currency} {booth.price}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Ruler size={16} className="text-gray-400" />
                        <span className="text-gray-600">{booth.size}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-gray-400" />
                        <span className="text-gray-600">{booth.location}</span>
                      </div>
                    </div>
                    
                    {booth.sale_start_date && booth.sale_end_date && (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock size={16} />
                        <span>
                          Sale: {new Date(booth.sale_start_date).toLocaleDateString()} - {new Date(booth.sale_end_date).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Available:</span>
                      <span className={`font-medium ${booth.quantity_remaining <= 5 ? 'text-red-500' : 'text-green-500'}`}>
                        {booth.quantity_remaining} left
                      </span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all"
                        style={{ width: `${booth.sales_progress || 0}%` }}
                      ></div>
                    </div>
                  </div>

                  {booth.requires_approval && (
                    <p className="text-xs text-yellow-600 mb-4 text-center">
                      * Requires approval after booking
                    </p>
                  )}
                  
                  {booth.is_free && (
                    <p className="text-xs text-green-600 mb-4 text-center font-medium">
                      ✓ Free booth space
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Central Booking Button */}
          <div className="text-center">
            <Button
              buttonText="Book Exhibition Booths"
              onClick={() => setShowBookingModal(true)}
              buttonColor="bg-blue-500"
              textColor="text-white"
              className="px-8 py-4 text-lg"
              prefixIcon={<Building2 size={20} />}
            />
            <p className="text-sm text-gray-600 mt-2">
              Select multiple booth types and quantities in one booking
            </p>
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      <BoothBookingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        booths={booths}
        eventId={eventId}
      />
    </>
  );
};

export default BoothsSection;