import { CreateTopicPayload } from "./topic.types";

// ======================================================
// VALIDATION ERROR
// ======================================================

export interface TopicValidationErrors {
  topic_name?: string;

  topic_description?: string;
}

// ======================================================
// VALIDATE TOPIC
// ======================================================

export function validateTopic(
  topic: CreateTopicPayload,
): TopicValidationErrors {
  const errors: TopicValidationErrors = {};

  // ======================================================
  // Topic Name
  // ======================================================

  if (!topic.topic_name.trim()) {
    errors.topic_name = "Topic name is required.";
  } else if (topic.topic_name.trim().length < 3) {
    errors.topic_name = "Topic name must be at least 3 characters.";
  }

  // ======================================================
  // Topic Description
  // ======================================================

  if (!topic.topic_description.trim()) {
    errors.topic_description = "Topic description is required.";
  } else if (topic.topic_description.trim().length < 10) {
    errors.topic_description =
      "Topic description must be at least 10 characters.";
  }

  return errors;
}
