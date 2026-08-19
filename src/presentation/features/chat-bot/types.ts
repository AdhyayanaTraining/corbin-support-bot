import type { JSX } from "react";
import type { FAQ, FAQCategory, FAQQuestion } from "@/src/application/faq/faq.types";
import type { User as ExpertUser, ExpertCategory } from "@/src/application/users/user.types";

export type Sender = "bot" | "user";

export interface FAQMessageBlock {
  type: "paragraph" | "image";
  text?: string;
  image_url?: string;
}

export interface Message {
  id: string;
  sender: Sender;
  text: string;
  images?: string[];
  answerBlocks?: FAQMessageBlock[];
  isArticle?: boolean;
}

export type FlowStep =
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

export type MentorFormStep = "name" | "mobile" | "email";

export type SatisfactionStage = "ask" | "closed" | null;

export interface ContactDetails {
  name: string;
  mobile: string;
  email: string;
  registered_employee_generated_id?: string;
}

export interface ActiveTopicCategory {
  id: string | null;
  name: string;
}

export interface ValidationErrors {
  name?: string;
  mobile?: string;
  email?: string;
  category?: string;
  query_title?: string;
  query_description?: string;
  message?: string;
}

export type SupportedLanguage = "en" | "hi" | "te" | "ta" | "kn";

export interface Translations {
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
