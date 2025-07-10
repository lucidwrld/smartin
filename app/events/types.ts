// Events Module Types
export interface User {
  _id: string;
  id: string;
  fullname: string;
  email: string;
  phone: string;
  currency: string;
  device_token: string[];
  roles: string[];
  is_active: boolean;
  isSuspended: boolean;
  isPartner: boolean;
  createdAt: string;
  updatedAt: string;
  notification_counter: number;
  referral_code: string;
  __v: number;
}

export interface DonationInfo {
  account_name: string;
  bank_name: string;
  account_number: string;
}

export interface ThankYouMessage {
  image: string;
  message: string;
}

export interface EventNotification {
  email: boolean;
  sms: boolean;
  whatsapp: boolean;
}

export interface EventDay {
  date: string;
  time: string;
}

export interface GiftItem {
  name: string;
  link: string;
}

export interface Speaker {
  name: string;
  designation: string;
}

export interface Resource {
  _id: string;
  id: string;
  name: string;
  type: string;
  url: string;
  description: string;
  category: string;
  tags: string;
  is_public: boolean;
  event: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Session {
  name: string;
  description: string;
  date: string;
  start_time: string;
  end_time: string;
  location: string;
  speaker: string;
  is_public: boolean;
}

export interface ProgramItem {
  _id: string;
  id: string;
  description: string;
  date: string;
  start_time: string;
  end_time: string;
  location: string;
  speaker: string;
  speaker_title: string;
  is_public: boolean;
  event: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  // Frontend-only fields
  title?: string;
  type?: string;
  objectives?: string[];
  materials?: Array<{name: string; url: string}>;
}

export interface RegistrationForm {
  name: string;
  type: string;
  required: boolean;
  options?: string[];
}

export interface Ticket {
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
}

export interface Vendor {
  _id?: string;
  id?: string;
  name: string;
  company: string;
  contact_person: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  job_description: string; // This is service_type in frontend
  status: string;
  payment_status: string;
  contract_amount: number;
  contract_date: string;
  services_provided: string; // Comma-separated string
  notes: string;
  event?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
  // Frontend-only fields
  rating?: number;
}

export interface Host {
  name: string;
  title: string;
  organization: string;
  email: string;
  phone: string;
  profile_image: string;
  description: string;
  areas_of_expertise: string;
  website: string;
  linkedin: string;
  twitter: string;
  instagram: string;
}

export interface Sponsor {
  name: string;
  logo: string;
  website: string;
  description: string;
  sponsorship_tier: string;
  contact_person: string;
  contact_email: string;
  contribution_benefits: string;
}

export interface Partner {
  name: string;
  description: string;
  logo: string;
  website: string;
  contact_person: string;
  contact_email: string;
  partnership_type: string;
  details: string;
}

export interface Stakeholder {
  name: string;
  title: string;
  organization: string;
  role: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  status: string;
  priority: string;
  involvement_level: number;
  availability: string;
  responsibilities: string;
  expertise: string;
  notes: string;
}

// Main Event Interface
export interface Event {
  _id: string;
  id: string;
  name: string;
  description: string;
  host: string;
  image: string;
  event_type: string;
  payment_type: string;
  venue: string;
  date: string;
  time: string;
  timezone: string;
  no_of_invitees: number;
  items: GiftItem[];
  verification_type: string;
  status: string;
  type: string;
  currency: string;

  // Financial & Status
  donation: DonationInfo;
  isSuspended: boolean;
  isPaid: boolean;
  isPending: boolean;
  paid_amount: number;

  // Media & Content
  gallery: string[];
  video: string;
  logo: string;
  colors: string[]; // [primary, secondary]

  // Features
  isActive: boolean;
  isVirtual: boolean;
  showFeedback: boolean;
  thank_you_message: ThankYouMessage;
  event_notification: EventNotification;

  // Multi-day support
  event_days: EventDay[];

  // Event components
  vendors: Vendor[];
  hosts: Host[];
  sponsors: Sponsor[];
  speakers: Speaker[];
  program: ProgramItem[];
  resources: Resource[];
  stakeholders: Stakeholder[];

  // User & Metadata
  user: User;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Event Creation Payload (Frontend to Backend)
export interface CreateEventPayload {
  // Basic Details
  name: string;
  description: string;
  host: string;
  image: string | null;
  event_type: string;
  payment_type: string;
  venue: string;
  timezone: string;
  no_of_invitees: number;
  currency: string;

  // Multi-day support
  event_days: EventDay[];

  // Media
  gallery: string[];
  video: string;
  logo: string;
  colors: string[]; // [primary, secondary]

  // Features
  isVirtual: boolean;
  showFeedback: boolean;
  verification_type: string;

  // Financial
  donation: DonationInfo;
  payment_mode: string; // "subscription" | "pay_per_event"

  // Content
  items: GiftItem[];
  thank_you_message: ThankYouMessage;

  // Notifications & Reminders
  event_notification: EventNotification;
  enable_auto_reminder: boolean;
  enable_auto_thank_you: boolean;

  // Optional Enhanced Features (for future updates)
  sessions?: Session[];
  registration_forms?: RegistrationForm[];
  tickets?: Ticket[];
  vendors?: Vendor[];
  hosts?: Host[];
  sponsors?: Sponsor[];
  partners?: Partner[];
  stakeholders?: Stakeholder[];
  resources?: Resource[];
  speakers?: Speaker[];
}

// Frontend Form Data Interface
export interface EventFormData {
  // Basic Details
  name: string;
  description: string;
  host: string;
  image: File | string | null;
  event_type: string;
  payment_type: string;
  venue: string;
  date: string;
  time: string;
  end_date: string;
  end_time: string;
  timezone: string;
  no_of_invitees: string;
  currency: string;

  // Multi-day
  is_multi_day: boolean;

  // Media
  gallery: (File | string)[];
  video_url: string;
  logo: File | string | null;
  banner_image: File | string | null;

  // Theming
  primary_color: string;
  secondary_color: string;

  // Features
  isVirtual: boolean;
  showFeedback: boolean;
  verification_type: string;

  // Financial
  donation: DonationInfo;
  payment_mode: string;
  pay_later: boolean;

  // Content
  items: GiftItem[];
  thank_you_message: ThankYouMessage;

  // Notifications
  invitation_methods: string[]; // ["email", "sms", "whatsapp", "voice"]
  enable_auto_reminder: boolean;
  enable_auto_thank_you: boolean;

  // Path for navigation
  path: string;

  // Enhanced Features (simplified creation)
  sessions: Session[];
  registration_forms: RegistrationForm[];
  tickets: Ticket[];
  vendors: Vendor[];
  hosts: Host[];
  sponsors: Sponsor[];
  partners: Partner[];
  stakeholders: Stakeholder[];
  resources: Resource[];
  speakers: Speaker[];
}

// API Response Types
export interface EventsResponse {
  status: string;
  pagination: {
    prevPage: number | null;
    currentPage: number;
    nextPage: number | null;
    pageTotal: number;
    pageSize: number;
    total: number;
  };
  data: Event[];
}

export interface SingleEventResponse {
  status: string;
  data: Event;
}

export interface CreateEventResponse {
  status: string;
  data: Event & {
    checkoutUrl?: string;
  };
}

// Helper Types
export type EventStatus = "upcoming" | "ongoing" | "past";
export type EventType = "private" | "public";
export type PaymentType = "online" | "bank" | "later";
export type PaymentMode = "subscription" | "pay_per_event";
export type VerificationType = "accessCode" | "facial" | "qr";
export type InvitationMethod = "email" | "sms" | "whatsapp" | "voice";
