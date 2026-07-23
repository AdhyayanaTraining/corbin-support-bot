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

import TopicService from "./topic.service";

// ======================================================
// Types
// ======================================================

import { Topic, CreateTopicPayload, UpdateTopicPayload } from "./topic.types";

// ======================================================
// Validation
// ======================================================

import { validateTopic, TopicValidationErrors } from "./topic.validation";

// ======================================================
// EMPTY TOPIC
// ======================================================

const EMPTY_TOPIC: CreateTopicPayload = {
  topic_name: "",
  topic_description: "",
  isActiveTopic: true,
  topic_created_by: "admin",
};

// ======================================================
// CONTEXT TYPE
// ======================================================

interface TopicContextType {
  loading: boolean;

  topics: Topic[];

  topic: CreateTopicPayload;

  errors: TopicValidationErrors;

  selectedTopic: Topic | null;

  setSelectedTopicData: (topic: Topic) => void;

  handleChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;

  resetForm: () => void;

  getAllTopics: () => Promise<void>;

  getTopicByGeneratedId: (topic_generated_id: string) => Promise<void>;

  createTopic: () => Promise<boolean>;

  updateTopic: (
    topic_generated_id: string,
    payload: UpdateTopicPayload,
  ) => Promise<boolean>;

  deleteTopic: (topic_generated_id: string) => Promise<boolean>;
}

// ======================================================
// CONTEXT
// ======================================================

const TopicContext = createContext<TopicContextType | undefined>(undefined);

// ======================================================
// PROVIDER
// ======================================================

export const TopicProvider = ({ children }: { children: ReactNode }) => {
  // ======================================================
  // LOADING
  // ======================================================

  const [loading, setLoading] = useState(false);

  // ======================================================
  // TOPICS
  // ======================================================

  const [topics, setTopics] = useState<Topic[]>([]);

  // ======================================================
  // TOPIC FORM
  // ======================================================

  const [topic, setTopic] = useState<CreateTopicPayload>(EMPTY_TOPIC);

  // ======================================================
  // VALIDATION ERRORS
  // ======================================================

  const [errors, setErrors] = useState<TopicValidationErrors>({});

  // ======================================================
  // SELECTED TOPIC
  // ======================================================

  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

  // ======================================================
  // INITIAL LOAD
  // ======================================================

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    getAllTopics();
  }, []);

  // ======================================================
  // HANDLE INPUT CHANGE
  // ======================================================

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setTopic((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof TopicValidationErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // ======================================================
  // RESET FORM
  // ======================================================

  const resetForm = () => {
    setTopic(EMPTY_TOPIC);

    setErrors({});

    setSelectedTopic(null);
  };

  // ======================================================
  // SET SELECTED TOPIC
  // ======================================================

  const setSelectedTopicData = (selected: Topic) => {
    setSelectedTopic(selected);

    setTopic({
      topic_name: selected.topic_name,
      topic_description: selected.topic_description,
      isActiveTopic: selected.isActiveTopic,
      topic_created_by: selected.topic_created_by,
    });

    setErrors({});
  };
  // ======================================================
  // GET ALL TOPICS
  // ======================================================

  const getAllTopics = async (): Promise<void> => {
    try {
      setLoading(true);

      const response = await TopicService.getAllTopics();

      if (response.success) {
        setTopics(response.data ?? []);
      }
    } catch (error) {
      console.error("Failed to fetch topics.", error);
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // GET TOPIC BY GENERATED ID
  // ======================================================

  const getTopicByGeneratedId = async (
    topic_generated_id: string,
  ): Promise<void> => {
    try {
      setLoading(true);

      const response =
        await TopicService.getTopicByGeneratedId(topic_generated_id);

      if (response.success) {
        setSelectedTopicData(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch topic.", error);
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // CREATE TOPIC
  // ======================================================

  const createTopic = async (): Promise<boolean> => {
    try {
      const validationErrors = validateTopic(topic);

      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return false;
      }

      setLoading(true);

      const response = await TopicService.createTopic(topic);

      if (response.success) {
        await getAllTopics();

        resetForm();

        return true;
      }

      return false;
    } catch (error) {
      console.error("Failed to create topic.", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // UPDATE TOPIC
  // ======================================================

  const updateTopic = async (
    topic_generated_id: string,
    payload: UpdateTopicPayload,
  ): Promise<boolean> => {
    try {
      setLoading(true);

      const response = await TopicService.updateTopic(
        topic_generated_id,
        payload,
      );

      if (response.success) {
        await getAllTopics();

        resetForm();

        return true;
      }

      return false;
    } catch (error) {
      console.error("Failed to update topic.", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // DELETE TOPIC
  // ======================================================

  const deleteTopic = async (topic_generated_id: string): Promise<boolean> => {
    try {
      setLoading(true);

      const response = await TopicService.deleteTopic(topic_generated_id);

      if (response.success) {
        await getAllTopics();

        resetForm();

        return true;
      }

      return false;
    } catch (error) {
      console.error("Failed to delete topic.", error);
      return false;
    } finally {
      setLoading(false);
    }
  };
  // ======================================================
  // CONTEXT VALUE
  // ======================================================

  const value: TopicContextType = {
    loading,

    topics,

    topic,

    errors,

    selectedTopic,

    setSelectedTopicData,

    handleChange,

    resetForm,

    getAllTopics,

    getTopicByGeneratedId,

    createTopic,

    updateTopic,

    deleteTopic,
  };

  // ======================================================
  // PROVIDER
  // ======================================================

  return (
    <TopicContext.Provider value={value}>{children}</TopicContext.Provider>
  );
};

// ======================================================
// HOOK
// ======================================================

export const useTopic = () => {
  const context = useContext(TopicContext);

  if (!context) {
    throw new Error("useTopic must be used within TopicProvider");
  }

  return context;
};
