// /* eslint-disable react-hooks/immutability */
// /* eslint-disable react-hooks/preserve-manual-memoization */
// /* eslint-disable react-hooks/set-state-in-effect */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import {
//   useState,
//   useRef,
//   useEffect,
//   FormEvent,
//   ChangeEvent,
//   useCallback,
//   JSX,
// } from "react";
// import {
//   MessageCircle,
//   User,
//   X,
//   ArrowLeft,
//   FileText,
//   Send,
//   Sparkles,
//   Phone,
//   Mail,
//   Bot,
//   Check,
//   Folder,
//   HelpCircle,
//   MessageSquareWarning,
//   Loader2,
//   Pencil,
//   ClipboardList,
//   Users,
//   MessageSquare,
//   Clock,
//   CheckCheck,
//   PartyPopper,
//   DoorOpen,
//   Home,
// } from "lucide-react";
// import ReactMarkdown from "react-markdown";
// import remarkGfm from "remark-gfm";
// import rehypeHighlight from "rehype-highlight";
// import "highlight.js/styles/github.css";
// import "./style.css";

// import { FAQProvider, useFAQ } from "@/src/application/faq/FaqContext";
// import {
//   ChatbotProvider,
//   useChatbot,
// } from "@/src/application/chat-bot/ChatbotContext";
// import {
//   WebsiteUserProvider,
//   useWebsiteUser,
// } from "@/src/application/website-users/WebsiteUserContext";
// import {
//   RequestQueryProvider,
//   useRequestQuery,
// } from "@/src/application/request_a_query/RequestQueryContext";
// import { ChatProvider, useChat } from "@/src/application/live-chat/ChatContext";
// import { UserProvider, useUser } from "@/src/application/users/UserContext";
// import type {
//   FAQ,
//   FAQCategory,
//   FAQQuestion,
// } from "@/src/application/faq/faq.types";
// import type {
//   User as ExpertUser,
//   ExpertCategory,
// } from "@/src/application/users/user.types";

// type Sender = "bot" | "user";

// interface Message {
//   id: string;
//   sender: Sender;
//   text: string;
// }

// type FlowStep =
//   | "faq-list"
//   | "faq-categories"
//   | "faq-questions"
//   | "mentor-form"
//   | "mentor-options"
//   | "post-chat-options"
//   | "query-form"
//   | "live-chat"
//   | "mentor-topics"
//   | "mentor-chat";

// type MentorFormStep = "name" | "mobile" | "email";

// type SatisfactionStage = "ask" | "closed" | null;

// interface ContactDetails {
//   name: string;
//   mobile: string;
//   email: string;
//   registered_employee_generated_id?: string;
// }

// interface ValidationErrors {
//   name?: string;
//   mobile?: string;
//   email?: string;
//   query_title?: string;
//   query_description?: string;
//   message?: string;
// }

// const MENTOR_STEPS: {
//   key: MentorFormStep;
//   label: string;
//   icon: JSX.Element;
// }[] = [
//   { key: "name", label: "Name", icon: <User size={12} /> },
//   { key: "mobile", label: "Mobile", icon: <Phone size={12} /> },
//   { key: "email", label: "Email", icon: <Mail size={12} /> },
// ];

// // ========== VALIDATION FUNCTIONS ==========

// const isValidName = (value: string) => {
//   const name = value.trim();
//   if (name.length < 3) return false;
//   return /^[A-Za-z\s'-]+$/.test(name);
// };

// const isValidMobile = (value: string) => {
//   return /^[0-9]{10,15}$/.test(value.trim());
// };

// const isValidEmail = (value: string) => {
//   return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
// };

// const isValidQueryTitle = (value: string) => {
//   const title = value.trim();
//   return title.length >= 5 && title.length <= 100;
// };

// const isValidQueryDescription = (value: string) => {
//   const desc = value.trim();
//   return desc.length >= 10 && desc.length <= 1000;
// };

// const isValidChatMessage = (value: string) => {
//   return value.trim().length > 0 && value.trim().length <= 1000;
// };

// // Sanitize name: trim and normalize spaces
// const sanitizeName = (value: string) => {
//   return value.trim().replace(/\s+/g, " ");
// };

// const welcomeMessage = (): Message => ({
//   id: "greet-1",
//   sender: "bot",
//   text: "Hi there! I'm **SupportBot**, your AI Assistant. Pick a question below and I'll help you.",
// });

// const CONTACT_STORAGE_KEY = "supportbot_contact_details";

// function ChatWidgetInner() {
//   const { faqs, loading: faqsLoading } = useFAQ();
//   const {
//     messages: chatbotMessages,
//     question: chatbotQuestion,
//     errors: chatbotErrors,
//     loading: chatbotLoading,
//     handleChange: handleChatbotChange,
//     askQuestion,
//     resetForm: resetChatbotForm,
//   } = useChatbot();
//   const {
//     handleChange: handleWebsiteUserChange,
//     addWebsiteUser,
//     resetForm: resetWebsiteUserForm,
//     registeredEmployeeId,
//   } = useWebsiteUser();
//   const {
//     requestQuery,
//     errors: requestQueryErrors,
//     loading: requestQueryLoading,
//     handleChange: handleRequestQueryChange,
//     addRequestQuery,
//     resetForm: resetRequestQueryForm,
//   } = useRequestQuery();
//   const {
//     messages: mentorMessages,
//     conversations,
//     selectedConversation,
//     message: mentorMessage,
//     errors: mentorErrors,
//     loading: mentorLoading,
//     setSelectedConversation,
//     handleMessageChange: handleMentorMessageChange,
//     resetConversation: resetMentorConversation,
//     resetMessage: resetMentorMessage,
//     createConversation,
//     getVisitorConversations,
//     sendMessage: sendMentorMessage,
//     getConversationMessages,
//     joinRoom,
//     leaveRoom,
//   } = useChat();
//   const {
//     expertCategories,
//     getExpertCategories,
//     getExpertsByCategory,
//     getExpertsByCategoryId,
//     loading: expertsLoading,
//   } = useUser();

//   const isEmbedded =
//     typeof window !== "undefined" && window.self !== window.top;
//   const [isOpen, setIsOpen] = useState(isEmbedded);
//   const [messages, setMessages] = useState<Message[]>([welcomeMessage()]);
//   const [draft, setDraft] = useState("");
//   const [isTyping, setIsTyping] = useState(false);
//   const [flowStep, setFlowStep] = useState<FlowStep>("faq-list");
//   const [selectedFAQ, setSelectedFAQ] = useState<FAQ | null>(null);
//   const [selectedCategory, setSelectedCategory] = useState<FAQCategory | null>(
//     null,
//   );
//   const [selectedQuestion, setSelectedQuestion] = useState<FAQQuestion | null>(
//     null,
//   );
//   const [mentorForm, setMentorForm] = useState<ContactDetails>({
//     name: "",
//     mobile: "",
//     email: "",
//     registered_employee_generated_id: "",
//   });
//   const [mentorFormStep, setMentorFormStep] = useState<MentorFormStep>("name");
//   const [formError, setFormError] = useState<string | null>(null);
//   const [savedContact, setSavedContact] = useState<ContactDetails | null>(null);
//   const [isSavingContact, setIsSavingContact] = useState(false);
//   const [submitTrigger, setSubmitTrigger] = useState(0);
//   const [waitingForEmployeeId, setWaitingForEmployeeId] = useState(false);
//   const pendingContactRef = useRef<ContactDetails | null>(null);
//   const [querySubmitTrigger, setQuerySubmitTrigger] = useState(0);
//   const [autoSelectedExpert, setAutoSelectedExpert] =
//     useState<ExpertUser | null>(null);
//   const [selectedExpertCategory, setSelectedExpertCategory] =
//     useState<ExpertCategory | null>(null);
//   const [connectingCategoryId, setConnectingCategoryId] = useState<
//     string | null
//   >(null);
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
//   const hasSavedContact = useRef(false);
//   const [conversationEnded, setConversationEnded] = useState(false);
//   const conversationEndedNotifiedRef = useRef(false);
//   const [satisfactionStage, setSatisfactionStage] =
//     useState<SatisfactionStage>(null);

//   // Local validation errors for mentor form and query form
//   const [localValidationErrors, setLocalValidationErrors] =
//     useState<ValidationErrors>({});

//   useEffect(() => {
//     try {
//       const raw = window.localStorage.getItem(CONTACT_STORAGE_KEY);
//       if (raw) {
//         const parsed = JSON.parse(raw) as Partial<ContactDetails>;
//         if (parsed?.name && parsed?.email && parsed?.mobile) {
//           const contact: ContactDetails = {
//             name: parsed.name,
//             mobile: parsed.mobile,
//             email: parsed.email,
//             registered_employee_generated_id:
//               parsed.registered_employee_generated_id || "",
//           };
//           setSavedContact(contact);
//           if (contact.registered_employee_generated_id)
//             getVisitorConversations(contact.registered_employee_generated_id);
//         }
//       }
//     } catch (err) {}
//   }, []);

//   useEffect(() => {
//     if (!conversations || conversations.length === 0) return;
//     if (flowStep === "mentor-chat") return;
//     const latestConversation = [...conversations].sort(
//       (a, b) =>
//         new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
//     )[0];
//     if (latestConversation) {
//       setSelectedConversation(latestConversation);
//       getConversationMessages(latestConversation.conversation_generated_id);
//       if (latestConversation.status === "CLOSED") setConversationEnded(true);
//       setFlowStep("mentor-chat");
//     }
//   }, [conversations]);

//   useEffect(() => {
//     if (flowStep !== "mentor-chat") {
//       conversationEndedNotifiedRef.current = false;
//       return;
//     }
//     if (
//       selectedConversation?.status === "CLOSED" &&
//       !conversationEndedNotifiedRef.current
//     ) {
//       conversationEndedNotifiedRef.current = true;
//       setConversationEnded(true);
//       setSatisfactionStage("ask");
//       pushMessage("bot", "This conversation has been ended by the mentor.");
//       simulateTyping(
//         "Was everything sorted out? Let me know if you're all set, or raise a query if something's still unresolved.",
//       );
//     }
//   }, [selectedConversation?.status, flowStep]);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages, isTyping, flowStep, chatbotMessages, mentorMessages]);

//   useEffect(() => {
//     return () => {
//       if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
//     };
//   }, []);

//   useEffect(() => {
//     if (!isEmbedded) return;
//     window.parent.postMessage(
//       { source: "supportbot-widget", type: isOpen ? "OPEN" : "CLOSE" },
//       "*",
//     );
//   }, [isOpen, isEmbedded]);

//   useEffect(() => {
//     const cid = selectedConversation?.conversation_generated_id;
//     if (flowStep !== "mentor-chat" || !cid) return;
//     joinRoom(cid);
//     getConversationMessages(cid);
//     return () => {
//       leaveRoom(cid);
//     };
//   }, [flowStep, selectedConversation?.conversation_generated_id]);

//   const pushMessage = useCallback((sender: Sender, text: string) => {
//     setMessages((prev) => [
//       ...prev,
//       { id: `${Date.now()}-${sender}-${Math.random()}`, sender, text },
//     ]);
//   }, []);

//   const simulateTyping = useCallback(
//     (text: string, delay = 550) => {
//       if (typingTimeoutRef.current) {
//         clearTimeout(typingTimeoutRef.current);
//         typingTimeoutRef.current = null;
//       }
//       setIsTyping(true);
//       typingTimeoutRef.current = setTimeout(() => {
//         setIsTyping(false);
//         pushMessage("bot", text);
//         typingTimeoutRef.current = null;
//       }, delay);
//     },
//     [pushMessage],
//   );

//   useEffect(() => {
//     if (submitTrigger === 0 || hasSavedContact.current) return;
//     let c = false;
//     hasSavedContact.current = true;
//     setIsSavingContact(true);
//     (async () => {
//       try {
//         const ok = await addWebsiteUser();
//         if (c) return;
//         setIsSavingContact(false);
//         if (ok) {
//           setWaitingForEmployeeId(true);
//           setIsTyping(false);
//         } else {
//           setIsTyping(false);
//           pushMessage(
//             "bot",
//             "Hmm, I couldn't save your details just now. Please try again.",
//           );
//           setMentorFormStep("email");
//           setDraft("");
//           setFlowStep("mentor-form");
//           hasSavedContact.current = false;
//         }
//       } catch (err) {
//         if (c) return;
//         setIsSavingContact(false);
//         setIsTyping(false);
//         pushMessage(
//           "bot",
//           "Something went wrong saving your details. Please try again.",
//         );
//         setMentorFormStep("email");
//         setDraft("");
//         setFlowStep("mentor-form");
//         hasSavedContact.current = false;
//       }
//     })();
//     return () => {
//       c = true;
//     };
//   }, [submitTrigger]);

//   useEffect(() => {
//     if (!waitingForEmployeeId || !registeredEmployeeId) return;
//     const contact = pendingContactRef.current;
//     if (!contact) return;
//     const updated: ContactDetails = {
//       ...contact,
//       registered_employee_generated_id: registeredEmployeeId,
//     };
//     setSavedContact(updated);
//     try {
//       window.localStorage.setItem(CONTACT_STORAGE_KEY, JSON.stringify(updated));
//     } catch (err) {}
//     pushMessage(
//       "bot",
//       `Thanks, **${contact.name}**! I've saved your details.\n\nHow would you like to proceed?`,
//     );
//     setFlowStep("mentor-options");
//     setWaitingForEmployeeId(false);
//     hasSavedContact.current = false;
//   }, [waitingForEmployeeId, registeredEmployeeId]);

//   useEffect(() => {
//     if (querySubmitTrigger === 0) return;
//     let c = false;
//     (async () => {
//       try {
//         const ok = await addRequestQuery();
//         if (c) return;
//         if (ok) {
//           pushMessage(
//             "bot",
//             `Your query has been registered!\n\nTicket: **TKT-${Date.now().toString(36).toUpperCase()}**`,
//           );
//           setFlowStep("faq-list");
//         } else
//           pushMessage(
//             "bot",
//             "I couldn't submit your query — please try again.",
//           );
//       } catch (err) {
//         if (c) return;
//         pushMessage(
//           "bot",
//           "Something went wrong submitting your query. Please try again.",
//         );
//       }
//     })();
//     return () => {
//       c = true;
//     };
//   }, [querySubmitTrigger]);

