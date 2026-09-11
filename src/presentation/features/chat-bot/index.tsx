/* eslint-disable react/jsx-no-comment-textnodes */
/* eslint-disable react-hooks/immutability */
/* eslint-disable react-hooks/preserve-manual-memoization */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  useState,
  useRef,
  useEffect,
  FormEvent,
  ChangeEvent,
  useCallback,
  useContext,
} from "react";
import {
  User,
  X,
  ArrowLeft,
  Send,
  Phone,
  Mail,
  Bot,
  Check,
  Loader2,
  Home,
  Folder,
  MessageSquare,
} from "lucide-react";
import "highlight.js/styles/github.css";
import "./style.css";

import { FAQProvider, useFAQ } from "@/src/application/faq/FaqContext";
import {
  ChatbotProvider,
  useChatbot,
} from "@/src/application/chat-bot/ChatbotContext";
import {
  WebsiteUserProvider,
  useWebsiteUser,
} from "@/src/application/website-users/WebsiteUserContext";
import {
  RequestQueryProvider,
  useRequestQuery,
} from "@/src/application/request_a_query/RequestQueryContext";
import RequestQueryService from "@/src/application/request_a_query/requestQuery.service";
import type { RequestQuery } from "@/src/application/request_a_query/requestQuery.types";
import { ChatProvider, useChat } from "@/src/application/live-chat/ChatContext";
import { UserProvider, useUser } from "@/src/application/users/UserContext";
import {
  ChatbotSettingProvider,
  ChatbotSettingContext,
} from "@/src/application/chatbot-setting/chatbot_setting.context";
import type {
  FAQ,
  FAQCategory,
  FAQQuestion,
} from "@/src/application/faq/faq.types";
import type {
  User as ExpertUser,
  ExpertCategory,
} from "@/src/application/users/user.types";

import type {
  Sender,
  FAQMessageBlock,
  Message,
  FlowStep,
  MentorFormStep,
  SatisfactionStage,
  ContactDetails,
  ActiveTopicCategory,
  ValidationErrors,
  SupportedLanguage,
  Translations,
} from "./types";

import FaqModule from "./faq";
import ChatWithNemoModule from "./chat-with-nemo";
import RaiseAQueryModule from "./raise-a-query";
import LanguageModule, {
  LanguageDropdown,
  LANGUAGES,
  LANGUAGE_STORAGE_KEY,
  translations,
  getTranslation,
  getLocalizedText,
} from "./language";

// Custom hook for chatbot settings
const useChatbotSetting = () => {
  const context = useContext(ChatbotSettingContext);
  if (context === undefined) {
    throw new Error(
      "useChatbotSetting must be used within a ChatbotSettingProvider",
    );
  }
  return context;
};

const convertAnswerToBlocks = (
  answer: any,
  language: string,
): FAQMessageBlock[] => {
  const blocks: FAQMessageBlock[] = [];

  if (answer.answer_description && Array.isArray(answer.answer_description)) {
    for (const block of answer.answer_description) {
      if (block.type === "paragraph") {
        const content = block.text || block.content;
        const text = getLocalizedText(content, language);

        if (text) {
          blocks.push({
            type: "paragraph",
            text,
          });
        }
      } else if (block.type === "image" && block.image_url) {
        blocks.push({
          type: "image",
          image_url: block.image_url,
        });
      }
    }
    return blocks;
  }

  return blocks;
};

const getLatestAnswerBlocks = (
  question: FAQQuestion,
  language: string,
): FAQMessageBlock[] => {
  const answers = question.answers || [];
  if (answers.length === 0) return [];

  for (let i = answers.length - 1; i >= 0; i--) {
    const blocks = convertAnswerToBlocks(answers[i], language);
    if (blocks.length > 0) return blocks;
  }
  return [];
};

const getPlainTextFromBlocks = (blocks: FAQMessageBlock[]): string => {
  return blocks
    .filter((block) => block.type === "paragraph")
    .map((block) => block.text || "")
    .join("\n\n");
};

const formatParagraphText = (text: string): string => {
  if (!text) return "";

  const markerRegex = /(\d{1,2})\.\s+/g;
  const matches = [...text.matchAll(markerRegex)];

  if (matches.length < 2) return text;

  const preamble = text.slice(0, matches[0].index).trim();

  const items: string[] = [];
  for (let i = 0; i < matches.length; i++) {
    const marker = matches[i];
    const contentStart = marker.index! + marker[0].length;
    const contentEnd =
      i + 1 < matches.length ? matches[i + 1].index! : text.length;
    const itemText = text.slice(contentStart, contentEnd).trim();
    if (itemText) items.push(`${marker[1]}. ${itemText}`);
  }

  if (items.length < 2) return text;

  const listMarkdown = items.join("\n");
  return preamble ? `${preamble}\n\n${listMarkdown}` : listMarkdown;
};

const isValidName = (value: string) => {
  const name = value.trim();
  if (name.length < 3) return false;
  return /^[A-Za-z\s'-]+$/.test(name);
};

const isValidMobile = (value: string) => {
  return /^[0-9]{10,15}$/.test(value.trim());
};

const isValidEmail = (value: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
};

const isValidQueryTitle = (value: string) => {
  const title = value.trim();
  return title.length >= 5 && title.length <= 100;
};

const isValidQueryDescription = (value: string) => {
  const desc = value.trim();
  return desc.length >= 10 && desc.length <= 1000;
};

const isValidChatMessage = (value: string) => {
  return value.trim().length > 0 && value.trim().length <= 1000;
};

const sanitizeName = (value: string) => {
  return value.trim().replace(/\s+/g, " ");
};

const getOrdinalSuffix = (n: number): string => {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
};

const CONTACT_STORAGE_KEY = "nimobot_contact_details";
const FAQ_TOPIC_STORAGE_KEY = "nimobot_selected_faq_topic";
const QUERY_STORAGE_KEY = "nimobot_submitted_queries"; // <-- added
const LAUNCHER_SIZE = 84;

// LauncherBotVideo - UNCHANGED
function LauncherBotVideo({ onClick }: { onClick: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const dpr =
      typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
    const backing = Math.round(LAUNCHER_SIZE * Math.max(dpr, 2));
    canvas.width = backing;
    canvas.height = backing;

    let active = true;

    const LOW = 12;
    const HIGH = 42;

    const drawFrame = () => {
      if (!active) return;
      rafRef.current = requestAnimationFrame(drawFrame);
      if (video.readyState < 2) return;

      const vw = video.videoWidth || backing;
      const vh = video.videoHeight || backing;
      const scale = Math.max(backing / vw, backing / vh);
      const dw = vw * scale;
      const dh = vh * scale;
      const dx = (backing - dw) / 2;
      const dy = (backing - dh) / 2;

      ctx.clearRect(0, 0, backing, backing);
      ctx.drawImage(video, dx, dy, dw, dh);

      const frame = ctx.getImageData(0, 0, backing, backing);
      const data = frame.data;
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const luma = 0.299 * r + 0.587 * g + 0.114 * b;
        if (luma <= LOW) {
          data[i + 3] = 0;
        } else if (luma < HIGH) {
          const t = (luma - LOW) / (HIGH - LOW);
          data[i + 3] = Math.round(data[i + 3] * t);
        }
      }
      ctx.putImageData(frame, 0, 0);
    };

    video.play().catch(() => {});
    rafRef.current = requestAnimationFrame(drawFrame);

    return () => {
      active = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <button
      className="cw-launcher"
      onClick={onClick}
      type="button"
      aria-label="Open chat"
    >
      <video
        ref={videoRef}
        src="/changed-bot.mp4"
        loop
        muted
        playsInline
        autoPlay
        style={{ display: "none" }}
      />
      <canvas ref={canvasRef} className="cw-launcher-canvas" />
    </button>
  );
}

// NimoBotProfile - Updated to use dynamic image
function NimoBotProfile({ welcomeImage }: { welcomeImage?: string }) {
  return (
    <div className="cw-nimo-profile">
      <img
        src={welcomeImage || "/bot-standing-image.png"}
        alt="Bot"
        className="cw-nimo-profile-img"
        style={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          objectFit: "cover",
        }}
      />
    </div>
  );
}

