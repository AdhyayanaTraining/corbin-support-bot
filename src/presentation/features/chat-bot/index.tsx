/* eslint-disable react-hooks/preserve-manual-memoization */
/* eslint-disable react-hooks/immutability */
// // /* eslint-disable react-hooks/set-state-in-effect */
// // /* eslint-disable @typescript-eslint/no-explicit-any */
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
//   ChevronRight,
//   Loader2,
//   Pencil,
//   ClipboardList,
//   Users,
// } from "lucide-react";
// import ReactMarkdown from "react-markdown";
// import remarkGfm from "remark-gfm";
// import rehypeHighlight from "rehype-highlight";
// import "highlight.js/styles/github.css";
// import "./style.css";

// // ------------------------------------------------------------------
// // Contexts — adjust these import paths to match your project structure
// // ------------------------------------------------------------------
// import { TopicProvider, useTopic } from "@/src/application/topics/TopicContext";
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
// import type { Topic } from "@/src/application/topics/topic.types";
// import type { FAQ, FAQSubTopic } from "@/src/application/faq/faq.types";
// import type { User as ExpertUser } from "@/src/application/users/user.types";
// import type { ExpertCategory } from "@/src/application/users/user.types";

// type Sender = "bot" | "user";

// interface Message {
//   id: string;
//   sender: Sender;
//   text: string;
// }

// type FlowStep =
//   | "categories"
//   | "faq-list"
//   | "faq-node"
//   | "mentor-form"
//   | "mentor-options"
//   | "query-form"
//   | "live-chat"
//   | "mentor-topics"
//   | "mentor-experts"
//   | "mentor-chat";

// type MentorFormStep = "name" | "mobile" | "email";

// interface ContactDetails {
//   name: string;
//   mobile: string;
//   email: string;
// }

// // ------------------------------------------------------------------
// // FAQ node helpers
// // ------------------------------------------------------------------
// type FAQNode = FAQ | FAQSubTopic;

// function getNodeTitle(node: FAQNode): string {
//   return (
//     (node as FAQ).faq_default_question ??
//     (node as FAQSubTopic).faq_subtopic_title ??
//     "Untitled"
//   );
// }

// function getNodeId(node: FAQNode): string {
//   return (
//     (node as unknown as Record<string, string>).faq_generated_id ??
//     (node as unknown as Record<string, string>).faq_subtopic_generated_id ??
//     ""
//   );
// }

// function getNodeSubtopics(node: FAQNode): FAQSubTopic[] {
//   return node.faq_subtopics ?? [];
// }

// function getNodeContents(node: FAQNode): Record<string, any>[] {
//   return (node.faq_contents as unknown as Record<string, any>[]) ?? [];
// }

// function getContentQuestion(content: Record<string, any>): string | undefined {
//   return content.faq_content_question ?? content.question;
// }
// function getContentAnswer(content: Record<string, any>): string {
//   return (
//     content.faq_content_answer ??
//     content.answer ??
//     content.faq_content_text ??
//     content.content ??
//     ""
//   );
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

// const isValidName = (v: string) => v.trim().length >= 2;
// const isValidMobile = (v: string) => {
//   const digits = v.replace(/\D/g, "");
//   return digits.length >= 7 && digits.length <= 15;
// };
// const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

// const welcomeMessage = (): Message => ({
//   id: "greet-1",
//   sender: "bot",
//   text: "Hi there! I'm **CareBot**, your LMS Assistant. Pick a topic below and I'll help you find the right answer.",
// });

// const CONTACT_STORAGE_KEY = "carebot_contact_details";

// // ------------------------------------------------------------------
// // Main Chat Widget
// // ------------------------------------------------------------------
// function ChatWidgetInner() {
//   // ---- real data sources ----
//   const { topics, loading: topicsLoading } = useTopic();
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
//     selectedConversation,
//     message: mentorMessage,
//     errors: mentorErrors,
//     loading: mentorLoading,
//     handleConversationChange,
//     handleMessageChange: handleMentorMessageChange,
//     resetConversation: resetMentorConversation,
//     resetMessage: resetMentorMessage,
//     createConversation,
//     sendMessage: sendMentorMessage,
//     getConversationMessages,
//     joinRoom,
//     leaveRoom,
//   } = useChat();

//   // ---- NEW: Use User context for expert categories ----
//   const {
//     expertCategories,
//     getExpertCategories,
//     getExpertsByCategory,
//     loading: expertsLoading,
//   } = useUser();

//   const isEmbedded =
//     typeof window !== "undefined" && window.self !== window.top;

//   const [isOpen, setIsOpen] = useState(isEmbedded);

//   const [messages, setMessages] = useState<Message[]>([welcomeMessage()]);
//   const [draft, setDraft] = useState("");
//   const [isTyping, setIsTyping] = useState(false);
//   const [flowStep, setFlowStep] = useState<FlowStep>("categories");

//   const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
//   const [selectedFAQ, setSelectedFAQ] = useState<FAQ | null>(null);
//   const [subtopicPath, setSubtopicPath] = useState<FAQSubTopic[]>([]);

//   const [mentorForm, setMentorForm] = useState<ContactDetails>({
//     name: "",
//     mobile: "",
//     email: "",
//   });
//   const [mentorFormStep, setMentorFormStep] = useState<MentorFormStep>("name");
//   const [formError, setFormError] = useState<string | null>(null);

//   const [savedContact, setSavedContact] = useState<ContactDetails | null>(null);
//   const [isSavingContact, setIsSavingContact] = useState(false);

//   const [submitTrigger, setSubmitTrigger] = useState(0);
//   const pendingContactRef = useRef<ContactDetails | null>(null);

//   const [querySubmitTrigger, setQuerySubmitTrigger] = useState(0);

//   const [mentorTopicTrigger, setMentorTopicTrigger] = useState(0);
//   const pendingMentorTopicRef = useRef<Topic | null>(null);

//   const [mentorTopicName, setMentorTopicName] = useState<string | null>(null);

//   const [mentorExperts, setMentorExperts] = useState<ExpertUser[]>([]);
//   const pendingMentorExpertRef = useRef<ExpertUser | null>(null);

//   // NEW: State for selected expert category
//   const [selectedCategory, setSelectedCategory] =
//     useState<ExpertCategory | null>(null);

//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

//   // ---- load any previously saved contact from localStorage ----
//   useEffect(() => {
//     try {
//       const raw = window.localStorage.getItem(CONTACT_STORAGE_KEY);
//       if (raw) {
//         const parsed = JSON.parse(raw) as Partial<ContactDetails>;
//         if (parsed?.name && parsed?.email && parsed?.mobile) {
//           setSavedContact({
//             name: parsed.name,
//             mobile: parsed.mobile,
//             email: parsed.email,
//           });
//         }
//       }
//     } catch (err) {
//       console.error("Failed to read saved contact from local storage.", err);
//     }
//   }, []);

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
//       {
//         source: "caredata-bot-widget",
//         type: isOpen ? "OPEN" : "CLOSE",
//       },
//       "*",
//     );
//   }, [isOpen, isEmbedded]);

//   const pushMessage = useCallback((sender: Sender, text: string) => {
//     setMessages((prev) => [
//       ...prev,
//       { id: `${Date.now()}-${sender}-${Math.random()}`, sender, text },
//     ]);
//   }, []);

//   const simulateTyping = useCallback(
//     (text: string, delay = 550) => {
//       setIsTyping(true);
//       typingTimeoutRef.current = setTimeout(() => {
//         setIsTyping(false);
//         pushMessage("bot", text);
//       }, delay);
//     },
//     [pushMessage],
//   );

