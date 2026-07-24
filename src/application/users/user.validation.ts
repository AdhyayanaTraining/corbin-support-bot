import { CreateUserPayload } from "./user.types";

// ======================================================
// VALIDATION ERRORS
// ======================================================

export interface UserValidationErrors {
  name?: string;
  email?: string;
  phone_number?: string;
  user_id?: string;
  password?: string;
  role?: string;
  expert_categories?: string;
  created_by?: string;
}

// ======================================================
// VALIDATE USER
// ======================================================

export function validateUser(
  userData: CreateUserPayload,
): UserValidationErrors {
  const errors: UserValidationErrors = {};

  // ======================================================
  // NAME
  // ======================================================

  if (!userData.name.trim()) {
    errors.name = "Name is required.";
  }

  // ======================================================
  // EMAIL
  // ======================================================

  if (!userData.email.trim()) {
    errors.email = "Email is required.";
  }

  // ======================================================
  // PHONE NUMBER
  // ======================================================

  if (!userData.phone_number.trim()) {
    errors.phone_number = "Phone number is required.";
  }

  // ======================================================
  // USER ID
  // ======================================================

  if (!userData.user_id.trim()) {
    errors.user_id = "User ID is required.";
  }

  // ======================================================
  // PASSWORD
  // ======================================================

  if (!userData.password.trim()) {
    errors.password = "Password is required.";
  }

  // ======================================================
  // ROLE
  // ======================================================

  if (!userData.role) {
    errors.role = "Role is required.";
  }

  // ======================================================
  // EXPERT CATEGORIES
  // ======================================================

  if (userData.role === "EXPERT") {
    if (
      !userData.expert_categories ||
      userData.expert_categories.length === 0
    ) {
      errors.expert_categories =
        "At least one category is required for EXPERT role.";
    } else {
      // Validate each category
      userData.expert_categories.forEach((category, index) => {
        if (!category.name.trim()) {
          errors.expert_categories = `Category name is required at position ${index + 1}.`;
        }
      });
    }
  }

  // ======================================================
  // CREATED BY
  // ======================================================

  if (!userData.created_by.trim()) {
    errors.created_by = "Created By is required.";
  }

  return errors;
}
