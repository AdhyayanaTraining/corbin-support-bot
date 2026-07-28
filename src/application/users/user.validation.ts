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
  available_days?: string;
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
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email.trim())) {
    errors.email = "Please enter a valid email address.";
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
  } else if (userData.password.trim().length < 6) {
    errors.password = "Password must be at least 6 characters long.";
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

    // ======================================================
    // VALIDATE AVAILABLE DAYS (OPTIONAL)
    // ======================================================

    if (userData.available_days && userData.available_days.length > 0) {
      const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;

      userData.available_days.forEach((day, dayIndex) => {
        if (!day.time_slots || day.time_slots.length === 0) {
          errors.available_days = `Time slots are required for ${day.day}.`;
        } else {
          day.time_slots.forEach((slot, slotIndex) => {
            if (!timeRegex.test(slot.start_time)) {
              errors.available_days = `Invalid start time format for ${day.day} slot ${slotIndex + 1}. Use HH:MM format.`;
            }
            if (!timeRegex.test(slot.end_time)) {
              errors.available_days = `Invalid end time format for ${day.day} slot ${slotIndex + 1}. Use HH:MM format.`;
            }
            if (slot.start_time >= slot.end_time) {
              errors.available_days = `Start time must be before end time for ${day.day} slot ${slotIndex + 1}.`;
            }
          });
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
