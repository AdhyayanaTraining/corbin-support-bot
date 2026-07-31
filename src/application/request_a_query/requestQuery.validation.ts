import {
  CreateRequestQueryPayload,
  RespondToQueryPayload,
} from "./requestQuery.types";

// ======================================================
// REQUEST QUERY VALIDATION ERRORS
// ======================================================

export interface RequestQueryValidationErrors {
  name?: string;

  email?: string;

  phone_number?: string;

  query_title?: string;

  query_description?: string;

  category?: string; // Category validation error added
}

// ======================================================
// RESPOND TO QUERY VALIDATION ERRORS
// ======================================================

export interface RespondToQueryValidationErrors {
  subject?: string;

  message?: string;

  responded_by?: string;
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

  // ======================================================
  // Category (Optional - but validate if provided)
  // ======================================================

  if (requestQuery.category && !requestQuery.category.trim()) {
    errors.category = "Category cannot be empty if provided.";
  }

  return errors;
}

// ======================================================
// VALIDATE RESPOND TO QUERY
// ======================================================

export function validateRespondToQuery(
  respondQuery: RespondToQueryPayload,
): RespondToQueryValidationErrors {
  const errors: RespondToQueryValidationErrors = {};

  // ======================================================
  // Subject
  // ======================================================

  if (!respondQuery.subject.trim()) {
    errors.subject = "Email subject is required.";
  }

  // ======================================================
  // Message
  // ======================================================

  if (!respondQuery.message.trim()) {
    errors.message = "Email message is required.";
  }

  // ======================================================
  // Responded By
  // ======================================================

  if (!respondQuery.responded_by.trim()) {
    errors.responded_by = "Responded by is required.";
  }

  return errors;
}
