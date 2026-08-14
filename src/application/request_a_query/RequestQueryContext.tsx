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

import RequestQueryService from "./requestQuery.service";

// ======================================================
// TYPES
// ======================================================

import {
  RequestQuery,
  CreateRequestQueryPayload,
  UpdateRequestQueryPayload,
  RespondToQueryPayload,
  EMPTY_REQUEST_QUERY,
  EMPTY_RESPOND_TO_QUERY,
} from "./requestQuery.types";

// ======================================================
// VALIDATION
// ======================================================

import {
  validateRequestQuery,
  validateRespondToQuery,
  RequestQueryValidationErrors,
  RespondToQueryValidationErrors,
} from "./requestQuery.validation";

// ======================================================
// CONTEXT TYPE
// ======================================================

interface RequestQueryContextType {
  loading: boolean;

  requestQueries: RequestQuery[];

  requestQuery: CreateRequestQueryPayload;

  errors: RequestQueryValidationErrors;

  selectedRequestQuery: RequestQuery | null;

  setSelectedRequestQueryData: (requestQuery: RequestQuery) => void;

  handleChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => void;

  resetForm: () => void;

  addRequestQuery: () => Promise<boolean>;

  getRequestQueries: () => Promise<void>;

  getRequestQueryByGeneratedId: (
    request_query_generated_id: string,
  ) => Promise<void>;

  getRequestQueriesByCategory: (category: string) => Promise<void>; // New method added

  updateRequestQuery: () => Promise<boolean>;

  deleteRequestQuery: (request_query_generated_id: string) => Promise<boolean>;

  respondQuery: RespondToQueryPayload;

  respondErrors: RespondToQueryValidationErrors;

  setRespondQuery: React.Dispatch<React.SetStateAction<RespondToQueryPayload>>;

  respondToQuery: () => Promise<boolean>;
}

// ======================================================
// CONTEXT
// ======================================================

const RequestQueryContext = createContext<RequestQueryContextType | undefined>(
  undefined,
);

// ======================================================
// PROVIDER
// ======================================================

