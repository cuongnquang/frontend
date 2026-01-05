'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useMessage, Conversation, Message } from '@/contexts/MessageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Send, MoreVertical, Trash2, Edit2, ChevronLeft } from 'lucide-react';

interface ChatWindowProps {
  conversation: Conversation;
  onBack: () => void;
}

export function ChatWindowNew({ conversation, onBack }: ChatWindowProps) {
  const {
    messages, // Map chứa toàn bộ tin nhắn
    loadConversationMessages,
    sendMessage,
    markAsRead,
    deleteMessage,
    editMessage,
    startTyping,
    stopTyping,
    typingUsers,
    onlineUsers,
    socket // Lấy socket để join room
  } = useMessage();

  const { user } = useAuth();
  const [messageContent, setMessageContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [messageMenuOpen, setMessageMenuOpen] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const typingDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Lấy tin nhắn của cuộc hội thoại hiện tại từ Context
  // Khi Context update (nhận tin mới), biến này tự thay đổi -> Component re-render
  const conversationMessages = messages.get(conversation.id) || [];

  // 1. Load lịch sử tin nhắn lần đầu
  useEffect(() => {
    if (conversation.id) {
        setLoading(true);
        loadConversationMessages(conversation.id).then(() => {
            setLoading(false);
            markAsRead(conversation.id);
            // Scroll xuống sau khi load xong
            setTimeout(scrollToBottom, 100);
        });
    }
  }, [conversation.id, loadConversationMessages, markAsRead]);

  // 2. Chỉ xử lý Join/Leave Room (Việc nhận tin nhắn do Context lo)
  useEffect(() => {
    if (!socket || !conversation.id) return;

    console.log(`🔌 Joining room: ${conversation.id}`);
    socket.emit('join_room', conversation.id);

    return () => {
      console.log(`🔌 Leaving room: ${conversation.id}`);
      socket.emit('leave_room', conversation.id);
    };
  }, [conversation.id, socket]);

  // 3. Tự động Scroll xuống khi có tin nhắn mới (từ Context)
  useEffect(() => {
    if (!loading && conversationMessages.length > 0) {
        scrollToBottom();
        // Đánh dấu đã đọc khi có tin mới và người dùng đang mở cửa sổ này
        markAsRead(conversation.id);
    }
  }, [conversationMessages.length, loading, conversation.id, markAsRead]);

  // Hàm helper scroll
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  };
  
  // 4. Cleanup typing khi unmount
  useEffect(() => {
    return () => {
      stopTyping(conversation.id);
      if (typingDebounceRef.current) clearTimeout(typingDebounceRef.current);
    };
  }, [conversation.id, stopTyping]);


  // --- Helper Functions UI ---
  const getOtherParticipant = () => {
    return conversation.participants?.find((p) => p.user.user_id !== user?.user_id)?.user;
  };

  const getParticipantName = (participant: any) => {
    return participant?.Doctor?.full_name || participant?.Patient?.full_name || 'Unknown';
  };

  const handleSendMessage = async () => {
    if (!messageContent.trim()) return;

    try {
      if (editingId) {
        await editMessage(editingId, messageContent);
        setEditingId(null);
      } else {
        await sendMessage(conversation.id, messageContent);
      }
      
      stopTyping(conversation.id);
      if (typingDebounceRef.current) clearTimeout(typingDebounceRef.current);
      setMessageContent('');
      setTimeout(scrollToBottom, 50);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // ... (Giữ nguyên các hàm handleDeleteMessage, handleEditMessage, render UI) ...
  // Phần Render UI giữ nguyên như cũ, chỉ thay đổi logic xử lý ở trên
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!confirm('Xác nhận xóa tin nhắn này?')) return;
    try {
        await deleteMessage(messageId);
        setMessageMenuOpen(null);
    } catch (error) {
        console.error(error);
    }
  };

  const handleEditMessage = (message: Message) => {
    setEditingId(message.id);
    setMessageContent(message.content);
    setMessageMenuOpen(null);
  };

  const otherUser = getOtherParticipant();
  const isOnline = otherUser ? onlineUsers.has(otherUser.user_id) : false;

  return (
    <div className="w-full h-[600px] flex flex-col bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-between shadow-md z-10">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-1.5 hover:bg-white/20 rounded-full transition-colors">
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-3">
             {/* Render Avatar/Name logic giữ nguyên */}
             <div>
              <h3 className="font-semibold text-base leading-tight">
                {otherUser?.Doctor ? 'BS. ' : ''}{getParticipantName(otherUser)}
              </h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-400' : 'bg-gray-400'}`}></span>
                <p className="text-xs text-blue-100 opacity-90">{isOnline ? 'Đang hoạt động' : 'Ngoại tuyến'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div ref={messageContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 scroll-smooth">
        {loading ? (
           <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : conversationMessages.length === 0 ? (
           <div className="flex flex-col items-center justify-center h-full text-gray-400 opacity-60">
            <Send size={48} className="mb-2" />
            <p>Bắt đầu cuộc trò chuyện ngay</p>
          </div>
        ) : (
          conversationMessages.map((message) => {
            const currentUserId = String(user?.user_id || '');
            const msgSenderId = String(message.senderId || '');
            const isSender = msgSenderId === currentUserId;
            
            // Render Message Bubble logic giữ nguyên
            const outerClass = `flex ${isSender ? 'justify-end' : 'justify-start'} items-end gap-2 group`;
            const bubbleClass = isSender
              ? 'bg-blue-600 text-white rounded-2xl rounded-tr-sm shadow-md'
              : 'bg-white text-gray-800 border border-gray-100 rounded-2xl rounded-tl-sm shadow-sm';

            return (
              <div key={message.id} className={outerClass}>
                 {/* Logic hiển thị Menu Edit/Delete giữ nguyên */}
                 {isSender && !message.isDeleted && (
                    <div className="relative opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setMessageMenuOpen(messageMenuOpen === message.id ? null : message.id)} className="p-1.5 hover:bg-gray-200 rounded-full">
                            <MoreVertical size={14} className="text-gray-400" />
                        </button>
                         {messageMenuOpen === message.id && (
                            <div className="absolute right-0 bottom-8 w-28 bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden">
                                <button onClick={() => handleEditMessage(message)} className="w-full px-3 py-2 text-left text-xs hover:bg-blue-50 flex items-center gap-2 text-blue-600 border-b border-gray-100"><Edit2 size={12} /> Sửa</button>
                                <button onClick={() => handleDeleteMessage(message.id)} className="w-full px-3 py-2 text-left text-xs hover:bg-red-50 flex items-center gap-2 text-red-600"><Trash2 size={12} /> Xóa</button>
                            </div>
                        )}
                    </div>
                 )}

                 <div className={`px-4 py-2.5 max-w-[75%] ${bubbleClass}`}>
                  {message.isDeleted ? (
                    <p className="text-sm italic opacity-60 text-gray-500 border-2 border-dashed border-gray-300 p-1 rounded bg-gray-50">Tin nhắn đã bị thu hồi</p>
                  ) : (
                    <>
                      <p className="text-[15px] leading-relaxed whitespace-pre-wrap break-words">{message.content}</p>
                      <div className={`flex items-center gap-1.5 mt-1 ${isSender ? 'justify-end' : 'justify-start'}`}>
                        <span className={`text-[10px] ${isSender ? 'text-blue-100' : 'text-gray-400'}`}>{new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        {message.isEdited && <span className={`text-[10px] italic ${isSender ? 'text-blue-200' : 'text-gray-300'}`}>đã sửa</span>}
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
        
        {/* Typing indicator giữ nguyên */}
         {Array.from(typingUsers.values())
          .filter((t) => t.chatRoomId === conversation.id && t.isTyping).length > 0 && (
          <div className="flex items-center gap-2 text-sm text-gray-500 ml-2 animate-pulse">
             <span className="text-xs">Đối phương đang nhập...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area giữ nguyên */}
      <div className="p-3 bg-white border-t border-gray-100">
          {/* ... Input Render ... */}
         <div className="flex items-end gap-2 bg-gray-100 p-1.5 rounded-3xl border border-transparent focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
          <textarea
            value={messageContent}
            onChange={(e) => {
              setMessageContent(e.target.value);
              if (e.target.value.trim()) {
                startTyping(conversation.id);
                if (typingDebounceRef.current) clearTimeout(typingDebounceRef.current);
                typingDebounceRef.current = setTimeout(() => stopTyping(conversation.id), 2000);
              } else {
                stopTyping(conversation.id);
              }
            }}
            onKeyDown={handleKeyPress}
            placeholder="Nhập tin nhắn..."
            rows={1}
            className="flex-1 max-h-32 px-4 py-2.5 bg-transparent border-none text-gray-800 placeholder-gray-500 focus:ring-0 resize-none text-sm scrollbar-hide"
            style={{ minHeight: '44px' }}
          />
          <button onClick={handleSendMessage} disabled={!messageContent.trim()} className="p-2.5 mb-0.5 mr-0.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 transition-all shadow-sm flex-shrink-0">
            <Send size={18} className={messageContent.trim() ? "translate-x-0.5" : ""} />
          </button>
        </div>
      </div>
    </div>
  );
}