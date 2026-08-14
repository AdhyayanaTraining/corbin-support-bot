// ======================================================
// WEBSITE USER SESSION
// ======================================================

export interface WebsiteUserSession {
  session_generated_id: string;
  name: string;
  email: string;
  phone_number: string;
  registerd_employee_generated_id: string;
  logged_in_at: Date;
}

// ======================================================
// WEBSITE USER
// ======================================================

export interface WebsiteUser {
  registerd_employee_generated_id?: string;
  name: string;
  email: string;
  phone_number: string;
  registered_at?: Date;
  created_at?: Date;
  updated_at?: Date;
  sessions?: WebsiteUserSession[];
  total_sessions?: number;
}

// ======================================================
// CREATE WEBSITE USER PAYLOAD
// ======================================================

export interface CreateWebsiteUserPayload {
  name: string;
  email: string;
  phone_number: string;
}

// ======================================================
// API RESPONSE
// ======================================================

export interface WebsiteUserApiResponse {
  success: boolean;
  message?: string;
  data?: WebsiteUser;
  isExistingUser?: boolean;
  registerd_employee_generated_id?: string;
  total_sessions?: number;
}

export interface WebsiteUsersApiResponse {
  success: boolean;
  message?: string;
  data?: WebsiteUser[];
}

// ======================================================
// EMPTY WEBSITE USER
// ======================================================

export const EMPTY_WEBSITE_USER: CreateWebsiteUserPayload = {
  name: "",
  email: "",
  phone_number: "",
};
