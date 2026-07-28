/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

// ======================================================
// REACT
// ======================================================

import {
  ChangeEvent,
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

// ======================================================
// SERVICE
// ======================================================

import ChatService from "./chat.service";

// ======================================================
// SOCKET
// ======================================================

import ChatSocket from "./chat.socket";

// ======================================================
// TYPES
// ======================================================

import {
  ChatConversation,
  ChatMessage,
  CreateConversationPayload,
  SendMessagePayload,
  EMPTY_CONVERSATION,
  EMPTY_MESSAGE,
} from "./chat.types";

// ======================================================
// VALIDATION
// ======================================================

import {
  ChatValidationErrors,
  validateConversation,
  validateMessage,
} from "./chat.validation";

// ======================================================
// CONTEXT TYPE
// ======================================================

interface ChatContextType {
  // ====================================================
  // STATE
  // ====================================================

  loading: boolean;

  socketConnected: boolean;

  conversations: ChatConversation[];

  messages: ChatMessage[];

  selectedConversation: ChatConversation | null;

  conversation: CreateConversationPayload;

  message: SendMessagePayload;

  errors: ChatValidationErrors;

  // ====================================================
  // FORM
  // ====================================================

  setSelectedConversation: (conversation: ChatConversation) => void;

  handleConversationChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => void;

  handleMessageChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;

  resetConversation: () => void;

  resetMessage: () => void;

  // ====================================================
  // CONVERSATION
  // ====================================================

  createConversation: (payload: CreateConversationPayload) => Promise<boolean>;

  getConversation: (conversation_generated_id: string) => Promise<void>;

  getVisitorConversations: (visitor_generated_id: string) => Promise<void>;

  // ====================================================
  // MESSAGE
  // ====================================================

  sendMessage: () => Promise<boolean>;

  getConversationMessages: (conversation_generated_id: string) => Promise<void>;

  markConversationAsRead: (
    conversation_generated_id: string,
  ) => Promise<boolean>;

  getUnreadCount: (conversation_generated_id: string) => Promise<number>;

  // ====================================================
  // SOCKET
  // ====================================================

  connectSocket: () => void;

  disconnectSocket: () => void;

  joinRoom: (conversation_generated_id: string) => void;

  leaveRoom: (conversation_generated_id: string) => void;

  startTyping: (conversation_generated_id: string) => void;

  stopTyping: (conversation_generated_id: string) => void;
}

// ======================================================
// CONTEXT
// ======================================================

const ChatContext = createContext<ChatContextType | undefined>(undefined);

// ======================================================
// PROVIDER
// ======================================================

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  // ====================================================
  // LOADING
  // ====================================================

  const [loading, setLoading] = useState(false);

  // ====================================================
  // SOCKET
  // ====================================================

  const [socketConnected, setSocketConnected] = useState(false);

  // ====================================================
  // CONVERSATIONS
  // ====================================================

  const [conversations, setConversations] = useState<ChatConversation[]>([]);

  // ====================================================
  // MESSAGES
  // ====================================================

  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // ====================================================
  // SELECTED CONVERSATION
  // ====================================================

  const [selectedConversation, setSelectedConversationState] =
    useState<ChatConversation | null>(null);

  // ====================================================
  // CONVERSATION FORM
  // ====================================================

  const [conversation, setConversation] =
    useState<CreateConversationPayload>(EMPTY_CONVERSATION);

  // ====================================================
  // MESSAGE FORM
  // ====================================================

  const [message, setMessage] = useState<SendMessagePayload>(EMPTY_MESSAGE);

  // ====================================================
  // VALIDATION
  // ====================================================

  const [errors, setErrors] = useState<ChatValidationErrors>({});

  // ====================================================
  // SET SELECTED CONVERSATION
  // ====================================================

  const setSelectedConversation = (conversation: ChatConversation) => {
    setSelectedConversationState(conversation);

    setMessage((prev) => ({
      ...prev,
      conversation_generated_id: conversation.conversation_generated_id,
      sender: "VISITOR",
      sender_generated_id: conversation.visitor_generated_id,
    }));
  };

  // ====================================================
  // HANDLE CONVERSATION CHANGE
  // ====================================================

  const handleConversationChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setConversation((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof ChatValidationErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // ====================================================
  // HANDLE MESSAGE CHANGE
  // ====================================================

  const handleMessageChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setMessage((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof ChatValidationErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // ====================================================
  // RESET CONVERSATION
  // ====================================================

  const resetConversation = () => {
    setConversation(EMPTY_CONVERSATION);

    setErrors({});
  };

  // ====================================================
  // RESET MESSAGE
  // ====================================================

  const resetMessage = () => {
    setMessage((prev) => ({
      ...EMPTY_MESSAGE,
      conversation_generated_id: prev.conversation_generated_id,
      sender: prev.sender,
      sender_generated_id: prev.sender_generated_id,
    }));
  };

  // ====================================================
  // PART 2 STARTS FROM HERE...
  // ====================================================
  // ====================================================
  // CREATE CONVERSATION
  // ====================================================

  const createConversation = async (
    payload: CreateConversationPayload,
  ): Promise<boolean> => {
    try {
      const validationErrors = validateConversation(payload);

      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);

        return false;
      }

      setLoading(true);

      const response = await ChatService.createConversation(payload);

      if (response.success) {
        setSelectedConversation(response.data);

        setConversations((prev) => {
          const exists = prev.some(
            (conversation) =>
              conversation.conversation_generated_id ===
              response.data.conversation_generated_id,
          );

          if (exists) {
            return prev;
          }

          return [response.data, ...prev];
        });

        return true;
      }

      return false;
    } catch (error: any) {
      console.log("Create Conversation Error");
      console.log(error.response?.status);
      console.log(error.response?.data);

      return false;
    } finally {
      setLoading(false);
    }
  };

  // ====================================================
  // GET CONVERSATION
  // ====================================================

  const getConversation = async (
    conversation_generated_id: string,
  ): Promise<void> => {
    try {
      setLoading(true);

      const response = await ChatService.getConversation(
        conversation_generated_id,
      );

      if (response.success) {
        setSelectedConversation(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch conversation.", error);
    } finally {
      setLoading(false);
    }
  };

  // ====================================================
  // GET VISITOR CONVERSATIONS
  // ====================================================

  const getVisitorConversations = async (
    visitor_generated_id: string,
  ): Promise<void> => {
    try {
      setLoading(true);

      const response =
        await ChatService.getVisitorConversations(visitor_generated_id);

      if (response.success) {
        setConversations(response.data ?? []);
      }
    } catch (error) {
      console.error("Failed to fetch visitor conversations.", error);
    } finally {
      setLoading(false);
    }
  };

  // ====================================================
  // SEND MESSAGE
  // ====================================================

  const sendMessage = async (): Promise<boolean> => {
    try {
      const validationErrors = validateMessage(message);

      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);

        return false;
      }

      setLoading(true);

      const response = await ChatService.sendMessage(message);

      if (response.success) {
        resetMessage();

        await getConversationMessages(message.conversation_generated_id);

        return true;
      }

      return false;
    } catch (error) {
      console.error("Failed to send message.", error);

      return false;
    } finally {
      setLoading(false);
    }
  };

  // ====================================================
  // GET CONVERSATION MESSAGES
  // ====================================================

  const getConversationMessages = async (
    conversation_generated_id: string,
  ): Promise<void> => {
    try {
      setLoading(true);

      const response = await ChatService.getConversationMessages(
        conversation_generated_id,
      );

      if (response.success) {
        setMessages(response.data ?? []);
      }
    } catch (error) {
      console.error("Failed to fetch messages.", error);
    } finally {
      setLoading(false);
    }
  };

  // ====================================================
  // MARK CONVERSATION AS READ
  // ====================================================

  const markConversationAsRead = async (
    conversation_generated_id: string,
  ): Promise<boolean> => {
    try {
      const response = await ChatService.markConversationAsRead(
        conversation_generated_id,
      );

      if (response.success) {
        setMessages((prev) =>
          prev.map((message) => ({
            ...message,
            is_read: true,
          })),
        );

        return true;
      }

      return false;
    } catch (error) {
      console.error("Failed to mark conversation as read.", error);

      return false;
    }
  };

  // ====================================================
  // GET UNREAD COUNT
  // ====================================================

  const getUnreadCount = async (
    conversation_generated_id: string,
  ): Promise<number> => {
    try {
      const response = await ChatService.getUnreadCount(
        conversation_generated_id,
      );

      if (response.success) {
        return response.data.unread_count;
      }

      return 0;
    } catch (error) {
      console.error("Failed to fetch unread count.", error);

      return 0;
    }
  };

  // ====================================================
  // CONNECT SOCKET
  // ====================================================

  const connectSocket = () => {
    const socket = ChatSocket.connect();

    setSocketConnected(!!socket);
  };

  // ====================================================
  // DISCONNECT SOCKET
  // ====================================================

  const disconnectSocket = () => {
    ChatSocket.disconnect();

    setSocketConnected(false);
  };

  // ====================================================
  // JOIN ROOM
  // ====================================================

  const joinRoom = (conversation_generated_id: string) => {
    ChatSocket.joinRoom(conversation_generated_id);
  };

  // ====================================================
  // LEAVE ROOM
  // ====================================================

  const leaveRoom = (conversation_generated_id: string) => {
    ChatSocket.leaveRoom(conversation_generated_id);
  };

  // ====================================================
  // START TYPING
  // ====================================================

  const startTyping = (conversation_generated_id: string) => {
    ChatSocket.typing(conversation_generated_id);
  };

  // ====================================================
  // STOP TYPING
  // ====================================================

  const stopTyping = (conversation_generated_id: string) => {
    ChatSocket.stopTyping(conversation_generated_id);
  };

  // ====================================================
  // PART 3 STARTS FROM HERE...
  // ====================================================
  // ====================================================
  // SOCKET EVENTS
  // ====================================================

  useEffect(() => {
    const socket = ChatSocket.connect();

    if (!socket) return;

    socket.on("connect", () => {
      setSocketConnected(true);
    });

    socket.on("disconnect", () => {
      setSocketConnected(false);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");

      ChatSocket.disconnect();
    };
  }, []);

  // ====================================================
  // JOIN / LEAVE CONVERSATION ROOM
  // ====================================================

  useEffect(() => {
    if (!selectedConversation) {
      return;
    }

    joinRoom(selectedConversation.conversation_generated_id);

    return () => {
      leaveRoom(selectedConversation.conversation_generated_id);
    };
  }, [selectedConversation]);

  // ====================================================
  // CONTEXT VALUE
  // ====================================================

  const value: ChatContextType = {
    // State
    loading,

    socketConnected,

    conversations,

    messages,

    selectedConversation,

    conversation,

    message,

    errors,

    // Form
    setSelectedConversation,

    handleConversationChange,

    handleMessageChange,

    resetConversation,

    resetMessage,

    // Conversation
    createConversation,

    getConversation,

    getVisitorConversations,

    // Message
    sendMessage,

    getConversationMessages,

    markConversationAsRead,

    getUnreadCount,

    // Socket
    connectSocket,

    disconnectSocket,

    joinRoom,

    leaveRoom,

    startTyping,

    stopTyping,
  };

  // ====================================================
  // PROVIDER
  // ====================================================

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

// ======================================================
// HOOK
// ======================================================

export const useChat = () => {
  const context = useContext(ChatContext);

  if (!context) {
    throw new Error("useChat must be used within ChatProvider");
  }

  return context;
};
