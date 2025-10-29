'use client';
import { useState, useRef, useEffect } from "react";
import { Phone, Video, MoreVertical, Paperclip, Send, Smile, Info } from "lucide-react";

interface Conversation {
  id: string; // user_id
  name: string;
  avatar: string;
  online: boolean;
  type: 'patient' | 'doctor' | 'admin';
}

interface Message {
  id: string | number;
  senderId: string;
  recipientId: string;
  content: string;
  createdAt: string; // ISO string date
}

interface ChatWindowProps {
  conversation: Conversation | undefined;
  messages: Message[];
  onSendMessage: (content: string) => void;
  currentUserId: string;
}

export const ChatWindow = ({ conversation, messages, onSendMessage, currentUserId }: ChatWindowProps) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Info className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Chưa có cuộc trò chuyện nào</h3>
          <p className="mt-1 text-sm text-gray-500">Chọn một cuộc trò chuyện để bắt đầu nhắn tin.</p>
        </div>
      </div>
    );
  }

  const handleSend = () => {
    if (input.trim()) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between p-4 border-b bg-white">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img src={conversation.avatar} alt={conversation.name} className="w-12 h-12 rounded-full object-cover" />
            {conversation.online && <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-400 border-2 border-white"></span>}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{conversation.name}</p>
            <p className="text-sm text-gray-500">{conversation.online ? 'Đang hoạt động' : 'Ngoại tuyến'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-full hover:bg-gray-100 text-gray-500"><Phone size={20} /></button>
          <button className="p-2 rounded-full hover:bg-gray-100 text-gray-500"><Video size={20} /></button>
          <button className="p-2 rounded-full hover:bg-gray-100 text-gray-500"><MoreVertical size={20} /></button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-6 overflow-y-auto bg-gray-50 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-end gap-3 ${msg.senderId === currentUserId ? 'justify-end' : ''}`}
          >
            {msg.senderId !== currentUserId && (
              <img src={conversation.avatar} alt={conversation.name} className="w-8 h-8 rounded-full shrink-0" />
            )}
            <div
              className={`max-w-xl p-3 rounded-lg shadow-sm ${
                msg.senderId === currentUserId
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-white text-gray-800 rounded-bl-none border border-gray-200'
              }`}
            >
              <p className="text-sm">{msg.content}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Nhập tin nhắn..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 px-4 py-2 border rounded-full text-black bg-gray-100 focus:outline-none"
          />
          <button className="p-2 rounded-full hover:bg-gray-100 text-gray-500"><Smile /></button>
          <button className="p-2 rounded-full hover:bg-gray-100 text-gray-500"><Paperclip /></button>
          <button onClick={handleSend} className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-blue-300" disabled={!input.trim()}>
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};