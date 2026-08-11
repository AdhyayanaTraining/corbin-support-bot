import {
  CreateFAQAnswerPayload,
  CreateFAQPayload,
  CreateFAQQuestionPayload,
  CreateFAQAnswerContentBlock,
} from "./faq.types";

// ======================================================
// FAQ VALIDATION ERRORS
// ======================================================

export interface FAQValidationErrors {
  faq_default_question?: string;
}

// ======================================================
// FAQ ANSWER VALIDATION ERRORS
// ======================================================

export interface FAQAnswerValidationErrors {
  answer_description?: string;
}

// ======================================================
// FAQ QUESTION VALIDATION ERRORS
// ======================================================

export interface FAQQuestionValidationErrors {
  question_text?: string;
}

// ======================================================
// VALIDATE FAQ
// ======================================================

export function validateFAQ(faq: CreateFAQPayload): FAQValidationErrors {
  const errors: FAQValidationErrors = {};

  // ====================================================
  // FAQ DEFAULT QUESTION
  // ====================================================

  if (!faq.faq_default_question.trim()) {
    errors.faq_default_question = "FAQ question is required.";
  } else if (faq.faq_default_question.trim().length < 10) {
    errors.faq_default_question =
      "FAQ question must be at least 10 characters.";
  }

  return errors;
}

// ======================================================
// VALIDATE QUESTION
// ======================================================

export function validateFAQQuestion(
  question: CreateFAQQuestionPayload,
): FAQQuestionValidationErrors {
  const errors: FAQQuestionValidationErrors = {};

  // ====================================================
  // QUESTION TEXT
  // ====================================================

  if (!question.question_text.trim()) {
    errors.question_text = "Question is required.";
  } else if (question.question_text.trim().length < 3) {
    errors.question_text = "Question must be at least 3 characters.";
  }

  return errors;
}

// ======================================================
// VALIDATE ANSWER BLOCK
// ======================================================

function validateAnswerBlock(
  block: CreateFAQAnswerContentBlock,
  index: number,
): string | undefined {
  // ====================================================
  // PARAGRAPH
  // ====================================================

  if (block.type === "paragraph") {
    if (!block.text?.trim()) {
      return `Paragraph ${index + 1} cannot be empty.`;
    }

    return undefined;
  }

  // ====================================================
  // IMAGE
  // ====================================================

  if (block.type === "image") {
    if (!block.image_url?.trim()) {
      return `Image ${index + 1} must have a valid image URL.`;
    }

    return undefined;
  }

  return `Invalid content block at position ${index + 1}.`;
}

// ======================================================
// VALIDATE ANSWER
// ======================================================

export function validateFAQAnswer(
  answer: CreateFAQAnswerPayload,
): FAQAnswerValidationErrors {
  const errors: FAQAnswerValidationErrors = {};

  // ====================================================
  // ANSWER DESCRIPTION
  // ====================================================

  if (
    !Array.isArray(answer.answer_description) ||
    answer.answer_description.length === 0
  ) {
    errors.answer_description =
      "Answer must contain at least one paragraph or image.";

    return errors;
  }

  // ====================================================
  // VALIDATE BLOCKS
  // ====================================================

  for (let index = 0; index < answer.answer_description.length; index++) {
    const block = answer.answer_description[index];

    const error = validateAnswerBlock(block, index);

    if (error) {
      errors.answer_description = error;

      break;
    }
  }

  return errors;
}
