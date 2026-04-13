// src/components/GeminiAI/GeminiChat.js
import React, { useState, useRef, useEffect } from 'react';
import { FaRobot, FaPaperPlane, FaSpinner, FaMicrophone, FaStop, FaTrash, FaCopy, FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import './GeminiChat.css';

const GeminiChat = ({ user, userType }) => {
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: "Hello! I'm Doctor AI powered by Google Gemini. I can help you with health information, symptom analysis, medication questions, and wellness tips. How can I assist you today?", 
      sender: 'ai', 
      timestamp: new Date(),
      suggestions: ["What are my symptoms?", "Tell me about my medications", "Give me wellness tips"]
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const messagesEndRef = useRef(null);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';
      
      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
        // Auto-send after voice input
        setTimeout(() => handleSend(transcript), 100);
      };
      
      recognitionInstance.onend = () => {
        setIsListening(false);
      };
      
      setRecognition(recognitionInstance);
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async (customMessage = null) => {
    const messageToSend = customMessage || input;
    if (!messageToSend.trim()) return;
    
    // Add user message
    const userMessage = {
      id: Date.now(),
      text: messageToSend,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:5000/api/gemini/chat', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          message: messageToSend,
          context: { userType, userName: user?.name }
        })
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        const aiMessage = {
          id: Date.now() + 1,
          text: data.response,
          sender: 'ai',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (err) {
      console.error('Error:', err);
      const errorMessage = {
        id: Date.now() + 1,
        text: "I'm having trouble connecting to the AI service. Please try again later.",
        sender: 'ai',
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleSymptomAnalysis = async () => {
    setInput('I would like to analyze my symptoms');
    handleSend('I would like to analyze my symptoms');
  };

  const handleMedicationInfo = async () => {
    setInput('Tell me about my medications');
    handleSend('Tell me about my medications');
  };

  const handleWellnessTips = async () => {
    setInput('Give me personalized wellness tips');
    handleSend('Give me personalized wellness tips');
  };

  const startListening = () => {
    if (recognition) {
      recognition.start();
      setIsListening(true);
    }
  };

  const clearChat = () => {
    setMessages([messages[0]]);
  };

  const copyMessage = (text) => {
    navigator.clipboard.writeText(text);
    alert('Message copied to clipboard!');
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="gemini-chat-container">
      <div className="gemini-chat-header">
        <div className="header-info">
          <div className="ai-icon">
            <FaRobot />
            <span className="ai-status online"></span>
          </div>
          <div>
            <h2>Doctor AI Assistant</h2>
            <p>Powered by Google Gemini AI • Always here to help</p>
          </div>
        </div>
        <div className="header-actions">
          <button className="clear-chat" onClick={clearChat} title="Clear chat">
            <FaTrash />
          </button>
        </div>
      </div>

      <div className="gemini-chat-messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.sender}`}>
            <div className="message-avatar">
              {msg.sender === 'ai' ? <FaRobot /> : <div className="user-avatar">{user?.name?.charAt(0) || 'U'}</div>}
            </div>
            <div className={`message-bubble ${msg.isError ? 'error' : ''}`}>
              <div className="message-text">{msg.text}</div>
              {msg.suggestions && (
                <div className="suggestion-chips">
                  {msg.suggestions.map((suggestion, idx) => (
                    <button key={idx} className="suggestion-chip" onClick={() => handleSend(suggestion)}>
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
              <div className="message-footer">
                <span className="message-time">{formatTime(msg.timestamp)}</span>
                <div className="message-actions">
                  <button onClick={() => copyMessage(msg.text)} title="Copy"><FaCopy /></button>
                  <button title="Helpful"><FaThumbsUp /></button>
                  <button title="Not helpful"><FaThumbsDown /></button>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="message ai">
            <div className="message-avatar"><FaRobot /></div>
            <div className="message-bubble loading">
              <div className="typing-indicator">
                <span></span><span></span><span></span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="suggestions-bar">
        <button className="suggestion-btn" onClick={handleSymptomAnalysis}>
          🤔 Analyze Symptoms
        </button>
        <button className="suggestion-btn" onClick={handleMedicationInfo}>
          💊 Medication Info
        </button>
        <button className="suggestion-btn" onClick={handleWellnessTips}>
          🌿 Wellness Tips
        </button>
      </div>

      <div className="gemini-chat-input">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
          placeholder="Ask me about your health, symptoms, medications, or wellness..."
          rows="1"
        />
        <div className="input-actions">
          <button className={`voice-btn ${isListening ? 'listening' : ''}`} onClick={startListening} title="Voice input">
            <FaMicrophone />
          </button>
          <button className="send-btn" onClick={() => handleSend()} disabled={loading || !input.trim()}>
            {loading ? <FaSpinner className="spinning" /> : <FaPaperPlane />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GeminiChat;