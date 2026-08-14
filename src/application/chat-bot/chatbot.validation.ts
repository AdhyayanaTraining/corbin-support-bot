import { AskQuestionPayload } from "./chatbot.types";

export interface ChatValidationErrors {
  question?: string;
}

export function validateQuestion(
  payload: AskQuestionPayload,
): ChatValidationErrors {
  const errors: ChatValidationErrors = {};

  if (!payload.question.trim()) {
    errors.question = "Question is required.";
  }

  return errors;
}