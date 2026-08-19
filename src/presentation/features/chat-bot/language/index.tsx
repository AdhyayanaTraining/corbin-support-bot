import React, { useState, useRef, useEffect } from "react";
import { Globe, ChevronDown, Check, ArrowLeft } from "lucide-react";
import type { SupportedLanguage, Translations } from "../types";
import "./style.css";

export const LANGUAGE_STORAGE_KEY = "nimobot_selected_language";

export const LANGUAGES = [
  { code: "en", label: "English", native: "English" },
  { code: "hi", label: "Hindi", native: "हिन्दी" },
  { code: "te", label: "Telugu", native: "తెలుగు" },
  { code: "ta", label: "Tamil", native: "தமிழ்" },
  { code: "kn", label: "Kannada", native: "ಕನ್ನಡ" },
];

export const translations: Record<SupportedLanguage, Translations> = {
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
      "வணக்கம்! நான் **Nimo Bot**, உங்கள் AI உதவியாளர். கீழே ஒரு கேள்வியைத் தேர்ந்தெடுக்கங்கள், நான் உங்களுக்கு உதவுகிறேன்.",
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

export const getLocalizedText = (value: any, language: string): string => {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value[language] ?? value.en ?? Object.values(value)[0] ?? "";
};

export function getTranslation(
  lang: string | undefined,
  key: keyof Translations,
): string | ((...args: any[]) => string) {
  const t = translations[lang as SupportedLanguage] || translations.en;
  return t[key];
}

interface LanguageDropdownProps {
  currentLanguage: string;
  onSelect: (code: string) => void;
  ts: (key: keyof Translations) => string;
}

export function LanguageDropdown({
  currentLanguage,
  onSelect,
  ts,
}: LanguageDropdownProps) {
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
              className={`cw-language-dropdown-item ${
                lang.code === currentLanguage ? "is-active" : ""
              }`}
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

interface LanguageModuleProps {
  ts: (key: keyof Translations) => string;
  onLanguageSelect: (languageCode: string) => void;
}

export function LanguageModule({
  ts,
  onLanguageSelect,
}: LanguageModuleProps) {
  return (
    <div className="cw-language-selector">
      <div className="cw-language-header">
        <Globe size={32} className="cw-language-icon" />
        <h2 className="cw-language-title">{ts("selectYourLanguage")}</h2>
        <p className="cw-language-subtitle">{ts("choosePreferredLanguage")}</p>
      </div>
      <div className="cw-language-grid">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            className="cw-language-btn"
            onClick={() => onLanguageSelect(lang.code)}
            type="button"
          >
            <div className="cw-language-btn-content">
              <span className="cw-language-name">{lang.label}</span>
              <span className="cw-language-native">{lang.native}</span>
            </div>
            <ArrowLeft size={16} style={{ transform: "rotate(180deg)" }} />
          </button>
        ))}
      </div>
    </div>
  );
}

export default LanguageModule;
