export interface Session {
  _id: string;
  event: string;
  name: string;
  description: string;
  date: string;
  start_time: string;
  end_time: string;
  location: string;
  max_capacity: number;
  is_attendance_required: boolean;
  is_public: boolean;
  session_type: SessionType;
  speakers: string[];
  requirements: string[];
  status: SessionStatus;
  registered_count: number;
  attended_count: number;
  createdAt: string;
  updatedAt: string;
  id: string;
}

export interface CreateSessionPayload {
  event: string;
  name: string;
  description: string;
  date: string;
  start_time: string;
  end_time: string;
  location: string;
  max_capacity: number;
  is_attendance_required: boolean;
  is_public: boolean;
  session_type: SessionType;
  speakers: string[];
  requirements: string[];
}

export interface UpdateSessionPayload extends Partial<CreateSessionPayload> {
  _id: string;
}

export interface SessionRegistration {
  _id: string;
  session: string;
  invitee_code: string;
  email: string;
  name: string;
  registered_at: string;
  createdAt: string;
  updatedAt: string;
  id: string;
}

export interface SessionAttendance {
  _id: string;
  session: string;
  invitee_code: string;
  email: string;
  name: string;
  marking_method: AttendanceMarkingMethod;
  marked_at: string;
  createdAt: string;
  updatedAt: string;
  id: string;
}

export interface SessionRegistrationPayload {
  invitee_code: string;
}

export interface SessionAttendancePayload {
  invitee_code: string;
  marking_method: AttendanceMarkingMethod;
}

export type SessionType = 
  | 'main_event'
  | 'workshop'
  | 'networking'
  | 'break'
  | 'ceremony'
  | 'presentation'
  | 'other';

export type SessionStatus = 
  | 'upcoming'
  | 'ongoing'
  | 'completed'
  | 'cancelled';

export type AttendanceMarkingMethod = 
  | 'manual'
  | 'qr_code'
  | 'facial_recognition'
  | 'auto';

export interface SessionResponse {
  status: string;
  message: string;
  data: Session;
}

export interface SessionsResponse {
  status: string;
  message: string;
  data: Session[];
}

export interface SessionRegistrationsResponse {
  status: string;
  message: string;
  data: SessionRegistration[];
  pagination?: {
    prevPage: number | null;
    currentPage: number;
    nextPage: number | null;
    pageTotal: number;
    pageSize: number;
    total: number;
  };
}

export interface SessionAttendanceResponse {
  status: string;
  message: string;
  data: SessionAttendance[];
  pagination?: {
    prevPage: number | null;
    currentPage: number;
    nextPage: number | null;
    pageTotal: number;
    pageSize: number;
    total: number;
  };
}

export interface BaseResponse {
  status: string;
  message: string;
  data: any;
}