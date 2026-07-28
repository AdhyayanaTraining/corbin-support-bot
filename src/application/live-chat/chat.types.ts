// ======================================================
// CONVERSATION STATUS
// ======================================================

export type ConversationStatus = "WAITING" | "ACTIVE" | "CLOSED";

// ======================================================
// MESSAGE SENDER
// ======================================================

export type MessageSender = "VISITOR" | "EXPERT" | "SYSTEM";

// ======================================================
// MESSAGE TYPE
// ======================================================

export type MessageType = "TEXT" | "IMAGE" | "FILE";

// ======================================================
// CHAT CONVERSATION
// ======================================================

export interface ChatConversation {
  conversation_generated_id: string;

  visitor_name: string;

  visitor_email: string;

  visitor_phone_number?: string;

  visitor_generated_id: string;

  category_name: string;

  expert_generated_id: string;

  expert_name: string;

  expert_email: string;

  expert_phone_number?: string;

  status: ConversationStatus;

  last_message?: string;

  last_message_at?: string;

  accepted_at?: string;

  closed_at?: string;

  created_at: string;

  updated_at: string;
}

// ======================================================
// CHAT MESSAGE
// ======================================================

export interface ChatMessage {
  message_generated_id: string;

  conversation_generated_id: string;

  sender: MessageSender;

  sender_generated_id?: string;

  message: string;

  message_type: MessageType;

  is_read: boolean;

  created_at: string;
}

// ======================================================
// CREATE CONVERSATION PAYLOAD
// ======================================================

export interface CreateConversationPayload {
  visitor_name: string;

  visitor_email: string;

  visitor_phone_number?: string;

  visitor_generated_id: string;

  category_generated_id: string;

  category_name: string;
}
// ======================================================
// SEND MESSAGE PAYLOAD
// ======================================================

export interface SendMessagePayload {
  conversation_generated_id: string;

  sender: MessageSender;

  sender_generated_id?: string;

  message: string;

  message_type?: MessageType;
}

// ======================================================
// EMPTY CONVERSATION
// ======================================================

export const EMPTY_CONVERSATION: CreateConversationPayload = {
  visitor_name: "",

  visitor_email: "",

  visitor_phone_number: "",

  visitor_generated_id: "",

  category_generated_id: "",

  category_name: "",
};

// ======================================================
// EMPTY MESSAGE
// ======================================================

export const EMPTY_MESSAGE: SendMessagePayload = {
  conversation_generated_id: "",

  sender: "VISITOR",

  sender_generated_id: "",

  message: "",

  message_type: "TEXT",
};
