import {
  CreateUnansweredQuestionPayload,
  UnansweredQuestionValidation,
} from "./unanswered_question_type";

// ======================================================
// VALIDATE UNANSWERED QUESTION
// ======================================================

export const validateUnansweredQuestion = (
  payload: CreateUnansweredQuestionPayload,
): UnansweredQuestionValidation => {
  const errors: UnansweredQuestionValidation = {};

  // ====================================================
  // QUESTION
  // ====================================================

  if (!payload.question || !payload.question.trim()) {
    errors.question = "Question is required.";
  }

  // ====================================================
  // TOPIC
  // ====================================================

  if (!payload.topic || !payload.topic.trim()) {
    errors.topic = "Topic is required.";
  }

  return errors;
};
