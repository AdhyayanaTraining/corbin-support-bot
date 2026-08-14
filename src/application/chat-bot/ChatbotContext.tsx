"use client";

// ======================================================
// React
// =====================================================

import {
  ChangeEvent,
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";

// ======================================================
// Service
// ======================================================

import ChatbotService from "./chatbot.service";

// ======================================================
// Types
// ======================================================

import {
  AskQuestionPayload,
  ChatMessage,
  ChatResponse,
  EMPTY_CHAT_PAYLOAD,
} from "./chatbot.types";

// ======================================================
// Validation
// ======================================================

import { ChatValidationErrors, validateQuestion } from "./chatbot.validation";

// ======================================================
// CONTEXT TYPE
// ======================================================

interface ChatbotContextType {
  loading: boolean;

  messages: ChatMessage[];

  question: AskQuestionPayload;

  response: ChatResponse | null;

  errors: ChatValidationErrors;

  selectedLanguage: string;

  changeLanguage: (languageCode: string) => void;

  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;

  resetForm: () => void;

  clearQuestionInput: () => void;

  askQuestion: (customQuestion?: string) => Promise<boolean>;

  addMessage: (message: ChatMessage) => void;
}

// ======================================================
// CONTEXT
// ======================================================

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

// ======================================================
// PROVIDER
// ======================================================

export const ChatbotProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const [selectedLanguage, setSelectedLanguage] = useState<string>("en");

  const [question, setQuestion] = useState<AskQuestionPayload>({
    ...EMPTY_CHAT_PAYLOAD,
    language: "en",
  });

  const [response, setResponse] = useState<ChatResponse | null>(null);

  const [errors, setErrors] = useState<ChatValidationErrors>({});

  // ======================================================
  // CHANGE LANGUAGE
  // ======================================================

  const changeLanguage = useCallback((languageCode: string) => {
    setSelectedLanguage(languageCode);

    setQuestion((prev) => ({
      ...prev,
      language: languageCode,
    }));
  }, []);

  // ======================================================
  // HANDLE CHANGE
  // ======================================================

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;

      setQuestion((prev) => ({
        ...prev,
        [name]: value,
        language: selectedLanguage || "en",
      }));

      if (errors[name as keyof ChatValidationErrors]) {
        setErrors((prev) => ({
          ...prev,
          [name]: "",
        }));
      }
    },
    [errors, selectedLanguage],
  );

  // ======================================================
  // ADD MESSAGE
  // ======================================================

  const addMessage = (message: ChatMessage) => {
    setMessages((prev) => [...prev, message]);
  };
  // ======================================================
  // RESET
  // ======================================================

  const resetForm = useCallback(() => {
    setQuestion({
      ...EMPTY_CHAT_PAYLOAD,
      language: selectedLanguage || "en",
    });

    setErrors({});

    setMessages([]);

    setResponse(null);
  }, [selectedLanguage]);

  // ======================================================
  // ASK QUESTION
  // ======================================================
  const askQuestion = async (
    customQuestion?: string,
  ): Promise<boolean> => {
    try {
      setLoading(true);

      // ==================================================
      // QUESTION
      // ==================================================

      const questionText = customQuestion ?? question.question;

      // ==================================================
      // PAYLOAD
      // ==================================================

      const payloadToSend: AskQuestionPayload = {
        question: questionText.trim(),

        language: question.language || selectedLanguage || "en",
      };

      // ==================================================
      // VALIDATION
      // ==================================================

      const validationErrors = validateQuestion(payloadToSend);

      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);

        return false;
      }

      setErrors({});

      // ==================================================
      // ADD USER MESSAGE
      // ==================================================

      setMessages((prev) => [
        ...prev,
        {
          role: "user",
          content: questionText.trim(),
        },
      ]);

      // ==================================================
      // CALL CHAT API
      //
      // IMPORTANT:
      // Do NOT call FAQService.searchFAQs() here.
      //
      // /chat already performs:
      //
      // Question
      //   ↓
      // FAQ Search
      //   ↓
      // FAQ answer if found
      //   ↓
      // Vector/RAG fallback
      // ==================================================

      const result = await ChatbotService.askQuestion(payloadToSend);

      // ==================================================
      // API FAILURE
      // ==================================================

      if (!result?.success) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "Sorry, I couldn't process your question right now.",
          },
        ]);

        return false;
      }

      // ==================================================
      // SAVE RESPONSE
      // ==================================================

      setResponse(result.data);

      // ==================================================
      // ADD ASSISTANT MESSAGE
      // ==================================================

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: result.data.answer,
        },
      ]);

      // ==================================================
      // RESET INPUT ONLY
      // ==================================================

      setQuestion({
        ...EMPTY_CHAT_PAYLOAD,

        language: selectedLanguage || "en",
      });

      return true;
    } catch (error) {
      console.error("Failed to ask chatbot question:", error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, something went wrong while processing your question.",
        },
      ]);

      return false;
    } finally {
      setLoading(false);
    }
  };

  // another reset option here 
  const clearQuestionInput = useCallback(() => {
    setQuestion({
      ...EMPTY_CHAT_PAYLOAD,
      language: selectedLanguage || "en",
    });

    setErrors({});
  }, [selectedLanguage]);

  // ======================================================
  // CONTEXT VALUE
  // ======================================================

  const value: ChatbotContextType = {
    loading,

    messages,

    question,

    response,

    errors,

    selectedLanguage,

    changeLanguage,

    handleChange,

    resetForm,

    clearQuestionInput,

    askQuestion,

    addMessage,
  };

  return (
    <ChatbotContext.Provider value={value}>{children}</ChatbotContext.Provider>
  );
};

// ======================================================
// HOOK
// ======================================================

export const useChatbot = () => {
  const context = useContext(ChatbotContext);

  if (!context) {
    throw new Error("useChatbot must be used within ChatbotProvider");
  }

  return context;
};
