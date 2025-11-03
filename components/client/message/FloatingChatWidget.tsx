'use client';

import React, { useState, useEffect, useRef } from 'react';
import { socket } from '@/lib/socket';
import { apiClient } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Doctor } from '@/contexts/DoctorContext';
import { FloatingChatButton } from './FloatingChatButton';
import { ChatList } from './ChatList';
import { ChatWindow } from './ChatWindow';

export interface Chat {
  id: string;
  type: 'ai' | 'doctor';
  name: string;
  avatar: string;
  specialty: string;
  status: 'online' | 'offline';
  lastMessage: string;
  lastTime: string;
  unread: number;
  color: string;
}

export interface Message {
  id?: string | number; // ID có thể là từ DB hoặc tạm thời
  senderId: string;
  recipientId: string;
  content: string;
  createdAt: string;
}

export default function FloatingChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<'list' | 'chat'>('list');
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [message, setMessage] = useState('');
  const [unreadTotal, setUnreadTotal] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  const [chatList, setChatList] = useState<Chat[]>([]);
  const [messageHistory, setMessageHistory] = useState<Record<string, Message[]>>({});

  // Lấy danh sách cuộc trò chuyện từ API
  useEffect(() => {
    const fetchConversations = async () => {
      // TODO: Thay thế bằng API lấy danh sách cuộc trò chuyện thực tế
      // const response = await apiClient('/api/chat/conversations');
      // if (response.status && response.data) {
      //   setChatList(response.data);
      // }

      // Dùng tạm API lấy danh sách bác sĩ
      const res = await apiClient<Doctor[]>('/api/doctors');
      if (res.status && res.data) {
        const doctorChats: Chat[] = res.data.map((doc) => ({
          id: doc.user_id, // ID của cuộc trò chuyện là user_id của bác sĩ
          type: 'doctor',
          name: doc.full_name || 'Bác sĩ',
          avatar: '👨‍⚕️',
          specialty: doc.specialty_name || 'Chuyên khoa',
          status: 'online', // Cần logic để xác định status
          lastMessage: 'Bắt đầu cuộc trò chuyện...',
          lastTime: '',
          unread: 0,
          color: 'from-blue-500 to-indigo-600'
        }));
        setChatList(doctorChats);
      }
    };

    if (isOpen && user) {
      fetchConversations();
    }
  }, [isOpen, user]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Hàm trung tâm để xử lý tin nhắn mới
  const handleNewMessage = (newMessage: Message) => {
    const chatRoomId = newMessage.senderId === user?.user_id ? newMessage.recipientId : newMessage.senderId;

    // 1. Cập nhật lịch sử tin nhắn
    setMessageHistory((prevHistory) => {
      const currentMessages = prevHistory[chatRoomId] || [];
      // Tránh thêm tin nhắn trùng lặp (quan trọng cho optimistic UI)
      if (currentMessages.some(msg => msg.id === newMessage.id)) {
        return prevHistory;
      }
      return {
        ...prevHistory,
        [chatRoomId]: [...currentMessages, newMessage],
      };
    });

    // 2. Cập nhật và sắp xếp lại danh sách chat
    setChatList(prevChatList => {
      const chatIndex = prevChatList.findIndex(c => c.id === chatRoomId);
      if (chatIndex === -1) return prevChatList; // Bỏ qua nếu không tìm thấy chat

      const updatedChat = {
        ...prevChatList[chatIndex],
        lastMessage: newMessage.content,
        lastTime: newMessage.createdAt,
      };

      // Xóa chat cũ và đưa chat đã cập nhật lên đầu danh sách
      const newChatList = [
        updatedChat,
        ...prevChatList.slice(0, chatIndex),
        ...prevChatList.slice(chatIndex + 1)
      ];
      return newChatList;
    });
  };

  useEffect(() => {
    if (isOpen && selectedChat) {
      // Kết nối socket khi mở cửa sổ chat
      socket.connect();

      // Lắng nghe tin nhắn mới từ server và dùng hàm xử lý trung tâm
      socket.on('privateMessage', handleNewMessage);

      return () => {
        socket.off('privateMessage', handleNewMessage);
        socket.disconnect();
      };
    }
  }, [isOpen, selectedChat, user?.user_id]);

  useEffect(() => {
    scrollToBottom();
  }, [messageHistory, selectedChat]); // Cuộn khi messageHistory thay đổi

  const handleOpenChat = (chat: Chat) => {
    setSelectedChat(chat);
    if (chat.unread > 0) {
      setUnreadTotal(prev => prev - chat.unread);
      chat.unread = 0;
    }

    // Lấy lịch sử tin nhắn nếu chưa có
    if (!messageHistory[chat.id]) {
      // TODO: Gọi API lấy lịch sử tin nhắn
      // const res = await apiClient(`/api/chat/history/${chat.id}`);
      // if (res.status && res.data) {
      //   setMessageHistory(prev => ({ ...prev, [chat.id]: res.data }));
      // } else {
      //   // Khởi tạo mảng rỗng nếu không có lịch sử
      //   setMessageHistory(prev => ({ ...prev, [chat.id]: [] }));
      // }
    }

    setView('chat');
  };

  const handleBackToList = () => {
    setView('list');
    setSelectedChat(null);
  };

  const handleSendMessage = () => {
    if (message.trim() && selectedChat && user) {
      const newMessage: Message = {
        id: Date.now(), // Use a temporary ID
        senderId: user.user_id,
        recipientId: selectedChat.id,
        content: message,
        createdAt: new Date().toISOString(),
      };

      // Gửi tin nhắn lên server
      socket.emit('privateMessage', { recipientId: selectedChat.id, content: message });

      // Sử dụng hàm xử lý trung tâm để cập nhật UI ngay lập tức
      handleNewMessage(newMessage);
      setMessage('');
    }
  };

  const toggleWidget = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setView('list');
      setSelectedChat(null);
    }
  };

  if (!user) {
    return null; // Hoặc hiển thị nút đăng nhập
  }

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        {isOpen && (
          <div className="mb-4 w-96 bg-white rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
            {view === 'list' ? (
              <ChatList chatList={chatList} onSelectChat={handleOpenChat} onClose={() => setIsOpen(false)} />
            ) : selectedChat && (
              <ChatWindow
                chat={selectedChat}
                messages={messageHistory[selectedChat.id] || []}
                currentUserId={user.user_id}
                inputValue={message}
                onInputChange={setMessage}
                onSendMessage={handleSendMessage}
                onBack={handleBackToList}
                messagesEndRef={messagesEndRef}
              />
            )
            }
          </div>
        )}

        {/* Floating Button - Sẽ ẩn đi khi widget mở */}
        {!isOpen && (
          <FloatingChatButton onClick={toggleWidget} unreadTotal={unreadTotal} />
        )}
      </div>

      <style jsx>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
        
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}
