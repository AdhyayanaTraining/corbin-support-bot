/* eslint-disable react-hooks/static-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext } from "react";
import {
  User,
  Phone,
  Mail,
  Check,
  Bot,
  Loader2,
  Pencil,
  Users,
  MessageSquare,
  CheckCheck,
  PartyPopper,
  DoorOpen,
  Home,
  FileText,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import type {
  User as ExpertUser,
  ExpertCategory,
} from "@/src/application/users/user.types";
import type {
  FlowStep,
  MentorFormStep,
  SatisfactionStage,
  ContactDetails,
  Translations,
  Message,
} from "../types";
import { ChatbotSettingContext } from "@/src/application/chatbot-setting/chatbot_setting.context";
import "./style.css";

const MENTOR_STEPS: {
  key: MentorFormStep;
  labelKey: keyof Translations;
  icon: React.JSX.Element;
}[] = [
  { key: "name", labelKey: "name", icon: <User size={12} /> },
  { key: "mobile", labelKey: "mobile", icon: <Phone size={12} /> },
  { key: "email", labelKey: "email", icon: <Mail size={12} /> },
];

interface MessageRendererProps {
  message: Message;
  onImageClick: (url: string) => void;
}

// Inline MessageRenderer helper
function MessageRenderer({ message, onImageClick }: MessageRendererProps) {
  if (message.answerBlocks && message.answerBlocks.length > 0) {
    return (
      <div className="cw-article">
        {message.answerBlocks.map((block, index) => {
          if (block.type === "paragraph") {
            return (
              <div key={index} className="cw-article-paragraph">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight]}
                >
                  {block.text || ""}
                </ReactMarkdown>
              </div>
            );
          }
          if (block.type === "image" && block.image_url) {
            return (
              <figure key={index} className="cw-article-figure">
                <button
                  type="button"
                  className="cw-article-image-btn"
                  onClick={() => onImageClick(block.image_url!)}
                  aria-label="Open image in full screen"
                >
                  <img
                    src={block.image_url}
                    alt={`Illustration ${index + 1}`}
                    className="cw-article-image"
                    loading="lazy"
                  />
                </button>
              </figure>
            );
          }
          return null;
        })}
      </div>
    );
  }

  return (
    <>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
      >
        {message.text}
      </ReactMarkdown>
      {message.images && message.images.length > 0 && (
        <div className="cw-bubble-images">
          {message.images.map((img: string, idx: number) => (
            <img
              key={idx}
              src={img}
              alt={`Image ${idx + 1}`}
              className="cw-bubble-image"
              onClick={() => onImageClick(img)}
            />
          ))}
        </div>
      )}
    </>
  );
}

interface ChatWithNemoModuleProps {
  flowStep: FlowStep;
  ts: (key: keyof Translations) => string;
  t: (key: keyof Translations) => any;
  savedContact: ContactDetails | null;
  displayContact: ContactDetails;
  mentorFormStep: MentorFormStep;
  isSavingContact: boolean;
  hasActiveConversation: boolean;
  selectedConversation: any;
  autoSelectedExpert: ExpertUser | null;
  expertCategories: ExpertCategory[];
  expertsLoading: boolean;
  connectingCategoryId: string | null;
  chatbotMessages: any[];
  messages: Message[];
  mentorMessages: any[];
  conversationEnded: boolean;
  satisfactionStage: SatisfactionStage;
  showConversationHistory: boolean;
  isTyping: boolean;
  chatbotLoading: boolean;
  faqSearchLoading: boolean;
  onEditContact: () => void;
  onChatWithBot: () => void;
  onStartQueryForm: () => void;
  onEndChat: () => void;
  onResumeConversation: () => void;
  onStartNewMentorTopic: () => void;
  onMentorCategorySelect: (cat: ExpertCategory) => void;
  onRaiseQueryFromEnd: () => void;
  onConversationSatisfied: () => void;
  onBackToHome: () => void;
  onExitChat: () => void;
  onSetPreviewImage: (url: string) => void;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

export function ChatWithNemoModule({
  flowStep,
  ts,
  t,
  savedContact,
  displayContact,
  mentorFormStep,
  isSavingContact,
  hasActiveConversation,
  selectedConversation,
  autoSelectedExpert,
  expertCategories,
  expertsLoading,
  connectingCategoryId,
  chatbotMessages,
  messages,
  mentorMessages,
  conversationEnded,
  satisfactionStage,
  showConversationHistory,
  isTyping,
  chatbotLoading,
  faqSearchLoading,
  onEditContact,
  onChatWithBot,
  onStartQueryForm,
  onEndChat,
  onResumeConversation,
  onStartNewMentorTopic,
  onMentorCategorySelect,
  onRaiseQueryFromEnd,
  onConversationSatisfied,
  onBackToHome,
  onExitChat,
  onSetPreviewImage,
  messagesEndRef,
}: ChatWithNemoModuleProps) {
  // Get chatbot settings for dynamic profile image
  const chatbotSettingContext = useContext(ChatbotSettingContext);
  const welcomeImage = chatbotSettingContext?.settings?.welcome_image;

  // Bot Avatar Component with dynamic image
  const BotAvatar = ({ size = 13 }: { size?: number }) => {
    if (welcomeImage) {
      return (
        <img
          src={welcomeImage}
          alt="Bot"
          style={{
            width: size,
            height: size,
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />
      );
    }
    return <Bot size={size} />;
  };

  // Render sub-flow cards
  const renderFlowContent = () => {
    if (flowStep === "mentor-form") {
      const ci = MENTOR_STEPS.findIndex((s) => s.key === mentorFormStep);
      return (
        <div className="cw-progress-card">
          {MENTOR_STEPS.map((s, i) => (
            <div
              key={s.key}
              className={`cw-progress-step ${i < ci ? "is-done" : ""} ${
                i === ci ? "is-active" : ""
              }`}
            >
              <span className="cw-progress-dot">
                {i < ci ? <Check size={12} /> : s.icon}
              </span>
              <span className="cw-progress-label">{ts(s.labelKey)}</span>
              {i < MENTOR_STEPS.length - 1 && (
                <span className="cw-progress-line" />
              )}
            </div>
          ))}
          {isSavingContact && (
            <div className="cw-saving-indicator">
              <Loader2 size={12} className="cw-spin" />
              {ts("saving")}
            </div>
          )}
        </div>
      );
    }

    if (flowStep === "mentor-options") {
      return (
        <div className="cw-options-wrap">
          <div className="cw-contact-summary">
            <div className="cw-contact-row">
              <User size={13} />
              <span>{displayContact.name}</span>
            </div>
            <div className="cw-contact-row">
              <Phone size={13} />
              <span>{displayContact.mobile}</span>
            </div>
            <div className="cw-contact-row">
              <Mail size={13} />
              <span>{displayContact.email}</span>
            </div>
            <button
              className="cw-edit-contact-link"
              onClick={onEditContact}
              type="button"
            >
              <Pencil size={11} />
              {ts("notYou")}
            </button>
          </div>
          <button
            className="cw-option-btn cw-option-chat"
            onClick={onChatWithBot}
            type="button"
          >
            <div className="cw-option-icon">
              <Bot size={20} />
            </div>
            <div className="cw-option-text">
              <span className="cw-option-label">{ts("chatWithBot")}</span>
              <span className="cw-option-desc">{ts("chatWithBotDesc")}</span>
            </div>
          </button>
          <button
            className="cw-option-btn cw-option-query"
            onClick={onStartQueryForm}
            type="button"
          >
            <div className="cw-option-icon">
              <FileText size={20} />
            </div>
            <div className="cw-option-text">
              <span className="cw-option-label">{ts("raiseQuery")}</span>
              <span className="cw-option-desc">{ts("raiseQueryDesc")}</span>
            </div>
          </button>
          <button
            className="cw-option-btn cw-option-end"
            onClick={onEndChat}
            type="button"
          >
            <div className="cw-option-icon">
              <DoorOpen size={20} />
            </div>
            <div className="cw-option-text">
              <span className="cw-option-label">{ts("endChat")}</span>
              <span className="cw-option-desc">{ts("endChatDesc")}</span>
            </div>
          </button>
        </div>
      );
    }

    if (flowStep === "mentor-resume-choice") {
      return (
        <div className="cw-options-wrap">
          <button
            className="cw-option-btn cw-option-chat"
            onClick={onResumeConversation}
            type="button"
          >
            <div className="cw-option-icon">
              <MessageSquare size={20} />
            </div>
            <div className="cw-option-text">
              <span className="cw-option-label">
                {ts("resumeConversation")}
              </span>
              <span className="cw-option-desc">
                {(t("resumeConversationDesc") as (name: string) => string)(
                  autoSelectedExpert?.name ??
                    selectedConversation?.category_name ??
                    "your mentor",
                )}
              </span>
            </div>
          </button>
          <button
            className="cw-option-btn cw-option-mentor"
            onClick={onStartNewMentorTopic}
            type="button"
          >
            <div className="cw-option-icon">
              <Users size={20} />
            </div>
            <div className="cw-option-text">
              <span className="cw-option-label">{ts("startNewTopic")}</span>
              <span className="cw-option-desc">{ts("startNewTopicDesc")}</span>
            </div>
          </button>
        </div>
      );
    }

    if (flowStep === "mentor-topics") {
      return (
        <div className="cw-categories-wrap">
          <div className="cw-section-title">
            <span className="cw-section-icon">
              <Users size={15} />
            </span>
            {ts("pickTopic")}
          </div>
          {expertsLoading && (
            <div className="cw-skeleton-list">
              {[0, 1, 2].map((i) => (
                <div key={i} className="cw-skeleton-card" />
              ))}
            </div>
          )}
          {!expertsLoading && expertCategories.length === 0 && (
            <div className="cw-empty-state">{ts("noMentorCategories")}</div>
          )}
          {!expertsLoading && expertCategories.length > 0 && (
            <div className="cw-categories-grid">
              {expertCategories.map((cat, i) => {
                const catKey = cat.category_generated_id ?? cat.name;
                const isConnectingThis = connectingCategoryId === catKey;
                return (
                  <button
                    key={cat.category_generated_id ?? i}
                    className={`cw-category-card ${
                      isConnectingThis ? "is-connecting" : ""
                    }`}
                    style={{ animationDelay: `${i * 0.06}s` }}
                    onClick={() => onMentorCategorySelect(cat)}
                    type="button"
                    disabled={connectingCategoryId !== null}
                  >
                    <span className="cw-category-icon">
                      {isConnectingThis ? (
                        <Loader2 size={18} className="cw-spin" />
                      ) : (
                        <Users size={18} />
                      )}
                    </span>
                    <span className="cw-category-name">
                      {cat.name}
                      {isConnectingThis && (
                        <span className="cw-category-status">
                          {ts("connecting")}
                        </span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <>
      {flowStep === "live-chat"
        ? chatbotMessages.map((cm, i) => (
            <div
              key={cm.id || `chat-${i}`}
              className={`cw-msg ${cm.role === "user" ? "cw-msg--user" : ""}`}
            >
              <div
                className={`cw-avatar ${
                  cm.role === "assistant" ? "cw-avatar--bot" : "cw-avatar--user"
                }`}
              >
                {cm.role === "assistant" ? (
                  <BotAvatar size={13} />
                ) : (
                  <User size={12} />
                )}
              </div>

              <div
                className={`cw-bubble ${
                  cm.role === "assistant" ? "cw-bubble--bot" : "cw-bubble--user"
                } ${
                  cm.answerBlocks && cm.answerBlocks.length > 0
                    ? "cw-bubble--article"
                    : ""
                }`}
              >
                {cm.role === "assistant" &&
                cm.answerBlocks &&
                cm.answerBlocks.length > 0 ? (
                  <MessageRenderer
                    message={{
                      id: cm.id || `chat-${i}`,
                      sender: "bot",
                      text: cm.content,
                      answerBlocks: cm.answerBlocks,
                    }}
                    onImageClick={onSetPreviewImage}
                  />
                ) : cm.role === "assistant" ? (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeHighlight]}
                  >
                    {cm.content}
                  </ReactMarkdown>
                ) : (
                  cm.content
                )}
              </div>
            </div>
          ))
        : showConversationHistory &&
          messages.map((m) => (
            <div
              key={m.id}
              className={`cw-msg ${m.sender === "user" ? "cw-msg--user" : ""}`}
            >
              <div
                className={`cw-avatar ${
                  m.sender === "bot" ? "cw-avatar--bot" : "cw-avatar--user"
                }`}
              >
                {m.sender === "bot" ? (
                  <BotAvatar size={13} />
                ) : (
                  <User size={12} />
                )}
              </div>

              <div
                className={`cw-bubble ${
                  m.sender === "bot" ? "cw-bubble--bot" : "cw-bubble--user"
                } ${
                  m.answerBlocks && m.answerBlocks.length > 0
                    ? "cw-bubble--article"
                    : ""
                }`}
              >
                {m.sender === "bot" &&
                m.answerBlocks &&
                m.answerBlocks.length > 0 ? (
                  <MessageRenderer
                    message={m}
                    onImageClick={onSetPreviewImage}
                  />
                ) : m.sender === "bot" ? (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeHighlight]}
                  >
                    {m.text}
                  </ReactMarkdown>
                ) : (
                  m.text
                )}
              </div>
            </div>
          ))}

      {/* Mentor Chat */}
      {flowStep === "mentor-chat" && (
        <>
          {conversationEnded && (
            <div className="cw-conversation-ended">
              <Check size={14} />
              {ts("conversationEnded")}
            </div>
          )}

          {mentorMessages
            .filter(
              (mm, idx, self) =>
                idx ===
                self.findIndex(
                  (m) => m.message_generated_id === mm.message_generated_id,
                ),
            )
            .map((mm, i) => {
              const iv = mm.sender === "VISITOR";

              const uniqueMentorMessages = mentorMessages.filter(
                (mm2, idx2, self2) =>
                  idx2 ===
                  self2.findIndex(
                    (m) => m.message_generated_id === mm2.message_generated_id,
                  ),
              );

              const lastIdx = uniqueMentorMessages.length - 1;
              const isLastVisitorMsg = iv && i === lastIdx;

              return (
                <div
                  key={
                    mm.message_generated_id
                      ? `${mm.message_generated_id}-${i}`
                      : `m-${i}`
                  }
                  className={`cw-msg ${iv ? "cw-msg--user" : ""}`}
                >
                  <div
                    className={`cw-avatar ${
                      iv ? "cw-avatar--user" : "cw-avatar--bot"
                    }`}
                  >
                    {iv ? <User size={12} /> : <Users size={13} />}
                  </div>

                  <div
                    className={`cw-bubble ${
                      iv ? "cw-bubble--user" : "cw-bubble--bot"
                    }`}
                  >
                    {mm.message}

                    {iv && isLastVisitorMsg && (
                      <div className="cw-message-status">
                        {mm.is_read ? (
                          <CheckCheck size={12} className="cw-status-read" />
                        ) : (
                          <Check size={12} className="cw-status-pending" />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

          {/* Conversation Ended - Satisfaction */}
          {conversationEnded && satisfactionStage === "ask" && (
            <div className="cw-post-chat-actions">
              <p className="cw-post-chat-text">{ts("wasHelpful")}</p>

              <div className="cw-post-chat-buttons">
                <button
                  className="cw-btn cw-btn--query"
                  onClick={onRaiseQueryFromEnd}
                  type="button"
                >
                  <FileText size={14} />
                  {ts("raiseQueryEnd")}
                </button>

                <button
                  className="cw-btn cw-btn--satisfied"
                  onClick={onConversationSatisfied}
                  type="button"
                >
                  <Check size={14} />
                  {ts("allGoodThanks")}
                </button>
              </div>
            </div>
          )}

          {/* Conversation Closed */}
          {conversationEnded && satisfactionStage === "closed" && (
            <div className="cw-post-chat-actions cw-post-chat-actions--closed">
              <div className="cw-post-chat-icon">
                <PartyPopper size={20} />
              </div>

              <p className="cw-post-chat-text">{ts("thanksForChatting")}</p>

              <div className="cw-post-chat-buttons">
                <button
                  className="cw-btn cw-btn--home"
                  onClick={onBackToHome}
                  type="button"
                >
                  <Home size={14} />
                  {ts("backToHome")}
                </button>

                <button
                  className="cw-btn cw-btn--exit"
                  onClick={onExitChat}
                  type="button"
                >
                  <DoorOpen size={14} />
                  {ts("exitChat")}
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Render Sub Flow Cards */}
      {renderFlowContent()}

      {/* Typing / Loading Indicator */}
      {showConversationHistory &&
        (isTyping || chatbotLoading || faqSearchLoading) && (
          <div className="cw-msg">
            <div className="cw-avatar cw-avatar--bot">
              <BotAvatar size={13} />
            </div>

            <div className="cw-typing">
              <span />
              <span />
              <span />
            </div>
          </div>
        )}

      <div ref={messagesEndRef} />
    </>
  );
}

export default ChatWithNemoModule;
