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
  EMPTY_USER,
  EMPTY_CATEGORY,
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

  setSelectedUserData: (user: User) => void;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleCategoryChange: (e: ChangeEvent<HTMLInputElement>) => void;
  addCategory: () => void;
  removeCategory: (index: number) => void;
  resetForm: () => void;
  resetCategoryInput: () => void;
  expertCategories: ExpertCategory[];

  getExpertCategories: () => Promise<ExpertCategory[]>;

  addUser: () => Promise<boolean>;
  getUsers: () => Promise<void>;
  getExpertsByCategory: (category: string) => Promise<User[]>;
  getUserByGeneratedId: (user_generated_id: string) => Promise<void>;
  updateUser: () => Promise<boolean>;
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
  // HANDLE CHANGE
  // ======================================================

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));

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

    setUser((prev) => ({
      ...prev,
      expert_categories: [
        ...(prev.expert_categories || []),
        { ...categoryInput },
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
  };

  // ======================================================
  // SET SELECTED USER
  // ======================================================

  const setSelectedUserData = (selected: User) => {
    setSelectedUser(selected);

    setUser({
      name: selected.name,
      email: selected.email,
      phone_number: selected.phone_number,
      user_id: selected.user_id,
      password: "",
      role: selected.role,
      expert_categories: selected.expert_categories || [],
      created_by: selected.created_by,
    });

    setErrors({});
    resetCategoryInput();
  };

  // ======================================================
  // ADD USER
  // ======================================================

  const addUser = async (): Promise<boolean> => {
    const validationErrors = validateUser(user);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return false;
    }

    try {
      setLoading(true);
      await UserService.addUser(user);
      await getUsers();
      resetForm();
      return true;
    } catch (error) {
      console.error("Error adding user:", error);
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
        setSelectedUser(response.data);
        setUser({
          name: response.data.name,
          email: response.data.email,
          phone_number: response.data.phone_number,
          user_id: response.data.user_id,
          password: "",
          role: response.data.role,
          expert_categories: response.data.expert_categories || [],
          created_by: response.data.created_by,
        });
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

    const validationErrors = validateUser(user);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return false;
    }

    try {
      setLoading(true);
      const payload: UpdateUserPayload = { ...user };
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

    setSelectedUserData,
    handleChange,
    handleCategoryChange,
    addCategory,
    removeCategory,
    resetForm,
    resetCategoryInput,

    addUser,
    getUsers,
    getExpertsByCategory,
    getUserByGeneratedId,
    updateUser,
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
