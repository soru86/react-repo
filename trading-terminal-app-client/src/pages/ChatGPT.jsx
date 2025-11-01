import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Settings, Key, MessageSquare } from 'lucide-react';

const ChatGPT = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: 'Hello! I\'m your AI trading assistant. I can help you with market analysis, trading strategies, and portfolio insights. How can I assist you today?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [isApiKeySet, setIsApiKeySet] = useState(false);
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !isApiKeySet) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are an expert trading assistant. Provide helpful insights about markets, trading strategies, risk management, and portfolio optimization. Keep responses concise and actionable.'
            },
            {
              role: 'user',
              content: inputMessage
            }
          ],
          max_tokens: 500,
          temperature: 0.7
        })
      });

      const data = await response.json();

      if (data.choices && data.choices[0]) {
        const botMessage = {
          id: Date.now() + 1,
          type: 'bot',
          content: data.choices[0].message.content,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        throw new Error('Invalid response from API');
      }
    } catch (error) {
      console.error('Error calling ChatGPT API:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: 'Sorry, I encountered an error. Please check your API key and try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleApiKeySubmit = () => {
    if (apiKey.trim()) {
      setIsApiKeySet(true);
      setShowApiKeyInput(false);
      // Store API key in localStorage (consider encryption for production)
      localStorage.setItem('chatgpt_api_key', apiKey);
    }
  };

  useEffect(() => {
    const savedApiKey = localStorage.getItem('chatgpt_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
      setIsApiKeySet(true);
    }
  }, []);

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
      color: '#e2e8f0'
    }}>
      {/* Header */}
      <div style={{
        padding: '20px 24px',
        borderBottom: '1px solid #334155',
        background: 'rgba(30, 41, 59, 0.8)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #10a37f 0%, #059669 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(16, 163, 127, 0.3)'
          }}>
            <Bot size={20} color="#ffffff" />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: '#f1f5f9' }}>
              AI Trading Assistant
            </h1>
            <p style={{ margin: 0, fontSize: '14px', color: '#94a3b8' }}>
              Powered by ChatGPT
            </p>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          {!isApiKeySet && (
            <button
              onClick={() => setShowApiKeyInput(true)}
              style={{
                padding: '8px 16px',
                background: 'linear-gradient(135deg, #10a37f 0%, #059669 100%)',
                border: 'none',
                borderRadius: '8px',
                color: '#ffffff',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Key size={16} />
              Set API Key
            </button>
          )}
          <button
            onClick={() => setShowApiKeyInput(!showApiKeyInput)}
            style={{
              padding: '8px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid #334155',
              borderRadius: '8px',
              color: '#94a3b8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Settings size={16} />
          </button>
        </div>
      </div>

      {/* API Key Input */}
      {showApiKeyInput && (
        <div style={{
          padding: '16px 24px',
          background: 'rgba(16, 163, 127, 0.1)',
          borderBottom: '1px solid #334155',
          display: 'flex',
          gap: '12px',
          alignItems: 'center'
        }}>
          <input
            type="password"
            placeholder="Enter your OpenAI API key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            style={{
              flex: 1,
              padding: '8px 12px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid #334155',
              borderRadius: '6px',
              color: '#ffffff',
              fontSize: '14px',
              outline: 'none'
            }}
          />
          <button
            onClick={handleApiKeySubmit}
            style={{
              padding: '8px 16px',
              background: 'linear-gradient(135deg, #10a37f 0%, #059669 100%)',
              border: 'none',
              borderRadius: '6px',
              color: '#ffffff',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            Save
          </button>
        </div>
      )}

      {/* Messages Container */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '20px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        {messages.map((message) => (
          <div
            key={message.id}
            style={{
              display: 'flex',
              gap: '12px',
              alignItems: 'flex-start',
              opacity: message.type === 'bot' ? 1 : 0.9
            }}
          >
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: message.type === 'bot' 
                ? 'linear-gradient(135deg, #10a37f 0%, #059669 100%)'
                : 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              {message.type === 'bot' ? (
                <Bot size={16} color="#ffffff" />
              ) : (
                <User size={16} color="#ffffff" />
              )}
            </div>
            
            <div style={{
              flex: 1,
              background: message.type === 'bot' 
                ? 'rgba(16, 163, 127, 0.1)'
                : 'rgba(59, 130, 246, 0.1)',
              border: `1px solid ${message.type === 'bot' ? '#10a37f' : '#3b82f6'}`,
              borderRadius: '12px',
              padding: '12px 16px',
              maxWidth: '80%'
            }}>
              <div style={{
                fontSize: '14px',
                lineHeight: '1.5',
                color: '#e2e8f0',
                whiteSpace: 'pre-wrap'
              }}>
                {message.content}
              </div>
              <div style={{
                fontSize: '12px',
                color: '#64748b',
                marginTop: '8px',
                textAlign: 'right'
              }}>
                {formatTime(message.timestamp)}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div style={{
            display: 'flex',
            gap: '12px',
            alignItems: 'flex-start'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #10a37f 0%, #059669 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Bot size={16} color="#ffffff" />
            </div>
            <div style={{
              background: 'rgba(16, 163, 127, 0.1)',
              border: '1px solid #10a37f',
              borderRadius: '12px',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <div style={{
                width: '16px',
                height: '16px',
                border: '2px solid #10a37f',
                borderTop: '2px solid transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
              <span style={{ fontSize: '14px', color: '#94a3b8' }}>
                AI is thinking...
              </span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div style={{
        padding: '20px 24px',
        borderTop: '1px solid #334155',
        background: 'rgba(30, 41, 59, 0.8)',
        backdropFilter: 'blur(10px)'
      }}>
        {!isApiKeySet ? (
          <div style={{
            textAlign: 'center',
            padding: '20px',
            background: 'rgba(16, 163, 127, 0.1)',
            border: '1px solid #10a37f',
            borderRadius: '12px',
            color: '#94a3b8'
          }}>
            <Key size={24} style={{ marginBottom: '8px' }} />
            <p style={{ margin: '0 0 12px 0', fontSize: '14px' }}>
              Please set your OpenAI API key to start chatting
            </p>
            <button
              onClick={() => setShowApiKeyInput(true)}
              style={{
                padding: '8px 16px',
                background: 'linear-gradient(135deg, #10a37f 0%, #059669 100%)',
                border: 'none',
                borderRadius: '6px',
                color: '#ffffff',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              Set API Key
            </button>
          </div>
        ) : (
          <div style={{
            display: 'flex',
            gap: '12px',
            alignItems: 'flex-end'
          }}>
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about trading strategies, market analysis, or portfolio insights..."
              style={{
                flex: 1,
                minHeight: '44px',
                maxHeight: '120px',
                padding: '12px 16px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid #334155',
                borderRadius: '12px',
                color: '#ffffff',
                fontSize: '14px',
                outline: 'none',
                resize: 'none',
                fontFamily: 'inherit'
              }}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              style={{
                width: '44px',
                height: '44px',
                background: inputMessage.trim() && !isLoading
                  ? 'linear-gradient(135deg, #10a37f 0%, #059669 100%)'
                  : 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                borderRadius: '12px',
                color: '#ffffff',
                cursor: inputMessage.trim() && !isLoading ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease'
              }}
            >
              <Send size={18} />
            </button>
          </div>
        )}
      </div>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default ChatGPT; 