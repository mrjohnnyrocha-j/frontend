// src/utils/useWebSocket.js

import { useEffect, useRef } from "react";
import io from "socket.io-client";

/**
 * Custom hook to manage WebSocket connections.
 * @param {function} onMessage - Callback function to handle incoming messages.
 * @returns {function} - Function to send messages.
 */
const useWebSocket = (onMessage) => {
  const socketRef = useRef(null);
  const serverUrl = process.env.REACT_APP_WEBSOCKET_SERVER_URL || "http://localhost:1717";

  useEffect(() => {
    socketRef.current = io(serverUrl);

    socketRef.current.on("connect", () => {
      console.log("Connected to WebSocket server");
    });

    socketRef.current.on("message", (data) => {
      if (onMessage) {
        onMessage(data);
      }
    });

    socketRef.current.on("connect_error", (err) => {
      console.error("WebSocket connection error:", err);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [serverUrl, onMessage]);

  /**
   * Sends a message through the WebSocket connection.
   * @param {any} message - The message to send.
   */
  const sendMessage = (message) => {
    if (socketRef.current) {
      socketRef.current.emit("message", message);
    }
  };

  return sendMessage;
};

export default useWebSocket;
