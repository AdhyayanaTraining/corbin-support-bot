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
  Globe,
  ChevronDown,
  Image as ImageIcon,
  ZoomIn,
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
  FAQAnswer,
  FAQAnswerContentBlock,
} from "@/src/application/faq/faq.types";
import type {
  User as ExpertUser,
  ExpertCategory,
} from "@/src/application/users/user.types";

type Sender = "bot" | "user";

// Updated Message interface to support answer blocks
interface FAQMessageBlock {
  type: "paragraph" | "image";
  text?: string;
  image_url?: string;
}

interface Message {
  id: string;
  sender: Sender;
  text: string;
  images?: string[];
  answerBlocks?: FAQMessageBlock[];
  isArticle?: boolean;
}

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

// ========== LANGUAGE SUPPORT ==========

const LANGUAGE_STORAGE_KEY = "nimobot_selected_language";

const LANGUAGES = [
  { code: "en", label: "English", native: "English" },
  { code: "hi", label: "Hindi", native: "हिन्दी" },
  { code: "te", label: "Telugu", native: "తెలుగు" },
  { code: "ta", label: "Tamil", native: "தமிழ்" },
  { code: "kn", label: "Kannada", native: "ಕನ್ನಡ" },
];

type SupportedLanguage = "en" | "hi" | "te" | "ta" | "kn";

interface Translations {
  welcomeMessage: string;
  chooseLanguage: string;
  selectYourLanguage: string;
  choosePreferredLanguage: string;
  changeLanguageLabel: string;
  closeChat: string;
  pickQuestion: string;
  categories: string;
  noCategoriesYet: string;
  hereAreCategories: string;
  questions: string;
  noQuestionsYet: string;
  hereAreQuestions: string;
  noAnswerYet: string;
  cantFindAnswer: string;
  talkToSupportTeam: string;
  needMoreHelp: string;
  back: string;
  hereAreFAQAgain: string;
  hereAreCategoriesAgain: string;
  howToProceed: string;
  whichCategory: string;
  contactSupport: string;
  name: string;
  mobile: string;
  email: string;
  fullNamePlaceholder: string;
  mobilePlaceholder: string;
  emailPlaceholder: string;
  niceToMeet: (name: string) => string;
  mobileNumber: string;
  emailAddress: string;
  saving: string;
  saveError: string;
  saveErrorRetry: string;
  thanksSaved: (name: string) => string;
  invalidName: string;
  invalidMobile: string;
  invalidEmail: string;
  howCanWeHelp: string;
  welcomeBack: (name: string) => string;
  notYou: string;
  chatWithBot: string;
  chatWithBotDesc: string;
  talkToMentor: string;
  talkToMentorDesc: string;
  raiseQuery: string;
  raiseQueryDesc: string;
  endChat: string;
  endChatDesc: string;
  youAreNowChatting: (name: string) => string;
  pickTopic: string;
  noMentorCategories: string;
  couldntLoadTopics: string;
  connecting: string;
  connectingYouWith: (expert: string, category: string) => string;
  nowTalkingTo: (expert: string) => string;
  couldntStartConversation: (expert: string) => string;
  noMentorsAvailable: (category: string) => string;
  connectionError: string;
  resumeConversation: string;
  resumeConversationDesc: (name: string) => string;
  startNewTopic: string;
  startNewTopicDesc: string;
  youHaveActiveConversation: string;
  aboutTopic: (topic: string) => string;
  tapToResume: string;
  resumingConversation: string;
  activeConversationPrompt: string;
  raiseAQuery: string;
  whichCategoryQuery: string;
  gotItTitleDetails: string;
  giveMeTitleDetails: string;
  notSureSkip: string;
  noProblemTitleDetails: string;
  skipCategory: string;
  queryTitle: string;
  describeIssue: string;
  queryTitlePlaceholder: string;
  describeIssuePlaceholder: string;
  submitQuery: string;
  submitting: string;
  queryRegistered: string;
  querySubmitError: string;
  querySubmitErrorRetry: string;
  selectCategoryError: string;
  queryTitleError: string;
  queryDescriptionError: string;
  change: string;
  mentorChat: string;
  conversationEnded: string;
  wasHelpful: string;
  allGoodThanks: string;
  wonderfulThanks: string;
  thanksForChatting: string;
  backToHome: string;
  exitChat: string;
  endChatConfirm: string;
  haveGreatDay: string;
  typeMessage: string;
  conversationEndedPlaceholder: string;
  mentorConnected: string;
  closed: string;
  waiting: string;
  nimoBotOnline: string;
  switch_: string;
  sureHowToProceed: string;
  askNimoBot: string;
  iNeedMoreHelp: string;
  raiseQueryEnd: string;
  poweredBy: string;
  unknown: string;
  resumeChatting: string;
  continueChatting: (name: string) => string;
  differentTopic: string;
  talkDifferentMentor: string;
  ongoingConversation: string;
}