//   // ========== INPUT HANDLERS WITH REAL-TIME VALIDATION ==========

//   const handleNameInput = useCallback(
//     (e: ChangeEvent<HTMLInputElement>) => {
//       const value = e.target.value;
//       // Prevent invalid characters from being typed
//       const filtered = value.replace(/[^A-Za-z\s'-]/g, "");
//       setDraft(filtered);
//       if (formError) setFormError(null);

//       // Real-time validation
//       if (filtered.trim().length > 0 && filtered.trim().length < 3) {
//         setLocalValidationErrors((prev) => ({
//           ...prev,
//           name: "Please enter your full name (minimum 3 characters).",
//         }));
//       } else if (filtered.trim().length > 0 && !isValidName(filtered)) {
//         setLocalValidationErrors((prev) => ({
//           ...prev,
//           name: "Only letters, spaces, apostrophes (') and hyphens (-) are allowed.",
//         }));
//       } else {
//         setLocalValidationErrors((prev) => {
//           const { name, ...rest } = prev;
//           return rest;
//         });
//       }
//     },
//     [formError],
//   );

//   const handleMobileInput = useCallback(
//     (e: ChangeEvent<HTMLInputElement>) => {
//       const value = e.target.value;
//       // Allow only digits
//       const digits = value.replace(/\D/g, "");
//       // Limit to 15 digits
//       const limited = digits.slice(0, 15);
//       setDraft(limited);
//       if (formError) setFormError(null);

//       // Real-time validation
//       if (limited.length > 0 && limited.length < 10) {
//         setLocalValidationErrors((prev) => ({
//           ...prev,
//           mobile: "Please enter a valid mobile number (10-15 digits).",
//         }));
//       } else if (limited.length > 15) {
//         setLocalValidationErrors((prev) => ({
//           ...prev,
//           mobile: "Mobile number cannot exceed 15 digits.",
//         }));
//       } else {
//         setLocalValidationErrors((prev) => {
//           const { mobile, ...rest } = prev;
//           return rest;
//         });
//       }
//     },
//     [formError],
//   );

//   const handleEmailInput = useCallback(
//     (e: ChangeEvent<HTMLInputElement>) => {
//       const value = e.target.value;
//       setDraft(value);
//       if (formError) setFormError(null);

//       // Real-time validation
//       if (value.trim().length > 0 && !isValidEmail(value)) {
//         setLocalValidationErrors((prev) => ({
//           ...prev,
//           email: "Please enter a valid email address.",
//         }));
//       } else {
//         setLocalValidationErrors((prev) => {
//           const { email, ...rest } = prev;
//           return rest;
//         });
//       }
//     },
//     [formError],
//   );

//   const handleChatMessageInput = useCallback(
//     (e: ChangeEvent<HTMLInputElement>) => {
//       const value = e.target.value;
//       handleChatbotChange(e);

//       // Real-time validation for chat message
//       if (value.trim().length === 0) {
//         // Don't show error for empty input while typing
//       } else if (value.trim().length > 1000) {
//         setLocalValidationErrors((prev) => ({
//           ...prev,
//           message: "Message cannot exceed 1000 characters.",
//         }));
//       } else {
//         setLocalValidationErrors((prev) => {
//           const { message, ...rest } = prev;
//           return rest;
//         });
//       }
//     },
//     [handleChatbotChange],
//   );

//   const handleMentorMessageInput = useCallback(
//     (e: ChangeEvent<HTMLInputElement>) => {
//       const value = e.target.value;
//       handleMentorMessageChange(e);

//       // Real-time validation for mentor message
//       if (value.trim().length > 1000) {
//         setLocalValidationErrors((prev) => ({
//           ...prev,
//           message: "Message cannot exceed 1000 characters.",
//         }));
//       } else {
//         setLocalValidationErrors((prev) => {
//           const { message, ...rest } = prev;
//           return rest;
//         });
//       }
//     },
//     [handleMentorMessageChange],
//   );

//   // ========== QUERY FORM VALIDATION ==========

//   const validateQueryForm = useCallback((): boolean => {
//     const errors: ValidationErrors = {};
//     let isValid = true;

//     if (
//       !requestQuery.query_title ||
//       !isValidQueryTitle(requestQuery.query_title)
//     ) {
//       errors.query_title = "Please enter a query title (minimum 5 characters).";
//       isValid = false;
//     }

//     if (
//       !requestQuery.query_description ||
//       !isValidQueryDescription(requestQuery.query_description)
//     ) {
//       errors.query_description =
//         "Please describe your issue in at least 10 characters.";
//       isValid = false;
//     }

//     setLocalValidationErrors(errors);
//     return isValid;
//   }, [requestQuery.query_title, requestQuery.query_description]);

//   const handleStart = useCallback(() => {
//     if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
//     setIsTyping(false);
//     if (
//       flowStep === "mentor-chat" &&
//       selectedConversation?.conversation_generated_id
//     )
//       leaveRoom(selectedConversation.conversation_generated_id);
//     setFlowStep("faq-list");
//     setSelectedFAQ(null);
//     setSelectedCategory(null);
//     setSelectedQuestion(null);
//     setMentorForm({
//       name: "",
//       mobile: "",
//       email: "",
//       registered_employee_generated_id: "",
//     });
//     setMentorFormStep("name");
//     setFormError(null);
//     setDraft("");
//     setWaitingForEmployeeId(false);
//     setConversationEnded(false);
//     setSatisfactionStage(null);
//     conversationEndedNotifiedRef.current = false;
//     setAutoSelectedExpert(null);
//     setConnectingCategoryId(null);
//     hasSavedContact.current = false;
//     setIsSavingContact(false);
//     pendingContactRef.current = null;
//     setLocalValidationErrors({});
//     resetChatbotForm();
//     resetWebsiteUserForm();
//     resetRequestQueryForm();
//     resetMentorConversation();
//     resetMentorMessage();
//     setSelectedExpertCategory(null);
//     setMessages([welcomeMessage()]);
//   }, [
//     flowStep,
//     selectedConversation,
//     leaveRoom,
//     resetChatbotForm,
//     resetWebsiteUserForm,
//     resetRequestQueryForm,
//     resetMentorConversation,
//     resetMentorMessage,
//   ]);

//   const handleBack = useCallback(() => {
//     if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
//     setIsTyping(false);
//     setFormError(null);
//     setLocalValidationErrors({});
//     if (flowStep === "faq-categories") {
//       setFlowStep("faq-list");
//       setSelectedFAQ(null);
//       setSelectedCategory(null);
//       pushMessage("user", "Back");
//       simulateTyping("Here are the FAQ questions again:");
//     } else if (flowStep === "faq-questions") {
//       setFlowStep("faq-categories");
//       setSelectedCategory(null);
//       setSelectedQuestion(null);
//       pushMessage("user", "Back");
//       simulateTyping("Here are the categories again:");
//     } else if (flowStep === "query-form") {
//       resetRequestQueryForm();
//       setFlowStep("post-chat-options");
//       pushMessage("user", "Back");
//       simulateTyping("How would you like to proceed?");
//     } else if (flowStep === "post-chat-options") {
//       setFlowStep("mentor-options");
//       pushMessage("user", "Back");
//       simulateTyping("How would you like to proceed?");
//     } else if (flowStep === "mentor-topics") {
//       setFlowStep("mentor-options");
//       pushMessage("user", "Back");
//       simulateTyping("How would you like to proceed?");
//     } else if (flowStep === "mentor-chat") {
//       if (selectedConversation?.conversation_generated_id)
//         leaveRoom(selectedConversation.conversation_generated_id);
//       resetMentorConversation();
//       resetMentorMessage();
//       setConversationEnded(false);
//       setSatisfactionStage(null);
//       conversationEndedNotifiedRef.current = false;
//       setAutoSelectedExpert(null);
//       setFlowStep("mentor-topics");
//       pushMessage("user", "Back");
//       simulateTyping("Choose another topic.");
//     } else if (
//       flowStep === "mentor-form" ||
//       flowStep === "mentor-options" ||
//       flowStep === "live-chat"
//     ) {
//       handleStart();
//     }
//   }, [
//     flowStep,
//     selectedConversation,
//     leaveRoom,
//     resetMentorConversation,
//     resetMentorMessage,
//     pushMessage,
//     simulateTyping,
//     handleStart,
//     resetRequestQueryForm,
//   ]);

//   const handleFaqSelect = useCallback(
//     (faq: FAQ) => {
//       setSelectedFAQ(faq);
//       setSelectedCategory(null);
//       setSelectedQuestion(null);
//       setFlowStep("faq-categories");
//       pushMessage("user", faq.faq_default_question);
//       (faq.categories || []).length > 0
//         ? simulateTyping("Here are the categories:")
//         : simulateTyping("No categories yet.");
//     },
//     [pushMessage, simulateTyping],
//   );

//   const handleCategorySelect = useCallback(
//     (cat: FAQCategory) => {
//       setSelectedCategory(cat);
//       setSelectedQuestion(null);
//       setFlowStep("faq-questions");
//       pushMessage("user", cat.topic_name || "Category");
//       (cat.questions || []).length > 0
//         ? simulateTyping("Here are the questions:")
//         : simulateTyping("No questions yet.");
//     },
//     [pushMessage, simulateTyping],
//   );

//   const handleQuestionSelect = useCallback(
//     (q: FAQQuestion) => {
//       setSelectedQuestion(q);
//       pushMessage("user", q.question_text);
//       const answers = q.answers || [];
//       answers.length > 0
//         ? simulateTyping(
//             answers
//               .map((a) => a.answer_text)
//               .filter(Boolean)
//               .join("\n\n"),
//           )
//         : simulateTyping("No answer yet — contact support below.");
//     },
//     [pushMessage, simulateTyping],
//   );

//   const handleShowSatisfaction = useCallback(() => {
//     if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
//     pushMessage("user", "I need more help");
//     if (savedContact) {
//       if (selectedConversation && selectedConversation.status !== "CLOSED") {
//         setIsTyping(true);
//         typingTimeoutRef.current = setTimeout(() => {
//           setIsTyping(false);
//           pushMessage(
//             "bot",
//             `Welcome back, **${savedContact.name}**! Resuming...`,
//           );
//           setFlowStep("mentor-chat");
//         }, 550);
//       } else {
//         setIsTyping(true);
//         typingTimeoutRef.current = setTimeout(() => {
//           setIsTyping(false);
//           pushMessage("bot", `Welcome back, **${savedContact.name}**!`);
//           setMentorForm(savedContact);
//           setFlowStep("mentor-options");
//         }, 550);
//       }
//       return;
//     }
//     setIsTyping(true);
//     typingTimeoutRef.current = setTimeout(() => {
//       setIsTyping(false);
//       pushMessage("bot", "What's your **full name**?");
//       setMentorForm({
//         name: "",
//         mobile: "",
//         email: "",
//         registered_employee_generated_id: "",
//       });
//       setMentorFormStep("name");
//       setFormError(null);
//       setLocalValidationErrors({});
//       setDraft("");
//       setFlowStep("mentor-form");
//     }, 550);
//   }, [pushMessage, savedContact, selectedConversation]);

//   const handleEditContact = useCallback(() => {
//     setSavedContact(null);
//     setWaitingForEmployeeId(false);
//     hasSavedContact.current = false;
//     setIsSavingContact(false);
//     pendingContactRef.current = null;
//     setLocalValidationErrors({});
//     resetWebsiteUserForm();
//     try {
//       window.localStorage.removeItem(CONTACT_STORAGE_KEY);
//     } catch (err) {}
//     pushMessage("user", "Update my details");
//     setMentorForm({
//       name: "",
//       mobile: "",
//       email: "",
//       registered_employee_generated_id: "",
//     });
//     setMentorFormStep("name");
//     setFormError(null);
//     setDraft("");
//     setIsTyping(true);
//     typingTimeoutRef.current = setTimeout(() => {
//       setIsTyping(false);
//       pushMessage("bot", "What's your **full name**?");
//       setFlowStep("mentor-form");
//     }, 550);
//   }, [pushMessage, resetWebsiteUserForm]);

//   const handleMentorFormSubmit = useCallback(() => {
//     const text = draft.trim();
//     if (!text) return;

//     if (mentorFormStep === "name") {
//       if (!isValidName(text)) {
//         setFormError("Please enter your full name (minimum 3 characters).");
//         return;
//       }
//       setFormError(null);
//       setLocalValidationErrors({});
//       const sanitizedName = sanitizeName(text);
//       pushMessage("user", sanitizedName);
//       setMentorForm((p) => ({ ...p, name: sanitizedName }));
//       setMentorFormStep("mobile");
//       setDraft("");
//       simulateTyping(`Nice to meet you, **${sanitizedName}**! Mobile number?`);
//       return;
//     }

//     if (mentorFormStep === "mobile") {
//       if (!isValidMobile(text)) {
//         setFormError("Please enter a valid mobile number.");
//         return;
//       }
//       setFormError(null);
//       setLocalValidationErrors({});
//       pushMessage("user", text);
//       setMentorForm((p) => ({ ...p, mobile: text }));
//       setMentorFormStep("email");
//       setDraft("");
//       simulateTyping("Email address?");
//       return;
//     }

//     if (!isValidEmail(text)) {
//       setFormError("Please enter a valid email address.");
//       return;
//     }
//     setFormError(null);
//     setLocalValidationErrors({});
//     pushMessage("user", text);
//     const finalForm: ContactDetails = {
//       ...mentorForm,
//       email: text,
//       registered_employee_generated_id:
//         savedContact?.registered_employee_generated_id || "",
//     };
//     setMentorForm(finalForm);
//     setDraft("");
//     handleWebsiteUserChange({
//       target: { name: "name", value: finalForm.name },
//     } as ChangeEvent<HTMLInputElement>);
//     handleWebsiteUserChange({
//       target: { name: "phone_number", value: finalForm.mobile },
//     } as ChangeEvent<HTMLInputElement>);
//     handleWebsiteUserChange({
//       target: { name: "email", value: finalForm.email },
//     } as ChangeEvent<HTMLInputElement>);
//     pendingContactRef.current = finalForm;
//     setIsTyping(true);
//     setSubmitTrigger((n) => n + 1);
//   }, [
//     draft,
//     mentorFormStep,
//     mentorForm,
//     savedContact,
//     pushMessage,
//     simulateTyping,
//     handleWebsiteUserChange,
//   ]);

