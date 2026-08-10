import { CreateTopicPayload } from "./topic.types";

// ======================================================
// VALIDATION ERROR
// ======================================================

export interface TopicValidationErrors {
  topic_name?: string;

  topic_description?: string;

  topic_expert_name?: string;

  topic_expert_email?: string;
}

// ======================================================
// VALIDATE TOPIC
// ======================================================

export function validateTopic(
  topic: CreateTopicPayload,
): TopicValidationErrors {
  const errors: TopicValidationErrors = {};

  // ======================================================
  // TOPIC NAME
  // ======================================================

  if (!topic.topic_name.trim()) {
    errors.topic_name = "Topic name is required.";
  } else if (topic.topic_name.trim().length < 3) {
    errors.topic_name = "Topic name must be at least 3 characters.";
  }

  // ======================================================
  // TOPIC DESCRIPTION
  // ======================================================

  if (!topic.topic_description.trim()) {
    errors.topic_description = "Topic description is required.";
  } else if (topic.topic_description.trim().length < 10) {
    errors.topic_description =
      "Topic description must be at least 10 characters.";
  }

  // ======================================================
  // TOPIC EXPERT NAME
  // ======================================================

  if (!topic.topic_expert_name.trim()) {
    errors.topic_expert_name = "Topic expert name is required.";
  } else if (topic.topic_expert_name.trim().length < 2) {
    errors.topic_expert_name =
      "Topic expert name must be at least 2 characters.";
  }

  // ======================================================
  // TOPIC EXPERT EMAIL
  // ======================================================

  if (!topic.topic_expert_email.trim()) {
    errors.topic_expert_email = "Topic expert email is required.";
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(topic.topic_expert_email.trim())) {
      errors.topic_expert_email = "Please enter a valid topic expert email.";
    }
  }

  return errors;
}
