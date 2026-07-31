// ======================================================
// REQUEST QUERY STATUS
// ======================================================

export type RequestQueryStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "RESOLVED"
  | "REJECTED"
  | "CLOSED";

// ======================================================
// REQUEST QUERY
// ======================================================

export interface RequestQuery {
  request_query_generated_id?: string;

  name: string;

  email: string;

  phone_number: string;

  query_title: string;

  query_description: string;

  screenshot_url?: string;

  category?: string; // Category field added

  request_status?: RequestQueryStatus;

  assigned_to?: string;

  resolution_note?: string;

  requested_at?: Date;

  resolved_at?: Date;

  created_at?: Date;

  updated_at?: Date;

  responded_by?: string;

  last_response_at?: Date;
}

// ======================================================
// CREATE REQUEST QUERY PAYLOAD
// ======================================================

export interface CreateRequestQueryPayload {
  name: string;

  email: string;

  phone_number: string;

  query_title: string;

  query_description: string;

  screenshot_url?: string;

  category?: string; // Category field added

  assigned_to?: string;

  resolution_note?: string;
}

// ======================================================
// UPDATE REQUEST QUERY PAYLOAD
// ======================================================

export interface UpdateRequestQueryPayload {
  name: string;

  email: string;

  phone_number: string;

  query_title: string;

  query_description: string;

  screenshot_url?: string;

  category?: string; // Category field added

  request_status?: RequestQueryStatus;

  assigned_to?: string;

  resolution_note?: string;
}

// ======================================================
// RESPOND TO QUERY PAYLOAD
// ======================================================

export interface RespondToQueryPayload {
  subject: string;

  message: string;

  responded_by: string;
}

// ======================================================
// EMPTY RESPOND TO QUERY
// ======================================================

export const EMPTY_RESPOND_TO_QUERY: RespondToQueryPayload = {
  subject: "",

  message: "",

  responded_by: "",
};

// ======================================================
// EMPTY REQUEST QUERY
// ======================================================

export const EMPTY_REQUEST_QUERY: CreateRequestQueryPayload = {
  name: "",

  email: "",

  phone_number: "",

  query_title: "",

  query_description: "",

  screenshot_url: "",

  category: "", // Category field added

  assigned_to: "",

  resolution_note: "",
};
