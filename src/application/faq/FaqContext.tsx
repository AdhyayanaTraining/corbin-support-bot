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

import {
  validateFAQ,
  validateFAQQuestion,
  validateFAQAnswer,
  FAQValidationErrors,
  FAQQuestionValidationErrors,
  FAQAnswerValidationErrors,
} from "./faq.validation";

// ======================================================
// EMPTY FAQ
//
// IMPORTANT:
//
// Root FAQ contains ONLY the main/default question.
//
// SEO metadata belongs to individual questions.
// ======================================================

const EMPTY_FAQ: CreateFAQPayload = {
  faq_default_question: "",

  faq_created_by: "admin",
};

// ======================================================
// CONTEXT TYPE
// ======================================================

interface FAQContextType {
  // ====================================================
  // STATE
  // ====================================================

  loading: boolean;

  faqs: FAQ[];

  faq: CreateFAQPayload;

  faqErrors: FAQValidationErrors;

  faqQuestionErrors: FAQQuestionValidationErrors;

  selectedFAQ: FAQ | null;

  language: string;

  setLanguage: React.Dispatch<React.SetStateAction<string>>;

  searchFAQs: (
    searchTerm: string,
    searchLanguage?: string,
  ) => Promise<FAQQuestion | null>;
  faqSearchLoading: boolean;

  // ====================================================
  // FAQ
  // ====================================================

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

  // ====================================================
  // FAQ CATEGORY / TOPIC
  // ====================================================

  addFAQCategory: (
    faq_generated_id: string,
    topic_generated_id: string,
    topic_name: string,
  ) => Promise<boolean>;

  updateFAQCategory: (
    faq_generated_id: string,
    category_generated_id: string,
    topic_name: string,
  ) => Promise<boolean>;

  deleteFAQCategory: (
    faq_generated_id: string,
    category_generated_id: string,
  ) => Promise<boolean>;

  // ====================================================
  // FAQ QUESTION
  // ====================================================

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

  // ====================================================
  // QUESTION VALIDATION
  // ====================================================

  validateQuestion: (
    payload: CreateFAQQuestionPayload,
  ) => FAQQuestionValidationErrors;

  // ====================================================
  // FAQ ANSWER
  // ====================================================

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

  // ====================================================
  // ANSWER VALIDATION
  // ====================================================

  validateAnswer: (
    payload: CreateFAQAnswerPayload,
  ) => FAQAnswerValidationErrors;
}

// ======================================================
// CONTEXT
// ======================================================

const FAQContext = createContext<FAQContextType | undefined>(undefined);

// ======================================================
// PROVIDER
// ======================================================

