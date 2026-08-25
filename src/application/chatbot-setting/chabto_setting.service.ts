import axiosClient from "@/src/infrastructure/api/axiosClient";
import {
  ChatbotSettingResponse,
  UpdateWelcomeImagePayload,
  UpdateWelcomeMesagePayload,
  UploadImageResponse,
} from "./chatbot_setting.types";

class ChatbotSettingService {
  // ======================================================
  // GET CHATBOT SETTINGS
  // ======================================================

  static async getChatbotSetting(): Promise<ChatbotSettingResponse> {
    const response = await axiosClient.get("/get-chatbot-setting");

    return response.data;
  }

  // ======================================================
  // UPDATE WELCOME MESSAGE
  // ======================================================

  static async updateWelcomeMessage(
    payload: UpdateWelcomeMesagePayload,
  ): Promise<ChatbotSettingResponse> {
    const response = await axiosClient.put("/update-welcome-message", payload);

    return response.data;
  }

  // ======================================================
  // UPDATE WELCOME IMAGE
  // ======================================================

  static async updateWelcomeImage(
    payload: UpdateWelcomeImagePayload,
  ): Promise<ChatbotSettingResponse> {
    const response = await axiosClient.put("/update-welcome-image", payload);

    return response.data;
  }

  // ======================================================
  // UPLOAD WELCOME IMAGE
  // ======================================================

  static async uploadWelcomeImage(file: File): Promise<UploadImageResponse> {
    const formData = new FormData();

    formData.append("images", file);

    formData.append("image_name", `chatbot-welcome-${Date.now()}`);

    formData.append("image_path", "chatbot/welcome");

    const response = await axiosClient.post("/images/upload-images", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  }
}

export default ChatbotSettingService;