const translations: Record<SupportedLanguage, Translations> = {
  en: {
    welcomeMessage:
      "Hi there! I'm **Nimo Bot**, your AI Assistant. Pick a question below and I'll help you.",
    chooseLanguage: "Choose Language",
    selectYourLanguage: "Select Your Language",
    choosePreferredLanguage: "Choose your preferred language to continue",
    pickQuestion: "Pick a question to get started",
    categories: "Categories",
    noCategoriesYet: "No categories yet.",
    hereAreCategories: "Here are the categories:",
    questions: "Questions",
    noQuestionsYet: "No questions yet.",
    hereAreQuestions: "Here are the questions:",
    noAnswerYet: "No answer yet — contact support below.",
    cantFindAnswer: "Can't find your answer?",
    talkToSupportTeam: "Talk to our support team",
    needMoreHelp: "Need more help?",
    back: "Back",
    hereAreFAQAgain: "Here are the FAQ questions again:",
    hereAreCategoriesAgain: "Here are the categories again:",
    howToProceed: "How would you like to proceed?",
    whichCategory: "Which category is this about?",
    contactSupport: "Contact Support",
    name: "Name",
    mobile: "Mobile",
    email: "Email",
    fullNamePlaceholder: "Full name...",
    mobilePlaceholder: "Mobile number...",
    emailPlaceholder: "Email address...",
    niceToMeet: (name: string) =>
      `Nice to meet you, **${name}**! Mobile number?`,
    mobileNumber: "Mobile number?",
    emailAddress: "Email address?",
    saving: "Saving...",
    saveError: "Hmm, I couldn't save your details just now. Please try again.",
    saveErrorRetry:
      "Something went wrong saving your details. Please try again.",
    thanksSaved: (name: string) =>
      `Thanks, **${name}**! I've saved your details.\n\nHow would you like to proceed?`,
    invalidName: "Please enter your full name (minimum 3 characters).",
    invalidMobile: "Please enter a valid mobile number.",
    invalidEmail: "Please enter a valid email address.",
    howCanWeHelp: "How can we help?",
    welcomeBack: (name: string) =>
      `Welcome back, **${name}**! How would you like to proceed?`,
    notYou: "Not you? Update details",
    chatWithBot: "Chat with Nimo Bot",
    chatWithBotDesc: "Get instant answers from Nimo Bot AI",
    talkToMentor: "Talk to a Mentor",
    talkToMentorDesc: "Get connected live with a topic expert",
    raiseQuery: "Raise a Query",
    raiseQueryDesc: "Log a ticket for our team to track",
    endChat: "End Chat",
    endChatDesc: "Close this conversation for now",
    youAreNowChatting: (name: string) =>
      `You're now chatting with Nimo Bot AI, **${name}**. Ask me anything.`,
    pickTopic: "Pick a topic for your mentor",
    noMentorCategories: "No mentor categories available right now.",
    couldntLoadTopics: "Couldn't load mentor topics — please try again.",
    connecting: "Connecting...",
    connectingYouWith: (expert: string, category: string) =>
      `Connecting you with **${expert}**, your mentor for **${category}**...`,
    nowTalkingTo: (expert: string) =>
      `You're now talking to **${expert}**. Say hello! 👋`,
    couldntStartConversation: (expert: string) =>
      `Couldn't start the conversation with **${expert}** — please try again.`,
    noMentorsAvailable: (category: string) =>
      `No mentors available for **${category}**. Try another.`,
    connectionError:
      "Something went wrong connecting you to a mentor. Please try again.",
    resumeConversation: "Resume Conversation",
    resumeConversationDesc: (name: string) => `Continue chatting with ${name}`,
    startNewTopic: "Start a New Topic",
    startNewTopicDesc: "Talk to a different mentor about something else",
    youHaveActiveConversation: "You have an ongoing conversation",
    aboutTopic: (topic: string) => `About ${topic} — tap to resume`,
    tapToResume: "Tap to resume",
    resumingConversation: "Resuming your conversation...",
    activeConversationPrompt:
      "You already have an ongoing conversation. Would you like to resume it or start a new topic?",
    raiseAQuery: "Raise a Query",
    whichCategoryQuery: "Which category best describes your query?",
    gotItTitleDetails: "Got it. Now give me a title and details.",
    giveMeTitleDetails: "Give me a title and details.",
    notSureSkip: "Not sure — skip category",
    noProblemTitleDetails: "No problem. Give me a title and details.",
    skipCategory: "Skip — I'm not sure which category",
    queryTitle: "Query title",
    describeIssue: "Describe the issue",
    queryTitlePlaceholder: "e.g. Unable to submit assignment",
    describeIssuePlaceholder: "Tell us what happened...",
    submitQuery: "Submit Query",
    submitting: "Submitting...",
    queryRegistered: "Your query has been registered!",
    querySubmitError: "I couldn't submit your query — please try again.",
    querySubmitErrorRetry:
      "Something went wrong submitting your query. Please try again.",
    selectCategoryError: "Please select a category for your query.",
    queryTitleError: "Please enter a query title (minimum 5 characters).",
    queryDescriptionError:
      "Please describe your issue in at least 10 characters.",
    change: "Change",
    mentorChat: "Mentor Chat",
    conversationEnded: "This conversation has been ended by the mentor.",
    wasHelpful:
      "Was this conversation helpful? Let us know, or raise a query if something's still unresolved.",
    allGoodThanks: "All Good, Thanks",
    wonderfulThanks:
      "Wonderful! Thank you for chatting with Nimo Bot today — it was a pleasure helping you. 🎉",
    thanksForChatting: "Thanks for chatting with Nimo Bot today!",
    backToHome: "Back to Home",
    exitChat: "Exit Chat",
    endChatConfirm: "End Chat",
    haveGreatDay:
      "Thanks for chatting with Nimo Bot today! Have a great day. 👋",
    typeMessage: "Type your message...",
    conversationEndedPlaceholder: "Conversation ended",
    mentorConnected: "Mentor connected",
    closed: "Closed",
    waiting: "Waiting",
    nimoBotOnline: "Nimo Bot Online",
    switch_: "Switch",
    sureHowToProceed: "Sure — how would you like to proceed?",
    askNimoBot: "Ask Nimo Bot...",
    iNeedMoreHelp: "I need more help",
    raiseQueryEnd: "Raise a Query",
    poweredBy: "Powered by Nimo Bot",
    unknown: "Unknown",
    resumeChatting: "Resume Chatting",
    continueChatting: (name: string) => `Continue chatting with ${name}`,
    differentTopic: "Different Topic",
    talkDifferentMentor: "Talk to a different mentor about something else",
    ongoingConversation: "You have an ongoing conversation",
    changeLanguageLabel: "Change Language",
    closeChat: "Close chat",
  },
  hi: {
    welcomeMessage:
      "नमस्ते! मैं **Nimo Bot** हूं, आपका AI सहायक। नीचे एक प्रश्न चुनें और मैं आपकी मदद करूंगा।",
    chooseLanguage: "भाषा चुनें",
    selectYourLanguage: "अपनी भाषा चुनें",
    choosePreferredLanguage: "जारी रखने के लिए अपनी पसंदीदा भाषा चुनें",
    pickQuestion: "शुरू करने के लिए एक प्रश्न चुनें",
    categories: "श्रेणियाँ",
    noCategoriesYet: "अभी तक कोई श्रेणी नहीं है।",
    hereAreCategories: "ये रही श्रेणियाँ:",
    questions: "प्रश्न",
    noQuestionsYet: "अभी तक कोई प्रश्न नहीं है।",
    hereAreQuestions: "ये रहे प्रश्न:",
    noAnswerYet: "अभी तक कोई उत्तर नहीं — नीचे सहायता से संपर्क करें।",
    cantFindAnswer: "अपना उत्तर नहीं ढूंढ पा रहे?",
    talkToSupportTeam: "हमारी सहायता टीम से बात करें",
    needMoreHelp: "और मदद चाहिए?",
    back: "वापस",
    hereAreFAQAgain: "ये रहे फिर से FAQ प्रश्न:",
    hereAreCategoriesAgain: "ये रही फिर से श्रेणियाँ:",
    howToProceed: "आप कैसे आगे बढ़ना चाहेंगे?",
    whichCategory: "यह किस श्रेणी के बारे में है?",
    contactSupport: "सहायता से संपर्क करें",
    name: "नाम",
    mobile: "मोबाइल",
    email: "ईमेल",
    fullNamePlaceholder: "पूरा नाम...",
    mobilePlaceholder: "मोबाइल नंबर...",
    emailPlaceholder: "ईमेल पता...",
    niceToMeet: (name: string) =>
      `आपसे मिलकर अच्छा लगा, **${name}**! मोबाइल नंबर?`,
    mobileNumber: "मोबाइल नंबर?",
    emailAddress: "ईमेल पता?",
    saving: "सहेज रहा है...",
    saveError:
      "हम्म, मैं अभी आपका विवरण सहेज नहीं पाया। कृपया पुनः प्रयास करें।",
    saveErrorRetry:
      "आपका विवरण सहेजने में कुछ गलत हुआ। कृपया पुनः प्रयास करें।",
    thanksSaved: (name: string) =>
      `धन्यवाद, **${name}**! मैंने आपका विवरण सहेज लिया है।\n\nआप कैसे आगे बढ़ना चाहेंगे?`,
    invalidName: "कृपया अपना पूरा नाम दर्ज करें (न्यूनतम 3 अक्षर)।",
    invalidMobile: "कृपया एक वैध मोबाइल नंबर दर्ज करें।",
    invalidEmail: "कृपया एक वैध ईमेल पता दर्ज करें।",
    howCanWeHelp: "हम आपकी कैसे मदद कर सकते हैं?",
    welcomeBack: (name: string) =>
      `वापसी पर स्वागत है, **${name}**! आप कैसे आगे बढ़ना चाहेंगे?`,
    notYou: "आप नहीं हैं? विवरण अपडेट करें",
    chatWithBot: "Nimo Bot से चैट करें",
    chatWithBotDesc: "Nimo Bot AI से तुरंत उत्तर प्राप्त करें",
    talkToMentor: "मेंटर से बात करें",
    talkToMentorDesc: "किसी विषय विशेषज्ञ से लाइव जुड़ें",
    raiseQuery: "प्रश्न उठाएं",
    raiseQueryDesc: "हमारी टीम के लिए टिकट दर्ज करें",
    endChat: "चैट समाप्त करें",
    endChatDesc: "अभी के लिए यह बातचीत बंद करें",
    youAreNowChatting: (name: string) =>
      `अब आप Nimo Bot AI से चैट कर रहे हैं, **${name}**। कुछ भी पूछें।`,
    pickTopic: "अपने मेंटर के लिए विषय चुनें",
    noMentorCategories: "अभी कोई मेंटर श्रेणी उपलब्ध नहीं है।",
    couldntLoadTopics: "मेंटर विषय लोड नहीं हो सके — कृपया पुनः प्रयास करें।",
    connecting: "जोड़ रहा है...",
    connectingYouWith: (expert: string, category: string) =>
      `आपको **${expert}** से जोड़ रहा है, **${category}** के लिए आपके मेंटर...`,
    nowTalkingTo: (expert: string) =>
      `अब आप **${expert}** से बात कर रहे हैं। नमस्ते कहें! 👋`,
    couldntStartConversation: (expert: string) =>
      `**${expert}** के साथ बातचीत शुरू नहीं हो सकी — कृपया पुनः प्रयास करें।`,
    noMentorsAvailable: (category: string) =>
      `**${category}** के लिए कोई मेंटर उपलब्ध नहीं है। दूसरा प्रयास करें।`,
    connectionError:
      "आपको मेंटर से जोड़ने में कुछ गलत हुआ। कृपया पुनः प्रयास करें।",
    resumeConversation: "बातचीत फिर से शुरू करें",
    resumeConversationDesc: (name: string) => `${name} के साथ चैट जारी रखें`,
    startNewTopic: "नया विषय शुरू करें",
    startNewTopicDesc: "किसी और चीज़ के बारे में दूसरे मेंटर से बात करें",
    youHaveActiveConversation: "आपकी एक चल रही बातचीत है",
    aboutTopic: (topic: string) =>
      `${topic} के बारे में — फिर से शुरू करने के लिए टैप करें`,
    tapToResume: "फिर से शुरू करने के लिए टैप करें",
    resumingConversation: "आपकी बातचीत फिर से शुरू हो रही है...",
    activeConversationPrompt:
      "आपकी पहले से एक चल रही बातचीत है। क्या आप इसे फिर से शुरू करना चाहेंगे या नया विषय शुरू करना चाहेंगे?",
    raiseAQuery: "प्रश्न उठाएं",
    whichCategoryQuery: "आपका प्रश्न किस श्रेणी में सबसे अच्छा बैठता है?",
    gotItTitleDetails: "समझ गया। अब मुझे शीर्षक और विवरण दें।",
    giveMeTitleDetails: "मुझे शीर्षक और विवरण दें।",
    notSureSkip: "निश्चित नहीं — श्रेणी छोड़ें",
    noProblemTitleDetails: "कोई बात नहीं। मुझे शीर्षक और विवरण दें।",
    skipCategory: "छोड़ें — मुझे नहीं पता कौन सी श्रेणी",
    queryTitle: "प्रश्न शीर्षक",
    describeIssue: "समस्या का वर्णन करें",
    queryTitlePlaceholder: "जैसे असाइनमेंट जमा करने में असमर्थ",
    describeIssuePlaceholder: "हमें बताएं क्या हुआ...",
    submitQuery: "प्रश्न जमा करें",
    submitting: "जमा हो रहा है...",
    queryRegistered: "आपका प्रश्न पंजीकृत हो गया है!",
    querySubmitError:
      "मैं आपका प्रश्न जमा नहीं कर सका — कृपया पुनः प्रयास करें।",
    querySubmitErrorRetry:
      "आपका प्रश्न जमा करने में कुछ गलत हुआ। कृपया पुनः प्रयास करें।",
    selectCategoryError: "कृपया अपने प्रश्न के लिए एक श्रेणी चुनें।",
    queryTitleError: "कृपया प्रश्न शीर्षक दर्ज करें (न्यूनतम 5 अक्षर)।",
    queryDescriptionError:
      "कृपया अपनी समस्या का वर्णन कम से कम 10 अक्षरों में करें।",
    change: "बदलें",
    mentorChat: "मेंटर चैट",
    conversationEnded: "यह बातचीत मेंटर द्वारा समाप्त कर दी गई है।",
    wasHelpful:
      "क्या यह बातचीत सहायक थी? हमें बताएं, या अगर कुछ अभी भी अनसुलझा है तो प्रश्न उठाएं।",
    allGoodThanks: "सब ठीक, धन्यवाद",
    wonderfulThanks:
      "बहुत अच्छे! आज Nimo Bot से चैट करने के लिए धन्यवाद — आपकी मदद करके खुशी हुई। 🎉",
    thanksForChatting: "आज Nimo Bot से चैट करने के लिए धन्यवाद!",
    backToHome: "होम पर वापस जाएं",
    exitChat: "चैट से बाहर निकलें",
    endChatConfirm: "चैट समाप्त करें",
    haveGreatDay: "आज Nimo Bot से चैट करने के लिए धन्यवाद! आपका दिन शुभ हो। 👋",
    typeMessage: "अपना संदेश टाइप करें...",
    conversationEndedPlaceholder: "बातचीत समाप्त",
    mentorConnected: "मेंटर जुड़ा",
    closed: "बंद",
    waiting: "प्रतीक्षा में",
    nimoBotOnline: "Nimo Bot ऑनलाइन",
    switch_: "बदलें",
    sureHowToProceed: "ज़रूर — आप कैसे आगे बढ़ना चाहेंगे?",
    askNimoBot: "Nimo Bot से पूछें...",
    iNeedMoreHelp: "मुझे और मदद चाहिए",
    raiseQueryEnd: "प्रश्न उठाएं",
    poweredBy: "Nimo Bot द्वारा संचालित",
    unknown: "अज्ञात",
    resumeChatting: "चैटिंग फिर से शुरू करें",
    continueChatting: (name: string) => `${name} के साथ चैट जारी रखें`,
    differentTopic: "अलग विषय",
    talkDifferentMentor: "किसी और चीज़ के बारे में दूसरे मेंटर से बात करें",
    ongoingConversation: "आपकी एक चल रही बातचीत है",
    changeLanguageLabel: "भाषा बदलें",
    closeChat: "चैट बंद करें",
  },
  te: {
    welcomeMessage:
      "హాయ్! నేను **Nimo Bot**ని, మీ AI సహాయకుడిని. కింద ఒక ప్రశ్న ఎంచుకోండి మరియు నేను మీకు సహాయం చేస్తాను.",
    chooseLanguage: "భాష ఎంచుకోండి",
    selectYourLanguage: "మీ భాషను ఎంచుకోండి",
    choosePreferredLanguage: "కొనసాగించడానికి మీకు నచ్చిన భాషను ఎంచుకోండి",
    pickQuestion: "ప్రారంభించడానికి ఒక ప్రశ్న ఎంచుకోండి",
    categories: "వర్గాలు",
    noCategoriesYet: "ఇంకా వర్గాలు లేవు.",
    hereAreCategories: "ఇవిగో వర్గాలు:",
    questions: "ప్రశ్నలు",
    noQuestionsYet: "ఇంకా ప్రశ్నలు లేవు.",
    hereAreQuestions: "ఇవిగో ప్రశ్నలు:",
    noAnswerYet: "ఇంకా సమాధానం లేదు — కింద సహాయాన్ని సంప్రదించండి.",
    cantFindAnswer: "మీ సమాధానం కనుగొనలేకపోతున్నారా?",
    talkToSupportTeam: "మా సహాయక బృందంతో మాట్లాడండి",
    needMoreHelp: "మరింత సహాయం కావాలా?",
    back: "వెనుకకు",
    hereAreFAQAgain: "మళ్ళీ FAQ ప్రశ్నలు ఇవిగో:",
    hereAreCategoriesAgain: "మళ్ళీ వర్గాలు ఇవిగో:",
    howToProceed: "మీరు ఎలా కొనసాగాలనుకుంటున్నారు?",
    whichCategory: "ఇది ఏ వర్గం గురించి?",
    contactSupport: "సహాయాన్ని సంప్రదించండి",
    name: "పేరు",
    mobile: "మొబైల్",
    email: "ఇమెయిల్",
    fullNamePlaceholder: "పూర్తి పేరు...",
    mobilePlaceholder: "మొబైల్ నంబర్...",
    emailPlaceholder: "ఇమెయిల్ చిరునామా...",
    niceToMeet: (name: string) =>
      `మిమ్మల్ని కలిసినందుకు సంతోషం, **${name}**! మొబైల్ నంబర్?`,
    mobileNumber: "మొబైల్ నంబర్?",
    emailAddress: "ఇమెయిల్ చిరునామా?",
    saving: "సేవ్ చేస్తోంది...",
    saveError:
      "హ్మ్, నేను ఇప్పుడే మీ వివరాలను సేవ్ చేయలేకపోయాను. దయచేసి మళ్ళీ ప్రయత్నించండి.",
    saveErrorRetry:
      "మీ వివరాలను సేవ్ చేయడంలో ఏదో తప్పు జరిగింది. దయచేసి మళ్ళీ ప్రయత్నించండి.",
    thanksSaved: (name: string) =>
      `ధన్యవాదాలు, **${name}**! నేను మీ వివరాలను సేవ్ చేశాను.\n\nమీరు ఎలా కొనసాగాలనుకుంటున్నారు?`,
    invalidName: "దయచేసి మీ పూర్తి పేరు నమోదు చేయండి (కనీసం 3 అక్షరాలు).",
    invalidMobile: "దయచేసి చెల్లుబాటు అయ్యే మొబైల్ నంబర్ నమోదు చేయండి.",
    invalidEmail: "దయచేసి చెల్లుబాటు అయ్యే ఇమెయిల్ చిరునామా నమోదు చేయండి.",
    howCanWeHelp: "మేము ఎలా సహాయపడగలం?",
    welcomeBack: (name: string) =>
      `తిరిగి స్వాగతం, **${name}**! మీరు ఎలా కొనసాగాలనుకుంటున్నారు?`,
    notYou: "మీరు కాదా? వివరాలను నవీకరించండి",
    chatWithBot: "Nimo Bot తో చాట్ చేయండి",
    chatWithBotDesc: "Nimo Bot AI నుండి తక్షణ సమాధానాలు పొందండి",
    talkToMentor: "మెంటర్ తో మాట్లాడండి",
    talkToMentorDesc: "ఒక విషయ నిపుణుడితో లైవ్ గా కనెక్ట్ అవ్వండి",
    raiseQuery: "ప్రశ్నను నమోదు చేయండి",
    raiseQueryDesc: "మా బృందం ట్రాక్ చేయడానికి ఒక టికెట్ నమోదు చేయండి",
    endChat: "చాట్ ముగించండి",
    endChatDesc: "ప్రస్తుతానికి ఈ సంభాషణను మూసివేయండి",
    youAreNowChatting: (name: string) =>
      `మీరు ఇప్పుడు Nimo Bot AI తో చాట్ చేస్తున్నారు, **${name}**. ఏదైనా అడగండి.`,
    pickTopic: "మీ మెంటర్ కోసం ఒక విషయాన్ని ఎంచుకోండి",
    noMentorCategories: "ప్రస్తుతం మెంటర్ వర్గాలు అందుబాటులో లేవు.",
    couldntLoadTopics:
      "మెంటర్ విషయాలను లోడ్ చేయలేకపోయాము — దయచేసి మళ్ళీ ప్రయత్నించండి.",
    connecting: "కనెక్ట్ చేస్తోంది...",
    connectingYouWith: (expert: string, category: string) =>
      `మిమ్మల్ని **${expert}** తో కనెక్ట్ చేస్తోంది, **${category}** కోసం మీ మెంటర్...`,
    nowTalkingTo: (expert: string) =>
      `మీరు ఇప్పుడు **${expert}** తో మాట్లాడుతున్నారు. హలో చెప్పండి! 👋`,
    couldntStartConversation: (expert: string) =>
      `**${expert}** తో సంభాషణ ప్రారంభించలేకపోయాము — దయచేసి మళ్ళీ ప్రయత్నించండి.`,
    noMentorsAvailable: (category: string) =>
      `**${category}** కోసం మెంటర్లు అందుబాటులో లేరు. మరొకటి ప్రయత్నించండి.`,
    connectionError:
      "మిమ్మల్ని మెంటర్ తో కనెక్ట్ చేయడంలో ఏదో తప్పు జరిగింది. దయచేసి మళ్ళీ ప్రయత్నించండి.",
    resumeConversation: "సంభాషణను తిరిగి ప్రారంభించండి",
    resumeConversationDesc: (name: string) => `${name} తో చాటింగ్ కొనసాగించండి`,
    startNewTopic: "కొత్త విషయం ప్రారంభించండి",
    startNewTopicDesc: "వేరే దాని గురించి వేరే మెంటర్ తో మాట్లాడండి",
    youHaveActiveConversation: "మీకు ఒక కొనసాగుతున్న సంభాషణ ఉంది",
    aboutTopic: (topic: string) =>
      `${topic} గురించి — తిరిగి ప్రారంభించడానికి టాప్ చేయండి`,
    tapToResume: "తిరిగి ప్రారంభించడానికి టాప్ చేయండి",
    resumingConversation: "మీ సంభాషణ తిరిగి ప్రారంభమవుతోంది...",
    activeConversationPrompt:
      "మీకు ఇప్పటికే ఒక కొనసాగుతున్న సంభాషణ ఉంది. మీరు దాన్ని తిరిగి ప్రారంభించాలనుకుంటున్నారా లేదా కొత్త విషయం ప్రారంభించాలనుకుంటున్నారా?",
    raiseAQuery: "ప్రశ్నను నమోదు చేయండి",
    whichCategoryQuery: "మీ ప్రశ్న ఏ వర్గానికి చెందుతుంది?",
    gotItTitleDetails: "అర్థమైంది. ఇప్పుడు నాకు శీర్షిక మరియు వివరాలు ఇవ్వండి.",
    giveMeTitleDetails: "నాకు శీర్షిక మరియు వివరాలు ఇవ్వండి.",
    notSureSkip: "ఖచ్చితంగా తెలియదు — వర్గాన్ని దాటవేయండి",
    noProblemTitleDetails: "సమస్య లేదు. నాకు శీర్షిక మరియు వివరాలు ఇవ్వండి.",
    skipCategory: "దాటవేయండి — నాకు ఏ వర్గమో తెలియదు",
    queryTitle: "ప్రశ్న శీర్షిక",
    describeIssue: "సమస్యను వివరించండి",
    queryTitlePlaceholder: "ఉదా. అసైన్ మెంట్ సమర్పించలేకపోతున్నాను",
    describeIssuePlaceholder: "ఏమి జరిగిందో మాకు చెప్పండి...",
    submitQuery: "ప్రశ్నను సమర్పించండి",
    submitting: "సమర్పిస్తోంది...",
    queryRegistered: "మీ ప్రశ్న నమోదు చేయబడింది!",
    querySubmitError:
      "నేను మీ ప్రశ్నను సమర్పించలేకపోయాను — దయచేసి మళ్ళీ ప్రయత్నించండి.",
    querySubmitErrorRetry:
      "మీ ప్రశ్నను సమర్పించడంలో ఏదో తప్పు జరిగింది. దయచేసి మళ్ళీ ప్రయత్నించండి.",
    selectCategoryError: "దయచేసి మీ ప్రశ్న కోసం ఒక వర్గాన్ని ఎంచుకోండి.",
    queryTitleError: "దయచేసి ప్రశ్న శీర్షిక నమోదు చేయండి (కనీసం 5 అక్షరాలు).",
    queryDescriptionError: "దయచేసి మీ సమస్యను కనీసం 10 అక్షరాలలో వివరించండి.",
    change: "మార్చండి",
    mentorChat: "మెంటర్ చాట్",
    conversationEnded: "ఈ సంభాషణ మెంటర్ ద్వారా ముగించబడింది.",
    wasHelpful:
      "ఈ సంభాషణ సహాయకరంగా ఉందా? మాకు తెలియజేయండి, లేదా ఇంకా ఏదైనా పరిష్కరించబడకపోతే ప్రశ్నను నమోదు చేయండి.",
    allGoodThanks: "అంతా బాగుంది, ధన్యవాదాలు",
    wonderfulThanks:
      "అద్భుతం! ఈరోజు Nimo Bot తో చాట్ చేసినందుకు ధన్యవాదాలు — మీకు సహాయం చేయడం ఆనందంగా ఉంది. 🎉",
    thanksForChatting: "ఈరోజు Nimo Bot తో చాట్ చేసినందుకు ధన్యవాదాలు!",
    backToHome: "హోమ్ కు తిరిగి వెళ్ళండి",
    exitChat: "చాట్ నుండి నిష్క్రమించండి",
    endChatConfirm: "చాట్ ముగించండి",
    haveGreatDay:
      "ఈరోజు Nimo Bot తో చాట్ చేసినందుకు ధన్యవాదాలు! మీకు మంచి రోజు. 👋",
    typeMessage: "మీ సందేశాన్ని టైప్ చేయండి...",
    conversationEndedPlaceholder: "సంభాషణ ముగిసింది",
    mentorConnected: "మెంటర్ కనెక్ట్ అయ్యారు",
    closed: "మూసివేయబడింది",
    waiting: "వేచి ఉంది",
    nimoBotOnline: "Nimo Bot ఆన్ లైన్",
    switch_: "మార్చండి",
    sureHowToProceed: "తప్పకుండా — మీరు ఎలా కొనసాగాలనుకుంటున్నారు?",
    askNimoBot: "Nimo Bot ని అడగండి...",
    iNeedMoreHelp: "నాకు మరింత సహాయం కావాలి",
    raiseQueryEnd: "ప్రశ్నను నమోదు చేయండి",
    poweredBy: "Nimo Bot ద్వారా నడుపబడుతోంది",
    unknown: "తెలియని",
    resumeChatting: "చాటింగ్ తిరిగి ప్రారంభించండి",
    continueChatting: (name: string) => `${name} తో చాటింగ్ కొనసాగించండి`,
    differentTopic: "వేరే విషయం",
    talkDifferentMentor: "వేరే దాని గురించి వేరే మెంటర్ తో మాట్లాడండి",
    ongoingConversation: "మీకు ఒక కొనసాగుతున్న సంభాషణ ఉంది",
    changeLanguageLabel: "భాష మార్చండి",
    closeChat: "చాట్ మూసివేయండి",
  },
  ta: {
    welcomeMessage:
      "வணக்கம்! நான் **Nimo Bot**, உங்கள் AI உதவியாளர். கீழே ஒரு கேள்வியைத் தேர்ந்தெடுங்கள், நான் உங்களுக்கு உதவுகிறேன்.",
    chooseLanguage: "மொழியைத் தேர்ந்தெடுக்கவும்",
    selectYourLanguage: "உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்",
    choosePreferredLanguage:
      "தொடர உங்கள் விருப்பமான மொழியைத் தேர்ந்தெடுக்கவும்",
    pickQuestion: "தொடங்க ஒரு கேள்வியைத் தேர்ந்தெடுக்கவும்",
    categories: "வகைகள்",
    noCategoriesYet: "இன்னும் வகைகள் இல்லை.",
    hereAreCategories: "இதோ வகைகள்:",
    questions: "கேள்விகள்",
    noQuestionsYet: "இன்னும் கேள்விகள் இல்லை.",
    hereAreQuestions: "இதோ கேள்விகள்:",
    noAnswerYet: "இன்னும் பதில் இல்லை — கீழே ஆதரவைத் தொடர்பு கொள்ளவும்.",
    cantFindAnswer: "உங்கள் பதிலைக் கண்டுபிடிக்க முடியவில்லையா?",
    talkToSupportTeam: "எங்கள் ஆதரவு குழுவுடன் பேசுங்கள்",
    needMoreHelp: "மேலும் உதவி தேவையா?",
    back: "பின்",
    hereAreFAQAgain: "மீண்டும் FAQ கேள்விகள் இதோ:",
    hereAreCategoriesAgain: "மீண்டும் வகைகள் இதோ:",
    howToProceed: "நீங்கள் எவ்வாறு தொடர விரும்புகிறீர்கள்?",
    whichCategory: "இது எந்த வகையைப் பற்றியது?",
    contactSupport: "ஆதரவைத் தொடர்பு கொள்ளவும்",
    name: "பெயர்",
    mobile: "மொபைல்",
    email: "மின்னஞ்சல்",
    fullNamePlaceholder: "முழு பெயர்...",
    mobilePlaceholder: "மொபைல் எண்...",
    emailPlaceholder: "மின்னஞ்சல் முகவரி...",
    niceToMeet: (name: string) =>
      `உங்களைச் சந்தித்ததில் மகிழ்ச்சி, **${name}**! மொபைல் எண்?`,
    mobileNumber: "மொபைல் எண்?",
    emailAddress: "மின்னஞ்சல் முகவரி?",
    saving: "சேமிக்கிறது...",
    saveError:
      "ம்ம், என்னால் இப்போது உங்கள் விவரங்களைச் சேமிக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்.",
    saveErrorRetry:
      "உங்கள் விவரங்களைச் சேமிப்பதில் ஏதோ தவறு. மீண்டும் முயற்சிக்கவும்.",
    thanksSaved: (name: string) =>
      `நன்றி, **${name}**! உங்கள் விவரங்களைச் சேமித்துள்ளேன்.\n\nநீங்கள் எவ்வாறு தொடர விரும்புகிறீர்கள்?`,
    invalidName:
      "தயவுசெய்து உங்கள் முழு பெயரை உள்ளிடவும் (குறைந்தது 3 எழுத்துகள்).",
    invalidMobile: "தயவுசெய்து செல்லுபடியாகும் மொபைல் எண்ணை உள்ளிடவும்.",
    invalidEmail: "தயவுசெய்து செல்லுபடியாகும் மின்னஞ்சல் முகவரியை உள்ளிடவும்.",
    howCanWeHelp: "நாங்கள் எவ்வாறு உதவ முடியும்?",
    welcomeBack: (name: string) =>
      `மீண்டும் வரவேற்கிறோம், **${name}**! நீங்கள் எவ்வாறு தொடர விரும்புகிறீர்கள்?`,
    notYou: "நீங்கள் இல்லையா? விவரங்களைப் புதுப்பிக்கவும்",
    chatWithBot: "Nimo Bot உடன் அரட்டையடிக்கவும்",
    chatWithBotDesc: "Nimo Bot AI இலிருந்து உடனடி பதில்களைப் பெறுங்கள்",
    talkToMentor: "வழிகாட்டியுடன் பேசுங்கள்",
    talkToMentorDesc: "தலைப்பு நிபுணருடன் நேரடியாக இணைந்திருங்கள்",
    raiseQuery: "கேள்வியை எழுப்புங்கள்",
    raiseQueryDesc: "எங்கள் குழு கண்காணிக்க ஒரு டிக்கெட்டைப் பதிவு செய்யுங்கள்",
    endChat: "அரட்டையை முடிக்கவும்",
    endChatDesc: "இப்போதைக்கு இந்த உரையாடலை மூடவும்",
    youAreNowChatting: (name: string) =>
      `நீங்கள் இப்போது Nimo Bot AI உடன் அரட்டையடிக்கிறீர்கள், **${name}**. எதையும் கேளுங்கள்.`,
    pickTopic: "உங்கள் வழிகாட்டிக்கு ஒரு தலைப்பைத் தேர்ந்தெடுக்கவும்",
    noMentorCategories: "இப்போது வழிகாட்டி வகைகள் எதுவும் இல்லை.",
    couldntLoadTopics:
      "வழிகாட்டி தலைப்புகளை ஏற்ற முடியவில்லை — மீண்டும் முயற்சிக்கவும்.",
    connecting: "இணைக்கிறது...",
    connectingYouWith: (expert: string, category: string) =>
      `உங்களை **${expert}** உடன் இணைக்கிறது, **${category}** க்கான உங்கள் வழிகாட்டி...`,
    nowTalkingTo: (expert: string) =>
      `நீங்கள் இப்போது **${expert}** உடன் பேசுகிறீர்கள். வணக்கம் சொல்லுங்கள்! 👋`,
    couldntStartConversation: (expert: string) =>
      `**${expert}** உடன் உரையாடலைத் தொடங்க முடியவில்லை — மீண்டும் முயற்சிக்கவும்.`,
    noMentorsAvailable: (category: string) =>
      `**${category}** க்கு வழிகாட்டிகள் யாரும் இல்லை. மற்றொன்றை முயற்சிக்கவும்.`,
    connectionError:
      "உங்களை வழிகாட்டியுடன் இணைப்பதில் ஏதோ தவறு. மீண்டும் முயற்சிக்கவும்.",
    resumeConversation: "உரையாடலை மீண்டும் தொடங்கவும்",
    resumeConversationDesc: (name: string) =>
      `${name} உடன் அரட்டையைத் தொடரவும்`,
    startNewTopic: "புதிய தலைப்பைத் தொடங்கவும்",
    startNewTopicDesc: "வேறு ஏதாவது பற்றி வேறு வழிகாட்டியுடன் பேசுங்கள்",
    youHaveActiveConversation:
      "உங்களுக்கு ஒரு நடந்துகொண்டிருக்கும் உரையாடல் உள்ளது",
    aboutTopic: (topic: string) => `${topic} பற்றி — மீண்டும் தொடங்க தட்டவும்`,
    tapToResume: "மீண்டும் தொடங்க தட்டவும்",
    resumingConversation: "உங்கள் உரையாடல் மீண்டும் தொடங்குகிறது...",
    activeConversationPrompt:
      "உங்களுக்கு ஏற்கனவே ஒரு நடந்துகொண்டிருக்கும் உரையாடல் உள்ளது. அதை மீண்டும் தொடங்க விரும்புகிறீர்களா அல்லது புதிய தலைப்பைத் தொடங்க விரும்புகிறீர்களா?",
    raiseAQuery: "கேள்வியை எழுப்புங்கள்",
    whichCategoryQuery: "உங்கள் கேள்வி எந்த வகையைச் சேர்ந்தது?",
    gotItTitleDetails:
      "புரிந்தது. இப்போது எனக்கு தலைப்பு மற்றும் விவரங்களைக் கொடுங்கள்.",
    giveMeTitleDetails: "எனக்கு தலைப்பு மற்றும் விவரங்களைக் கொடுங்கள்.",
    notSureSkip: "உறுதியாகத் தெரியவில்லை — வகையைத் தவிர்க்கவும்",
    noProblemTitleDetails:
      "பரவாயில்லை. எனக்கு தலைப்பு மற்றும் விவரங்களைக் கொடுங்கள்.",
    skipCategory: "தவிர்க்கவும் — எனக்கு எந்த வகை என்று தெரியவில்லை",
    queryTitle: "கேள்வி தலைப்பு",
    describeIssue: "சிக்கலை விவரிக்கவும்",
    queryTitlePlaceholder: "எ.கா. பணியைச் சமர்ப்பிக்க முடியவில்லை",
    describeIssuePlaceholder: "என்ன நடந்தது என்பதை எங்களிடம் சொல்லுங்கள்...",
    submitQuery: "கேள்வியைச் சமர்ப்பிக்கவும்",
    submitting: "சமர்ப்பிக்கிறது...",
    queryRegistered: "உங்கள் கேள்வி பதிவு செய்யப்பட்டது!",
    querySubmitError:
      "என்னால் உங்கள் கேள்வியைச் சமர்ப்பிக்க முடியவில்லை — மீண்டும் முயற்சிக்கவும்.",
    querySubmitErrorRetry:
      "உங்கள் கேள்வியைச் சமர்ப்பிப்பதில் ஏதோ தவறு. மீண்டும் முயற்சிக்கவும்.",
    selectCategoryError:
      "தயவுசெய்து உங்கள் கேள்விக்கு ஒரு வகையைத் தேர்ந்தெடுக்கவும்.",
    queryTitleError:
      "தயவுசெய்து கேள்வி தலைப்பை உள்ளிடவும் (குறைந்தது 5 எழுத்துகள்).",
    queryDescriptionError:
      "தயவுசெய்து உங்கள் சிக்கலை குறைந்தது 10 எழுத்துகளில் விவரிக்கவும்.",
    change: "மாற்றவும்",
    mentorChat: "வழிகாட்டி அரட்டை",
    conversationEnded: "இந்த உரையாடல் வழிகாட்டியால் முடிக்கப்பட்டது.",
    wasHelpful:
      "இந்த உரையாடல் பயனுள்ளதாக இருந்ததா? எங்களுக்குத் தெரியப்படுத்துங்கள், அல்லது ஏதாவது இன்னும் தீர்க்கப்படவில்லை என்றால் கேள்வியை எழுப்புங்கள்.",
    allGoodThanks: "எல்லாம் நன்றாக உள்ளது, நன்றி",
    wonderfulThanks:
      "அற்புதம்! இன்று Nimo Bot உடன் அரட்டையடித்ததற்கு நன்றி — உங்களுக்கு உதவியதில் மகிழ்ச்சி. 🎉",
    thanksForChatting: "இன்று Nimo Bot உடன் அரட்டையடித்ததற்கு நன்றி!",
    backToHome: "முகப்புக்குத் திரும்பு",
    exitChat: "அரட்டையிலிருந்து வெளியேறு",
    endChatConfirm: "அரட்டையை முடிக்கவும்",
    haveGreatDay: "இன்று Nimo Bot உடன் அரட்டையடித்ததற்கு நன்றி! இனிய நாள். 👋",
    typeMessage: "உங்கள் செய்தியைத் தட்டச்சு செய்யவும்...",
    conversationEndedPlaceholder: "உரையாடல் முடிந்தது",
    mentorConnected: "வழிகாட்டி இணைக்கப்பட்டார்",
    closed: "மூடப்பட்டது",
    waiting: "காத்திருக்கிறது",
    nimoBotOnline: "Nimo Bot ஆன்லைன்",
    switch_: "மாற்று",
    sureHowToProceed: "நிச்சயமாக — நீங்கள் எவ்வாறு தொடர விரும்புகிறீர்கள்?",
    askNimoBot: "Nimo Bot ஐக் கேளுங்கள்...",
    iNeedMoreHelp: "எனக்கு மேலும் உதவி தேவை",
    raiseQueryEnd: "கேள்வியை எழுப்புங்கள்",
    poweredBy: "Nimo Bot மூலம் இயக்கப்படுகிறது",
    unknown: "தெரியவில்லை",
    resumeChatting: "அரட்டையை மீண்டும் தொடங்கவும்",
    continueChatting: (name: string) => `${name} உடன் அரட்டையைத் தொடரவும்`,
    differentTopic: "வேறு தலைப்பு",
    talkDifferentMentor: "வேறு ஏதாவது பற்றி வேறு வழிகாட்டியுடன் பேசுங்கள்",
    ongoingConversation: "உங்களுக்கு ஒரு நடந்துகொண்டிருக்கும் உரையாடல் உள்ளது",
    changeLanguageLabel: "மொழியை மாற்று",
    closeChat: "அரட்டையை மூடு",
  },
  kn: {
    welcomeMessage:
      "ಹಾಯ್! ನಾನು **Nimo Bot**, ನಿಮ್ಮ AI ಸಹಾಯಕ. ಕೆಳಗೆ ಒಂದು ಪ್ರಶ್ನೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ ಮತ್ತು ನಾನು ನಿಮಗೆ ಸಹಾಯ ಮಾಡುತ್ತೇನೆ.",
    chooseLanguage: "ಭಾಷೆ ಆಯ್ಕೆಮಾಡಿ",
    selectYourLanguage: "ನಿಮ್ಮ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    choosePreferredLanguage: "ಮುಂದುವರಿಯಲು ನಿಮ್ಮ ಆದ್ಯತೆಯ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    pickQuestion: "ಪ್ರಾರಂಭಿಸಲು ಒಂದು ಪ್ರಶ್ನೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    categories: "ವರ್ಗಗಳು",
    noCategoriesYet: "ಇನ್ನೂ ಯಾವುದೇ ವರ್ಗಗಳಿಲ್ಲ.",
    hereAreCategories: "ಇವು ವರ್ಗಗಳು:",
    questions: "ಪ್ರಶ್ನೆಗಳು",
    noQuestionsYet: "ಇನ್ನೂ ಯಾವುದೇ ಪ್ರಶ್ನೆಗಳಿಲ್ಲ.",
    hereAreQuestions: "ಇವು ಪ್ರಶ್ನೆಗಳು:",
    noAnswerYet: "ಇನ್ನೂ ಉತ್ತರವಿಲ್ಲ — ಕೆಳಗೆ ಬೆಂಬಲವನ್ನು ಸಂಪರ್ಕಿಸಿ.",
    cantFindAnswer: "ನಿಮ್ಮ ಉತ್ತರ ಸಿಗುತ್ತಿಲ್ಲವೇ?",
    talkToSupportTeam: "ನಮ್ಮ ಬೆಂಬಲ ತಂಡದೊಂದಿಗೆ ಮಾತನಾಡಿ",
    needMoreHelp: "ಇನ್ನಷ್ಟು ಸಹಾಯ ಬೇಕೇ?",
    back: "ಹಿಂದೆ",
    hereAreFAQAgain: "ಮತ್ತೆ FAQ ಪ್ರಶ್ನೆಗಳು ಇಲ್ಲಿವೆ:",
    hereAreCategoriesAgain: "ಮತ್ತೆ ವರ್ಗಗಳು ಇಲ್ಲಿವೆ:",
    howToProceed: "ನೀವು ಹೇಗೆ ಮುಂದುವರಿಯಲು ಬಯಸುತ್ತೀರಿ?",
    whichCategory: "ಇದು ಯಾವ ವರ್ಗದ ಬಗ್ಗೆ?",
    contactSupport: "ಬೆಂಬಲವನ್ನು ಸಂಪರ್ಕಿಸಿ",
    name: "ಹೆಸರು",
    mobile: "ಮೊಬೈಲ್",
    email: "ಇಮೇಲ್",
    fullNamePlaceholder: "ಪೂರ್ಣ ಹೆಸರು...",
    mobilePlaceholder: "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ...",
    emailPlaceholder: "ಇಮೇಲ್ ವಿಳಾಸ...",
    niceToMeet: (name: string) =>
      `ನಿಮ್ಮನ್ನು ಭೇಟಿಯಾಗಿ ಸಂತೋಷ, **${name}**! ಮೊಬೈಲ್ ಸಂಖ್ಯೆ?`,
    mobileNumber: "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ?",
    emailAddress: "ಇಮೇಲ್ ವಿಳಾಸ?",
    saving: "ಉಳಿಸಲಾಗುತ್ತಿದೆ...",
    saveError:
      "ಹ್ಮ್, ನಾನು ಈಗ ನಿಮ್ಮ ವಿವರಗಳನ್ನು ಉಳಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
    saveErrorRetry:
      "ನಿಮ್ಮ ವಿವರಗಳನ್ನು ಉಳಿಸುವಲ್ಲಿ ಏನೋ ತಪ್ಪಾಗಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
    thanksSaved: (name: string) =>
      `ಧನ್ಯವಾದಗಳು, **${name}**! ನಾನು ನಿಮ್ಮ ವಿವರಗಳನ್ನು ಉಳಿಸಿದ್ದೇನೆ.\n\nನೀವು ಹೇಗೆ ಮುಂದುವರಿಯಲು ಬಯಸುತ್ತೀರಿ?`,
    invalidName: "ದಯವಿಟ್ಟು ನಿಮ್ಮ ಪೂರ್ಣ ಹೆಸರನ್ನು ನಮೂದಿಸಿ (ಕನಿಷ್ಠ 3 ಅಕ್ಷರಗಳು).",
    invalidMobile: "ದಯವಿಟ್ಟು ಮಾನ್ಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ.",
    invalidEmail: "ದಯವಿಟ್ಟು ಮಾನ್ಯ ಇಮೇಲ್ ವಿಳಾಸವನ್ನು ನಮೂದಿಸಿ.",
    howCanWeHelp: "ನಾವು ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?",
    welcomeBack: (name: string) =>
      `ಮರಳಿ ಸ್ವಾಗತ, **${name}**! ನೀವು ಹೇಗೆ ಮುಂದುವರಿಯಲು ಬಯಸುತ್ತೀರಿ?`,
    notYou: "ನೀವಲ್ಲವೇ? ವಿವರಗಳನ್ನು ನವೀಕರಿಸಿ",
    chatWithBot: "Nimo Bot ಜೊತೆ ಚಾಟ್ ಮಾಡಿ",
    chatWithBotDesc: "Nimo Bot AI ನಿಂದ ತ್ವರಿತ ಉತ್ತರಗಳನ್ನು ಪಡೆಯಿರಿ",
    talkToMentor: "ಮಾರ್ಗದರ್ಶಕರೊಂದಿಗೆ ಮಾತನಾಡಿ",
    talkToMentorDesc: "ವಿಷಯ ತಜ್ಞರೊಂದಿಗೆ ಲೈವ್ ಆಗಿ ಸಂಪರ್ಕ ಹೊಂದಿರಿ",
    raiseQuery: "ಪ್ರಶ್ನೆಯನ್ನು ಸಲ್ಲಿಸಿ",
    raiseQueryDesc: "ನಮ್ಮ ತಂಡ ಟ್ರ್ಯಾಕ್ ಮಾಡಲು ಟಿಕೆಟ್ ದಾಖಲಿಸಿ",
    endChat: "ಚಾಟ್ ಕೊನೆಗೊಳಿಸಿ",
    endChatDesc: "ಸದ್ಯಕ್ಕೆ ಈ ಸಂಭಾಷಣೆಯನ್ನು ಮುಚ್ಚಿ",
    youAreNowChatting: (name: string) =>
      `ನೀವು ಈಗ Nimo Bot AI ಜೊತೆ ಚಾಟ್ ಮಾಡುತ್ತಿದ್ದೀರಿ, **${name}**. ಏನು ಬೇಕಾದರೂ ಕೇಳಿ.`,
    pickTopic: "ನಿಮ್ಮ ಮಾರ್ಗದರ್ಶಕರಿಗೆ ವಿಷಯವನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    noMentorCategories: "ಇದೀಗ ಯಾವುದೇ ಮಾರ್ಗದರ್ಶಕ ವರ್ಗಗಳು ಲಭ್ಯವಿಲ್ಲ.",
    couldntLoadTopics:
      "ಮಾರ್ಗದರ್ಶಕ ವಿಷಯಗಳನ್ನು ಲೋಡ್ ಮಾಡಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ — ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
    connecting: "ಸಂಪರ್ಕಿಸಲಾಗುತ್ತಿದೆ...",
    connectingYouWith: (expert: string, category: string) =>
      `ನಿಮ್ಮನ್ನು **${expert}** ಜೊತೆ ಸಂಪರ್ಕಿಸುತ್ತಿದೆ, **${category}** ಗೆ ನಿಮ್ಮ ಮಾರ್ಗದರ್ಶಕ...`,
    nowTalkingTo: (expert: string) =>
      `ನೀವು ಈಗ **${expert}** ಜೊತೆ ಮಾತನಾಡುತ್ತಿದ್ದೀರಿ. ಹಲೋ ಹೇಳಿ! 👋`,
    couldntStartConversation: (expert: string) =>
      `**${expert}** ಜೊತೆ ಸಂಭಾಷಣೆ ಪ್ರಾರಂಭಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ — ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.`,
    noMentorsAvailable: (category: string) =>
      `**${category}** ಗೆ ಯಾವುದೇ ಮಾರ್ಗದರ್ಶಕರು ಲಭ್ಯವಿಲ್ಲ. ಬೇರೆ ಪ್ರಯತ್ನಿಸಿ.`,
    connectionError:
      "ನಿಮ್ಮನ್ನು ಮಾರ್ಗದರ್ಶಕರೊಂದಿಗೆ ಸಂಪರ್ಕಿಸುವಲ್ಲಿ ಏನೋ ತಪ್ಪಾಗಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
    resumeConversation: "ಸಂಭಾಷಣೆಯನ್ನು ಪುನರಾರಂಭಿಸಿ",
    resumeConversationDesc: (name: string) => `${name} ಜೊತೆ ಚಾಟಿಂಗ್ ಮುಂದುವರಿಸಿ`,
    startNewTopic: "ಹೊಸ ವಿಷಯ ಪ್ರಾರಂಭಿಸಿ",
    startNewTopicDesc: "ಬೇರೆ ಯಾವುದೋ ಬಗ್ಗೆ ಬೇರೆ ಮಾರ್ಗದರ್ಶಕರೊಂದಿಗೆ ಮಾತನಾಡಿ",
    youHaveActiveConversation: "ನಿಮಗೆ ಒಂದು ನಡೆಯುತ್ತಿರುವ ಸಂಭಾಷಣೆ ಇದೆ",
    aboutTopic: (topic: string) => `${topic} ಬಗ್ಗೆ — ಪುನರಾರಂಭಿಸಲು ಟ್ಯಾಪ್ ಮಾಡಿ`,
    tapToResume: "ಪುನರಾರಂಭಿಸಲು ಟ್ಯಾಪ್ ಮಾಡಿ",
    resumingConversation: "ನಿಮ್ಮ ಸಂಭಾಷಣೆ ಪುನರಾರಂಭಗೊಳ್ಳುತ್ತಿದೆ...",
    activeConversationPrompt:
      "ನಿಮಗೆ ಈಗಾಗಲೇ ಒಂದು ನಡೆಯುತ್ತಿರುವ ಸಂಭಾಷಣೆ ಇದೆ. ನೀವು ಅದನ್ನು ಪುನರಾರಂಭಿಸಲು ಬಯಸುವಿರಾ ಅಥವಾ ಹೊಸ ವಿಷಯ ಪ್ರಾರಂಭಿಸಲು ಬಯಸುವಿರಾ?",
    raiseAQuery: "ಪ್ರಶ್ನೆಯನ್ನು ಸಲ್ಲಿಸಿ",
    whichCategoryQuery: "ನಿಮ್ಮ ಪ್ರಶ್ನೆ ಯಾವ ವರ್ಗಕ್ಕೆ ಸೇರುತ್ತದೆ?",
    gotItTitleDetails: "ಅರ್ಥವಾಯಿತು. ಈಗ ನನಗೆ ಶೀರ್ಷಿಕೆ ಮತ್ತು ವಿವರಗಳನ್ನು ನೀಡಿ.",
    giveMeTitleDetails: "ನನಗೆ ಶೀರ್ಷಿಕೆ ಮತ್ತು ವಿವರಗಳನ್ನು ನೀಡಿ.",
    notSureSkip: "ಖಚಿತವಿಲ್ಲ — ವರ್ಗವನ್ನು ಬಿಟ್ಟುಬಿಡಿ",
    noProblemTitleDetails: "ತೊಂದರೆ ಇಲ್ಲ. ನನಗೆ ಶೀರ್ಷಿಕೆ ಮತ್ತು ವಿವರಗಳನ್ನು ನೀಡಿ.",
    skipCategory: "ಬಿಟ್ಟುಬಿಡಿ — ನನಗೆ ಯಾವ ವರ್ಗ ಎಂದು ಗೊತ್ತಿಲ್ಲ",
    queryTitle: "ಪ್ರಶ್ನೆ ಶೀರ್ಷಿಕೆ",
    describeIssue: "ಸಮಸ್ಯೆಯನ್ನು ವಿವರಿಸಿ",
    queryTitlePlaceholder: "ಉದಾ. ನಿಯೋಜನೆಯನ್ನು ಸಲ್ಲಿಸಲು ಸಾಧ್ಯವಾಗುತ್ತಿಲ್ಲ",
    describeIssuePlaceholder: "ಏನಾಯಿತು ಎಂದು ನಮಗೆ ತಿಳಿಸಿ...",
    submitQuery: "ಪ್ರಶ್ನೆಯನ್ನು ಸಲ್ಲಿಸಿ",
    submitting: "ಸಲ್ಲಿಸಲಾಗುತ್ತಿದೆ...",
    queryRegistered: "ನಿಮ್ಮ ಪ್ರಶ್ನೆ ನೋಂದಾಯಿಸಲಾಗಿದೆ!",
    querySubmitError:
      "ನಾನು ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಸಲ್ಲಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ — ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
    querySubmitErrorRetry:
      "ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಸಲ್ಲಿಸುವಲ್ಲಿ ಏನೋ ತಪ್ಪಾಗಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
    selectCategoryError: "ದಯವಿಟ್ಟು ನಿಮ್ಮ ಪ್ರಶ್ನೆಗೆ ಒಂದು ವರ್ಗವನ್ನು ಆಯ್ಕೆಮಾಡಿ.",
    queryTitleError:
      "ದಯವಿಟ್ಟು ಪ್ರಶ್ನೆ ಶೀರ್ಷಿಕೆಯನ್ನು ನಮೂದಿಸಿ (ಕನಿಷ್ಠ 5 ಅಕ್ಷರಗಳು).",
    queryDescriptionError:
      "ದಯವಿಟ್ಟು ನಿಮ್ಮ ಸಮಸ್ಯೆಯನ್ನು ಕನಿಷ್ಠ 10 ಅಕ್ಷರಗಳಲ್ಲಿ ವಿವರಿಸಿ.",
    change: "ಬದಲಾಯಿಸಿ",
    mentorChat: "ಮಾರ್ಗದರ್ಶಕ ಚಾಟ್",
    conversationEnded: "ಈ ಸಂಭಾಷಣೆಯನ್ನು ಮಾರ್ಗದರ್ಶಕರು ಕೊನೆಗೊಳಿಸಿದ್ದಾರೆ.",
    wasHelpful:
      "ಈ ಸಂಭಾಷಣೆ ಸಹಾಯಕವಾಗಿತ್ತೇ? ನಮಗೆ ತಿಳಿಸಿ, ಅಥವಾ ಇನ್ನೂ ಏನಾದರೂ ಬಗೆಹರಿಯದಿದ್ದರೆ ಪ್ರಶ್ನೆಯನ್ನು ಸಲ್ಲಿಸಿ.",
    allGoodThanks: "ಎಲ್ಲಾ ಸರಿಯಾಗಿದೆ, ಧನ್ಯವಾದಗಳು",
    wonderfulThanks:
      "ಅದ್ಭುತ! ಇಂದು Nimo Bot ಜೊತೆ ಚಾಟ್ ಮಾಡಿದ್ದಕ್ಕೆ ಧನ್ಯವಾದಗಳು — ನಿಮಗೆ ಸಹಾಯ ಮಾಡಲು ಸಂತೋಷವಾಯಿತು. 🎉",
    thanksForChatting: "ಇಂದು Nimo Bot ಜೊತೆ ಚಾಟ್ ಮಾಡಿದ್ದಕ್ಕೆ ಧನ್ಯವಾದಗಳು!",
    backToHome: "ಮುಖಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ",
    exitChat: "ಚಾಟ್ ನಿಂದ ನಿರ್ಗಮಿಸಿ",
    endChatConfirm: "ಚಾಟ್ ಕೊನೆಗೊಳಿಸಿ",
    haveGreatDay: "ಇಂದು Nimo Bot ಜೊತೆ ಚಾಟ್ ಮಾಡಿದ್ದಕ್ಕೆ ಧನ್ಯವಾದಗಳು! ಶುಭ ದಿನ. 👋",
    typeMessage: "ನಿಮ್ಮ ಸಂದೇಶವನ್ನು ಟೈಪ್ ಮಾಡಿ...",
    conversationEndedPlaceholder: "ಸಂಭಾಷಣೆ ಕೊನೆಗೊಂಡಿದೆ",
    mentorConnected: "ಮಾರ್ಗದರ್ಶಕರು ಸಂಪರ್ಕಿತರಾಗಿದ್ದಾರೆ",
    closed: "ಮುಚ್ಚಲಾಗಿದೆ",
    waiting: "ಕಾಯುತ್ತಿದೆ",
    nimoBotOnline: "Nimo Bot ಆನ್‌ಲೈನ್",
    switch_: "ಬದಲಾಯಿಸಿ",
    sureHowToProceed: "ಖಂಡಿತ — ನೀವು ಹೇಗೆ ಮುಂದುವರಿಯಲು ಬಯಸುತ್ತೀರಿ?",
    askNimoBot: "Nimo Bot ಅನ್ನು ಕೇಳಿ...",
    iNeedMoreHelp: "ನನಗೆ ಇನ್ನಷ್ಟು ಸಹಾಯ ಬೇಕು",
    raiseQueryEnd: "ಪ್ರಶ್ನೆಯನ್ನು ಸಲ್ಲಿಸಿ",
    poweredBy: "Nimo Bot ಮೂಲಕ ಚಾಲಿತ",
    unknown: "ಅಜ್ಞಾತ",
    resumeChatting: "ಚಾಟಿಂಗ್ ಪುನರಾರಂಭಿಸಿ",
    continueChatting: (name: string) => `${name} ಜೊತೆ ಚಾಟಿಂಗ್ ಮುಂದುವರಿಸಿ`,
    differentTopic: "ಬೇರೆ ವಿಷಯ",
    talkDifferentMentor: "ಬೇರೆ ಯಾವುದೋ ಬಗ್ಗೆ ಬೇರೆ ಮಾರ್ಗದರ್ಶಕರೊಂದಿಗೆ ಮಾತನಾಡಿ",
    ongoingConversation: "ನಿಮಗೆ ಒಂದು ನಡೆಯುತ್ತಿರುವ ಸಂಭಾಷಣೆ ಇದೆ",
    changeLanguageLabel: "ಭಾಷೆ ಬದಲಾಯಿಸಿ",
    closeChat: "ಚಾಟ್ ಮುಚ್ಚಿ",
  },
};