//   // ---- persist confirmed contact -> DB (via context) + localStorage ----
//   useEffect(() => {
//     if (submitTrigger === 0) return;

//     let cancelled = false;
//     setIsSavingContact(true);

//     (async () => {
//       const success = await addWebsiteUser();
//       if (cancelled) return;

//       const contact = pendingContactRef.current;
//       setIsSavingContact(false);

//       if (success && contact) {
//         setSavedContact(contact);

//         try {
//           window.localStorage.setItem(
//             CONTACT_STORAGE_KEY,
//             JSON.stringify(contact),
//           );
//         } catch (err) {
//           console.error("Failed to persist contact to local storage.", err);
//         }

//         setIsTyping(false);
//         pushMessage(
//           "bot",
//           `Thanks, **${contact.name}**! I've saved your details.\n\nHow would you like to proceed?`,
//         );
//         setFlowStep("mentor-options");
//       } else {
//         setIsTyping(false);
//         pushMessage(
//           "bot",
//           "Hmm, I couldn't save your details just now. Please try entering your email again.",
//         );
//         setMentorFormStep("email");
//         setDraft("");
//         setFlowStep("mentor-form");
//       }
//     })();

//     return () => {
//       cancelled = true;
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [submitTrigger]);

//   // ---- submit the request query -> DB (via context) ----
//   useEffect(() => {
//     if (querySubmitTrigger === 0) return;

//     let cancelled = false;

//     (async () => {
//       const success = await addRequestQuery();
//       if (cancelled) return;

//       if (success) {
//         const ticketRef = `TKT-${Date.now().toString(36).toUpperCase()}`;
//         const contact = savedContact ?? mentorForm;
//         pushMessage(
//           "bot",
//           `Your query has been registered!\n\nA support ticket has been created and you'll receive updates at **${contact.email}**.\n\nTicket Reference: **${ticketRef}**`,
//         );
//         setFlowStep("categories");
//       } else {
//         pushMessage(
//           "bot",
//           "I couldn't submit your query — please double-check the highlighted fields below and try again.",
//         );
//       }
//     })();

//     return () => {
//       cancelled = true;
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [querySubmitTrigger]);

//   // ---- NEW: Fetch experts when topic is selected for mentor ----
//   useEffect(() => {
//     if (mentorTopicTrigger === 0) return;

//     let cancelled = false;

//     (async () => {
//       const topic = pendingMentorTopicRef.current;
//       if (!topic) return;

//       // Fetch experts by the topic name (which serves as the category)
//       const experts = await getExpertsByCategory(topic.topic_name);

//       if (cancelled) return;

//       setIsTyping(false);

//       if (experts.length > 0) {
//         setMentorExperts(experts);
//         pushMessage(
//           "bot",
//           `I found **${experts.length} mentor${experts.length > 1 ? "s" : ""}** for **${topic.topic_name}**. Choose one to start chatting:`,
//         );
//         setFlowStep("mentor-experts");
//       } else {
//         pushMessage(
//           "bot",
//           `Unfortunately, there are no mentors available for **${topic.topic_name}** right now. Please try another topic or raise a query instead.`,
//         );
//         setFlowStep("mentor-topics");
//       }
//     })();

//     return () => {
//       cancelled = true;
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [mentorTopicTrigger]);

//   // ---- NEW: create the mentor conversation -> DB (via ChatContext) ----
//   useEffect(() => {
//     // This effect will be triggered when we select an expert
//     // We'll use a separate trigger for this
//   }, []);

//   // ---- NEW: join/leave the socket room + load history for the active conversation ----
//   useEffect(() => {
//     const conversationId = selectedConversation?.conversation_generated_id;
//     if (flowStep !== "mentor-chat" || !conversationId) return;

//     joinRoom(conversationId);
//     getConversationMessages(conversationId);

//     return () => {
//       leaveRoom(conversationId);
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [flowStep, selectedConversation?.conversation_generated_id]);

//   const currentNode: FAQNode | null =
//     subtopicPath.length > 0
//       ? subtopicPath[subtopicPath.length - 1]
//       : selectedFAQ;

//   const handleStart = useCallback(() => {
//     if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
//     setIsTyping(false);

//     if (
//       flowStep === "mentor-chat" &&
//       selectedConversation?.conversation_generated_id
//     ) {
//       leaveRoom(selectedConversation.conversation_generated_id);
//     }

//     setFlowStep("categories");
//     setSelectedTopic(null);
//     setSelectedFAQ(null);
//     setSubtopicPath([]);
//     setMentorForm({ name: "", mobile: "", email: "" });
//     setMentorFormStep("name");
//     setFormError(null);
//     setDraft("");
//     resetChatbotForm();
//     resetWebsiteUserForm();
//     resetRequestQueryForm();
//     resetMentorConversation();
//     resetMentorMessage();
//     setMentorTopicName(null);
//     setMentorExperts([]);
//     setSelectedCategory(null);
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

//     if (flowStep === "faq-list") {
//       setFlowStep("categories");
//       setSelectedTopic(null);
//       pushMessage("user", "Back to topics");
//       simulateTyping("Sure — pick another topic below:");
//     } else if (flowStep === "faq-node") {
//       if (subtopicPath.length > 0) {
//         setSubtopicPath((prev) => prev.slice(0, -1));
//       } else {
//         setSelectedFAQ(null);
//         setFlowStep("faq-list");
//         pushMessage("user", "Back to FAQs");
//         simulateTyping("Here are more questions you can pick from:");
//       }
//     } else if (flowStep === "query-form") {
//       resetRequestQueryForm();
//       setFlowStep("mentor-options");
//       pushMessage("user", "Back");
//       simulateTyping("No problem — how would you like to proceed?");
//     } else if (flowStep === "mentor-topics") {
//       setFlowStep("mentor-options");
//       pushMessage("user", "Back");
//       simulateTyping("No problem — how would you like to proceed?");
//     } else if (flowStep === "mentor-experts") {
//       setMentorExperts([]);
//       setFlowStep("mentor-topics");
//       pushMessage("user", "Back");
//       simulateTyping("Which topic would you like to talk to a mentor about?");
//     } else if (flowStep === "mentor-chat") {
//       if (selectedConversation?.conversation_generated_id) {
//         leaveRoom(selectedConversation.conversation_generated_id);
//       }
//       resetMentorConversation();
//       resetMentorMessage();
//       setFlowStep("mentor-experts");
//       pushMessage("user", "Back");
//       simulateTyping("Choose another mentor, or pick a different topic above.");
//     } else if (
//       flowStep === "mentor-form" ||
//       flowStep === "mentor-options" ||
//       flowStep === "live-chat"
//     ) {
//       handleStart();
//     }
//   }, [
//     flowStep,
//     subtopicPath,
//     selectedConversation,
//     leaveRoom,
//     resetMentorConversation,
//     resetMentorMessage,
//     pushMessage,
//     simulateTyping,
//     handleStart,
//     resetRequestQueryForm,
//   ]);

//   // ---- Topic selection (FAQ browsing) ----
//   const handleTopicSelect = useCallback(
//     (topic: Topic) => {
//       setSelectedTopic(topic);
//       setFlowStep("faq-list");
//       pushMessage("user", topic.topic_name);
//       simulateTyping(
//         `Great choice! Here are some frequently asked questions related to **${topic.topic_name}**:`,
//       );
//     },
//     [pushMessage, simulateTyping],
//   );

