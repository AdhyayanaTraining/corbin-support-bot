import axiosClient from "@/src/infrastructure/api/axiosClient";

import { CreateConversationPayload, SendMessagePayload } from "./chat.types";

class ChatService {
  // =====================================================
  // CREATE CONVERSATION
  // =====================================================

  async createConversation(payload: CreateConversationPayload) {
    const response = await axiosClient.post("/create-conversation", payload);

    return response.data;
  }

  // =====================================================
  // SEND MESSAGE
  // =====================================================

  async sendMessage(payload: SendMessagePayload) {
    const response = await axiosClient.post("/send-message", payload);

    return response.data;
  }

  // =====================================================
  // GET CONVERSATION
  // =====================================================

  async getConversation(conversation_generated_id: string) {
    const response = await axiosClient.get(
      `/get-conversation/${conversation_generated_id}`,
    );

    return response.data;
  }

  // =====================================================
  // GET VISITOR CONVERSATIONS
  // =====================================================

  async getVisitorConversations(visitor_generated_id: string) {
    const response = await axiosClient.get(
      `/get-visitor-conversations/${visitor_generated_id}`,
    );

    return response.data;
  }

  // =====================================================
  // GET CONVERSATION MESSAGES
  // =====================================================

  async getConversationMessages(conversation_generated_id: string) {
    const response = await axiosClient.get(
      `/get-conversation-messages/${conversation_generated_id}`,
    );

    return response.data;
  }

  // =====================================================
  // MARK CONVERSATION AS READ
  // =====================================================

  async markConversationAsRead(conversation_generated_id: string) {
    const response = await axiosClient.put(
      `/mark-conversation-as-read/${conversation_generated_id}`,
    );

    return response.data;
  }

  // =====================================================
  // GET UNREAD COUNT
  // =====================================================

  async getUnreadCount(conversation_generated_id: string) {
    const response = await axiosClient.get(
      `/get-unread-count/${conversation_generated_id}`,
    );

    return response.data;
  }
}

export default new ChatService();
