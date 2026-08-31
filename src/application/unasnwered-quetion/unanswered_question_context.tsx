"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";

import {
  CreateUnansweredQuestionPayload,
  UnansweredQuestion,
  UnansweredQuestionValidation,
} from "./unanswered_question_type";

import UnansweredQuestionService from "./unanswered_question_service";

import { validateUnansweredQuestion } from "./unanswered_question_validation";

// ======================================================
// CONTEXT TYPE
// ======================================================

interface UnansweredQuestionContextTypes {
  loading: boolean;

  errors: UnansweredQuestionValidation;

  unansweredQuestion: UnansweredQuestion | null;

  createUnansweredQuestion: (
    payload: CreateUnansweredQuestionPayload,
  ) => Promise<boolean>;

  resetUnansweredQuestion: () => void;

  clearErrors: () => void;
}

// ======================================================
// CONTEXT
// ======================================================

export const UnansweredQuestionContext = createContext<
  UnansweredQuestionContextTypes | undefined
>(undefined);

// ======================================================
// PROVIDER
// ======================================================

export const UnansweredQuestionProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  // ====================================================
  // STATES
  // ====================================================

  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState<UnansweredQuestionValidation>({});

  const [unansweredQuestion, setUnansweredQuestion] =
    useState<UnansweredQuestion | null>(null);

  // ====================================================
  // CREATE UNANSWERED QUESTION
  // ====================================================

  const createUnansweredQuestion = useCallback(
    async (
      payload: CreateUnansweredQuestionPayload,
    ): Promise<boolean> => {
      try {
        // ==================================================
        // VALIDATION
        // ==================================================

        const validationErrors = validateUnansweredQuestion(payload);

        if (Object.keys(validationErrors).length > 0) {
          setErrors(validationErrors);

          return false;
        }

        setErrors({});

        // ==================================================
        // API CALL
        // ==================================================

        setLoading(true);

        const response =
          await UnansweredQuestionService.createUnansweredQuestion({
            question: payload.question.trim(),
            topic: payload.topic.trim(),
          });

        // ==================================================
        // SUCCESS
        // ==================================================

        if (response.success && response.data) {
          setUnansweredQuestion(response.data);

          return true;
        }

        return false;
      } catch (error) {
        console.error(
          "Failed to create unanswered question:",
          error,
        );

        return false;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // ====================================================
  // RESET
  // ====================================================

  const resetUnansweredQuestion = useCallback(() => {
    setUnansweredQuestion(null);

    setErrors({});
  }, []);

  // ====================================================
  // CLEAR ERRORS
  // ====================================================

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  // ====================================================
  // CONTEXT VALUE
  // ====================================================

  const value: UnansweredQuestionContextTypes = {
    loading,

    errors,

    unansweredQuestion,

    createUnansweredQuestion,

    resetUnansweredQuestion,

    clearErrors,
  };

  // ====================================================
  // PROVIDER
  // ====================================================

  return (
    <UnansweredQuestionContext.Provider value={value}>
      {children}
    </UnansweredQuestionContext.Provider>
  );
};

// ======================================================
// HOOK
// ======================================================

export const useUnansweredQuestion = () => {
  const context = useContext(UnansweredQuestionContext);

  if (context === undefined) {
    throw new Error(
      "useUnansweredQuestion must be used within an UnansweredQuestionProvider",
    );
  }

  return context;
};