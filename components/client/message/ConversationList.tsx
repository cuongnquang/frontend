'use client';

import React, { useState, useEffect } from 'react';
import { useMessage, Conversation, Message } from '@/contexts/MessageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Search, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';
import DoctorListForChat from './DoctorListForChat';

interface ConversationListProps {
  onSelectConversation: (conversation: Conversation) => void;
}

interface BookedDoctor {
  id: string;
  user_id: string;
  full_name: string;
  avatar_url?: string;
  specialty_name?: string;
  title?: string;
}

export default function ConversationList({ onSelectConversation }: ConversationListProps) {
  const { conversations, loadConversations, createConversation, searchConversations, unreadCounts, selectedConversation } = useMessage();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredConversations, setFilteredConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDoctorList, setShowDoctorList] = useState(false);
  const [creatingConversation, setCreatingConversation] = useState(false);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  useEffect(() => {
    // Sort by lastMessageAt (descending) to show most recent first
    const sorted = [...conversations].sort((a, b) => {
      const aTime = a.lastMessageAt || a.updatedAt || a.createdAt;
      const bTime = b.lastMessageAt || b.updatedAt || b.createdAt;
      return new Date(bTime).getTime() - new Date(aTime).getTime();
    });
    setFilteredConversations(sorted);
    setLoading(false);
  }, [conversations]);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      setLoading(true);
      const results = await searchConversations(query);
      setFilteredConversations(results);
      setLoading(false);
    } else {
      setFilteredConversations(conversations);
    }
  };

  type Participant = Conversation['participants'][number]['user'] | Message['sender'] | undefined;

  const getOtherParticipant = (conversation: Conversation) => {
    // Prefer using participants array; fallback to deriving from recent messages
    let other = conversation.participants.find((p) => p.user.Doctor?.full_name !== user?.full_name)?.user;
    if (!other && conversation.messages && conversation.messages.length > 0) {
      const recent = conversation.messages.find((m) => m.senderId && m.senderId !== user?.user_id);
      other = recent?.sender ?? other;
    }
    return other as Participant;
  };

  const getParticipantName = (participant: Participant) => {
    if (!participant) return 'Không rõ';
    const p = participant as { Doctor?: { full_name?: string }; Patient?: { full_name?: string }; full_name?: string };
    const name = p.Doctor?.full_name || p.Patient?.full_name || p.full_name;
    return name || 'Không rõ';
  };

  const getLastMessage = (conversation: Conversation) => {
    const lastMsg = conversation.messages?.[0];
    if (!lastMsg) return 'No messages yet';
    if (lastMsg.isDeleted) return '[Message deleted]';
    return lastMsg.content.substring(0, 50) + (lastMsg.content.length > 50 ? '...' : '');
  };

  const getLastMessageTime = (conversation: Conversation) => {
    const lastMsg = conversation.messages?.[0];
    const time = lastMsg?.createdAt || conversation.lastMessageAt || conversation.updatedAt || conversation.createdAt;
    if (!time) return '';
    const date = new Date(time);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleSelectDoctor = async (doctor: BookedDoctor) => {
    try {
      setCreatingConversation(true);
      // Use find-or-create API
      const res = await fetch('/api/chat/conversation/find-or-create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipientId: doctor.user_id,
        }),
      });

      if (!res.ok) throw new Error('Failed to create conversation');
      
      const data = await res.json();
      // Handle response: could be direct object or wrapped in data property
      const conversation = data.data || data;
      
      // Select the conversation
      onSelectConversation(conversation);
      setShowDoctorList(false);
    } catch (error) {
      console.error('Error creating conversation:', error);
    } finally {
      setCreatingConversation(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b">
        <h2 className="text-2xl font-bold mb-4">Messages</h2>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Doctor List Section */}
      <div className="border-b bg-gray-50">
        <button
          onClick={() => setShowDoctorList(!showDoctorList)}
          className="w-full p-4 flex items-center justify-between hover:bg-gray-100 transition-colors"
        >
          <h3 className="text-sm font-semibold text-gray-700">Bác sĩ đã đặt lịch</h3>
          {showDoctorList ? (
            <ChevronUp size={18} className="text-gray-400" />
          ) : (
            <ChevronDown size={18} className="text-gray-400" />
          )}
        </button>
        
        {showDoctorList && (
          <div className="max-h-64 overflow-y-auto border-t">
            <DoctorListForChat onSelectDoctor={handleSelectDoctor} />
          </div>
        )}
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-500">Loading...</div>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <MessageCircle size={48} className="mb-2" />
            <p>No conversations yet</p>
          </div>
        ) : (
          filteredConversations.map((conversation) => {
            const otherUser = getOtherParticipant(conversation);
            const unreadCount = unreadCounts.get(conversation.id) || 0;
            const isSelected = selectedConversation?.id === conversation.id;

            return (
              <button
                key={conversation.id}
                onClick={() => onSelectConversation(conversation)}
                className={`w-full p-3 border-b hover:bg-gray-50 transition-colors flex items-start gap-3 ${
                  isSelected ? 'bg-blue-50' : ''
                }`}
              >
                {/* Avatar - use actual avatar_url from participants */}
                <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
                  {otherUser?.Doctor?.avatar_url ? (
                    <img 
                      src={otherUser.Doctor.avatar_url} 
                      alt="Doctor"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      {getParticipantName(otherUser)?.[0]?.toUpperCase()}
                    </div>
                  )}
                  {otherUser?.Doctor && (otherUser.Doctor as any)?.Specialty?.name && (
                    <span className="text-xs text-blue-600 font-semibold text-center leading-tight max-w-[60px]">
                      {(otherUser.Doctor as any).Specialty.name}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm truncate">
                        {otherUser?.role === 'doctor' ? `Bác sĩ ${getParticipantName(otherUser)}` : getParticipantName(otherUser)}
                      </h3>
                    </div>
                    <div className="text-right flex flex-col items-end gap-1 flex-shrink-0">
                      <div className="text-xs text-gray-400">
                        {getLastMessageTime(conversation)}
                      </div>
                      {unreadCount > 0 && (
                        <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                          {unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 truncate mt-1">
                    {getLastMessage(conversation)}
                  </p>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
