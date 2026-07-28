// "use client";

// // ======================================================
// // REACT
// // ======================================================

// import {
//   ChangeEvent,
//   createContext,
//   ReactNode,
//   useContext,
//   useEffect,
//   useState,
// } from "react";

// // ======================================================
// // SERVICE
// // ======================================================

// import WebsiteUserService from "./websiteUser.service";

// // ======================================================
// // TYPES
// // ======================================================

// import {
//   WebsiteUser,
//   CreateWebsiteUserPayload,
//   EMPTY_WEBSITE_USER,
// } from "./websiteUser.types";

// // ======================================================
// // VALIDATION
// // ======================================================

// import {
//   validateWebsiteUser,
//   WebsiteUserValidationErrors,
// } from "./websiteUser.validation";

// // ======================================================
// // CONTEXT TYPE
// // ======================================================

// interface WebsiteUserContextType {
//   loading: boolean;

//   websiteUsers: WebsiteUser[];

//   websiteUser: CreateWebsiteUserPayload;

//   errors: WebsiteUserValidationErrors;

//   selectedWebsiteUser: WebsiteUser | null;

//   setSelectedWebsiteUserData: (websiteUser: WebsiteUser) => void;

//   handleChange: (e: ChangeEvent<HTMLInputElement>) => void;

//   resetForm: () => void;

//   addWebsiteUser: () => Promise<boolean>;

//   getWebsiteUsers: () => Promise<void>;

//   getWebsiteUserByGeneratedId: (
//     registerd_employee_generated_id: string,
//   ) => Promise<void>;

//   deleteWebsiteUser: (
//     registerd_employee_generated_id: string,
//   ) => Promise<boolean>;
// }

// // ======================================================
// // CONTEXT
// // ======================================================

// const WebsiteUserContext = createContext<WebsiteUserContextType | undefined>(
//   undefined,
// );

// // ======================================================
// // PROVIDER
// // ======================================================

// export const WebsiteUserProvider = ({ children }: { children: ReactNode }) => {
//   // ======================================================
//   // LOADING
//   // ======================================================

//   const [loading, setLoading] = useState(false);

//   // ======================================================
//   // WEBSITE USERS
//   // ======================================================

//   const [websiteUsers, setWebsiteUsers] = useState<WebsiteUser[]>([]);

//   // ======================================================
//   // WEBSITE USER FORM
//   // ======================================================

//   const [websiteUser, setWebsiteUser] =
//     useState<CreateWebsiteUserPayload>(EMPTY_WEBSITE_USER);

//   // ======================================================
//   // VALIDATION ERRORS
//   // ======================================================

//   const [errors, setErrors] = useState<WebsiteUserValidationErrors>({});

//   // ======================================================
//   // SELECTED WEBSITE USER
//   // ======================================================

//   const [selectedWebsiteUser, setSelectedWebsiteUser] =
//     useState<WebsiteUser | null>(null);

//   // ======================================================
//   // HANDLE CHANGE
//   // ======================================================

//   const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;

//     setWebsiteUser((prev) => ({
//       ...prev,
//       [name]: value,
//     }));

//     if (errors[name as keyof WebsiteUserValidationErrors]) {
//       setErrors((prev) => ({
//         ...prev,
//         [name]: "",
//       }));
//     }
//   };

//   // ======================================================
//   // RESET FORM
//   // ======================================================

//   const resetForm = () => {
//     setWebsiteUser(EMPTY_WEBSITE_USER);

//     setErrors({});

//     setSelectedWebsiteUser(null);
//   };

//   // ======================================================
//   // SET SELECTED WEBSITE USER
//   // ======================================================

//   const setSelectedWebsiteUserData = (selected: WebsiteUser) => {
//     setSelectedWebsiteUser(selected);

//     setWebsiteUser({
//       name: selected.name,

//       email: selected.email,

//       phone_number: selected.phone_number,
//     });

//     setErrors({});
//   };
//   // ======================================================
//   // ADD WEBSITE USER
//   // ======================================================

//   const addWebsiteUser = async (): Promise<boolean> => {
//     try {
//       setLoading(true);

//       const validationErrors = validateWebsiteUser(websiteUser);

//       if (Object.keys(validationErrors).length > 0) {
//         setErrors(validationErrors);

//         return false;
//       }

//       setErrors({});

//       const response = await WebsiteUserService.addWebsiteUser(websiteUser);

//       if (!response.success) {
//         return false;
//       }

//       await getWebsiteUsers();

//       resetForm();

//       return true;
//     } catch (error) {
//       console.error(error);

//       return false;
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ======================================================
//   // GET ALL WEBSITE USERS
//   // ======================================================

//   const getWebsiteUsers = async (): Promise<void> => {
//     try {
//       setLoading(true);

//       const response = await WebsiteUserService.getWebsiteUsers();

//       if (response.success) {
//         setWebsiteUsers(response.data || []);
//       }
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ======================================================
//   // GET WEBSITE USER BY GENERATED ID
//   // ======================================================

//   const getWebsiteUserByGeneratedId = async (
//     registerd_employee_generated_id: string,
//   ): Promise<void> => {
//     try {
//       setLoading(true);

//       const response = await WebsiteUserService.getWebsiteUserByGeneratedId(
//         registerd_employee_generated_id,
//       );

//       if (!response.success) {
//         return;
//       }

