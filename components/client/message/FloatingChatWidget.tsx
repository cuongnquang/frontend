'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { socket } from '@/lib/socket';
import { apiClient } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Doctor } from '@/contexts/DoctorContext';
import { FloatingChatButton } from './FloatingChatButton'; // Assuming this component exists
import { ChatList } from './ChatList';
import { ChatWindow } from './ChatWindow';

export interface Chat {
  id: string;
  otherParticipantId: string;
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
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Chat[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Thêm AI bot vào danh sách chat
  const aiBotChat: Chat = {
    id: 'ai-chatbot',
    otherParticipantId: 'ai-chatbot',
    type: 'ai',
    name: 'MediBot AI',
    avatar: '🤖',
    specialty: 'Trợ lý Y tế Thông minh',
    status: 'online',
    lastMessage: 'Tôi có thể giúp gì cho bạn?',
    lastTime: '',
    unread: 0,
    color: 'from-blue-500 to-cyan-400'
  };
  // Lấy danh sách cuộc trò chuyện từ API
  useEffect(() => {
    const fetchConversations = async () => {
      const res = await apiClient<any[]>('/v1/chat/conversations');
      if (res.status && res.data) {
        const conversationsData: Chat[] = res.data.map(room => {
          const otherParticipant = room.participants[0];
          const profile = otherParticipant.user.Patient || otherParticipant.user.Doctor;
          const lastMessage = room.messages[0];
          return {
            id: room.id,
            otherParticipantId: otherParticipant.user_id,
            name: profile?.full_name || otherParticipant.user.email,
            lastMessage: lastMessage?.content || 'Bắt đầu cuộc trò chuyện...',
            unread: 0,
            lastTime: lastMessage?.created_at || new Date().toISOString(),
            avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${profile?.full_name || otherParticipant.user.email}`,
            online: false,
            type: otherParticipant.user.role,
            specialty: profile?.specialty?.name || 'Chuyên khoa',
            status: 'online',
            color: 'from-purple-500 to-purple-600'
          };
        });
        setChatList([aiBotChat, ...conversationsData]);
      }
    };

    if (isOpen && user) {
      fetchConversations();
    }
  }, [isOpen, user]);
  const handleSelectChat = (chat: Chat) => {
    setSelectedChat(chat);
    setView('chat');
  };
  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (query.length <= 2) {
      setIsSearching(false);
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    searchTimeoutRef.current = setTimeout(async () => {
      const res = await apiClient<any>(`/api/doctors?search=${query}`);
      if (res.status && res.data?.data) {
        const doctorChats: Chat[] = res.data.data.map((doc: Doctor) => ({
          id: doc.user_id,
          otherParticipantId: doc.user_id,
          type: 'doctor',
          name: doc.full_name || 'Bác sĩ không tên',
          avatar: doc.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${doc.full_name}`,
          specialty: doc.specialty?.name || 'Chuyên khoa',
          status: 'online',
          lastMessage: 'Bắt đầu cuộc trò chuyện...',
          lastTime: '',
          unread: 0,
          color: 'from-green-500 to-teal-500'
        }));
        setSearchResults(doctorChats);
      } else {
        setSearchResults([]);
      }
      setIsSearching(false);
    }, 500); // Debounce 500ms
  };

  const handleCreateConversation = async (recipientId: string) => {
    const res = await apiClient<any>('/v1/chat/conversations', {
      method: 'POST',
      body: JSON.stringify({ recipientId }),
    });

    if (res.status && res.data) {
      const newConversation = res.data;
      if (!chatList.some(c => c.id === newConversation.id)) {
        const otherParticipant = newConversation.participants.find(p => p.user_id !== user.user_id);
        const profile = otherParticipant.user.Patient || otherParticipant.user.Doctor;
        const newConvData: Chat = {
          id: newConversation.id,
          otherParticipantId: otherParticipant.user_id,
          name: profile?.full_name || otherParticipant.user.email,
          lastMessage: '',
          unread: 0,
          lastTime: new Date().toISOString(),
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${profile?.full_name || otherParticipant.user.email}`,
          online: false,
          type: otherParticipant.user.role,
          specialty: profile?.specialty?.name || 'Chuyên khoa',
          status: 'online',
          color: 'from-purple-500 to-purple-600'
        };
        setChatList(prev => [newConvData, ...prev]);
      }
      const otherParticipant = newConversation.participants.find(p => p.user_id !== user.user_id);
      const profile = otherParticipant.user.Patient || otherParticipant.user.Doctor;
      const chatToOpen: Chat = {
        id: newConversation.id,
        otherParticipantId: otherParticipant.user_id,
        name: profile?.full_name || otherParticipant.user.email,
        ...newConversation, // Spread the rest of the properties
      };
      setSelectedChat(chatToOpen);
      setView('chat');
      setIsSearching(false);
      setSearchQuery("");
      setSearchResults([]);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Hàm trung tâm để xử lý tin nhắn mới
  const handleNewMessage = useCallback((newMessage: Message) => {
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
  }, [user?.user_id]);

  useEffect(() => {
    if (isOpen && selectedChat) {
      // Kết nối socket khi mở cửa sổ chat
      socket.connect();

      // Lắng nghe tin nhắn mới từ server và dùng hàm xử lý trung tâm
      socket.on('message', handleNewMessage);

      return () => {
        socket.off('privateMessage', handleNewMessage);
        socket.disconnect();
      };
    }
  }, [isOpen, selectedChat, user?.user_id, handleNewMessage]);

  useEffect(() => {
    scrollToBottom();
  }, [messageHistory, selectedChat]);

  const handleOpenChat = (chat: Chat) => {
    setSelectedChat(chat);
    if (chat.unread > 0) {
      setUnreadTotal(prev => prev - chat.unread);
      chat.unread = 0;
    }    

    // Lấy lịch sử tin nhắn nếu chưa có
    if (!messageHistory[chat.id]) {
      const fetchHistory = async () => {
        const res = await apiClient<Message[]>(`/v1/chat/history/${chat.id}`);
      if (res.status && res.data) {
        setMessageHistory(prev => ({ ...prev, [chat.id]: res.data }));
      } else {
        // Khởi tạo mảng rỗng nếu không có lịch sử
        setMessageHistory(prev => ({ ...prev, [chat.id]: [] }));
      }
    }
      fetchHistory();
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
      socket.emit('message', { recipientId: selectedChat.id, content: message });

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
              <ChatList 
                chatList={chatList} 
                onSelectChat={handleOpenChat} 
                onClose={() => setIsOpen(false)} 
                searchQuery={searchQuery}
                onSearch={handleSearch}
                searchResults={searchResults}
                isSearching={isSearching}
                onCreateConversation={handleCreateConversation}
              />
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
          translateY(-5px);
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
