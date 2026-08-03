import axiosClient from "@/src/infrastructure/api/axiosClient";

import { AskQuestionPayload } from "./chatbot.types";

class ChatbotService {
  // =====================================================
  // ASK QUESTION WITH LANGUAGE SUPPORT
  // =====================================================

  async askQuestion(payload: AskQuestionPayload) {
    const response = await axiosClient.post("/chat", payload);

    return response.data;
  }
}

export default new ChatbotService();
