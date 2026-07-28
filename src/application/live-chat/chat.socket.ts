/* eslint-disable @typescript-eslint/no-explicit-any */

import { io, Socket } from "socket.io-client";

// ======================================================
// CHAT SOCKET
// ======================================================

class ChatSocket {
  private socket: Socket | null = null;

  // =====================================================
  // CONNECT
  // =====================================================

  connect(): Socket {
    if (this.socket?.connected) {
      return this.socket;
    }

    this.socket = io(
      process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000",
      {
        transports: ["websocket"],
      },
    );

    return this.socket;
  }

  // =====================================================
  // DISCONNECT
  // =====================================================

  disconnect(): void {
    if (!this.socket) {
      return;
    }

    this.socket.disconnect();

    this.socket = null;
  }

  // =====================================================
  // GET SOCKET
  // =====================================================

  getSocket(): Socket | null {
    return this.socket;
  }

  // =====================================================
  // JOIN CONVERSATION ROOM
  // =====================================================

  joinRoom(conversation_generated_id: string): void {
    this.socket?.emit("join_room", conversation_generated_id);
  }

  // =====================================================
  // LEAVE CONVERSATION ROOM
  // =====================================================

  leaveRoom(conversation_generated_id: string): void {
    this.socket?.emit("leave_room", conversation_generated_id);
  }

  // =====================================================
  // VISITOR TYPING
  // =====================================================

  typing(conversation_generated_id: string): void {
    this.socket?.emit("typing", conversation_generated_id);
  }

  // =====================================================
  // VISITOR STOP TYPING
  // =====================================================

  stopTyping(conversation_generated_id: string): void {
    this.socket?.emit("stop_typing", conversation_generated_id);
  }

  // =====================================================
  // REGISTER EVENT
  // =====================================================

  on(event: string, callback: (...args: any[]) => void): void {
    this.socket?.on(event, callback);
  }

  // =====================================================
  // REMOVE EVENT
  // =====================================================

  off(event: string, callback?: (...args: any[]) => void): void {
    if (!this.socket) {
      return;
    }

    if (callback) {
      this.socket.off(event, callback);
    } else {
      this.socket.off(event);
    }
  }

  // =====================================================
  // EMIT CUSTOM EVENT
  // =====================================================

  emit(event: string, payload?: any): void {
    this.socket?.emit(event, payload);
  }
}

export default new ChatSocket();