//   // ---- FAQ selection (top level) ----
//   const handleFaqSelect = useCallback(
//     (faq: FAQ) => {
//       setSelectedFAQ(faq);
//       setSubtopicPath([]);
//       setFlowStep("faq-node");
//       pushMessage("user", getNodeTitle(faq));

//       const contents = getNodeContents(faq);
//       const subtopics = getNodeSubtopics(faq);

//       if (contents.length > 0) {
//         const combined = contents
//           .map((c) => getContentAnswer(c))
//           .filter(Boolean)
//           .join("\n\n");
//         simulateTyping(combined || "Here's more detail on that topic below:");
//       } else if (subtopics.length > 0) {
//         simulateTyping("This has a few sub-topics — pick one to go deeper:");
//       } else {
//         simulateTyping(
//           "I don't have a written answer for this one yet — you can contact our support team below.",
//         );
//       }
//     },
//     [pushMessage, simulateTyping],
//   );

//   // ---- Subtopic drill-down ----
//   const handleSubtopicSelect = useCallback(
//     (subtopic: FAQSubTopic) => {
//       setSubtopicPath((prev) => [...prev, subtopic]);
//       pushMessage("user", getNodeTitle(subtopic));

//       const contents = getNodeContents(subtopic);
//       const subtopics = getNodeSubtopics(subtopic);

//       if (contents.length > 0) {
//         const combined = contents
//           .map((c) => getContentAnswer(c))
//           .filter(Boolean)
//           .join("\n\n");
//         simulateTyping(combined || "Here's more detail on that topic below:");
//       } else if (subtopics.length > 0) {
//         simulateTyping("This has a few sub-topics — pick one to go deeper:");
//       } else {
//         simulateTyping(
//           "I don't have a written answer for this one yet — you can contact our support team below.",
//         );
//       }
//     },
//     [pushMessage, simulateTyping],
//   );

//   const handleShowSatisfaction = useCallback(() => {
//     if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
//     pushMessage("user", "This didn't answer my question");

//     if (savedContact) {
//       setIsTyping(true);
//       typingTimeoutRef.current = setTimeout(() => {
//         setIsTyping(false);
//         pushMessage(
//           "bot",
//           `Welcome back, **${savedContact.name}**! How would you like to proceed?`,
//         );
//         setMentorForm(savedContact);
//         setFlowStep("mentor-options");
//       }, 550);
//       return;
//     }

//     setIsTyping(true);
//     typingTimeoutRef.current = setTimeout(() => {
//       setIsTyping(false);
//       pushMessage(
//         "bot",
//         "No worries — let's get you the right help. First, what's your **full name**?",
//       );
//       setMentorForm({ name: "", mobile: "", email: "" });
//       setMentorFormStep("name");
//       setFormError(null);
//       setDraft("");
//       setFlowStep("mentor-form");
//     }, 550);
//   }, [pushMessage, savedContact]);

//   const handleEditContact = useCallback(() => {
//     setSavedContact(null);
//     try {
//       window.localStorage.removeItem(CONTACT_STORAGE_KEY);
//     } catch (err) {
//       console.error("Failed to clear saved contact from local storage.", err);
//     }

//     pushMessage("user", "Update my details");
//     setMentorForm({ name: "", mobile: "", email: "" });
//     setMentorFormStep("name");
//     setFormError(null);
//     setDraft("");
//     setIsTyping(true);
//     typingTimeoutRef.current = setTimeout(() => {
//       setIsTyping(false);
//       pushMessage("bot", "No problem! What's your **full name**?");
//       setFlowStep("mentor-form");
//     }, 550);
//   }, [pushMessage]);

//   const handleMentorFormSubmit = useCallback(() => {
//     const text = draft.trim();
//     if (!text) return;

//     if (mentorFormStep === "name") {
//       if (!isValidName(text)) {
//         setFormError("Please enter your full name.");
//         return;
//       }
//       setFormError(null);
//       pushMessage("user", text);
//       setMentorForm((prev) => ({ ...prev, name: text }));
//       setMentorFormStep("mobile");
//       setDraft("");
//       simulateTyping(
//         `Nice to meet you, **${text}**! What's the best **mobile number** to reach you?`,
//       );
//       return;
//     }

//     if (mentorFormStep === "mobile") {
//       if (!isValidMobile(text)) {
//         setFormError("Please enter a valid mobile number.");
//         return;
//       }
//       setFormError(null);
//       pushMessage("user", text);
//       setMentorForm((prev) => ({ ...prev, mobile: text }));
//       setMentorFormStep("email");
//       setDraft("");
//       simulateTyping("Great, one last thing — what's your **email address**?");
//       return;
//     }

//     if (!isValidEmail(text)) {
//       setFormError("Please enter a valid email address.");
//       return;
//     }
//     setFormError(null);
//     pushMessage("user", text);

//     const finalForm: ContactDetails = { ...mentorForm, email: text };
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
//     pushMessage,
//     simulateTyping,
//     handleWebsiteUserChange,
//   ]);

//   const handleChatWithBot = useCallback(() => {
//     const contact = savedContact ?? mentorForm;
//     pushMessage("user", "Chat with Bot");
//     simulateTyping(
//       `You're through to CareBot AI now, **${contact.name}**. Ask me anything and I'll do my best to help.`,
//     );
//     setFlowStep("live-chat");
//   }, [savedContact, mentorForm, pushMessage, simulateTyping]);

//   const handleStartQueryForm = useCallback(() => {
//     const contact = savedContact ?? mentorForm;

//     handleRequestQueryChange({
//       target: { name: "name", value: contact.name },
//     } as ChangeEvent<HTMLInputElement>);
//     handleRequestQueryChange({
//       target: { name: "email", value: contact.email },
//     } as ChangeEvent<HTMLInputElement>);
//     handleRequestQueryChange({
//       target: { name: "phone_number", value: contact.mobile },
//     } as ChangeEvent<HTMLInputElement>);
//     handleRequestQueryChange({
//       target: { name: "query_title", value: "" },
//     } as ChangeEvent<HTMLInputElement>);
//     handleRequestQueryChange({
//       target: { name: "query_description", value: "" },
//     } as ChangeEvent<HTMLTextAreaElement>);

//     pushMessage("user", "Raise a Query");
//     simulateTyping(
//       "Sure — give me a short title and a bit of detail about the issue, and I'll log it for our team.",
//     );
//     setFlowStep("query-form");
//   }, [
//     savedContact,
//     mentorForm,
//     pushMessage,
//     simulateTyping,
//     handleRequestQueryChange,
//   ]);

//   // ---- "Talk to a Mentor" -> fetch and show expert categories ----
//   const handleShowMentorTopics = useCallback(async () => {
//     pushMessage("user", "Talk to a Mentor");

//     // Fetch expert categories from the API
//     const categories = await getExpertCategories();

//     if (categories.length > 0) {
//       simulateTyping("Which topic would you like to talk to a mentor about?");
//       setFlowStep("mentor-topics");
//     } else {
//       simulateTyping(
//         "No mentor categories are available at the moment. Please try again later.",
//       );
//       setFlowStep("mentor-options");
//     }
//   }, [pushMessage, simulateTyping, getExpertCategories]);

//   // ---- Picking an expert category to find mentors ----
//   const handleMentorCategorySelect = useCallback(
//     async (category: ExpertCategory) => {
//       const contact = savedContact ?? mentorForm;
//       pushMessage("user", category.name);