// ========== Helper function to get localized text from LocalizedText ==========
const getLocalizedText = (value: any, language: string): string => {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value[language] ?? value.en ?? Object.values(value)[0] ?? "";
};

// ========== Helper function to get translation ==========
function getTranslation(
  lang: string | undefined,
  key: keyof Translations,
): string | ((...args: any[]) => string) {
  const t = translations[lang as SupportedLanguage] || translations.en;
  return t[key];
}

// ========== Helper to convert answer_description to FAQMessageBlock[] ==========
const convertAnswerToBlocks = (
  answer: any, // Use 'any' to bypass type checking temporarily
  language: string,
): FAQMessageBlock[] => {
  const blocks: FAQMessageBlock[] = [];

  if (answer.answer_description && Array.isArray(answer.answer_description)) {
    for (const block of answer.answer_description) {
      if (block.type === "paragraph") {
        // Handle both 'text' and 'content' field names
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

// ========== Helper to get the single most recent/authoritative answer ==========
// A question can carry multiple stored answer revisions. We only ever want to
// show ONE answer to the visitor (the latest one), never stack every revision
// as separate chat bubbles — that was the source of the "double answer" bug.
const getLatestAnswerBlocks = (
  question: FAQQuestion,
  language: string,
): FAQMessageBlock[] => {
  const answers = question.answers || [];
  if (answers.length === 0) return [];

  // Walk backwards and use the last answer entry that actually resolves to
  // non-empty content. This guarantees we show the most recently added
  // answer, and silently skip any trailing empty/placeholder revisions.
  for (let i = answers.length - 1; i >= 0; i--) {
    const blocks = convertAnswerToBlocks(answers[i], language);
    if (blocks.length > 0) return blocks;
  }
  return [];
};

// ========== Helper to get plain text from answer blocks ==========
const getPlainTextFromBlocks = (blocks: FAQMessageBlock[]): string => {
  return blocks
    .filter((block) => block.type === "paragraph")
    .map((block) => block.text || "")
    .join("\n\n");
};

// ========== Helper to reformat run-on numbered lists into real markdown lists ==========
// FAQ answers authored in the CMS sometimes store an entire numbered list as
// ONE paragraph string, e.g. "1. Core AWS Service Categories...2. The
// foundational services include:...3. AWS Lambda...". Rendered as plain text
// (or as a single markdown paragraph) this collapses into an unreadable
// run-on block. This helper detects that pattern (2+ "N. " markers in the
// same string) and rewrites it into a proper markdown ordered list — one
// list item per number — so ReactMarkdown + remark-gfm renders it as a real
// <ol>/<li> list. Text that doesn't contain multiple numbered markers is
// left completely untouched.
const formatParagraphText = (text: string): string => {
  if (!text) return "";

  const markerRegex = /(\d{1,2})\.\s+/g;
  const matches = [...text.matchAll(markerRegex)];

  // Need at least 2 numbered markers to treat this as a run-on list —
  // a single "1. " at the start of a normal sentence should stay as-is.
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

const sanitizeName = (value: string) => {
  return value.trim().replace(/\s+/g, " ");
};

const CONTACT_STORAGE_KEY = "nimobot_contact_details";
const FAQ_TOPIC_STORAGE_KEY = "nimobot_selected_faq_topic";
const LAUNCHER_SIZE = 84;

const MENTOR_STEPS: {
  key: MentorFormStep;
  labelKey: keyof Translations;
  icon: JSX.Element;
}[] = [
  { key: "name", labelKey: "name", icon: <User size={12} /> },
  { key: "mobile", labelKey: "mobile", icon: <Phone size={12} /> },
  { key: "email", labelKey: "email", icon: <Mail size={12} /> },
];

// ========== LauncherBotVideo ==========
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

// ========== NimoBotProfile ==========
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

// ========== LanguageDropdown ==========
function LanguageDropdown({
  currentLanguage,
  onSelect,
  ts,
}: {
  currentLanguage: string;
  onSelect: (code: string) => void;
  ts: (key: keyof Translations) => string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentLang = LANGUAGES.find((l) => l.code === currentLanguage);

  return (
    <div className="cw-language-dropdown" ref={dropdownRef}>
      <button
        className="cw-language-toggle"
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        aria-label={ts("changeLanguageLabel")}
        title={ts("changeLanguageLabel")}
      >
        <Globe size={14} />
        <span className="cw-language-toggle-label">
          {currentLang?.native || currentLang?.label || "EN"}
        </span>
        <ChevronDown size={10} />
      </button>
      {isOpen && (
        <div className="cw-language-dropdown-menu">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              className={`cw-language-dropdown-item ${lang.code === currentLanguage ? "is-active" : ""}`}
              onClick={() => {
                onSelect(lang.code);
                setIsOpen(false);
              }}
              type="button"
            >
              <span className="cw-language-dropdown-name">{lang.label}</span>
              <span className="cw-language-dropdown-native">{lang.native}</span>
              {lang.code === currentLanguage && (
                <Check size={14} className="cw-language-dropdown-check" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ========== IMAGE PREVIEW MODAL ==========
function ImagePreviewModal({
  imageUrl,
  onClose,
}: {
  imageUrl: string | null;
  onClose: () => void;
}) {
  // Close on Escape key for accessibility / a second reliable way out.
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

// ========== Message Renderer Component ==========
function MessageRenderer({
  message,
  onImageClick,
}: {
  message: Message;
  onImageClick: (url: string) => void;
}) {
  // If message has answerBlocks, render them as a clean, article-style read.
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
                  {formatParagraphText(block.text || "")}
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
                  <span className="cw-article-image-zoom">
                    <ZoomIn size={14} />
                  </span>
                </button>
              </figure>
            );
          }
          return null;
        })}
      </div>
    );
  }

  // Fallback: render as markdown with images
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

// ========== ChatWidgetInner ==========
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
    changeLanguage,
    selectedLanguage,
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
  const [isOpen, setIsOpen] = useState(false); // Start closed
  const [showLanguageSelector, setShowLanguageSelector] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
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

  // ====== Language initialization ======
  useEffect(() => {
    try {
      const savedLang = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (savedLang && LANGUAGES.some((l) => l.code === savedLang)) {
        changeLanguage(savedLang);
        setShowLanguageSelector(false);
        const msg = (
          translations[savedLang as SupportedLanguage] || translations.en
        ).welcomeMessage;
        setMessages([{ id: "greet-1", sender: "bot", text: msg }]);
      }
    } catch (err) {}
  }, []);

  const handleLanguageSelect = useCallback(
    (languageCode: string) => {
      changeLanguage(languageCode);
      setShowLanguageSelector(false);
      try {
        window.localStorage.setItem(LANGUAGE_STORAGE_KEY, languageCode);
      } catch (err) {}
      const msg =
        translations[languageCode as SupportedLanguage]?.welcomeMessage ||
        translations.en.welcomeMessage;
      setMessages([{ id: "greet-1", sender: "bot", text: msg }]);
    },
    [changeLanguage],
  );

  // ====== Contact storage ======
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

  // ====== Conversation management ======
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

  // ====== Conversation ended notification ======
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

  // ====== Scroll to bottom ======
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, flowStep, chatbotMessages, mentorMessages]);

  // ====== Cleanup ======
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, []);

  // ====== Embedded widget messaging ======
  useEffect(() => {
    if (!isEmbedded) return;
    window.parent.postMessage(
      { source: "nimobot-widget", type: isOpen ? "OPEN" : "CLOSE" },
      "*",
    );
  }, [isOpen, isEmbedded]);

  // ====== Join/leave chat room ======
  useEffect(() => {
    const cid = selectedConversation?.conversation_generated_id;
    if (flowStep !== "mentor-chat" || !cid) return;
    joinRoom(cid);
    getConversationMessages(cid);
    return () => {
      leaveRoom(cid);
    };
  }, [flowStep, selectedConversation?.conversation_generated_id]);

  // ====== Push message with support for answer blocks ======
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

  // ====== Simulate typing ======
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

  // ====== Contact form submission ======
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
          pushMessage("bot", ts("saveError"));
          setMentorFormStep("email");
          setDraft("");
          setFlowStep("mentor-form");
          hasSavedContact.current = false;
        }
      } catch (err) {
        if (c) return;
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
    const thanksMsg = (t("thanksSaved") as (name: string) => string)(
      contact.name,
    );
    pushMessage("bot", thanksMsg);
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
            `${ts("queryRegistered")}\n\nTicket: **TKT-${Date.now().toString(36).toUpperCase()}**`,
          );
          setSelectedQueryCategory(null);
          setFlowStep("mentor-options");
        } else pushMessage("bot", ts("querySubmitError"));
      } catch (err) {
        if (c) return;
        pushMessage("bot", ts("querySubmitErrorRetry"));
      }
    })();
    return () => {
      c = true;
    };
  }, [querySubmitTrigger]);

  // ====== Input handlers ======
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

  // ====== Navigation handlers ======
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
    const msg = (
      translations[selectedLanguage as SupportedLanguage] || translations.en
    ).welcomeMessage;
    setMessages([{ id: "greet-1", sender: "bot", text: msg }]);
  }, [
    flowStep,
    selectedConversation,
    leaveRoom,
    resetChatbotForm,
    resetWebsiteUserForm,
    resetRequestQueryForm,
    resetMentorConversation,
    resetMentorMessage,
    selectedLanguage,
  ]);

  const handleCloseLanguageSelector = useCallback(() => {
    setIsOpen(false);
  }, []);

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
      pushMessage("user", ts("switch_"));
      simulateTyping(ts("sureHowToProceed"));
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
    ts,
  ]);

  // ====== FAQ navigation ======
  // These transitions are deliberately silent — no chat bubbles are pushed
  // for browsing the FAQ list / categories / questions. The FAQ flow is a
  // pure screen-to-screen navigation; conversational history is reserved
  // for the actual "Chat with Nimo Bot" AI flow.
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
      resetRequestQueryForm();
      setSelectedQueryCategory(null);
      setFlowStep("mentor-options");
      pushMessage("user", ts("back"));
      simulateTyping(ts("howToProceed"));
    } else if (flowStep === "query-form") {
      setFlowStep(
        expertCategories.length > 0 ? "query-category" : "mentor-options",
      );
      pushMessage("user", ts("back"));
      simulateTyping(
        expertCategories.length > 0 ? ts("whichCategory") : ts("howToProceed"),
      );
    } else if (flowStep === "mentor-resume-choice") {
      setFlowStep("mentor-options");
      pushMessage("user", ts("back"));
      simulateTyping(ts("howToProceed"));
    } else if (flowStep === "mentor-topics") {
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
    expertCategories.length,
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
      try {
        window.localStorage.setItem(
          FAQ_TOPIC_STORAGE_KEY,
          JSON.stringify({
            id: cat.category_generated_id ?? null,
            name:
              getLocalizedText(cat.topic_name, selectedLanguage || "en") ?? "",
          }),
        );
      } catch (err) {}
    },
    [selectedLanguage],
  );

  // ====== Question Selection Handler ======
  // Selecting a question only reveals its answer inline (see renderContent
  // for "faq-questions"). No chat bubble is pushed — the FAQ flow shows
  // screens directly, without a conversational history trail.
  const handleQuestionSelect = useCallback((q: FAQQuestion) => {
    setSelectedQuestion(q);
  }, []);

  // ====== Other handlers (keep from original) ======
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
  }, [pushMessage, savedContact, ts, t]);

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
    if (!isValidEmail(text)) {
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
    ts,
    t,
  ]);

  const handleChatWithBot = useCallback(() => {
    const c = savedContact ?? mentorForm;
    pushMessage("user", ts("chatWithBot"));
    const chatMsg = (t("youAreNowChatting") as (name: string) => string)(
      c.name,
    );
    simulateTyping(chatMsg);
    setFlowStep("live-chat");
  }, [savedContact, mentorForm, pushMessage, simulateTyping, ts, t]);

  const handleShowMentorTopics = useCallback(async () => {
    pushMessage("user", ts("talkToMentor"));
    if (
      hasActiveConversation &&
      selectedConversation &&
      selectedConversation.status !== "CLOSED"
    ) {
      simulateTyping(ts("activeConversationPrompt"));
      setFlowStep("mentor-resume-choice");
      return;
    }
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
  }, [
    pushMessage,
    simulateTyping,
    getExpertCategories,
    hasActiveConversation,
    selectedConversation,
    ts,
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
    handleRequestQueryChange({
      target: { name: "category", value: "" },
    } as ChangeEvent<HTMLInputElement>);
    setSelectedQueryCategory(null);
    setLocalValidationErrors({});
    pushMessage("user", ts("raiseQuery"));
    (async () => {
      try {
        const cats = await getExpertCategories();
        cats.length > 0
          ? (simulateTyping(ts("whichCategoryQuery")),
            setFlowStep("query-category"))
          : (simulateTyping(ts("giveMeTitleDetails")),
            setFlowStep("query-form"));
      } catch (err) {
        simulateTyping(ts("giveMeTitleDetails"));
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
    ts,
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
      simulateTyping(ts("gotItTitleDetails"));
      setFlowStep("query-form");
    },
    [handleRequestQueryChange, pushMessage, simulateTyping, ts],
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
    pushMessage("user", ts("notSureSkip"));
    simulateTyping(ts("noProblemTitleDetails"));
    setFlowStep("query-form");
  }, [handleRequestQueryChange, pushMessage, simulateTyping, ts]);

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
        "mentor-topics",
        "mentor-chat",
        "query-category",
        "query-form",
        "mentor-resume-choice",
        "live-chat",
      ] as FlowStep[]
    ).includes(flowStep);

  // Note: the "Talk to a Mentor" entry point has been removed from the UI
  // (see mentor-options in renderContent below). The resume-conversation
  // banner is intentionally not rendered anywhere anymore for the same
  // reason — with no entry point into mentor chat there's nothing for it
  // to usefully resume into.

  // ====== Render content based on flow step ======
  const renderContent = () => {
    if (flowStep === "faq-list")
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
                    onClick={() => handleFaqSelect(faq)}
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
            onClick={handleShowSatisfaction}
            type="button"
          >
            <MessageSquareWarning size={16} className="cw-help-btn-icon" />
            <span className="cw-help-btn-text">
              <span>{ts("cantFindAnswer")}</span>
              <span className="cw-help-btn-sub">{ts("talkToSupportTeam")}</span>
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
            {ts("categories")}
          </div>
          {cats.length === 0 ? (
            <div className="cw-empty-state">{ts("noCategoriesYet")}</div>
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
                  <span>
                    {getLocalizedText(
                      cat.topic_name,
                      selectedLanguage || "en",
                    ) || ts("unknown")}
                  </span>
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
                  <span>
                    {getLocalizedText(
                      q.question_text,
                      selectedLanguage || "en",
                    )}
                  </span>
                </button>
              ))}
            </div>
          )}
          {selectedQuestion &&
            (() => {
              const blocks = getLatestAnswerBlocks(
                selectedQuestion,
                selectedLanguage || "en",
              );
              return (
                <div className="cw-answer-box">
                  <div className="cw-answer-box-header">
                    <MessageSquare size={14} />
                    <span>
                      {getLocalizedText(
                        selectedQuestion.question_text,
                        selectedLanguage || "en",
                      )}
                    </span>
                  </div>
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
                                  setPreviewImage(block.image_url!)
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
              );
            })()}
          <button
            className="cw-help-btn"
            onClick={handleShowSatisfaction}
            type="button"
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
    // ... (keep other flow steps from original code)
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
              {ts("notYou")}
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
              <span className="cw-option-label">{ts("chatWithBot")}</span>
              <span className="cw-option-desc">{ts("chatWithBotDesc")}</span>
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
              <span className="cw-option-label">{ts("raiseQuery")}</span>
              <span className="cw-option-desc">{ts("raiseQueryDesc")}</span>
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
              <span className="cw-option-label">{ts("endChat")}</span>
              <span className="cw-option-desc">{ts("endChatDesc")}</span>
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
            onClick={handleStartNewMentorTopic}
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
    if (flowStep === "query-category")
      return (
        <div className="cw-categories-wrap">
          <div className="cw-section-title">
            <span className="cw-section-icon">
              <ClipboardList size={15} />
            </span>
            {ts("whichCategoryQuery")}
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
            {ts("skipCategory")}
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
                {ts("change")}
              </button>
            </div>
          )}
          <form className="cw-query-form" onSubmit={handleSubmitQuery}>
            <div className="cw-query-field">
              <label className="cw-query-label">
                <ClipboardList size={13} />
                {ts("queryTitle")}
              </label>
              <input
                className={`cw-query-input ${requestQueryErrors.query_title || localValidationErrors.query_title ? "has-error" : ""}`}
                name="query_title"
                placeholder={ts("queryTitlePlaceholder")}
                value={requestQuery.query_title}
                onChange={(e) => {
                  handleRequestQueryChange(e);
                  if (
                    e.target.value.trim().length > 0 &&
                    e.target.value.trim().length < 5
                  ) {
                    setLocalValidationErrors((prev) => ({
                      ...prev,
                      query_title: ts("queryTitleError"),
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
                {ts("describeIssue")}
              </label>
              <textarea
                className={`cw-query-textarea ${requestQueryErrors.query_description || localValidationErrors.query_description ? "has-error" : ""}`}
                name="query_description"
                placeholder={ts("describeIssuePlaceholder")}
                value={requestQuery.query_description}
                onChange={(e) => {
                  handleRequestQueryChange(e);
                  if (
                    e.target.value.trim().length > 0 &&
                    e.target.value.trim().length < 10
                  ) {
                    setLocalValidationErrors((prev) => ({
                      ...prev,
                      query_description: ts("queryDescriptionError"),
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
    if (flowStep === "mentor-topics")
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
    return null;
  };

  const showFooterInput =
    flowStep === "mentor-form" ||
    flowStep === "live-chat" ||
    flowStep === "mentor-chat";

  // Chat-bubble history is only meaningful for the actual "Chat with Nimo
  // Bot" AI conversation — every other flow (FAQ browsing, contact form,
  // raise-a-query, options, etc.) is presented as a direct screen without a
  // stacked message trail.
  const showConversationHistory = flowStep === "live-chat";

  // ====== Main render ======
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
                  <NimoBotProfile />
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
                  onClick={handleCloseLanguageSelector}
                  type="button"
                  aria-label={ts("closeChat")}
                  title={ts("closeChat")}
                >
                  <X size={16} />
                </button>
              </div>
              <div className="cw-messages">
                <div className="cw-language-selector">
                  <div className="cw-language-header">
                    <Globe size={32} className="cw-language-icon" />
                    <h2 className="cw-language-title">
                      {ts("selectYourLanguage")}
                    </h2>
                    <p className="cw-language-subtitle">
                      {ts("choosePreferredLanguage")}
                    </p>
                  </div>
                  <div className="cw-language-grid">
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        className="cw-language-btn"
                        onClick={() => handleLanguageSelect(lang.code)}
                        type="button"
                      >
                        <div className="cw-language-btn-content">
                          <span className="cw-language-name">{lang.label}</span>
                          <span className="cw-language-native">
                            {lang.native}
                          </span>
                        </div>
                        <ArrowLeft
                          size={16}
                          style={{ transform: "rotate(180deg)" }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
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
                    aria-label={ts("closeChat")}
                    title={ts("closeChat")}
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
              <div className="cw-messages" aria-live="polite">
                {showConversationHistory &&
                  messages.map((m) => (
                    <div
                      key={m.id}
                      className={`cw-msg ${m.sender === "user" ? "cw-msg--user" : ""}`}
                    >
                      <div
                        className={`cw-avatar ${m.sender === "bot" ? "cw-avatar--bot" : "cw-avatar--user"}`}
                      >
                        {m.sender === "bot" ? (
                          <Bot size={13} />
                        ) : (
                          <User size={12} />
                        )}
                      </div>
                      <div
                        className={`cw-bubble ${m.sender === "bot" ? "cw-bubble--bot" : "cw-bubble--user"} ${m.answerBlocks && m.answerBlocks.length > 0 ? "cw-bubble--article" : ""}`}
                      >
                        {m.sender === "bot" ? (
                          <MessageRenderer
                            message={m}
                            onImageClick={setPreviewImage}
                          />
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
                        <Check size={14} /> {ts("conversationEnded")}
                      </div>
                    )}
                    {mentorMessages
                      .filter(
                        (mm, idx, self) =>
                          idx ===
                          self.findIndex(
                            (m) =>
                              m.message_generated_id ===
                              mm.message_generated_id,
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
                        <p className="cw-post-chat-text">{ts("wasHelpful")}</p>
                        <div className="cw-post-chat-buttons">
                          <button
                            className="cw-btn cw-btn--query"
                            onClick={handleRaiseQueryFromEnd}
                            type="button"
                          >
                            <FileText size={14} />
                            {ts("raiseQueryEnd")}
                          </button>
                          <button
                            className="cw-btn cw-btn--satisfied"
                            onClick={handleConversationSatisfied}
                            type="button"
                          >
                            <Check size={14} />
                            {ts("allGoodThanks")}
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
                          {ts("thanksForChatting")}
                        </p>
                        <div className="cw-post-chat-buttons">
                          <button
                            className="cw-btn cw-btn--home"
                            onClick={handleBackToHome}
                            type="button"
                          >
                            <Home size={14} />
                            {ts("backToHome")}
                          </button>
                          <button
                            className="cw-btn cw-btn--exit"
                            onClick={handleExitChat}
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
                {renderContent()}
                {showConversationHistory && (isTyping || chatbotLoading) && (
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
                      className={`cw-input ${formError || localValidationErrors[mentorFormStep] ? "has-error" : ""}`}
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
                      className={`cw-input ${chatbotErrors.question || localValidationErrors.message ? "has-error" : ""}`}
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
                        className={`cw-input ${mentorErrors.message || localValidationErrors.message ? "has-error" : ""}`}
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
