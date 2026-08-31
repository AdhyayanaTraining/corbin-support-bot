"use client";

import { ReactNode } from "react";

import { TopicProvider } from "../topics/TopicContext";
import { FAQProvider } from "../faq/FaqContext";
import { ChatbotProvider } from "../chat-bot/ChatbotContext";
import { WebsiteUserProvider } from "../website-users/WebsiteUserContext";
import { RequestQueryProvider } from "../request_a_query/RequestQueryContext";
import { ChatProvider } from "../live-chat/ChatContext";
import { UserProvider } from "../users/UserContext";
import { ChatbotSettingProvider } from "../chatbot-setting/chatbot_setting.context";
import { UnansweredQuestionProvider } from "../unasnwered-quetion/unanswered_question_context";

interface AppProviderProps {
  children: ReactNode;
}

export default function AppProvider({ children }: AppProviderProps) {
  return (
    <TopicProvider>
      <FAQProvider>
        <ChatbotProvider>
          <WebsiteUserProvider>
            <RequestQueryProvider>
              <ChatProvider>
                <UserProvider>
                  <ChatbotSettingProvider>
                    <UnansweredQuestionProvider>
                      {children}
                    </UnansweredQuestionProvider>
                  </ChatbotSettingProvider>
                </UserProvider>
              </ChatProvider>
            </RequestQueryProvider>
          </WebsiteUserProvider>
        </ChatbotProvider>
      </FAQProvider>
    </TopicProvider>
  );
}