//       setSelectedCategory(category);
//       setIsTyping(true);

//       // Fetch experts for this category
//       const experts = await getExpertsByCategory(
//         category.category_generated_id ?? "",
//       );
//       setIsTyping(false);

//       if (experts.length > 0) {
//         setMentorExperts(experts);
//         pushMessage(
//           "bot",
//           `I found **${experts.length} mentor${experts.length > 1 ? "s" : ""}** for **${category.name}**. Choose one to start chatting:`,
//         );
//         setFlowStep("mentor-experts");
//       } else {
//         pushMessage(
//           "bot",
//           `Unfortunately, there are no mentors available for **${category.name}** right now. Please try another category or raise a query instead.`,
//         );
//         setFlowStep("mentor-topics");
//       }
//     },
//     [savedContact, mentorForm, pushMessage, getExpertsByCategory],
//   );

//   // ---- Select an expert to chat with ----
//   const handleExpertSelect = useCallback(
//     async (expert: ExpertUser) => {
//       const contact = savedContact ?? mentorForm;

//       pushMessage("user", `Chat with ${expert.name}`);

//       // Build payload directly
//       const conversationPayload = {
//         visitor_name: contact.name,
//         visitor_email: contact.email,
//         visitor_phone_number: contact.mobile,
//         category_generated_id: selectedCategory?.category_generated_id ?? "",
//         category_name: selectedCategory?.name ?? "",
//       };

//       // Update context state
//       Object.entries(conversationPayload).forEach(([name, value]) => {
//         handleConversationChange({
//           target: {
//             name,
//             value,
//           },
//         } as ChangeEvent<HTMLInputElement>);
//       });

//       setIsTyping(true);

//       // Wait for React state update
//       await new Promise((resolve) => setTimeout(resolve, 0));

//       const success = await createConversation({
//         visitor_name: contact.name,
//         visitor_email: contact.email,
//         visitor_phone_number: contact.mobile,
//         category_generated_id: selectedCategory?.category_generated_id ?? "",
//         category_name: selectedCategory?.name ?? "",
//       });

//       setIsTyping(false);

//       if (success) {
//         pushMessage(
//           "bot",
//           `Connecting you with **${expert.name}**. Say hello below — they'll join shortly.`,
//         );

//         setFlowStep("mentor-chat");
//       } else {
//         pushMessage(
//           "bot",
//           "I couldn't start that conversation right now — please try again in a moment.",
//         );
//       }
//     },
//     [
//       savedContact,
//       mentorForm,
//       pushMessage,
//       handleConversationChange,
//       createConversation,
//       selectedCategory,
//     ],
//   );

//   const handleSubmitQuery = useCallback((e?: FormEvent) => {
//     e?.preventDefault();
//     setQuerySubmitTrigger((n) => n + 1);
//   }, []);

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
//       if (!chatbotQuestion.question?.trim()) return;
//       askQuestion();
//     },
//     [chatbotQuestion, askQuestion],
//   );

//   const handleMentorChatSend = useCallback(
//     (e?: FormEvent) => {
//       e?.preventDefault();
//       if (!mentorMessage.message?.trim()) return;
//       if (!selectedConversation?.conversation_generated_id) return;
//       if (selectedConversation.status === "CLOSED") return;

//       sendMentorMessage();
//     },
//     [mentorMessage, selectedConversation, sendMentorMessage],
//   );

//   const headerTitle =
//     flowStep === "categories"
//       ? "CareBot"
//       : flowStep === "faq-list"
//         ? (selectedTopic?.topic_name ?? "FAQs")
//         : flowStep === "faq-node"
//           ? currentNode
//             ? getNodeTitle(currentNode)
//             : "FAQ"
//           : flowStep === "mentor-form"
//             ? "Contact Support"
//             : flowStep === "query-form"
//               ? "Raise a Query"
//               : flowStep === "live-chat"
//                 ? "Live Chat"
//                 : flowStep === "mentor-topics"
//                   ? "Talk to a Mentor"
//                   : flowStep === "mentor-experts"
//                     ? (selectedCategory?.name ?? "Choose Mentor")
//                     : flowStep === "mentor-chat"
//                       ? (selectedConversation?.category_name ??
//                         mentorTopicName ??
//                         "Mentor Chat")
//                       : "Next Steps";

//   const displayContact = savedContact ?? mentorForm;

//   const renderContent = () => {
//     // ---- TOPICS (categories) ----
//     if (flowStep === "categories") {
//       return (
//         <div className="cw-categories-wrap">
//           <div className="cw-section-title">Choose a topic to get started</div>

//           {topicsLoading && (
//             <div className="cw-skeleton-list">
//               {[0, 1, 2].map((i) => (
//                 <div key={i} className="cw-skeleton-card" />
//               ))}
//             </div>
//           )}

//           {!topicsLoading && topics.length === 0 && (
//             <div className="cw-empty-state">No topics available right now.</div>
//           )}

//           {!topicsLoading && topics.length > 0 && (
//             <div className="cw-categories-grid">
//               {topics
//                 .filter((t) => t.isActiveTopic)
//                 .map((topic, i) => (
//                   <button
//                     key={topic.topic_generated_id ?? i}
//                     className="cw-category-card"
//                     style={{ animationDelay: `${i * 0.06}s` }}
//                     onClick={() => handleTopicSelect(topic)}
//                     type="button"
//                   >
//                     <span className="cw-category-icon">
//                       <Folder size={18} />
//                     </span>
//                     <span className="cw-category-name">{topic.topic_name}</span>
//                     {topic.topic_description && (
//                       <span className="cw-category-count">Info</span>
//                     )}
//                   </button>
//                 ))}
//             </div>
//           )}
//         </div>
//       );
//     }

//     // ---- FAQ LIST (top level) ----
//     if (flowStep === "faq-list") {
//       return (
//         <div className="cw-faqlist-wrap">
//           <div className="cw-section-title">
//             <span className="cw-section-icon">
//               <Folder size={15} />
//             </span>
//             Frequently asked questions
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
//                     key={getNodeId(faq) || i}
//                     className="cw-faqlist-item"
//                     style={{ animationDelay: `${i * 0.05}s` }}
//                     onClick={() => handleFaqSelect(faq)}
//                     type="button"
//                   >
//                     <FileText size={14} />
//                     <span>{getNodeTitle(faq)}</span>
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
//     }

//     // ---- FAQ NODE (a top-level FAQ or a nested subtopic) ----
//     if (flowStep === "faq-node" && currentNode) {
//       const subtopics = getNodeSubtopics(currentNode);

//       return (
//         <div className="cw-answer-wrap">
//           {subtopicPath.length > 0 && (
//             <div className="cw-breadcrumb">
//               <button
//                 className="cw-breadcrumb-item"
//                 onClick={() => setSubtopicPath([])}
//                 type="button"
//               >
//                 {selectedFAQ ? getNodeTitle(selectedFAQ) : "FAQ"}
//               </button>
//               {subtopicPath.map((sub, i) => (
//                 <span key={getNodeId(sub) || i} className="cw-breadcrumb-item">
//                   <ChevronRight size={12} />
//                   {getNodeTitle(sub)}
//                 </span>
//               ))}
//             </div>
//           )}

//           {subtopics.length > 0 && (
//             <div className="cw-faqlist-items cw-subtopics-list">
//               {subtopics.map((sub, i) => (
//                 <button
//                   key={getNodeId(sub) || i}
//                   className="cw-faqlist-item"
//                   style={{ animationDelay: `${i * 0.05}s` }}
//                   onClick={() => handleSubtopicSelect(sub)}
//                   type="button"
//                 >
//                   <Folder size={14} />
//                   <span>{getNodeTitle(sub)}</span>
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
//               <span>Didn&apos;t answer your question?</span>
//               <span className="cw-help-btn-sub">Contact our support team</span>
//             </span>
//           </button>
//         </div>
//       );
//     }

//     // ---- MENTOR / HANDOFF FORM PROGRESS ----
//     if (flowStep === "mentor-form") {
//       const currentIndex = MENTOR_STEPS.findIndex(
//         (s) => s.key === mentorFormStep,
//       );
//       return (
//         <div className="cw-progress-card">
//           {MENTOR_STEPS.map((s, i) => (
//             <div
//               key={s.key}
//               className={`cw-progress-step ${i < currentIndex ? "is-done" : ""} ${
//                 i === currentIndex ? "is-active" : ""
//               }`}
//             >
//               <span className="cw-progress-dot">
//                 {i < currentIndex ? <Check size={12} /> : s.icon}
//               </span>
//               <span className="cw-progress-label">{s.label}</span>
//               {i < MENTOR_STEPS.length - 1 && (
//                 <span className="cw-progress-line" />
//               )}
//             </div>
//           ))}
//           {isSavingContact && mentorFormStep === "email" && (
//             <div className="cw-saving-indicator">
//               <Loader2 size={12} className="cw-spin" />
//               Saving your details...
//             </div>
//           )}
//         </div>
//       );
//     }

//     // ---- MENTOR OPTIONS ----
//     if (flowStep === "mentor-options") {
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
//                 Get instant answers from CareBot AI
//               </span>
//             </div>
//           </button>
//           {/* Talk to a Mentor */}
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
//     }

//     // ---- REQUEST QUERY FORM ----
//     if (flowStep === "query-form") {
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
//               <label className="cw-query-label" htmlFor="cw-query-title">
//                 <ClipboardList size={13} />
//                 Query title
//               </label>
//               <input
//                 id="cw-query-title"
//                 className={`cw-query-input ${
//                   requestQueryErrors.query_title ? "has-error" : ""
//                 }`}
//                 name="query_title"
//                 placeholder="e.g. Unable to submit assignment"
//                 value={requestQuery.query_title}
//                 onChange={handleRequestQueryChange}
//                 disabled={requestQueryLoading}
//                 autoFocus
//               />
//               {requestQueryErrors.query_title && (
//                 <span className="cw-query-error">
//                   {requestQueryErrors.query_title}
//                 </span>
//               )}
//             </div>

//             <div className="cw-query-field">
//               <label className="cw-query-label" htmlFor="cw-query-description">
//                 <FileText size={13} />
//                 Describe the issue
//               </label>
//               <textarea
//                 id="cw-query-description"
//                 className={`cw-query-textarea ${
//                   requestQueryErrors.query_description ? "has-error" : ""
//                 }`}
//                 name="query_description"
//                 placeholder="Tell us what happened, what you expected, and any error messages you saw..."
//                 value={requestQuery.query_description}
//                 onChange={handleRequestQueryChange}
//                 disabled={requestQueryLoading}
//                 rows={4}
//               />
//               {requestQueryErrors.query_description && (
//                 <span className="cw-query-error">
//                   {requestQueryErrors.query_description}
//                 </span>
//               )}
//             </div>

//             <button
//               type="submit"
//               className="cw-query-submit-btn"
//               disabled={
//                 requestQueryLoading ||
//                 !requestQuery.query_title?.trim() ||
//                 !requestQuery.query_description?.trim()
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
//     }

//     // ---- MENTOR CATEGORY PICKER (fetched from expert categories) ----
//     if (flowStep === "mentor-topics") {
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
//               No mentor categories available right now.
//             </div>
//           )}

//           {!expertsLoading && expertCategories.length > 0 && (
//             <div className="cw-categories-grid">
//               {expertCategories.map((category, i) => (
//                 <button
//                   key={category.category_generated_id ?? i}
//                   className="cw-category-card"
//                   style={{ animationDelay: `${i * 0.06}s` }}
//                   onClick={() => handleMentorCategorySelect(category)}
//                   type="button"
//                 >
//                   <span className="cw-category-icon">
//                     <Users size={18} />
//                   </span>
//                   <span className="cw-category-name">{category.name}</span>
//                   {category.description && (
//                     <span className="cw-category-count">Info</span>
//                   )}
//                 </button>
//               ))}
//             </div>
//           )}
//         </div>
//       );
//     }

//     // ---- MENTOR EXPERTS LIST ----
//     if (flowStep === "mentor-experts") {
//       return (
//         <div className="cw-faqlist-wrap">
//           <div className="cw-section-title">
//             <span className="cw-section-icon">
//               <Users size={15} />
//             </span>
//             Choose a mentor
//           </div>

//           {mentorExperts.length === 0 && (
//             <div className="cw-empty-state">
//               No mentors available for this category.
//             </div>
//           )}

//           {mentorExperts.length > 0 && (
//             <div className="cw-faqlist-items">
//               {mentorExperts.map((expert, i) => (
//                 <button
//                   key={expert.user_generated_id ?? i}
//                   className="cw-faqlist-item"
//                   style={{ animationDelay: `${i * 0.05}s` }}
//                   onClick={() => handleExpertSelect(expert)}
//                   type="button"
//                 >
//                   <User size={14} />
//                   <span>{expert.name}</span>
//                   {expert.email && (
//                     <span className="cw-expert-email">{expert.email}</span>
//                   )}
//                 </button>
//               ))}
//             </div>
//           )}
//         </div>
//       );
//     }

//     return null;
//   };

//   const showFooterInput =
//     flowStep === "mentor-form" ||
//     flowStep === "live-chat" ||
//     flowStep === "mentor-chat";

//   return (
//     <div className="cw-root">
//       {isOpen && (
//         <div className="cw-panel" role="dialog" aria-label="CareBot Chatbot">
//           {/* Header */}
//           <div className="cw-header">
//             {flowStep !== "categories" && (
//               <button
//                 className="cw-header-back-btn"
//                 onClick={handleBack}
//                 aria-label="Go back"
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
//                 {flowStep === "mentor-chat" ? (
//                   <>
//                     <span
//                       className={`cw-status-dot ${
//                         selectedConversation?.status === "ACTIVE"
//                           ? ""
//                           : "cw-status-dot--waiting"
//                       }`}
//                     />
//                     <span>
//                       {selectedConversation?.status === "ACTIVE"
//                         ? "Mentor connected"
//                         : selectedConversation?.status === "CLOSED"
//                           ? "Conversation closed"
//                           : "Waiting for mentor"}
//                     </span>
//                   </>
//                 ) : (
//                   <>
//                     <span className="cw-status-dot" />
//                     <span>Online</span>
//                   </>
//                 )}
//               </div>
//             </div>
//             <button
//               className="cw-close-btn"
//               onClick={() => setIsOpen(false)}
//               aria-label="Close chat"
//               type="button"
//             >
//               <X size={16} />
//             </button>
//           </div>

//           {/* Messages */}
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

//             {/* Live chatbot conversation */}
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