//   const handleChatWithBot = useCallback(() => {
//     const c = savedContact ?? mentorForm;
//     pushMessage("user", "Chat with Bot");
//     simulateTyping(
//       `You're now chatting with SupportBot AI, **${c.name}**. Ask me anything.`,
//     );
//     setFlowStep("live-chat");
//   }, [savedContact, mentorForm, pushMessage, simulateTyping]);

//   const handleStartQueryForm = useCallback(() => {
//     const c = savedContact ?? mentorForm;
//     handleRequestQueryChange({
//       target: { name: "name", value: c.name },
//     } as ChangeEvent<HTMLInputElement>);
//     handleRequestQueryChange({
//       target: { name: "email", value: c.email },
//     } as ChangeEvent<HTMLInputElement>);
//     handleRequestQueryChange({
//       target: { name: "phone_number", value: c.mobile },
//     } as ChangeEvent<HTMLInputElement>);
//     handleRequestQueryChange({
//       target: { name: "query_title", value: "" },
//     } as ChangeEvent<HTMLInputElement>);
//     handleRequestQueryChange({
//       target: { name: "query_description", value: "" },
//     } as ChangeEvent<HTMLTextAreaElement>);
//     setLocalValidationErrors({});
//     pushMessage("user", "Raise a Query");
//     simulateTyping("Give me a title and details.");
//     setFlowStep("query-form");
//   }, [
//     savedContact,
//     mentorForm,
//     pushMessage,
//     simulateTyping,
//     handleRequestQueryChange,
//   ]);

//   const handleRaiseQueryFromEnd = useCallback(() => {
//     handleStartQueryForm();
//   }, [handleStartQueryForm]);

//   const handleConversationSatisfied = useCallback(() => {
//     pushMessage("user", "All good, thanks!");
//     simulateTyping(
//       "Wonderful! Thank you for chatting with us today — it was a pleasure helping you. 🎉",
//     );
//     setSatisfactionStage("closed");
//   }, [pushMessage, simulateTyping]);

//   const handleExitChat = useCallback(() => {
//     setIsOpen(false);
//   }, []);

//   const handleBackToHome = useCallback(() => {
//     handleStart();
//   }, [handleStart]);

//   const handleShowMentorTopics = useCallback(async () => {
//     if (selectedConversation && selectedConversation.status !== "CLOSED") {
//       pushMessage("user", "Talk to a Mentor");
//       simulateTyping("Resuming your conversation...");
//       setFlowStep("mentor-chat");
//       return;
//     }
//     pushMessage("user", "Talk to a Mentor");
//     try {
//       const cats = await getExpertCategories();
//       if (cats.length > 0) {
//         simulateTyping("Which topic?");
//         setFlowStep("mentor-topics");
//       } else {
//         simulateTyping("No categories available.");
//         setFlowStep("mentor-options");
//       }
//     } catch (err) {
//       simulateTyping("Couldn't load mentor topics — please try again.");
//       setFlowStep("mentor-options");
//     }
//   }, [pushMessage, simulateTyping, getExpertCategories, selectedConversation]);

//   const handleMentorCategorySelect = useCallback(
//     async (cat: ExpertCategory) => {
//       if (connectingCategoryId) return;
//       const catKey = cat.category_generated_id ?? cat.name;
//       setConnectingCategoryId(catKey);
//       pushMessage("user", cat.name);
//       setSelectedExpertCategory(cat);
//       setIsTyping(true);
//       try {
//         const experts = cat.category_generated_id
//           ? await getExpertsByCategoryId(cat.category_generated_id)
//           : await getExpertsByCategory(cat.name);
//         setIsTyping(false);
//         if (experts.length > 0) {
//           const firstExpert = experts[0];
//           setAutoSelectedExpert(firstExpert);
//           pushMessage(
//             "bot",
//             `Connecting you with **${firstExpert.name}**, your mentor for **${cat.name}**...`,
//           );
//           const c = savedContact ?? mentorForm;
//           const success = await createConversation({
//             visitor_name: c.name,
//             visitor_email: c.email,
//             visitor_phone_number: c.mobile,
//             visitor_generated_id: c.registered_employee_generated_id ?? "",
//             category_generated_id: cat.category_generated_id ?? "",
//             category_name: cat.name ?? "",
//           });
//           if (success) {
//             pushMessage(
//               "bot",
//               `You're now talking to **${firstExpert.name}**. Say hello! 👋`,
//             );
//             setFlowStep("mentor-chat");
//           } else {
//             pushMessage(
//               "bot",
//               `Couldn't start the conversation with **${firstExpert.name}** — please try again.`,
//             );
//           }
//         } else {
//           pushMessage(
//             "bot",
//             `No mentors available for **${cat.name}**. Try another.`,
//           );
//           setFlowStep("mentor-topics");
//         }
//       } catch (err) {
//         setIsTyping(false);
//         pushMessage(
//           "bot",
//           "Something went wrong connecting you to a mentor. Please try again.",
//         );
//       } finally {
//         setConnectingCategoryId(null);
//       }
//     },
//     [
//       connectingCategoryId,
//       savedContact,
//       mentorForm,
//       pushMessage,
//       createConversation,
//       getExpertsByCategory,
//       getExpertsByCategoryId,
//     ],
//   );

//   const handleSubmitQuery = useCallback(
//     (e?: FormEvent) => {
//       e?.preventDefault();
//       if (validateQueryForm()) {
//         setQuerySubmitTrigger((n) => n + 1);
//       }
//     },
//     [validateQueryForm],
//   );

//   const handleSend = useCallback(
//     (e?: FormEvent) => {
//       e?.preventDefault();
//       if (flowStep === "mentor-form") handleMentorFormSubmit();
//     },
//     [flowStep, handleMentorFormSubmit],
//   );

//   const handleLiveChatSend = useCallback(
//     (e?: FormEvent) => {
//       e?.preventDefault();
//       const message = chatbotQuestion.question?.trim();
//       if (!message || !isValidChatMessage(message)) return;
//       setLocalValidationErrors({});
//       askQuestion();
//     },
//     [chatbotQuestion, askQuestion],
//   );

//   const handleMentorChatSend = useCallback(
//     (e?: FormEvent) => {
//       e?.preventDefault();
//       if (
//         !mentorMessage.message?.trim() ||
//         !isValidChatMessage(mentorMessage.message) ||
//         !selectedConversation?.conversation_generated_id ||
//         selectedConversation.status === "CLOSED"
//       )
//         return;
//       setLocalValidationErrors({});
//       sendMentorMessage();
//     },
//     [mentorMessage, selectedConversation, sendMentorMessage],
//   );

//   const headerTitle =
//     flowStep === "faq-list"
//       ? "SupportBot"
//       : flowStep === "faq-categories"
//         ? (selectedFAQ?.faq_default_question ?? "Categories")
//         : flowStep === "faq-questions"
//           ? (selectedCategory?.topic_name ?? "Questions")
//           : flowStep === "mentor-form"
//             ? "Contact Support"
//             : flowStep === "query-form"
//               ? "Raise a Query"
//               : flowStep === "live-chat"
//                 ? "Live Chat"
//                 : flowStep === "mentor-topics"
//                   ? "Talk to a Mentor"
//                   : flowStep === "post-chat-options"
//                     ? "More Questions?"
//                     : flowStep === "mentor-chat"
//                       ? (autoSelectedExpert?.name ??
//                         selectedConversation?.category_name ??
//                         "Mentor Chat")
//                       : "Next Steps";
//   const displayContact = savedContact ?? mentorForm;

