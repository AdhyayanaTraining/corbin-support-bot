// ======================================================
// CHAT MESSAGE
// ======================================================

export interface ChatMessage {
  role: "user" | "assistant";

  content: string;
}

// ======================================================
// CHAT SOURCE
// ======================================================

export interface ChatSource {
  document_id: string;

  chunk_index: number;

  score: number;
}

// ======================================================
// CHAT RESPONSE
// ======================================================

export interface ChatResponse {
  answer: string;

  sources: ChatSource[];
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
