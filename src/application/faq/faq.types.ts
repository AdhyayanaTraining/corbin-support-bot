// ======================================================
// FAQ TYPES
// ======================================================

// ======================================================
// LOCALIZED TEXT
// ======================================================

export interface LocalizedText {
  en: string;
  hi: string;
  ta: string;
  te: string;
  kn: string;
}

// ======================================================
// FAQ ANSWER CONTENT BLOCK
// ======================================================

export interface FAQAnswerParagraphBlock {
  type: "paragraph";
  text: LocalizedText;
}

export interface FAQAnswerImageBlock {
  type: "image";
  image_url: string;
}

export type FAQAnswerContentBlock =
  | FAQAnswerParagraphBlock
  | FAQAnswerImageBlock;

// ======================================================
// FAQ ANSWER
// ======================================================

export interface FAQAnswer {
  answer_generated_id?: string;

  answer_description: FAQAnswerContentBlock[];

  created_by: string;

  created_at?: string;
}

// ======================================================
// FAQ QUESTION
// ======================================================

export interface FAQQuestion {
  question_generated_id?: string;

  question_text: LocalizedText;

  answers: FAQAnswer[];

  created_by: string;

  created_at?: string;
}

// ======================================================
// FAQ CATEGORY
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
// CREATE FAQ PAYLOAD
// ======================================================

export interface CreateFAQPayload {
  faq_default_question: string;

  faq_created_by: string;
}

// ======================================================
// UPDATE FAQ PAYLOAD
// ======================================================

export interface UpdateFAQPayload {
  faq_default_question: string;
}

// ======================================================
// CREATE QUESTION PAYLOAD
// ======================================================

export interface CreateFAQQuestionPayload {
  question_text: string;

  created_by?: string;
}

// ======================================================
// UPDATE QUESTION PAYLOAD
// ======================================================

export interface UpdateFAQQuestionPayload {
  question_text: string;
}

// ======================================================
// CREATE ANSWER CONTENT BLOCKS
// ======================================================

// Frontend sends plain English text.
// Backend handles translation.

export interface CreateFAQAnswerParagraphBlock {
  type: "paragraph";
  text: string;
  content?: LocalizedText;
}

export interface CreateFAQAnswerImageBlock {
  type: "image";
  image_url: string;
}

export type CreateFAQAnswerContentBlock =
  | CreateFAQAnswerParagraphBlock
  | CreateFAQAnswerImageBlock;

// ======================================================
// CREATE ANSWER PAYLOAD
// ======================================================

export interface CreateFAQAnswerPayload {
  answer_description: CreateFAQAnswerContentBlock[];

  created_by?: string;
}

// ======================================================
// UPDATE ANSWER PAYLOAD
// ======================================================

export interface UpdateFAQAnswerPayload {
  answer_description?: CreateFAQAnswerContentBlock[];

  created_by?: string;
}

// ======================================================
// EMPTY FAQ
// ======================================================

export const EMPTY_FAQ: CreateFAQPayload = {
  faq_default_question: "",

  faq_created_by: "admin",
};
