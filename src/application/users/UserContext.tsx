/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

// ======================================================
// REACT
// ======================================================

import {
  ChangeEvent,
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

// ======================================================
// SERVICE
// ======================================================

import UserService from "./user.service";

// ======================================================
// TYPES
// ======================================================

import {
  User,
  CreateUserPayload,
  UpdateUserPayload,
  ExpertCategory,
  AvailableDay,
  TimeSlot,
  EMPTY_USER,
  EMPTY_CATEGORY,
  EMPTY_AVAILABLE_DAY,
  DAYS_OF_WEEK,
} from "./user.types";

// ======================================================
// VALIDATION
// ======================================================

import { validateUser, UserValidationErrors } from "./user.validation";

// ======================================================
// CONTEXT TYPE
// ======================================================

interface UserContextType {
  loading: boolean;
  users: User[];
  user: CreateUserPayload;
  errors: UserValidationErrors;
  selectedUser: User | null;
  categoryInput: ExpertCategory;
  categoryErrors: { name?: string; description?: string };
  availableDays: AvailableDay[];
  currentDay: AvailableDay;
  currentTimeSlot: TimeSlot;

  setSelectedUserData: (user: User) => void;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleCategoryChange: (e: ChangeEvent<HTMLInputElement>) => void;
  addCategory: () => void;
  removeCategory: (index: number) => void;
  resetForm: () => void;
  resetCategoryInput: () => void;
  expertCategories: ExpertCategory[];

  // Availability management
  handleDayChange: (dayIndex: number, field: string, value: any) => void;
  handleTimeSlotChange: (
    dayIndex: number,
    slotIndex: number,
    field: string,
    value: string,
  ) => void;
  addTimeSlot: (dayIndex: number) => void;
  removeTimeSlot: (dayIndex: number, slotIndex: number) => void;
  toggleDayAvailability: (dayIndex: number) => void;
  initializeDefaultAvailability: () => void;

  getExpertCategories: () => Promise<ExpertCategory[]>;

  addUser: () => Promise<boolean>;
  getUsers: () => Promise<void>;
  getExpertById: (user_generated_id: string) => Promise<User | null>;
  getExpertsByCategory: (category: string) => Promise<User[]>;
  getExpertsByCategoryId: (category_generated_id: string) => Promise<User[]>;
  getUserByGeneratedId: (user_generated_id: string) => Promise<void>;
  updateUser: () => Promise<boolean>;
  updateExpertAvailability: (
    user_generated_id: string,
    available_days: AvailableDay[],
  ) => Promise<boolean>;
  deleteUser: (user_generated_id: string) => Promise<boolean>;
  addExpertCategory: (
    user_generated_id: string,
    category: { name: string; description?: string },
  ) => Promise<boolean>;
  removeExpertCategory: (
    user_generated_id: string,
    category_generated_id: string,
  ) => Promise<boolean>;
}

// ======================================================
// CONTEXT
// ======================================================

const UserContext = createContext<UserContextType | undefined>(undefined);

// ======================================================
// PROVIDER
// ======================================================

export const UserProvider = ({ children }: { children: ReactNode }) => {
  // ======================================================
  // LOADING
  // ======================================================

  const [loading, setLoading] = useState(false);

  // ======================================================
  // USERS
  // ======================================================

  const [users, setUsers] = useState<User[]>([]);

  // ======================================================
  // USER FORM
  // ======================================================

  const [user, setUser] = useState<CreateUserPayload>(EMPTY_USER);

  // ======================================================
  // EXPERT CATEGORIES
  // ======================================================

  const [expertCategories, setExpertCategories] = useState<ExpertCategory[]>(
    [],
  );

  // ======================================================
  // ERRORS
  // ======================================================

  const [errors, setErrors] = useState<UserValidationErrors>({});

  // ======================================================
  // SELECTED USER
  // ======================================================

  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // ======================================================
  // CATEGORY INPUT
  // ======================================================

  const [categoryInput, setCategoryInput] =
    useState<ExpertCategory>(EMPTY_CATEGORY);
  const [categoryErrors, setCategoryErrors] = useState<{
    name?: string;
    description?: string;
  }>({});

  // ======================================================
  // AVAILABILITY STATE
  // ======================================================

  const [availableDays, setAvailableDays] = useState<AvailableDay[]>([]);
  const [currentDay, setCurrentDay] =
    useState<AvailableDay>(EMPTY_AVAILABLE_DAY);
  const [currentTimeSlot, setCurrentTimeSlot] = useState<TimeSlot>({
    start_time: "09:00",
    end_time: "17:00",
  });

  // ======================================================
  // INITIALIZE DEFAULT AVAILABILITY
  // ======================================================

  const initializeDefaultAvailability = () => {
    const defaultDays: AvailableDay[] = DAYS_OF_WEEK.map((day) => ({
      day,
      time_slots: [{ start_time: "09:00", end_time: "18:00" }], // Changed to 9 AM - 6 PM
      is_available: day !== "saturday" && day !== "sunday", // Mon-Fri available by default
    }));

    setAvailableDays(defaultDays);

    // IMPORTANT: Update user state with the availability data
    setUser((prev) => ({
      ...prev,
      available_days: defaultDays,
    }));
  };

  // ======================================================
  // HANDLE CHANGE
  // ======================================================

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setUser((prev) => {
      const updated = {
        ...prev,
        [name]: value,
      };

      // Auto-initialize availability when switching to EXPERT role
      if (name === "role" && value === "EXPERT") {
        // Only initialize if there are no availability days set yet
        if (!prev.available_days || prev.available_days.length === 0) {
          const defaultDays: AvailableDay[] = DAYS_OF_WEEK.map((day) => ({
            day,
            time_slots: [{ start_time: "09:00", end_time: "18:00" }],
            is_available: day !== "saturday" && day !== "sunday",
          }));

          setAvailableDays(defaultDays);

          return {
            ...updated,
            available_days: defaultDays,
          };
        }
      }

      return updated;
    });

    if (errors[name as keyof UserValidationErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // ======================================================
  // HANDLE CATEGORY CHANGE
  // ======================================================

  const handleCategoryChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setCategoryInput((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (categoryErrors[name as keyof typeof categoryErrors]) {
      setCategoryErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // ======================================================
  // HANDLE DAY CHANGE
  // ======================================================

  const handleDayChange = (dayIndex: number, field: string, value: any) => {
    setAvailableDays((prevDays) => {
      const updatedDays = [...prevDays];
      (updatedDays[dayIndex] as any)[field] = value;

      // Update user state
      setUser((prev) => ({
        ...prev,
        available_days: updatedDays,
      }));

      return updatedDays;
    });
  };

  // ======================================================
  // HANDLE TIME SLOT CHANGE
  // ======================================================

  const handleTimeSlotChange = (
    dayIndex: number,
    slotIndex: number,
    field: string,
    value: string,
  ) => {
    setAvailableDays((prevDays) => {
      const updatedDays = [...prevDays];
      (updatedDays[dayIndex].time_slots[slotIndex] as any)[field] = value;

      // Update user state
      setUser((prev) => ({
        ...prev,
        available_days: updatedDays,
      }));

      return updatedDays;
    });
  };

  // ======================================================
  // ADD TIME SLOT
  // ======================================================

  const addTimeSlot = (dayIndex: number) => {
    setAvailableDays((prevDays) => {
      const updatedDays = [...prevDays];
      updatedDays[dayIndex].time_slots.push({
        start_time: "09:00",
        end_time: "18:00",
      });

      // Update user state
      setUser((prev) => ({
        ...prev,
        available_days: updatedDays,
      }));

      return updatedDays;
    });
  };

  // ======================================================
  // REMOVE TIME SLOT
  // ======================================================

  const removeTimeSlot = (dayIndex: number, slotIndex: number) => {
    setAvailableDays((prevDays) => {
      const updatedDays = [...prevDays];
      updatedDays[dayIndex].time_slots.splice(slotIndex, 1);

      // Update user state
      setUser((prev) => ({
        ...prev,
        available_days: updatedDays,
      }));

      return updatedDays;
    });
  };

  // ======================================================
  // TOGGLE DAY AVAILABILITY
  // ======================================================

  const toggleDayAvailability = (dayIndex: number) => {
    setAvailableDays((prevDays) => {
      const updatedDays = [...prevDays];
      updatedDays[dayIndex].is_available = !updatedDays[dayIndex].is_available;

      // Update user state
      setUser((prev) => ({
        ...prev,
        available_days: updatedDays,
      }));

      return updatedDays;
    });
  };

  // ======================================================
  // ADD CATEGORY
  // ======================================================

  const addCategory = () => {
    const newErrors: { name?: string; description?: string } = {};

    if (!categoryInput.name.trim()) {
      newErrors.name = "Category name is required.";
    }

    if (Object.keys(newErrors).length > 0) {
      setCategoryErrors(newErrors);
      return;
    }

    // Check for duplicate categories
    const isDuplicate = (user.expert_categories || []).some(
      (cat) =>
        cat.name.toLowerCase() === categoryInput.name.trim().toLowerCase(),
    );

    if (isDuplicate) {
      setCategoryErrors({ name: "This category already exists." });
      return;
    }

    setUser((prev) => ({
      ...prev,
      expert_categories: [
        ...(prev.expert_categories || []),
        {
          name: categoryInput.name.trim(),
          description: categoryInput.description?.trim() || "",
        },
      ],
    }));

    resetCategoryInput();
  };

  // ======================================================
  // REMOVE CATEGORY
  // ======================================================

  const removeCategory = (index: number) => {
    setUser((prev) => ({
      ...prev,
      expert_categories:
        prev.expert_categories?.filter((_, i) => i !== index) || [],
    }));
  };

  // ======================================================
  // RESET CATEGORY INPUT
  // ======================================================

  const resetCategoryInput = () => {
    setCategoryInput(EMPTY_CATEGORY);
    setCategoryErrors({});
  };

  // ======================================================
  // RESET FORM
  // ======================================================

  const resetForm = () => {
    setUser(EMPTY_USER);
    setErrors({});
    setSelectedUser(null);
    resetCategoryInput();
    setAvailableDays([]);
  };

  // ======================================================
  // SET SELECTED USER
  // ======================================================

  // ======================================================
  // SET SELECTED USER
  // ======================================================

  const setSelectedUserData = (selected: User) => {
    setSelectedUser(selected);

    // If editing an expert with no availability, initialize default
    let userAvailableDays = selected.available_days || [];

    if (selected.role === "EXPERT" && userAvailableDays.length === 0) {
      userAvailableDays = DAYS_OF_WEEK.map((day) => ({
        day,
        time_slots: [{ start_time: "09:00", end_time: "18:00" }],
        is_available: day !== "saturday" && day !== "sunday",
      }));
    }

    setAvailableDays(userAvailableDays);

    setUser({
      name: selected.name,
      email: selected.email,
      phone_number: selected.phone_number,
      user_id: selected.user_id,
      password: "",
      role: selected.role,
      expert_categories: selected.expert_categories || [],
      available_days: userAvailableDays, // Include availability with defaults
      created_by: selected.created_by,
    });

    setErrors({});
    resetCategoryInput();
  };

  // ======================================================
  // ADD USER
  // ======================================================

  const addUser = async (): Promise<boolean> => {
    // Ensure available_days is included for EXPERT role
    const payload = { ...user };

    if (payload.role === "EXPERT") {
      // Make sure available_days is set
      if (!payload.available_days || payload.available_days.length === 0) {
        payload.available_days = availableDays;
      }
    }

    const validationErrors = validateUser(payload);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return false;
    }

    try {
      setLoading(true);
      console.log("Sending payload:", JSON.stringify(payload, null, 2)); // Debug log
      await UserService.addUser(payload);
      await getUsers();
      resetForm();
      return true;
    } catch (error: any) {
      console.error("Error adding user:", error);
      if (error.response?.data?.message) {
        setErrors({ email: error.response.data.message });
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // GET USERS
  // ======================================================

  const getUsers = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await UserService.getUsers();
      setUsers(response.data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // GET EXPERT BY ID
  // ======================================================

  const getExpertById = async (
    user_generated_id: string,
  ): Promise<User | null> => {
    try {
      setLoading(true);
      const response = await UserService.getExpertById(user_generated_id);
      return response.data || null;
    } catch (error) {
      console.error("Error fetching expert by ID:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // GET EXPERTS BY CATEGORY
  // ======================================================

  const getExpertsByCategory = async (category: string): Promise<User[]> => {
    try {
      setLoading(true);
      const response = await UserService.getExpertsByCategory(category);
      return response.data || [];
    } catch (error) {
      console.error("Error fetching experts by category:", error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // GET EXPERTS BY CATEGORY ID
  // ======================================================

  const getExpertsByCategoryId = async (
    category_generated_id: string,
  ): Promise<User[]> => {
    try {
      setLoading(true);
      const response = await UserService.getExpertsByCategoryId(
        category_generated_id,
      );
      return response.data || [];
    } catch (error) {
      console.error("Error fetching experts by category ID:", error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // GET USER BY GENERATED ID
  // ======================================================

  const getUserByGeneratedId = async (
    user_generated_id: string,
  ): Promise<void> => {
    try {
      setLoading(true);
      const response =
        await UserService.getUserByGeneratedId(user_generated_id);

      if (response.data) {
        setSelectedUserData(response.data);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // UPDATE USER
  // ======================================================

  const updateUser = async (): Promise<boolean> => {
    if (!selectedUser) {
      return false;
    }

    // Ensure available_days is included for EXPERT role
    const payload: UpdateUserPayload = { ...user };

    if (payload.role === "EXPERT") {
      if (!payload.available_days || payload.available_days.length === 0) {
        payload.available_days = availableDays;
      }
    }

    const validationErrors = validateUser(payload);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return false;
    }

    try {
      setLoading(true);
      console.log("Updating payload:", JSON.stringify(payload, null, 2)); // Debug log
      await UserService.updateUser(selectedUser.user_generated_id!, payload);
      await getUsers();
      resetForm();
      return true;
    } catch (error) {
      console.error("Error updating user:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // UPDATE EXPERT AVAILABILITY
  // ======================================================

  const updateExpertAvailability = async (
    user_generated_id: string,
    available_days: AvailableDay[],
  ): Promise<boolean> => {
    try {
      setLoading(true);
      await UserService.updateExpertAvailability(user_generated_id, {
        available_days,
      });
      return true;
    } catch (error) {
      console.error("Error updating expert availability:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // DELETE USER
  // ======================================================

  const deleteUser = async (user_generated_id: string): Promise<boolean> => {
    try {
      setLoading(true);
      await UserService.deleteUser(user_generated_id);
      setUsers((prev) =>
        prev.filter((item) => item.user_generated_id !== user_generated_id),
      );

      if (selectedUser?.user_generated_id === user_generated_id) {
        resetForm();
      }

      return true;
    } catch (error) {
      console.error("Error deleting user:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // ADD EXPERT CATEGORY
  // ======================================================

  const addExpertCategory = async (
    user_generated_id: string,
    category: { name: string; description?: string },
  ): Promise<boolean> => {
    try {
      setLoading(true);
      await UserService.addExpertCategory(user_generated_id, category);
      await getUserByGeneratedId(user_generated_id);
      return true;
    } catch (error) {
      console.error("Error adding expert category:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // REMOVE EXPERT CATEGORY
  // ======================================================

  const removeExpertCategory = async (
    user_generated_id: string,
    category_generated_id: string,
  ): Promise<boolean> => {
    try {
      setLoading(true);
      await UserService.removeExpertCategory(
        user_generated_id,
        category_generated_id,
      );
      await getUserByGeneratedId(user_generated_id);
      return true;
    } catch (error) {
      console.error("Error removing expert category:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // GET EXPERT CATEGORIES
  // ======================================================

  const getExpertCategories = async (): Promise<ExpertCategory[]> => {
    try {
      setLoading(true);

      const response = await UserService.getExpertCategories();

      const categories = response.data || [];

      setExpertCategories(categories);

      return categories;
    } catch (error) {
      console.error("Error fetching expert categories:", error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // INITIAL LOAD
  // ======================================================

  useEffect(() => {
    getUsers();
  }, []);

  // ======================================================
  // CONTEXT VALUE
  // ======================================================

  const value: UserContextType = {
    loading,
    users,
    user,
    errors,
    selectedUser,
    categoryInput,
    categoryErrors,
    availableDays,
    currentDay,
    currentTimeSlot,

    setSelectedUserData,
    handleChange,
    handleCategoryChange,
    addCategory,
    removeCategory,
    resetForm,
    resetCategoryInput,

    // Availability management
    handleDayChange,
    handleTimeSlotChange,
    addTimeSlot,
    removeTimeSlot,
    toggleDayAvailability,
    initializeDefaultAvailability,

    addUser,
    getUsers,
    getExpertById,
    getExpertsByCategory,
    getExpertsByCategoryId,
    getUserByGeneratedId,
    updateUser,
    updateExpertAvailability,
    deleteUser,
    addExpertCategory,
    removeExpertCategory,

    expertCategories,
    getExpertCategories,
  };

  // ======================================================
  // PROVIDER
  // ======================================================

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// ======================================================
// HOOK
// ======================================================

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context;
};
