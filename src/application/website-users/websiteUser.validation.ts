import { CreateWebsiteUserPayload } from "./websiteUser.types";

// ======================================================
// VALIDATION ERRORS
// ======================================================

export interface WebsiteUserValidationErrors {
  name?: string;
  email?: string;
  phone_number?: string;
}

// ======================================================
// VALIDATE WEBSITE USER
// ======================================================

export function validateWebsiteUser(
  websiteUser: CreateWebsiteUserPayload,
): WebsiteUserValidationErrors {
  const errors: WebsiteUserValidationErrors = {};

  // ======================================================
  // Name
  // ======================================================

  if (!websiteUser.name.trim()) {
    errors.name = "Name is required.";
  } else if (websiteUser.name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters long.";
  } else if (websiteUser.name.trim().length > 50) {
    errors.name = "Name must be less than 50 characters.";
  }

  // ======================================================
  // Email
  // ======================================================

  if (!websiteUser.email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(websiteUser.email.trim())) {
    errors.email = "Please enter a valid email address.";
  }

  // ======================================================
  // Phone Number
  // ======================================================

  if (!websiteUser.phone_number.trim()) {
    errors.phone_number = "Phone number is required.";
  } else if (!/^[0-9]{10}$/.test(websiteUser.phone_number.trim())) {
    errors.phone_number = "Phone number must be exactly 10 digits.";
  }

  return errors;
}
