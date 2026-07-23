// faq.validation.ts

import { CreateFAQPayload, CreateFAQSubTopicPayload } from "./faq.types";

// ======================================================
// FAQ VALIDATION ERRORS
// ======================================================

export interface FAQValidationErrors {
  faq_default_question?: string;
}

// ======================================================
// FAQ SUBTOPIC VALIDATION ERRORS
// ======================================================

export interface FAQSubTopicValidationErrors {
  faq_subtopic_title?: string;
}

// ======================================================
// VALIDATE FAQ
// ======================================================

export function validateFAQ(faq: CreateFAQPayload): FAQValidationErrors {
  const errors: FAQValidationErrors = {};

  // ======================================================
  // FAQ Default Question
  // ======================================================

  if (!faq.faq_default_question.trim()) {
    errors.faq_default_question = "FAQ question is required.";
  } else if (faq.faq_default_question.trim().length < 10) {
    errors.faq_default_question =
      "FAQ question must be at least 10 characters.";
  }

  return errors;
}

// ======================================================
// VALIDATE FAQ SUBTOPIC
// ======================================================

export function validateFAQSubTopic(
  subtopic: CreateFAQSubTopicPayload,
): FAQSubTopicValidationErrors {
  const errors: FAQSubTopicValidationErrors = {};

  // ======================================================
  // FAQ SubTopic Title
  // ======================================================

  if (!subtopic.faq_subtopic_title.trim()) {
    errors.faq_subtopic_title = "SubTopic title is required.";
  } else if (subtopic.faq_subtopic_title.trim().length < 3) {
    errors.faq_subtopic_title = "SubTopic title must be at least 3 characters.";
  }

  return errors;
}
