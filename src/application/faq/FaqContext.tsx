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
  FAQSubTopic,
  CreateFAQPayload,
  UpdateFAQPayload,
  CreateFAQSubTopicPayload,
  UpdateFAQSubTopicPayload,
  CreateFAQContentPayload,
  UpdateFAQContentPayload,
} from "./faq.types";

// ======================================================
// Validation
// ======================================================

import {
  validateFAQ,
  validateFAQSubTopic,
  FAQValidationErrors,
  FAQSubTopicValidationErrors,
} from "./faq.validation";

// ======================================================
// EMPTY FAQ
// ======================================================

const EMPTY_FAQ: CreateFAQPayload = {
  faq_default_question: "",
  faq_subtopics: [],
  faq_contents: [],
  isActiveFAQ: true,
  faq_created_by: "admin",
};

// ======================================================
// EMPTY SUBTOPIC
// ======================================================

const EMPTY_SUBTOPIC: CreateFAQSubTopicPayload = {
  faq_subtopic_title: "",
  faq_subtopics: [],
  faq_contents: [],
  faq_subtopic_created_by: "admin",
};

// ======================================================
// CONTEXT TYPE
// ======================================================

interface FAQContextType {
  loading: boolean;
  faqs: FAQ[];
  faq: CreateFAQPayload;
  subtopic: CreateFAQSubTopicPayload;
  faqErrors: FAQValidationErrors;
  subtopicErrors: FAQSubTopicValidationErrors;
  selectedFAQ: FAQ | null;
  selectedSubTopic: FAQSubTopic | null;
  parentSubTopicId: string | null;

  setSelectedFAQData: (faq: FAQ) => void;
  setSelectedSubTopicData: (subtopic: FAQSubTopic) => void;
  setParentSubTopicId: (id: string | null) => void;

  handleFAQChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  handleSubTopicChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;

  resetFAQForm: () => void;
  resetSubTopicForm: () => void;

  getAllFAQs: () => Promise<void>;
  getFAQByGeneratedId: (faq_generated_id: string) => Promise<void>;

  createFAQ: () => Promise<boolean>;
  updateFAQ: (
    faq_generated_id: string,
    payload: UpdateFAQPayload,
  ) => Promise<boolean>;
  deleteFAQ: (faq_generated_id: string) => Promise<boolean>;

  addFAQSubTopic: (
    faq_generated_id: string,
    parent_subtopic_generated_id: string | null,
    subtopic_data: CreateFAQSubTopicPayload,
  ) => Promise<boolean>;
  updateFAQSubTopic: (
    faq_generated_id: string,
    faq_subtopic_generated_id: string,
    subtopic_data: UpdateFAQSubTopicPayload,
  ) => Promise<boolean>;
  deleteFAQSubTopic: (
    faq_generated_id: string,
    faq_subtopic_generated_id: string,
  ) => Promise<boolean>;

