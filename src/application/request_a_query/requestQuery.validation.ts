import { CreateRequestQueryPayload } from "./requestQuery.types";

// ======================================================
// VALIDATION ERRORS
// ======================================================

export interface RequestQueryValidationErrors {
  name?: string;

  email?: string;

  phone_number?: string;

  query_title?: string;

  query_description?: string;
}

// ======================================================
// VALIDATE REQUEST QUERY
// ======================================================

export function validateRequestQuery(
  requestQuery: CreateRequestQueryPayload,
): RequestQueryValidationErrors {
  const errors: RequestQueryValidationErrors = {};

  // ======================================================
  // Name
  // ======================================================

  if (!requestQuery.name.trim()) {
    errors.name = "Name is required.";
  }

  // ======================================================
  // Email
  // ======================================================

  if (!requestQuery.email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(requestQuery.email)) {
    errors.email = "Please enter a valid email address.";
  }

  // ======================================================
  // Phone Number
  // ======================================================

  if (!requestQuery.phone_number.trim()) {
    errors.phone_number = "Phone number is required.";
  } else if (!/^[0-9]{10}$/.test(requestQuery.phone_number)) {
    errors.phone_number = "Phone number must be exactly 10 digits.";
  }

  // ======================================================
  // Query Title
  // ======================================================

  if (!requestQuery.query_title.trim()) {
    errors.query_title = "Query title is required.";
  }

  // ======================================================
  // Query Description
  // ======================================================

  if (!requestQuery.query_description.trim()) {
    errors.query_description = "Query description is required.";
  }

  return errors;
}