export const RequestQueryProvider = ({ children }: { children: ReactNode }) => {
  // ======================================================
  // LOADING
  // ======================================================

  const [loading, setLoading] = useState(false);

  // ======================================================
  // REQUEST QUERIES
  // ======================================================

  const [requestQueries, setRequestQueries] = useState<RequestQuery[]>([]);

  // ======================================================
  // REQUEST QUERY FORM
  // ======================================================

  const [requestQuery, setRequestQuery] =
    useState<CreateRequestQueryPayload>(EMPTY_REQUEST_QUERY);

  // ======================================================
  // VALIDATION ERRORS
  // ======================================================

  const [errors, setErrors] = useState<RequestQueryValidationErrors>({});

  // ======================================================
  // SELECTED REQUEST QUERY
  // ======================================================

  const [selectedRequestQuery, setSelectedRequestQuery] =
    useState<RequestQuery | null>(null);

  const [respondQuery, setRespondQuery] = useState<RespondToQueryPayload>(
    EMPTY_RESPOND_TO_QUERY,
  );

  const [respondErrors, setRespondErrors] =
    useState<RespondToQueryValidationErrors>({});

  // ======================================================
  // HANDLE CHANGE
  // ======================================================

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setRequestQuery((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof RequestQueryValidationErrors]) {
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
    setRequestQuery(EMPTY_REQUEST_QUERY);

    setErrors({});

    setSelectedRequestQuery(null);
  };

  // ======================================================
  // SET SELECTED REQUEST QUERY
  // ======================================================

  const setSelectedRequestQueryData = (selected: RequestQuery) => {
    setSelectedRequestQuery(selected);

    setRequestQuery({
      name: selected.name,

      email: selected.email,

      phone_number: selected.phone_number,

      query_title: selected.query_title,

      query_description: selected.query_description,

      screenshot_url: selected.screenshot_url ?? "",

      category: selected.category ?? "", // Category field added

      assigned_to: selected.assigned_to ?? "",

      resolution_note: selected.resolution_note ?? "",
    });

    setErrors({});
  };

  // ======================================================
  // ADD REQUEST QUERY
  // ======================================================
  // ======================================================
  // ADD REQUEST QUERY
  // ======================================================

  const addRequestQuery = async (): Promise<any> => {
    const validationErrors = validateRequestQuery(requestQuery);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return { success: false, errors: validationErrors };
    }

    try {
      setLoading(true);

      const response = await RequestQueryService.addRequestQuery(requestQuery);

      if (!response.success) {
        return { success: false, message: response.message };
      }

      await getRequestQueries();
      resetForm();

      // Return the full response including request_id
      return {
        success: true,
        data: response.data,
        request_id: response.data?.request_id,
      };
    } catch (error) {
      console.error("Error adding request query:", error);
      return { success: false, message: "Failed to add request query." };
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // GET REQUEST QUERIES
  // ======================================================

  const getRequestQueries = async (): Promise<void> => {
    try {
      setLoading(true);

      const response = await RequestQueryService.getRequestQueries();

      setRequestQueries(response.data || []);
    } catch (error) {
      console.error("Error fetching request queries:", error);
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // GET REQUEST QUERY BY GENERATED ID
  // ======================================================

  const getRequestQueryByGeneratedId = async (
    request_query_generated_id: string,
  ): Promise<void> => {
    try {
      setLoading(true);

      const response = await RequestQueryService.getRequestQueryByGeneratedId(
        request_query_generated_id,
      );

      if (response.data) {
        setSelectedRequestQuery(response.data);

        setRequestQuery({
          name: response.data.name,

          email: response.data.email,

          phone_number: response.data.phone_number,

          query_title: response.data.query_title,

          query_description: response.data.query_description,

          screenshot_url: response.data.screenshot_url ?? "",

          category: response.data.category ?? "", // Category field added

          assigned_to: response.data.assigned_to ?? "",

          resolution_note: response.data.resolution_note ?? "",
        });
      }
    } catch (error) {
      console.error("Error fetching request query:", error);
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // GET REQUEST QUERIES BY CATEGORY (NEW)
  // ======================================================

  const getRequestQueriesByCategory = async (
    category: string,
  ): Promise<void> => {
    try {
      setLoading(true);

      const response =
        await RequestQueryService.getRequestQueriesByCategory(category);

      setRequestQueries(response.data || []);
    } catch (error) {
      console.error("Error fetching request queries by category:", error);
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // UPDATE REQUEST QUERY
  // ======================================================

  const updateRequestQuery = async (): Promise<boolean> => {
    if (!selectedRequestQuery) {
      return false;
    }

    const validationErrors = validateRequestQuery(requestQuery);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);

      return false;
    }

    try {
      setLoading(true);

      const payload: UpdateRequestQueryPayload = {
        ...requestQuery,
      };

      await RequestQueryService.updateRequestQuery(
        selectedRequestQuery.request_query_generated_id!,
        payload,
      );

      await getRequestQueries();

      resetForm();

      return true;
    } catch (error) {
      console.error("Error updating request query:", error);

      return false;
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // DELETE REQUEST QUERY
  // ======================================================

  const deleteRequestQuery = async (
    request_query_generated_id: string,
  ): Promise<boolean> => {
    try {
      setLoading(true);

      await RequestQueryService.deleteRequestQuery(request_query_generated_id);

      setRequestQueries((prev) =>
        prev.filter(
          (request) =>
            request.request_query_generated_id !== request_query_generated_id,
        ),
      );

      if (
        selectedRequestQuery?.request_query_generated_id ===
        request_query_generated_id
      ) {
        resetForm();
      }

      return true;
    } catch (error) {
      console.error("Error deleting request query:", error);

      return false;
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // RESPOND TO QUERY
  // ======================================================

  const respondToQuery = async (): Promise<boolean> => {
    if (!selectedRequestQuery) {
      return false;
    }

    const validationErrors = validateRespondToQuery(respondQuery);

    if (Object.keys(validationErrors).length > 0) {
      setRespondErrors(validationErrors);

      return false;
    }

    try {
      setLoading(true);

      await RequestQueryService.respondToQuery(
        selectedRequestQuery.request_query_generated_id!,
        respondQuery,
      );

      await getRequestQueries();

      setRespondQuery(EMPTY_RESPOND_TO_QUERY);

      setRespondErrors({});

      return true;
    } catch (error) {
      console.error("Error responding to query:", error);

      return false;
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // INITIAL LOAD
  // ======================================================

  useEffect(() => {
    getRequestQueries();
  }, []);

  // ======================================================
  // CONTEXT VALUE
  // ======================================================

  const value: RequestQueryContextType = {
    loading,

    requestQueries,

    requestQuery,

    errors,

    selectedRequestQuery,

    setSelectedRequestQueryData,

    handleChange,

    resetForm,

    addRequestQuery,

    getRequestQueries,

    getRequestQueryByGeneratedId,

    getRequestQueriesByCategory, // New method added

    updateRequestQuery,

    deleteRequestQuery,

    respondQuery,

    respondErrors,

    setRespondQuery,

    respondToQuery,
  };

  // ======================================================
  // PROVIDER
  // ======================================================

  return (
    <RequestQueryContext.Provider value={value}>
      {children}
    </RequestQueryContext.Provider>
  );
};

// ======================================================
// HOOK
// ======================================================

export const useRequestQuery = (): RequestQueryContextType => {
  const context = useContext(RequestQueryContext);

  if (!context) {
    throw new Error(
      "useRequestQuery must be used within a RequestQueryProvider",
    );
  }

  return context;
};
