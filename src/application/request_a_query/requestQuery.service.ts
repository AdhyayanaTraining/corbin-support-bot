import axiosClient from "@/src/infrastructure/api/axiosClient";

import {
  CreateRequestQueryPayload,
  RespondToQueryPayload,
  UpdateRequestQueryPayload,
} from "./requestQuery.types";

class RequestQueryService {
  // =====================================================
  // ADD REQUEST QUERY
  // =====================================================

  async addRequestQuery(payload: CreateRequestQueryPayload) {
    const response = await axiosClient.post("/add-request-query", payload);

    return response.data;
  }

  // =====================================================
  // GET ALL REQUEST QUERIES
  // =====================================================

  async getRequestQueries() {
    const response = await axiosClient.get("/get-request-queries");

    return response.data;
  }

  // =====================================================
  // GET REQUEST QUERY BY GENERATED ID
  // =====================================================

  async getRequestQueryByGeneratedId(request_query_generated_id: string) {
    const response = await axiosClient.get(
      `/get-request-query-by-id/${request_query_generated_id}`,
    );

    return response.data;
  }

  // =====================================================
  // GET REQUEST QUERIES BY CATEGORY (NEW)
  // =====================================================

  async getRequestQueriesByCategory(category: string) {
    const response = await axiosClient.get(`/get-request-queries-by-category`, {
      params: { category },
    });

    return response.data;
  }

  // =====================================================
  // UPDATE REQUEST QUERY
  // =====================================================

  async updateRequestQuery(
    request_query_generated_id: string,
    payload: UpdateRequestQueryPayload,
  ) {
    const response = await axiosClient.put(
      `/update-request-query/${request_query_generated_id}`,
      payload,
    );

    return response.data;
  }

  // =====================================================
  // DELETE REQUEST QUERY
  // =====================================================

  async deleteRequestQuery(request_query_generated_id: string) {
    const response = await axiosClient.delete(
      `/delete-request-query/${request_query_generated_id}`,
    );

    return response.data;
  }

  // =====================================================
  // RESPOND TO QUERY
  // =====================================================

  async respondToQuery(
    request_query_generated_id: string,
    payload: RespondToQueryPayload,
  ) {
    const response = await axiosClient.post(
      `/respond-to-query/${request_query_generated_id}`,
      payload,
    );

    return response.data;
  }
}

export default new RequestQueryService();
