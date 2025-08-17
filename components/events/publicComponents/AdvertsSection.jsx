"use client";

import React, { useState } from "react";
import { Megaphone, ShoppingCart, Plus, Minus, Monitor, Image, DollarSign, Clock, Eye, X, Trash2 } from "lucide-react";
import { useGetEventAdvertsManager, BuyAdvertManager, BuyAdvertMobileManager } from "@/app/adverts/controllers/advertController";
import Button from "@/components/Button";
import InputWithFullBorder from "@/components/InputWithFullBoarder";

const AdvertBookingModal = ({ isOpen, onClose, adverts, eventId }) => {
  const [cart, setCart] = useState([]); // Array of {advertId, quantity, advert, content_url?, preview_image_url?}
  const [customerData, setCustomerData] = useState({
    email: "",
    name: "",
    phone: "",
  });
  const [couponCode, setCouponCode] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  const { buyAdvert, isLoading: buyingAdvert } = BuyAdvertManager();
  const { buyAdvertMobile, isLoading: buyingAdvertMobile } = BuyAdvertMobileManager();

  const addToCart = (advert) => {
    const existingItem = cart.find(item => item.advertId === advert._id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.advertId === advert._id 
          ? { ...item, quantity: Math.min(item.quantity + 1, advert.max_per_order || 10) }
          : item
      ));
    } else {
      setCart([...cart, { 
        advertId: advert._id, 
        quantity: 1, 
        advert,
        content_url: "",
        preview_image_url: ""
      }]);
    }
  };

  const updateQuantity = (advertId, newQuantity) => {
    if (newQuantity <= 0) {
      setCart(cart.filter(item => item.advertId !== advertId));
    } else {
      setCart(cart.map(item => 
        item.advertId === advertId 
          ? { ...item, quantity: newQuantity }
          : item
      ));
    }
  };

  const updateContentUrl = (advertId, url) => {
    setCart(cart.map(item => 
      item.advertId === advertId 
        ? { ...item, content_url: url }
        : item
    ));
  };

  const updatePreviewUrl = (advertId, url) => {
    setCart(cart.map(item => 
      item.advertId === advertId 
        ? { ...item, preview_image_url: url }
        : item
    ));
  };

  const removeFromCart = (advertId) => {
    setCart(cart.filter(item => item.advertId !== advertId));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.advert.price * item.quantity), 0);
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
      adverts: cart.map(item => ({
        advertId: item.advertId,
        quantity: item.quantity,
        ...(item.content_url && { content_url: item.content_url }),
        ...(item.preview_image_url && { preview_image_url: item.preview_image_url }),
      })),
      ...(couponCode && { couponCode }),
    };

    try {
      if (isMobile) {
        await buyAdvertMobile(eventId, bookingData);
      } else {
        await buyAdvert(eventId, bookingData);
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
      <div className="bg-white rounded-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold">Book Advertisement Spaces</h3>
            <button 
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Left: Available Adverts */}
            <div>
              <h4 className="font-medium mb-4">Available Ad Spaces</h4>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {adverts.map((advert) => (
                  <div
                    key={advert._id}
                    className="border rounded-lg p-4 hover:bg-gray-50"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h5 className="font-medium">{advert.name}</h5>
                        <p className="text-sm text-gray-600">{advert.category?.name}</p>
                      </div>
                      <span className="text-lg font-bold text-green-600">
                        {advert.currency} {advert.price}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{advert.description}</p>
                    <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-3">
                      <span className="flex items-center gap-1">
                        <Monitor size={12} />
                        {advert.format}
                      </span>
                      <span className="bg-gray-200 px-2 py-1 rounded">
                        {advert.dimensions}
                      </span>
                      <span>{advert.placement}</span>
                      {advert.duration && (
                        <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded">
                          {advert.duration}
                        </span>
                      )}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        {advert.quantity_remaining} remaining
                      </span>
                      <Button
                        buttonText="Add to Cart"
                        onClick={() => addToCart(advert)}
                        disabled={advert.sold_out || !advert.is_active}
                        buttonColor="bg-purple-500"
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
                  <Megaphone size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">Your cart is empty</p>
                  <p className="text-sm text-gray-400">Add ad spaces from the left to get started</p>
                </div>
              ) : (
                <>
                  {/* Cart Items */}
                  <div className="space-y-4 mb-6 max-h-80 overflow-y-auto">
                    {cart.map((item) => (
                      <div key={item.advertId} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h6 className="font-medium">{item.advert.name}</h6>
                            <div className="text-xs text-gray-500 flex gap-2">
                              <span>{item.advert.format}</span>
                              <span>•</span>
                              <span>{item.advert.dimensions}</span>
                              <span>•</span>
                              <span>{item.advert.placement}</span>
                            </div>
                            <span className="text-sm text-gray-600">
                              {item.advert.currency} {item.advert.price} each
                            </span>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.advertId)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        
                        {/* Quantity Control */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.advertId, item.quantity - 1)}
                              className="p-1 border rounded hover:bg-gray-100"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="px-3 py-1 border rounded min-w-[50px] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.advertId, item.quantity + 1)}
                              className="p-1 border rounded hover:bg-gray-100"
                              disabled={item.quantity >= (item.advert.max_per_order || 10)}
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <span className="font-medium">
                            {item.advert.currency} {item.advert.price * item.quantity}
                          </span>
                        </div>

                        {/* Content URLs for this ad */}
                        <div className="space-y-2">
                          <input
                            type="url"
                            placeholder="Content URL (optional)"
                            value={item.content_url}
                            onChange={(e) => updateContentUrl(item.advertId, e.target.value)}
                            className="w-full text-xs p-2 border rounded"
                          />
                          <input
                            type="url"
                            placeholder="Preview Image URL (optional)"
                            value={item.preview_image_url}
                            onChange={(e) => updatePreviewUrl(item.advertId, e.target.value)}
                            className="w-full text-xs p-2 border rounded"
                          />
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
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold">Total:</span>
                        <span className="text-2xl font-bold text-purple-600">
                          {cart[0]?.advert.currency} {calculateTotal()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {cart.reduce((total, item) => total + item.quantity, 0)} ad space(s)
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
                        isLoading={buyingAdvert || buyingAdvertMobile}
                        buttonColor="bg-purple-500"
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

const AdvertsSection = ({ eventId }) => {
  const [showBookingModal, setShowBookingModal] = useState(false);

  const { data: advertsData, isLoading, error } = useGetEventAdvertsManager(eventId);

  const adverts = advertsData?.data || [];

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

  if (error || !adverts.length) {
    return null; // Don't show section if no adverts available
  }

  return (
    <>
      <section id="adverts" className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              Advertisement Spaces
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Promote your brand to our event audience. Choose from our premium advertising placements.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {adverts.map((advert) => (
              <div
                key={advert._id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow border border-gray-200"
              >
                {/* Advert Header */}
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white">
                  <div className="flex items-center gap-3 mb-2">
                    <Megaphone size={24} />
                    <h3 className="text-xl font-bold">{advert.name}</h3>
                  </div>
                  <p className="text-purple-100">{advert.category?.name}</p>
                </div>

                {/* Advert Content */}
                <div className="p-6">
                  <p className="text-gray-600 mb-4">{advert.description}</p>
                  
                  {/* Advert Details */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign size={16} className="text-green-500" />
                      <span className="font-semibold text-2xl text-green-600">
                        {advert.currency} {advert.price}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Monitor size={16} className="text-gray-400" />
                        <span className="text-gray-600">{advert.format}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Image size={16} className="text-gray-400" />
                        <span className="text-gray-600">{advert.dimensions}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Eye size={16} className="text-gray-400" />
                        <span className="text-gray-600">{advert.placement}</span>
                      </div>
                      {advert.duration && (
                        <div className="text-blue-600 font-medium">
                          Duration: {advert.duration}
                        </div>
                      )}
                    </div>
                    
                    {advert.sale_start_date && advert.sale_end_date && (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock size={16} />
                        <span>
                          Sale: {new Date(advert.sale_start_date).toLocaleDateString()} - {new Date(advert.sale_end_date).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Available:</span>
                      <span className={`font-medium ${advert.quantity_remaining <= 3 ? 'text-red-500' : 'text-green-500'}`}>
                        {advert.quantity_remaining} left
                      </span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-500 h-2 rounded-full transition-all"
                        style={{ width: `${advert.sales_progress || 0}%` }}
                      ></div>
                    </div>

                    {/* Special Tags */}
                    <div className="flex flex-wrap gap-2">
                      {advert.is_virtual && (
                        <span className="bg-purple-100 text-purple-600 text-xs px-2 py-1 rounded">
                          Virtual Space
                        </span>
                      )}
                      {advert.is_free && (
                        <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded">
                          Free
                        </span>
                      )}
                    </div>
                  </div>

                  {advert.requires_approval && (
                    <p className="text-xs text-yellow-600 mb-4 text-center">
                      * Requires approval after booking
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Central Booking Button */}
          <div className="text-center">
            <Button
              buttonText="Book Advertisement Spaces"
              onClick={() => setShowBookingModal(true)}
              buttonColor="bg-purple-500"
              textColor="text-white"
              className="px-8 py-4 text-lg"
              prefixIcon={<Megaphone size={20} />}
            />
            <p className="text-sm text-gray-600 mt-2">
              Select multiple ad placements and quantities in one booking
            </p>
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      <AdvertBookingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        adverts={adverts}
        eventId={eventId}
      />
    </>
  );
};

export default AdvertsSection;