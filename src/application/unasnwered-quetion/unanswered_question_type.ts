// ======================================================
// UNANSWERED QUESTION
// ======================================================

export interface UnansweredQuestion {
  _id?: string;

  question: string;

  topic: string;

  asked_at?: Date | string;

  createdAt?: Date | string;

  updatedAt?: Date | string;
}

// ======================================================
// CREATE PAYLOAD
// ======================================================

export interface CreateUnansweredQuestionPayload {
  question: string;

  topic: string;
}

// ======================================================
// VALIDATION
// ======================================================

export interface UnansweredQuestionValidation {
  question?: string;

  topic?: string;
}

// ======================================================
// API RESPONSE
// ======================================================

export interface UnansweredQuestionResponse {
  success: boolean;

  data?: UnansweredQuestion;

  message?: string;

  code?: number;

  title?: string;
}

// ======================================================
// EMPTY STATE
// ======================================================

export const EMPTY_UNANSWERED_QUESTION: UnansweredQuestion = {
  question: "",
  topic: "",
  asked_at: undefined,
};
