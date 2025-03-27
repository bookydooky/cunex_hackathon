'use client';
import React, { useState } from 'react';
import { Send } from 'lucide-react';

const ChatPage = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hello! How can I help you today?', sender: 'bot' },
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const handleSendMessage = () => {
    if (inputMessage.trim() === '') return;

    const newMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user'
    };

    setMessages([...messages, newMessage]);
    setInputMessage('');

    // Simulate bot response
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: `You said: ${inputMessage}`,
        sender: 'bot'
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`flex ${
              message.sender === 'user' 
                ? 'justify-end' 
                : 'justify-start'
            }`}
          >
            <div 
              className={`
                max-w-[70%] p-3 rounded-lg 
                ${message.sender === 'user' 
                  ? 'bg-pink-200 text-gray-800' 
                  : 'bg-gray-200 text-gray-800'}
              `}
            >
              {message.text}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white border-t border-gray-200 p-4 flex items-center">
        <input 
          type="text" 
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Type a message..."
          className="
            flex-grow 
            p-2 
            border 
            border-gray-300 
            rounded-l-lg 
            focus:outline-none 
            focus:ring-2 
            focus:ring-pink-300
            text-black 
            placeholder:text-black
          "
        />
        <button 
          onClick={handleSendMessage}
          className="
            bg-pink-500 
            text-white 
            p-2 
            rounded-r-lg 
            hover:bg-pink-600 
            transition-colors 
            duration-200
          "
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatPage;