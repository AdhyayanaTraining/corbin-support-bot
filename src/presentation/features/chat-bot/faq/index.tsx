/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {
  MessageSquare,
  Folder,
  FileText,
  MessageSquareWarning,
  ZoomIn,
  ChevronDown,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import type {
  FAQ,
  FAQCategory,
  FAQQuestion,
} from "@/src/application/faq/faq.types";
import type {
  FlowStep,
  ActiveTopicCategory,
  Translations,
  FAQMessageBlock,
} from "../types";
import "./style.css";

interface FaqModuleProps {
  flowStep: FlowStep;
  faqsLoading: boolean;
  faqs: FAQ[];
  selectedFAQ: FAQ | null;
  selectedCategory: FAQCategory | null;
  selectedQuestion: FAQQuestion | null;
  activeCategory: ActiveTopicCategory | null;
  selectedLanguage: string;
  ts: (key: keyof Translations) => string;
  getLocalizedText: (value: any, language: string) => string;
  getLatestAnswerBlocks: (
    question: FAQQuestion,
    language: string,
  ) => FAQMessageBlock[];
  formatParagraphText: (text: string) => string;
  onFaqSelect: (faq: FAQ) => void;
  onCategorySelect: (cat: FAQCategory) => void;
  onQuestionSelect: (q: FAQQuestion | null) => void;
  onShowSatisfaction: () => void;
  onSetPreviewImage: (url: string) => void;
}

export function FaqModule({
  flowStep,
  faqsLoading,
  faqs,
  selectedFAQ,
  selectedCategory,
  selectedQuestion,
  activeCategory,
  selectedLanguage,
  ts,
  getLocalizedText,
  getLatestAnswerBlocks,
  formatParagraphText,
  onFaqSelect,
  onCategorySelect,
  onQuestionSelect,
  onShowSatisfaction,
  onSetPreviewImage,
}: FaqModuleProps) {
  // Button is disabled ONLY if there is no selected category AND no active topic from storage
  const helpDisabled = !selectedCategory && !activeCategory;

  if (flowStep === "faq-list") {
    return (
      <div className="cw-faqlist-wrap">
        <div className="cw-section-title">
          <span className="cw-section-icon">
            <MessageSquare size={15} />
          </span>
          {ts("pickQuestion")}
        </div>
        {faqsLoading && (
          <div className="cw-skeleton-list">
            {[0, 1, 2].map((i) => (
              <div key={i} className="cw-skeleton-row" />
            ))}
          </div>
        )}
        {!faqsLoading && faqs.length === 0 && (
          <div className="cw-empty-state">No FAQs available yet.</div>
        )}
        {!faqsLoading && faqs.length > 0 && (
          <div className="cw-faqlist-items">
            {faqs
              .filter((f) => f.isActiveFAQ)
              .map((faq, i) => (
                <button
                  key={faq.faq_generated_id || i}
                  className="cw-faqlist-item"
                  style={{ animationDelay: `${i * 0.05}s` }}
                  onClick={() => onFaqSelect(faq)}
                  type="button"
                >
                  <MessageSquare size={14} />
                  <span>
                    {getLocalizedText(
                      faq.faq_default_question,
                      selectedLanguage || "en",
                    )}
                  </span>
                </button>
              ))}
          </div>
        )}
        <button
          className="cw-help-btn"
          onClick={onShowSatisfaction}
          type="button"
          disabled={helpDisabled}
        >
          <MessageSquareWarning size={16} className="cw-help-btn-icon" />
          <span className="cw-help-btn-text">
            <span>{ts("cantFindAnswer")}</span>
            <span className="cw-help-btn-sub">{ts("talkToSupportTeam")}</span>
          </span>
        </button>
      </div>
    );
  }

  if (flowStep === "faq-categories" && selectedFAQ) {
    const cats = selectedFAQ.categories || [];
    return (
      <div className="cw-faqlist-wrap">
        <div className="cw-section-title">
          <span className="cw-section-icon">
            <Folder size={15} />
          </span>
          {ts("categories")}
        </div>
        {cats.length === 0 ? (
          <div className="cw-empty-state">{ts("noCategoriesYet")}</div>
        ) : (
          <div className="cw-faqlist-items">
            {cats.map((cat, i) => (
              <button
                key={cat.category_generated_id || i}
                className={`cw-faqlist-item ${
                  activeCategory?.id &&
                  cat.category_generated_id &&
                  activeCategory.id === cat.category_generated_id
                    ? "cw-faqlist-item--active"
                    : ""
                }`}
                style={{ animationDelay: `${i * 0.05}s` }}
                onClick={() => onCategorySelect(cat)}
                type="button"
              >
                <Folder size={14} />
                <span>
                  {getLocalizedText(cat.topic_name, selectedLanguage || "en") ||
                    ts("unknown")}
                </span>
              </button>
            ))}
          </div>
        )}
        <button
          className="cw-help-btn"
          onClick={onShowSatisfaction}
          type="button"
          disabled={helpDisabled}
        >
          <MessageSquareWarning size={16} className="cw-help-btn-icon" />
          <span className="cw-help-btn-text">
            <span>{ts("needMoreHelp")}</span>
            <span className="cw-help-btn-sub">Contact our support team</span>
          </span>
        </button>
      </div>
    );
  }

  if (flowStep === "faq-questions" && selectedCategory) {
    const questions = selectedCategory.questions || [];
    return (
      <div className="cw-faqlist-wrap">
        <div className="cw-section-title">
          <span className="cw-section-icon">
            <FileText size={15} />
          </span>
          {getLocalizedText(
            selectedCategory.topic_name,
            selectedLanguage || "en",
          ) || ts("questions")}
        </div>

        {questions.length === 0 ? (
          <div className="cw-empty-state">{ts("noQuestionsYet")}</div>
        ) : (
          <div className="cw-faq-accordion">
            {questions.map((q, i) => {
              const isOpen =
                selectedQuestion?.question_generated_id ===
                q.question_generated_id;
              const blocks = getLatestAnswerBlocks(q, selectedLanguage || "en");

              return (
                <div
                  key={q.question_generated_id || i}
                  className={`cw-faq-accordion-item ${
                    isOpen ? "cw-faq-accordion-item--open" : ""
                  }`}
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <button
                    className="cw-faq-accordion-header"
                    onClick={() => onQuestionSelect(isOpen ? null : q)}
                    type="button"
                    aria-expanded={isOpen}
                  >
                    <FileText size={14} className="cw-faq-accordion-icon" />
                    <span className="cw-faq-accordion-question">
                      {getLocalizedText(
                        q.question_text,
                        selectedLanguage || "en",
                      )}
                    </span>
                    <ChevronDown
                      size={16}
                      className={`cw-faq-accordion-chevron ${
                        isOpen ? "cw-faq-accordion-chevron--open" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="cw-faq-accordion-content">
                      {blocks.length > 0 ? (
                        <div className="cw-article cw-article--inline">
                          {blocks.map((block, bi) =>
                            block.type === "paragraph" ? (
                              <div key={bi} className="cw-article-paragraph">
                                <ReactMarkdown
                                  remarkPlugins={[remarkGfm]}
                                  rehypePlugins={[rehypeHighlight]}
                                >
                                  {formatParagraphText(block.text || "")}
                                </ReactMarkdown>
                              </div>
                            ) : (
                              block.image_url && (
                                <figure key={bi} className="cw-article-figure">
                                  <button
                                    type="button"
                                    className="cw-article-image-btn"
                                    onClick={() =>
                                      onSetPreviewImage(block.image_url!)
                                    }
                                    aria-label="Open image in full screen"
                                  >
                                    <img
                                      src={block.image_url}
                                      alt={`Illustration ${bi + 1}`}
                                      className="cw-article-image"
                                      loading="lazy"
                                    />
                                    <span className="cw-article-image-zoom">
                                      <ZoomIn size={14} />
                                    </span>
                                  </button>
                                </figure>
                              )
                            ),
                          )}
                        </div>
                      ) : (
                        <p className="cw-answer-empty">{ts("noAnswerYet")}</p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <button
          className="cw-help-btn"
          onClick={onShowSatisfaction}
          type="button"
          disabled={helpDisabled}
        >
          <MessageSquareWarning size={16} className="cw-help-btn-icon" />
          <span className="cw-help-btn-text">
            <span>{ts("needMoreHelp")}</span>
            <span className="cw-help-btn-sub">Contact our support team</span>
          </span>
        </button>
      </div>
    );
  }

  return null;
}

export default FaqModule;
