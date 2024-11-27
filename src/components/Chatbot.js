import React, { useState, useEffect, useRef } from 'react';
import { CircularProgress, TextField, Button, Paper } from '@mui/material';
import io from 'socket.io-client';

const socket = io('http://localhost:5001', { transports: ['websocket'] });

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const chatWindowRef = useRef(null);

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    socket.on('message', (message) => {
      setTyping(false);
      setMessages((prevMessages) => [...prevMessages, { text: `Bot: ${message}`, sender: 'bot' }]);
      setLoading(false);
    });

    return () => {
      socket.off('message');
    };
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (input.trim()) {
      setMessages((prevMessages) => [...prevMessages, { text: `You: ${input}`, sender: 'user' }]);
      setLoading(true);
      setTyping(true);
      socket.emit('message', input);
      setInput('');
    }
  };

  return (
    <Paper elevation={3}>
      <div ref={chatWindowRef}>
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
        {typing && <div>Bot is typing...</div>}
        {loading && <CircularProgress size={24} />}
      </div>
      <form onSubmit={sendMessage}>
        <TextField
          label="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          fullWidth
        />
        <Button type="submit" variant="contained" color="primary" disabled={loading}>Send</Button>
      </form>
    </Paper>
  );
};

export default Chatbot;
