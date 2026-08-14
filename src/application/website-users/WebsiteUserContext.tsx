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

import WebsiteUserService from "./websiteUser.service";

// ======================================================
// TYPES
// ======================================================

import {
  WebsiteUser,
  CreateWebsiteUserPayload,
  EMPTY_WEBSITE_USER,
} from "./websiteUser.types";

// ======================================================
// VALIDATION
// ======================================================

import {
  validateWebsiteUser,
  WebsiteUserValidationErrors,
} from "./websiteUser.validation";

// ======================================================
// ADD RESULT TYPE
// ======================================================

export interface WebsiteUserAddResult {
  success: boolean;
  isExistingUser?: boolean;
  data?: WebsiteUser;
  registeredEmployeeId?: string;
  message?: string;
  errors?: WebsiteUserValidationErrors;
}

// ======================================================
// CONTEXT TYPE
// ======================================================

interface WebsiteUserContextType {
  loading: boolean;
  websiteUsers: WebsiteUser[];
  websiteUser: CreateWebsiteUserPayload;
  errors: WebsiteUserValidationErrors;
  selectedWebsiteUser: WebsiteUser | null;
  duplicateUser: WebsiteUser | null;
  isDuplicateUser: boolean;
  successMessage: string;
  errorMessage: string;
  registeredEmployeeId: string;

  setSelectedWebsiteUserData: (websiteUser: WebsiteUser) => void;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  resetForm: () => void;
  clearMessages: () => void;
  addWebsiteUser: () => Promise<WebsiteUserAddResult>;
  getWebsiteUsers: () => Promise<void>;
  getWebsiteUserByGeneratedId: (
    registerd_employee_generated_id: string,
  ) => Promise<void>;
  getWebsiteUserByEmail: (email: string) => Promise<void>;
  deleteWebsiteUser: (
    registerd_employee_generated_id: string,
  ) => Promise<boolean>;
}

// ======================================================
// CONTEXT
// ======================================================

const WebsiteUserContext = createContext<WebsiteUserContextType | undefined>(
  undefined,
);

// ======================================================
// PROVIDER
// ======================================================