// ImagePreviewModal
function ImagePreviewModal({
  imageUrl,
  onClose,
}: {
  imageUrl: string | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!imageUrl) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [imageUrl, onClose]);

  if (!imageUrl) return null;

  return (
    <div
      className="cw-image-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Image preview"
    >
      <div className="cw-image-modal" onClick={(e) => e.stopPropagation()}>
        <button
          className="cw-image-modal-close"
          onClick={onClose}
          type="button"
          aria-label="Close image preview"
        >
          <X size={20} />
        </button>
        <img src={imageUrl} alt="Preview" className="cw-image-modal-img" />
      </div>
    </div>
  );
}

// ChatWidgetInner
function ChatWidgetInner() {
  const {
    faqs,
    loading: faqsLoading,
    searchFAQs,
    faqSearchLoading,
    setLanguage: setFAQLanguage,
  } = useFAQ();
  const {
    messages: chatbotMessages,
    question: chatbotQuestion,
    errors: chatbotErrors,
    loading: chatbotLoading,
    handleChange: handleChatbotChange,
    askQuestion,
    addMessage,
    resetForm: resetChatbotForm,
    clearQuestionInput,
    changeLanguage,
    selectedLanguage,
  } = useChatbot();
  const {
    handleChange: handleWebsiteUserChange,
    addWebsiteUser,
    resetForm: resetWebsiteUserForm,
    totalSessions,
    clearMessages: clearWebsiteUserMessages,
  } = useWebsiteUser();
  const {
    requestQuery,
    errors: requestQueryErrors,
    loading: requestQueryLoading,
    handleChange: handleRequestQueryChange,
    addRequestQuery,
    resetForm: resetRequestQueryForm,
  } = useRequestQuery();
  const {
    messages: mentorMessages,
    conversations,
    selectedConversation,
    message: mentorMessage,
    errors: mentorErrors,
    setSelectedConversation,
    handleMessageChange: handleMentorMessageChange,
    resetConversation: resetMentorConversation,
    resetMessage: resetMentorMessage,
    createConversation,
    getVisitorConversations,
    sendMessage: sendMentorMessage,
    getConversationMessages,
    joinRoom,
    leaveRoom,
  } = useChat();
  const {
    expertCategories,
    getExpertCategories,
    getExpertsByCategory,
    getExpertsByCategoryId,
    loading: expertsLoading,
  } = useUser();

  // Get chatbot settings for dynamic profile image and welcome message
  const { settings: chatbotSettings } = useChatbotSetting();

  const isEmbedded =
    typeof window !== "undefined" && window.self !== window.top;
  const [isOpen, setIsOpen] = useState(false);
  const [showLanguageSelector, setShowLanguageSelector] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  // ====== Extend FlowStep locally to include "my-queries" ======
  type ExtendedFlowStep = FlowStep | "my-queries";
  const [flowStep, setFlowStep] = useState<ExtendedFlowStep>("faq-list");
  const [selectedFAQ, setSelectedFAQ] = useState<FAQ | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<FAQCategory | null>(
    null,
  );
  const [selectedQuestion, setSelectedQuestion] = useState<FAQQuestion | null>(
    null,
  );
  const [activeCategory, setActiveCategory] =
    useState<ActiveTopicCategory | null>(null);
  const [mentorForm, setMentorForm] = useState<ContactDetails>({
    name: "",
    mobile: "",
    email: "",
    registered_employee_generated_id: "",
  });
  const [mentorFormStep, setMentorFormStep] = useState<MentorFormStep>("name");
  const [formError, setFormError] = useState<string | null>(null);
  const [savedContact, setSavedContact] = useState<ContactDetails | null>(null);
  const [isSavingContact, setIsSavingContact] = useState(false);
  const [submitTrigger, setSubmitTrigger] = useState(0);
  const pendingContactRef = useRef<ContactDetails | null>(null);
  const [querySubmitTrigger, setQuerySubmitTrigger] = useState(0);
  const [autoSelectedExpert, setAutoSelectedExpert] =
    useState<ExpertUser | null>(null);
  const [connectingCategoryId, setConnectingCategoryId] = useState<
    string | null
  >(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasSavedContact = useRef(false);
  const [conversationEnded, setConversationEnded] = useState(false);
  const conversationEndedNotifiedRef = useRef(false);
  const [satisfactionStage, setSatisfactionStage] =
    useState<SatisfactionStage>(null);
  const [hasActiveConversation, setHasActiveConversation] = useState(false);
  const [localValidationErrors, setLocalValidationErrors] =
    useState<ValidationErrors>({});

  // ======================= NEW STATE =======================
  const [userQueries, setUserQueries] = useState<RequestQuery[]>([]);
  const [userQueriesLoading, setUserQueriesLoading] = useState(false);

  const t = useCallback(
    (key: keyof Translations): any => {
      const translate = getTranslation(selectedLanguage, key);
      return translate;
    },
    [selectedLanguage],
  );

  const ts = useCallback(
    (key: keyof Translations): string => {
      const translate = getTranslation(selectedLanguage, key);
      return translate as string;
    },
    [selectedLanguage],
  );

  // Helper function to get welcome message
  const getWelcomeMessage = useCallback(
    (language?: string): string => {
      const fallbackMessage = (
        translations[language as SupportedLanguage] || translations.en
      ).welcomeMessage;
      return chatbotSettings.welcome_message || fallbackMessage;
    },
    [chatbotSettings.welcome_message],
  );

  // ======================= NEW FUNCTION =======================
  const fetchUserQueries = useCallback(async (email: string) => {
    if (!email) return;
    setUserQueriesLoading(true);
    try {
      const response =
        await RequestQueryService.getRequestQueriesByEmail(email);
      if (response?.data) {
        setUserQueries(response.data);
      }
    } catch (error) {
      console.error("Error fetching user queries:", error);
    } finally {
      setUserQueriesLoading(false);
    }
  }, []);

  // Language initialization with dynamic welcome message
  useEffect(() => {
    try {
      const savedLang = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (savedLang && LANGUAGES.some((l) => l.code === savedLang)) {
        changeLanguage(savedLang);
        setFAQLanguage(savedLang);
        setShowLanguageSelector(false);
        const msg = getWelcomeMessage(savedLang);
        setMessages([{ id: "greet-1", sender: "bot", text: msg }]);
      }
    } catch (err) {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getWelcomeMessage]);

  const handleLanguageSelect = useCallback(
    (languageCode: string) => {
      changeLanguage(languageCode);
      setFAQLanguage(languageCode);
      setShowLanguageSelector(false);
      try {
        window.localStorage.setItem(LANGUAGE_STORAGE_KEY, languageCode);
      } catch (err) {}
      const msg = getWelcomeMessage(languageCode);
      setMessages([{ id: "greet-1", sender: "bot", text: msg }]);
    },
    [changeLanguage, setFAQLanguage, getWelcomeMessage],
  );

  // Contact storage
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(CONTACT_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<ContactDetails>;
        if (parsed?.name && parsed?.email && parsed?.mobile) {
          const contact: ContactDetails = {
            name: parsed.name,
            mobile: parsed.mobile,
            email: parsed.email,
            registered_employee_generated_id:
              parsed.registered_employee_generated_id || "",
          };
          setSavedContact(contact);
          if (contact.registered_employee_generated_id)
            getVisitorConversations(contact.registered_employee_generated_id);
          // Fetch user queries on contact load
          if (contact.email) {
            fetchUserQueries(contact.email);
          }
        }
      }
    } catch (err) {}
  }, [fetchUserQueries]);

  // Active topic/category storage
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(FAQ_TOPIC_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { id?: string | null; name?: string };
        if (parsed?.name) {
          setActiveCategory({ id: parsed.id ?? null, name: parsed.name });
        }
      }
    } catch (err) {}
  }, []);

  // Auto-select first main FAQ question on open
  useEffect(() => {
    if (showLanguageSelector) return;
    if (faqsLoading) return;
    if (flowStep !== "faq-list") return;
    if (selectedFAQ) return;
    const activeFaqs = faqs.filter((f) => f.isActiveFAQ);
    const firstFaq = activeFaqs[0] || faqs[0];
    if (!firstFaq) return;
    setSelectedFAQ(firstFaq);
    setSelectedCategory(null);
    setSelectedQuestion(null);
    setFlowStep("faq-categories");
  }, [showLanguageSelector, faqsLoading, flowStep, selectedFAQ, faqs]);

  // Conversation management
  useEffect(() => {
    if (!conversations || conversations.length === 0) {
      setHasActiveConversation(false);
      return;
    }
    const latestConversation = [...conversations].sort(
      (a, b) =>
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
    )[0];
    if (latestConversation) {
      setSelectedConversation(latestConversation);
      if (latestConversation.status === "CLOSED") {
        setHasActiveConversation(false);
        setConversationEnded(true);
      } else {
        setHasActiveConversation(true);
      }
    }
  }, [conversations]);

  // Conversation ended notification
  useEffect(() => {
    if (flowStep !== "mentor-chat") {
      conversationEndedNotifiedRef.current = false;
      return;
    }
    if (
      selectedConversation?.status === "CLOSED" &&
      !conversationEndedNotifiedRef.current
    ) {
      conversationEndedNotifiedRef.current = true;
      setConversationEnded(true);
      setHasActiveConversation(false);
      setSatisfactionStage("ask");
      pushMessage("bot", ts("conversationEnded"));
      simulateTyping(ts("wasHelpful"));
    }
  }, [selectedConversation?.status, flowStep]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, flowStep, chatbotMessages, mentorMessages]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, []);

  // Embedded widget messaging
  useEffect(() => {
    if (!isEmbedded) return;
    window.parent.postMessage(
      { source: "nimobot-widget", type: isOpen ? "OPEN" : "CLOSE" },
      "*",
    );
  }, [isOpen, isEmbedded]);

  // Join/leave chat room
  useEffect(() => {
    const cid = selectedConversation?.conversation_generated_id;
    if (flowStep !== "mentor-chat" || !cid) return;
    joinRoom(cid);
    getConversationMessages(cid);
    return () => {
      leaveRoom(cid);
    };
  }, [flowStep, selectedConversation?.conversation_generated_id]);

  // Push message
  const pushMessage = useCallback(
    (
      sender: Sender,
      text: string,
      images?: string[],
      answerBlocks?: FAQMessageBlock[],
    ) => {
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-${sender}-${Math.random()}`,
          sender,
          text,
          images,
          answerBlocks,
        },
      ]);
    },
    [],
  );

  // Simulate typing
  const simulateTyping = useCallback(
    (text: string, delay = 550) => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
      setIsTyping(true);
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        pushMessage("bot", text);
        typingTimeoutRef.current = null;
      }, delay);
    },
    [pushMessage],
  );

  // Contact form submission
  useEffect(() => {
    if (submitTrigger === 0 || hasSavedContact.current) return;
    let cancelled = false;
    hasSavedContact.current = true;
    setIsSavingContact(true);

    (async () => {
      try {
        const result: any = await addWebsiteUser();
        if (cancelled) return;
        setIsSavingContact(false);

        if (result?.success) {
          const contact = pendingContactRef.current;

          if (contact && result.registeredEmployeeId) {
            const updated: ContactDetails = {
              ...contact,
              registered_employee_generated_id: result.registeredEmployeeId,
            };

            setSavedContact(updated);

            try {
              window.localStorage.setItem(
                CONTACT_STORAGE_KEY,
                JSON.stringify(updated),
              );
            } catch (err) {}

            getVisitorConversations(result.registeredEmployeeId);

            // Fetch user queries after contact saved
            if (updated.email) {
              fetchUserQueries(updated.email);
            }

            if (result.isExistingUser && result.totalSessions) {
              const welcomeMsg = (t("welcomeBack") as (name: string) => string)(
                result.data?.name || contact.name,
              );
              pushMessage("bot", welcomeMsg);

              if (result.totalSessions > 2) {
                const sessionMsg = `This is your ${result.totalSessions}${getOrdinalSuffix(
                  result.totalSessions,
                )} visit!`;
                simulateTyping(sessionMsg);
              }
            } else {
              const thanksMsg = (t("thanksSaved") as (name: string) => string)(
                contact.name,
              );
              pushMessage("bot", thanksMsg);
            }

            setFlowStep("mentor-options");
            hasSavedContact.current = false;
            setIsTyping(false);
          } else {
            setIsTyping(false);
            pushMessage("bot", ts("saveError"));
            setMentorFormStep("email");
            setDraft("");
            setFlowStep("mentor-form");
            hasSavedContact.current = false;
          }
        } else {
          setIsTyping(false);
          pushMessage("bot", result?.message || ts("saveError"));
          setMentorFormStep("email");
          setDraft("");
          setFlowStep("mentor-form");
          hasSavedContact.current = false;
        }
      } catch (err) {
        if (cancelled) return;
        setIsSavingContact(false);
        setIsTyping(false);
        pushMessage("bot", ts("saveErrorRetry"));
        setMentorFormStep("email");
        setDraft("");
        setFlowStep("mentor-form");
        hasSavedContact.current = false;
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [submitTrigger, fetchUserQueries]);

  // Fetch user queries when the my-queries view is opened
  useEffect(() => {
    if (flowStep === "my-queries" && savedContact?.email) {
      fetchUserQueries(savedContact.email);
    }
  }, [flowStep, savedContact, fetchUserQueries]);

  // Query submission trigger
  useEffect(() => {
    if (querySubmitTrigger === 0) return;
    let c = false;
    (async () => {
      try {
        const result: any = await addRequestQuery();
        if (c) return;

        if (result?.success) {
          const requestId = result?.request_id || result?.data?.request_id;

          // Save query info to localStorage
          try {
            const storedQueries = JSON.parse(
              window.localStorage.getItem(QUERY_STORAGE_KEY) || "[]",
            );
            storedQueries.push({
              request_id: requestId,
              query_title:
                result?.data?.query_title || requestQuery.query_title,
              category: result?.data?.category || requestQuery.category,
              created_at: new Date().toISOString(),
            });
            window.localStorage.setItem(
              QUERY_STORAGE_KEY,
              JSON.stringify(storedQueries),
            );
          } catch (err) {
            console.error("Failed to save query to localStorage", err);
          }

          // Refresh user queries after submission
          const email = savedContact?.email || mentorForm.email;
          if (email) {
            fetchUserQueries(email);
          }

          if (requestId) {
            pushMessage(
              "bot",
              `${ts("queryRegistered")}\n\nRequest ID: **${requestId}**`,
            );
          } else {
            pushMessage(
              "bot",
              `${ts("queryRegistered")}\n\nTicket: **TKT-${Date.now()
                .toString(36)
                .toUpperCase()}**`,
            );
          }

          setFlowStep("mentor-options");
        } else {
          pushMessage("bot", result?.message || ts("querySubmitError"));
        }
      } catch (err) {
        if (c) return;
        pushMessage("bot", ts("querySubmitErrorRetry"));
      }
    })();
    return () => {
      c = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [querySubmitTrigger, savedContact, mentorForm.email, fetchUserQueries]);

  // Input handlers
  const handleNameInput = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const filtered = value.replace(/[^A-Za-z\s'-]/g, "");
      setDraft(filtered);
      if (formError) setFormError(null);
      if (filtered.trim().length > 0 && filtered.trim().length < 3) {
        setLocalValidationErrors((prev) => ({
          ...prev,
          name: ts("invalidName"),
        }));
      } else if (filtered.trim().length > 0 && !isValidName(filtered)) {
        setLocalValidationErrors((prev) => ({
          ...prev,
          name: "Only letters, spaces, apostrophes (') and hyphens (-) are allowed.",
        }));
      } else {
        setLocalValidationErrors((prev) => {
          const { name, ...rest } = prev;
          return rest;
        });
      }
    },
    [formError, ts],
  );

  const handleMobileInput = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const digits = value.replace(/\D/g, "").slice(0, 15);
      setDraft(digits);
      if (formError) setFormError(null);
      if (digits.length > 0 && digits.length < 10) {
        setLocalValidationErrors((prev) => ({
          ...prev,
          mobile: ts("invalidMobile"),
        }));
      } else {
        setLocalValidationErrors((prev) => {
          const { mobile, ...rest } = prev;
          return rest;
        });
      }
    },
    [formError, ts],
  );

  const handleEmailInput = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setDraft(value);
      if (formError) setFormError(null);
      if (value.trim().length > 0 && !isValidEmail(value)) {
        setLocalValidationErrors((prev) => ({
          ...prev,
          email: ts("invalidEmail"),
        }));
      } else {
        setLocalValidationErrors((prev) => {
          const { email, ...rest } = prev;
          return rest;
        });
      }
    },
    [formError, ts],
  );

  const handleChatMessageInput = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      handleChatbotChange(e);
    },
    [handleChatbotChange],
  );

  const handleMentorMessageInput = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      handleMentorMessageChange(e);
    },
    [handleMentorMessageChange],
  );

  const validateQueryForm = useCallback((): boolean => {
    const errors: ValidationErrors = {};
    let isValid = true;
    if (!requestQuery.category) {
      errors.category = ts("selectCategoryError");
      isValid = false;
    }
    if (
      !requestQuery.query_title ||
      !isValidQueryTitle(requestQuery.query_title)
    ) {
      errors.query_title = ts("queryTitleError");
      isValid = false;
    }
    if (
      !requestQuery.query_description ||
      !isValidQueryDescription(requestQuery.query_description)
    ) {
      errors.query_description = ts("queryDescriptionError");
      isValid = false;
    }
    setLocalValidationErrors(errors);
    return isValid;
  }, [
    requestQuery.category,
    requestQuery.query_title,
    requestQuery.query_description,
    ts,
  ]);

  // Navigation handlers
  const handleStart = useCallback(() => {
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    setIsTyping(false);
    if (
      flowStep === "mentor-chat" &&
      selectedConversation?.conversation_generated_id
    )
      leaveRoom(selectedConversation.conversation_generated_id);
    setFlowStep("faq-list");
    setSelectedFAQ(null);
    setSelectedCategory(null);
    setSelectedQuestion(null);
    setMentorForm({
      name: "",
      mobile: "",
      email: "",
      registered_employee_generated_id: "",
    });
    setMentorFormStep("name");
    setFormError(null);
    setDraft("");
    setConversationEnded(false);
    setSatisfactionStage(null);
    conversationEndedNotifiedRef.current = false;
    setAutoSelectedExpert(null);
    setConnectingCategoryId(null);
    hasSavedContact.current = false;
    setIsSavingContact(false);
    pendingContactRef.current = null;
    setLocalValidationErrors({});
    resetChatbotForm();
    resetWebsiteUserForm();
    clearWebsiteUserMessages();
    resetRequestQueryForm();
    resetMentorConversation();
    resetMentorMessage();
    const msg = getWelcomeMessage(selectedLanguage || "en");
    setMessages([{ id: "greet-1", sender: "bot", text: msg }]);
  }, [
    flowStep,
    selectedConversation,
    leaveRoom,
    resetChatbotForm,
    resetWebsiteUserForm,
    clearWebsiteUserMessages,
    resetRequestQueryForm,
    resetMentorConversation,
    resetMentorMessage,
    selectedLanguage,
    getWelcomeMessage,
  ]);

  const handleCloseLanguageSelector = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleGoHome = useCallback(() => {
    handleStart();
  }, [handleStart]);

  const handleBack = useCallback(() => {
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    setIsTyping(false);
    setFormError(null);
    setLocalValidationErrors({});
    if (flowStep === "faq-categories") {
      setFlowStep("faq-list");
      setSelectedFAQ(null);
      setSelectedCategory(null);
    } else if (flowStep === "faq-questions") {
      setFlowStep("faq-categories");
      setSelectedCategory(null);
      setSelectedQuestion(null);
    } else if (flowStep === "query-category") {
      setFlowStep("query-form");
    } else if (flowStep === "query-form") {
      resetRequestQueryForm();
      setFlowStep("mentor-options");
      pushMessage("user", ts("back"));
      simulateTyping(ts("howToProceed"));
    } else if (flowStep === "mentor-resume-choice") {
      setFlowStep("mentor-options");
      pushMessage("user", ts("back"));
      simulateTyping(ts("howToProceed"));
    } else if (flowStep === "mentor-topics") {
      setFlowStep("mentor-options");
      pushMessage("user", ts("back"));
      simulateTyping(ts("howToProceed"));
    } else if (flowStep === "my-queries") {
      setFlowStep("mentor-options");
      pushMessage("user", ts("back"));
      simulateTyping(ts("howToProceed"));
    } else if (flowStep === "mentor-chat") {
      if (selectedConversation?.conversation_generated_id)
        leaveRoom(selectedConversation.conversation_generated_id);
      resetMentorConversation();
      resetMentorMessage();
      setConversationEnded(false);
      setSatisfactionStage(null);
      conversationEndedNotifiedRef.current = false;
      setAutoSelectedExpert(null);
      setHasActiveConversation(false);
      setFlowStep("mentor-options");
      pushMessage("user", ts("back"));
      simulateTyping(ts("howToProceed"));
    } else if (
      flowStep === "mentor-form" ||
      flowStep === "mentor-options" ||
      flowStep === "live-chat"
    ) {
      handleStart();
    }
  }, [
    flowStep,
    selectedConversation,
    leaveRoom,
    resetMentorConversation,
    resetMentorMessage,
    pushMessage,
    simulateTyping,
    handleStart,
    resetRequestQueryForm,
    ts,
  ]);

  const handleFaqSelect = useCallback((faq: FAQ) => {
    setSelectedFAQ(faq);
    setSelectedCategory(null);
    setSelectedQuestion(null);
    setFlowStep("faq-categories");
  }, []);

  const handleCategorySelect = useCallback(
    (cat: FAQCategory) => {
      setSelectedCategory(cat);
      setSelectedQuestion(null);
      setFlowStep("faq-questions");
      const topicName =
        getLocalizedText(cat.topic_name, selectedLanguage || "en") ?? "";
      const topicId = cat.category_generated_id ?? null;
      setActiveCategory({ id: topicId, name: topicName });
      try {
        window.localStorage.setItem(
          FAQ_TOPIC_STORAGE_KEY,
          JSON.stringify({ id: topicId, name: topicName }),
        );
      } catch (err) {}
    },
    [selectedLanguage],
  );

  const handleChangeActiveTopic = useCallback(() => {
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    setIsTyping(false);
    setFormError(null);
    setLocalValidationErrors({});
    setSelectedCategory(null);
    setSelectedQuestion(null);
    if (!selectedFAQ) {
      const activeFaqs = faqs.filter((f) => f.isActiveFAQ);
      const firstFaq = activeFaqs[0] || faqs[0];
      if (firstFaq) setSelectedFAQ(firstFaq);
    }
    setFlowStep("faq-categories");
  }, [selectedFAQ, faqs]);

  const handleQuestionSelect = useCallback((q: FAQQuestion | null) => {
    setSelectedQuestion(q);
  }, []);
  const handleShowSatisfaction = useCallback(() => {
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    pushMessage("user", ts("iNeedMoreHelp"));
    if (savedContact) {
      setIsTyping(true);
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        const welcomeBackMsg = (t("welcomeBack") as (name: string) => string)(
          savedContact.name,
        );
        pushMessage("bot", welcomeBackMsg);

        if (totalSessions > 1) {
          const sessionMsg = `You've visited us ${totalSessions} times. Welcome back!`;
          simulateTyping(sessionMsg);
        }

        setMentorForm(savedContact);
        setFlowStep("mentor-options");
      }, 550);
      return;
    }
    setIsTyping(true);
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      pushMessage("bot", "What's your **full name**?");
      setMentorForm({
        name: "",
        mobile: "",
        email: "",
        registered_employee_generated_id: "",
      });
      setMentorFormStep("name");
      setFormError(null);
      setLocalValidationErrors({});
      setDraft("");
      setFlowStep("mentor-form");
    }, 550);
  }, [pushMessage, savedContact, totalSessions, ts, t, simulateTyping]);

  const handleEditContact = useCallback(() => {
    setSavedContact(null);
    hasSavedContact.current = false;
    setIsSavingContact(false);
    pendingContactRef.current = null;
    setLocalValidationErrors({});
    resetWebsiteUserForm();
    clearWebsiteUserMessages();
    try {
      window.localStorage.removeItem(CONTACT_STORAGE_KEY);
    } catch (err) {}
    pushMessage("user", "Update my details");
    setMentorForm({
      name: "",
      mobile: "",
      email: "",
      registered_employee_generated_id: "",
    });
    setMentorFormStep("name");
    setFormError(null);
    setDraft("");
    setIsTyping(true);
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      pushMessage("bot", "What's your **full name**?");
      setFlowStep("mentor-form");
    }, 550);
  }, [pushMessage, resetWebsiteUserForm, clearWebsiteUserMessages]);

  const handleMentorFormSubmit = useCallback(() => {
    const text = draft.trim();
    if (!text) {
      console.log("No draft text, returning");
      return;
    }

    console.log("Current step:", mentorFormStep, "draft:", text);

    if (mentorFormStep === "name") {
      if (!isValidName(text)) {
        setFormError(ts("invalidName"));
        return;
      }
      setFormError(null);
      setLocalValidationErrors({});
      const sanitizedName = sanitizeName(text);
      pushMessage("user", sanitizedName);
      setMentorForm((p) => ({ ...p, name: sanitizedName }));
      setMentorFormStep("mobile");
      setDraft("");
      const niceToMeetMsg = (t("niceToMeet") as (name: string) => string)(
        sanitizedName,
      );
      simulateTyping(niceToMeetMsg);
      return;
    }

    if (mentorFormStep === "mobile") {
      if (!isValidMobile(text)) {
        setFormError(ts("invalidMobile"));
        return;
      }
      setFormError(null);
      setLocalValidationErrors({});
      pushMessage("user", text);
      setMentorForm((p) => ({ ...p, mobile: text }));
      setMentorFormStep("email");
      setDraft("");
      simulateTyping(ts("emailAddress"));
      return;
    }

    // EMAIL STEP
    console.log("Validating email:", text);
    if (!isValidEmail(text)) {
      console.log("Invalid email");
      setFormError(ts("invalidEmail"));
      return;
    }

    setFormError(null);
    setLocalValidationErrors({});
    pushMessage("user", text);

    const finalForm: ContactDetails = {
      ...mentorForm,
      email: text,
      registered_employee_generated_id:
        savedContact?.registered_employee_generated_id || "",
    };

    console.log("Final form before submission:", finalForm);

    setMentorForm(finalForm);
    setDraft("");

    // Update the context's websiteUser state with the contact details
    handleWebsiteUserChange({
      target: { name: "name", value: finalForm.name },
    } as ChangeEvent<HTMLInputElement>);
    handleWebsiteUserChange({
      target: { name: "phone_number", value: finalForm.mobile },
    } as ChangeEvent<HTMLInputElement>);
    handleWebsiteUserChange({
      target: { name: "email", value: finalForm.email },
    } as ChangeEvent<HTMLInputElement>);

    // Store the contact for the async effect
    pendingContactRef.current = finalForm;

    // ✅ RESET BLOCKERS – crucial for retries and consecutive submissions
    hasSavedContact.current = false;
    setIsSavingContact(false);

    console.log("Triggering submission...");
    setIsTyping(true);
    setSubmitTrigger((n) => {
      console.log("New submitTrigger value:", n + 1);
      return n + 1;
    });
  }, [
    draft,
    mentorFormStep,
    mentorForm,
    savedContact,
    pushMessage,
    simulateTyping,
    handleWebsiteUserChange,
    ts,
    t,
  ]);

  const handleChatWithBot = useCallback(() => {
    const c = savedContact ?? mentorForm;

    addMessage({
      id: `${Date.now()}-user-${Math.random()}`,
      role: "user",
      content: ts("chatWithBot"),
    });

    // Use custom welcome message if available, otherwise use translation
    const chatMessage = chatbotSettings.welcome_message
      ? chatbotSettings.welcome_message
      : (t("youAreNowChatting") as (name: string) => string)(c.name);

    addMessage({
      id: `${Date.now()}-assistant-${Math.random()}`,
      role: "assistant",
      content: chatMessage,
    });

    setFlowStep("live-chat");
  }, [
    savedContact,
    mentorForm,
    addMessage,
    ts,
    t,
    chatbotSettings.welcome_message,
  ]);

  const handleResumeConversation = useCallback(() => {
    pushMessage("user", ts("resumeConversation"));
    simulateTyping(ts("resumingConversation"));
    setFlowStep("mentor-chat");
  }, [pushMessage, simulateTyping, ts]);

  const handleStartNewMentorTopic = useCallback(async () => {
    pushMessage("user", ts("startNewTopic"));
    try {
      const cats = await getExpertCategories();
      cats.length > 0
        ? (simulateTyping(ts("pickTopic")), setFlowStep("mentor-topics"))
        : (simulateTyping(ts("noMentorCategories")),
          setFlowStep("mentor-options"));
    } catch (err) {
      simulateTyping(ts("couldntLoadTopics"));
      setFlowStep("mentor-options");
    }
  }, [pushMessage, simulateTyping, getExpertCategories, ts]);

  const handleStartQueryForm = useCallback(() => {
    const c = savedContact ?? mentorForm;
    handleRequestQueryChange({
      target: { name: "name", value: c.name },
    } as ChangeEvent<HTMLInputElement>);
    handleRequestQueryChange({
      target: { name: "email", value: c.email },
    } as ChangeEvent<HTMLInputElement>);
    handleRequestQueryChange({
      target: { name: "phone_number", value: c.mobile },
    } as ChangeEvent<HTMLInputElement>);
    handleRequestQueryChange({
      target: { name: "query_title", value: "" },
    } as ChangeEvent<HTMLInputElement>);
    handleRequestQueryChange({
      target: { name: "query_description", value: "" },
    } as ChangeEvent<HTMLTextAreaElement>);
    const defaultCategoryName = activeCategory?.name?.trim() || "General";
    handleRequestQueryChange({
      target: { name: "category", value: defaultCategoryName },
    } as ChangeEvent<HTMLInputElement>);
    setLocalValidationErrors({});
    pushMessage("user", ts("raiseQuery"));
    simulateTyping(
      activeCategory?.name ? ts("gotItTitleDetails") : ts("giveMeTitleDetails"),
    );
    setFlowStep("query-form");
  }, [
    savedContact,
    mentorForm,
    activeCategory,
    pushMessage,
    simulateTyping,
    handleRequestQueryChange,
    ts,
  ]);

  const handleOpenQueryCategoryChange = useCallback(async () => {
    setLocalValidationErrors({});
    try {
      await getExpertCategories();
    } catch (err) {}
    setFlowStep("query-category");
  }, [getExpertCategories]);

  const handleQueryCategorySelect = useCallback(
    (cat: ExpertCategory) => {
      handleRequestQueryChange({
        target: { name: "category", value: cat.name },
      } as ChangeEvent<HTMLInputElement>);
      setLocalValidationErrors((prev) => {
        const { category, ...rest } = prev;
        return rest;
      });
      setFlowStep("query-form");
    },
    [handleRequestQueryChange],
  );

  const handleSkipQueryCategory = useCallback(() => {
    handleRequestQueryChange({
      target: { name: "category", value: activeCategory?.name || "General" },
    } as ChangeEvent<HTMLInputElement>);
    setLocalValidationErrors((prev) => {
      const { category, ...rest } = prev;
      return rest;
    });
    setFlowStep("query-form");
  }, [handleRequestQueryChange, activeCategory]);

  const handleRaiseQueryFromEnd = useCallback(() => {
    handleStartQueryForm();
  }, [handleStartQueryForm]);

  const handleConversationSatisfied = useCallback(() => {
    pushMessage("user", ts("allGoodThanks"));
    simulateTyping(ts("wonderfulThanks"));
    setSatisfactionStage("closed");
  }, [pushMessage, simulateTyping, ts]);

  const handleExitChat = useCallback(() => {
    setIsOpen(false);
  }, []);
  const handleCloseChat = useCallback(() => {
    // Clear typing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
    setIsTyping(false);

    // Leave active mentor room if any
    if (
      flowStep === "mentor-chat" &&
      selectedConversation?.conversation_generated_id
    ) {
      leaveRoom(selectedConversation.conversation_generated_id);
    }

    // Reset all local state
    setFlowStep("faq-list");
    setSelectedFAQ(null);
    setSelectedCategory(null);
    setSelectedQuestion(null);
    setActiveCategory(null);
    setMentorForm({
      name: "",
      mobile: "",
      email: "",
      registered_employee_generated_id: "",
    });
    setMentorFormStep("name");
    setFormError(null);
    setSavedContact(null);
    setIsSavingContact(false);
    setSubmitTrigger(0);
    pendingContactRef.current = null;
    setQuerySubmitTrigger(0);
    setAutoSelectedExpert(null);
    setConnectingCategoryId(null);
    setPreviewImage(null);
    setConversationEnded(false);
    conversationEndedNotifiedRef.current = false;
    setSatisfactionStage(null);
    setHasActiveConversation(false);
    setLocalValidationErrors({});
    hasSavedContact.current = false;
    setDraft("");
    setMessages([]);
    setShowLanguageSelector(true); // show language chooser next time
    // Reset user queries state
    setUserQueries([]);
    setUserQueriesLoading(false);

    // Clear localStorage (contact, topic, language)
    try {
      window.localStorage.removeItem(LANGUAGE_STORAGE_KEY);
      window.localStorage.removeItem(CONTACT_STORAGE_KEY);
      window.localStorage.removeItem(FAQ_TOPIC_STORAGE_KEY);
      window.localStorage.removeItem("nimobot_query_answered_ids");
      window.localStorage.removeItem("nimobot_query_ids");
    } catch (err) {}

    // Reset all context states
    resetChatbotForm();
    resetWebsiteUserForm();
    clearWebsiteUserMessages();
    resetRequestQueryForm();
    resetMentorConversation();
    resetMentorMessage();

    // Close the widget
    setIsOpen(false);
  }, [
    flowStep,
    selectedConversation,
    leaveRoom,
    resetChatbotForm,
    resetWebsiteUserForm,
    clearWebsiteUserMessages,
    resetRequestQueryForm,
    resetMentorConversation,
    resetMentorMessage,
  ]);
  const handleBackToHome = useCallback(() => {
    handleStart();
  }, [handleStart]);

  const handleEndChat = useCallback(() => {
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    pushMessage("user", ts("endChatConfirm"));
    setIsTyping(true);
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      pushMessage("bot", ts("haveGreatDay"));
      typingTimeoutRef.current = setTimeout(() => {
        handleStart();
        setIsOpen(false);
      }, 1100);
    }, 550);
  }, [pushMessage, handleStart, ts]);

  const handleMentorCategorySelect = useCallback(
    async (cat: ExpertCategory) => {
      if (connectingCategoryId) return;
      const catKey = cat.category_generated_id ?? cat.name;
      setConnectingCategoryId(catKey);
      pushMessage("user", cat.name);
      setIsTyping(true);
      try {
        const experts = cat.category_generated_id
          ? await getExpertsByCategoryId(cat.category_generated_id)
          : await getExpertsByCategory(cat.name);
        setIsTyping(false);
        if (experts.length > 0) {
          const firstExpert = experts[0];
          setAutoSelectedExpert(firstExpert);
          pushMessage(
            "bot",
            (t("connectingYouWith") as (e: string, c: string) => string)(
              firstExpert.name,
              cat.name,
            ),
          );
          const c = savedContact ?? mentorForm;
          const success = await createConversation({
            visitor_name: c.name,
            visitor_email: c.email,
            visitor_phone_number: c.mobile,
            visitor_generated_id: c.registered_employee_generated_id ?? "",
            category_generated_id: cat.category_generated_id ?? "",
            category_name: cat.name ?? "",
          });
          if (success) {
            pushMessage(
              "bot",
              (t("nowTalkingTo") as (e: string) => string)(firstExpert.name),
            );
            setHasActiveConversation(true);
            setFlowStep("mentor-chat");
          } else
            pushMessage(
              "bot",
              (t("couldntStartConversation") as (e: string) => string)(
                firstExpert.name,
              ),
            );
        } else {
          pushMessage(
            "bot",
            (t("noMentorsAvailable") as (c: string) => string)(cat.name),
          );
          setFlowStep("mentor-topics");
        }
      } catch (err) {
        setIsTyping(false);
        pushMessage("bot", ts("connectionError"));
      } finally {
        setConnectingCategoryId(null);
      }
    },
    [
      connectingCategoryId,
      savedContact,
      mentorForm,
      pushMessage,
      createConversation,
      getExpertsByCategory,
      getExpertsByCategoryId,
      ts,
      t,
    ],
  );

  const handleSubmitQuery = useCallback(
    (e?: FormEvent) => {
      e?.preventDefault();
      if (validateQueryForm()) setQuerySubmitTrigger((n) => n + 1);
    },
    [validateQueryForm],
  );

  const handleSend = useCallback(
    (e?: FormEvent) => {
      e?.preventDefault();
      if (flowStep === "mentor-form") handleMentorFormSubmit();
    },
    [flowStep, handleMentorFormSubmit],
  );

  const handleLiveChatSend = useCallback(
    async (e?: FormEvent) => {
      e?.preventDefault();
      const message = chatbotQuestion.question?.trim();
      if (!message || !isValidChatMessage(message)) return;
      setLocalValidationErrors({});

      try {
        const matchedQuestion = await searchFAQs(
          message,
          selectedLanguage || "en",
        );

        if (matchedQuestion) {
          const answerBlocks = getLatestAnswerBlocks(
            matchedQuestion,
            selectedLanguage || "en",
          );

          if (answerBlocks.length > 0) {
            addMessage({
              id: `${Date.now()}-user-${Math.random()}`,
              role: "user",
              content: message,
              source: "faq",
            });

            addMessage({
              id: `${Date.now()}-assistant-${Math.random()}`,
              role: "assistant",
              content: getPlainTextFromBlocks(answerBlocks),
              source: "faq",
              answerBlocks,
            });

            clearQuestionInput();
            return;
          }
        }

        await askQuestion(message);
      } catch (error) {
        await askQuestion(message);
      }
    },
    [
      chatbotQuestion,
      searchFAQs,
      selectedLanguage,
      addMessage,
      clearQuestionInput,
      askQuestion,
    ],
  );

  const handleMentorChatSend = useCallback(
    (e?: FormEvent) => {
      e?.preventDefault();
      if (
        !mentorMessage.message?.trim() ||
        !isValidChatMessage(mentorMessage.message) ||
        !selectedConversation?.conversation_generated_id ||
        selectedConversation.status === "CLOSED"
      )
        return;
      setLocalValidationErrors({});
      sendMentorMessage();
    },
    [mentorMessage, selectedConversation, sendMentorMessage],
  );

  const headerTitle =
    flowStep === "faq-list"
      ? "Nimo Bot"
      : flowStep === "faq-categories"
        ? getLocalizedText(
            selectedFAQ?.faq_default_question,
            selectedLanguage || "en",
          ) || ts("categories")
        : flowStep === "faq-questions"
          ? getLocalizedText(
              selectedCategory?.topic_name,
              selectedLanguage || "en",
            ) || ts("questions")
          : flowStep === "mentor-form"
            ? ts("contactSupport")
            : flowStep === "query-category"
              ? ts("raiseAQuery")
              : flowStep === "query-form"
                ? ts("raiseAQuery")
                : flowStep === "live-chat"
                  ? ts("chatWithBot")
                  : flowStep === "mentor-topics"
                    ? ts("talkToMentor")
                    : flowStep === "mentor-resume-choice"
                      ? ts("talkToMentor")
                      : flowStep === "mentor-options"
                        ? ts("howCanWeHelp")
                        : flowStep === "my-queries"
                          ? "My Queries"
                          : flowStep === "mentor-chat"
                            ? (autoSelectedExpert?.name ??
                              selectedConversation?.category_name ??
                              ts("mentorChat"))
                            : "Next Steps";

  const displayContact = savedContact ?? mentorForm;
  const showHomeButton =
    !!savedContact &&
    (
      [
        "faq-categories",
        "mentor-topics",
        "mentor-chat",
        "query-category",
        "query-form",
        "mentor-resume-choice",
        "live-chat",
        "my-queries",
      ] as ExtendedFlowStep[]
    ).includes(flowStep);

  const showFooterInput =
    flowStep === "mentor-form" ||
    flowStep === "live-chat" ||
    flowStep === "mentor-chat";

  const showConversationHistory = flowStep === "live-chat";

  return (
    <div className="cw-root">
      <ImagePreviewModal
        imageUrl={previewImage}
        onClose={() => setPreviewImage(null)}
      />
      {isOpen && (
        <div className="cw-panel" role="dialog" aria-label="Nimo Bot">
          {showLanguageSelector ? (
            <>
              <div className="cw-header">
                <div className="cw-header-icon">
                  <NimoBotProfile
                    welcomeImage={chatbotSettings.welcome_image}
                  />
                </div>
                <div className="cw-header-meta">
                  <div className="cw-header-title">{ts("chooseLanguage")}</div>
                  <div className="cw-header-status">
                    <span className="cw-status-dot" />
                    <span>{ts("choosePreferredLanguage")}</span>
                  </div>
                </div>
                <button
                  className="cw-header-close-language"
                  onClick={handleCloseChat}
                  type="button"
                  aria-label={ts("closeChat")}
                  title={ts("closeChat")}
                >
                  <X size={16} />
                </button>
              </div>
              <div className="cw-messages">
                <LanguageModule
                  ts={ts}
                  onLanguageSelect={handleLanguageSelect}
                />
              </div>
            </>
          ) : (
            <>
              <div className="cw-header">
                {flowStep !== "faq-list" && flowStep !== "faq-categories" && (
                  <button
                    className="cw-header-back-btn"
                    onClick={handleBack}
                    type="button"
                  >
                    <ArrowLeft size={18} />
                  </button>
                )}
                <div className="cw-header-icon">
                  <NimoBotProfile
                    welcomeImage={chatbotSettings.welcome_image}
                  />
                </div>
                <div className="cw-header-meta">
                  <div className="cw-header-title">{headerTitle}</div>
                  <div className="cw-header-status">
                    <span
                      className={`cw-status-dot ${
                        flowStep === "mentor-chat"
                          ? selectedConversation?.status === "ACTIVE"
                            ? ""
                            : selectedConversation?.status === "CLOSED"
                              ? "cw-status-dot--closed"
                              : "cw-status-dot--waiting"
                          : ""
                      }`}
                    />
                    <span>
                      {flowStep === "mentor-chat"
                        ? selectedConversation?.status === "ACTIVE"
                          ? ts("mentorConnected")
                          : selectedConversation?.status === "CLOSED"
                            ? ts("closed")
                            : ts("waiting")
                        : ts("nimoBotOnline")}
                    </span>
                  </div>
                </div>
                <div className="cw-header-actions">
                  <LanguageDropdown
                    currentLanguage={selectedLanguage || "en"}
                    onSelect={handleLanguageSelect}
                    ts={ts}
                  />
                  <button
                    className="cw-close-btn"
                    onClick={handleCloseChat}
                    type="button"
                    aria-label={ts("closeChat")}
                    title={ts("closeChat")}
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
              /* {activeCategory && (
                <div className="cw-topic-banner">
                  <span className="cw-topic-banner-label">
                    <Folder size={13} />
                    <span className="cw-topic-banner-text">
                      {activeCategory.name} */
                    {/* </span>
                  </span>
                  <button
                    type="button"
                    className="cw-topic-banner-change"
                    onClick={handleChangeActiveTopic} */}
                  {/* >
                    {ts("change")}
                  </button>
                </div>
              )} */}
              <div className="cw-messages" aria-live="polite">
                {/* 1. FAQ Module */}
                <FaqModule
                  flowStep={flowStep as FlowStep}
                  faqsLoading={faqsLoading}
                  faqs={faqs}
                  selectedFAQ={selectedFAQ}
                  selectedCategory={selectedCategory}
                  selectedQuestion={selectedQuestion}
                  activeCategory={activeCategory}
                  selectedLanguage={selectedLanguage || "en"}
                  ts={ts}
                  getLocalizedText={getLocalizedText}
                  getLatestAnswerBlocks={getLatestAnswerBlocks}
                  formatParagraphText={formatParagraphText}
                  onFaqSelect={handleFaqSelect}
                  onCategorySelect={handleCategorySelect}
                  onQuestionSelect={handleQuestionSelect}
                  onShowSatisfaction={handleShowSatisfaction}
                  onSetPreviewImage={setPreviewImage}
                />

                {/* 2. Chat with Nemo Module */}
                <ChatWithNemoModule
                  flowStep={flowStep as FlowStep}
                  ts={ts}
                  t={t}
                  savedContact={savedContact}
                  displayContact={displayContact}
                  mentorFormStep={mentorFormStep}
                  isSavingContact={isSavingContact}
                  hasActiveConversation={hasActiveConversation}
                  selectedConversation={selectedConversation}
                  autoSelectedExpert={autoSelectedExpert}
                  expertCategories={expertCategories}
                  expertsLoading={expertsLoading}
                  connectingCategoryId={connectingCategoryId}
                  chatbotMessages={chatbotMessages}
                  messages={messages}
                  mentorMessages={mentorMessages}
                  conversationEnded={conversationEnded}
                  satisfactionStage={satisfactionStage}
                  showConversationHistory={showConversationHistory}
                  isTyping={isTyping}
                  chatbotLoading={chatbotLoading}
                  faqSearchLoading={faqSearchLoading}
                  onEditContact={handleEditContact}
                  onChatWithBot={handleChatWithBot}
                  onStartQueryForm={handleStartQueryForm}
                  onEndChat={handleEndChat}
                  onResumeConversation={handleResumeConversation}
                  onStartNewMentorTopic={handleStartNewMentorTopic}
                  onMentorCategorySelect={handleMentorCategorySelect}
                  onRaiseQueryFromEnd={handleRaiseQueryFromEnd}
                  onConversationSatisfied={handleConversationSatisfied}
                  onBackToHome={handleBackToHome}
                  onExitChat={handleExitChat}
                  onSetPreviewImage={setPreviewImage}
                  messagesEndRef={messagesEndRef}
                />

                {/* 3. Raise a Query Module */}
                <RaiseAQueryModule
                  flowStep={flowStep as FlowStep}
                  ts={ts}
                  displayContact={displayContact}
                  requestQuery={requestQuery}
                  requestQueryErrors={requestQueryErrors}
                  localValidationErrors={localValidationErrors}
                  requestQueryLoading={requestQueryLoading}
                  expertCategories={expertCategories}
                  expertsLoading={expertsLoading}
                  onOpenQueryCategoryChange={handleOpenQueryCategoryChange}
                  onQueryCategorySelect={handleQueryCategorySelect}
                  onSkipQueryCategory={handleSkipQueryCategory}
                  onRequestQueryChange={handleRequestQueryChange}
                  onSubmitQuery={handleSubmitQuery}
                  onSetLocalValidationErrors={setLocalValidationErrors}
                  isValidQueryTitle={isValidQueryTitle}
                  isValidQueryDescription={isValidQueryDescription}
                />

                {/* 4. My Queries Module */}
                {flowStep === "my-queries" && (
                  <div className="cw-my-queries-container">
                    {userQueriesLoading ? (
                      <div className="cw-loading">Loading your queries...</div>
                    ) : userQueries.length === 0 ? (
                      <div className="cw-empty-state">
                        You have no queries in this session.
                      </div>
                    ) : (
                      userQueries.map((q) => (
                        <div
                          key={q.request_query_generated_id}
                          className="cw-query-card"
                        >
                          <div className="cw-query-card-header">
                            <span className="cw-query-card-title">
                              {q.query_title}
                            </span>
                            <span
                              className={`cw-query-card-status status-${q.request_status?.toLowerCase()}`}
                            >
                              {q.request_status || "PENDING"}
                            </span>
                          </div>
                          <div className="cw-query-card-meta">
                            <span>ID: {q.request_id}</span>
                            <span>{q.category}</span>
                            <span>
                              {q.requested_at
                                ? new Date(q.requested_at).toLocaleDateString()
                                : "N/A"}
                            </span>
                          </div>
                          {q.resolution_note && (
                            <div className="cw-query-card-response">
                              <strong>Response:</strong> {q.resolution_note}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              {showFooterInput && flowStep === "mentor-form" && (
                <div className="cw-input-area">
                  {formError && (
                    <div className="cw-form-error">{formError}</div>
                  )}
                  {localValidationErrors[mentorFormStep] && !formError && (
                    <div className="cw-form-error">
                      {localValidationErrors[mentorFormStep]}
                    </div>
                  )}
                  <form className="cw-input-row" onSubmit={handleSend}>
                    <input
                      key={mentorFormStep}
                      className={`cw-input ${
                        formError || localValidationErrors[mentorFormStep]
                          ? "has-error"
                          : ""
                      }`}
                      placeholder={
                        mentorFormStep === "name"
                          ? ts("fullNamePlaceholder")
                          : mentorFormStep === "mobile"
                            ? ts("mobilePlaceholder")
                            : ts("emailPlaceholder")
                      }
                      value={draft}
                      onChange={
                        mentorFormStep === "name"
                          ? handleNameInput
                          : mentorFormStep === "mobile"
                            ? handleMobileInput
                            : handleEmailInput
                      }
                      type={
                        mentorFormStep === "email"
                          ? "email"
                          : mentorFormStep === "mobile"
                            ? "tel"
                            : "text"
                      }
                      disabled={isSavingContact}
                      autoFocus
                      maxLength={
                        mentorFormStep === "mobile"
                          ? 15
                          : mentorFormStep === "name"
                            ? 100
                            : 255
                      }
                    />
                    <button
                      type="submit"
                      className="cw-send-btn"
                      disabled={!draft.trim() || isSavingContact}
                    >
                      {isSavingContact ? (
                        <Loader2 size={16} className="cw-spin" />
                      ) : (
                        <Send size={16} />
                      )}
                    </button>
                  </form>
                </div>
              )}
              {showFooterInput && flowStep === "live-chat" && (
                <div className="cw-input-area">
                  {(chatbotErrors.question ||
                    localValidationErrors.message) && (
                    <div className="cw-form-error">
                      {localValidationErrors.message || chatbotErrors.question}
                    </div>
                  )}
                  <form className="cw-input-row" onSubmit={handleLiveChatSend}>
                    <input
                      className={`cw-input ${
                        chatbotErrors.question || localValidationErrors.message
                          ? "has-error"
                          : ""
                      }`}
                      placeholder={ts("askNimoBot")}
                      value={chatbotQuestion.question ?? ""}
                      onChange={handleChatMessageInput}
                      name="question"
                      maxLength={1000}
                      autoFocus
                    />
                    <button
                      type="submit"
                      className="cw-send-btn"
                      disabled={
                        !isValidChatMessage(chatbotQuestion.question || "") ||
                        chatbotLoading
                      }
                    >
                      {chatbotLoading ? (
                        <Loader2 size={16} className="cw-spin" />
                      ) : (
                        <Send size={16} />
                      )}
                    </button>
                  </form>
                </div>
              )}
              {showFooterInput &&
                flowStep === "mentor-chat" &&
                !conversationEnded && (
                  <div className="cw-input-area">
                    {(mentorErrors.message ||
                      localValidationErrors.message) && (
                      <div className="cw-form-error">
                        {localValidationErrors.message || mentorErrors.message}
                      </div>
                    )}
                    <form
                      className="cw-input-row"
                      onSubmit={handleMentorChatSend}
                    >
                      <input
                        className={`cw-input ${
                          mentorErrors.message || localValidationErrors.message
                            ? "has-error"
                            : ""
                        }`}
                        placeholder={
                          selectedConversation?.status === "CLOSED"
                            ? ts("conversationEndedPlaceholder")
                            : ts("typeMessage")
                        }
                        value={mentorMessage.message ?? ""}
                        onChange={handleMentorMessageInput}
                        name="message"
                        maxLength={1000}
                        disabled={selectedConversation?.status === "CLOSED"}
                        autoFocus
                      />
                      <button
                        type="submit"
                        className="cw-send-btn"
                        disabled={
                          !isValidChatMessage(mentorMessage.message || "") ||
                          selectedConversation?.status === "CLOSED"
                        }
                      >
                        <Send size={16} />
                      </button>
                    </form>
                  </div>
                )}

              {/* Bottom Navigation Bar */}
              {savedContact && (
                <div className="cw-bottom-nav">
                  <button
                    className={`cw-nav-btn ${flowStep !== "my-queries" ? "cw-nav-btn--active" : ""}`}
                    onClick={handleStart} // go to FAQ
                    title="Home"
                  >
                    <Home size={18} />
                    <span>Home</span>
                  </button>
                  <button
                    className={`cw-nav-btn ${flowStep === "my-queries" ? "cw-nav-btn--active" : ""}`}
                    onClick={() => setFlowStep("my-queries")}
                    title="My Queries"
                  >
                    <MessageSquare size={18} />
                    <span>My Queries</span>
                    {userQueries.length > 0 && (
                      <span className="cw-nav-badge">{userQueries.length}</span>
                    )}
                  </button>
                </div>
              )}

              <div className="cw-footer-tag">{ts("poweredBy")}</div>
            </>
          )}
        </div>
      )}
      {!isOpen && <LauncherBotVideo onClick={() => setIsOpen(true)} />}
    </div>
  );
}

export default function ChatWidget() {
  return (
    <ChatbotSettingProvider>
      <FAQProvider>
        <ChatbotProvider>
          <WebsiteUserProvider>
            <RequestQueryProvider>
              <UserProvider>
                <ChatProvider>
                  <ChatWidgetInner />
                </ChatProvider>
              </UserProvider>
            </RequestQueryProvider>
          </WebsiteUserProvider>
        </ChatbotProvider>
      </FAQProvider>
    </ChatbotSettingProvider>
  );
}
