// // faq.types.ts

// // ======================================================
// // FAQ Content
// // ======================================================

// export interface FAQContent {
//   faq_content_generated_id?: string;
//   faq_content_summary: string;
//   faq_content_file?: string;
//   faq_content_created_by: string;
//   faq_content_created_at?: string;
//   faq_content_updated_by?: string;
//   faq_content_updated_at?: string;
// }

// // ======================================================
// // FAQ SubTopic
// // ======================================================

// export interface FAQSubTopic {
//   faq_subtopic_generated_id?: string;
//   faq_subtopic_title: string;
//   faq_subtopics?: FAQSubTopic[];
//   faq_contents?: FAQContent[];
//   faq_subtopic_created_by: string;
//   faq_subtopic_created_at?: string;
//   faq_subtopic_updated_by?: string;
//   faq_subtopic_updated_at?: string;
// }

// // ======================================================
// // FAQ
// // ======================================================

// export interface FAQ {
//   faq_generated_id: string;
//   faq_default_question: string;
//   faq_subtopics: FAQSubTopic[];
//   faq_contents: FAQContent[];
//   isActiveFAQ: boolean;
//   faq_created_by: string;
//   faq_created_at: string;
//   faq_updated_by?: string;
//   faq_updated_at?: string;
// }

// // ======================================================
// // Create FAQ Payload
// // ======================================================

// export interface CreateFAQPayload {
//   faq_default_question: string;
//   faq_subtopics: FAQSubTopic[];
//   faq_contents: FAQContent[];
//   isActiveFAQ: boolean;
//   faq_created_by: string;
// }

// // ======================================================
// // Update FAQ Payload
// // ======================================================

// export interface UpdateFAQPayload {
//   faq_default_question: string;
//   faq_subtopics: FAQSubTopic[];
//   faq_contents: FAQContent[];
//   isActiveFAQ: boolean;
//   faq_updated_by: string;
// }

// // ======================================================
// // Create FAQ SubTopic Payload
// // ======================================================

// export interface CreateFAQSubTopicPayload {
//   faq_subtopic_title: string;
//   faq_subtopics: FAQSubTopic[];
//   faq_contents: FAQContent[];
//   faq_subtopic_created_by: string;
// }

// // ======================================================
// // Update FAQ SubTopic Payload
// // ======================================================

// export interface UpdateFAQSubTopicPayload {
//   faq_subtopic_title: string;
//   faq_subtopic_updated_by: string;
// }

// // ======================================================
// // Create FAQ Content Payload
// // ======================================================

// export interface CreateFAQContentPayload {
//   faq_content_summary: string;
//   faq_content_file?: string;
//   faq_content_created_by: string;
// }

// // ======================================================
// // Update FAQ Content Payload
// // ======================================================

// export interface UpdateFAQContentPayload {
//   faq_content_summary?: string;
//   faq_content_file?: string;
//   faq_content_updated_by: string;
// }

// // ======================================================
// // Empty FAQ
// // ======================================================

// export const EMPTY_FAQ: CreateFAQPayload = {
//   faq_default_question: "",
//   faq_subtopics: [],
//   faq_contents: [],
//   isActiveFAQ: true,
//   faq_created_by: "admin",
// };

// // ======================================================
// // Empty FAQ SubTopic
// // ======================================================

// export const EMPTY_FAQ_SUBTOPIC: CreateFAQSubTopicPayload = {
//   faq_subtopic_title: "",
//   faq_subtopics: [],
//   faq_contents: [],
//   faq_subtopic_created_by: "admin",
// };

// // ======================================================
// // Empty FAQ Content
// // ======================================================

// export const EMPTY_FAQ_CONTENT: CreateFAQContentPayload = {
//   faq_content_summary: "",
//   faq_content_created_by: "admin",
// };
// ======================================================
// FAQ Answer
// ======================================================
export interface FAQAnswer {
  answer_generated_id?: string;
  answer_text: string;
  created_by: string;
  created_at?: string;
}

export interface FAQQuestion {
  question_generated_id?: string;
  question_text: string;
  answers: FAQAnswer[];
  created_by: string;
  created_at?: string;
}

export interface FAQCategory {
  category_generated_id?: string;
  topic_generated_id: string;
  topic_name?: string;
  questions: FAQQuestion[];
  created_by: string;
  created_at?: string;
}

export interface FAQ {
  faq_generated_id: string;
  faq_default_question: string;
  categories: FAQCategory[];
  isActiveFAQ: boolean;
  faq_created_by: string;
  faq_created_at: string;
  faq_updated_at?: string;
}

export interface CreateFAQPayload {
  faq_default_question: string;
  faq_created_by: string;
}

export interface UpdateFAQPayload {
  faq_default_question: string;
}

export interface CreateFAQQuestionPayload {
  question_text: string;
  created_by?: string;
}

export interface UpdateFAQQuestionPayload {
  question_text: string;
}

export interface CreateFAQAnswerPayload {
  answer_text: string;
  created_by?: string;
}

export interface UpdateFAQAnswerPayload {
  answer_text: string;
}

export const EMPTY_FAQ: CreateFAQPayload = {
  faq_default_question: "",
  faq_created_by: "admin",
};
