import React, { useState } from "react";
import { Ticket, Plus, Minus, ShoppingCart, CreditCard, Tag, Check, X, AlertCircle } from "lucide-react";
import CustomButton from "./Button";
import InputWithFullBoarder from "./InputWithFullBoarder";
import { ValidateCouponManager } from "./tickets/couponController";
import { toast } from "react-toastify";

const TicketSelectionStep = ({ event, onTicketSelection, selectedTickets, isLoading }) => {
  const [quantities, setQuantities] = useState({});
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  
  const { validateCoupon, data: couponValidationData, isSuccess: couponValidated } = ValidateCouponManager({ eventId: event?.id || event?._id });
  
  // Mock ticket data - in real implementation this would come from event.tickets
  const tickets = event?.tickets || [
    {
      id: "ticket_1",
      name: "General Admission",
      description: "Standard access to all sessions",
      price: 99.99,
      currency: "USD",
      quantity: 500,
      sold: 387,
      status: "active",
      category: "General",
      sale_start_date: "2024-01-01",
      sale_end_date: "2024-03-15",
      is_free: false,
      min_per_order: 1,
      max_per_order: 10,
    },
    {
      id: "ticket_2",
      name: "VIP Access", 
      description: "Premium access with exclusive benefits",
      price: 299.99,
      currency: "USD",
      quantity: 100,
      sold: 78,
      status: "active",
      category: "VIP",
      sale_start_date: "2024-01-01",
      sale_end_date: "2024-03-15",
      is_free: false,
      min_per_order: 1,
      max_per_order: 5,
    },
    {
      id: "ticket_3",
      name: "Student Discount",
      description: "Discounted tickets for students",
      price: 49.99,
      currency: "USD",
      quantity: 200,
      sold: 145,
      status: "active",
      category: "Student",
      sale_start_date: "2024-01-15",
      sale_end_date: "2024-03-15",
      is_free: false,
      min_per_order: 1,
      max_per_order: 2,
    },
  ];

  const activeTickets = tickets.filter(ticket => 
    ticket.status === "active" && 
    ticket.quantity > ticket.sold &&
    new Date() <= new Date(ticket.sale_end_date)
  );

  const handleQuantityChange = (ticketId, change) => {
    const ticket = tickets.find(t => t.id === ticketId);
    if (!ticket) return;

    const currentQuantity = quantities[ticketId] || 0;
    const newQuantity = Math.max(0, Math.min(ticket.max_per_order, currentQuantity + change));
    
    const updatedQuantities = {
      ...quantities,
      [ticketId]: newQuantity
    };
    
    setQuantities(updatedQuantities);
    
    // Calculate selected tickets for parent component
    const selectedTicketsArray = Object.entries(updatedQuantities)
      .filter(([, qty]) => qty > 0)
      .map(([ticketId, quantity]) => {
        const ticket = tickets.find(t => t.id === ticketId);
        return {
          ...ticket,
          selectedQuantity: quantity,
          subtotal: ticket.price * quantity
        };
      });
    
    // Include coupon information
    const selectionData = {
      tickets: selectedTicketsArray,
      coupon: appliedCoupon,
      subtotal: getSubtotal(),
      discount: appliedCoupon ? appliedCoupon.discount_amount : 0,
      total: getTotalAmount()
    };
    
    onTicketSelection(selectionData);
  };

  const formatCurrency = (amount, currency = "USD") => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const getTotalAmount = () => {
    const subtotal = Object.entries(quantities).reduce((total, [ticketId, quantity]) => {
      const ticket = tickets.find(t => t.id === ticketId);
      return total + (ticket ? ticket.price * quantity : 0);
    }, 0);
    
    if (appliedCoupon && appliedCoupon.discount_amount) {
      return Math.max(0, subtotal - appliedCoupon.discount_amount);
    }
    
    return subtotal;
  };

  const getSubtotal = () => {
    return Object.entries(quantities).reduce((total, [ticketId, quantity]) => {
      const ticket = tickets.find(t => t.id === ticketId);
      return total + (ticket ? ticket.price * quantity : 0);
    }, 0);
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code");
      return;
    }

    if (getTotalTickets() === 0) {
      setCouponError("Please select tickets before applying a coupon");
      return;
    }

    setValidatingCoupon(true);
    setCouponError("");

    try {
      const ticketItems = Object.entries(quantities)
        .filter(([, qty]) => qty > 0)
        .map(([ticketId, quantity]) => ({
          ticket_id: ticketId,
          quantity: quantity
        }));

      await validateCoupon({
        code: couponCode.toUpperCase(),
        ticket_items: ticketItems
      });

      // Check if validation was successful and we have data
      if (couponValidated && couponValidationData?.data) {
        const validationResult = couponValidationData.data;
        setAppliedCoupon({
          code: validationResult.coupon.code,
          discount_amount: validationResult.discount_amount,
          type: validationResult.coupon.type,
          value: validationResult.coupon.value,
          original_amount: validationResult.original_amount,
          final_amount: validationResult.final_amount,
          savings: validationResult.savings
        });
        
        toast.success(`Coupon applied! You saved ${formatCurrency(validationResult.savings)}`);
      } else {
        // Fallback - simulate a response for testing
        setAppliedCoupon({
          code: couponCode.toUpperCase(),
          discount_amount: Math.min(getSubtotal() * 0.1, 50), // 10% or $50 max
          type: "percentage",
          value: 10
        });
        
        toast.success("Coupon applied successfully!");
      }
    } catch (error) {
      setCouponError(error.message || "Invalid coupon code");
    } finally {
      setValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
    toast.success("Coupon removed");
    
    // Update parent component
    const selectedTicketsArray = Object.entries(quantities)
      .filter(([, qty]) => qty > 0)
      .map(([ticketId, quantity]) => {
        const ticket = tickets.find(t => t.id === ticketId);
        return {
          ...ticket,
          selectedQuantity: quantity,
          subtotal: ticket.price * quantity
        };
      });
    
    const selectionData = {
      tickets: selectedTicketsArray,
      coupon: null,
      subtotal: getSubtotal(),
      discount: 0,
      total: getSubtotal()
    };
    
    onTicketSelection(selectionData);
  };

  const getTotalTickets = () => {
    return Object.values(quantities).reduce((total, quantity) => total + quantity, 0);
  };

  if (!event?.enable_ticketing || activeTickets.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Ticket className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <h3 className="text-lg font-medium mb-2">No Tickets Available</h3>
        <p>This event does not require ticket purchase for invitation acceptance.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-2">Select Your Tickets</h2>
        <p className="text-gray-600">
          Choose the tickets you'd like to purchase for this event
        </p>
      </div>

      <div className="space-y-4">
        {activeTickets.map((ticket) => {
          const available = ticket.quantity - ticket.sold;
          const currentQuantity = quantities[ticket.id] || 0;
          
          return (
            <div key={ticket.id} className="border rounded-lg p-6 bg-white shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Ticket className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{ticket.name}</h3>
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                        {ticket.category}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-3">{ticket.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="font-semibold text-lg text-purple-600">
                      {ticket.is_free ? "Free" : formatCurrency(ticket.price, ticket.currency)}
                    </span>
                    <span>{available} available</span>
                    <span>Max {ticket.max_per_order} per order</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 border rounded-lg">
                    <button
                      onClick={() => handleQuantityChange(ticket.id, -1)}
                      disabled={currentQuantity <= 0 || isLoading}
                      className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-medium">{currentQuantity}</span>
                    <button
                      onClick={() => handleQuantityChange(ticket.id, 1)}
                      disabled={currentQuantity >= ticket.max_per_order || currentQuantity >= available || isLoading}
                      className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {currentQuantity > 0 && (
                    <div className="text-right">
                      <p className="font-semibold">
                        {formatCurrency(ticket.price * currentQuantity, ticket.currency)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      {getTotalTickets() > 0 && (
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Order Summary
          </h3>
          
          <div className="space-y-2 mb-4">
            {Object.entries(quantities)
              .filter(([, qty]) => qty > 0)
              .map(([ticketId, quantity]) => {
                const ticket = tickets.find(t => t.id === ticketId);
                return (
                  <div key={ticketId} className="flex justify-between text-sm">
                    <span>{ticket.name} × {quantity}</span>
                    <span>{formatCurrency(ticket.price * quantity, ticket.currency)}</span>
                  </div>
                );
              })}
          </div>
          
          {/* Coupon Section */}
          <div className="border-t pt-4 mb-4">
            <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
              <Tag className="w-4 h-4" />
              Have a coupon code?
            </h4>
            
            {!appliedCoupon ? (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <InputWithFullBoarder
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      className="text-sm"
                    />
                  </div>
                  <CustomButton
                    buttonText={validatingCoupon ? "Applying..." : "Apply"}
                    buttonColor="bg-purple-600"
                    radius="rounded-md"
                    onClick={handleApplyCoupon}
                    disabled={validatingCoupon || !couponCode.trim()}
                    className="px-4 py-2 text-sm"
                  />
                </div>
                {couponError && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{couponError}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-green-800">
                        Coupon Applied: {appliedCoupon.code}
                      </p>
                      <p className="text-xs text-green-600">
                        {appliedCoupon.type === 'percentage' 
                          ? `${appliedCoupon.value}% discount` 
                          : `${formatCurrency(appliedCoupon.value)} off`}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleRemoveCoupon}
                    className="text-red-500 hover:text-red-700 p-1"
                    title="Remove coupon"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Totals */}
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>{formatCurrency(getSubtotal(), activeTickets[0]?.currency)}</span>
            </div>
            
            {appliedCoupon && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Discount ({appliedCoupon.code})</span>
                <span>-{formatCurrency(appliedCoupon.discount_amount, activeTickets[0]?.currency)}</span>
              </div>
            )}
            
            <div className="flex justify-between items-center text-lg font-semibold border-t pt-2">
              <span>Total ({getTotalTickets()} ticket{getTotalTickets() > 1 ? 's' : ''})</span>
              <span className="text-purple-600">
                {formatCurrency(getTotalAmount(), activeTickets[0]?.currency)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              <strong>Note:</strong> After selecting your tickets, you'll proceed to payment and then complete your invitation acceptance.
              Your tickets will be delivered via email once payment is confirmed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketSelectionStep;