/* eslint-disable react-hooks/immutability */
/* eslint-disable react-hooks/preserve-manual-memoization */
// /* eslint-disable react-hooks/preserve-manual-memoization */
// /* eslint-disable react-hooks/immutability */
// // // /* eslint-disable react-hooks/set-state-in-effect */
// // // /* eslint-disable @typescript-eslint/no-explicit-any */
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
//   Loader2,
//   Pencil,
//   ClipboardList,
//   Users,
//   MessageSquare,
//   Clock,
//   CheckCheck,
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

// interface ContactDetails {
//   name: string;
//   mobile: string;
//   email: string;
//   registered_employee_generated_id?: string;
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
//   const d = v.replace(/\D/g, "");
//   return d.length >= 7 && d.length <= 15;
// };
// const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

// const welcomeMessage = (): Message => ({
//   id: "greet-1",
//   sender: "bot",
//   text: "Hi there! I'm **CareBot**, your LMS Assistant. Pick a question below and I'll help you find the right answer.",
// });

// const CONTACT_STORAGE_KEY = "carebot_contact_details";

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
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
//   const hasSavedContact = useRef(false);
//   const [conversationEnded, setConversationEnded] = useState(false);

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

//   // Restore latest conversation (including CLOSED)
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
//       if (latestConversation.status === "CLOSED") {
//         setConversationEnded(true);
//       }
//       setFlowStep("mentor-chat");
//     }
//   }, [conversations]);

//   // Watch for conversation close
//   useEffect(() => {
//     if (
//       selectedConversation?.status === "CLOSED" &&
//       flowStep === "mentor-chat"
//     ) {
//       setConversationEnded(true);
//       pushMessage("bot", "This conversation has been ended by the mentor.");
//       simulateTyping("Do you have any more questions I can help with?");
//     }
//   }, [selectedConversation?.status]);

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
//       { source: "caredata-bot-widget", type: isOpen ? "OPEN" : "CLOSE" },
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
//       setIsTyping(true);
//       typingTimeoutRef.current = setTimeout(() => {
//         setIsTyping(false);
//         pushMessage("bot", text);
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
//       const ok = await addWebsiteUser();
//       if (c) return;
//       setIsSavingContact(false);
//       if (ok) {
//         setWaitingForEmployeeId(true);
//         setIsTyping(false);
//       } else {
//         setIsTyping(false);
//         pushMessage(
//           "bot",
//           "Hmm, I couldn't save your details just now. Please try again.",
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
//       const ok = await addRequestQuery();
//       if (c) return;
//       if (ok) {
//         pushMessage(
//           "bot",
//           `Your query has been registered!\n\nTicket: **TKT-${Date.now().toString(36).toUpperCase()}**`,
//         );
//         setFlowStep("faq-list");
//       } else
//         pushMessage("bot", "I couldn't submit your query — please try again.");
//     })();
//     return () => {
//       c = true;
//     };
//   }, [querySubmitTrigger]);

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
//     setAutoSelectedExpert(null);
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
//       setDraft("");
//       setFlowStep("mentor-form");
//     }, 550);
//   }, [pushMessage, savedContact, selectedConversation]);

//   const handleEditContact = useCallback(() => {
//     setSavedContact(null);
//     setWaitingForEmployeeId(false);
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
//   }, [pushMessage]);

//   const handleMentorFormSubmit = useCallback(() => {
//     const text = draft.trim();
//     if (!text) return;
//     if (mentorFormStep === "name") {
//       if (!isValidName(text)) {
//         setFormError("Enter your full name.");
//         return;
//       }
//       setFormError(null);
//       pushMessage("user", text);
//       setMentorForm((p) => ({ ...p, name: text }));
//       setMentorFormStep("mobile");
//       setDraft("");
//       simulateTyping(`Nice to meet you, **${text}**! Mobile number?`);
//       return;
//     }
//     if (mentorFormStep === "mobile") {
//       if (!isValidMobile(text)) {
//         setFormError("Enter valid mobile.");
//         return;
//       }
//       setFormError(null);
//       pushMessage("user", text);
//       setMentorForm((p) => ({ ...p, mobile: text }));
//       setMentorFormStep("email");
//       setDraft("");
//       simulateTyping("Email address?");
//       return;
//     }
//     if (!isValidEmail(text)) {
//       setFormError("Enter valid email.");
//       return;
//     }
//     setFormError(null);
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
//       `You're through to CareBot AI, **${c.name}**. Ask me anything.`,
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

//   // Handle "No" after conversation ends
//   const handleNoMoreQuestions = useCallback(() => {
//     pushMessage("user", "No, that's all");
//     simulateTyping(
//       "Thank you for chatting with us! If you need any help in the future, don't hesitate to reach out. Have a great day! 😊",
//     );
//     setTimeout(() => {
//       setFlowStep("faq-list");
//     }, 2000);
//   }, [pushMessage, simulateTyping]);

//   // Handle "Yes" after conversation ends - show options
//   const handleYesMoreQuestions = useCallback(() => {
//     pushMessage("user", "Yes, I have more questions");
//     simulateTyping(
//       "Sure! How would you like to proceed? You can chat with our AI bot or raise a query if you're not satisfied.",
//     );
//     setFlowStep("post-chat-options");
//   }, [pushMessage, simulateTyping]);

//   const handleShowMentorTopics = useCallback(async () => {
//     if (selectedConversation && selectedConversation.status !== "CLOSED") {
//       pushMessage("user", "Talk to a Mentor");
//       simulateTyping("Resuming your conversation...");
//       setFlowStep("mentor-chat");
//       return;
//     }
//     pushMessage("user", "Talk to a Mentor");
//     const cats = await getExpertCategories();
//     cats.length > 0
//       ? (simulateTyping("Which topic?"), setFlowStep("mentor-topics"))
//       : (simulateTyping("No categories available."),
//         setFlowStep("mentor-options"));
//   }, [pushMessage, simulateTyping, getExpertCategories, selectedConversation]);

//   // AUTO-SELECT: When category is selected, auto-pick first mentor
//   const handleMentorCategorySelect = useCallback(
//     async (cat: ExpertCategory) => {
//       pushMessage("user", cat.name);
//       setSelectedExpertCategory(cat);
//       setIsTyping(true);
//       const experts = cat.category_generated_id
//         ? await getExpertsByCategoryId(cat.category_generated_id)
//         : await getExpertsByCategory(cat.name);
//       setIsTyping(false);

//       if (experts.length > 0) {
//         // Auto-select first expert
//         const firstExpert = experts[0];
//         setAutoSelectedExpert(firstExpert);

//         // Show connecting message
//         pushMessage(
//           "bot",
//           `Connecting you with **${firstExpert.name}**, your mentor for **${cat.name}**...`,
//         );

//         // Auto-create conversation
//         const c = savedContact ?? mentorForm;
//         const success = await createConversation({
//           visitor_name: c.name,
//           visitor_email: c.email,
//           visitor_phone_number: c.mobile,
//           visitor_generated_id: c.registered_employee_generated_id ?? "",
//           category_generated_id: cat.category_generated_id ?? "",
//           category_name: cat.name ?? "",
//         });

//         if (success) {
//           pushMessage(
//             "bot",
//             `You're now talking to **${firstExpert.name}**. Say hello! 👋`,
//           );
//           setFlowStep("mentor-chat");
//         } else {
//           pushMessage("bot", "Couldn't start conversation — try again.");
//         }
//       } else {
//         pushMessage(
//           "bot",
//           `No mentors available for **${cat.name}**. Try another.`,
//         );
//         setFlowStep("mentor-topics");
//       }
//     },
//     [
//       savedContact,
//       mentorForm,
//       pushMessage,
//       createConversation,
//       getExpertsByCategory,
//       getExpertsByCategoryId,
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
//       if (
//         !mentorMessage.message?.trim() ||
//         !selectedConversation?.conversation_generated_id ||
//         selectedConversation.status === "CLOSED"
//       )
//         return;
//       sendMentorMessage();
//     },
//     [mentorMessage, selectedConversation, sendMentorMessage],
//   );

//   const headerTitle =
//     flowStep === "faq-list"
//       ? "CareBot"
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
//                 Get instant answers from CareBot AI
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

