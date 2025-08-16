"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Container, Paper, TextField, Button, List, ListItem, ListItemText, Typography, Box, CircularProgress } from '@mui/material';
import { fetchEventSource } from '@microsoft/fetch-event-source';

const API_BASE_URL = 'http://localhost:8000';

const ChatPage = () => {
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleSend = async () => {
    if (!message.trim()) return;
    setIsSending(true);

    const userMessage = { role: 'user', content: message };
    // Add user message and a placeholder for AI's streaming response
    setHistory(prev => [...prev, userMessage, { role: 'ai', content: '' }]);
    setMessage('');

    try {
      await fetchEventSource(`${API_BASE_URL}/chat/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          history: history, // Send the history *before* the new user message
        }),
        
        onmessage(event) {
          if (event.event === 'end') {
            setIsSending(false);
            return;
          }
          if (event.event === 'error') {
             const errorData = JSON.parse(event.data);
             setHistory(prev => {
                const newHist = [...prev];
                newHist[newHist.length - 1].content = `Error: ${errorData.error}`;
                return newHist;
             });
             setIsSending(false);
             return;
          }

          const data = JSON.parse(event.data);
          const token = data.token;

          // Update the last message (the AI's placeholder) with the new token
          setHistory(prev => {
            const newHist = [...prev];
            newHist[newHist.length - 1].content += token;
            return newHist;
          });
        },
        
        onerror(err) {
          console.error("SSE Error:", err);
          setHistory(prev => {
            const newHist = [...prev];
            newHist[newHist.length - 1].content = "Sorry, a connection error occurred.";
            return newHist;
          });
          setIsSending(false);
          throw err; // Stop the request
        }
      });
    } catch (error) {
       console.error("Failed to start stream", error);
       setIsSending(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>Simple AI Chat (with SSE)</Typography>
      <Paper elevation={3} sx={{ height: '80vh', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
          <List>
            {history.map((msg, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={<Typography sx={{ whiteSpace: 'pre-wrap' }}>{msg.content}</Typography>}
                  secondary={msg.role === 'user' ? 'You' : 'AI'}
                  sx={{
                    textAlign: msg.role === 'user' ? 'right' : 'left',
                    '& .MuiListItemText-secondary': {
                      textAlign: msg.role === 'user' ? 'right' : 'left',
                    }
                  }}
                />
              </ListItem>
            ))}
            <div ref={messagesEndRef} />
          </List>
        </Box>
        <Box sx={{ p: 2, display: 'flex', gap: 1, borderTop: '1px solid #ddd' }}>
          <TextField 
            fullWidth 
            variant="outlined" 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !isSending && handleSend()}
            placeholder="Type your message..."
            disabled={isSending}
          />
          <Button variant="contained" onClick={handleSend} disabled={isSending}>
            {isSending ? <CircularProgress size={24} color="inherit" /> : 'Send'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default ChatPage;