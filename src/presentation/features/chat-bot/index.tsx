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
// import type { Topic } from "@/src/application/topics/topic.types";
// import type { FAQ, FAQSubTopic } from "@/src/application/faq/faq.types";

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
//   | "live-chat";

// type MentorFormStep = "name" | "mobile" | "email";

// interface ContactDetails {
//   name: string;
//   mobile: string;
//   email: string;
// }

// // ------------------------------------------------------------------
// // FAQ node helpers
// // A "node" is either a top-level FAQ or a nested FAQSubTopic — both
// // carry faq_subtopics + faq_contents, so we treat them generically
// // while browsing the tree.
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

// // Adjust these two if your FAQContent field names differ
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

// // localStorage key used to remember a visitor's contact details
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

//   // CHANGE 1: Detect iframe and set initial open state accordingly
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

//   // The contact details we've actually confirmed — either freshly
//   // saved to the DB, or recalled from localStorage on a repeat visit.
//   const [savedContact, setSavedContact] = useState<ContactDetails | null>(null);
//   const [isSavingContact, setIsSavingContact] = useState(false);

//   // Bumping this triggers the "persist contact to DB" effect below
//   const [submitTrigger, setSubmitTrigger] = useState(0);
//   const pendingContactRef = useRef<ContactDetails | null>(null);

//   // Bumping this triggers the "submit request query" effect below
//   const [querySubmitTrigger, setQuerySubmitTrigger] = useState(0);

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
//   }, [messages, isTyping, flowStep, chatbotMessages]);

//   useEffect(() => {
//     return () => {
//       if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
//     };
//   }, []);

//   // CHANGE 2: Notify parent when opening/closing
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

//   // The current node being browsed: deepest subtopic on the path, or
//   // the selected top-level FAQ if we haven't drilled down yet.
//   const currentNode: FAQNode | null =
//     subtopicPath.length > 0
//       ? subtopicPath[subtopicPath.length - 1]
//       : selectedFAQ;

//   // Reset everything back to the very start
//   const handleStart = useCallback(() => {
//     if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
//     setIsTyping(false);
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
//     setMessages([welcomeMessage()]);
//   }, [resetChatbotForm, resetWebsiteUserForm, resetRequestQueryForm]);

//   // Contextual back button
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
//     pushMessage,
//     simulateTyping,
//     handleStart,
//     resetRequestQueryForm,
//   ]);

//   // ---- Topic selection ----
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

//   // "Not satisfied" -> either recall saved contact, or start the form
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

//   // ---- Let a returning visitor re-enter fresh details ----
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

//     // ---- final step: email ----
//     if (!isValidEmail(text)) {
//       setFormError("Please enter a valid email address.");
//       return;
//     }
//     setFormError(null);
//     pushMessage("user", text);

//     const finalForm: ContactDetails = { ...mentorForm, email: text };
//     setMentorForm(finalForm);
//     setDraft("");

//     // Push the collected values into WebsiteUserContext's form state.
//     // Field names follow the context: name, phone_number, email.
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
//     // Fires the persistence effect above once this render flushes
//     setSubmitTrigger((n) => n + 1);
//   }, [
//     draft,
//     mentorFormStep,
//     mentorForm,
//     pushMessage,
//     simulateTyping,
//     handleWebsiteUserChange,
//   ]);

//   // ---- "Chat with Bot" hands off to the real chatbot context ----
//   const handleChatWithBot = useCallback(() => {
//     const contact = savedContact ?? mentorForm;
//     pushMessage("user", "Chat with Bot");
//     simulateTyping(
//       `You're through to CareBot AI now, **${contact.name}**. Ask me anything and I'll do my best to help.`,
//     );
//     setFlowStep("live-chat");
//   }, [savedContact, mentorForm, pushMessage, simulateTyping]);

//   // ---- "Raise a Query" now opens the query-details form ----
//   const handleStartQueryForm = useCallback(() => {
//     const contact = savedContact ?? mentorForm;

//     // Pre-fill the request-query context's contact fields so
//     // addRequestQuery() has everything it needs on submit.
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
//                 : "Next Steps";

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

//     return null;
//   };

//   const showFooterInput =
//     flowStep === "mentor-form" || flowStep === "live-chat";

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
//                 <span className="cw-status-dot" />
//                 <span>Online</span>
//               </div>
//             </div>
//             {/* CHANGE 4: Close button - already correct, no changes needed */}
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

//             {/* Live chatbot conversation, sourced from ChatbotContext */}
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

//             {renderContent()}

//             {(isTyping || (flowStep === "live-chat" && chatbotLoading)) && (
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

//           {/* Footer input — mentor form or live chat */}
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

//           <div className="cw-footer-tag">
//             Powered by CareBot · GoldCrest.Ai LMS
//           </div>
//         </div>
//       )}

//       {/* CHANGE 3: Hide launcher when embedded in iframe */}
//       {!isEmbedded && (
//         <button
//           className="cw-launcher"
//           onClick={() => setIsOpen((v) => !v)}
//           aria-label={isOpen ? "Close chat" : "Open chat"}
//           type="button"
//         >
//           {isOpen ? (
//             <X size={24} />
//           ) : (
//             <>
//               <MessageCircle size={24} />
//               <span className="cw-launcher-dot" />
//             </>
//           )}
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
//               <ChatWidgetInner />
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
  ChevronRight,
  Loader2,
  Pencil,
  ClipboardList,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";
import "./style.css";

// ------------------------------------------------------------------
// Contexts — adjust these import paths to match your project structure
// ------------------------------------------------------------------
import { TopicProvider, useTopic } from "@/src/application/topics/TopicContext";
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
import type { Topic } from "@/src/application/topics/topic.types";
import type { FAQ, FAQSubTopic } from "@/src/application/faq/faq.types";

type Sender = "bot" | "user";

interface Message {
  id: string;
  sender: Sender;
  text: string;
}

type FlowStep =
  | "categories"
  | "faq-list"
  | "faq-node"
  | "mentor-form"
  | "mentor-options"
  | "query-form"
  | "live-chat";

type MentorFormStep = "name" | "mobile" | "email";

interface ContactDetails {
  name: string;
  mobile: string;
  email: string;
}

// ------------------------------------------------------------------
// FAQ node helpers
// A "node" is either a top-level FAQ or a nested FAQSubTopic — both
// carry faq_subtopics + faq_contents, so we treat them generically
// while browsing the tree.
// ------------------------------------------------------------------
type FAQNode = FAQ | FAQSubTopic;

function getNodeTitle(node: FAQNode): string {
  return (
    (node as FAQ).faq_default_question ??
    (node as FAQSubTopic).faq_subtopic_title ??
    "Untitled"
  );
}

function getNodeId(node: FAQNode): string {
  return (
    (node as unknown as Record<string, string>).faq_generated_id ??
    (node as unknown as Record<string, string>).faq_subtopic_generated_id ??
    ""
  );
}

function getNodeSubtopics(node: FAQNode): FAQSubTopic[] {
  return node.faq_subtopics ?? [];
}

function getNodeContents(node: FAQNode): Record<string, any>[] {
  return (node.faq_contents as unknown as Record<string, any>[]) ?? [];
}

// Adjust these two if your FAQContent field names differ
function getContentQuestion(content: Record<string, any>): string | undefined {
  return content.faq_content_question ?? content.question;
}
function getContentAnswer(content: Record<string, any>): string {
  return (
    content.faq_content_answer ??
    content.answer ??
    content.faq_content_text ??
    content.content ??
    ""
  );
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
  const digits = v.replace(/\D/g, "");
  return digits.length >= 7 && digits.length <= 15;
};
const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

const welcomeMessage = (): Message => ({
  id: "greet-1",
  sender: "bot",
  text: "Hi there! I'm **CareBot**, your LMS Assistant. Pick a topic below and I'll help you find the right answer.",
});

// localStorage key used to remember a visitor's contact details
const CONTACT_STORAGE_KEY = "carebot_contact_details";

