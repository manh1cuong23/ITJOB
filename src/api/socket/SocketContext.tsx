// src/context/SocketContext.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { io, Socket } from 'socket.io-client';
import { initSocket } from './socket';

interface SocketContextType {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextType>({ socket: null });

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({
  children,
  accessToken,
}: {
  children: React.ReactNode;
  accessToken: string;
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const socketRef = useRef<Socket | null>(null);
  useEffect(() => {
    if (!accessToken) return;

    const socket = io('http://localhost:3030', {
      auth: {
        access_token: accessToken,
      },
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setSocket(socket);
      console.log('✅ Connected to socket:', socket.id);
    });

    socket.on('connect_error', err => {
      console.error('❌ Socket connect error:', err.message);
    });

    return () => {
      socket.disconnect();
    };
  }, [accessToken]);
  useEffect(() => {
    console.log('check socket after socket created:', socket);
  }, [socket]);
  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
