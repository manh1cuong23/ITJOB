// src/socket.ts
import { io, Socket } from 'socket.io-client';

const SOCKET_SERVER_URL = 'http://localhost:3030'; // Thay bằng domain thật nếu có

let socket: Socket;

export const initSocket = (accessToken: string) => {
  socket = io(SOCKET_SERVER_URL, {
    auth: {
      access_token: accessToken,
    },
  });

  return socket;
};

export const getSocket = () => socket;
