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
// ANSWER CONTENT BLOCKS
// ======================================================

// ------------------------------------------------------
// Paragraph
// ------------------------------------------------------

export interface FAQAnswerParagraphBlock {
  type: "paragraph";
  text: LocalizedText;
}

// ------------------------------------------------------
// Image
// ------------------------------------------------------

export interface FAQAnswerImageBlock {
  type: "image";
  image_url: string;
}

// ------------------------------------------------------
// Answer Content Block
// ------------------------------------------------------

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
//
// IMPORTANT:
// Every question has its OWN SEO metadata.
//
// Example:
//
// Category A
//   ├── Question 1
//   │     ├── meta_title
//   │     ├── meta_description
//   │     ├── meta_keywords
//   │     └── answers
//   │
//   └── Question 2
//         ├── meta_title
//         ├── meta_description
//         ├── meta_keywords
//         └── answers
//
// ======================================================

export interface FAQQuestion {
  question_generated_id?: string;

  // ====================================================
  // QUESTION
  // ====================================================

  question_text: LocalizedText;

  // ====================================================
  // QUESTION SEO META DATA
  // ====================================================

  meta_title?: LocalizedText;

  meta_description?: LocalizedText;

  meta_keywords?: LocalizedText;

  // ====================================================
  // ANSWERS
  // ====================================================

  answers: FAQAnswer[];

  created_by: string;

  created_at?: string;
}

// ======================================================
// FAQ CATEGORY
// ======================================================

export interface FAQCategory {
  category_generated_id?: string;

  // ====================================================
  // LINKED TOPIC
  // ====================================================

  topic_generated_id: string;

  topic_name: LocalizedText;

  // ====================================================
  // QUESTIONS
  // ====================================================

  questions: FAQQuestion[];

  // ====================================================
  // AUDIT
  // ====================================================

  created_by: string;

  created_at?: string;
}

// ======================================================
// FAQ ROOT
// ======================================================
//
// ROOT FAQ ONLY HAS:
//
// - faq_default_question
// - categories
// - status
// - audit
//
// NO SEO METADATA HERE.
//
// ======================================================

export interface FAQ {
  faq_generated_id: string;

  // ====================================================
  // MAIN / DEFAULT QUESTION
  // ====================================================

  faq_default_question: LocalizedText;

  // ====================================================
  // CATEGORIES
  // ====================================================

  categories: FAQCategory[];

  // ====================================================
  // STATUS
  // ====================================================

  isActiveFAQ: boolean;

  // ====================================================
  // AUDIT
  // ====================================================

  faq_created_by: string;

  faq_created_at: string;

  faq_updated_at?: string;
}

// ======================================================
// CREATE FAQ
// ======================================================

export interface CreateFAQPayload {
  // ====================================================
  // ROOT QUESTION
  // ====================================================

  faq_default_question: string;

  // ====================================================
  // AUDIT
  // ====================================================

  faq_created_by: string;
}

// ======================================================
// UPDATE FAQ
// ======================================================

export interface UpdateFAQPayload {
  // ====================================================
  // ROOT QUESTION
  // ====================================================

  faq_default_question?: string;
}

// ======================================================
// CREATE FAQ QUESTION
// ======================================================
//
// Metadata is REQUIRED when creating a question.
//
// ======================================================

export interface CreateFAQQuestionPayload {
  // ====================================================
  // QUESTION
  // ====================================================

  question_text: string;

  // ====================================================
  // QUESTION SEO META DATA
  // ====================================================

  meta_title: string;

  meta_description: string;

  meta_keywords: string;

  // ====================================================
  // AUDIT
  // ====================================================

  created_by?: string;
}

// ======================================================
// UPDATE FAQ QUESTION
// ======================================================
//
// Partial update.
//
// Any combination can be updated:
//
// - question_text
// - meta_title
// - meta_description
// - meta_keywords
//
// ======================================================

export interface UpdateFAQQuestionPayload {
  question_text?: string;

  meta_title?: string;

  meta_description?: string;

  meta_keywords?: string;
}

// ======================================================
// CREATE ANSWER - PARAGRAPH
// ======================================================

export interface CreateFAQAnswerParagraphBlock {
  type: "paragraph";

  text: string;
}

// ======================================================
// CREATE ANSWER - IMAGE
// ======================================================

export interface CreateFAQAnswerImageBlock {
  type: "image";

  image_url: string;
}

// ======================================================
// CREATE ANSWER CONTENT BLOCK
// ======================================================

export type CreateFAQAnswerContentBlock =
  | CreateFAQAnswerParagraphBlock
  | CreateFAQAnswerImageBlock;

// ======================================================
// CREATE FAQ ANSWER
// ======================================================

export interface CreateFAQAnswerPayload {
  answer_description: CreateFAQAnswerContentBlock[];

  created_by?: string;
}

// ======================================================
// UPDATE FAQ ANSWER
// ======================================================

export interface UpdateFAQAnswerPayload {
  answer_description?: CreateFAQAnswerContentBlock[];

  created_by?: string;
}

// ======================================================
// FAQ SEARCH RESULT
// ======================================================
//
// IMPORTANT:
//
// Search result represents the SPECIFIC QUESTION that
// matched the search.
//
// Therefore metadata comes from that question.
//
// ======================================================

export interface FAQSearchResult {
  // ====================================================
  // ROOT FAQ
  // ====================================================

  faq_generated_id: string;

  faq_default_question: LocalizedText;

  // ====================================================
  // CATEGORY
  // ====================================================

  category_generated_id: string;

  topic_generated_id: string;

  topic_name: LocalizedText;

  // ====================================================
  // MATCHED QUESTION
  // ====================================================

  question_generated_id: string;

  question_text: LocalizedText;

  // ====================================================
  // MATCHED QUESTION METADATA
  // ====================================================

  meta_title?: LocalizedText;

  meta_description?: LocalizedText;

  meta_keywords?: LocalizedText;

  // ====================================================
  // ANSWERS
  // ====================================================

  answers: FAQAnswer[];

  // ====================================================
  // SEARCH SCORE
  // ====================================================

  faq_match_score: number;

  faq_matched_fields: string[];

  mongo_text_score?: number;
}

// ======================================================
// FAQ VALIDATION ERRORS
// ======================================================

export interface FAQValidationErrors {
  faq_default_question?: string;
}

// ======================================================
// FAQ QUESTION VALIDATION ERRORS
// ======================================================

export interface FAQQuestionValidationErrors {
  question_text?: string;

  meta_title?: string;

  meta_description?: string;

  meta_keywords?: string;
}

// ======================================================
// FAQ ANSWER VALIDATION ERRORS
// ======================================================

export interface FAQAnswerValidationErrors {
  answer_description?: string;
}

// ======================================================
// EMPTY FAQ
// ======================================================

export const EMPTY_FAQ: CreateFAQPayload = {
  faq_default_question: "",

  faq_created_by: "admin",
};
