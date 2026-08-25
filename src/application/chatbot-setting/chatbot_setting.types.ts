export interface ChatbotSettings {
  _id?: string;
  welcome_message: string;
  welcome_image: string;
  created_at?: Date;
  updated_at?: Date;
}

// update welcome message

export interface UpdateWelcomeMesagePayload {
  welcome_message: string;
}

// update welcome image
export interface UpdateWelcomeImagePayload {
  welcome_image: string;
}

// image upload response
export interface UploadImageResponse {
  urls: string[];
}

// api response
export interface ChatbotSettingResponse {
  success?: boolean;
  message?: string;
  data?: ChatbotSettings;
}

// validation errors
export interface ChatbotSettingValidation {
  welcome_message?: string;
  welcome_image?: string;
}

// empty setting
export const EMPTY_CHATBOT_SETTINGS: ChatbotSettings = {
  welcome_message: "",
  welcome_image: "",
};
