/* eslint-disable react-hooks/immutability */
"use client";

// ======================================================
// React
// ======================================================

import {
  ChangeEvent,
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

// ======================================================
// Services
// ======================================================

import FAQService from "./faq.service";

// ======================================================
// Types
// ======================================================

import {
  FAQ,
  FAQCategory,
  FAQQuestion,
  CreateFAQPayload,
  UpdateFAQPayload,
  CreateFAQQuestionPayload,
  UpdateFAQQuestionPayload,
  CreateFAQAnswerPayload,
  UpdateFAQAnswerPayload,
} from "./faq.types";

// ======================================================
// Validation
// ======================================================

import { validateFAQ, FAQValidationErrors } from "./faq.validation";

// ======================================================
// EMPTY FAQ
// ======================================================

const EMPTY_FAQ: CreateFAQPayload = {
  faq_default_question: "",
  faq_created_by: "admin",
};

// ======================================================
// CONTEXT TYPE
// ======================================================

interface FAQContextType {
  loading: boolean;
  faqs: FAQ[];
  faq: CreateFAQPayload;
  faqErrors: FAQValidationErrors;
  selectedFAQ: FAQ | null;
  language: string;
  setLanguage: React.Dispatch<React.SetStateAction<string>>;

  setSelectedFAQData: (faq: FAQ) => void;

  handleFAQChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;

  resetFAQForm: () => void;

  getAllFAQs: () => Promise<void>;
  getFAQByGeneratedId: (faq_generated_id: string) => Promise<void>;

  createFAQ: () => Promise<boolean>;
  updateFAQ: (
    faq_generated_id: string,
    payload: UpdateFAQPayload,
  ) => Promise<boolean>;
  deleteFAQ: (faq_generated_id: string) => Promise<boolean>;

  // Category (Topic) methods
  addFAQCategory: (
    faq_generated_id: string,
    topic_generated_id: string,
    topic_name: string,
  ) => Promise<boolean>;
  deleteFAQCategory: (
    faq_generated_id: string,
    category_generated_id: string,
  ) => Promise<boolean>;

  // Question methods
  addCategoryQuestion: (
    faq_generated_id: string,
    category_generated_id: string,
    payload: CreateFAQQuestionPayload,
  ) => Promise<boolean>;
  updateCategoryQuestion: (
    faq_generated_id: string,
    category_generated_id: string,
    question_generated_id: string,
    payload: UpdateFAQQuestionPayload,
  ) => Promise<boolean>;
  deleteCategoryQuestion: (
    faq_generated_id: string,
    category_generated_id: string,
    question_generated_id: string,
  ) => Promise<boolean>;

  // Answer methods
  addCategoryAnswer: (
    faq_generated_id: string,
    category_generated_id: string,
    question_generated_id: string,
    payload: CreateFAQAnswerPayload,
  ) => Promise<boolean>;
  updateCategoryAnswer: (
    faq_generated_id: string,
    category_generated_id: string,
    question_generated_id: string,
    answer_generated_id: string,
    payload: UpdateFAQAnswerPayload,
  ) => Promise<boolean>;
  deleteCategoryAnswer: (
    faq_generated_id: string,
    category_generated_id: string,
    question_generated_id: string,
    answer_generated_id: string,
  ) => Promise<boolean>;
}

// ======================================================
// CONTEXT
// ======================================================

const FAQContext = createContext<FAQContextType | undefined>(undefined);

// ======================================================
// PROVIDER
// ======================================================

export const FAQProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(false);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [faq, setFaq] = useState<CreateFAQPayload>(EMPTY_FAQ);
  const [faqErrors, setFaqErrors] = useState<FAQValidationErrors>({});
  const [selectedFAQ, setSelectedFAQ] = useState<FAQ | null>(null);
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    getAllFAQs();
  }, [language]);

  useEffect(() => {
    if (selectedFAQ?.faq_generated_id) {
      getFAQByGeneratedId(selectedFAQ.faq_generated_id);
    }
  }, [language]);

  // ======================================================
  // HANDLE FAQ INPUT CHANGE
  // ======================================================

  const handleFAQChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setFaq((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (faqErrors[name as keyof FAQValidationErrors]) {
      setFaqErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // ======================================================
  // RESET FAQ FORM
  // ======================================================

  const resetFAQForm = () => {
    setFaq(EMPTY_FAQ);
    setFaqErrors({});
    setSelectedFAQ(null);
  };

  // ======================================================
  // SET SELECTED FAQ
  // ======================================================

  const setSelectedFAQData = (selected: FAQ) => {
    setSelectedFAQ(selected);
    setFaq({
      faq_default_question:
        typeof selected.faq_default_question === "string"
          ? selected.faq_default_question
          : selected.faq_default_question.en,
      faq_created_by: selected.faq_created_by,
    });
    setFaqErrors({});
  };

  // ======================================================
  // GET ALL FAQS
  // ======================================================

  const getAllFAQs = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await FAQService.getAllFAQs(language);
      if (response.success) {
        setFaqs(response.data ?? []);
      }
    } catch (error) {
      console.error("Failed to fetch FAQs.", error);
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // GET FAQ BY GENERATED ID
  // ======================================================

  const getFAQByGeneratedId = async (
    faq_generated_id: string,
  ): Promise<void> => {
    try {
      setLoading(true);
      const response = await FAQService.getFAQByGeneratedId(
        faq_generated_id,
        language,
      );
      if (response.success) {
        setSelectedFAQData(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch FAQ.", error);
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // CREATE FAQ
  // ======================================================

  const createFAQ = async (): Promise<boolean> => {
    try {
      const validationErrors = validateFAQ(faq);
      if (Object.keys(validationErrors).length > 0) {
        setFaqErrors(validationErrors);
        return false;
      }

      setLoading(true);
      const response = await FAQService.createFAQ(faq);
      if (response.success) {
        await getAllFAQs();
        resetFAQForm();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to create FAQ.", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // UPDATE FAQ
  // ======================================================

  const updateFAQ = async (
    faq_generated_id: string,
    payload: UpdateFAQPayload,
  ): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await FAQService.updateFAQ(faq_generated_id, payload);
      if (response.success) {
        await getAllFAQs();
        resetFAQForm();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to update FAQ.", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // DELETE FAQ
  // ======================================================

  const deleteFAQ = async (faq_generated_id: string): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await FAQService.deleteFAQ(faq_generated_id);
      if (response.success) {
        await getAllFAQs();
        resetFAQForm();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to delete FAQ.", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // ADD FAQ CATEGORY (TOPIC)
  // ======================================================

  const addFAQCategory = async (
    faq_generated_id: string,
    topic_generated_id: string,
    topic_name: string,
  ): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await FAQService.addFAQCategory(
        faq_generated_id,
        topic_generated_id,
        topic_name,
      );
      if (response.success) {
        await getFAQByGeneratedId(faq_generated_id);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to add FAQ Category.", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // DELETE FAQ CATEGORY
  // ======================================================

  const deleteFAQCategory = async (
    faq_generated_id: string,
    category_generated_id: string,
  ): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await FAQService.deleteFAQCategory(
        faq_generated_id,
        category_generated_id,
      );
      if (response.success) {
        await getFAQByGeneratedId(faq_generated_id);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to delete FAQ Category.", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // ADD QUESTION TO CATEGORY
  // ======================================================

  const addCategoryQuestion = async (
    faq_generated_id: string,
    category_generated_id: string,
    payload: CreateFAQQuestionPayload,
  ): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await FAQService.addCategoryQuestion(
        faq_generated_id,
        category_generated_id,
        payload,
      );
      if (response.success) {
        await getFAQByGeneratedId(faq_generated_id);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to add question.", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // UPDATE CATEGORY QUESTION
  // ======================================================

  const updateCategoryQuestion = async (
    faq_generated_id: string,
    category_generated_id: string,
    question_generated_id: string,
    payload: UpdateFAQQuestionPayload,
  ): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await FAQService.updateCategoryQuestion(
        faq_generated_id,
        category_generated_id,
        question_generated_id,
        payload,
      );
      if (response.success) {
        await getFAQByGeneratedId(faq_generated_id);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to update question.", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // DELETE CATEGORY QUESTION
  // ======================================================

  const deleteCategoryQuestion = async (
    faq_generated_id: string,
    category_generated_id: string,
    question_generated_id: string,
  ): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await FAQService.deleteCategoryQuestion(
        faq_generated_id,
        category_generated_id,
        question_generated_id,
      );
      if (response.success) {
        await getFAQByGeneratedId(faq_generated_id);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to delete question.", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // ADD ANSWER TO QUESTION
  // ======================================================

  const addCategoryAnswer = async (
    faq_generated_id: string,
    category_generated_id: string,
    question_generated_id: string,
    payload: CreateFAQAnswerPayload,
  ): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await FAQService.addCategoryAnswer(
        faq_generated_id,
        category_generated_id,
        question_generated_id,
        payload,
      );
      if (response.success) {
        await getFAQByGeneratedId(faq_generated_id);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to add answer.", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // UPDATE CATEGORY ANSWER
  // ======================================================

  const updateCategoryAnswer = async (
    faq_generated_id: string,
    category_generated_id: string,
    question_generated_id: string,
    answer_generated_id: string,
    payload: UpdateFAQAnswerPayload,
  ): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await FAQService.updateCategoryAnswer(
        faq_generated_id,
        category_generated_id,
        question_generated_id,
        answer_generated_id,
        payload,
      );
      if (response.success) {
        await getFAQByGeneratedId(faq_generated_id);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to update answer.", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // DELETE CATEGORY ANSWER
  // ======================================================

  const deleteCategoryAnswer = async (
    faq_generated_id: string,
    category_generated_id: string,
    question_generated_id: string,
    answer_generated_id: string,
  ): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await FAQService.deleteCategoryAnswer(
        faq_generated_id,
        category_generated_id,
        question_generated_id,
        answer_generated_id,
      );
      if (response.success) {
        await getFAQByGeneratedId(faq_generated_id);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to delete answer.", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // CONTEXT VALUE
  // ======================================================

  const value: FAQContextType = {
    loading,
    faqs,
    faq,
    faqErrors,
    selectedFAQ,
    language,
    setLanguage,

    setSelectedFAQData,
    handleFAQChange,
    resetFAQForm,

    getAllFAQs,
    getFAQByGeneratedId,

    createFAQ,
    updateFAQ,
    deleteFAQ,

    addFAQCategory,
    deleteFAQCategory,

    addCategoryQuestion,
    updateCategoryQuestion,
    deleteCategoryQuestion,

    addCategoryAnswer,
    updateCategoryAnswer,
    deleteCategoryAnswer,
  };

  return <FAQContext.Provider value={value}>{children}</FAQContext.Provider>;
};

// ======================================================
// HOOK
// ======================================================

export const useFAQ = () => {
  const context = useContext(FAQContext);
  if (!context) {
    throw new Error("useFAQ must be used within FAQProvider");
  }
  return context;
};
