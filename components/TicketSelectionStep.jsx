import React, { useState } from "react";
import { Ticket, Plus, Minus, ShoppingCart, CreditCard } from "lucide-react";
import CustomButton from "./Button";

const TicketSelectionStep = ({ event, onTicketSelection, selectedTickets, isLoading }) => {
  const [quantities, setQuantities] = useState({});
  
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
    
    onTicketSelection(selectedTicketsArray);
  };

  const formatCurrency = (amount, currency = "USD") => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const getTotalAmount = () => {
    return Object.entries(quantities).reduce((total, [ticketId, quantity]) => {
      const ticket = tickets.find(t => t.id === ticketId);
      return total + (ticket ? ticket.price * quantity : 0);
    }, 0);
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
          
          <div className="border-t pt-4">
            <div className="flex justify-between items-center text-lg font-semibold">
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