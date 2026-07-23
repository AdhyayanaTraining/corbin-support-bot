import axiosClient from "@/src/infrastructure/api/axiosClient";

import { CreateTopicPayload, UpdateTopicPayload } from "./topic.types";

class TopicService {
  // =====================================================
  // CREATE TOPIC
  // =====================================================

  async createTopic(payload: CreateTopicPayload) {
    const response = await axiosClient.post("/create-topic", {
      topic_data: payload,
    });

    return response.data;
  }

  // =====================================================
  // GET ALL TOPICS
  // =====================================================

  async getAllTopics() {
    const response = await axiosClient.get("/get-all-topics");

    return response.data;
  }

  // =====================================================
  // GET TOPIC BY GENERATED ID
  // =====================================================

  async getTopicByGeneratedId(topic_generated_id: string) {
    const response = await axiosClient.post("/get-topic-by-generated-id", {
      topic_generated_id,
    });

    return response.data;
  }

  // =====================================================
  // UPDATE TOPIC
  // =====================================================

  async updateTopic(topic_generated_id: string, payload: UpdateTopicPayload) {
    const response = await axiosClient.put("/update-topic", {
      topic_generated_id,
      topic_data: payload,
    });

    return response.data;
  }

  // =====================================================
  // DELETE TOPIC
  // =====================================================

  async deleteTopic(topic_generated_id: string) {
    const response = await axiosClient.delete("/delete-topic", {
      data: {
        topic_generated_id,
      },
    });

    return response.data;
  }
}

export default new TopicService();
