import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

import { SOCKET_URL } from '../shared/config';

export const SocketProvider = ({ children }) => {
  const { token, isAuthenticated } = useSelector((state) => state.auth);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      if (socket) {
        socket.disconnect();
        setTimeout(() => setSocket(null), 0);
      }
      return;
    }

    console.log('[Socket] Initializing connection to gateway...');
    const socketInstance = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket'],
      forceNew: true
    });

    socketInstance.on('connect', () => {
      console.log('[Socket] Connected successfully, id:', socketInstance.id);
    });

    socketInstance.on('connect_error', (err) => {
      console.warn('[Socket] Connection failed, retrying. Error:', err.message);
    });

    setTimeout(() => setSocket(socketInstance), 0);

    return () => {
      socketInstance.disconnect();
      console.log('[Socket] Connection cleaned up');
    };
  }, [isAuthenticated, token]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
export default SocketContext;