export const FAQProvider = ({ children }: { children: ReactNode }) => {
  // ====================================================
  // STATE
  // ====================================================

  const [loading, setLoading] = useState(false);

  const [faqs, setFaqs] = useState<FAQ[]>([]);

  const [faq, setFaq] = useState<CreateFAQPayload>(EMPTY_FAQ);

  const [faqErrors, setFaqErrors] = useState<FAQValidationErrors>({});

  const [faqQuestionErrors, setFaqQuestionErrors] =
    useState<FAQQuestionValidationErrors>({});

  const [selectedFAQ, setSelectedFAQ] = useState<FAQ | null>(null);

  const [language, setLanguage] = useState("en");

  const [faqSearchLoading, setFaqSearchLoading] = useState(false);

  // ====================================================
  // SEARCH FAQS
  // ====================================================

  const searchFAQs = async (
    searchTerm: string,
    searchLanguage?: string,
  ): Promise<FAQQuestion | null> => {
    try {
      setFaqSearchLoading(true);

      const response = await FAQService.searchFAQs(
        searchTerm,
        searchLanguage || "en",
      );

      if (!response.success || !response.data) {
        return null;
      }

      const data = response.data;

      // API returned an array
      if (Array.isArray(data)) {
        const item = data[0];

        if (!item) {
          return null;
        }

        // Direct FAQQuestion
        if (item.question_text || item.answers) {
          return item as FAQQuestion;
        }

        // Root FAQ -> category -> question
        if (item.categories?.length) {
          const firstCategory = item.categories[0];

          if (firstCategory?.questions?.length) {
            return firstCategory.questions[0] as FAQQuestion;
          }
        }

        return null;
      }

      // API returned an object
      if (typeof data === "object") {
        const item = data as any;

        // { question: {...} }
        if (item.question) {
          return item.question as FAQQuestion;
        }

        // Direct FAQQuestion
        if (item.question_text || item.answers) {
          return item as FAQQuestion;
        }

        // Root FAQ -> category -> question
        if (item.categories?.length) {
          const firstCategory = item.categories[0];

          if (firstCategory?.questions?.length) {
            return firstCategory.questions[0] as FAQQuestion;
          }
        }
      }

      return null;
    } catch (error) {
      console.error("FAQ search failed:", error);
      return null;
    } finally {
      setFaqSearchLoading(false);
    }
  };

  // ====================================================
  // GET ALL FAQS WHEN LANGUAGE CHANGES
  // ====================================================

  useEffect(() => {
    getAllFAQs();
  }, [language]);

  // ====================================================
  // REFRESH SELECTED FAQ WHEN LANGUAGE CHANGES
  // ====================================================

  useEffect(() => {
    if (selectedFAQ?.faq_generated_id) {
      getFAQByGeneratedId(selectedFAQ.faq_generated_id);
    }
  }, [language]);

  // ====================================================
  // HANDLE FAQ INPUT CHANGE
  // ====================================================

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

  // ====================================================
  // RESET FAQ FORM
  // ====================================================

  const resetFAQForm = () => {
    setFaq({
      ...EMPTY_FAQ,
    });

    setFaqErrors({});

    setFaqQuestionErrors({});

    setSelectedFAQ(null);
  };

  // ====================================================
  // SET SELECTED FAQ
  // ====================================================

  const setSelectedFAQData = (selected: FAQ) => {
    setSelectedFAQ(selected);

    setFaq({
      faq_default_question:
        typeof selected.faq_default_question === "string"
          ? selected.faq_default_question
          : (selected.faq_default_question?.en ?? ""),

      faq_created_by: selected.faq_created_by,
    });

    setFaqErrors({});

    setFaqQuestionErrors({});
  };

  // ====================================================
  // GET ALL FAQS
  // ====================================================

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

  // ====================================================
  // GET FAQ BY GENERATED ID
  // ====================================================

  const getFAQByGeneratedId = async (
    faq_generated_id: string,
  ): Promise<void> => {
    try {
      setLoading(true);

      const response = await FAQService.getFAQByGeneratedId(
        faq_generated_id,
        language,
      );

      if (response.success && response.data) {
        setSelectedFAQData(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch FAQ.", error);
    } finally {
      setLoading(false);
    }
  };

  // ====================================================
  // CREATE FAQ
  //
  // Root FAQ only contains:
  //
  // faq_default_question
  // faq_created_by
  //
  // No SEO metadata here.
  // ====================================================

  const createFAQ = async (): Promise<boolean> => {
    try {
      // ==================================================
      // VALIDATE ROOT FAQ
      // ==================================================

      const validationErrors = validateFAQ(faq);

      if (Object.keys(validationErrors).length > 0) {
        setFaqErrors(validationErrors);

        return false;
      }

      // ==================================================
      // CLEAR OLD ERRORS
      // ==================================================

      setFaqErrors({});

      // ==================================================
      // API REQUEST
      // ==================================================

      setLoading(true);

      const response = await FAQService.createFAQ(faq);

      // ==================================================
      // SUCCESS
      // ==================================================

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

  // ====================================================
  // UPDATE FAQ
  //
  // Root FAQ only updates the default question.
  // ====================================================

  const updateFAQ = async (
    faq_generated_id: string,
    payload: UpdateFAQPayload,
  ): Promise<boolean> => {
    try {
      // ==================================================
      // VALIDATE ROOT FAQ UPDATE
      // ==================================================

      const validationErrors: FAQValidationErrors = {};

      if (payload.faq_default_question !== undefined) {
        const question = payload.faq_default_question.trim();

        if (!question) {
          validationErrors.faq_default_question = "FAQ question is required.";
        } else if (question.length < 10) {
          validationErrors.faq_default_question =
            "FAQ question must be at least 10 characters.";
        }
      }

      // ==================================================
      // STOP IF INVALID
      // ==================================================

      if (Object.keys(validationErrors).length > 0) {
        setFaqErrors(validationErrors);

        return false;
      }

      // ==================================================
      // CLEAR OLD ERRORS
      // ==================================================

      setFaqErrors({});

      // ==================================================
      // API REQUEST
      // ==================================================

      setLoading(true);

      const response = await FAQService.updateFAQ(faq_generated_id, payload);

      // ==================================================
      // SUCCESS
      // ==================================================

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

  // ====================================================
  // DELETE FAQ
  // ====================================================

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

  // ====================================================
  // ADD FAQ CATEGORY
  // ====================================================

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

  // ====================================================
  // UPDATE FAQ CATEGORY
  // ====================================================

  const updateFAQCategory = async (
    faq_generated_id: string,
    category_generated_id: string,
    topic_name: string,
  ): Promise<boolean> => {
    try {
      setLoading(true);

      const response = await FAQService.updateFAQCategory(
        faq_generated_id,
        category_generated_id,
        topic_name,
      );

      if (response.success) {
        await getFAQByGeneratedId(faq_generated_id);

        return true;
      }

      return false;
    } catch (error) {
      console.error("Failed to update FAQ Category.", error);

      return false;
    } finally {
      setLoading(false);
    }
  };

  // ====================================================
  // DELETE FAQ CATEGORY
  // ====================================================

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

  // ====================================================
  // VALIDATE QUESTION
  //
  // Question validation includes:
  //
  // - question_text
  // - meta_title
  // - meta_description
  // - meta_keywords
  // ====================================================

  const validateQuestion = (
    payload: CreateFAQQuestionPayload,
  ): FAQQuestionValidationErrors => {
    return validateFAQQuestion(payload);
  };

  // ====================================================
  // ADD QUESTION TO CATEGORY
  //
  // IMPORTANT:
  //
  // Each question owns its own SEO metadata.
  // ====================================================

  const addCategoryQuestion = async (
    faq_generated_id: string,
    category_generated_id: string,
    payload: CreateFAQQuestionPayload,
  ): Promise<boolean> => {
    try {
      // ==================================================
      // VALIDATE QUESTION
      // ==================================================

      const validationErrors = validateFAQQuestion(payload);

      if (Object.keys(validationErrors).length > 0) {
        setFaqQuestionErrors(validationErrors);

        return false;
      }

      // ==================================================
      // CLEAR OLD QUESTION ERRORS
      // ==================================================

      setFaqQuestionErrors({});

      // ==================================================
      // API REQUEST
      // ==================================================

      setLoading(true);

      const response = await FAQService.addCategoryQuestion(
        faq_generated_id,
        category_generated_id,
        payload,
      );

      // ==================================================
      // SUCCESS
      // ==================================================

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

  // ====================================================
  // UPDATE CATEGORY QUESTION
  //
  // IMPORTANT:
  //
  // This is a PARTIAL update.
  //
  // Only values supplied in payload are validated.
  //
  // Metadata belongs to this question.
  // ====================================================

  const updateCategoryQuestion = async (
    faq_generated_id: string,
    category_generated_id: string,
    question_generated_id: string,
    payload: UpdateFAQQuestionPayload,
  ): Promise<boolean> => {
    try {
      // ==================================================
      // VALIDATE PARTIAL QUESTION UPDATE
      // ==================================================

      const validationErrors: FAQQuestionValidationErrors = {};

      // ==================================================
      // QUESTION TEXT
      // ==================================================

      if (payload.question_text !== undefined) {
        const questionText = payload.question_text.trim();

        if (!questionText) {
          validationErrors.question_text = "Question is required.";
        } else if (questionText.length < 3) {
          validationErrors.question_text =
            "Question must be at least 3 characters.";
        }
      }

      // ==================================================
      // META TITLE
      // ==================================================

      if (payload.meta_title !== undefined) {
        const metaTitle = payload.meta_title.trim();

        if (metaTitle.length > 150) {
          validationErrors.meta_title =
            "Meta title must not exceed 150 characters.";
        }
      }

      // ==================================================
      // META DESCRIPTION
      // ==================================================

      if (payload.meta_description !== undefined) {
        const metaDescription = payload.meta_description.trim();

        if (metaDescription.length > 300) {
          validationErrors.meta_description =
            "Meta description must not exceed 300 characters.";
        }
      }

      // ==================================================
      // META KEYWORDS
      // ==================================================

      if (payload.meta_keywords !== undefined) {
        const metaKeywords = payload.meta_keywords.trim();

        if (metaKeywords.length > 500) {
          validationErrors.meta_keywords =
            "Meta keywords must not exceed 500 characters.";
        }
      }

      // ==================================================
      // STOP IF INVALID
      // ==================================================

      if (Object.keys(validationErrors).length > 0) {
        setFaqQuestionErrors(validationErrors);

        return false;
      }

      // ==================================================
      // CLEAR OLD QUESTION ERRORS
      // ==================================================

      setFaqQuestionErrors({});

      // ==================================================
      // API REQUEST
      // ==================================================

      setLoading(true);

      const response = await FAQService.updateCategoryQuestion(
        faq_generated_id,
        category_generated_id,
        question_generated_id,
        payload,
      );

      // ==================================================
      // SUCCESS
      // ==================================================

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

  // ====================================================
  // DELETE CATEGORY QUESTION
  // ====================================================

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

  // ====================================================
  // VALIDATE ANSWER
  // ====================================================

  const validateAnswer = (
    payload: CreateFAQAnswerPayload,
  ): FAQAnswerValidationErrors => {
    return validateFAQAnswer(payload);
  };

  // ====================================================
  // ADD ANSWER TO QUESTION
  // ====================================================

  const addCategoryAnswer = async (
    faq_generated_id: string,
    category_generated_id: string,
    question_generated_id: string,
    payload: CreateFAQAnswerPayload,
  ): Promise<boolean> => {
    try {
      // ==================================================
      // VALIDATE ANSWER
      // ==================================================

      const validationErrors = validateFAQAnswer(payload);

      if (Object.keys(validationErrors).length > 0) {
        console.error("FAQ answer validation failed:", validationErrors);

        return false;
      }

      // ==================================================
      // SEND REQUEST
      // ==================================================

      setLoading(true);

      const response = await FAQService.addCategoryAnswer(
        faq_generated_id,
        category_generated_id,
        question_generated_id,
        payload,
      );

      // ==================================================
      // REFRESH FAQ
      // ==================================================

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

  // ====================================================
  // UPDATE CATEGORY ANSWER
  // ====================================================

  const updateCategoryAnswer = async (
    faq_generated_id: string,
    category_generated_id: string,
    question_generated_id: string,
    answer_generated_id: string,
    payload: UpdateFAQAnswerPayload,
  ): Promise<boolean> => {
    try {
      // ==================================================
      // VALIDATE ANSWER IF DESCRIPTION IS PROVIDED
      // ==================================================

      if (payload.answer_description !== undefined) {
        const validationErrors = validateFAQAnswer({
          answer_description: payload.answer_description,
        });

        if (Object.keys(validationErrors).length > 0) {
          console.error("FAQ answer validation failed:", validationErrors);

          return false;
        }
      }

      // ==================================================
      // SEND REQUEST
      // ==================================================

      setLoading(true);

      const response = await FAQService.updateCategoryAnswer(
        faq_generated_id,
        category_generated_id,
        question_generated_id,
        answer_generated_id,
        payload,
      );

      // ==================================================
      // REFRESH FAQ
      // ==================================================

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

  // ====================================================
  // DELETE CATEGORY ANSWER
  // ====================================================

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

  // ====================================================
  // CONTEXT VALUE
  // ====================================================

  const value: FAQContextType = {
    // ==================================================
    // STATE
    // ==================================================

    loading,

    faqs,

    faq,

    faqErrors,

    faqQuestionErrors,

    selectedFAQ,

    language,

    setLanguage,

    searchFAQs,

    faqSearchLoading,

    // ==================================================
    // FAQ
    // ==================================================

    setSelectedFAQData,

    handleFAQChange,

    resetFAQForm,

    getAllFAQs,

    getFAQByGeneratedId,

    createFAQ,

    updateFAQ,

    deleteFAQ,

    // ==================================================
    // CATEGORY
    // ==================================================

    addFAQCategory,

    updateFAQCategory,

    deleteFAQCategory,

    // ==================================================
    // QUESTION
    // ==================================================

    addCategoryQuestion,

    updateCategoryQuestion,

    deleteCategoryQuestion,

    validateQuestion,

    // ==================================================
    // ANSWER
    // ==================================================

    addCategoryAnswer,

    updateCategoryAnswer,

    deleteCategoryAnswer,

    // ==================================================
    // VALIDATION
    // ==================================================

    validateAnswer,
  };

  // ====================================================
  // PROVIDER
  // ====================================================

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
