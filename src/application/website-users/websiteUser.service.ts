import axiosClient from "@/src/infrastructure/api/axiosClient";
import {
  CreateWebsiteUserPayload,
  WebsiteUserApiResponse,
  WebsiteUsersApiResponse,
} from "./websiteUser.types";

class WebsiteUserService {
  // =====================================================
  // ADD WEBSITE USER
  // =====================================================

  async addWebsiteUser(
    payload: CreateWebsiteUserPayload,
  ): Promise<WebsiteUserApiResponse> {
    const response = await axiosClient.post("/add-website-user", payload);
    return response.data;
  }

  // =====================================================
  // GET ALL WEBSITE USERS
  // =====================================================

  async getWebsiteUsers(): Promise<WebsiteUsersApiResponse> {
    const response = await axiosClient.get("/get-website-users");
    return response.data;
  }

  // =====================================================
  // GET WEBSITE USER BY GENERATED ID
  // =====================================================

  async getWebsiteUserByGeneratedId(
    registerd_employee_generated_id: string,
  ): Promise<WebsiteUserApiResponse> {
    const response = await axiosClient.get(
      `/get-website-user-by-id/${registerd_employee_generated_id}`,
    );
    return response.data;
  }

  // =====================================================
  // GET WEBSITE USER BY EMAIL
  // =====================================================

  async getWebsiteUserByEmail(email: string): Promise<WebsiteUserApiResponse> {
    const response = await axiosClient.get(
      `/get-website-user-by-email?email=${encodeURIComponent(email)}`,
    );
    return response.data;
  }

  // =====================================================
  // DELETE WEBSITE USER
  // =====================================================

  async deleteWebsiteUser(
    registerd_employee_generated_id: string,
  ): Promise<WebsiteUserApiResponse> {
    const response = await axiosClient.delete(
      `/delete-website-user/${registerd_employee_generated_id}`,
    );
    return response.data;
  }
}

export default new WebsiteUserService();
