import axiosClient from "@/src/infrastructure/api/axiosClient";
import {
  CreateUserPayload,
  UpdateUserPayload,
  UpdateExpertAvailabilityPayload,
} from "./user.types";

class UserService {
  // =====================================================
  // ADD USER
  // =====================================================

  async addUser(payload: CreateUserPayload) {
    const response = await axiosClient.post("/add-user", payload);
    return response.data;
  }

  // =====================================================
  // GET USERS
  // =====================================================

  async getUsers() {
    const response = await axiosClient.get("/get-users");
    return response.data;
  }

  // =====================================================
  // GET USER BY GENERATED ID
  // =====================================================

  async getUserByGeneratedId(user_generated_id: string) {
    const response = await axiosClient.get(
      `/get-user-by-id/${user_generated_id}`,
    );
    return response.data;
  }

  // =====================================================
  // GET EXPERT BY ID (NEW)
  // =====================================================

  async getExpertById(user_generated_id: string) {
    const response = await axiosClient.get(
      `/get-expert-by-id/${user_generated_id}`,
    );
    return response.data;
  }

  // =====================================================
  // GET EXPERTS BY CATEGORY (UPDATED - QUERY PARAM)
  // =====================================================

  async getExpertsByCategory(category: string) {
    const response = await axiosClient.get(
      `/get-experts-by-category?category=${encodeURIComponent(category)}`,
    );
    return response.data;
  }

  // =====================================================
  // GET EXPERTS BY CATEGORY ID (NEW)
  // =====================================================

  async getExpertsByCategoryId(category_generated_id: string) {
    const response = await axiosClient.get(
      `/get-experts-by-category-id/${category_generated_id}`,
    );
    return response.data;
  }

  // =====================================================
  // UPDATE USER
  // =====================================================

  async updateUser(user_generated_id: string, payload: UpdateUserPayload) {
    const response = await axiosClient.put(
      `/update-user/${user_generated_id}`,
      payload,
    );
    return response.data;
  }

  // =====================================================
  // UPDATE EXPERT AVAILABILITY (NEW)
  // =====================================================

  async updateExpertAvailability(
    user_generated_id: string,
    payload: UpdateExpertAvailabilityPayload,
  ) {
    const response = await axiosClient.put(
      `/update-expert-availability/${user_generated_id}`,
      payload,
    );
    return response.data;
  }

  // =====================================================
  // DELETE USER
  // =====================================================

  async deleteUser(user_generated_id: string) {
    const response = await axiosClient.delete(
      `/delete-user/${user_generated_id}`,
    );
    return response.data;
  }

  // =====================================================
  // ADD CATEGORY TO EXPERT
  // =====================================================

  async addExpertCategory(
    user_generated_id: string,
    category: { name: string; description?: string },
  ) {
    const response = await axiosClient.post(
      `/add-expert-category/${user_generated_id}`,
      category,
    );
    return response.data;
  }

  // =====================================================
  // REMOVE CATEGORY FROM EXPERT
  // =====================================================

  async removeExpertCategory(
    user_generated_id: string,
    category_generated_id: string,
  ) {
    const response = await axiosClient.delete(
      `/remove-expert-category/${user_generated_id}/${category_generated_id}`,
    );
    return response.data;
  }

  // =====================================================
  // GET EXPERT CATEGORIES
  // =====================================================

  async getExpertCategories() {
    const response = await axiosClient.get("/get-expert-categories");
    return response.data;
  }
}

export default new UserService();