// ------------------------------------------------------------------
// Main Chat Widget
// ------------------------------------------------------------------
function ChatWidgetInner() {
  // ---- real data sources ----
  const { topics, loading: topicsLoading } = useTopic();

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
  } = useWebsiteUser();

  const {
    requestQuery,
    errors: requestQueryErrors,
    loading: requestQueryLoading,
    handleChange: handleRequestQueryChange,
    addRequestQuery,
    resetForm: resetRequestQueryForm,
  } = useRequestQuery();

  // CHANGE 1: Detect iframe and set initial open state accordingly
  const isEmbedded =
    typeof window !== "undefined" && window.self !== window.top;

  const [isOpen, setIsOpen] = useState(isEmbedded);

  const [messages, setMessages] = useState<Message[]>([welcomeMessage()]);
  const [draft, setDraft] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [flowStep, setFlowStep] = useState<FlowStep>("categories");

  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [selectedFAQ, setSelectedFAQ] = useState<FAQ | null>(null);
  const [subtopicPath, setSubtopicPath] = useState<FAQSubTopic[]>([]);

  const [mentorForm, setMentorForm] = useState<ContactDetails>({
    name: "",
    mobile: "",
    email: "",
  });
  const [mentorFormStep, setMentorFormStep] = useState<MentorFormStep>("name");
  const [formError, setFormError] = useState<string | null>(null);

  // The contact details we've actually confirmed — either freshly
  // saved to the DB, or recalled from localStorage on a repeat visit.
  const [savedContact, setSavedContact] = useState<ContactDetails | null>(null);
  const [isSavingContact, setIsSavingContact] = useState(false);

  // Bumping this triggers the "persist contact to DB" effect below
  const [submitTrigger, setSubmitTrigger] = useState(0);
  const pendingContactRef = useRef<ContactDetails | null>(null);

  // Bumping this triggers the "submit request query" effect below
  const [querySubmitTrigger, setQuerySubmitTrigger] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ---- load any previously saved contact from localStorage ----
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(CONTACT_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<ContactDetails>;
        if (parsed?.name && parsed?.email && parsed?.mobile) {
          setSavedContact({
            name: parsed.name,
            mobile: parsed.mobile,
            email: parsed.email,
          });
        }
      }
    } catch (err) {
      console.error("Failed to read saved contact from local storage.", err);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, flowStep, chatbotMessages]);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, []);

  // CHANGE 2: Notify parent when opening/closing
  useEffect(() => {
    if (!isEmbedded) return;

    window.parent.postMessage(
      {
        source: "caredata-bot-widget",
        type: isOpen ? "OPEN" : "CLOSE",
      },
      "*",
    );
  }, [isOpen, isEmbedded]);

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

  // ---- persist confirmed contact -> DB (via context) + localStorage ----
  useEffect(() => {
    if (submitTrigger === 0) return;

    let cancelled = false;
    setIsSavingContact(true);

    (async () => {
      const success = await addWebsiteUser();
      if (cancelled) return;

      const contact = pendingContactRef.current;
      setIsSavingContact(false);

      if (success && contact) {
        setSavedContact(contact);

        try {
          window.localStorage.setItem(
            CONTACT_STORAGE_KEY,
            JSON.stringify(contact),
          );
        } catch (err) {
          console.error("Failed to persist contact to local storage.", err);
        }

        setIsTyping(false);
        pushMessage(
          "bot",
          `Thanks, **${contact.name}**! I've saved your details.\n\nHow would you like to proceed?`,
        );
        setFlowStep("mentor-options");
      } else {
        setIsTyping(false);
        pushMessage(
          "bot",
          "Hmm, I couldn't save your details just now. Please try entering your email again.",
        );
        setMentorFormStep("email");
        setDraft("");
        setFlowStep("mentor-form");
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitTrigger]);

  // ---- submit the request query -> DB (via context) ----
  useEffect(() => {
    if (querySubmitTrigger === 0) return;

    let cancelled = false;

    (async () => {
      const success = await addRequestQuery();
      if (cancelled) return;

      if (success) {
        const ticketRef = `TKT-${Date.now().toString(36).toUpperCase()}`;
        const contact = savedContact ?? mentorForm;
        pushMessage(
          "bot",
          `Your query has been registered!\n\nA support ticket has been created and you'll receive updates at **${contact.email}**.\n\nTicket Reference: **${ticketRef}**`,
        );
        setFlowStep("categories");
      } else {
        pushMessage(
          "bot",
          "I couldn't submit your query — please double-check the highlighted fields below and try again.",
        );
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [querySubmitTrigger]);

  // The current node being browsed: deepest subtopic on the path, or
  // the selected top-level FAQ if we haven't drilled down yet.
  const currentNode: FAQNode | null =
    subtopicPath.length > 0
      ? subtopicPath[subtopicPath.length - 1]
      : selectedFAQ;

  // Reset everything back to the very start
  const handleStart = useCallback(() => {
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    setIsTyping(false);
    setFlowStep("categories");
    setSelectedTopic(null);
    setSelectedFAQ(null);
    setSubtopicPath([]);
    setMentorForm({ name: "", mobile: "", email: "" });
    setMentorFormStep("name");
    setFormError(null);
    setDraft("");
    resetChatbotForm();
    resetWebsiteUserForm();
    resetRequestQueryForm();
    setMessages([welcomeMessage()]);
  }, [resetChatbotForm, resetWebsiteUserForm, resetRequestQueryForm]);

  // Contextual back button
  const handleBack = useCallback(() => {
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    setIsTyping(false);
    setFormError(null);

    if (flowStep === "faq-list") {
      setFlowStep("categories");
      setSelectedTopic(null);
      pushMessage("user", "Back to topics");
      simulateTyping("Sure — pick another topic below:");
    } else if (flowStep === "faq-node") {
      if (subtopicPath.length > 0) {
        setSubtopicPath((prev) => prev.slice(0, -1));
      } else {
        setSelectedFAQ(null);
        setFlowStep("faq-list");
        pushMessage("user", "Back to FAQs");
        simulateTyping("Here are more questions you can pick from:");
      }
    } else if (flowStep === "query-form") {
      resetRequestQueryForm();
      setFlowStep("mentor-options");
      pushMessage("user", "Back");
      simulateTyping("No problem — how would you like to proceed?");
    } else if (
      flowStep === "mentor-form" ||
      flowStep === "mentor-options" ||
      flowStep === "live-chat"
    ) {
      handleStart();
    }
  }, [
    flowStep,
    subtopicPath,
    pushMessage,
    simulateTyping,
    handleStart,
    resetRequestQueryForm,
  ]);

  // ---- Topic selection ----
  const handleTopicSelect = useCallback(
    (topic: Topic) => {
      setSelectedTopic(topic);
      setFlowStep("faq-list");
      pushMessage("user", topic.topic_name);
      simulateTyping(
        `Great choice! Here are some frequently asked questions related to **${topic.topic_name}**:`,
      );
    },
    [pushMessage, simulateTyping],
  );

  // ---- FAQ selection (top level) ----
  const handleFaqSelect = useCallback(
    (faq: FAQ) => {
      setSelectedFAQ(faq);
      setSubtopicPath([]);
      setFlowStep("faq-node");
      pushMessage("user", getNodeTitle(faq));

      const contents = getNodeContents(faq);
      const subtopics = getNodeSubtopics(faq);

      if (contents.length > 0) {
        const combined = contents
          .map((c) => getContentAnswer(c))
          .filter(Boolean)
          .join("\n\n");
        simulateTyping(combined || "Here's more detail on that topic below:");
      } else if (subtopics.length > 0) {
        simulateTyping("This has a few sub-topics — pick one to go deeper:");
      } else {
        simulateTyping(
          "I don't have a written answer for this one yet — you can contact our support team below.",
        );
      }
    },
    [pushMessage, simulateTyping],
  );

  // ---- Subtopic drill-down ----
  const handleSubtopicSelect = useCallback(
    (subtopic: FAQSubTopic) => {
      setSubtopicPath((prev) => [...prev, subtopic]);
      pushMessage("user", getNodeTitle(subtopic));

      const contents = getNodeContents(subtopic);
      const subtopics = getNodeSubtopics(subtopic);

      if (contents.length > 0) {
        const combined = contents
          .map((c) => getContentAnswer(c))
          .filter(Boolean)
          .join("\n\n");
        simulateTyping(combined || "Here's more detail on that topic below:");
      } else if (subtopics.length > 0) {
        simulateTyping("This has a few sub-topics — pick one to go deeper:");
      } else {
        simulateTyping(
          "I don't have a written answer for this one yet — you can contact our support team below.",
        );
      }
    },
    [pushMessage, simulateTyping],
  );

  // "Not satisfied" -> either recall saved contact, or start the form
  const handleShowSatisfaction = useCallback(() => {
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    pushMessage("user", "This didn't answer my question");

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
      pushMessage(
        "bot",
        "No worries — let's get you the right help. First, what's your **full name**?",
      );
      setMentorForm({ name: "", mobile: "", email: "" });
      setMentorFormStep("name");
      setFormError(null);
      setDraft("");
      setFlowStep("mentor-form");
    }, 550);
  }, [pushMessage, savedContact]);

  // ---- Let a returning visitor re-enter fresh details ----
  const handleEditContact = useCallback(() => {
    setSavedContact(null);
    try {
      window.localStorage.removeItem(CONTACT_STORAGE_KEY);
    } catch (err) {
      console.error("Failed to clear saved contact from local storage.", err);
    }

    pushMessage("user", "Update my details");
    setMentorForm({ name: "", mobile: "", email: "" });
    setMentorFormStep("name");
    setFormError(null);
    setDraft("");
    setIsTyping(true);
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      pushMessage("bot", "No problem! What's your **full name**?");
      setFlowStep("mentor-form");
    }, 550);
  }, [pushMessage]);

  const handleMentorFormSubmit = useCallback(() => {
    const text = draft.trim();
    if (!text) return;

    if (mentorFormStep === "name") {
      if (!isValidName(text)) {
        setFormError("Please enter your full name.");
        return;
      }
      setFormError(null);
      pushMessage("user", text);
      setMentorForm((prev) => ({ ...prev, name: text }));
      setMentorFormStep("mobile");
      setDraft("");
      simulateTyping(
        `Nice to meet you, **${text}**! What's the best **mobile number** to reach you?`,
      );
      return;
    }

    if (mentorFormStep === "mobile") {
      if (!isValidMobile(text)) {
        setFormError("Please enter a valid mobile number.");
        return;
      }
      setFormError(null);
      pushMessage("user", text);
      setMentorForm((prev) => ({ ...prev, mobile: text }));
      setMentorFormStep("email");
      setDraft("");
      simulateTyping("Great, one last thing — what's your **email address**?");
      return;
    }

    // ---- final step: email ----
    if (!isValidEmail(text)) {
      setFormError("Please enter a valid email address.");
      return;
    }
    setFormError(null);
    pushMessage("user", text);

    const finalForm: ContactDetails = { ...mentorForm, email: text };
    setMentorForm(finalForm);
    setDraft("");

    // Push the collected values into WebsiteUserContext's form state.
    // Field names follow the context: name, phone_number, email.
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
    // Fires the persistence effect above once this render flushes
    setSubmitTrigger((n) => n + 1);
  }, [
    draft,
    mentorFormStep,
    mentorForm,
    pushMessage,
    simulateTyping,
    handleWebsiteUserChange,
  ]);

  // ---- "Chat with Bot" hands off to the real chatbot context ----
  const handleChatWithBot = useCallback(() => {
    const contact = savedContact ?? mentorForm;
    pushMessage("user", "Chat with Bot");
    simulateTyping(
      `You're through to CareBot AI now, **${contact.name}**. Ask me anything and I'll do my best to help.`,
    );
    setFlowStep("live-chat");
  }, [savedContact, mentorForm, pushMessage, simulateTyping]);

  // ---- "Raise a Query" now opens the query-details form ----
  const handleStartQueryForm = useCallback(() => {
    const contact = savedContact ?? mentorForm;

    // Pre-fill the request-query context's contact fields so
    // addRequestQuery() has everything it needs on submit.
    handleRequestQueryChange({
      target: { name: "name", value: contact.name },
    } as ChangeEvent<HTMLInputElement>);
    handleRequestQueryChange({
      target: { name: "email", value: contact.email },
    } as ChangeEvent<HTMLInputElement>);
    handleRequestQueryChange({
      target: { name: "phone_number", value: contact.mobile },
    } as ChangeEvent<HTMLInputElement>);
    handleRequestQueryChange({
      target: { name: "query_title", value: "" },
    } as ChangeEvent<HTMLInputElement>);
    handleRequestQueryChange({
      target: { name: "query_description", value: "" },
    } as ChangeEvent<HTMLTextAreaElement>);

    pushMessage("user", "Raise a Query");
    simulateTyping(
      "Sure — give me a short title and a bit of detail about the issue, and I'll log it for our team.",
    );
    setFlowStep("query-form");
  }, [
    savedContact,
    mentorForm,
    pushMessage,
    simulateTyping,
    handleRequestQueryChange,
  ]);

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

  const headerTitle =
    flowStep === "categories"
      ? "CareBot"
      : flowStep === "faq-list"
        ? (selectedTopic?.topic_name ?? "FAQs")
        : flowStep === "faq-node"
          ? currentNode
            ? getNodeTitle(currentNode)
            : "FAQ"
          : flowStep === "mentor-form"
            ? "Contact Support"
            : flowStep === "query-form"
              ? "Raise a Query"
              : flowStep === "live-chat"
                ? "Live Chat"
                : "Next Steps";

  const displayContact = savedContact ?? mentorForm;

  const renderContent = () => {
    // ---- TOPICS (categories) ----
    if (flowStep === "categories") {
      return (
        <div className="cw-categories-wrap">
          <div className="cw-section-title">Choose a topic to get started</div>

          {topicsLoading && (
            <div className="cw-skeleton-list">
              {[0, 1, 2].map((i) => (
                <div key={i} className="cw-skeleton-card" />
              ))}
            </div>
          )}

          {!topicsLoading && topics.length === 0 && (
            <div className="cw-empty-state">No topics available right now.</div>
          )}

          {!topicsLoading && topics.length > 0 && (
            <div className="cw-categories-grid">
              {topics
                .filter((t) => t.isActiveTopic)
                .map((topic, i) => (
                  <button
                    key={topic.topic_generated_id ?? i}
                    className="cw-category-card"
                    style={{ animationDelay: `${i * 0.06}s` }}
                    onClick={() => handleTopicSelect(topic)}
                    type="button"
                  >
                    <span className="cw-category-icon">
                      <Folder size={18} />
                    </span>
                    <span className="cw-category-name">{topic.topic_name}</span>
                    {topic.topic_description && (
                      <span className="cw-category-count">Info</span>
                    )}
                  </button>
                ))}
            </div>
          )}
        </div>
      );
    }

    // ---- FAQ LIST (top level) ----
    if (flowStep === "faq-list") {
      return (
        <div className="cw-faqlist-wrap">
          <div className="cw-section-title">
            <span className="cw-section-icon">
              <Folder size={15} />
            </span>
            Frequently asked questions
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
                    key={getNodeId(faq) || i}
                    className="cw-faqlist-item"
                    style={{ animationDelay: `${i * 0.05}s` }}
                    onClick={() => handleFaqSelect(faq)}
                    type="button"
                  >
                    <FileText size={14} />
                    <span>{getNodeTitle(faq)}</span>
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
    }

    // ---- FAQ NODE (a top-level FAQ or a nested subtopic) ----
    if (flowStep === "faq-node" && currentNode) {
      const subtopics = getNodeSubtopics(currentNode);

      return (
        <div className="cw-answer-wrap">
          {subtopicPath.length > 0 && (
            <div className="cw-breadcrumb">
              <button
                className="cw-breadcrumb-item"
                onClick={() => setSubtopicPath([])}
                type="button"
              >
                {selectedFAQ ? getNodeTitle(selectedFAQ) : "FAQ"}
              </button>
              {subtopicPath.map((sub, i) => (
                <span key={getNodeId(sub) || i} className="cw-breadcrumb-item">
                  <ChevronRight size={12} />
                  {getNodeTitle(sub)}
                </span>
              ))}
            </div>
          )}

          {subtopics.length > 0 && (
            <div className="cw-faqlist-items cw-subtopics-list">
              {subtopics.map((sub, i) => (
                <button
                  key={getNodeId(sub) || i}
                  className="cw-faqlist-item"
                  style={{ animationDelay: `${i * 0.05}s` }}
                  onClick={() => handleSubtopicSelect(sub)}
                  type="button"
                >
                  <Folder size={14} />
                  <span>{getNodeTitle(sub)}</span>
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
              <span>Didn&apos;t answer your question?</span>
              <span className="cw-help-btn-sub">Contact our support team</span>
            </span>
          </button>
        </div>
      );
    }

    // ---- MENTOR / HANDOFF FORM PROGRESS ----
    if (flowStep === "mentor-form") {
      const currentIndex = MENTOR_STEPS.findIndex(
        (s) => s.key === mentorFormStep,
      );
      return (
        <div className="cw-progress-card">
          {MENTOR_STEPS.map((s, i) => (
            <div
              key={s.key}
              className={`cw-progress-step ${i < currentIndex ? "is-done" : ""} ${
                i === currentIndex ? "is-active" : ""
              }`}
            >
              <span className="cw-progress-dot">
                {i < currentIndex ? <Check size={12} /> : s.icon}
              </span>
              <span className="cw-progress-label">{s.label}</span>
              {i < MENTOR_STEPS.length - 1 && (
                <span className="cw-progress-line" />
              )}
            </div>
          ))}
          {isSavingContact && mentorFormStep === "email" && (
            <div className="cw-saving-indicator">
              <Loader2 size={12} className="cw-spin" />
              Saving your details...
            </div>
          )}
        </div>
      );
    }

    // ---- MENTOR OPTIONS ----
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
    }

    // ---- REQUEST QUERY FORM ----
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

          <form className="cw-query-form" onSubmit={handleSubmitQuery}>
            <div className="cw-query-field">
              <label className="cw-query-label" htmlFor="cw-query-title">
                <ClipboardList size={13} />
                Query title
              </label>
              <input
                id="cw-query-title"
                className={`cw-query-input ${
                  requestQueryErrors.query_title ? "has-error" : ""
                }`}
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
              <label className="cw-query-label" htmlFor="cw-query-description">
                <FileText size={13} />
                Describe the issue
              </label>
              <textarea
                id="cw-query-description"
                className={`cw-query-textarea ${
                  requestQueryErrors.query_description ? "has-error" : ""
                }`}
                name="query_description"
                placeholder="Tell us what happened, what you expected, and any error messages you saw..."
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
    }

    return null;
  };

  const showFooterInput =
    flowStep === "mentor-form" || flowStep === "live-chat";

  return (
    <div className="cw-root">
      {isOpen && (
        <div className="cw-panel" role="dialog" aria-label="CareBot Chatbot">
          {/* Header */}
          <div className="cw-header">
            {flowStep !== "categories" && (
              <button
                className="cw-header-back-btn"
                onClick={handleBack}
                aria-label="Go back"
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
                <span className="cw-status-dot" />
                <span>Online</span>
              </div>
            </div>
            {/* CHANGE 4: Close button - already correct, no changes needed */}
            <button
              className="cw-close-btn"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
              type="button"
            >
              <X size={16} />
            </button>
          </div>

          {/* Messages */}
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

            {/* Live chatbot conversation, sourced from ChatbotContext */}
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

            {renderContent()}

            {(isTyping || (flowStep === "live-chat" && chatbotLoading)) && (
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

          {/* Footer input — mentor form or live chat */}
          {showFooterInput && flowStep === "mentor-form" && (
            <div className="cw-input-area">
              {formError && <div className="cw-form-error">{formError}</div>}
              <form className="cw-input-row" onSubmit={handleSend}>
                <input
                  className={`cw-input ${formError ? "has-error" : ""}`}
                  placeholder={
                    mentorFormStep === "name"
                      ? "Enter your full name..."
                      : mentorFormStep === "mobile"
                        ? "Enter your mobile number..."
                        : "Enter your email address..."
                  }
                  value={draft}
                  onChange={(e) => {
                    setDraft(e.target.value);
                    if (formError) setFormError(null);
                  }}
                  aria-label="Type your response"
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
                  aria-label="Send message"
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
                  placeholder="Ask CareBot anything..."
                  value={chatbotQuestion.question ?? ""}
                  onChange={handleChatbotChange}
                  name="question"
                  aria-label="Type your question"
                  autoFocus
                />
                <button
                  type="submit"
                  className="cw-send-btn"
                  disabled={!chatbotQuestion.question?.trim() || chatbotLoading}
                  aria-label="Send message"
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

          <div className="cw-footer-tag">
            Powered by CareBot · GoldCrest.Ai LMS
          </div>
        </div>
      )}

      {/* CHANGE 3: Hide launcher when embedded in iframe */}
      {/* Launcher - show when closed, even in embedded mode */}
      {!isOpen && (
        <button
          className="cw-launcher"
          onClick={() => setIsOpen(true)}
          aria-label="Open chat"
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
    <TopicProvider>
      <FAQProvider>
        <ChatbotProvider>
          <WebsiteUserProvider>
            <RequestQueryProvider>
              <ChatWidgetInner />
            </RequestQueryProvider>
          </WebsiteUserProvider>
        </ChatbotProvider>
      </FAQProvider>
    </TopicProvider>
  );
}