//     // POST-CHAT OPTIONS (after conversation ends)
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
//                 className={`cw-query-input ${requestQueryErrors.query_title ? "has-error" : ""}`}
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
//               <label className="cw-query-label">
//                 <FileText size={13} />
//                 Describe the issue
//               </label>
//               <textarea
//                 className={`cw-query-textarea ${requestQueryErrors.query_description ? "has-error" : ""}`}
//                 name="query_description"
//                 placeholder="Tell us what happened..."
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
//               {expertCategories.map((cat, i) => (
//                 <button
//                   key={cat.category_generated_id ?? i}
//                   className="cw-category-card"
//                   style={{ animationDelay: `${i * 0.06}s` }}
//                   onClick={() => handleMentorCategorySelect(cat)}
//                   type="button"
//                 >
//                   <span className="cw-category-icon">
//                     <Users size={18} />
//                   </span>
//                   <span className="cw-category-name">{cat.name}</span>
//                 </button>
//               ))}
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
//         <div className="cw-panel" role="dialog" aria-label="CareBot Chatbot">
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
//                   <div className="cw-system-message cw-conversation-ended">
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
//                     const isLastVisitorMsg =
//                       iv &&
//                       i ===
//                         mentorMessages.filter(
//                           (mm2, idx2, self2) =>
//                             idx2 ===
//                             self2.findIndex(
//                               (m) =>
//                                 m.message_generated_id ===
//                                 mm2.message_generated_id,
//                             ),
//                         ).length -
//                           1;
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
//                 {conversationEnded && (
//                   <div className="cw-post-chat-actions">
//                     <p className="cw-post-chat-text">
//                       Do you have any more questions?
//                     </p>
//                     <div className="cw-post-chat-buttons">
//                       <button
//                         className="cw-btn cw-btn--yes"
//                         onClick={handleYesMoreQuestions}
//                         type="button"
//                       >
//                         Yes
//                       </button>
//                       <button
//                         className="cw-btn cw-btn--no"
//                         onClick={handleNoMoreQuestions}
//                         type="button"
//                       >
//                         No
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
//               <form className="cw-input-row" onSubmit={handleSend}>
//                 <input
//                   className={`cw-input ${formError ? "has-error" : ""}`}
//                   placeholder={
//                     mentorFormStep === "name"
//                       ? "Full name..."
//                       : mentorFormStep === "mobile"
//                         ? "Mobile number..."
//                         : "Email address..."
//                   }
//                   value={draft}
//                   onChange={(e) => {
//                     setDraft(e.target.value);
//                     if (formError) setFormError(null);
//                   }}
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
//                   placeholder="Ask CareBot..."
//                   value={chatbotQuestion.question ?? ""}
//                   onChange={handleChatbotChange}
//                   name="question"
//                   autoFocus
//                 />
//                 <button
//                   type="submit"
//                   className="cw-send-btn"
//                   disabled={!chatbotQuestion.question?.trim() || chatbotLoading}
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
//                       ? "Conversation ended"
//                       : "Type your message..."
//                   }
//                   value={mentorMessage.message ?? ""}
//                   onChange={handleMentorMessageChange}
//                   name="message"
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
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable react-hooks/set-state-in-effect */
// /* eslint-disable @typescript-eslint/no-explicit-any */
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
  text: "Hi there! I'm **SupportBot**, your AI Assistant. Pick a question below and I'll help you.",
});

const CONTACT_STORAGE_KEY = "supportbot_contact_details";

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
      if (latestConversation.status === "CLOSED") setConversationEnded(true);
      setFlowStep("mentor-chat");
    }
  }, [conversations]);

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
      { source: "supportbot-widget", type: isOpen ? "OPEN" : "CLOSE" },
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
      `You're now chatting with SupportBot AI, **${c.name}**. Ask me anything.`,
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

  const handleNoMoreQuestions = useCallback(() => {
    pushMessage("user", "No, that's all");
    simulateTyping(
      "Thank you for chatting with us! If you need any help in the future, don't hesitate to reach out. Have a great day! 😊",
    );
    setTimeout(() => {
      setFlowStep("faq-list");
    }, 2000);
  }, [pushMessage, simulateTyping]);
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
      ? "SupportBot"
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
                Get instant answers from SupportBot AI
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
                Get instant answers from SupportBot AI
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
        <div className="cw-panel" role="dialog" aria-label="SupportBot">
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
                  <div className="cw-conversation-ended">
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
                  placeholder="Ask SupportBot..."
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
          <div className="cw-footer-tag">Powered by SupportBot</div>
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
