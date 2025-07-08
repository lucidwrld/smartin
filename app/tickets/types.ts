// Ticket Types and Interfaces

export interface TicketCategory {
  _id: string;
  name: string;
}

export interface Ticket {
  _id: string;
  id?: string; // Frontend ID
  event: string;
  name: string;
  category: TicketCategory | string;
  price: number;
  description?: string;
  quantity: number;
  currency: string;
  sale_start_date: string;
  sale_end_date: string;
  min_per_order: number;
  max_per_order: number;
  is_active: boolean;
  requires_approval: boolean;
  is_free: boolean;
  sold_out: boolean;
  quantity_remaining?: number;
  createdAt: string;
  updatedAt: string;
  // Additional frontend fields
  sold?: number;
  status?: 'active' | 'paused' | 'ended' | 'sold_out';
  revenue?: number;
  sale_start_time?: string;
  sale_end_time?: string;
  visible_quantity?: boolean;
  benefits?: string[];
}

export interface CreateTicketPayload {
  event: string;
  name: string;
  category: string;
  price: number;
  description?: string;
  quantity: number;
  currency: string;
  sale_start_date: string;
  sale_end_date: string;
  min_per_order: number;
  max_per_order: number;
  is_active: boolean;
  requires_approval: boolean;
  is_free: boolean;
}

export interface UpdateTicketPayload extends Omit<CreateTicketPayload, 'event'> {}

export interface BuyTicketItem {
  ticketId: string;
  quantity: number;
}

export interface BuyTicketPayload {
  email: string;
  name: string;
  path?: string;
  tickets: BuyTicketItem[];
}

export interface BuyTicketResponse {
  status: string;
  data: {
    amount: number;
    currency: string;
    checkoutUrl: string;
  };
}

export interface TicketResponse {
  status: string;
  message: string;
  data: Ticket | Ticket[];
}

export interface TicketCategoryResponse {
  status: string;
  message: string;
  data: TicketCategory[];
}

// Coupon Types
export interface Coupon {
  id: string;
  code: string;
  name: string;
  description?: string;
  type: 'percentage' | 'fixed';
  value: number;
  min_purchase?: number;
  max_discount?: number;
  usage_limit?: number;
  used_count: number;
  is_active: boolean;
  valid_from: string;
  valid_until: string;
  applicable_tickets?: string[];
  created_at: string;
}