'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { apiClient } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Doctor } from '@/contexts/DoctorContext';
import { useMessage, Conversation, Message } from '@/contexts/MessageContext';
import { FloatingChatButton } from './FloatingChatButton'; 
import { ChatList } from './ChatList';
import { ChatWindow } from './ChatWindow';
import { AIChatWindow } from './AIChatWindow'; // <--- Import Component mới

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

export default function FloatingChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  
  // 1. Cập nhật State view để thêm 'ai-chat'
  const [view, setView] = useState<'list' | 'chat' | 'ai-chat'>('list'); 
  
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [unreadTotal, setUnreadTotal] = useState(0);
  const { user } = useAuth();
  const { conversations, loadConversations, createConversation } = useMessage();

  const [chatList, setChatList] = useState<Chat[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Chat[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Bot Chat Object
  const aiBotChat: Chat = {
    id: 'ai-chatbot',
    otherParticipantId: 'ai-chatbot',
    type: 'ai',
    name: 'MediBot AI',
    avatar: '',
    specialty: 'Trợ lý Y tế Thông minh',
    status: 'online',
    lastMessage: 'Tôi có thể giúp gì cho bạn?',
    lastTime: '',
    unread: 0,
    color: 'from-blue-500 to-cyan-400'
  };

  useEffect(() => {
    if (isOpen && user) {
      loadConversations();
    }
  }, [isOpen, user, loadConversations]);

  useEffect(() => {
    if (conversations) {
      const conversationsData: Chat[] = conversations
        .map(room => {
          let otherParticipant = room.participants.find(p => p.user.Doctor?.full_name !== user?.full_name);
          if (!otherParticipant && room.messages && room.messages.length > 0) {
            const recent = room.messages.find((m) => (m as Message).senderId && (m as Message).senderId !== user?.user_id) as Message | undefined;
            if (recent && recent.sender) {
              otherParticipant = ({ user: recent.sender } as unknown) as Conversation['participants'][number];
            }
          }

          if (!otherParticipant) return null;
          const profile = otherParticipant.user.Patient || otherParticipant.user.Doctor;
          const lastMessage = room.messages?.[0];
          const displayName = profile?.full_name || otherParticipant.user.user_id || room.name;
          return {
            id: room.id,
            otherParticipantId: otherParticipant.user.user_id,
            name: displayName,
            lastMessage: lastMessage?.content || 'Bắt đầu cuộc trò chuyện...',
            unread: 0, 
            lastTime: lastMessage?.createdAt || room.updatedAt,
            avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${displayName}`,
            type: (otherParticipant.user.role as 'doctor' | 'patient' | 'admin' | 'ai') || 'patient',
            specialty: (profile as any)?.title || 'Chuyên khoa',
            status: ('offline' as const),
            color: 'from-purple-500 to-purple-600'
          } as Chat;
        })
        .filter((c): c is Chat => c !== null);
      
      // Đưa Bot lên đầu
      setChatList([aiBotChat, ...conversationsData]);
    }
  }, [conversations, user?.user_id]);

  const displayList = useMemo(() => {
    if (!searchQuery) return chatList;
    const existingFiltered = chatList.filter(chat =>
      chat.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const newResultsFiltered = searchResults.filter(
      doctor => !chatList.some(chat => chat.id === doctor.id)
    );
    return [...existingFiltered, ...newResultsFiltered];
  }, [searchQuery, chatList, searchResults]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    if (query.length <= 2) {
      setIsSearching(false);
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    searchTimeoutRef.current = setTimeout(async () => {
      const res = await apiClient<any>(`/api/doctors?full_name=${query}`);
      if (res.status && res.data) {
        const data = Array.isArray(res.data) ? res.data : res.data.data || [];
        const doctorChats: Chat[] = (data as Doctor[]).map((doc: Doctor) => ({
          id: doc.user_id,
          otherParticipantId: doc.user_id,
          type: 'doctor' as const,
          name: doc.full_name || 'Bác sĩ không tên',
          avatar: doc.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${doc.full_name}`,
          specialty: (doc as any).specialty_name || 'Chuyên khoa',
          status: 'online' as const,
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
    }, 500);
  };

  const handleCreateConversation = async (recipient: Chat) => {
    try {
      const existingConversation = conversations.find(c =>
        c.participants.some(p => p.user.user_id === recipient.otherParticipantId)
      );
      if (existingConversation) {
        setSelectedConversation(existingConversation);
        setView('chat');
        return;
      }
      const newConversation = await createConversation(recipient.otherParticipantId);
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
    // 2. Logic điều hướng mới: Nếu là AI thì chuyển sang view AI
    if (chat.type === 'ai') {
      setView('ai-chat');
      return;
    }

    const existingConversation = conversations.find(c => c.id === chat.id);
    if (existingConversation) {
      setSelectedConversation(existingConversation);
    } else {
      handleCreateConversation(chat);
      return;
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

  if (!user) return null;

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        {isOpen && (
          <div className="mb-4 w-96 bg-white rounded-2xl shadow-2xl overflow-hidden animate-slide-up h-[500px] flex flex-col">
            {/* 3. Logic Render View */}
            {view === 'list' && (
              <ChatList 
                chatList={displayList} 
                onSelectChat={handleOpenChat} 
                onClose={() => setIsOpen(false)} 
                searchQuery={searchQuery}
                onSearch={handleSearch}
                searchResults={displayList}
                isSearching={isSearching}
                onCreateConversation={handleCreateConversation}
              />
            )}
            
            {view === 'chat' && selectedConversation && (
              <ChatWindow
                conversation={selectedConversation}
                onBack={handleBackToList}
                onClose={() => setIsOpen(false)}
              />
            )}

            {view === 'ai-chat' && (
              <AIChatWindow onBack={handleBackToList} />
            )}
          </div>
        )}

        {!isOpen && (
          <FloatingChatButton onClick={toggleWidget} unreadTotal={unreadTotal} />
        )}
      </div>

      <style jsx>{`
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up { animation: slide-up 0.3s ease-out; }
      `}</style>
    </>
  );
}