//   const renderContent = () => {
//     if (flowStep === "faq-list")
//       return (
//         <div className="cw-faqlist-wrap">
//           <div className="cw-section-title">
//             <span className="cw-section-icon">
//               <MessageSquare size={15} />
//             </span>
//             Pick a question to get started
//           </div>
//           {faqsLoading && (
//             <div className="cw-skeleton-list">
//               {[0, 1, 2].map((i) => (
//                 <div key={i} className="cw-skeleton-row" />
//               ))}
//             </div>
//           )}
//           {!faqsLoading && faqs.length === 0 && (
//             <div className="cw-empty-state">No FAQs available yet.</div>
//           )}
//           {!faqsLoading && faqs.length > 0 && (
//             <div className="cw-faqlist-items">
//               {faqs
//                 .filter((f) => f.isActiveFAQ)
//                 .map((faq, i) => (
//                   <button
//                     key={faq.faq_generated_id || i}
//                     className="cw-faqlist-item"
//                     style={{ animationDelay: `${i * 0.05}s` }}
//                     onClick={() => handleFaqSelect(faq)}
//                     type="button"
//                   >
//                     <MessageSquare size={14} />
//                     <span>{faq.faq_default_question}</span>
//                   </button>
//                 ))}
//             </div>
//           )}
//           <button
//             className="cw-help-btn"
//             onClick={handleShowSatisfaction}
//             type="button"
//           >
//             <HelpCircle size={16} className="cw-help-btn-icon" />
//             <span className="cw-help-btn-text">
//               <span>Can&apos;t find your answer?</span>
//               <span className="cw-help-btn-sub">Talk to our support team</span>
//             </span>
//           </button>
//         </div>
//       );
//     if (flowStep === "faq-categories" && selectedFAQ) {
//       const cats = selectedFAQ.categories || [];
//       return (
//         <div className="cw-faqlist-wrap">
//           <div className="cw-section-title">
//             <span className="cw-section-icon">
//               <Folder size={15} />
//             </span>
//             Categories
//           </div>
//           {cats.length === 0 ? (
//             <div className="cw-empty-state">No categories yet.</div>
//           ) : (
//             <div className="cw-faqlist-items">
//               {cats.map((cat, i) => (
//                 <button
//                   key={cat.category_generated_id || i}
//                   className="cw-faqlist-item"
//                   style={{ animationDelay: `${i * 0.05}s` }}
//                   onClick={() => handleCategorySelect(cat)}
//                   type="button"
//                 >
//                   <Folder size={14} />
//                   <span>{cat.topic_name || "Unknown"}</span>
//                 </button>
//               ))}
//             </div>
//           )}
//           <button
//             className="cw-help-btn"
//             onClick={handleShowSatisfaction}
//             type="button"
//           >
//             <MessageSquareWarning size={16} className="cw-help-btn-icon" />
//             <span className="cw-help-btn-text">
//               <span>Need more help?</span>
//               <span className="cw-help-btn-sub">Contact our support team</span>
//             </span>
//           </button>
//         </div>
//       );
//     }
//     if (flowStep === "faq-questions" && selectedCategory) {
//       const questions = selectedCategory.questions || [];
//       return (
//         <div className="cw-faqlist-wrap">
//           <div className="cw-section-title">
//             <span className="cw-section-icon">
//               <FileText size={15} />
//             </span>
//             {selectedCategory.topic_name || "Questions"}
//           </div>
//           {questions.length === 0 ? (
//             <div className="cw-empty-state">No questions yet.</div>
//           ) : (
//             <div className="cw-faqlist-items">
//               {questions.map((q, i) => (
//                 <button
//                   key={q.question_generated_id || i}
//                   className={`cw-faqlist-item ${selectedQuestion?.question_generated_id === q.question_generated_id ? "cw-faqlist-item--active" : ""}`}
//                   style={{ animationDelay: `${i * 0.05}s` }}
//                   onClick={() => handleQuestionSelect(q)}
//                   type="button"
//                 >
//                   <FileText size={14} />
//                   <span>{q.question_text}</span>
//                 </button>
//               ))}
//             </div>
//           )}
//           {selectedQuestion && (
//             <div className="cw-answer-box">
//               <div className="cw-answer-box-header">
//                 <MessageSquare size={14} />
//                 <span>{selectedQuestion.question_text}</span>
//               </div>
//               {(selectedQuestion.answers || []).length > 0 ? (
//                 <div className="cw-answer-list">
//                   {(selectedQuestion.answers || []).map((a, i) => (
//                     <p key={i} className="cw-answer-item">
//                       {a.answer_text}
//                     </p>
//                   ))}
//                 </div>
//               ) : (
//                 <p className="cw-answer-empty">No answer available yet.</p>
//               )}
//             </div>
//           )}
//           <button
//             className="cw-help-btn"
//             onClick={handleShowSatisfaction}
//             type="button"
//           >
//             <MessageSquareWarning size={16} className="cw-help-btn-icon" />
//             <span className="cw-help-btn-text">
//               <span>Need more help?</span>
//               <span className="cw-help-btn-sub">Contact our support team</span>
//             </span>
//           </button>
//         </div>
//       );
//     }
//     if (flowStep === "mentor-form") {
//       const ci = MENTOR_STEPS.findIndex((s) => s.key === mentorFormStep);
//       return (
//         <div className="cw-progress-card">
//           {MENTOR_STEPS.map((s, i) => (
//             <div
//               key={s.key}
//               className={`cw-progress-step ${i < ci ? "is-done" : ""} ${i === ci ? "is-active" : ""}`}
//             >
//               <span className="cw-progress-dot">
//                 {i < ci ? <Check size={12} /> : s.icon}
//               </span>
//               <span className="cw-progress-label">{s.label}</span>
//               {i < MENTOR_STEPS.length - 1 && (
//                 <span className="cw-progress-line" />
//               )}
//             </div>
//           ))}
//           {isSavingContact && (
//             <div className="cw-saving-indicator">
//               <Loader2 size={12} className="cw-spin" />
//               Saving...
//             </div>
//           )}
//         </div>
//       );
//     }
//     if (flowStep === "mentor-options")
//       return (
//         <div className="cw-options-wrap">
//           <div className="cw-contact-summary">
//             <div className="cw-contact-row">
//               <User size={13} />
//               <span>{displayContact.name}</span>
//             </div>
//             <div className="cw-contact-row">
//               <Phone size={13} />
//               <span>{displayContact.mobile}</span>
//             </div>
//             <div className="cw-contact-row">
//               <Mail size={13} />
//               <span>{displayContact.email}</span>
//             </div>
//             <button
//               className="cw-edit-contact-link"
//               onClick={handleEditContact}
//               type="button"
//             >
//               <Pencil size={11} />
//               Not you? Update details
//             </button>
//           </div>
//           <button
//             className="cw-option-btn cw-option-chat"
//             onClick={handleChatWithBot}
//             type="button"
//           >
//             <div className="cw-option-icon">
//               <Bot size={20} />
//             </div>
//             <div className="cw-option-text">
//               <span className="cw-option-label">Chat with Bot</span>
//               <span className="cw-option-desc">
//                 Get instant answers from SupportBot AI
//               </span>
//             </div>
//           </button>
//           <button
//             className="cw-option-btn cw-option-mentor"
//             onClick={handleShowMentorTopics}
//             type="button"
//           >
//             <div className="cw-option-icon">
//               <Users size={20} />
//             </div>
//             <div className="cw-option-text">
//               <span className="cw-option-label">Talk to a Mentor</span>
//               <span className="cw-option-desc">
//                 Get connected live with a topic expert
//               </span>
//             </div>
//           </button>
//           <button
//             className="cw-option-btn cw-option-query"
//             onClick={handleStartQueryForm}
//             type="button"
//           >
//             <div className="cw-option-icon">
//               <FileText size={20} />
//             </div>
//             <div className="cw-option-text">
//               <span className="cw-option-label">Raise a Query</span>
//               <span className="cw-option-desc">
//                 Log a ticket for our team to track
//               </span>
//             </div>
//           </button>
//         </div>
//       );
//     if (flowStep === "post-chat-options")
//       return (
//         <div className="cw-options-wrap">
//           <div className="cw-section-title">What would you like to do?</div>
//           <button
//             className="cw-option-btn cw-option-chat"
//             onClick={handleChatWithBot}
//             type="button"
//           >
//             <div className="cw-option-icon">
//               <Bot size={20} />
//             </div>
//             <div className="cw-option-text">
//               <span className="cw-option-label">Chat with Bot</span>
//               <span className="cw-option-desc">
//                 Get instant answers from SupportBot AI
//               </span>
//             </div>
//           </button>
//           <button
//             className="cw-option-btn cw-option-query"
//             onClick={handleStartQueryForm}
//             type="button"
//           >
//             <div className="cw-option-icon">
//               <FileText size={20} />
//             </div>
//             <div className="cw-option-text">
//               <span className="cw-option-label">Raise a Query</span>
//               <span className="cw-option-desc">
//                 Not satisfied? Log a ticket for our team
//               </span>
//             </div>
//           </button>
//         </div>
//       );
//     if (flowStep === "query-form")
//       return (
//         <div className="cw-query-form-wrap">
//           <div className="cw-contact-summary cw-contact-summary--compact">
//             <div className="cw-contact-row">
//               <User size={13} />
//               <span>{displayContact.name}</span>
//             </div>
//             <div className="cw-contact-row">
//               <Mail size={13} />
//               <span>{displayContact.email}</span>
//             </div>
//           </div>
//           <form className="cw-query-form" onSubmit={handleSubmitQuery}>
//             <div className="cw-query-field">
//               <label className="cw-query-label">
//                 <ClipboardList size={13} />
//                 Query title
//               </label>
//               <input
//                 className={`cw-query-input ${requestQueryErrors.query_title || localValidationErrors.query_title ? "has-error" : ""}`}
//                 name="query_title"
//                 placeholder="e.g. Unable to submit assignment"
//                 value={requestQuery.query_title}
//                 onChange={(e) => {
//                   handleRequestQueryChange(e);
//                   // Real-time validation
//                   if (
//                     e.target.value.trim().length > 0 &&
//                     e.target.value.trim().length < 5
//                   ) {
//                     setLocalValidationErrors((prev) => ({
//                       ...prev,
//                       query_title:
//                         "Please enter a query title (minimum 5 characters).",
//                     }));
//                   } else {
//                     setLocalValidationErrors((prev) => {
//                       const { query_title, ...rest } = prev;
//                       return rest;
//                     });
//                   }
//                 }}
//                 disabled={requestQueryLoading}
//                 maxLength={100}
//                 autoFocus
//               />
//               {(requestQueryErrors.query_title ||
//                 localValidationErrors.query_title) && (
//                 <span className="cw-query-error">
//                   {localValidationErrors.query_title ||
//                     requestQueryErrors.query_title}
//                 </span>
//               )}
//             </div>
//             <div className="cw-query-field">
//               <label className="cw-query-label">
//                 <FileText size={13} />
//                 Describe the issue
//               </label>
//               <textarea
//                 className={`cw-query-textarea ${requestQueryErrors.query_description || localValidationErrors.query_description ? "has-error" : ""}`}
//                 name="query_description"
//                 placeholder="Tell us what happened..."
//                 value={requestQuery.query_description}
//                 onChange={(e) => {
//                   handleRequestQueryChange(e);
//                   // Real-time validation
//                   if (
//                     e.target.value.trim().length > 0 &&
//                     e.target.value.trim().length < 10
//                   ) {
//                     setLocalValidationErrors((prev) => ({
//                       ...prev,
//                       query_description:
//                         "Please describe your issue in at least 10 characters.",
//                     }));
//                   } else {
//                     setLocalValidationErrors((prev) => {
//                       const { query_description, ...rest } = prev;
//                       return rest;
//                     });
//                   }
//                 }}
//                 disabled={requestQueryLoading}
//                 maxLength={1000}
//                 rows={4}
//               />
//               {(requestQueryErrors.query_description ||
//                 localValidationErrors.query_description) && (
//                 <span className="cw-query-error">
//                   {localValidationErrors.query_description ||
//                     requestQueryErrors.query_description}
//                 </span>
//               )}
//             </div>
//             <button
//               type="submit"
//               className="cw-query-submit-btn"
//               disabled={
//                 requestQueryLoading ||
//                 !isValidQueryTitle(requestQuery.query_title) ||
//                 !isValidQueryDescription(requestQuery.query_description)
//               }
//             >
//               {requestQueryLoading ? (
//                 <>
//                   <Loader2 size={15} className="cw-spin" />
//                   Submitting...
//                 </>
//               ) : (
//                 <>
//                   <Send size={15} />
//                   Submit Query
//                 </>
//               )}
//             </button>
//           </form>
//         </div>
//       );
//     if (flowStep === "mentor-topics")
//       return (
//         <div className="cw-categories-wrap">
//           <div className="cw-section-title">
//             <span className="cw-section-icon">
//               <Users size={15} />
//             </span>
//             Pick a topic for your mentor
//           </div>
//           {expertsLoading && (
//             <div className="cw-skeleton-list">
//               {[0, 1, 2].map((i) => (
//                 <div key={i} className="cw-skeleton-card" />
//               ))}
//             </div>
//           )}
//           {!expertsLoading && expertCategories.length === 0 && (
//             <div className="cw-empty-state">
//               No mentor categories available.
//             </div>
//           )}
//           {!expertsLoading && expertCategories.length > 0 && (
//             <div className="cw-categories-grid">
//               {expertCategories.map((cat, i) => {
//                 const catKey = cat.category_generated_id ?? cat.name;
//                 const isConnectingThis = connectingCategoryId === catKey;
//                 return (
//                   <button
//                     key={cat.category_generated_id ?? i}
//                     className={`cw-category-card ${isConnectingThis ? "is-connecting" : ""}`}
//                     style={{ animationDelay: `${i * 0.06}s` }}
//                     onClick={() => handleMentorCategorySelect(cat)}
//                     type="button"
//                     disabled={connectingCategoryId !== null}
//                   >
//                     <span className="cw-category-icon">
//                       {isConnectingThis ? (
//                         <Loader2 size={18} className="cw-spin" />
//                       ) : (
//                         <Users size={18} />
//                       )}
//                     </span>
//                     <span className="cw-category-name">
//                       {cat.name}
//                       {isConnectingThis && (
//                         <span className="cw-category-status">
//                           Connecting...
//                         </span>
//                       )}
//                     </span>
//                   </button>
//                 );
//               })}
//             </div>
//           )}
//         </div>
//       );
//     return null;
//   };

//   const showFooterInput =
//     flowStep === "mentor-form" ||
//     flowStep === "live-chat" ||
//     flowStep === "mentor-chat";