//             {/* Live mentor conversation */}
//             {flowStep === "mentor-chat" && (
//               <>
//                 {mentorMessages.length === 0 && !mentorLoading && (
//                   <div className="cw-empty-state cw-mentor-empty">
//                     No messages yet — send the first one below.
//                   </div>
//                 )}
//                 {mentorMessages.map((mm, i) => {
//                   const isVisitor = mm.sender === "VISITOR";
//                   return (
//                     <div
//                       key={mm.message_generated_id ?? `mentor-${i}`}
//                       className={`cw-msg ${isVisitor ? "cw-msg--user" : ""}`}
//                     >
//                       <div
//                         className={`cw-avatar ${isVisitor ? "cw-avatar--user" : "cw-avatar--bot"}`}
//                       >
//                         {isVisitor ? <User size={12} /> : <Users size={13} />}
//                       </div>
//                       <div
//                         className={`cw-bubble ${isVisitor ? "cw-bubble--user" : "cw-bubble--bot"}`}
//                       >
//                         {mm.message}
//                       </div>
//                     </div>
//                   );
//                 })}
//               </>
//             )}

//             {renderContent()}

//             {(isTyping ||
//               (flowStep === "live-chat" && chatbotLoading) ||
//               (flowStep === "mentor-topics" && expertsLoading) ||
//               (flowStep === "mentor-experts" && mentorLoading)) && (
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

//           {/* Footer input — mentor form, live chat, or mentor chat */}
//           {showFooterInput && flowStep === "mentor-form" && (
//             <div className="cw-input-area">
//               {formError && <div className="cw-form-error">{formError}</div>}
//               <form className="cw-input-row" onSubmit={handleSend}>
//                 <input
//                   className={`cw-input ${formError ? "has-error" : ""}`}
//                   placeholder={
//                     mentorFormStep === "name"
//                       ? "Enter your full name..."
//                       : mentorFormStep === "mobile"
//                         ? "Enter your mobile number..."
//                         : "Enter your email address..."
//                   }
//                   value={draft}
//                   onChange={(e) => {
//                     setDraft(e.target.value);
//                     if (formError) setFormError(null);
//                   }}
//                   aria-label="Type your response"
//                   type={
//                     mentorFormStep === "email"
//                       ? "email"
//                       : mentorFormStep === "mobile"
//                         ? "tel"
//                         : "text"
//                   }
//                   disabled={isSavingContact}
//                   autoFocus
//                 />
//                 <button
//                   type="submit"
//                   className="cw-send-btn"
//                   disabled={!draft.trim() || isSavingContact}
//                   aria-label="Send message"
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
//               {chatbotErrors.question && (
//                 <div className="cw-form-error">{chatbotErrors.question}</div>
//               )}
//               <form className="cw-input-row" onSubmit={handleLiveChatSend}>
//                 <input
//                   className={`cw-input ${chatbotErrors.question ? "has-error" : ""}`}
//                   placeholder="Ask CareBot anything..."
//                   value={chatbotQuestion.question ?? ""}
//                   onChange={handleChatbotChange}
//                   name="question"
//                   aria-label="Type your question"
//                   autoFocus
//                 />
//                 <button
//                   type="submit"
//                   className="cw-send-btn"
//                   disabled={!chatbotQuestion.question?.trim() || chatbotLoading}
//                   aria-label="Send message"
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

//           {/* Mentor chat input */}
//           {showFooterInput && flowStep === "mentor-chat" && (
//             <div className="cw-input-area">
//               {mentorErrors.message && (
//                 <div className="cw-form-error">{mentorErrors.message}</div>
//               )}
//               <form className="cw-input-row" onSubmit={handleMentorChatSend}>
//                 <input
//                   className={`cw-input ${mentorErrors.message ? "has-error" : ""}`}
//                   placeholder={
//                     selectedConversation?.status === "CLOSED"
//                       ? "This conversation has ended"
//                       : "Type your message..."
//                   }
//                   value={mentorMessage.message ?? ""}
//                   onChange={handleMentorMessageChange}
//                   name="message"
//                   aria-label="Type your message to the mentor"
//                   disabled={selectedConversation?.status === "CLOSED"}
//                   autoFocus
//                 />
//                 <button
//                   type="submit"
//                   className="cw-send-btn"
//                   disabled={
//                     !mentorMessage.message?.trim() ||
//                     selectedConversation?.status === "CLOSED"
//                   }
//                   aria-label="Send message"
//                 >
//                   <Send size={16} />
//                 </button>
//               </form>
//             </div>
//           )}

//           <div className="cw-footer-tag">
//             Powered by CareBot · GoldCrest.Ai LMS
//           </div>
//         </div>
//       )}

//       {/* Launcher - show when closed */}
//       {!isOpen && (
//         <button
//           className="cw-launcher"
//           onClick={() => setIsOpen(true)}
//           aria-label="Open chat"
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
//     <TopicProvider>
//       <FAQProvider>
//         <ChatbotProvider>
//           <WebsiteUserProvider>
//             <RequestQueryProvider>
//               <UserProvider>
//                 <ChatProvider>
//                   <ChatWidgetInner />
//                 </ChatProvider>
//               </UserProvider>
//             </RequestQueryProvider>
//           </WebsiteUserProvider>
//         </ChatbotProvider>
//       </FAQProvider>
//     </TopicProvider>
//   );
// }
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
  MessageCircle,
  User,
  X,
  ArrowLeft,
  FileText,
  Send,
  Sparkles,
  Phone,
  Mail,
  Bot,
  Check,
  Folder,
  HelpCircle,
  MessageSquareWarning,
  Loader2,
  Pencil,
  ClipboardList,
  Users,
  MessageSquare,
  Clock,
  CheckCheck,
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

type FlowStep =
  | "faq-list"
  | "faq-categories"
  | "faq-questions"
  | "mentor-form"
  | "mentor-options"
  | "post-chat-options"
  | "query-form"
  | "live-chat"
  | "mentor-topics"
  | "mentor-chat";

type MentorFormStep = "name" | "mobile" | "email";

interface ContactDetails {
  name: string;
  mobile: string;
  email: string;
  registered_employee_generated_id?: string;
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

const isValidName = (v: string) => v.trim().length >= 2;
const isValidMobile = (v: string) => {
  const d = v.replace(/\D/g, "");
  return d.length >= 7 && d.length <= 15;
};
const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

const welcomeMessage = (): Message => ({
  id: "greet-1",
  sender: "bot",
  text: "Hi there! I'm **CareBot**, your LMS Assistant. Pick a question below and I'll help you find the right answer.",
});

const CONTACT_STORAGE_KEY = "carebot_contact_details";

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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasSavedContact = useRef(false);
  const [conversationEnded, setConversationEnded] = useState(false);

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

  // Restore latest conversation (including CLOSED)
  useEffect(() => {
    if (!conversations || conversations.length === 0) return;
    if (flowStep === "mentor-chat") return;
    const latestConversation = [...conversations].sort(
      (a, b) =>
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
    )[0];
    if (latestConversation) {
      setSelectedConversation(latestConversation);
      getConversationMessages(latestConversation.conversation_generated_id);
      if (latestConversation.status === "CLOSED") {
        setConversationEnded(true);
      }
      setFlowStep("mentor-chat");
    }
  }, [conversations]);

