import { AskQuestionPayload } from "./chatbot.types";

// ======================================================
// VALIDATION ERRORS
// ======================================================

export interface ChatValidationErrors {
  question?: string;
}

// ======================================================
// VALIDATE QUESTION
// ======================================================

export function validateQuestion(
  payload: AskQuestionPayload,
): ChatValidationErrors {
  const errors: ChatValidationErrors = {};

  if (!payload.question.trim()) {
    errors.question = "Question is required.";
  }

  return errors;
}
