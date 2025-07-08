// Global TypeScript Definitions for Invitation App

// Common Types
export interface BaseEntity {
  _id: string;
  id?: string;
  createdAt: string;
  updatedAt?: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  status: string;
  message: string;
  data: T;
}

export interface ApiError {
  status: string;
  message: string;
  error?: any;
}

// User Types
export interface User extends BaseEntity {
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  phone?: string;
  profile_picture?: string;
  location?: {
    address?: string;
    city?: string;
    state?: string;
    country?: string;
  };
  occupation?: string;
  marital_status?: string;
  roles: string[];
  isActive: boolean;
  isSuspended: boolean;
  isDeleted: boolean;
  online: boolean;
  bornAgain?: boolean;
  activation_expires_in?: string | null;
  campus?: string;
  notification_counter?: number;
}

// Event Types (Base)
export interface Event extends BaseEntity {
  eventName: string;
  eventType: string;
  eventCategory: string;
  description: string;
  date: string;
  location: string;
  startTime: string;
  endTime: string;
  timezone?: string;
  colors: string[];
  event_days: string[];
  max_attendance?: number;
  is_public: boolean;
  requires_approval: boolean;
  allow_plus_ones: boolean;
  created_by: string;
  isPaid?: boolean;
  status?: string;
  image?: string;
  website?: string;
  contact_email?: string;
  contact_phone?: string;
  
  // Related data
  stakeholders?: any[];
  program?: any[];
  hosts?: any[];
  sponsors?: any[];
  partners?: any[];
  vendors?: any[];
  resources?: any[];
  tickets?: any[];
  invitees?: any[];
  analytics?: any;
}

// Common Component Props
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface LoadingProps {
  isLoading?: boolean;
}

export interface EventComponentProps extends LoadingProps {
  event?: Event;
  eventId?: string;
}

// Form Data Types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'date' | 'time' | 'textarea' | 'select' | 'checkbox' | 'file';
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string; }[];
  validation?: {
    pattern?: RegExp;
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
  };
}

// Analytics Types
export interface Analytics {
  totalInvites: number;
  pendingInvites: number;
  acceptedInvites: number;
  declinedInvites: number;
  attendance?: number;
  revenue?: number;
  [key: string]: any;
}

// Modal Types
export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

// Table Types
export interface TableColumn<T = any> {
  key: keyof T | string;
  header: string;
  width?: string;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
}

export interface TableProps<T = any> {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  onRowClick?: (row: T) => void;
  pagination?: {
    current: number;
    total: number;
    pageSize: number;
    onChange: (page: number) => void;
  };
}

// Button Types
export interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  prefixIcon?: React.ReactNode | string;
  suffixIcon?: React.ReactNode | string;
  buttonText?: string;
  buttonColor?: string;
  textColor?: string;
  radius?: string;
  progress?: number;
  form?: string;
  imageclass?: string;
  loader?: React.ReactNode;
}

// Input Types
export interface InputProps extends BaseComponentProps {
  label?: string;
  value?: string | number;
  defaultValue?: string | number;
  placeholder?: string;
  type?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  isTextArea?: boolean;
  rows?: number;
  step?: string | number;
}

// Navigation Types
export interface MenuSection {
  title: string;
  items: MenuItem[];
}

export interface MenuItem {
  id: number;
  name: string;
  icon: any; // Lucide icon component
  disabled?: boolean;
  badge?: string | number;
}

// File Upload Types
export interface FileUploadResult {
  url: string;
  name: string;
  size: number;
  type: string;
}

// Pagination Types
export interface PaginationInfo {
  current: number;
  total: number;
  pageSize: number;
  totalPages: number;
}

// Search and Filter Types
export interface SearchFilters {
  query?: string;
  status?: string;
  category?: string;
  dateFrom?: string;
  dateTo?: string;
  [key: string]: any;
}

// Status Types
export type StatusType = 'pending' | 'active' | 'inactive' | 'completed' | 'cancelled' | 'approved' | 'rejected';

// Theme Types
export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
}

// Utility Types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

// React Query Types
export interface QueryConfig {
  enabled?: boolean;
  refetchOnWindowFocus?: boolean;
  staleTime?: number;
  cacheTime?: number;
  retry?: number;
  retryDelay?: number;
}

// Error Handling Types
export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: any;
}

// Environment Types
export interface EnvironmentConfig {
  API_BASE_URL: string;
  ENVIRONMENT: 'development' | 'staging' | 'production';
  [key: string]: string;
}