  // Watch for conversation close
  useEffect(() => {
    if (
      selectedConversation?.status === "CLOSED" &&
      flowStep === "mentor-chat"
    ) {
      setConversationEnded(true);
      pushMessage("bot", "This conversation has been ended by the mentor.");
      simulateTyping("Do you have any more questions I can help with?");
    }
  }, [selectedConversation?.status]);

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
      { source: "caredata-bot-widget", type: isOpen ? "OPEN" : "CLOSE" },
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
      setIsTyping(true);
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        pushMessage("bot", text);
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
      const ok = await addRequestQuery();
      if (c) return;
      if (ok) {
        pushMessage(
          "bot",
          `Your query has been registered!\n\nTicket: **TKT-${Date.now().toString(36).toUpperCase()}**`,
        );
        setFlowStep("faq-list");
      } else
        pushMessage("bot", "I couldn't submit your query — please try again.");
    })();
    return () => {
      c = true;
    };
  }, [querySubmitTrigger]);

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
    setAutoSelectedExpert(null);
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

  const handleBack = useCallback(() => {
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    setIsTyping(false);
    setFormError(null);
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
    } else if (flowStep === "query-form") {
      resetRequestQueryForm();
      setFlowStep("post-chat-options");
      pushMessage("user", "Back");
      simulateTyping("How would you like to proceed?");
    } else if (flowStep === "post-chat-options") {
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
      setAutoSelectedExpert(null);
      setFlowStep("mentor-topics");
      pushMessage("user", "Back");
      simulateTyping("Choose another topic.");
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

  const handleShowSatisfaction = useCallback(() => {
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    pushMessage("user", "I need more help");
    if (savedContact) {
      if (selectedConversation && selectedConversation.status !== "CLOSED") {
        setIsTyping(true);
        typingTimeoutRef.current = setTimeout(() => {
          setIsTyping(false);
          pushMessage(
            "bot",
            `Welcome back, **${savedContact.name}**! Resuming...`,
          );
          setFlowStep("mentor-chat");
        }, 550);
      } else {
        setIsTyping(true);
        typingTimeoutRef.current = setTimeout(() => {
          setIsTyping(false);
          pushMessage("bot", `Welcome back, **${savedContact.name}**!`);
          setMentorForm(savedContact);
          setFlowStep("mentor-options");
        }, 550);
      }
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
      setDraft("");
      setFlowStep("mentor-form");
    }, 550);
  }, [pushMessage, savedContact, selectedConversation]);

  const handleEditContact = useCallback(() => {
    setSavedContact(null);
    setWaitingForEmployeeId(false);
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
  }, [pushMessage]);

  const handleMentorFormSubmit = useCallback(() => {
    const text = draft.trim();
    if (!text) return;
    if (mentorFormStep === "name") {
      if (!isValidName(text)) {
        setFormError("Enter your full name.");
        return;
      }
      setFormError(null);
      pushMessage("user", text);
      setMentorForm((p) => ({ ...p, name: text }));
      setMentorFormStep("mobile");
      setDraft("");
      simulateTyping(`Nice to meet you, **${text}**! Mobile number?`);
      return;
    }
    if (mentorFormStep === "mobile") {
      if (!isValidMobile(text)) {
        setFormError("Enter valid mobile.");
        return;
      }
      setFormError(null);
      pushMessage("user", text);
      setMentorForm((p) => ({ ...p, mobile: text }));
      setMentorFormStep("email");
      setDraft("");
      simulateTyping("Email address?");
      return;
    }
    if (!isValidEmail(text)) {
      setFormError("Enter valid email.");
      return;
    }
    setFormError(null);
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
    pushMessage("user", "Chat with Bot");
    simulateTyping(
      `You're through to CareBot AI, **${c.name}**. Ask me anything.`,
    );
    setFlowStep("live-chat");
  }, [savedContact, mentorForm, pushMessage, simulateTyping]);

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
    pushMessage("user", "Raise a Query");
    simulateTyping("Give me a title and details.");
    setFlowStep("query-form");
  }, [
    savedContact,
    mentorForm,
    pushMessage,
    simulateTyping,
    handleRequestQueryChange,
  ]);

  // Handle "No" after conversation ends
  const handleNoMoreQuestions = useCallback(() => {
    pushMessage("user", "No, that's all");
    simulateTyping(
      "Thank you for chatting with us! If you need any help in the future, don't hesitate to reach out. Have a great day! 😊",
    );
    setTimeout(() => {
      setFlowStep("faq-list");
    }, 2000);
  }, [pushMessage, simulateTyping]);

  // Handle "Yes" after conversation ends - show options
  const handleYesMoreQuestions = useCallback(() => {
    pushMessage("user", "Yes, I have more questions");
    simulateTyping(
      "Sure! How would you like to proceed? You can chat with our AI bot or raise a query if you're not satisfied.",
    );
    setFlowStep("post-chat-options");
  }, [pushMessage, simulateTyping]);

  const handleShowMentorTopics = useCallback(async () => {
    if (selectedConversation && selectedConversation.status !== "CLOSED") {
      pushMessage("user", "Talk to a Mentor");
      simulateTyping("Resuming your conversation...");
      setFlowStep("mentor-chat");
      return;
    }
    pushMessage("user", "Talk to a Mentor");
    const cats = await getExpertCategories();
    cats.length > 0
      ? (simulateTyping("Which topic?"), setFlowStep("mentor-topics"))
      : (simulateTyping("No categories available."),
        setFlowStep("mentor-options"));
  }, [pushMessage, simulateTyping, getExpertCategories, selectedConversation]);

  // AUTO-SELECT: When category is selected, auto-pick first mentor
  const handleMentorCategorySelect = useCallback(
    async (cat: ExpertCategory) => {
      pushMessage("user", cat.name);
      setSelectedExpertCategory(cat);
      setIsTyping(true);
      const experts = cat.category_generated_id
        ? await getExpertsByCategoryId(cat.category_generated_id)
        : await getExpertsByCategory(cat.name);
      setIsTyping(false);

      if (experts.length > 0) {
        // Auto-select first expert
        const firstExpert = experts[0];
        setAutoSelectedExpert(firstExpert);

        // Show connecting message
        pushMessage(
          "bot",
          `Connecting you with **${firstExpert.name}**, your mentor for **${cat.name}**...`,
        );

        // Auto-create conversation
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
          setFlowStep("mentor-chat");
        } else {
          pushMessage("bot", "Couldn't start conversation — try again.");
        }
      } else {
        pushMessage(
          "bot",
          `No mentors available for **${cat.name}**. Try another.`,
        );
        setFlowStep("mentor-topics");
      }
    },
    [
      savedContact,
      mentorForm,
      pushMessage,
      createConversation,
      getExpertsByCategory,
      getExpertsByCategoryId,
    ],
  );

  const handleSubmitQuery = useCallback((e?: FormEvent) => {
    e?.preventDefault();
    setQuerySubmitTrigger((n) => n + 1);
  }, []);
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
      if (!chatbotQuestion.question?.trim()) return;
      askQuestion();
    },
    [chatbotQuestion, askQuestion],
  );
  const handleMentorChatSend = useCallback(
    (e?: FormEvent) => {
      e?.preventDefault();
      if (
        !mentorMessage.message?.trim() ||
        !selectedConversation?.conversation_generated_id ||
        selectedConversation.status === "CLOSED"
      )
        return;
      sendMentorMessage();
    },
    [mentorMessage, selectedConversation, sendMentorMessage],
  );

  const headerTitle =
    flowStep === "faq-list"
      ? "CareBot"
      : flowStep === "faq-categories"
        ? (selectedFAQ?.faq_default_question ?? "Categories")
        : flowStep === "faq-questions"
          ? (selectedCategory?.topic_name ?? "Questions")
          : flowStep === "mentor-form"
            ? "Contact Support"
            : flowStep === "query-form"
              ? "Raise a Query"
              : flowStep === "live-chat"
                ? "Live Chat"
                : flowStep === "mentor-topics"
                  ? "Talk to a Mentor"
                  : flowStep === "post-chat-options"
                    ? "More Questions?"
                    : flowStep === "mentor-chat"
                      ? (autoSelectedExpert?.name ??
                        selectedConversation?.category_name ??
                        "Mentor Chat")
                      : "Next Steps";
  const displayContact = savedContact ?? mentorForm;

  const renderContent = () => {
    if (flowStep === "faq-list")
      return (
        <div className="cw-faqlist-wrap">
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
            <HelpCircle size={16} className="cw-help-btn-icon" />
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
          <button
            className="cw-option-btn cw-option-chat"
            onClick={handleChatWithBot}
            type="button"
          >
            <div className="cw-option-icon">
              <Bot size={20} />
            </div>
            <div className="cw-option-text">
              <span className="cw-option-label">Chat with Bot</span>
              <span className="cw-option-desc">
                Get instant answers from CareBot AI
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
        </div>
      );

    // POST-CHAT OPTIONS (after conversation ends)
    if (flowStep === "post-chat-options")
      return (
        <div className="cw-options-wrap">
          <div className="cw-section-title">What would you like to do?</div>
          <button
            className="cw-option-btn cw-option-chat"
            onClick={handleChatWithBot}
            type="button"
          >
            <div className="cw-option-icon">
              <Bot size={20} />
            </div>
            <div className="cw-option-text">
              <span className="cw-option-label">Chat with Bot</span>
              <span className="cw-option-desc">
                Get instant answers from CareBot AI
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
                Not satisfied? Log a ticket for our team
              </span>
            </div>
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
          <form className="cw-query-form" onSubmit={handleSubmitQuery}>
            <div className="cw-query-field">
              <label className="cw-query-label">
                <ClipboardList size={13} />
                Query title
              </label>
              <input
                className={`cw-query-input ${requestQueryErrors.query_title ? "has-error" : ""}`}
                name="query_title"
                placeholder="e.g. Unable to submit assignment"
                value={requestQuery.query_title}
                onChange={handleRequestQueryChange}
                disabled={requestQueryLoading}
                autoFocus
              />
              {requestQueryErrors.query_title && (
                <span className="cw-query-error">
                  {requestQueryErrors.query_title}
                </span>
              )}
            </div>
            <div className="cw-query-field">
              <label className="cw-query-label">
                <FileText size={13} />
                Describe the issue
              </label>
              <textarea
                className={`cw-query-textarea ${requestQueryErrors.query_description ? "has-error" : ""}`}
                name="query_description"
                placeholder="Tell us what happened..."
                value={requestQuery.query_description}
                onChange={handleRequestQueryChange}
                disabled={requestQueryLoading}
                rows={4}
              />
              {requestQueryErrors.query_description && (
                <span className="cw-query-error">
                  {requestQueryErrors.query_description}
                </span>
              )}
            </div>
            <button
              type="submit"
              className="cw-query-submit-btn"
              disabled={
                requestQueryLoading ||
                !requestQuery.query_title?.trim() ||
                !requestQuery.query_description?.trim()
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
              {expertCategories.map((cat, i) => (
                <button
                  key={cat.category_generated_id ?? i}
                  className="cw-category-card"
                  style={{ animationDelay: `${i * 0.06}s` }}
                  onClick={() => handleMentorCategorySelect(cat)}
                  type="button"
                >
                  <span className="cw-category-icon">
                    <Users size={18} />
                  </span>
                  <span className="cw-category-name">{cat.name}</span>
                </button>
              ))}
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
        <div className="cw-panel" role="dialog" aria-label="CareBot Chatbot">
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
              <Sparkles size={18} />
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
                    : "Online"}
                </span>
              </div>
            </div>
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
                  <div className="cw-system-message cw-conversation-ended">
                    <Clock size={14} /> This conversation has ended
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
                    const isLastVisitorMsg =
                      iv &&
                      i ===
                        mentorMessages.filter(
                          (mm2, idx2, self2) =>
                            idx2 ===
                            self2.findIndex(
                              (m) =>
                                m.message_generated_id ===
                                mm2.message_generated_id,
                            ),
                        ).length -
                          1;
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
                                <Clock
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
                {conversationEnded && (
                  <div className="cw-post-chat-actions">
                    <p className="cw-post-chat-text">
                      Do you have any more questions?
                    </p>
                    <div className="cw-post-chat-buttons">
                      <button
                        className="cw-btn cw-btn--yes"
                        onClick={handleYesMoreQuestions}
                        type="button"
                      >
                        Yes
                      </button>
                      <button
                        className="cw-btn cw-btn--no"
                        onClick={handleNoMoreQuestions}
                        type="button"
                      >
                        No
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
            {renderContent()}
            {(isTyping ||
              (flowStep === "live-chat" && chatbotLoading) ||
              (flowStep === "mentor-topics" && expertsLoading)) && (
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
              <form className="cw-input-row" onSubmit={handleSend}>
                <input
                  className={`cw-input ${formError ? "has-error" : ""}`}
                  placeholder={
                    mentorFormStep === "name"
                      ? "Full name..."
                      : mentorFormStep === "mobile"
                        ? "Mobile number..."
                        : "Email address..."
                  }
                  value={draft}
                  onChange={(e) => {
                    setDraft(e.target.value);
                    if (formError) setFormError(null);
                  }}
                  type={
                    mentorFormStep === "email"
                      ? "email"
                      : mentorFormStep === "mobile"
                        ? "tel"
                        : "text"
                  }
                  disabled={isSavingContact}
                  autoFocus
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
              {chatbotErrors.question && (
                <div className="cw-form-error">{chatbotErrors.question}</div>
              )}
              <form className="cw-input-row" onSubmit={handleLiveChatSend}>
                <input
                  className={`cw-input ${chatbotErrors.question ? "has-error" : ""}`}
                  placeholder="Ask CareBot..."
                  value={chatbotQuestion.question ?? ""}
                  onChange={handleChatbotChange}
                  name="question"
                  autoFocus
                />
                <button
                  type="submit"
                  className="cw-send-btn"
                  disabled={!chatbotQuestion.question?.trim() || chatbotLoading}
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
          {showFooterInput && flowStep === "mentor-chat" && (
            <div className="cw-input-area">
              {mentorErrors.message && (
                <div className="cw-form-error">{mentorErrors.message}</div>
              )}
              <form className="cw-input-row" onSubmit={handleMentorChatSend}>
                <input
                  className={`cw-input ${mentorErrors.message ? "has-error" : ""}`}
                  placeholder={
                    selectedConversation?.status === "CLOSED"
                      ? "Conversation ended"
                      : "Type your message..."
                  }
                  value={mentorMessage.message ?? ""}
                  onChange={handleMentorMessageChange}
                  name="message"
                  disabled={selectedConversation?.status === "CLOSED"}
                  autoFocus
                />
                <button
                  type="submit"
                  className="cw-send-btn"
                  disabled={
                    !mentorMessage.message?.trim() ||
                    selectedConversation?.status === "CLOSED"
                  }
                >
                  <Send size={16} />
                </button>
              </form>
            </div>
          )}
          <div className="cw-footer-tag">
            Powered by CareBot · GoldCrest.Ai LMS
          </div>
        </div>
      )}
      {!isOpen && (
        <button
          className="cw-launcher"
          onClick={() => setIsOpen(true)}
          type="button"
        >
          <MessageCircle size={24} />
          <span className="cw-launcher-dot" />
        </button>
      )}
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
