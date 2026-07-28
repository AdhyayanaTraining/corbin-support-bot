// ======================================================
// USER ROLE
// ======================================================

export type UserRole = "ADMIN" | "EXPERT";

// ======================================================
// DAY OF WEEK TYPE
// ======================================================

export type DayOfWeek =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

// ======================================================
// TIME SLOT
// ======================================================

export interface TimeSlot {
  start_time: string; // Format: "HH:MM" (24-hour format, e.g., "09:00")
  end_time: string; // Format: "HH:MM" (24-hour format, e.g., "17:00")
}

// ======================================================
// AVAILABLE DAY
// ======================================================

export interface AvailableDay {
  day: DayOfWeek;
  time_slots: TimeSlot[];
  is_available: boolean;
}

// ======================================================
// EXPERT CATEGORY
// ======================================================

export interface ExpertCategory {
  category_generated_id?: string;
  name: string;
  description?: string;
  created_at?: Date;
  updated_at?: Date;
}

// ======================================================
// USER
// ======================================================

export interface User {
  user_generated_id?: string;
  name: string;
  email: string;
  phone_number: string;
  user_id: string;
  password: string;
  role: UserRole;
  expert_categories?: ExpertCategory[];
  topics_generated?: string[];
  available_days?: AvailableDay[];
  average_rating?: number;
  total_reviews?: number;
  created_by: string;
  created_at?: Date;
  updated_at?: Date;
}

// ======================================================
// CREATE USER PAYLOAD
// ======================================================

export interface CreateUserPayload {
  name: string;
  email: string;
  phone_number: string;
  user_id: string;
  password: string;
  role: UserRole;
  expert_categories?: ExpertCategory[];
  available_days?: AvailableDay[];
  created_by: string;
}

// ======================================================
// UPDATE USER PAYLOAD
// ======================================================

export interface UpdateUserPayload {
  name: string;
  email: string;
  phone_number: string;
  user_id: string;
  password: string;
  role: UserRole;
  expert_categories?: ExpertCategory[];
  available_days?: AvailableDay[];
  created_by: string;
}

// ======================================================
// UPDATE EXPERT AVAILABILITY PAYLOAD
// ======================================================

export interface UpdateExpertAvailabilityPayload {
  available_days: AvailableDay[];
}

// ======================================================
// EMPTY USER
// ======================================================

export const EMPTY_USER: CreateUserPayload = {
  name: "",
  email: "",
  phone_number: "",
  user_id: "",
  password: "",
  role: "EXPERT",
  expert_categories: [],
  available_days: [],
  created_by: "",
};

// ======================================================
// EMPTY CATEGORY
// ======================================================

export const EMPTY_CATEGORY: ExpertCategory = {
  name: "",
  description: "",
};

// ======================================================
// EMPTY TIME SLOT
// ======================================================

export const EMPTY_TIME_SLOT: TimeSlot = {
  start_time: "09:00",
  end_time: "17:00",
};

// ======================================================
// EMPTY AVAILABLE DAY
// ======================================================

export const EMPTY_AVAILABLE_DAY: AvailableDay = {
  day: "monday",
  time_slots: [EMPTY_TIME_SLOT],
  is_available: true,
};

// ======================================================
// DAYS OF WEEK
// ======================================================

export const DAYS_OF_WEEK: DayOfWeek[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];
