import { CreateConversationPayload, SendMessagePayload } from "./chat.types";

// ======================================================
// VALIDATION ERRORS
// ======================================================

export interface ChatValidationErrors {
  visitor_name?: string;

  visitor_email?: string;

  visitor_phone_number?: string;

  category_generated_id?: string;

  message?: string;
}

// ======================================================
// EMAIL VALIDATION
// ======================================================

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ======================================================
// VALIDATE CREATE CONVERSATION
// ======================================================

export function validateConversation(
  conversation: CreateConversationPayload,
): ChatValidationErrors {
  const errors: ChatValidationErrors = {};

  // ======================================================
  // Visitor Name
  // ======================================================

  if (!conversation.visitor_name.trim()) {
    errors.visitor_name = "Visitor name is required.";
  } else if (conversation.visitor_name.trim().length < 3) {
    errors.visitor_name = "Visitor name must be at least 3 characters.";
  }

  // ======================================================
  // Visitor Email
  // ======================================================

  if (!conversation.visitor_email.trim()) {
    errors.visitor_email = "Visitor email is required.";
  } else if (!EMAIL_REGEX.test(conversation.visitor_email.trim())) {
    errors.visitor_email = "Please enter a valid email address.";
  }

  // ======================================================
  // Category
  // ======================================================

  if (!conversation.category_generated_id.trim()) {
    errors.category_generated_id = "Please select a category.";
  }

  return errors;
}

// ======================================================
// VALIDATE SEND MESSAGE
// ======================================================

export function validateMessage(
  message: SendMessagePayload,
): ChatValidationErrors {
  const errors: ChatValidationErrors = {};

  // ======================================================
  // Conversation
  // ======================================================

  if (!message.conversation_generated_id.trim()) {
    throw new Error("Conversation ID is required.");
  }

  // ======================================================
  // Message
  // ======================================================

  if (!message.message.trim()) {
    errors.message = "Message cannot be empty.";
  } else if (message.message.trim().length > 5000) {
    errors.message = "Message cannot exceed 5000 characters.";
  }

  return errors;
}
