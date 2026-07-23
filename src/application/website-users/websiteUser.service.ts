import axiosClient from "@/src/infrastructure/api/axiosClient";

import { CreateWebsiteUserPayload } from "./websiteUser.types";

class WebsiteUserService {
  // =====================================================
  // ADD WEBSITE USER
  // =====================================================

  async addWebsiteUser(payload: CreateWebsiteUserPayload) {
    const response = await axiosClient.post("/add-website-user", payload);

    return response.data;
  }

  // =====================================================
  // GET ALL WEBSITE USERS
  // =====================================================

  async getWebsiteUsers() {
    const response = await axiosClient.get("/get-website-users");

    return response.data;
  }

  // =====================================================
  // GET WEBSITE USER BY GENERATED ID
  // =====================================================

  async getWebsiteUserByGeneratedId(registerd_employee_generated_id: string) {
    const response = await axiosClient.get(
      `/get-website-user-by-id/${registerd_employee_generated_id}`,
    );

    return response.data;
  }

  // =====================================================
  // DELETE WEBSITE USER
  // =====================================================

  async deleteWebsiteUser(registerd_employee_generated_id: string) {
    const response = await axiosClient.delete(
      `/delete-website-user/${registerd_employee_generated_id}`,
    );

    return response.data;
  }
}

export default new WebsiteUserService();
