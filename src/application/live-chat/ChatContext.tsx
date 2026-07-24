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
  // Loading
  loading: boolean;

  // Socket
  socketConnected: boolean;

  // Lists
  conversations: ChatConversation[];

  messages: ChatMessage[];

  // Selected Conversation
  selectedConversation: ChatConversation | null;

  // Forms
  conversation: CreateConversationPayload;

  message: SendMessagePayload;

  // Errors
  errors: ChatValidationErrors;

  // Set Selected Conversation
  setSelectedConversation: (conversation: ChatConversation) => void;

  // Handle Conversation Input
  handleConversationChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => void;

  // Handle Message Input
  handleMessageChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;

  // Reset Forms
  resetConversation: () => void;

  resetMessage: () => void;

  // ======================================================
  // CONVERSATION
  // ======================================================

  createConversation: () => Promise<boolean>;

  getConversation: (conversation_generated_id: string) => Promise<void>;

  getWaitingConversations: () => Promise<void>;

  getActiveConversations: () => Promise<void>;

  getExpertConversations: (expert_generated_id: string) => Promise<void>;

  getVisitorConversations: (visitor_email: string) => Promise<void>;

  // ======================================================
  // MESSAGE
  // ======================================================

  sendMessage: () => Promise<boolean>;

  getConversationMessages: (conversation_generated_id: string) => Promise<void>;

  markConversationAsRead: (
    conversation_generated_id: string,
  ) => Promise<boolean>;

  getUnreadCount: (conversation_generated_id: string) => Promise<number>;

  // ======================================================
  // ACTIONS
  // ======================================================

  acceptConversation: (conversation_generated_id: string) => Promise<boolean>;

  closeConversation: (conversation_generated_id: string) => Promise<boolean>;

  deleteConversation: (conversation_generated_id: string) => Promise<boolean>;

  // ======================================================
  // SOCKET
  // ======================================================

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
  // VALIDATION ERRORS
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
    }));
  };

  // ====================================================
  // CREATE CONVERSATION
  // ====================================================

  const createConversation = async (): Promise<boolean> => {
    try {
      const validationErrors = validateConversation(conversation);

      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);

        return false;
      }

      setLoading(true);

      console.log("Conversation Payload:");
      console.log(conversation);

      const response = await ChatService.createConversation(conversation);
      if (response.success) {
        setSelectedConversationState(response.data);

        setConversations((prev) => [response.data, ...prev]);

        setMessage((prev) => ({
          ...prev,
          conversation_generated_id: response.data.conversation_generated_id,
        }));

        resetConversation();

        return true;
      }

      return false;
    } catch (error) {
      console.error("Failed to create conversation.");

      console.log("Payload:");
      console.log(conversation);

      console.log("Backend Response:");

      console.error("Failed to create conversation.", error);

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
        setSelectedConversationState(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch conversation.", error);
    } finally {
      setLoading(false);
    }
  };

  // ====================================================
  // GET WAITING CONVERSATIONS
  // ====================================================

  const getWaitingConversations = async (): Promise<void> => {
    try {
      setLoading(true);

      const response = await ChatService.getWaitingConversations();

      if (response.success) {
        setConversations(response.data ?? []);
      }
    } catch (error) {
      console.error("Failed to fetch waiting conversations.", error);
    } finally {
      setLoading(false);
    }
  };

  // ====================================================
  // GET ACTIVE CONVERSATIONS
  // ====================================================

  const getActiveConversations = async (): Promise<void> => {
    try {
      setLoading(true);

      const response = await ChatService.getActiveConversations();

      if (response.success) {
        setConversations(response.data ?? []);
      }
    } catch (error) {
      console.error("Failed to fetch active conversations.", error);
    } finally {
      setLoading(false);
    }
  };

  // ====================================================
  // GET EXPERT CONVERSATIONS
  // ====================================================

  const getExpertConversations = async (
    expert_generated_id: string,
  ): Promise<void> => {
    try {
      setLoading(true);

      const response =
        await ChatService.getExpertConversations(expert_generated_id);

      if (response.success) {
        setConversations(response.data ?? []);
      }
    } catch (error) {
      console.error("Failed to fetch expert conversations.", error);
    } finally {
      setLoading(false);
    }
  };

  // ====================================================
  // GET VISITOR CONVERSATIONS
  // ====================================================

  const getVisitorConversations = async (
    visitor_email: string,
  ): Promise<void> => {
    try {
      setLoading(true);

      const response = await ChatService.getVisitorConversations(visitor_email);

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
        // Don't add message to state here - let socket listener handle it
        // to prevent duplicate messages
        resetMessage();

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
      console.error("Failed to fetch conversation messages.", error);
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
          prev.map((msg) => ({
            ...msg,
            is_read: true,
          })),
        );

        return true;
      }

      return false;
    } catch (error) {
      console.error("Failed to mark messages as read.", error);

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
  // ACCEPT CONVERSATION
  // ====================================================

  const acceptConversation = async (
    conversation_generated_id: string,
  ): Promise<boolean> => {
    try {
      setLoading(true);

      const response = await ChatService.acceptConversation(
        conversation_generated_id,
      );

      if (response.success) {
        setConversations((prev) =>
          prev.map((conversation) =>
            conversation.conversation_generated_id === conversation_generated_id
              ? {
                  ...conversation,
                  status: "ACTIVE",
                  accepted_at: new Date().toISOString(),
                }
              : conversation,
          ),
        );

        if (
          selectedConversation?.conversation_generated_id ===
          conversation_generated_id
        ) {
          setSelectedConversationState((prev) =>
            prev
              ? {
                  ...prev,
                  status: "ACTIVE",
                  accepted_at: new Date().toISOString(),
                }
              : null,
          );
        }

        return true;
      }

      return false;
    } catch (error) {
      console.error("Failed to accept conversation.", error);

      return false;
    } finally {
      setLoading(false);
    }
  };

  // ====================================================
  // CLOSE CONVERSATION
  // ====================================================

  const closeConversation = async (
    conversation_generated_id: string,
  ): Promise<boolean> => {
    try {
      setLoading(true);

      const response = await ChatService.closeConversation(
        conversation_generated_id,
      );

      if (response.success) {
        setConversations((prev) =>
          prev.map((conversation) =>
            conversation.conversation_generated_id === conversation_generated_id
              ? {
                  ...conversation,
                  status: "CLOSED",
                  closed_at: new Date().toISOString(),
                }
              : conversation,
          ),
        );

        if (
          selectedConversation?.conversation_generated_id ===
          conversation_generated_id
        ) {
          setSelectedConversationState((prev) =>
            prev
              ? {
                  ...prev,
                  status: "CLOSED",
                  closed_at: new Date().toISOString(),
                }
              : null,
          );
        }

        return true;
      }

      return false;
    } catch (error) {
      console.error("Failed to close conversation.", error);

      return false;
    } finally {
      setLoading(false);
    }
  };

  // ====================================================
  // DELETE CONVERSATION
  // ====================================================

  const deleteConversation = async (
    conversation_generated_id: string,
  ): Promise<boolean> => {
    try {
      setLoading(true);

      const response = await ChatService.deleteConversation(
        conversation_generated_id,
      );

      if (response.success) {
        setConversations((prev) =>
          prev.filter(
            (conversation) =>
              conversation.conversation_generated_id !==
              conversation_generated_id,
          ),
        );

        if (
          selectedConversation?.conversation_generated_id ===
          conversation_generated_id
        ) {
          setSelectedConversationState(null);

          setMessages([]);
        }

        return true;
      }

      return false;
    } catch (error) {
      console.error("Failed to delete conversation.", error);

      return false;
    } finally {
      setLoading(false);
    }
  };

  // ====================================================
  // CONNECT SOCKET
  // ====================================================

  const connectSocket = (): boolean => {
    const socket = ChatSocket.connect();

    return !!socket;
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
  // SOCKET EVENTS
  // ====================================================

  useEffect(() => {
    connectSocket();

    ChatSocket.on("conversation_created", (conversation: ChatConversation) => {
      setConversations((prev) => [conversation, ...prev]);
    });

    ChatSocket.on(
      "conversation_accepted",
      ({
        conversation_generated_id,
      }: {
        conversation_generated_id: string;
      }) => {
        setConversations((prev) =>
          prev.map((conversation) =>
            conversation.conversation_generated_id === conversation_generated_id
              ? {
                  ...conversation,
                  status: "ACTIVE",
                }
              : conversation,
          ),
        );
      },
    );

    ChatSocket.on("new_message", (message: ChatMessage) => {
      setMessages((prev) => [...prev, message]);
    });

    ChatSocket.on("messages_read", () => {
      setMessages((prev) =>
        prev.map((message) => ({
          ...message,
          is_read: true,
        })),
      );
    });

    ChatSocket.on(
      "conversation_closed",
      ({
        conversation_generated_id,
      }: {
        conversation_generated_id: string;
      }) => {
        setConversations((prev) =>
          prev.map((conversation) =>
            conversation.conversation_generated_id === conversation_generated_id
              ? {
                  ...conversation,
                  status: "CLOSED",
                }
              : conversation,
          ),
        );
      },
    );

    ChatSocket.on(
      "conversation_deleted",
      ({
        conversation_generated_id,
      }: {
        conversation_generated_id: string;
      }) => {
        setConversations((prev) =>
          prev.filter(
            (conversation) =>
              conversation.conversation_generated_id !==
              conversation_generated_id,
          ),
        );
      },
    );

    return () => {
      // Clean up all socket listeners to prevent memory leaks
      ChatSocket.off("conversation_created");
      ChatSocket.off("conversation_accepted");
      ChatSocket.off("new_message");
      ChatSocket.off("messages_read");
      ChatSocket.off("conversation_closed");
      ChatSocket.off("conversation_deleted");

      disconnectSocket();
    };
  }, []);

  // ====================================================
  // CONTEXT VALUE
  // ====================================================

  const value: ChatContextType = {
    // Loading
    loading,

    // Socket
    socketConnected,

    // Data
    conversations,

    messages,

    selectedConversation,

    // Forms
    conversation,

    message,

    // Validation
    errors,

    // Form Functions
    setSelectedConversation,

    handleConversationChange,

    handleMessageChange,

    resetConversation,

    resetMessage,

    // Conversation APIs
    createConversation,

    getConversation,

    getWaitingConversations,

    getActiveConversations,

    getExpertConversations,

    getVisitorConversations,

    // Message APIs
    sendMessage,

    getConversationMessages,

    markConversationAsRead,

    getUnreadCount,

    // Conversation Actions
    acceptConversation,

    closeConversation,

    deleteConversation,

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
