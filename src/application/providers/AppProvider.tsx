"use client";

import { ReactNode } from "react";

import { TopicProvider } from "../topics/TopicContext";
import { FAQProvider } from "../faq/FaqContext";
import { ChatbotProvider } from "../chat-bot/ChatbotContext";
import { WebsiteUserProvider } from "../website-users/WebsiteUserContext";
import { RequestQueryProvider } from "../request_a_query/RequestQueryContext";
import { ChatProvider } from "../live-chat/ChatContext";
import { UserProvider } from "../users/UserContext";

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
                <UserProvider>{children}</UserProvider>
              </ChatProvider>
            </RequestQueryProvider>
          </WebsiteUserProvider>
        </ChatbotProvider>
      </FAQProvider>
    </TopicProvider>
  );
}
