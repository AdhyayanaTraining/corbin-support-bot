// faq.socket.ts

import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocketClient = (): Socket => {
  if (!socket) {
    socket = io(process.env.SERVER_URL!, {
      transports: ["websocket"],
      autoConnect: true,
    });
  }

  return socket;
};
