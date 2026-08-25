import {
  ChatbotSettingValidation,
  UpdateWelcomeMesagePayload,
  UpdateWelcomeImagePayload,
} from "./chatbot_setting.types";

// VALIDATE WELCOME MESSAGE

export const validateWelcomeMessage = (
  payload: UpdateWelcomeMesagePayload,
): ChatbotSettingValidation => {
  const errors: ChatbotSettingValidation = {};

  const message = payload.welcome_message?.trim();

  if (!message) {
    errors.welcome_message = "Welcome message is required.";
  } else if (message.length < 3) {
    errors.welcome_message = "Welcome message must be at least 3 characters.";
  }

  return errors;
};

// VALIDATE WELCOME IMAGE

export const validateWelcomeImage = (
  payload: UpdateWelcomeImagePayload,
): ChatbotSettingValidation => {
  const errors: ChatbotSettingValidation = {};

  const image = payload.welcome_image?.trim();

  if (!image) {
    errors.welcome_image = "Welcome image is required.";
  }

  return errors;
};