  // FAQ Content methods
  addFAQContent: (
    faq_generated_id: string,
    faq_subtopic_generated_id: string | null,
    content_data: CreateFAQContentPayload,
  ) => Promise<boolean>;
  updateFAQContent: (
    faq_generated_id: string,
    faq_content_generated_id: string,
    content_data: UpdateFAQContentPayload,
  ) => Promise<boolean>;
  deleteFAQContent: (
    faq_generated_id: string,
    faq_content_generated_id: string,
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
  // ======================================================
  // LOADING
  // ======================================================

  const [loading, setLoading] = useState(false);

  // ======================================================
  // FAQS
  // ======================================================

  const [faqs, setFaqs] = useState<FAQ[]>([]);

  // ======================================================
  // FAQ FORM
  // ======================================================

  const [faq, setFaq] = useState<CreateFAQPayload>(EMPTY_FAQ);

  // ======================================================
  // SUBTOPIC FORM
  // ======================================================

  const [subtopic, setSubtopic] =
    useState<CreateFAQSubTopicPayload>(EMPTY_SUBTOPIC);

  // ======================================================
  // FAQ VALIDATION ERRORS
  // ======================================================

  const [faqErrors, setFaqErrors] = useState<FAQValidationErrors>({});

  // ======================================================
  // SUBTOPIC VALIDATION ERRORS
  // ======================================================

  const [subtopicErrors, setSubtopicErrors] =
    useState<FAQSubTopicValidationErrors>({});

  // ======================================================
  // SELECTED FAQ
  // ======================================================

  const [selectedFAQ, setSelectedFAQ] = useState<FAQ | null>(null);

  // ======================================================
  // SELECTED SUBTOPIC
  // ======================================================

  const [selectedSubTopic, setSelectedSubTopic] = useState<FAQSubTopic | null>(
    null,
  );

  // ======================================================
  // PARENT SUBTOPIC ID (for adding nested subtopics)
  // ======================================================

  const [parentSubTopicId, setParentSubTopicId] = useState<string | null>(null);

  // ======================================================
  // INITIAL LOAD
  // ======================================================

  useEffect(() => {
    getAllFAQs();
  }, []);

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
  // HANDLE SUBTOPIC INPUT CHANGE
  // ======================================================

  const handleSubTopicChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setSubtopic((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (subtopicErrors[name as keyof FAQSubTopicValidationErrors]) {
      setSubtopicErrors((prev) => ({
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
  // RESET SUBTOPIC FORM
  // ======================================================

  const resetSubTopicForm = () => {
    setSubtopic(EMPTY_SUBTOPIC);
    setSubtopicErrors({});
    setSelectedSubTopic(null);
    setParentSubTopicId(null);
  };

  // ======================================================
  // SET SELECTED FAQ
  // ======================================================

  const setSelectedFAQData = (selected: FAQ) => {
    setSelectedFAQ(selected);

    setFaq({
      faq_default_question: selected.faq_default_question,
      faq_subtopics: selected.faq_subtopics,
      faq_contents: selected.faq_contents,
      isActiveFAQ: selected.isActiveFAQ,
      faq_created_by: selected.faq_created_by,
    });

    setFaqErrors({});
  };

  // ======================================================
  // SET SELECTED SUBTOPIC
  // ======================================================

  const setSelectedSubTopicData = (selected: FAQSubTopic) => {
    setSelectedSubTopic(selected);

    setSubtopic({
      faq_subtopic_title: selected.faq_subtopic_title,
      faq_subtopics: selected.faq_subtopics || [],
      faq_contents: selected.faq_contents || [],
      faq_subtopic_created_by: selected.faq_subtopic_created_by,
    });

    setSubtopicErrors({});
  };

  // ======================================================
  // GET ALL FAQS
  // ======================================================

  const getAllFAQs = async (): Promise<void> => {
    try {
      setLoading(true);

      const response = await FAQService.getAllFAQs();

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

      const response = await FAQService.getFAQByGeneratedId(faq_generated_id);

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
  // ADD FAQ SUBTOPIC
  // ======================================================

  const addFAQSubTopic = async (
    faq_generated_id: string,
    parent_subtopic_generated_id: string | null,
    subtopic_data: CreateFAQSubTopicPayload,
  ): Promise<boolean> => {
    try {
      const validationErrors = validateFAQSubTopic(subtopic_data);

      if (Object.keys(validationErrors).length > 0) {
        setSubtopicErrors(validationErrors);
        return false;
      }

      setLoading(true);

      const response = await FAQService.addFAQSubTopic(
        faq_generated_id,
        parent_subtopic_generated_id,
        subtopic_data,
      );

      if (response.success) {
        await getFAQByGeneratedId(faq_generated_id);
        resetSubTopicForm();
        return true;
      }

      return false;
    } catch (error) {
      console.error("Failed to add FAQ SubTopic.", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // UPDATE FAQ SUBTOPIC
  // ======================================================

  const updateFAQSubTopic = async (
    faq_generated_id: string,
    faq_subtopic_generated_id: string,
    subtopic_data: UpdateFAQSubTopicPayload,
  ): Promise<boolean> => {
    try {
      setLoading(true);

      const response = await FAQService.updateFAQSubTopic(
        faq_generated_id,
        faq_subtopic_generated_id,
        subtopic_data,
      );

      if (response.success) {
        await getFAQByGeneratedId(faq_generated_id);
        resetSubTopicForm();
        return true;
      }

      return false;
    } catch (error) {
      console.error("Failed to update FAQ SubTopic.", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // DELETE FAQ SUBTOPIC
  // ======================================================

  const deleteFAQSubTopic = async (
    faq_generated_id: string,
    faq_subtopic_generated_id: string,
  ): Promise<boolean> => {
    try {
      setLoading(true);

      const response = await FAQService.deleteFAQSubTopic(
        faq_generated_id,
        faq_subtopic_generated_id,
      );

      if (response.success) {
        await getFAQByGeneratedId(faq_generated_id);
        resetSubTopicForm();
        return true;
      }

      return false;
    } catch (error) {
      console.error("Failed to delete FAQ SubTopic.", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // ADD FAQ CONTENT
  // ======================================================

  const addFAQContent = async (
    faq_generated_id: string,
    faq_subtopic_generated_id: string | null,
    content_data: CreateFAQContentPayload,
  ): Promise<boolean> => {
    try {
      setLoading(true);

      const response = await FAQService.addFAQContent(
        faq_generated_id,
        faq_subtopic_generated_id,
        content_data,
      );

      if (response.success) {
        await getFAQByGeneratedId(faq_generated_id);
        return true;
      }

      return false;
    } catch (error) {
      console.error("Failed to add FAQ Content.", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // UPDATE FAQ CONTENT
  // ======================================================

  const updateFAQContent = async (
    faq_generated_id: string,
    faq_content_generated_id: string,
    content_data: UpdateFAQContentPayload,
  ): Promise<boolean> => {
    try {
      setLoading(true);

      const response = await FAQService.updateFAQContent(
        faq_generated_id,
        faq_content_generated_id,
        content_data,
      );

      if (response.success) {
        await getFAQByGeneratedId(faq_generated_id);
        return true;
      }

      return false;
    } catch (error) {
      console.error("Failed to update FAQ Content.", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // DELETE FAQ CONTENT
  // ======================================================

  const deleteFAQContent = async (
    faq_generated_id: string,
    faq_content_generated_id: string,
  ): Promise<boolean> => {
    try {
      setLoading(true);

      const response = await FAQService.deleteFAQContent(
        faq_generated_id,
        faq_content_generated_id,
      );

      if (response.success) {
        await getFAQByGeneratedId(faq_generated_id);
        return true;
      }

      return false;
    } catch (error) {
      console.error("Failed to delete FAQ Content.", error);
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
    subtopic,
    faqErrors,
    subtopicErrors,
    selectedFAQ,
    selectedSubTopic,
    parentSubTopicId,

    setSelectedFAQData,
    setSelectedSubTopicData,
    setParentSubTopicId,

    handleFAQChange,
    handleSubTopicChange,

    resetFAQForm,
    resetSubTopicForm,

    getAllFAQs,
    getFAQByGeneratedId,

    createFAQ,
    updateFAQ,
    deleteFAQ,

    addFAQSubTopic,
    updateFAQSubTopic,
    deleteFAQSubTopic,

    // FAQ Content methods
    addFAQContent,
    updateFAQContent,
    deleteFAQContent,
  };

  // ======================================================
  // PROVIDER
  // ======================================================

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