export const WebsiteUserProvider = ({ children }: { children: ReactNode }) => {
  // ======================================================
  // LOADING
  // ======================================================

  const [loading, setLoading] = useState(false);

  // ======================================================
  // WEBSITE USERS
  // ======================================================

  const [websiteUsers, setWebsiteUsers] = useState<WebsiteUser[]>([]);

  // ======================================================
  // WEBSITE USER FORM
  // ======================================================

  const [websiteUser, setWebsiteUser] =
    useState<CreateWebsiteUserPayload>(EMPTY_WEBSITE_USER);

  // ======================================================
  // VALIDATION ERRORS
  // ======================================================

  const [errors, setErrors] = useState<WebsiteUserValidationErrors>({});

  // ======================================================
  // SELECTED WEBSITE USER
  // ======================================================

  const [selectedWebsiteUser, setSelectedWebsiteUser] =
    useState<WebsiteUser | null>(null);

  // ======================================================
  // DUPLICATE USER STATE
  // ======================================================

  const [duplicateUser, setDuplicateUser] = useState<WebsiteUser | null>(null);
  const [isDuplicateUser, setIsDuplicateUser] = useState(false);

  // ======================================================
  // MESSAGES
  // ======================================================

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // ======================================================
  // REGISTERED EMPLOYEE ID
  // ======================================================

  const [registeredEmployeeId, setRegisteredEmployeeId] = useState("");

  // ======================================================
  // CLEAR MESSAGES
  // ======================================================

  const clearMessages = () => {
    setSuccessMessage("");
    setErrorMessage("");
    setDuplicateUser(null);
    setIsDuplicateUser(false);
  };

  // ======================================================
  // HANDLE CHANGE
  // ======================================================

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setWebsiteUser((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear field-specific error
    if (errors[name as keyof WebsiteUserValidationErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    // Clear messages when user starts typing
    clearMessages();
  };

  // ======================================================
  // RESET FORM
  // ======================================================

  const resetForm = () => {
    setWebsiteUser(EMPTY_WEBSITE_USER);
    setErrors({});
    setSelectedWebsiteUser(null);
    setDuplicateUser(null);
    setIsDuplicateUser(false);
    setSuccessMessage("");
    setErrorMessage("");
    setRegisteredEmployeeId("");
  };

  // ======================================================
  // SET SELECTED WEBSITE USER
  // ======================================================

  const setSelectedWebsiteUserData = (selected: WebsiteUser) => {
    setSelectedWebsiteUser(selected);

    setWebsiteUser({
      name: selected.name,
      email: selected.email,
      phone_number: selected.phone_number,
    });

    setErrors({});
    clearMessages();
  };
  // ======================================================
  // ADD WEBSITE USER
  // ======================================================

  const addWebsiteUser = async (): Promise<WebsiteUserAddResult> => {
    try {
      setLoading(true);
      clearMessages();

      const validationErrors = validateWebsiteUser(websiteUser);

      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return { success: false, errors: validationErrors };
      }

      setErrors({});

      const response = await WebsiteUserService.addWebsiteUser(websiteUser);

      if (!response.success) {
        setErrorMessage(response.message || "Failed to add website user.");
        return { success: false, message: response.message };
      }

      // Check if this is an existing user
      if (response.isExistingUser && response.data) {
        setDuplicateUser(response.data);
        setIsDuplicateUser(true);
        setRegisteredEmployeeId(
          response.data.registerd_employee_generated_id || "",
        );
        setSuccessMessage(
          "A user with these credentials already exists. Showing existing user details.",
        );

        // RETURN THE DATA DIRECTLY
        return {
          success: true,
          isExistingUser: true,
          data: response.data,
          registeredEmployeeId: response.data.registerd_employee_generated_id,
        };
      } else if (response.data) {
        setRegisteredEmployeeId(
          response.data.registerd_employee_generated_id || "",
        );
        setSuccessMessage("Website user added successfully.");

        // RETURN THE DATA DIRECTLY
        return {
          success: true,
          isExistingUser: false,
          data: response.data,
          registeredEmployeeId: response.data.registerd_employee_generated_id,
        };
      }

      await getWebsiteUsers();

      return { success: true };
    } catch (error: any) {
      console.error(error);
      setErrorMessage(
        error.response?.data?.message || "An error occurred while adding user.",
      );
      return { success: false, message: error.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // GET ALL WEBSITE USERS
  // ======================================================

  const getWebsiteUsers = async (): Promise<void> => {
    try {
      setLoading(true);

      const response = await WebsiteUserService.getWebsiteUsers();

      if (response.success) {
        setWebsiteUsers(response.data || []);
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to fetch website users.");
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // GET WEBSITE USER BY GENERATED ID
  // ======================================================

  const getWebsiteUserByGeneratedId = async (
    registerd_employee_generated_id: string,
  ): Promise<void> => {
    try {
      setLoading(true);
      clearMessages();

      const response = await WebsiteUserService.getWebsiteUserByGeneratedId(
        registerd_employee_generated_id,
      );

      if (!response.success) {
        setErrorMessage(response.message || "User not found.");
        return;
      }

      // Check if data exists before using it
      if (response.data) {
        setSelectedWebsiteUserData(response.data);
      } else {
        setErrorMessage("User data not found.");
      }
    } catch (error: any) {
      console.error(error);
      setErrorMessage(
        error.response?.data?.message || "Failed to fetch user details.",
      );
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // GET WEBSITE USER BY EMAIL
  // ======================================================

  const getWebsiteUserByEmail = async (email: string): Promise<void> => {
    try {
      setLoading(true);
      clearMessages();

      const response = await WebsiteUserService.getWebsiteUserByEmail(email);

      if (!response.success) {
        setErrorMessage(response.message || "User not found with this email.");
        return;
      }

      // Check if data exists before using it
      if (response.data) {
        setSelectedWebsiteUserData(response.data);
      } else {
        setErrorMessage("User data not found.");
      }
    } catch (error: any) {
      console.error(error);
      setErrorMessage(
        error.response?.data?.message || "Failed to fetch user by email.",
      );
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // DELETE WEBSITE USER
  // ======================================================

  const deleteWebsiteUser = async (
    registerd_employee_generated_id: string,
  ): Promise<boolean> => {
    try {
      setLoading(true);
      clearMessages();

      const response = await WebsiteUserService.deleteWebsiteUser(
        registerd_employee_generated_id,
      );

      if (!response.success) {
        setErrorMessage(response.message || "Failed to delete user.");
        return false;
      }

      setSuccessMessage("Website user deleted successfully.");
      await getWebsiteUsers();

      if (
        selectedWebsiteUser?.registerd_employee_generated_id ===
        registerd_employee_generated_id
      ) {
        resetForm();
      }

      return true;
    } catch (error: any) {
      console.error(error);
      setErrorMessage(
        error.response?.data?.message || "An error occurred while deleting.",
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // LOAD USERS ON MOUNT
  // ======================================================

  useEffect(() => {
    getWebsiteUsers();
  }, []);

  // ======================================================
  // CONTEXT VALUE
  // ======================================================

  const value: WebsiteUserContextType = {
    loading,
    websiteUsers,
    websiteUser,
    errors,
    selectedWebsiteUser,
    duplicateUser,
    isDuplicateUser,
    successMessage,
    errorMessage,
    registeredEmployeeId,

    setSelectedWebsiteUserData,
    handleChange,
    resetForm,
    clearMessages,
    addWebsiteUser,
    getWebsiteUsers,
    getWebsiteUserByGeneratedId,
    getWebsiteUserByEmail,
    deleteWebsiteUser,
  };

  // ======================================================
  // PROVIDER
  // ======================================================

  return (
    <WebsiteUserContext.Provider value={value}>
      {children}
    </WebsiteUserContext.Provider>
  );
};

// ======================================================
// HOOK
// ======================================================

export const useWebsiteUser = () => {
  const context = useContext(WebsiteUserContext);

  if (!context) {
    throw new Error("useWebsiteUser must be used within WebsiteUserProvider");
  }

  return context;
};