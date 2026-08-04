// ======================================================
// FAQ Types
// ======================================================

// ======================================================
// Localized Text
// ======================================================

export interface LocalizedText {
  en: string;
  hi: string;
  ta: string;
  te: string;
  kn: string;
}

// ======================================================
// FAQ Answer
// ======================================================

export interface FAQAnswer {
  answer_generated_id?: string;
  answer_text: LocalizedText;
  created_by: string;
  created_at?: string;
}

// ======================================================
// FAQ Question
// ======================================================

export interface FAQQuestion {
  question_generated_id?: string;
  question_text: LocalizedText;
  answers: FAQAnswer[];
  created_by: string;
  created_at?: string;
}

// ======================================================
// FAQ Category
// ======================================================

export interface FAQCategory {
  category_generated_id?: string;
  topic_generated_id: string;
  topic_name: LocalizedText;
  questions: FAQQuestion[];
  created_by: string;
  created_at?: string;
}

// ======================================================
// FAQ
// ======================================================

export interface FAQ {
  faq_generated_id: string;
  faq_default_question: LocalizedText;
  categories: FAQCategory[];
  isActiveFAQ: boolean;
  faq_created_by: string;
  faq_created_at: string;
  faq_updated_at?: string;
}

// ======================================================
// Create FAQ Payload
// ======================================================

export interface CreateFAQPayload {
  faq_default_question: string;
  faq_created_by: string;
}

// ======================================================
// Update FAQ Payload
// ======================================================

export interface UpdateFAQPayload {
  faq_default_question: string;
}

// ======================================================
// Create Question Payload
// ======================================================

export interface CreateFAQQuestionPayload {
  question_text: string;
  created_by?: string;
}

// ======================================================
// Update Question Payload
// ======================================================

export interface UpdateFAQQuestionPayload {
  question_text: string;
}

// ======================================================
// Create Answer Payload
// ======================================================

export interface CreateFAQAnswerPayload {
  answer_text: string;
  created_by?: string;
}

// ======================================================
// Update Answer Payload
// ======================================================

export interface UpdateFAQAnswerPayload {
  answer_text: string;
}

// ======================================================
// Empty FAQ
// ======================================================

export const EMPTY_FAQ: CreateFAQPayload = {
  faq_default_question: "",
  faq_created_by: "admin",
};
