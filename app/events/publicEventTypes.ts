export interface PublicEventModel {
  status?: string;
  message?: string;
  data?: Data;
}

export interface Data {
  donation?: Donation;
  event_notification?: Notification;
  reminder_notification?: Notification;
  thankyou_notification?: Notification;
  payment_type?: string;
  paid_amount?: number;
  no_of_invitees?: number;
  gallery?: string[];
  isActive?: boolean;
  verification_type?: string;
  status?: string;
  type?: string;
  isVirtual?: boolean;
  showFeedback?: boolean;
  video?: string;
  logo?: string;
  colors?: string[];
  _id?: string;
  name?: string;
  description?: string;
  host?: string;
  image?: string;
  event_type?: string;
  venue?: string;
  date?: Date;
  time?: string;
  items?: Item[];
  timezone?: string;
  currency?: string;
  createdAt?: Date;
  updatedAt?: Date;
  __v?: number;
  event_days?: EventDay[];
  vendors?: Vendor[];
  partners?: Partner[];
  hosts?: Host[];
  sponsors?: Partner[];
  speakers?: any[];
  program?: Program[];
  resources?: Resource[];
  stakeholders?: Stakeholder[];
  id?: string;
}

export interface Donation {
  account_name?: string;
  bank_name?: string;
  account_number?: string;
}

export interface EventDay {
  _id?: string;
  date?: Date;
  time?: string;
}

export interface Notification {
  email?: boolean;
  sms?: boolean;
  whatsapp?: boolean;
  voice?: boolean;
}

export interface Host {
  profile_image?: string;
  _id?: string;
  name?: string;
  title?: string;
  organization?: string;
  email?: string;
  phone?: string;
  description?: string;
  areas_of_expertise?: string;
  website?: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  event?: string;
  __v?: number;
  createdAt?: Date;
  updatedAt?: Date;
  id?: string;
}

export interface Item {
  _id?: string;
  name?: string;
  link?: string;
  price?: number | string;
}

export interface Partner {
  logo?: string;
  _id?: string;
  name?: string;
  descritpion?: string;
  website?: string;
  contact_person?: string;
  contact_email?: string;
  partnership_type?: string;
  details?: string;
  event?: string;
  __v?: number;
  createdAt?: Date;
  updatedAt?: Date;
  id?: string;
  description?: string;
  sponsorship_tier?: string;
  contribution_benefits?: string;
}

export interface Program {
  is_public?: boolean;
  _id?: string;
  description?: string;
  date?: Date;
  start_time?: string;
  end_time?: string;
  location?: string;
  speaker?: string;
  speaker_title?: string;
  event?: string;
  __v?: number;
  createdAt?: Date;
  updatedAt?: Date;
  id?: string;
}

export interface Resource {
  is_public?: boolean;
  _id?: string;
  name?: string;
  type?: string;
  url?: string;
  description?: string;
  category?: string;
  tags?: string;
  event?: string;
  __v?: number;
  createdAt?: Date;
  updatedAt?: Date;
  id?: string;
}

export interface Stakeholder {
  _id?: string;
  name?: string;
  title?: string;
  organization?: string;
  role?: string;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  status?: string;
  priority?: string;
  involvement_level?: number;
  availability?: string;
  responsibilities?: string;
  expertise?: string;
  notes?: string;
  event?: string;
  __v?: number;
  createdAt?: Date;
  updatedAt?: Date;
  id?: string;
}

export interface Vendor {
  _id?: string;
  name?: string;
  company?: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  job_description?: string;
  status?: string;
  payment_status?: string;
  contract_amount?: number;
  contract_date?: Date;
  services_provided?: string;
  notes?: string;
  event?: string;
  __v?: number;
  createdAt?: Date;
  updatedAt?: Date;
  id?: string;
}
