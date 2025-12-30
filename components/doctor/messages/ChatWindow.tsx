'use client';
import { useState, useRef, useEffect } from "react";
import { Info, User, Calendar, Phone, X } from "lucide-react";
import { ChatHeader } from "./ChatHeader";
import { MessageInput } from "./MessageInput";
import { MessageBubble } from "./MessageBubble";
import { Conversation, Message } from "@/contexts/MessageContext";

interface ChatWindowProps {
  conversation: Conversation;
  messages: Message[];
  onSendMessage: (content: string) => void;
  currentUserId: string;
}

export default function ChatWindow({ conversation, messages, onSendMessage, currentUserId }: ChatWindowProps) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showInfo, setShowInfo] = useState(false);

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

  // Lấy thông tin người tham gia khác (bệnh nhân)
  const otherParticipant = conversation.participants?.find(p => p.user.user_id !== currentUserId)?.user;
  const patientInfo = otherParticipant?.Patient;
  const doctorInfo = otherParticipant?.Doctor;
  const displayName = patientInfo?.full_name || doctorInfo?.full_name || conversation.name;
  const displayAvatar = doctorInfo?.avatar_url || conversation.avatar;

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <ChatHeader conversation={conversation} onToggleInfo={() => setShowInfo(!showInfo)} />

      <div className="flex-1 flex overflow-hidden">
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Messages */}
          <div className="flex-1 p-4 md:p-6 overflow-y-auto bg-gray-50 space-y-4">
            {messages.map((msg, index) => {
              const senderId = msg.senderId || (msg as any).sender_id || (msg.sender as any)?.user_id || (msg.sender as any)?.id;
              const isMine = Boolean(senderId && currentUserId && String(senderId) === String(currentUserId));
              const senderAvatar = (msg.sender as any)?.avatar_url || (msg.sender as any)?.Doctor?.avatar_url || (msg.sender as any)?.Patient?.avatar_url || displayAvatar;

              return (
                <MessageBubble 
                  key={`${msg.id}-${index}`} 
                  msg={msg} 
                  avatar={!isMine ? senderAvatar : undefined}
                  isMine={isMine}
                />
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <MessageInput
            messageText={input}
            onTextChange={setInput}
            onSend={handleSend}
          />
        </div>

        {/* Patient Info Sidebar */}
        {showInfo && (
          <div className="w-80 border-l border-gray-200 bg-white p-6 overflow-y-auto hidden md:block animate-in slide-in-from-right duration-300">
            <div className="text-center mb-6">
              <img src={displayAvatar} alt={displayName} className="w-20 h-20 rounded-full mx-auto mb-3 object-cover ring-4 ring-gray-50" />
              <h3 className="font-bold text-lg text-gray-900">{displayName}</h3>
              <p className="text-sm text-indigo-600 font-medium">{otherParticipant?.role === 'patient' ? 'Bệnh nhân' : 'Bác sĩ'}</p>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider border-b pb-2">Thông tin cá nhân</h4>
              
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <User className="w-4 h-4 text-gray-400" />
                <span>ID: <span className="font-mono text-xs bg-gray-100 px-1 rounded">{otherParticipant?.user_id.substring(0, 8)}...</span></span>
              </div>
              
              {/* Bạn có thể thêm các trường khác nếu backend trả về (ví dụ: email, sđt) */}
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span>Tham gia: {new Date().toLocaleDateString('vi-VN')}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};