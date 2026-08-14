// ======================================================
// CHAT MESSAGE
// ======================================================

export interface ChatMessage {
  id?: string;

  role: "user" | "assistant";

  content: string;

  source?: string;

  answerBlocks?: any;
}

// ======================================================
// CHAT SOURCE
// ======================================================

export interface ChatSource {
  document_id?: string;

  chunk_index?: number;

  score?: number;
}

// ======================================================
// CHAT RESPONSE
// ======================================================

export interface ChatResponse {
  answer: string;

  sources: ChatSource[];

  source: "faq" | "rag";

  faq_generated_id?: string;
}

// ======================================================
// ASK QUESTION PAYLOAD
// ======================================================

export interface AskQuestionPayload {
  question: string;

  language: string;
}

// ======================================================
// EMPTY PAYLOAD
// ======================================================

export const EMPTY_CHAT_PAYLOAD: AskQuestionPayload = {
  question: "",

  language: "en",
};