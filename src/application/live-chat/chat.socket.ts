/* eslint-disable @typescript-eslint/no-explicit-any */
import { io, Socket } from "socket.io-client";

// ======================================================
// SOCKET
// ======================================================

class ChatSocket {
  private socket: Socket | null = null;

  // =====================================================
  // CONNECT
  // =====================================================

  connect() {
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

  disconnect() {
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
  // JOIN ROOM
  // =====================================================

  joinRoom(conversation_generated_id: string) {
    this.socket?.emit("join_room", conversation_generated_id);
  }

  // =====================================================
  // LEAVE ROOM
  // =====================================================

  leaveRoom(conversation_generated_id: string) {
    this.socket?.emit("leave_room", conversation_generated_id);
  }

  // =====================================================
  // TYPING
  // =====================================================

  typing(conversation_generated_id: string) {
    this.socket?.emit("typing", conversation_generated_id);
  }

  // =====================================================
  // STOP TYPING
  // =====================================================

  stopTyping(conversation_generated_id: string) {
    this.socket?.emit("stop_typing", conversation_generated_id);
  }

  // =====================================================
  // ON
  // =====================================================

  on(event: string, callback: (...args: any[]) => void) {
    this.socket?.on(event, callback);
  }

  // =====================================================
  // OFF
  // =====================================================

  off(event: string, callback?: (...args: any[]) => void) {
    this.socket?.off(event, callback);
  }
}

export default new ChatSocket();
