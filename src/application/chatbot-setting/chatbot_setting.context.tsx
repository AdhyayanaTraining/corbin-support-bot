/* eslint-disable react-hooks/set-state-in-effect */

"use client";

// ======================================================
// React
// ======================================================

import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";

// ======================================================
// Types
// ======================================================

import {
  ChatbotSettings,
  ChatbotSettingValidation,
  EMPTY_CHATBOT_SETTINGS,
  UpdateWelcomeImagePayload,
  UpdateWelcomeMesagePayload,
} from "./chatbot_setting.types";

// ======================================================
// Service
// ======================================================

import ChatbotSettingService from "./chabto_setting.service";

// ======================================================
// Validation
// ======================================================

import {
  validateWelcomeImage,
  validateWelcomeMessage,
} from "./chatbot_setting.validation";

// ======================================================
// CONTEXT TYPE
// ======================================================

interface ChatbotSettingContextTypes {
  loading: boolean;

  settings: ChatbotSettings;

  errors: ChatbotSettingValidation;

  // ====================================================
  // GET SETTINGS
  // ====================================================

  getChatbotSetting: () => Promise<void>;

  // ====================================================
  // UPDATE WELCOME MESSAGE
  // ====================================================

  updateWelcomeMessage: (
    payload: UpdateWelcomeMesagePayload,
  ) => Promise<boolean>;

  // ====================================================
  // UPDATE WELCOME IMAGE URL
  // ====================================================

  updateWelcomeImage: (payload: UpdateWelcomeImagePayload) => Promise<boolean>;

  // ====================================================
  // UPLOAD IMAGE + UPDATE URL
  // ====================================================

  uploadWelcomeImage: (file: File) => Promise<boolean>;

  // ====================================================
  // RESET
  // ====================================================

  resetSettings: () => void;
}

// ======================================================
// CONTEXT
// ======================================================

export const ChatbotSettingContext = createContext<
  ChatbotSettingContextTypes | undefined
>(undefined);

// ======================================================
// PROVIDER
// ======================================================

export const ChatbotSettingProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  // ====================================================
  // STATE
  // ====================================================

  const [loading, setLoading] = useState(false);

  const [settings, setSettings] = useState<ChatbotSettings>(
    EMPTY_CHATBOT_SETTINGS,
  );

  const [errors, setErrors] = useState<ChatbotSettingValidation>({});

  // ====================================================
  // GET CHATBOT SETTINGS
  // ====================================================

  const getChatbotSetting = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);

      const response = await ChatbotSettingService.getChatbotSetting();

      if (response.success && response.data) {
        setSettings(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch chatbot settings:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // ====================================================
  // LOAD SETTINGS
  // ====================================================

  useEffect(() => {
    getChatbotSetting();
  }, [getChatbotSetting]);

  // ====================================================
  // UPDATE WELCOME MESSAGE
  // ====================================================

  const updateWelcomeMessage = async (
    payload: UpdateWelcomeMesagePayload,
  ): Promise<boolean> => {
    try {
      // ==================================================
      // VALIDATION
      // ==================================================

      const validationErrors = validateWelcomeMessage(payload);

      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);

        return false;
      }

      // ==================================================
      // CLEAR ERRORS
      // ==================================================

      setErrors({});

      // ==================================================
      // API CALL
      // ==================================================

      setLoading(true);

      const response =
        await ChatbotSettingService.updateWelcomeMessage(payload);

      // ==================================================
      // SUCCESS
      // ==================================================

      if (response.success && response.data) {
        setSettings(response.data);

        return true;
      }

      return false;
    } catch (error) {
      console.error("Failed to update welcome message:", error);

      return false;
    } finally {
      setLoading(false);
    }
  };

  // ====================================================
  // UPDATE WELCOME IMAGE
  //
  // This function only updates the image URL.
  // ====================================================

  const updateWelcomeImage = async (
    payload: UpdateWelcomeImagePayload,
  ): Promise<boolean> => {
    try {
      // ==================================================
      // VALIDATION
      // ==================================================

      const validationErrors = validateWelcomeImage(payload);

      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);

        return false;
      }

      // ==================================================
      // CLEAR ERRORS
      // ==================================================

      setErrors({});

      // ==================================================
      // API CALL
      // ==================================================

      setLoading(true);

      const response = await ChatbotSettingService.updateWelcomeImage(payload);

      // ==================================================
      // SUCCESS
      // ==================================================

      if (response.success && response.data) {
        setSettings(response.data);

        return true;
      }

      return false;
    } catch (error) {
      console.error("Failed to update welcome image:", error);

      return false;
    } finally {
      setLoading(false);
    }
  };

  // ====================================================
  // UPLOAD WELCOME IMAGE
  //
  // Flow:
  //
  // File
  //   ↓
  // Upload to S3
  //   ↓
  // Receive image URL
  //   ↓
  // Update chatbot settings
  // ====================================================

  const uploadWelcomeImage = async (file: File): Promise<boolean> => {
    try {
      // ==================================================
      // START LOADING
      // ==================================================

      setLoading(true);

      // ==================================================
      // UPLOAD IMAGE TO S3
      // ==================================================

      const uploadResponse =
        await ChatbotSettingService.uploadWelcomeImage(file);

      // ==================================================
      // GET IMAGE URL
      // ==================================================

      const imageUrl = uploadResponse.urls?.[0];

      if (!imageUrl) {
        console.error("Image upload failed. No image URL returned.");

        return false;
      }

      // ==================================================
      // UPDATE CHATBOT SETTINGS
      //
      // We call the API directly here instead of calling
      // updateWelcomeImage() because both functions manage
      // loading state independently.
      // ==================================================

      const response = await ChatbotSettingService.updateWelcomeImage({
        welcome_image: imageUrl,
      });

      // ==================================================
      // SUCCESS
      // ==================================================

      if (response.success && response.data) {
        setSettings(response.data);

        setErrors({});

        return true;
      }

      return false;
    } catch (error) {
      console.error("Failed to upload and update welcome image:", error);

      return false;
    } finally {
      setLoading(false);
    }
  };

  // ====================================================
  // RESET SETTINGS
  // ====================================================

  const resetSettings = (): void => {
    setSettings(EMPTY_CHATBOT_SETTINGS);

    setErrors({});
  };

  // ====================================================
  // CONTEXT VALUE
  // ====================================================

  const value: ChatbotSettingContextTypes = {
    loading,

    settings,

    errors,

    getChatbotSetting,

    updateWelcomeMessage,

    updateWelcomeImage,

    uploadWelcomeImage,

    resetSettings,
  };

  // ====================================================
  // PROVIDER
  // ====================================================

  return (
    <ChatbotSettingContext.Provider value={value}>
      {children}
    </ChatbotSettingContext.Provider>
  );
};
