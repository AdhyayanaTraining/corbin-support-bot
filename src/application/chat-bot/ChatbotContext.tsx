"use client";

// ======================================================
// React
// ======================================================

import {
  ChangeEvent,
  createContext,
  ReactNode,
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

  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;

  resetForm: () => void;

  askQuestion: () => Promise<boolean>;
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

  const [question, setQuestion] =
    useState<AskQuestionPayload>(EMPTY_CHAT_PAYLOAD);

  const [response, setResponse] = useState<ChatResponse | null>(null);

  const [errors, setErrors] = useState<ChatValidationErrors>({});

  // ======================================================
  // HANDLE CHANGE
  // ======================================================

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setQuestion((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof ChatValidationErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // ======================================================
  // RESET
  // ======================================================

  const resetForm = () => {
    setQuestion(EMPTY_CHAT_PAYLOAD);

    setErrors({});
  };

  // ======================================================
  // ASK QUESTION
  // ======================================================

  const askQuestion = async (): Promise<boolean> => {
    try {
      setLoading(true);

      const validationErrors = validateQuestion(question);

      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);

        return false;
      }

      setErrors({});

      setMessages((prev) => [
        ...prev,
        {
          role: "user",
          content: question.question,
        },
      ]);

      const result = await ChatbotService.askQuestion(question);

      if (!result.success) {
        return false;
      }

      setResponse(result.data);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: result.data.answer,
        },
      ]);

      setQuestion(EMPTY_CHAT_PAYLOAD);

      return true;
    } catch (error) {
      console.error(error);

      return false;
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // CONTEXT VALUE
  // ======================================================

  const value: ChatbotContextType = {
    loading,

    messages,

    question,

    response,

    errors,

    handleChange,

    resetForm,

    askQuestion,
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
