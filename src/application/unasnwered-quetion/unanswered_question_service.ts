import axiosClient from "@/src/infrastructure/api/axiosClient";

import {
  CreateUnansweredQuestionPayload,
  UnansweredQuestionResponse,
} from "./unanswered_question_type";

class UnansweredQuestionService {
  // ======================================================
  // CREATE UNANSWERED QUESTION
  // ======================================================

  static async createUnansweredQuestion(
    payload: CreateUnansweredQuestionPayload,
  ): Promise<UnansweredQuestionResponse> {
    const response = await axiosClient.post("/unanswered-questions", payload);

    return response.data;
  }
}

export default UnansweredQuestionService;
