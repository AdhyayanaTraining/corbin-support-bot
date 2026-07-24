// ======================================================
// USER ROLE
// ======================================================

export type UserRole = "ADMIN" | "EXPERT";

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
  created_by: string;
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
  created_by: "",
};

// ======================================================
// EMPTY CATEGORY
// ======================================================

export const EMPTY_CATEGORY: ExpertCategory = {
  name: "",
  description: "",
};
