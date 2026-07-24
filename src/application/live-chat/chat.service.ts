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
  // ACCEPT CONVERSATION
  // =====================================================

  async acceptConversation(conversation_generated_id: string) {
    const response = await axiosClient.put(
      `/accept-conversation/${conversation_generated_id}`,
    );

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
  // GET CONVERSATION MESSAGES
  // =====================================================

  async getConversationMessages(conversation_generated_id: string) {
    const response = await axiosClient.get(
      `/get-conversation-messages/${conversation_generated_id}`,
    );

    return response.data;
  }

  // =====================================================
  // GET EXPERT CONVERSATIONS
  // =====================================================

  async getExpertConversations(expert_generated_id: string) {
    const response = await axiosClient.get(
      `/get-expert-conversations/${expert_generated_id}`,
    );

    return response.data;
  }

  // =====================================================
  // GET VISITOR CONVERSATIONS
  // =====================================================

  async getVisitorConversations(visitor_email: string) {
    const response = await axiosClient.get(
      `/get-visitor-conversations/${visitor_email}`,
    );

    return response.data;
  }

  // =====================================================
  // GET WAITING CONVERSATIONS
  // =====================================================

  async getWaitingConversations() {
    const response = await axiosClient.get("/get-waiting-conversations");

    return response.data;
  }

  // =====================================================
  // GET ACTIVE CONVERSATIONS
  // =====================================================

  async getActiveConversations() {
    const response = await axiosClient.get("/get-active-conversations");

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

  // =====================================================
  // CLOSE CONVERSATION
  // =====================================================

  async closeConversation(conversation_generated_id: string) {
    const response = await axiosClient.put(
      `/close-conversation/${conversation_generated_id}`,
    );

    return response.data;
  }

  // =====================================================
  // DELETE CONVERSATION
  // =====================================================

  async deleteConversation(conversation_generated_id: string) {
    const response = await axiosClient.delete(
      `/delete-conversation/${conversation_generated_id}`,
    );

    return response.data;
  }
}

export default new ChatService();