//   return (
//     <div className="cw-root">
//       {isOpen && (
//         <div className="cw-panel" role="dialog" aria-label="SupportBot">
//           <div className="cw-header">
//             {flowStep !== "faq-list" && (
//               <button
//                 className="cw-header-back-btn"
//                 onClick={handleBack}
//                 type="button"
//               >
//                 <ArrowLeft size={18} />
//               </button>
//             )}
//             <div className="cw-header-icon">
//               <Sparkles size={18} />
//             </div>
//             <div className="cw-header-meta">
//               <div className="cw-header-title">{headerTitle}</div>
//               <div className="cw-header-status">
//                 <span
//                   className={`cw-status-dot ${flowStep === "mentor-chat" ? (selectedConversation?.status === "ACTIVE" ? "" : selectedConversation?.status === "CLOSED" ? "cw-status-dot--closed" : "cw-status-dot--waiting") : ""}`}
//                 />
//                 <span>
//                   {flowStep === "mentor-chat"
//                     ? selectedConversation?.status === "ACTIVE"
//                       ? "Mentor connected"
//                       : selectedConversation?.status === "CLOSED"
//                         ? "Closed"
//                         : "Waiting"
//                     : "Online"}
//                 </span>
//               </div>
//             </div>
//             <button
//               className="cw-close-btn"
//               onClick={() => setIsOpen(false)}
//               type="button"
//             >
//               <X size={16} />
//             </button>
//           </div>
//           <div className="cw-messages" aria-live="polite">
//             {messages.map((m) => (
//               <div
//                 key={m.id}
//                 className={`cw-msg ${m.sender === "user" ? "cw-msg--user" : ""}`}
//               >
//                 <div
//                   className={`cw-avatar ${m.sender === "bot" ? "cw-avatar--bot" : "cw-avatar--user"}`}
//                 >
//                   {m.sender === "bot" ? <Bot size={13} /> : <User size={12} />}
//                 </div>
//                 <div
//                   className={`cw-bubble ${m.sender === "bot" ? "cw-bubble--bot" : "cw-bubble--user"}`}
//                 >
//                   {m.sender === "bot" ? (
//                     <ReactMarkdown
//                       remarkPlugins={[remarkGfm]}
//                       rehypePlugins={[rehypeHighlight]}
//                     >
//                       {m.text}
//                     </ReactMarkdown>
//                   ) : (
//                     m.text
//                   )}
//                 </div>
//               </div>
//             ))}
//             {flowStep === "live-chat" &&
//               chatbotMessages.map((cm, i) => (
//                 <div
//                   key={`chat-${i}`}
//                   className={`cw-msg ${cm.role === "user" ? "cw-msg--user" : ""}`}
//                 >
//                   <div
//                     className={`cw-avatar ${cm.role === "assistant" ? "cw-avatar--bot" : "cw-avatar--user"}`}
//                   >
//                     {cm.role === "assistant" ? (
//                       <Bot size={13} />
//                     ) : (
//                       <User size={12} />
//                     )}
//                   </div>
//                   <div
//                     className={`cw-bubble ${cm.role === "assistant" ? "cw-bubble--bot" : "cw-bubble--user"}`}
//                   >
//                     {cm.role === "assistant" ? (
//                       <ReactMarkdown
//                         remarkPlugins={[remarkGfm]}
//                         rehypePlugins={[rehypeHighlight]}
//                       >
//                         {cm.content}
//                       </ReactMarkdown>
//                     ) : (
//                       cm.content
//                     )}
//                   </div>
//                 </div>
//               ))}
//             {flowStep === "mentor-chat" && (
//               <>
//                 {conversationEnded && (
//                   <div className="cw-conversation-ended">
//                     <Clock size={14} /> This conversation has ended
//                   </div>
//                 )}
//                 {mentorMessages
//                   .filter(
//                     (mm, idx, self) =>
//                       idx ===
//                       self.findIndex(
//                         (m) =>
//                           m.message_generated_id === mm.message_generated_id,
//                       ),
//                   )
//                   .map((mm, i) => {
//                     const iv = mm.sender === "VISITOR";
//                     const lastIdx =
//                       mentorMessages.filter(
//                         (mm2, idx2, self2) =>
//                           idx2 ===
//                           self2.findIndex(
//                             (m) =>
//                               m.message_generated_id ===
//                               mm2.message_generated_id,
//                           ),
//                       ).length - 1;
//                     const isLastVisitorMsg = iv && i === lastIdx;
//                     return (
//                       <div
//                         key={
//                           mm.message_generated_id
//                             ? `${mm.message_generated_id}-${i}`
//                             : `m-${i}`
//                         }
//                         className={`cw-msg ${iv ? "cw-msg--user" : ""}`}
//                       >
//                         <div
//                           className={`cw-avatar ${iv ? "cw-avatar--user" : "cw-avatar--bot"}`}
//                         >
//                           {iv ? <User size={12} /> : <Users size={13} />}
//                         </div>
//                         <div
//                           className={`cw-bubble ${iv ? "cw-bubble--user" : "cw-bubble--bot"}`}
//                         >
//                           {mm.message}
//                           {iv && isLastVisitorMsg && (
//                             <div className="cw-message-status">
//                               {mm.is_read ? (
//                                 <CheckCheck
//                                   size={12}
//                                   className="cw-status-read"
//                                 />
//                               ) : (
//                                 <Clock
//                                   size={12}
//                                   className="cw-status-pending"
//                                 />
//                               )}
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     );
//                   })}
//                 {conversationEnded && satisfactionStage === "ask" && (
//                   <div className="cw-post-chat-actions">
//                     <p className="cw-post-chat-text">
//                       Was this conversation helpful? Let us know, or raise a
//                       query if something&apos;s still unresolved.
//                     </p>
//                     <div className="cw-post-chat-buttons">
//                       <button
//                         className="cw-btn cw-btn--query"
//                         onClick={handleRaiseQueryFromEnd}
//                         type="button"
//                       >
//                         <FileText size={14} />
//                         Raise a Query
//                       </button>
//                       <button
//                         className="cw-btn cw-btn--satisfied"
//                         onClick={handleConversationSatisfied}
//                         type="button"
//                       >
//                         <Check size={14} />
//                         All Good, Thanks
//                       </button>
//                     </div>
//                   </div>
//                 )}
//                 {conversationEnded && satisfactionStage === "closed" && (
//                   <div className="cw-post-chat-actions cw-post-chat-actions--closed">
//                     <div className="cw-post-chat-icon">
//                       <PartyPopper size={20} />
//                     </div>
//                     <p className="cw-post-chat-text">
//                       Thanks for chatting with us today!
//                     </p>
//                     <div className="cw-post-chat-buttons">
//                       <button
//                         className="cw-btn cw-btn--home"
//                         onClick={handleBackToHome}
//                         type="button"
//                       >
//                         <Home size={14} />
//                         Back to Home
//                       </button>
//                       <button
//                         className="cw-btn cw-btn--exit"
//                         onClick={handleExitChat}
//                         type="button"
//                       >
//                         <DoorOpen size={14} />
//                         Exit Chat
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </>
//             )}
//             {renderContent()}
//             {(isTyping ||
//               (flowStep === "live-chat" && chatbotLoading) ||
//               (flowStep === "mentor-topics" && expertsLoading)) && (
//               <div className="cw-msg">
//                 <div className="cw-avatar cw-avatar--bot">
//                   <Bot size={13} />
//                 </div>
//                 <div className="cw-typing">
//                   <span />
//                   <span />
//                   <span />
//                 </div>
//               </div>
//             )}
//             <div ref={messagesEndRef} />
//           </div>
//           {showFooterInput && flowStep === "mentor-form" && (
//             <div className="cw-input-area">
//               {formError && <div className="cw-form-error">{formError}</div>}
//               {localValidationErrors[mentorFormStep] && !formError && (
//                 <div className="cw-form-error">
//                   {localValidationErrors[mentorFormStep]}
//                 </div>
//               )}
//               <form className="cw-input-row" onSubmit={handleSend}>
//                 <input
//                   className={`cw-input ${formError || localValidationErrors[mentorFormStep] ? "has-error" : ""}`}
//                   placeholder={
//                     mentorFormStep === "name"
//                       ? "Full name..."
//                       : mentorFormStep === "mobile"
//                         ? "Mobile number..."
//                         : "Email address..."
//                   }
//                   value={draft}
//                   onChange={
//                     mentorFormStep === "name"
//                       ? handleNameInput
//                       : mentorFormStep === "mobile"
//                         ? handleMobileInput
//                         : handleEmailInput
//                   }
//                   type={
//                     mentorFormStep === "email"
//                       ? "email"
//                       : mentorFormStep === "mobile"
//                         ? "tel"
//                         : "text"
//                   }
//                   disabled={isSavingContact}
//                   autoFocus
//                   maxLength={
//                     mentorFormStep === "mobile"
//                       ? 15
//                       : mentorFormStep === "name"
//                         ? 100
//                         : 255
//                   }
//                 />
//                 <button
//                   type="submit"
//                   className="cw-send-btn"
//                   disabled={!draft.trim() || isSavingContact}
//                 >
//                   {isSavingContact ? (
//                     <Loader2 size={16} className="cw-spin" />
//                   ) : (
//                     <Send size={16} />
//                   )}
//                 </button>
//               </form>
//             </div>
//           )}
//           {showFooterInput && flowStep === "live-chat" && (
//             <div className="cw-input-area">
//               {(chatbotErrors.question || localValidationErrors.message) && (
//                 <div className="cw-form-error">
//                   {localValidationErrors.message || chatbotErrors.question}
//                 </div>
//               )}
//               <form className="cw-input-row" onSubmit={handleLiveChatSend}>
//                 <input
//                   className={`cw-input ${chatbotErrors.question || localValidationErrors.message ? "has-error" : ""}`}
//                   placeholder="Ask SupportBot..."
//                   value={chatbotQuestion.question ?? ""}
//                   onChange={handleChatMessageInput}
//                   name="question"
//                   maxLength={1000}
//                   autoFocus
//                 />
//                 <button
//                   type="submit"
//                   className="cw-send-btn"
//                   disabled={
//                     !isValidChatMessage(chatbotQuestion.question || "") ||
//                     chatbotLoading
//                   }
//                 >
//                   {chatbotLoading ? (
//                     <Loader2 size={16} className="cw-spin" />
//                   ) : (
//                     <Send size={16} />
//                   )}
//                 </button>
//               </form>
//             </div>
//           )}
//           {showFooterInput &&
//             flowStep === "mentor-chat" &&
//             !conversationEnded && (
//               <div className="cw-input-area">
//                 {(mentorErrors.message || localValidationErrors.message) && (
//                   <div className="cw-form-error">
//                     {localValidationErrors.message || mentorErrors.message}
//                   </div>
//                 )}
//                 <form className="cw-input-row" onSubmit={handleMentorChatSend}>
//                   <input
//                     className={`cw-input ${mentorErrors.message || localValidationErrors.message ? "has-error" : ""}`}
//                     placeholder={
//                       selectedConversation?.status === "CLOSED"
//                         ? "Conversation ended"
//                         : "Type your message..."
//                     }
//                     value={mentorMessage.message ?? ""}
//                     onChange={handleMentorMessageInput}
//                     name="message"
//                     maxLength={1000}
//                     disabled={selectedConversation?.status === "CLOSED"}
//                     autoFocus
//                   />
//                   <button
//                     type="submit"
//                     className="cw-send-btn"
//                     disabled={
//                       !isValidChatMessage(mentorMessage.message || "") ||
//                       selectedConversation?.status === "CLOSED"
//                     }
//                   >
//                     <Send size={16} />
//                   </button>
//                 </form>
//               </div>
//             )}
//           <div className="cw-footer-tag">Powered by SupportBot</div>
//         </div>
//       )}
//       {!isOpen && (
//         <button
//           className="cw-launcher"
//           onClick={() => setIsOpen(true)}
//           type="button"
//         >
//           <MessageCircle size={24} />
//           <span className="cw-launcher-dot" />
//         </button>
//       )}
//     </div>
//   );
// }

