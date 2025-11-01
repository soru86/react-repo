import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { BACKEND_BASE_URL } from '../config/api';
import io from 'socket.io-client';
import { useAuth } from "./AuthProvider";

const WebsocketContext = createContext();

export const WebsocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const { user, authData } = useAuth();

    useEffect(() => {
        const getSocket = () => {
            return io(BACKEND_BASE_URL, {
                transports: ['websocket'],
                reconnectionAttempts: 5,
                reconnectionDelay: 1000
            });
        };

        if (!socket && user && authData) {
            setSocket(() => getSocket());
        }

        socket?.on('connect', () => {
            console.log('Web socket connection established with server...');
        });
        socket?.on('disconnect', () => {
            console.log('Disconnected from server');
        });
        socket?.on('onError', (err) => {
            console.error('Connection error: ', err);
        });

        // Cleanup on unmount
        return () => {
            socket?.off('connect');
            socket?.off('disconnect');
            socket?.off('onError');
        };
    }, [user, authData]);

    const value = useMemo(() => ({
        socket
    }), [socket]);

    return <WebsocketContext.Provider value={value}>{children}</WebsocketContext.Provider>;
};

export const useSocketContext = () => {
    return useContext(WebsocketContext);
};