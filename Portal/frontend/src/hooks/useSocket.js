import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';

export function useSocket() {
  const { user } = useAuth();
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastNotification, setLastNotification] = useState(null);

  useEffect(() => {
    if (user) {
      socketRef.current = io(window.location.origin, {
        transports: ['websocket', 'polling'],
      });

      socketRef.current.on('connect', () => {
        setIsConnected(true);
        socketRef.current.emit('join', user.id);
      });

      socketRef.current.on('disconnect', () => {
        setIsConnected(false);
      });

      socketRef.current.on('notification', (notification) => {
        setLastNotification(notification);
      });

      return () => {
        socketRef.current?.disconnect();
      };
    }
  }, [user]);

  return { isConnected, lastNotification };
}
