'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, Send } from 'lucide-react';


const ChatPage = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hello! How can I help you today?', sender: 'bot' },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const router = useRouter();

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
      {/* App Header */}
      <div className="sticky top-0 left-0 right-0 px-4 py-2 flex items-center justify-between bg-white z-1">
        <div className="flex items-center">
          <button
            onClick={() => router.back()}
            className="transition-transform transform active:scale-90"
          >
            <ArrowLeft className="mr-4 text-Pink hover:text-darkPink active:text-darkPink" />
          </button>
          <div className="flex items-center">
            <Image
              src="/assets/CUNEX-logo.png"
              alt="CUNEX Logo"
              width={48}
              height={48}
              className="h-12"
            />
            <div className="h-6 border-l border-gray-300 mx-5"></div>
            <div className="text-Pink text-xl font-medium">Create Job</div>
          </div>
        </div>
      </div>
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
            focus:border-Pink
            text-Gray
            placeholder:text-gray-500
          "
        />
        <button 
          onClick={handleSendMessage}
          className="
            bg-Pink
            text-white 
            p-2 
            h-full
            rounded-r-lg 
            hover:bg-darkPink
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