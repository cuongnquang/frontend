import React from 'react';
import { ChevronLeft, Phone, Video, MoreVertical, Smile, Image, Paperclip, Send } from 'lucide-react';
import { Chat, Message } from './FloatingChatWidget';

interface ChatWindowProps {
  chat: Chat;
  messages: Message[];
  currentUserId: string;
  inputValue: string;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
  onBack: () => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

export const ChatWindow = ({
  chat,
  messages,
  currentUserId,
  inputValue,
  onInputChange,
  onSendMessage,
  onBack,
  messagesEndRef,
}: ChatWindowProps) => {

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[600px]">
      <div className="bg-linear-to-r from-blue-600 to-indigo-600 px-4 py-3 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button onClick={onBack} className="p-1.5 hover:bg-white/20 rounded-full transition-colors">
              <ChevronLeft size={20} />
            </button>
            <div className="text-2xl">{chat.avatar}</div>
            <div>
              <h3 className="font-bold text-sm">{chat.name}</h3>
              <p className="text-xs text-blue-100">{chat.specialty}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {chat.type === 'doctor' && (
              <>
                <button className="p-1.5 hover:bg-white/20 rounded-full transition-colors"><Phone size={18} /></button>
                <button className="p-1.5 hover:bg-white/20 rounded-full transition-colors"><Video size={18} /></button>
              </>
            )}
            <button className="p-1.5 hover:bg-white/20 rounded-full transition-colors"><MoreVertical size={18} /></button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        <div className="space-y-3">
          {messages.map((msg) => (
            <div key={msg.id}>
              {msg.senderId === currentUserId ? (
                <div className="flex justify-end">
                  <div className="max-w-[75%]">
                    <div className="bg-linear-to-br from-blue-500 to-blue-600 rounded-2xl rounded-br-sm px-3 py-2 shadow-sm">
                      <p className="text-sm text-white leading-relaxed">{msg.content}</p>
                    </div>
                    <span className="text-xs text-gray-500 mt-1 block text-right">{new Date(msg.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-2">
                  <div className="text-xl shrink-0">{chat.avatar}</div>
                  <div className="max-w-[75%]">
                    <div className="bg-white rounded-2xl rounded-tl-sm px-3 py-2 shadow-sm border border-gray-100">
                      <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-line">{msg.content}</p>
                    </div>
                    <span className="text-xs text-gray-500 mt-1 block">{new Date(msg.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="p-3 bg-white border-t border-gray-200">
        <div className="flex items-center gap-2 mb-2">
          <button className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"><Smile size={18} className="text-gray-500" /></button>
          <button className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"><Image size={18} className="text-gray-500" /></button>
          <button className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"><Paperclip size={18} className="text-gray-500" /></button>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Nhập tin nhắn..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-full text-sm te focus:outline-none text-black focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={onSendMessage}
            disabled={!inputValue.trim()}
            className="p-2.5 bg-linear-to-br from-blue-500 to-blue-600 text-white rounded-full hover:from-blue-600 hover:to-blue-700 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
