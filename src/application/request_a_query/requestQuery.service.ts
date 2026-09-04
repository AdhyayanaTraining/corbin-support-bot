import axiosClient from "@/src/infrastructure/api/axiosClient";

import {
  CreateRequestQueryPayload,
  RequestQueryApiResponse,
  RequestQueriesApiResponse,
  RespondToQueryPayload,
  UpdateRequestQueryPayload,
} from "./requestQuery.types";

class RequestQueryService {
  // =====================================================
  // ADD REQUEST QUERY
  // =====================================================

  async addRequestQuery(
    payload: CreateRequestQueryPayload,
  ): Promise<RequestQueryApiResponse> {
    const response = await axiosClient.post("/add-request-query", payload);
    return response.data;
  }

  // =====================================================
  // GET ALL REQUEST QUERIES
  // =====================================================

  async getRequestQueries(): Promise<RequestQueriesApiResponse> {
    const response = await axiosClient.get("/get-request-queries");
    return response.data;
  }

  // =====================================================
  // GET REQUEST QUERY BY GENERATED ID
  // =====================================================

  async getRequestQueryByGeneratedId(
    request_query_generated_id: string,
  ): Promise<RequestQueryApiResponse> {
    const response = await axiosClient.get(
      `/get-request-query-by-id/${request_query_generated_id}`,
    );
    return response.data;
  }

  // =====================================================
  // GET REQUEST QUERIES BY CATEGORY
  // =====================================================

  async getRequestQueriesByCategory(
    category: string,
  ): Promise<RequestQueriesApiResponse> {
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
  ): Promise<RequestQueryApiResponse> {
    const response = await axiosClient.put(
      `/update-request-query/${request_query_generated_id}`,
      payload,
    );
    return response.data;
  }

  // =====================================================
  // DELETE REQUEST QUERY
  // =====================================================

  async deleteRequestQuery(
    request_query_generated_id: string,
  ): Promise<RequestQueryApiResponse> {
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
  ): Promise<RequestQueryApiResponse> {
    const response = await axiosClient.post(
      `/respond-to-query/${request_query_generated_id}`,
      payload,
    );
    return response.data;
  }

  // =====================================================
  // GET REQUEST QUERY BY REQUEST ID (custom ID)
  // =====================================================

  async getRequestQueryByRequestId(
    request_id: string,
  ): Promise<RequestQueryApiResponse> {
    const response = await axiosClient.get(
      `/get-request-query-by-request-id/${request_id}`,
    );
    return response.data;
  }

  // =====================================================
  // GET REQUEST QUERIES BY EMAIL
  // =====================================================

  async getRequestQueriesByEmail(
    email: string,
  ): Promise<RequestQueriesApiResponse> {
    const response = await axiosClient.get(
      `/get-request-queries-by-email/${email}`,
    );
    return response.data;
  }

  // =====================================================
  // GET REQUEST QUERY BY ANY FIELD (generic)
  // =====================================================

  async getRequestQueryByAny(
    field: string,
    value: string,
  ): Promise<RequestQueryApiResponse | RequestQueriesApiResponse> {
    const response = await axiosClient.get(`/get-request-query`, {
      params: { field, value },
    });
    return response.data;
  }
}

export default new RequestQueryService();
