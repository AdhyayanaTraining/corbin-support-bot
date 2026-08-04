// ======================================================
// FAQ Service - Endpoints match router exactly
// ======================================================

import axiosClient from "@/src/infrastructure/api/axiosClient";

import {
  CreateFAQPayload,
  UpdateFAQPayload,
  CreateFAQQuestionPayload,
  UpdateFAQQuestionPayload,
  CreateFAQAnswerPayload,
  UpdateFAQAnswerPayload,
} from "./faq.types";

class FAQService {
  // =====================================================
  // FAQ (Top Question)
  // =====================================================

  async createFAQ(payload: CreateFAQPayload) {
    const response = await axiosClient.post("/faq/create", payload);
    return response.data;
  }

  async getAllFAQs(language: string = "en") {
    const response = await axiosClient.get("/faq/all", {
      params: {
        language,
      },
    });

    return response.data;
  }

  async getFAQByGeneratedId(faq_generated_id: string, language: string = "en") {
    const response = await axiosClient.post("/faq/get-by-id", {
      faq_generated_id,
      language,
    });

    return response.data;
  }

  async updateFAQ(faq_generated_id: string, payload: UpdateFAQPayload) {
    const response = await axiosClient.put("/faq/update", {
      faq_generated_id,
      faq_default_question: payload.faq_default_question,
    });
    return response.data;
  }

  async deleteFAQ(faq_generated_id: string) {
    const response = await axiosClient.delete("/faq/delete", {
      data: { faq_generated_id },
    });
    return response.data;
  }

  // =====================================================
  // FAQ Categories (Topics linked to FAQ)
  // =====================================================

  async addFAQCategory(
    faq_generated_id: string,
    topic_generated_id: string,
    topic_name: string,
  ) {
    const response = await axiosClient.post("/faq/category/add", {
      faq_generated_id,
      topic_generated_id,
      topic_name,
    });
    return response.data;
  }

  async updateFAQCategory(
    faq_generated_id: string,
    category_generated_id: string,
    topic_name: string,
  ) {
    const response = await axiosClient.put("/faq/category/update", {
      faq_generated_id,
      category_generated_id,
      topic_name,
    });
    return response.data;
  }

  async deleteFAQCategory(
    faq_generated_id: string,
    category_generated_id: string,
  ) {
    const response = await axiosClient.delete("/faq/category/delete", {
      data: { faq_generated_id, category_generated_id },
    });
    return response.data;
  }

  // =====================================================
  // Category Questions
  // =====================================================

  async addCategoryQuestion(
    faq_generated_id: string,
    category_generated_id: string,
    payload: CreateFAQQuestionPayload,
  ) {
    const response = await axiosClient.post("/faq/category/question/add", {
      faq_generated_id,
      category_generated_id,
      question_text: payload.question_text,
    });
    return response.data;
  }

  async updateCategoryQuestion(
    faq_generated_id: string,
    category_generated_id: string,
    question_generated_id: string,
    payload: UpdateFAQQuestionPayload,
  ) {
    const response = await axiosClient.put("/faq/category/question/update", {
      faq_generated_id,
      category_generated_id,
      question_generated_id,
      question_text: payload.question_text,
    });
    return response.data;
  }

  async deleteCategoryQuestion(
    faq_generated_id: string,
    category_generated_id: string,
    question_generated_id: string,
  ) {
    const response = await axiosClient.delete("/faq/category/question/delete", {
      data: { faq_generated_id, category_generated_id, question_generated_id },
    });
    return response.data;
  }

  // =====================================================
  // Category Answers
  // =====================================================

  async addCategoryAnswer(
    faq_generated_id: string,
    category_generated_id: string,
    question_generated_id: string,
    payload: CreateFAQAnswerPayload,
  ) {
    const response = await axiosClient.post("/faq/category/answer/add", {
      faq_generated_id,
      category_generated_id,
      question_generated_id,
      answer_text: payload.answer_text,
    });
    return response.data;
  }

  async updateCategoryAnswer(
    faq_generated_id: string,
    category_generated_id: string,
    question_generated_id: string,
    answer_generated_id: string,
    payload: UpdateFAQAnswerPayload,
  ) {
    const response = await axiosClient.put("/faq/category/answer/update", {
      faq_generated_id,
      category_generated_id,
      question_generated_id,
      answer_generated_id,
      answer_text: payload.answer_text,
    });
    return response.data;
  }

  async deleteCategoryAnswer(
    faq_generated_id: string,
    category_generated_id: string,
    question_generated_id: string,
    answer_generated_id: string,
  ) {
    const response = await axiosClient.delete("/faq/category/answer/delete", {
      data: {
        faq_generated_id,
        category_generated_id,
        question_generated_id,
        answer_generated_id,
      },
    });
    return response.data;
  }
}

export default new FAQService();