// export default function ChatWidget() {
//   return (
//     <FAQProvider>
//       <ChatbotProvider>
//         <WebsiteUserProvider>
//           <RequestQueryProvider>
//             <UserProvider>
//               <ChatProvider>
//                 <ChatWidgetInner />
//               </ChatProvider>
//             </UserProvider>
//           </RequestQueryProvider>
//         </WebsiteUserProvider>
//       </ChatbotProvider>
//     </FAQProvider>
//   );
// }
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
  JSX,
} from "react";
import {
  User,
  X,
  ArrowLeft,
  FileText,
  Send,
  Phone,
  Mail,
  Bot,
  Check,
  Folder,
  MessageSquareWarning,
  Loader2,
  Pencil,
  ClipboardList,
  Users,
  MessageSquare,
  CheckCheck,
  PartyPopper,
  DoorOpen,
  Home,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
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
import { ChatProvider, useChat } from "@/src/application/live-chat/ChatContext";
import { UserProvider, useUser } from "@/src/application/users/UserContext";
import type {
  FAQ,
  FAQCategory,
  FAQQuestion,
} from "@/src/application/faq/faq.types";
import type {
  User as ExpertUser,
  ExpertCategory,
} from "@/src/application/users/user.types";

type Sender = "bot" | "user";

interface Message {
  id: string;
  sender: Sender;
  text: string;
}

// NOTE ON FLOW CHANGES
// ---------------------------------------------------------------------------
// - "mentor-options" is the single hub. Every "what next" decision routes
//   through it instead of silently jumping the user into an old conversation.
// - "mentor-resume-choice" is shown ONLY when the user explicitly taps
//   "Talk to a Mentor" while an active conversation already exists — they
//   choose to resume or start fresh. Nothing auto-navigates them there.
// - "query-category" is a new step: raising a query now asks which topic it
//   belongs to (same category list used for mentors), then goes to the
//   title/description form. The chosen category is written into
//   requestQuery.category (the new API field).
// - "post-chat-options" is removed; the hub covers that job now.
type FlowStep =
  | "faq-list"
  | "faq-categories"
  | "faq-questions"
  | "mentor-form"
  | "mentor-options"
  | "mentor-resume-choice"
  | "mentor-topics"
  | "mentor-chat"
  | "query-category"
  | "query-form"
  | "live-chat";

type MentorFormStep = "name" | "mobile" | "email";

type SatisfactionStage = "ask" | "closed" | null;

interface ContactDetails {
  name: string;
  mobile: string;
  email: string;
  registered_employee_generated_id?: string;
}

interface ValidationErrors {
  name?: string;
  mobile?: string;
  email?: string;
  category?: string;
  query_title?: string;
  query_description?: string;
  message?: string;
}

const MENTOR_STEPS: {
  key: MentorFormStep;
  label: string;
  icon: JSX.Element;
}[] = [
  { key: "name", label: "Name", icon: <User size={12} /> },
  { key: "mobile", label: "Mobile", icon: <Phone size={12} /> },
  { key: "email", label: "Email", icon: <Mail size={12} /> },
];

// ========== VALIDATION FUNCTIONS ==========

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

// Sanitize name: trim and normalize spaces
const sanitizeName = (value: string) => {
  return value.trim().replace(/\s+/g, " ");
};

const welcomeMessage = (): Message => ({
  id: "greet-1",
  sender: "bot",
  text: "Hi there! I'm **Nimo Bot**, your AI Assistant. Pick a question below and I'll help you.",
});

const CONTACT_STORAGE_KEY = "nimobot_contact_details";
// Persists the FAQ topic/category the visitor last explored. Used purely as
// a soft memory of intent — it never forces a navigation on its own.
const FAQ_TOPIC_STORAGE_KEY = "nimobot_selected_faq_topic";

// Renders changed-bot.mp4 with its black background keyed out to real
// transparency (alpha=0), so only the bot itself is visible — no circle,
// no card, no background of any kind, on top of any page.
const LAUNCHER_SIZE = 84; // CSS px

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

    // Soft luminance-based key: fully transparent below LOW, fully opaque
    // above HIGH, smooth ramp in between (avoids a harsh cut-out edge).
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

// Nimo Bot Profile Image Component for the header
function NimoBotProfile() {
  return (
    <div className="cw-nimo-profile">
      <img
        src="/bot-standing-image.png"
        alt="Nimo Bot"
        className="cw-nimo-profile-img"
      />
    </div>
  );
}

function ChatWidgetInner() {
  const { faqs, loading: faqsLoading } = useFAQ();
  const {
    messages: chatbotMessages,
    question: chatbotQuestion,
    errors: chatbotErrors,
    loading: chatbotLoading,
    handleChange: handleChatbotChange,
    askQuestion,
    resetForm: resetChatbotForm,
  } = useChatbot();
  const {
    handleChange: handleWebsiteUserChange,
    addWebsiteUser,
    resetForm: resetWebsiteUserForm,
    registeredEmployeeId,
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
    loading: mentorLoading,
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

  const isEmbedded =
    typeof window !== "undefined" && window.self !== window.top;
  const [isOpen, setIsOpen] = useState(isEmbedded);
  const [messages, setMessages] = useState<Message[]>([welcomeMessage()]);
  const [draft, setDraft] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [flowStep, setFlowStep] = useState<FlowStep>("faq-list");
  const [selectedFAQ, setSelectedFAQ] = useState<FAQ | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<FAQCategory | null>(
    null,
  );
  const [selectedQuestion, setSelectedQuestion] = useState<FAQQuestion | null>(
    null,
  );
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
  const [waitingForEmployeeId, setWaitingForEmployeeId] = useState(false);
  const pendingContactRef = useRef<ContactDetails | null>(null);
  const [querySubmitTrigger, setQuerySubmitTrigger] = useState(0);
  const [autoSelectedExpert, setAutoSelectedExpert] =
    useState<ExpertUser | null>(null);
  const [selectedExpertCategory, setSelectedExpertCategory] =
    useState<ExpertCategory | null>(null);
  const [selectedQueryCategory, setSelectedQueryCategory] =
    useState<ExpertCategory | null>(null);
  const [connectingCategoryId, setConnectingCategoryId] = useState<
    string | null
  >(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasSavedContact = useRef(false);
  const [conversationEnded, setConversationEnded] = useState(false);
  const conversationEndedNotifiedRef = useRef(false);
  const [satisfactionStage, setSatisfactionStage] =
    useState<SatisfactionStage>(null);
  // True whenever there's a mentor conversation that isn't CLOSED. This is
  // only ever used to *offer* a resume path — it never forces navigation.
  const [hasActiveConversation, setHasActiveConversation] = useState(false);

  // Local validation errors for mentor form and query form
  const [localValidationErrors, setLocalValidationErrors] =
    useState<ValidationErrors>({});

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
        }
      }
    } catch (err) {}
  }, []);

  // Track whether an active conversation exists, WITHOUT auto-navigating.
  // Previously this effect jumped the user straight into mentor-chat as soon
  // as conversations loaded — that's the "buggy" forced behavior. Now it
  // just keeps state up to date so the hub can *offer* a resume option.
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
      pushMessage("bot", "This conversation has been ended by the mentor.");
      simulateTyping(
        "Was everything sorted out? Let me know if you're all set, or raise a query if something's still unresolved.",
      );
    }
  }, [selectedConversation?.status, flowStep]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, flowStep, chatbotMessages, mentorMessages]);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isEmbedded) return;
    window.parent.postMessage(
      { source: "nimobot-widget", type: isOpen ? "OPEN" : "CLOSE" },
      "*",
    );
  }, [isOpen, isEmbedded]);

  useEffect(() => {
    const cid = selectedConversation?.conversation_generated_id;
    if (flowStep !== "mentor-chat" || !cid) return;
    joinRoom(cid);
    getConversationMessages(cid);
    return () => {
      leaveRoom(cid);
    };
  }, [flowStep, selectedConversation?.conversation_generated_id]);

  const pushMessage = useCallback((sender: Sender, text: string) => {
    setMessages((prev) => [
      ...prev,
      { id: `${Date.now()}-${sender}-${Math.random()}`, sender, text },
    ]);
  }, []);

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

  useEffect(() => {
    if (submitTrigger === 0 || hasSavedContact.current) return;
    let c = false;
    hasSavedContact.current = true;
    setIsSavingContact(true);
    (async () => {
      try {
        const ok = await addWebsiteUser();
        if (c) return;
        setIsSavingContact(false);
        if (ok) {
          setWaitingForEmployeeId(true);
          setIsTyping(false);
        } else {
          setIsTyping(false);
          pushMessage(
            "bot",
            "Hmm, I couldn't save your details just now. Please try again.",
          );
          setMentorFormStep("email");
          setDraft("");
          setFlowStep("mentor-form");
          hasSavedContact.current = false;
        }
      } catch (err) {
        if (c) return;
        setIsSavingContact(false);
        setIsTyping(false);
        pushMessage(
          "bot",
          "Something went wrong saving your details. Please try again.",
        );
        setMentorFormStep("email");
        setDraft("");
        setFlowStep("mentor-form");
        hasSavedContact.current = false;
      }
    })();
    return () => {
      c = true;
    };
  }, [submitTrigger]);

  useEffect(() => {
    if (!waitingForEmployeeId || !registeredEmployeeId) return;
    const contact = pendingContactRef.current;
    if (!contact) return;
    const updated: ContactDetails = {
      ...contact,
      registered_employee_generated_id: registeredEmployeeId,
    };
    setSavedContact(updated);
    try {
      window.localStorage.setItem(CONTACT_STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {}
    pushMessage(
      "bot",
      `Thanks, **${contact.name}**! I've saved your details.\n\nHow would you like to proceed?`,
    );
    setFlowStep("mentor-options");
    setWaitingForEmployeeId(false);
    hasSavedContact.current = false;
  }, [waitingForEmployeeId, registeredEmployeeId]);

  useEffect(() => {
    if (querySubmitTrigger === 0) return;
    let c = false;
    (async () => {
      try {
        const ok = await addRequestQuery();
        if (c) return;
        if (ok) {
          pushMessage(
            "bot",
            `Your query has been registered!\n\nTicket: **TKT-${Date.now().toString(36).toUpperCase()}**`,
          );
          setSelectedQueryCategory(null);
          setFlowStep("mentor-options");
        } else
          pushMessage(
            "bot",
            "I couldn't submit your query — please try again.",
          );
      } catch (err) {
        if (c) return;
        pushMessage(
          "bot",
          "Something went wrong submitting your query. Please try again.",
        );
      }
    })();
    return () => {
      c = true;
    };
  }, [querySubmitTrigger]);

  // ========== INPUT HANDLERS WITH REAL-TIME VALIDATION ==========

  const handleNameInput = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      // Prevent invalid characters from being typed
      const filtered = value.replace(/[^A-Za-z\s'-]/g, "");
      setDraft(filtered);
      if (formError) setFormError(null);

      // Real-time validation
      if (filtered.trim().length > 0 && filtered.trim().length < 3) {
        setLocalValidationErrors((prev) => ({
          ...prev,
          name: "Please enter your full name (minimum 3 characters).",
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
    [formError],
  );

  const handleMobileInput = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      // Allow only digits
      const digits = value.replace(/\D/g, "");
      // Limit to 15 digits
      const limited = digits.slice(0, 15);
      setDraft(limited);
      if (formError) setFormError(null);

      // Real-time validation
      if (limited.length > 0 && limited.length < 10) {
        setLocalValidationErrors((prev) => ({
          ...prev,
          mobile: "Please enter a valid mobile number (10-15 digits).",
        }));
      } else if (limited.length > 15) {
        setLocalValidationErrors((prev) => ({
          ...prev,
          mobile: "Mobile number cannot exceed 15 digits.",
        }));
      } else {
        setLocalValidationErrors((prev) => {
          const { mobile, ...rest } = prev;
          return rest;
        });
      }
    },
    [formError],
  );

  const handleEmailInput = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setDraft(value);
      if (formError) setFormError(null);

      // Real-time validation
      if (value.trim().length > 0 && !isValidEmail(value)) {
        setLocalValidationErrors((prev) => ({
          ...prev,
          email: "Please enter a valid email address.",
        }));
      } else {
        setLocalValidationErrors((prev) => {
          const { email, ...rest } = prev;
          return rest;
        });
      }
    },
    [formError],
  );

  const handleChatMessageInput = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      handleChatbotChange(e);

      // Real-time validation for chat message
      if (value.trim().length === 0) {
        // Don't show error for empty input while typing
      } else if (value.trim().length > 1000) {
        setLocalValidationErrors((prev) => ({
          ...prev,
          message: "Message cannot exceed 1000 characters.",
        }));
      } else {
        setLocalValidationErrors((prev) => {
          const { message, ...rest } = prev;
          return rest;
        });
      }
    },
    [handleChatbotChange],
  );

  const handleMentorMessageInput = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      handleMentorMessageChange(e);

      // Real-time validation for mentor message
      if (value.trim().length > 1000) {
        setLocalValidationErrors((prev) => ({
          ...prev,
          message: "Message cannot exceed 1000 characters.",
        }));
      } else {
        setLocalValidationErrors((prev) => {
          const { message, ...rest } = prev;
          return rest;
        });
      }
    },
    [handleMentorMessageChange],
  );

  // ========== QUERY FORM VALIDATION ==========

  const validateQueryForm = useCallback((): boolean => {
    const errors: ValidationErrors = {};
    let isValid = true;

    if (!requestQuery.category) {
      errors.category = "Please select a category for your query.";
      isValid = false;
    }

    if (
      !requestQuery.query_title ||
      !isValidQueryTitle(requestQuery.query_title)
    ) {
      errors.query_title = "Please enter a query title (minimum 5 characters).";
      isValid = false;
    }

    if (
      !requestQuery.query_description ||
      !isValidQueryDescription(requestQuery.query_description)
    ) {
      errors.query_description =
        "Please describe your issue in at least 10 characters.";
      isValid = false;
    }

    setLocalValidationErrors(errors);
    return isValid;
  }, [
    requestQuery.category,
    requestQuery.query_title,
    requestQuery.query_description,
  ]);

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
    setWaitingForEmployeeId(false);
    setConversationEnded(false);
    setSatisfactionStage(null);
    conversationEndedNotifiedRef.current = false;
    setAutoSelectedExpert(null);
    setConnectingCategoryId(null);
    setSelectedQueryCategory(null);
    hasSavedContact.current = false;
    setIsSavingContact(false);
    pendingContactRef.current = null;
    setLocalValidationErrors({});
    resetChatbotForm();
    resetWebsiteUserForm();
    resetRequestQueryForm();
    resetMentorConversation();
    resetMentorMessage();
    setSelectedExpertCategory(null);
    setMessages([welcomeMessage()]);
  }, [
    flowStep,
    selectedConversation,
    leaveRoom,
    resetChatbotForm,
    resetWebsiteUserForm,
    resetRequestQueryForm,
    resetMentorConversation,
    resetMentorMessage,
  ]);

  // Lets the visitor jump straight to the hub (or start over, if no contact
  // saved yet) from almost anywhere — the "switch mode" affordance.
  const handleGoHome = useCallback(() => {
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    setIsTyping(false);
    if (
      flowStep === "mentor-chat" &&
      selectedConversation?.conversation_generated_id
    )
      leaveRoom(selectedConversation.conversation_generated_id);
    setFormError(null);
    setLocalValidationErrors({});
    if (savedContact) {
      pushMessage("user", "Switch");
      simulateTyping("Sure — how would you like to proceed?");
      setFlowStep("mentor-options");
    } else {
      handleStart();
    }
  }, [
    flowStep,
    selectedConversation,
    leaveRoom,
    savedContact,
    pushMessage,
    simulateTyping,
    handleStart,
  ]);

  const handleBack = useCallback(() => {
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    setIsTyping(false);
    setFormError(null);
    setLocalValidationErrors({});
    if (flowStep === "faq-categories") {
      setFlowStep("faq-list");
      setSelectedFAQ(null);
      setSelectedCategory(null);
      pushMessage("user", "Back");
      simulateTyping("Here are the FAQ questions again:");
    } else if (flowStep === "faq-questions") {
      setFlowStep("faq-categories");
      setSelectedCategory(null);
      setSelectedQuestion(null);
      pushMessage("user", "Back");
      simulateTyping("Here are the categories again:");
    } else if (flowStep === "query-category") {
      resetRequestQueryForm();
      setSelectedQueryCategory(null);
      setFlowStep("mentor-options");
      pushMessage("user", "Back");
      simulateTyping("How would you like to proceed?");
    } else if (flowStep === "query-form") {
      setFlowStep(
        expertCategories.length > 0 ? "query-category" : "mentor-options",
      );
      pushMessage("user", "Back");
      simulateTyping(
        expertCategories.length > 0
          ? "Which category is this about?"
          : "How would you like to proceed?",
      );
    } else if (flowStep === "mentor-resume-choice") {
      setFlowStep("mentor-options");
      pushMessage("user", "Back");
      simulateTyping("How would you like to proceed?");
    } else if (flowStep === "mentor-topics") {
      setFlowStep("mentor-options");
      pushMessage("user", "Back");
      simulateTyping("How would you like to proceed?");
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
      pushMessage("user", "Back");
      simulateTyping("How would you like to proceed?");
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
    expertCategories.length,
  ]);

  const handleFaqSelect = useCallback(
    (faq: FAQ) => {
      setSelectedFAQ(faq);
      setSelectedCategory(null);
      setSelectedQuestion(null);
      setFlowStep("faq-categories");
      pushMessage("user", faq.faq_default_question);
      (faq.categories || []).length > 0
        ? simulateTyping("Here are the categories:")
        : simulateTyping("No categories yet.");
    },
    [pushMessage, simulateTyping],
  );

  const handleCategorySelect = useCallback(
    (cat: FAQCategory) => {
      setSelectedCategory(cat);
      setSelectedQuestion(null);
      setFlowStep("faq-questions");
      pushMessage("user", cat.topic_name || "Category");
      // Remember the topic the visitor is browsing — soft memory only,
      // never forces navigation on its own.
      try {
        window.localStorage.setItem(
          FAQ_TOPIC_STORAGE_KEY,
          JSON.stringify({
            id: cat.category_generated_id ?? null,
            name: cat.topic_name ?? "",
          }),
        );
      } catch (err) {}
      (cat.questions || []).length > 0
        ? simulateTyping("Here are the questions:")
        : simulateTyping("No questions yet.");
    },
    [pushMessage, simulateTyping],
  );

  const handleQuestionSelect = useCallback(
    (q: FAQQuestion) => {
      setSelectedQuestion(q);
      pushMessage("user", q.question_text);
      const answers = q.answers || [];
      answers.length > 0
        ? simulateTyping(
            answers
              .map((a) => a.answer_text)
              .filter(Boolean)
              .join("\n\n"),
          )
        : simulateTyping("No answer yet — contact support below.");
    },
    [pushMessage, simulateTyping],
  );

  // "Can't find your answer?" — always routes to the hub once contact info
  // is known. It no longer silently resumes an old mentor conversation;
  // the hub is where that choice gets offered (see mentor-options render).
  const handleShowSatisfaction = useCallback(() => {
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    pushMessage("user", "I need more help");
    if (savedContact) {
      setIsTyping(true);
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        pushMessage(
          "bot",
          `Welcome back, **${savedContact.name}**! How would you like to proceed?`,
        );
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
  }, [pushMessage, savedContact]);

  const handleEditContact = useCallback(() => {
    setSavedContact(null);
    setWaitingForEmployeeId(false);
    hasSavedContact.current = false;
    setIsSavingContact(false);
    pendingContactRef.current = null;
    setLocalValidationErrors({});
    resetWebsiteUserForm();
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
  }, [pushMessage, resetWebsiteUserForm]);

  const handleMentorFormSubmit = useCallback(() => {
    const text = draft.trim();
    if (!text) return;

    if (mentorFormStep === "name") {
      if (!isValidName(text)) {
        setFormError("Please enter your full name (minimum 3 characters).");
        return;
      }
      setFormError(null);
      setLocalValidationErrors({});
      const sanitizedName = sanitizeName(text);
      pushMessage("user", sanitizedName);
      setMentorForm((p) => ({ ...p, name: sanitizedName }));
      setMentorFormStep("mobile");
      setDraft("");
      simulateTyping(`Nice to meet you, **${sanitizedName}**! Mobile number?`);
      return;
    }

    if (mentorFormStep === "mobile") {
      if (!isValidMobile(text)) {
        setFormError("Please enter a valid mobile number.");
        return;
      }
      setFormError(null);
      setLocalValidationErrors({});
      pushMessage("user", text);
      setMentorForm((p) => ({ ...p, mobile: text }));
      setMentorFormStep("email");
      setDraft("");
      simulateTyping("Email address?");
      return;
    }

    if (!isValidEmail(text)) {
      setFormError("Please enter a valid email address.");
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
    setMentorForm(finalForm);
    setDraft("");
    handleWebsiteUserChange({
      target: { name: "name", value: finalForm.name },
    } as ChangeEvent<HTMLInputElement>);
    handleWebsiteUserChange({
      target: { name: "phone_number", value: finalForm.mobile },
    } as ChangeEvent<HTMLInputElement>);
    handleWebsiteUserChange({
      target: { name: "email", value: finalForm.email },
    } as ChangeEvent<HTMLInputElement>);
    pendingContactRef.current = finalForm;
    setIsTyping(true);
    setSubmitTrigger((n) => n + 1);
  }, [
    draft,
    mentorFormStep,
    mentorForm,
    savedContact,
    pushMessage,
    simulateTyping,
    handleWebsiteUserChange,
  ]);

  const handleChatWithBot = useCallback(() => {
    const c = savedContact ?? mentorForm;
    pushMessage("user", "Chat with Nimo Bot");
    simulateTyping(
      `You're now chatting with Nimo Bot AI, **${c.name}**. Ask me anything.`,
    );
    setFlowStep("live-chat");
  }, [savedContact, mentorForm, pushMessage, simulateTyping]);

  // "Talk to a Mentor" from the hub. If an active conversation already
  // exists, we ask explicitly instead of assuming — this is the fix for
  // the "feels buggy" auto-resume complaint.
  const handleShowMentorTopics = useCallback(async () => {
    pushMessage("user", "Talk to a Mentor");
    if (
      hasActiveConversation &&
      selectedConversation &&
      selectedConversation.status !== "CLOSED"
    ) {
      simulateTyping(
        "You already have an ongoing conversation. Would you like to resume it or start a new topic?",
      );
      setFlowStep("mentor-resume-choice");
      return;
    }
    try {
      const cats = await getExpertCategories();
      if (cats.length > 0) {
        simulateTyping("Which topic would you like help with?");
        setFlowStep("mentor-topics");
      } else {
        simulateTyping("No mentor categories available right now.");
        setFlowStep("mentor-options");
      }
    } catch (err) {
      simulateTyping("Couldn't load mentor topics — please try again.");
      setFlowStep("mentor-options");
    }
  }, [
    pushMessage,
    simulateTyping,
    getExpertCategories,
    hasActiveConversation,
    selectedConversation,
  ]);

  const handleResumeConversation = useCallback(() => {
    pushMessage("user", "Resume conversation");
    simulateTyping("Resuming your conversation...");
    setFlowStep("mentor-chat");
  }, [pushMessage, simulateTyping]);

  const handleStartNewMentorTopic = useCallback(async () => {
    pushMessage("user", "Start a new topic");
    try {
      const cats = await getExpertCategories();
      if (cats.length > 0) {
        simulateTyping("Which topic would you like help with?");
        setFlowStep("mentor-topics");
      } else {
        simulateTyping("No mentor categories available right now.");
        setFlowStep("mentor-options");
      }
    } catch (err) {
      simulateTyping("Couldn't load mentor topics — please try again.");
      setFlowStep("mentor-options");
    }
  }, [pushMessage, simulateTyping, getExpertCategories]);

  // "Raise a Query" now asks for a category first (same category list used
  // for mentors), then goes to the title/description form — mirroring the
  // way mentors are matched by topic, and populating the new
  // requestQuery.category field.
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
    handleRequestQueryChange({
      target: { name: "category", value: "" },
    } as ChangeEvent<HTMLInputElement>);
    setSelectedQueryCategory(null);
    setLocalValidationErrors({});
    pushMessage("user", "Raise a Query");
    (async () => {
      try {
        const cats = await getExpertCategories();
        if (cats.length > 0) {
          simulateTyping("Which category best describes your query?");
          setFlowStep("query-category");
        } else {
          simulateTyping("Give me a title and details.");
          setFlowStep("query-form");
        }
      } catch (err) {
        simulateTyping("Give me a title and details.");
        setFlowStep("query-form");
      }
    })();
  }, [
    savedContact,
    mentorForm,
    pushMessage,
    simulateTyping,
    handleRequestQueryChange,
    getExpertCategories,
  ]);

  const handleQueryCategorySelect = useCallback(
    (cat: ExpertCategory) => {
      setSelectedQueryCategory(cat);
      handleRequestQueryChange({
        target: { name: "category", value: cat.name },
      } as ChangeEvent<HTMLInputElement>);
      setLocalValidationErrors((prev) => {
        const { category, ...rest } = prev;
        return rest;
      });
      pushMessage("user", cat.name);
      simulateTyping("Got it. Now give me a title and details.");
      setFlowStep("query-form");
    },
    [handleRequestQueryChange, pushMessage, simulateTyping],
  );

  const handleSkipQueryCategory = useCallback(() => {
    setSelectedQueryCategory(null);
    handleRequestQueryChange({
      target: { name: "category", value: "General" },
    } as ChangeEvent<HTMLInputElement>);
    setLocalValidationErrors((prev) => {
      const { category, ...rest } = prev;
      return rest;
    });
    pushMessage("user", "Not sure — skip category");
    simulateTyping("No problem. Give me a title and details.");
    setFlowStep("query-form");
  }, [handleRequestQueryChange, pushMessage, simulateTyping]);

  const handleRaiseQueryFromEnd = useCallback(() => {
    handleStartQueryForm();
  }, [handleStartQueryForm]);

  const handleConversationSatisfied = useCallback(() => {
    pushMessage("user", "All good, thanks!");
    simulateTyping(
      "Wonderful! Thank you for chatting with Nimo Bot today — it was a pleasure helping you. 🎉",
    );
    setSatisfactionStage("closed");
  }, [pushMessage, simulateTyping]);

  const handleExitChat = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleBackToHome = useCallback(() => {
    handleStart();
  }, [handleStart]);

  // Explicit "End Chat" from the hub — lets the visitor close things out on
  // their own terms rather than just abandoning the widget mid-flow.
  const handleEndChat = useCallback(() => {
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    pushMessage("user", "End Chat");
    setIsTyping(true);
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      pushMessage(
        "bot",
        "Thanks for chatting with Nimo Bot today! Have a great day. 👋",
      );
      typingTimeoutRef.current = setTimeout(() => {
        handleStart();
        setIsOpen(false);
      }, 1100);
    }, 550);
  }, [pushMessage, handleStart]);

  const handleMentorCategorySelect = useCallback(
    async (cat: ExpertCategory) => {
      if (connectingCategoryId) return;
      const catKey = cat.category_generated_id ?? cat.name;
      setConnectingCategoryId(catKey);
      pushMessage("user", cat.name);
      setSelectedExpertCategory(cat);
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
            `Connecting you with **${firstExpert.name}**, your mentor for **${cat.name}**...`,
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
              `You're now talking to **${firstExpert.name}**. Say hello! 👋`,
            );
            setHasActiveConversation(true);
            setFlowStep("mentor-chat");
          } else {
            pushMessage(
              "bot",
              `Couldn't start the conversation with **${firstExpert.name}** — please try again.`,
            );
          }
        } else {
          pushMessage(
            "bot",
            `No mentors available for **${cat.name}**. Try another.`,
          );
          setFlowStep("mentor-topics");
        }
      } catch (err) {
        setIsTyping(false);
        pushMessage(
          "bot",
          "Something went wrong connecting you to a mentor. Please try again.",
        );
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
    ],
  );

  const handleSubmitQuery = useCallback(
    (e?: FormEvent) => {
      e?.preventDefault();
      if (validateQueryForm()) {
        setQuerySubmitTrigger((n) => n + 1);
      }
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
    (e?: FormEvent) => {
      e?.preventDefault();
      const message = chatbotQuestion.question?.trim();
      if (!message || !isValidChatMessage(message)) return;
      setLocalValidationErrors({});
      askQuestion();
    },
    [chatbotQuestion, askQuestion],
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
        ? (selectedFAQ?.faq_default_question ?? "Categories")
        : flowStep === "faq-questions"
          ? (selectedCategory?.topic_name ?? "Questions")
          : flowStep === "mentor-form"
            ? "Contact Support"
            : flowStep === "query-category"
              ? "Raise a Query"
              : flowStep === "query-form"
                ? "Raise a Query"
                : flowStep === "live-chat"
                  ? "Chat with Nimo Bot"
                  : flowStep === "mentor-topics"
                    ? "Talk to a Mentor"
                    : flowStep === "mentor-resume-choice"
                      ? "Talk to a Mentor"
                      : flowStep === "mentor-options"
                        ? "How can we help?"
                        : flowStep === "mentor-chat"
                          ? (autoSelectedExpert?.name ??
                            selectedConversation?.category_name ??
                            "Mentor Chat")
                          : "Next Steps";
  const displayContact = savedContact ?? mentorForm;

  const showHomeButton =
    !!savedContact &&
    (
      [
        "mentor-topics",
        "mentor-chat",
        "query-category",
        "query-form",
        "mentor-resume-choice",
        "live-chat",
      ] as FlowStep[]
    ).includes(flowStep);

  const renderResumeBanner = (variant: "inline" | "standalone" = "inline") => {
    if (
      !hasActiveConversation ||
      !selectedConversation ||
      selectedConversation.status === "CLOSED"
    )
      return null;
    return (
      <button
        className={`cw-resume-banner ${variant === "inline" ? "cw-resume-banner--inline" : ""}`}
        onClick={handleResumeConversation}
        type="button"
      >
        <span className="cw-resume-banner-icon">
          <MessageSquare size={16} />
        </span>
        <span className="cw-resume-banner-text">
          <span className="cw-resume-banner-title">
            You have an ongoing conversation
          </span>
          <span className="cw-resume-banner-sub">
            {selectedConversation.category_name
              ? `About ${selectedConversation.category_name} — tap to resume`
              : "Tap to resume"}
          </span>
        </span>
        <span className="cw-resume-banner-arrow">
          <ArrowLeft size={14} style={{ transform: "rotate(180deg)" }} />
        </span>
      </button>
    );
  };

  const renderContent = () => {
    if (flowStep === "faq-list")
      return (
        <div className="cw-faqlist-wrap">
          {renderResumeBanner("inline")}
          <div className="cw-section-title">
            <span className="cw-section-icon">
              <MessageSquare size={15} />
            </span>
            Pick a question to get started
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
                    onClick={() => handleFaqSelect(faq)}
                    type="button"
                  >
                    <MessageSquare size={14} />
                    <span>{faq.faq_default_question}</span>
                  </button>
                ))}
            </div>
          )}
          <button
            className="cw-help-btn"
            onClick={handleShowSatisfaction}
            type="button"
          >
            <MessageSquareWarning size={16} className="cw-help-btn-icon" />
            <span className="cw-help-btn-text">
              <span>Can&apos;t find your answer?</span>
              <span className="cw-help-btn-sub">Talk to our support team</span>
            </span>
          </button>
        </div>
      );
    if (flowStep === "faq-categories" && selectedFAQ) {
      const cats = selectedFAQ.categories || [];
      return (
        <div className="cw-faqlist-wrap">
          <div className="cw-section-title">
            <span className="cw-section-icon">
              <Folder size={15} />
            </span>
            Categories
          </div>
          {cats.length === 0 ? (
            <div className="cw-empty-state">No categories yet.</div>
          ) : (
            <div className="cw-faqlist-items">
              {cats.map((cat, i) => (
                <button
                  key={cat.category_generated_id || i}
                  className="cw-faqlist-item"
                  style={{ animationDelay: `${i * 0.05}s` }}
                  onClick={() => handleCategorySelect(cat)}
                  type="button"
                >
                  <Folder size={14} />
                  <span>{cat.topic_name || "Unknown"}</span>
                </button>
              ))}
            </div>
          )}
          <button
            className="cw-help-btn"
            onClick={handleShowSatisfaction}
            type="button"
          >
            <MessageSquareWarning size={16} className="cw-help-btn-icon" />
            <span className="cw-help-btn-text">
              <span>Need more help?</span>
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
            {selectedCategory.topic_name || "Questions"}
          </div>
          {questions.length === 0 ? (
            <div className="cw-empty-state">No questions yet.</div>
          ) : (
            <div className="cw-faqlist-items">
              {questions.map((q, i) => (
                <button
                  key={q.question_generated_id || i}
                  className={`cw-faqlist-item ${selectedQuestion?.question_generated_id === q.question_generated_id ? "cw-faqlist-item--active" : ""}`}
                  style={{ animationDelay: `${i * 0.05}s` }}
                  onClick={() => handleQuestionSelect(q)}
                  type="button"
                >
                  <FileText size={14} />
                  <span>{q.question_text}</span>
                </button>
              ))}
            </div>
          )}
          {selectedQuestion && (
            <div className="cw-answer-box">
              <div className="cw-answer-box-header">
                <MessageSquare size={14} />
                <span>{selectedQuestion.question_text}</span>
              </div>
              {(selectedQuestion.answers || []).length > 0 ? (
                <div className="cw-answer-list">
                  {(selectedQuestion.answers || []).map((a, i) => (
                    <p key={i} className="cw-answer-item">
                      {a.answer_text}
                    </p>
                  ))}
                </div>
              ) : (
                <p className="cw-answer-empty">No answer available yet.</p>
              )}
            </div>
          )}
          <button
            className="cw-help-btn"
            onClick={handleShowSatisfaction}
            type="button"
          >
            <MessageSquareWarning size={16} className="cw-help-btn-icon" />
            <span className="cw-help-btn-text">
              <span>Need more help?</span>
              <span className="cw-help-btn-sub">Contact our support team</span>
            </span>
          </button>
        </div>
      );
    }
    if (flowStep === "mentor-form") {
      const ci = MENTOR_STEPS.findIndex((s) => s.key === mentorFormStep);
      return (
        <div className="cw-progress-card">
          {MENTOR_STEPS.map((s, i) => (
            <div
              key={s.key}
              className={`cw-progress-step ${i < ci ? "is-done" : ""} ${i === ci ? "is-active" : ""}`}
            >
              <span className="cw-progress-dot">
                {i < ci ? <Check size={12} /> : s.icon}
              </span>
              <span className="cw-progress-label">{s.label}</span>
              {i < MENTOR_STEPS.length - 1 && (
                <span className="cw-progress-line" />
              )}
            </div>
          ))}
          {isSavingContact && (
            <div className="cw-saving-indicator">
              <Loader2 size={12} className="cw-spin" />
              Saving...
            </div>
          )}
        </div>
      );
    }
    if (flowStep === "mentor-options")
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
              onClick={handleEditContact}
              type="button"
            >
              <Pencil size={11} />
              Not you? Update details
            </button>
          </div>
          {renderResumeBanner("standalone")}
          <button
            className="cw-option-btn cw-option-chat"
            onClick={handleChatWithBot}
            type="button"
          >
            <div className="cw-option-icon">
              <Bot size={20} />
            </div>
            <div className="cw-option-text">
              <span className="cw-option-label">Chat with Nimo Bot</span>
              <span className="cw-option-desc">
                Get instant answers from Nimo Bot AI
              </span>
            </div>
          </button>
          <button
            className="cw-option-btn cw-option-mentor"
            onClick={handleShowMentorTopics}
            type="button"
          >
            <div className="cw-option-icon">
              <Users size={20} />
            </div>
            <div className="cw-option-text">
              <span className="cw-option-label">Talk to a Mentor</span>
              <span className="cw-option-desc">
                Get connected live with a topic expert
              </span>
            </div>
          </button>
          <button
            className="cw-option-btn cw-option-query"
            onClick={handleStartQueryForm}
            type="button"
          >
            <div className="cw-option-icon">
              <FileText size={20} />
            </div>
            <div className="cw-option-text">
              <span className="cw-option-label">Raise a Query</span>
              <span className="cw-option-desc">
                Log a ticket for our team to track
              </span>
            </div>
          </button>
          <button
            className="cw-option-btn cw-option-end"
            onClick={handleEndChat}
            type="button"
          >
            <div className="cw-option-icon">
              <DoorOpen size={20} />
            </div>
            <div className="cw-option-text">
              <span className="cw-option-label">End Chat</span>
              <span className="cw-option-desc">
                Close this conversation for now
              </span>
            </div>
          </button>
        </div>
      );
    if (flowStep === "mentor-resume-choice")
      return (
        <div className="cw-options-wrap">
          <button
            className="cw-option-btn cw-option-chat"
            onClick={handleResumeConversation}
            type="button"
          >
            <div className="cw-option-icon">
              <MessageSquare size={20} />
            </div>
            <div className="cw-option-text">
              <span className="cw-option-label">Resume Conversation</span>
              <span className="cw-option-desc">
                Continue chatting with{" "}
                {autoSelectedExpert?.name ??
                  selectedConversation?.category_name ??
                  "your mentor"}
              </span>
            </div>
          </button>
          <button
            className="cw-option-btn cw-option-mentor"
            onClick={handleStartNewMentorTopic}
            type="button"
          >
            <div className="cw-option-icon">
              <Users size={20} />
            </div>
            <div className="cw-option-text">
              <span className="cw-option-label">Start a New Topic</span>
              <span className="cw-option-desc">
                Talk to a different mentor about something else
              </span>
            </div>
          </button>
        </div>
      );
    if (flowStep === "query-category")
      return (
        <div className="cw-categories-wrap">
          <div className="cw-section-title">
            <span className="cw-section-icon">
              <ClipboardList size={15} />
            </span>
            Which category is this about?
          </div>
          {expertsLoading && (
            <div className="cw-skeleton-list">
              {[0, 1, 2].map((i) => (
                <div key={i} className="cw-skeleton-card" />
              ))}
            </div>
          )}
          {!expertsLoading && expertCategories.length === 0 && (
            <div className="cw-empty-state">No categories available.</div>
          )}
          {!expertsLoading && expertCategories.length > 0 && (
            <div className="cw-categories-grid">
              {expertCategories.map((cat, i) => (
                <button
                  key={cat.category_generated_id ?? i}
                  className="cw-category-card"
                  style={{ animationDelay: `${i * 0.06}s` }}
                  onClick={() => handleQueryCategorySelect(cat)}
                  type="button"
                >
                  <span className="cw-category-icon">
                    <ClipboardList size={18} />
                  </span>
                  <span className="cw-category-name">{cat.name}</span>
                </button>
              ))}
            </div>
          )}
          <button
            className="cw-skip-category-btn"
            onClick={handleSkipQueryCategory}
            type="button"
          >
            Skip — I&apos;m not sure which category
          </button>
        </div>
      );
    if (flowStep === "query-form")
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
                onClick={() => setFlowStep("query-category")}
              >
                Change
              </button>
            </div>
          )}
          <form className="cw-query-form" onSubmit={handleSubmitQuery}>
            <div className="cw-query-field">
              <label className="cw-query-label">
                <ClipboardList size={13} />
                Query title
              </label>
              <input
                className={`cw-query-input ${requestQueryErrors.query_title || localValidationErrors.query_title ? "has-error" : ""}`}
                name="query_title"
                placeholder="e.g. Unable to submit assignment"
                value={requestQuery.query_title}
                onChange={(e) => {
                  handleRequestQueryChange(e);
                  // Real-time validation
                  if (
                    e.target.value.trim().length > 0 &&
                    e.target.value.trim().length < 5
                  ) {
                    setLocalValidationErrors((prev) => ({
                      ...prev,
                      query_title:
                        "Please enter a query title (minimum 5 characters).",
                    }));
                  } else {
                    setLocalValidationErrors((prev) => {
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
                Describe the issue
              </label>
              <textarea
                className={`cw-query-textarea ${requestQueryErrors.query_description || localValidationErrors.query_description ? "has-error" : ""}`}
                name="query_description"
                placeholder="Tell us what happened..."
                value={requestQuery.query_description}
                onChange={(e) => {
                  handleRequestQueryChange(e);
                  // Real-time validation
                  if (
                    e.target.value.trim().length > 0 &&
                    e.target.value.trim().length < 10
                  ) {
                    setLocalValidationErrors((prev) => ({
                      ...prev,
                      query_description:
                        "Please describe your issue in at least 10 characters.",
                    }));
                  } else {
                    setLocalValidationErrors((prev) => {
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
                  Submitting...
                </>
              ) : (
                <>
                  <Send size={15} />
                  Submit Query
                </>
              )}
            </button>
          </form>
        </div>
      );
    if (flowStep === "mentor-topics")
      return (
        <div className="cw-categories-wrap">
          <div className="cw-section-title">
            <span className="cw-section-icon">
              <Users size={15} />
            </span>
            Pick a topic for your mentor
          </div>
          {expertsLoading && (
            <div className="cw-skeleton-list">
              {[0, 1, 2].map((i) => (
                <div key={i} className="cw-skeleton-card" />
              ))}
            </div>
          )}
          {!expertsLoading && expertCategories.length === 0 && (
            <div className="cw-empty-state">
              No mentor categories available.
            </div>
          )}
          {!expertsLoading && expertCategories.length > 0 && (
            <div className="cw-categories-grid">
              {expertCategories.map((cat, i) => {
                const catKey = cat.category_generated_id ?? cat.name;
                const isConnectingThis = connectingCategoryId === catKey;
                return (
                  <button
                    key={cat.category_generated_id ?? i}
                    className={`cw-category-card ${isConnectingThis ? "is-connecting" : ""}`}
                    style={{ animationDelay: `${i * 0.06}s` }}
                    onClick={() => handleMentorCategorySelect(cat)}
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
                          Connecting...
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
    return null;
  };

  const showFooterInput =
    flowStep === "mentor-form" ||
    flowStep === "live-chat" ||
    flowStep === "mentor-chat";

  return (
    <div className="cw-root">
      {isOpen && (
        <div className="cw-panel" role="dialog" aria-label="Nimo Bot">
          <div className="cw-header">
            {flowStep !== "faq-list" && (
              <button
                className="cw-header-back-btn"
                onClick={handleBack}
                type="button"
              >
                <ArrowLeft size={18} />
              </button>
            )}
            <div className="cw-header-icon">
              <NimoBotProfile />
            </div>
            <div className="cw-header-meta">
              <div className="cw-header-title">{headerTitle}</div>
              <div className="cw-header-status">
                <span
                  className={`cw-status-dot ${flowStep === "mentor-chat" ? (selectedConversation?.status === "ACTIVE" ? "" : selectedConversation?.status === "CLOSED" ? "cw-status-dot--closed" : "cw-status-dot--waiting") : ""}`}
                />
                <span>
                  {flowStep === "mentor-chat"
                    ? selectedConversation?.status === "ACTIVE"
                      ? "Mentor connected"
                      : selectedConversation?.status === "CLOSED"
                        ? "Closed"
                        : "Waiting"
                    : "Nimo Bot Online"}
                </span>
              </div>
            </div>
            {showHomeButton && (
              <button
                className="cw-header-home-btn"
                onClick={handleGoHome}
                type="button"
                aria-label="Switch mode"
                title="Switch mode"
              >
                <Home size={16} />
              </button>
            )}
            <button
              className="cw-close-btn"
              onClick={() => setIsOpen(false)}
              type="button"
            >
              <X size={16} />
            </button>
          </div>
          <div className="cw-messages" aria-live="polite">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`cw-msg ${m.sender === "user" ? "cw-msg--user" : ""}`}
              >
                <div
                  className={`cw-avatar ${m.sender === "bot" ? "cw-avatar--bot" : "cw-avatar--user"}`}
                >
                  {m.sender === "bot" ? <Bot size={13} /> : <User size={12} />}
                </div>
                <div
                  className={`cw-bubble ${m.sender === "bot" ? "cw-bubble--bot" : "cw-bubble--user"}`}
                >
                  {m.sender === "bot" ? (
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
            {flowStep === "live-chat" &&
              chatbotMessages.map((cm, i) => (
                <div
                  key={`chat-${i}`}
                  className={`cw-msg ${cm.role === "user" ? "cw-msg--user" : ""}`}
                >
                  <div
                    className={`cw-avatar ${cm.role === "assistant" ? "cw-avatar--bot" : "cw-avatar--user"}`}
                  >
                    {cm.role === "assistant" ? (
                      <Bot size={13} />
                    ) : (
                      <User size={12} />
                    )}
                  </div>
                  <div
                    className={`cw-bubble ${cm.role === "assistant" ? "cw-bubble--bot" : "cw-bubble--user"}`}
                  >
                    {cm.role === "assistant" ? (
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
              ))}
            {flowStep === "mentor-chat" && (
              <>
                {conversationEnded && (
                  <div className="cw-conversation-ended">
                    <Check size={14} /> This conversation has ended
                  </div>
                )}
                {mentorMessages
                  .filter(
                    (mm, idx, self) =>
                      idx ===
                      self.findIndex(
                        (m) =>
                          m.message_generated_id === mm.message_generated_id,
                      ),
                  )
                  .map((mm, i) => {
                    const iv = mm.sender === "VISITOR";
                    const lastIdx =
                      mentorMessages.filter(
                        (mm2, idx2, self2) =>
                          idx2 ===
                          self2.findIndex(
                            (m) =>
                              m.message_generated_id ===
                              mm2.message_generated_id,
                          ),
                      ).length - 1;
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
                          className={`cw-avatar ${iv ? "cw-avatar--user" : "cw-avatar--bot"}`}
                        >
                          {iv ? <User size={12} /> : <Users size={13} />}
                        </div>
                        <div
                          className={`cw-bubble ${iv ? "cw-bubble--user" : "cw-bubble--bot"}`}
                        >
                          {mm.message}
                          {iv && isLastVisitorMsg && (
                            <div className="cw-message-status">
                              {mm.is_read ? (
                                <CheckCheck
                                  size={12}
                                  className="cw-status-read"
                                />
                              ) : (
                                <Check
                                  size={12}
                                  className="cw-status-pending"
                                />
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                {conversationEnded && satisfactionStage === "ask" && (
                  <div className="cw-post-chat-actions">
                    <p className="cw-post-chat-text">
                      Was this conversation helpful? Let us know, or raise a
                      query if something&apos;s still unresolved.
                    </p>
                    <div className="cw-post-chat-buttons">
                      <button
                        className="cw-btn cw-btn--query"
                        onClick={handleRaiseQueryFromEnd}
                        type="button"
                      >
                        <FileText size={14} />
                        Raise a Query
                      </button>
                      <button
                        className="cw-btn cw-btn--satisfied"
                        onClick={handleConversationSatisfied}
                        type="button"
                      >
                        <Check size={14} />
                        All Good, Thanks
                      </button>
                    </div>
                  </div>
                )}
                {conversationEnded && satisfactionStage === "closed" && (
                  <div className="cw-post-chat-actions cw-post-chat-actions--closed">
                    <div className="cw-post-chat-icon">
                      <PartyPopper size={20} />
                    </div>
                    <p className="cw-post-chat-text">
                      Thanks for chatting with Nimo Bot today!
                    </p>
                    <div className="cw-post-chat-buttons">
                      <button
                        className="cw-btn cw-btn--home"
                        onClick={handleBackToHome}
                        type="button"
                      >
                        <Home size={14} />
                        Back to Home
                      </button>
                      <button
                        className="cw-btn cw-btn--exit"
                        onClick={handleExitChat}
                        type="button"
                      >
                        <DoorOpen size={14} />
                        Exit Chat
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
            {renderContent()}
            {(isTyping ||
              (flowStep === "live-chat" && chatbotLoading) ||
              (flowStep === "mentor-topics" && expertsLoading) ||
              (flowStep === "query-category" && expertsLoading)) && (
              <div className="cw-msg">
                <div className="cw-avatar cw-avatar--bot">
                  <Bot size={13} />
                </div>
                <div className="cw-typing">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          {showFooterInput && flowStep === "mentor-form" && (
            <div className="cw-input-area">
              {formError && <div className="cw-form-error">{formError}</div>}
              {localValidationErrors[mentorFormStep] && !formError && (
                <div className="cw-form-error">
                  {localValidationErrors[mentorFormStep]}
                </div>
              )}
              <form className="cw-input-row" onSubmit={handleSend}>
                <input
                  className={`cw-input ${formError || localValidationErrors[mentorFormStep] ? "has-error" : ""}`}
                  placeholder={
                    mentorFormStep === "name"
                      ? "Full name..."
                      : mentorFormStep === "mobile"
                        ? "Mobile number..."
                        : "Email address..."
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
              {(chatbotErrors.question || localValidationErrors.message) && (
                <div className="cw-form-error">
                  {localValidationErrors.message || chatbotErrors.question}
                </div>
              )}
              <form className="cw-input-row" onSubmit={handleLiveChatSend}>
                <input
                  className={`cw-input ${chatbotErrors.question || localValidationErrors.message ? "has-error" : ""}`}
                  placeholder="Ask Nimo Bot..."
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
                {(mentorErrors.message || localValidationErrors.message) && (
                  <div className="cw-form-error">
                    {localValidationErrors.message || mentorErrors.message}
                  </div>
                )}
                <form className="cw-input-row" onSubmit={handleMentorChatSend}>
                  <input
                    className={`cw-input ${mentorErrors.message || localValidationErrors.message ? "has-error" : ""}`}
                    placeholder={
                      selectedConversation?.status === "CLOSED"
                        ? "Conversation ended"
                        : "Type your message..."
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
          <div className="cw-footer-tag">Powered by Nimo Bot</div>
        </div>
      )}
      {!isOpen && <LauncherBotVideo onClick={() => setIsOpen(true)} />}
    </div>
  );
}

export default function ChatWidget() {
  return (
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
  );
}
