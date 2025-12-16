'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { apiClient } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Doctor } from '@/contexts/DoctorContext';
import { useMessage, Conversation } from '@/contexts/MessageContext';
import { FloatingChatButton } from './FloatingChatButton'; // Assuming this component exists
import { ChatList } from './ChatList';
import { ChatWindow } from './ChatWindow';

export interface Chat {
  id: string;
  otherParticipantId: string;
  type: 'ai' | 'doctor' | 'patient' | 'admin';
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
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [unreadTotal, setUnreadTotal] = useState(0);
  const { user } = useAuth();
  const { conversations, loadConversations, createConversation } = useMessage();

  const [chatList, setChatList] = useState<Chat[]>([]);
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
    if (isOpen && user) {
      loadConversations();
    }
  }, [isOpen, user, loadConversations]);

  useEffect(() => {
    if (conversations) {
      const conversationsData: Chat[] = conversations
        .map(room => {
          const otherParticipant = room.participants.find(p => p.user.user_id !== user?.user_id);
          if (!otherParticipant) return null; // Should not happen in a 1-on-1 chat
          const profile = otherParticipant.user.Patient || otherParticipant.user.Doctor;
          const lastMessage = room.messages?.[0];
          const displayName = profile?.full_name || otherParticipant.user.user_id;
          return {
            id: room.id,
            otherParticipantId: otherParticipant.user.user_id,
            name: displayName,
            lastMessage: lastMessage?.content || 'Bắt đầu cuộc trò chuyện...',
            unread: 0, // This should come from context later
            lastTime: lastMessage?.createdAt || room.updatedAt,
            avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${displayName}`,
            type: (otherParticipant.user.role as 'doctor' | 'patient' | 'admin') || 'patient',
            specialty: profile?.title || 'Chuyên khoa',
            status: 'offline' as const, // This should come from context later
            color: 'from-purple-500 to-purple-600'
          };
        })
        .filter((c): c is Chat => c !== null);
      setChatList([aiBotChat, ...conversationsData]);
    }
  }, [conversations, user?.user_id]);

  // Gộp và lọc danh sách để hiển thị trong ChatList
  const displayList = useMemo(() => {
    if (!searchQuery) {
      return chatList; // Nếu không tìm kiếm, hiển thị danh sách chat gốc
    }

    // 1. Lọc các cuộc trò chuyện hiện có
    const existingFiltered = chatList.filter(chat =>
      chat.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // 2. Lọc kết quả tìm kiếm mới, loại bỏ những ai đã có trong danh sách chat
    const newResultsFiltered = searchResults.filter(
      doctor => !chatList.some(chat => chat.id === doctor.id)
    );

    // 3. Gộp lại, các cuộc trò chuyện cũ lên trước
    return [...existingFiltered, ...newResultsFiltered];
  }, [searchQuery, chatList, searchResults]);
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
      const res = await apiClient<Doctor>(`/api/doctors?search=${query}`);
      if (res.status && res.data?.data) {
        const doctorChats: Chat[] = res.data.data.map((doc: Doctor) => ({
          id: doc.user_id,
          otherParticipantId: doc.user_id,
          type: 'doctor',
          name: doc.full_name || 'Bác sĩ không tên',
          avatar: doc.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${doc.full_name}`,
          specialty: doc.specialty_name|| 'Chuyên khoa',
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

  const handleCreateConversation = async (recipient: Chat) => {
    try {
      // Check if a conversation with this recipient already exists
      const existingConversation = conversations.find(c =>
        c.participants.some(p => p.user.user_id === recipient.otherParticipantId)
      );

      if (existingConversation) {
        console.log('[FloatingChatWidget] Conversation already exists. Selecting it.');
        setSelectedConversation(existingConversation);
        setView('chat');
        return;
      }

      console.log('[FloatingChatWidget] Creating new conversation with recipient:', recipient.otherParticipantId);
      // Use the createConversation function from the context
      // This function handles API call, state update, and returns the new conversation
      const newConversation = await createConversation(recipient.otherParticipantId);

      console.log(
        '[FloatingChatWidget] Backend confirmed creation. Setting selected conversation:',
        newConversation.id
      );
      // The context already added the conversation to the list,
      // so the UI will update automatically via the useEffect hook.
      // We just need to select it.
      setSelectedConversation(newConversation);

      setIsSearching(false);
      setSearchQuery("");
      setSearchResults([]);
      setView('chat');

    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  };

  const handleOpenChat = (chat: Chat) => {
    // If the chat is from existing conversations, find the full object
    const existingConversation = conversations.find(c => c.id === chat.id);

    if (existingConversation) {
      setSelectedConversation(existingConversation);
    } else {
      // If it's a new chat from search results, trigger the creation flow.
      // This ensures we always have a backend-confirmed conversation.
      handleCreateConversation(chat);
      return; // handleCreateConversation will set the view and selection
    }

    setView('chat');
  };

  const handleBackToList = () => {
    setView('list');
    setSelectedConversation(null);
  };

  const toggleWidget = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setView('list');
      setSelectedConversation(null);
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
                chatList={displayList} 
                onSelectChat={handleOpenChat} 
                onClose={() => setIsOpen(false)} 
                searchQuery={searchQuery}
                onSearch={handleSearch}
                searchResults={displayList} // Truyền danh sách đã được lọc
                isSearching={isSearching}
                onCreateConversation={handleCreateConversation}
              />
            ) : selectedConversation && (
              <ChatWindow
                conversation={selectedConversation}
                onBack={handleBackToList}
                onClose={() => setIsOpen(false)}
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
