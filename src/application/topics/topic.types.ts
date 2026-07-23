// ======================================================
// Topic
// ======================================================

export interface Topic {
  topic_generated_id: string;

  topic_name: string;

  topic_description: string;

  isActiveTopic: boolean;

  topic_created_by: string;

  topic_created_at: string;

  topic_updated_by?: string;

  topic_updated_at?: string;
}

// ======================================================
// Create Topic Payload
// ======================================================

export interface CreateTopicPayload {
  topic_name: string;

  topic_description: string;

  isActiveTopic: boolean;

  topic_created_by: string;
}

// ======================================================
// Update Topic Payload
// ======================================================

export interface UpdateTopicPayload {
  topic_generated_id: string;

  topic_name: string;

  topic_description: string;

  isActiveTopic: boolean;

  topic_updated_by: string;
}

// ======================================================
// Empty Topic
// ======================================================

export const EMPTY_TOPIC: CreateTopicPayload = {
  topic_name: "",
  topic_description: "",
  isActiveTopic: true,
  topic_created_by: "admin",
};
