/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ChangeEvent, FormEvent } from "react";
import {
  User,
  Mail,
  FileText,
  Send,
  ClipboardList,
  Loader2,
} from "lucide-react";
import type { FAQCategory } from "@/src/application/faq/faq.types";
import type {
  FlowStep,
  ContactDetails,
  ValidationErrors,
  Translations,
} from "../types";
import "./style.css";

interface RaiseAQueryModuleProps {
  flowStep: FlowStep;
  ts: (key: keyof Translations) => string;
  displayContact: ContactDetails;
  requestQuery: any;
  requestQueryErrors: ValidationErrors;
  localValidationErrors: ValidationErrors;
  requestQueryLoading: boolean;

  // ====================================================
  // FAQ CATEGORIES
  //
  // Now sourced from the FAQ knowledge base, not from
  // expert/mentor categories. This lets the user pick
  // from the same topics they saw in the FAQ flow.
  // ====================================================
  faqCategories: FAQCategory[];
  selectedLanguage: string;
  getLocalizedText: (value: any, language: string) => string;

  onOpenQueryCategoryChange: () => void;
  onQueryCategorySelect: (cat: FAQCategory) => void;
  onSkipQueryCategory: () => void;
  onRequestQueryChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  onSubmitQuery: (e?: FormEvent) => void;
  onSetLocalValidationErrors: React.Dispatch<
    React.SetStateAction<ValidationErrors>
  >;
  isValidQueryTitle: (val: string) => boolean;
  isValidQueryDescription: (val: string) => boolean;
}

export function RaiseAQueryModule({
  flowStep,
  ts,
  displayContact,
  requestQuery,
  requestQueryErrors,
  localValidationErrors,
  requestQueryLoading,
  faqCategories,
  selectedLanguage,
  getLocalizedText,
  onOpenQueryCategoryChange,
  onQueryCategorySelect,
  onSkipQueryCategory,
  onRequestQueryChange,
  onSubmitQuery,
  onSetLocalValidationErrors,
  isValidQueryTitle,
  isValidQueryDescription,
}: RaiseAQueryModuleProps) {
  // ====================================================
  // QUERY CATEGORY PICKER
  //
  // Shows every FAQ topic — the same list the user sees
  // in the FAQ flow. If a topic has multiple FAQ parents
  // it will appear once (dedup happens in the parent).
  // ====================================================

  if (flowStep === "query-category") {
    return (
      <div className="cw-categories-wrap">
        <div className="cw-section-title">
          <span className="cw-section-icon">
            <ClipboardList size={15} />
          </span>
          {ts("whichCategoryQuery")}
        </div>

        {faqCategories.length === 0 ? (
          <div className="cw-empty-state">No categories available.</div>
        ) : (
          <div className="cw-categories-grid">
            {faqCategories.map((cat, i) => {
              const topicName =
                getLocalizedText(cat.topic_name, selectedLanguage || "en") ||
                ts("unknown");

              return (
                <button
                  key={cat.category_generated_id ?? i}
                  className="cw-category-card"
                  style={{ animationDelay: `${i * 0.06}s` }}
                  onClick={() => onQueryCategorySelect(cat)}
                  type="button"
                >
                  <span className="cw-category-icon">
                    <ClipboardList size={18} />
                  </span>
                  <span className="cw-category-name">{topicName}</span>
                </button>
              );
            })}
          </div>
        )}

        <button
          className="cw-skip-category-btn"
          onClick={onSkipQueryCategory}
          type="button"
        >
          {ts("skipCategory")}
        </button>
      </div>
    );
  }

  // ====================================================
  // QUERY FORM
  // ====================================================

  if (flowStep === "query-form") {
    return (
      <div className="cw-query-form-wrap">
        <div className="cw-contact-summary cw-contact-summary--compact">
          <div className="cw-contact-row">
            <User size={13} />
            <span>{displayContact.name}</span>
          </div>
          <div className="cw-contact-row">
            <Mail size={13} />
            <span>{displayContact.email}</span>
          </div>
        </div>

        {requestQuery.category && (
          <div className="cw-query-category-badge">
            <ClipboardList size={12} />
            <span>{requestQuery.category}</span>
            <button
              type="button"
              className="cw-query-category-change"
              onClick={onOpenQueryCategoryChange}
            >
              {ts("change")}
            </button>
          </div>
        )}

        <form className="cw-query-form" onSubmit={onSubmitQuery}>
          <div className="cw-query-field">
            <label className="cw-query-label">
              <ClipboardList size={13} />
              {ts("queryTitle")}
            </label>
            <input
              className={`cw-query-input ${
                requestQueryErrors.query_title ||
                localValidationErrors.query_title
                  ? "has-error"
                  : ""
              }`}
              name="query_title"
              placeholder={ts("queryTitlePlaceholder")}
              value={requestQuery.query_title}
              onChange={(e) => {
                onRequestQueryChange(e);
                if (
                  e.target.value.trim().length > 0 &&
                  e.target.value.trim().length < 5
                ) {
                  onSetLocalValidationErrors((prev) => ({
                    ...prev,
                    query_title: ts("queryTitleError"),
                  }));
                } else {
                  onSetLocalValidationErrors((prev) => {
                    const { query_title, ...rest } = prev;
                    return rest;
                  });
                }
              }}
              disabled={requestQueryLoading}
              maxLength={100}
              autoFocus
            />
            {(requestQueryErrors.query_title ||
              localValidationErrors.query_title) && (
              <span className="cw-query-error">
                {localValidationErrors.query_title ||
                  requestQueryErrors.query_title}
              </span>
            )}
          </div>

          <div className="cw-query-field">
            <label className="cw-query-label">
              <FileText size={13} />
              {ts("describeIssue")}
            </label>
            <textarea
              className={`cw-query-textarea ${
                requestQueryErrors.query_description ||
                localValidationErrors.query_description
                  ? "has-error"
                  : ""
              }`}
              name="query_description"
              placeholder={ts("describeIssuePlaceholder")}
              value={requestQuery.query_description}
              onChange={(e) => {
                onRequestQueryChange(e);
                if (
                  e.target.value.trim().length > 0 &&
                  e.target.value.trim().length < 10
                ) {
                  onSetLocalValidationErrors((prev) => ({
                    ...prev,
                    query_description: ts("queryDescriptionError"),
                  }));
                } else {
                  onSetLocalValidationErrors((prev) => {
                    const { query_description, ...rest } = prev;
                    return rest;
                  });
                }
              }}
              disabled={requestQueryLoading}
              maxLength={1000}
              rows={4}
            />
            {(requestQueryErrors.query_description ||
              localValidationErrors.query_description) && (
              <span className="cw-query-error">
                {localValidationErrors.query_description ||
                  requestQueryErrors.query_description}
              </span>
            )}
          </div>

          {localValidationErrors.category && (
            <span className="cw-query-error">
              {localValidationErrors.category}
            </span>
          )}

          <button
            type="submit"
            className="cw-query-submit-btn"
            disabled={
              requestQueryLoading ||
              !requestQuery.category ||
              !isValidQueryTitle(requestQuery.query_title) ||
              !isValidQueryDescription(requestQuery.query_description)
            }
          >
            {requestQueryLoading ? (
              <>
                <Loader2 size={15} className="cw-spin" />
                {ts("submitting")}
              </>
            ) : (
              <>
                <Send size={15} />
                {ts("submitQuery")}
              </>
            )}
          </button>
        </form>
      </div>
    );
  }

  return null;
}

export default RaiseAQueryModule;
