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
  loading: boolean;
  socketConnected: boolean;
  conversations: ChatConversation[];
  messages: ChatMessage[];
  selectedConversation: ChatConversation | null;
  conversation: CreateConversationPayload;
  message: SendMessagePayload;
  errors: ChatValidationErrors;

  setSelectedConversation: (conversation: ChatConversation) => void;
  handleConversationChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => void;
  handleMessageChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  resetConversation: () => void;
  resetMessage: () => void;

  createConversation: (payload: CreateConversationPayload) => Promise<boolean>;
  getConversation: (conversation_generated_id: string) => Promise<void>;
  getVisitorConversations: (visitor_generated_id: string) => Promise<void>;

  sendMessage: () => Promise<boolean>;
  getConversationMessages: (conversation_generated_id: string) => Promise<void>;
  markConversationAsRead: (
    conversation_generated_id: string,
  ) => Promise<boolean>;
  getUnreadCount: (conversation_generated_id: string) => Promise<number>;

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
  const [loading, setLoading] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [selectedConversation, setSelectedConversationState] =
    useState<ChatConversation | null>(null);
  const [conversation, setConversation] =
    useState<CreateConversationPayload>(EMPTY_CONVERSATION);
  const [message, setMessage] = useState<SendMessagePayload>(EMPTY_MESSAGE);
  const [errors, setErrors] = useState<ChatValidationErrors>({});

  // ====================================================
  // SET SELECTED CONVERSATION
  // ====================================================

  const setSelectedConversation = (conv: ChatConversation) => {
    setSelectedConversationState(conv);
    setMessage((prev) => ({
      ...prev,
      conversation_generated_id: conv.conversation_generated_id,
      sender: "VISITOR",
      sender_generated_id: conv.visitor_generated_id,
    }));
  };

  // ====================================================
  // HANDLE CONVERSATION CHANGE
  // ====================================================

  const handleConversationChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setConversation((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof ChatValidationErrors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // ====================================================
  // HANDLE MESSAGE CHANGE
  // ====================================================

  const handleMessageChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setMessage((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof ChatValidationErrors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
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
  // CREATE CONVERSATION
  // ====================================================

  const createConversation = async (
    payload: CreateConversationPayload,
  ): Promise<boolean> => {
    try {
      console.log("================================");
      console.log("createConversation() CALLED");
      console.log(payload);

      const validationErrors = validateConversation(payload);

      console.log("Validation Errors:", validationErrors);

      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return false;
      }

      setLoading(true);

      console.log("Calling ChatService.createConversation()");

      const response = await ChatService.createConversation(payload);

      console.log("Response:", response);

      if (response.success) {
        setSelectedConversation(response.data);

        setConversations((prev) => {
          const exists = prev.some(
            (c) =>
              c.conversation_generated_id ===
              response.data.conversation_generated_id,
          );

          if (exists) return prev;

          return [response.data, ...prev];
        });

        return true;
      }

      return false;
    } catch (error: any) {
      console.log("ERROR OCCURRED");
      console.log(error);
      console.log(error.response);
      console.log(error.response?.data);
      console.log(error.response?.status);

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
      if (response.success) setSelectedConversation(response.data);
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
      if (response.success) setConversations(response.data ?? []);
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
        setMessages((prev) => [...prev, response.data]);
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
      if (response.success) setMessages(response.data ?? []);
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
        setMessages((prev) => prev.map((m) => ({ ...m, is_read: true })));
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
      if (response.success) return response.data.unread_count;
      return 0;
    } catch (error) {
      console.error("Failed to fetch unread count.", error);
      return 0;
    }
  };

  // ====================================================
  // SOCKET METHODS
  // ====================================================

  const connectSocket = () => {
    const socket = ChatSocket.connect();
    setSocketConnected(!!socket);
  };

  const disconnectSocket = () => {
    ChatSocket.disconnect();
    setSocketConnected(false);
  };

  const joinRoom = (conversation_generated_id: string) => {
    ChatSocket.joinRoom(conversation_generated_id);
  };

  const leaveRoom = (conversation_generated_id: string) => {
    ChatSocket.leaveRoom(conversation_generated_id);
  };

  const startTyping = (conversation_generated_id: string) => {
    ChatSocket.typing(conversation_generated_id);
  };

  const stopTyping = (conversation_generated_id: string) => {
    ChatSocket.stopTyping(conversation_generated_id);
  };

  // ====================================================
  // SOCKET EVENTS
  // ====================================================

  useEffect(() => {
    const socket = ChatSocket.connect();
    if (!socket) return;

    socket.on("connect", () => {
      console.log("Socket Connected");
      setSocketConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("Socket Disconnected");
      setSocketConnected(false);
    });

    // NEW MESSAGE
    socket.on("new_message", (data: ChatMessage) => {
      console.log("Socket Message Received:", data);
      if (
        data.conversation_generated_id !==
        selectedConversation?.conversation_generated_id
      )
        return;
      setMessages((prev) => [...prev, data]);
    });

    // CONVERSATION CLOSED (by expert)
    socket.on("conversation_closed", (data: ChatConversation) => {
      console.log("Conversation closed by expert:", data);
      setSelectedConversationState((prev) => {
        if (
          prev?.conversation_generated_id === data.conversation_generated_id
        ) {
          return { ...prev, ...data, status: "CLOSED" as const };
        }
        return prev;
      });
      setConversations((prev) =>
        prev.map((c) =>
          c.conversation_generated_id === data.conversation_generated_id
            ? { ...c, ...data, status: "CLOSED" as const }
            : c,
        ),
      );
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("new_message");
      socket.off("conversation_closed");
      ChatSocket.disconnect();
    };
  }, [selectedConversation]);

  // ====================================================
  // JOIN / LEAVE CONVERSATION ROOM
  // ====================================================

  useEffect(() => {
    if (!selectedConversation) return;
    joinRoom(selectedConversation.conversation_generated_id);
    return () => {
      leaveRoom(selectedConversation.conversation_generated_id);
    };
  }, [selectedConversation]);

  // ====================================================
  // CONTEXT VALUE
  // ====================================================

  const value: ChatContextType = {
    loading,
    socketConnected,
    conversations,
    messages,
    selectedConversation,
    conversation,
    message,
    errors,
    setSelectedConversation,
    handleConversationChange,
    handleMessageChange,
    resetConversation,
    resetMessage,
    createConversation,
    getConversation,
    getVisitorConversations,
    sendMessage,
    getConversationMessages,
    markConversationAsRead,
    getUnreadCount,
    connectSocket,
    disconnectSocket,
    joinRoom,
    leaveRoom,
    startTyping,
    stopTyping,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

// ======================================================
// HOOK
// ======================================================

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error("useChat must be used within ChatProvider");
  return context;
};
