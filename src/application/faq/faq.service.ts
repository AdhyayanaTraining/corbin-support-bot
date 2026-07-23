// faq.service.ts

import axiosClient from "@/src/infrastructure/api/axiosClient";

import {
  CreateFAQPayload,
  UpdateFAQPayload,
  CreateFAQSubTopicPayload,
  UpdateFAQSubTopicPayload,
  CreateFAQContentPayload,
  UpdateFAQContentPayload,
} from "./faq.types";

class FAQService {
  // =====================================================
  // CREATE FAQ
  // =====================================================

  async createFAQ(payload: CreateFAQPayload) {
    const response = await axiosClient.post("/create-faq", {
      faq_data: payload,
    });

    return response.data;
  }

  // =====================================================
  // GET ALL FAQS
  // =====================================================

  async getAllFAQs() {
    const response = await axiosClient.get("/get-all-faqs");

    return response.data;
  }

  // =====================================================
  // GET FAQ BY GENERATED ID
  // =====================================================

  async getFAQByGeneratedId(faq_generated_id: string) {
    const response = await axiosClient.post("/get-faq-by-generated-id", {
      faq_generated_id,
    });

    return response.data;
  }

  // =====================================================
  // UPDATE FAQ
  // =====================================================

  async updateFAQ(faq_generated_id: string, payload: UpdateFAQPayload) {
    const response = await axiosClient.put("/update-faq", {
      faq_generated_id,
      faq_data: payload,
    });

    return response.data;
  }

  // =====================================================
  // DELETE FAQ
  // =====================================================

  async deleteFAQ(faq_generated_id: string) {
    const response = await axiosClient.delete("/delete-faq", {
      data: {
        faq_generated_id,
      },
    });

    return response.data;
  }

  // =====================================================
  // ADD FAQ SUBTOPIC
  // =====================================================

  async addFAQSubTopic(
    faq_generated_id: string,
    parent_subtopic_generated_id: string | null,
    subtopic_data: CreateFAQSubTopicPayload,
  ) {
    const response = await axiosClient.post("/add-faq-subtopic", {
      faq_generated_id,
      parent_subtopic_generated_id,
      subtopic_data,
    });

    return response.data;
  }

  // =====================================================
  // UPDATE FAQ SUBTOPIC
  // =====================================================

  async updateFAQSubTopic(
    faq_generated_id: string,
    faq_subtopic_generated_id: string,
    subtopic_data: UpdateFAQSubTopicPayload,
  ) {
    const response = await axiosClient.put("/update-faq-subtopic", {
      faq_generated_id,
      faq_subtopic_generated_id,
      subtopic_data,
    });

    return response.data;
  }

  // =====================================================
  // DELETE FAQ SUBTOPIC
  // =====================================================

  async deleteFAQSubTopic(
    faq_generated_id: string,
    faq_subtopic_generated_id: string,
  ) {
    const response = await axiosClient.delete("/delete-faq-subtopic", {
      data: {
        faq_generated_id,
        faq_subtopic_generated_id,
      },
    });

    return response.data;
  }

  // =====================================================
  // ADD FAQ CONTENT
  // =====================================================

  async addFAQContent(
    faq_generated_id: string,
    faq_subtopic_generated_id: string | null,
    content_data: CreateFAQContentPayload,
  ) {
    const response = await axiosClient.post("/add-faq-content", {
      faq_generated_id,
      faq_subtopic_generated_id,
      content_data,
    });

    return response.data;
  }

  // =====================================================
  // UPDATE FAQ CONTENT
  // =====================================================

  async updateFAQContent(
    faq_generated_id: string,
    faq_content_generated_id: string,
    content_data: UpdateFAQContentPayload,
  ) {
    const response = await axiosClient.put("/update-faq-content", {
      faq_generated_id,
      faq_content_generated_id,
      content_data,
    });

    return response.data;
  }

  // =====================================================
  // DELETE FAQ CONTENT
  // =====================================================

  async deleteFAQContent(
    faq_generated_id: string,
    faq_content_generated_id: string,
  ) {
    try {
      const response = await axiosClient.delete("/delete-faq-content", {
        data: {
          faq_generated_id,
          faq_content_generated_id,
        },
      });

      return response.data;
    } catch (error) {
      console.error("deleteFAQContent error:", error);
      throw error;
    }
  }
}

export default new FAQService();