//       setSelectedWebsiteUserData(response.data);
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };
//   // ======================================================
//   // DELETE WEBSITE USER
//   // ======================================================

//   const deleteWebsiteUser = async (
//     registerd_employee_generated_id: string,
//   ): Promise<boolean> => {
//     try {
//       setLoading(true);

//       const response = await WebsiteUserService.deleteWebsiteUser(
//         registerd_employee_generated_id,
//       );

//       if (!response.success) {
//         return false;
//       }

//       await getWebsiteUsers();

//       if (
//         selectedWebsiteUser?.registerd_employee_generated_id ===
//         registerd_employee_generated_id
//       ) {
//         resetForm();
//       }

//       return true;
//     } catch (error) {
//       console.error(error);

//       return false;
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ======================================================
//   // CONTEXT VALUE
//   // ======================================================

//   const value: WebsiteUserContextType = {
//     loading,

//     websiteUsers,

//     websiteUser,

//     errors,

//     selectedWebsiteUser,

//     setSelectedWebsiteUserData,

//     handleChange,

//     resetForm,

//     addWebsiteUser,

//     getWebsiteUsers,

//     getWebsiteUserByGeneratedId,

//     deleteWebsiteUser,
//   };

//   // ======================================================
//   // PROVIDER
//   // ======================================================

//   return (
//     <WebsiteUserContext.Provider value={value}>
//       {children}
//     </WebsiteUserContext.Provider>
//   );
// };

// // ======================================================
// // HOOK
// // ======================================================

// export const useWebsiteUser = () => {
//   const context = useContext(WebsiteUserContext);

//   if (!context) {
//     throw new Error("useWebsiteUser must be used within WebsiteUserProvider");
//   }

//   return context;
// };
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
// CONTEXT TYPE
// ======================================================

interface WebsiteUserContextType {
  loading: boolean;

  websiteUsers: WebsiteUser[];

  websiteUser: CreateWebsiteUserPayload;

  errors: WebsiteUserValidationErrors;

  selectedWebsiteUser: WebsiteUser | null;

  registeredEmployeeId: string | null;

  setSelectedWebsiteUserData: (websiteUser: WebsiteUser) => void;

  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;

  resetForm: () => void;

  addWebsiteUser: () => Promise<boolean>;

  getWebsiteUsers: () => Promise<void>;

  getWebsiteUserByGeneratedId: (
    registerd_employee_generated_id: string,
  ) => Promise<void>;

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
// HELPER: Read employee ID from localStorage
// ======================================================

function getSavedEmployeeId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem("carebot_contact_details");
    if (raw) {
      const parsed = JSON.parse(raw);
      return parsed?.registered_employee_generated_id || null;
    }
  } catch (err) {
    console.error("Failed to read saved employee ID.", err);
  }
  return null;
}

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
  // REGISTERED EMPLOYEE ID - Initialized from localStorage
  // ======================================================

  const [registeredEmployeeId, setRegisteredEmployeeId] = useState<
    string | null
  >(getSavedEmployeeId);

  // ======================================================
  // HANDLE CHANGE
  // ======================================================

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setWebsiteUser((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof WebsiteUserValidationErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // ======================================================
  // RESET FORM
  // ======================================================

  const resetForm = () => {
    setWebsiteUser(EMPTY_WEBSITE_USER);
    setErrors({});
    setSelectedWebsiteUser(null);
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
  };

  // ======================================================
  // ADD WEBSITE USER
  // ======================================================

  const addWebsiteUser = async (): Promise<boolean> => {
    try {
      setLoading(true);

      const validationErrors = validateWebsiteUser(websiteUser);

      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return false;
      }

      setErrors({});

      const response = await WebsiteUserService.addWebsiteUser(websiteUser);

      if (!response.success) {
        return false;
      }

      // Extract the registered employee ID from the response
      if (response.data?.registerd_employee_generated_id) {
        setRegisteredEmployeeId(response.data.registerd_employee_generated_id);
      }

      await getWebsiteUsers();
      resetForm();

      return true;
    } catch (error) {
      console.error(error);
      return false;
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

      const response = await WebsiteUserService.getWebsiteUserByGeneratedId(
        registerd_employee_generated_id,
      );

      if (!response.success) {
        return;
      }

      setSelectedWebsiteUserData(response.data);

      if (response.data?.registerd_employee_generated_id) {
        setRegisteredEmployeeId(response.data.registerd_employee_generated_id);
      }
    } catch (error) {
      console.error(error);
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

      const response = await WebsiteUserService.deleteWebsiteUser(
        registerd_employee_generated_id,
      );

      if (!response.success) {
        return false;
      }

      await getWebsiteUsers();

      if (
        selectedWebsiteUser?.registerd_employee_generated_id ===
        registerd_employee_generated_id
      ) {
        resetForm();
        setRegisteredEmployeeId(null);
      }

      return true;
    } catch (error) {
      console.error(error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // CONTEXT VALUE
  // ======================================================

  const value: WebsiteUserContextType = {
    loading,
    websiteUsers,
    websiteUser,
    errors,
    selectedWebsiteUser,
    registeredEmployeeId,
    setSelectedWebsiteUserData,
    handleChange,
    resetForm,
    addWebsiteUser,
    getWebsiteUsers,
    getWebsiteUserByGeneratedId,
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
