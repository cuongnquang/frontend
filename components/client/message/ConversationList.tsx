'use client';

import React, { useState, useEffect } from 'react';
import { useMessage, Conversation, Message } from '@/contexts/MessageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Search, MessageCircle } from 'lucide-react';

interface ConversationListProps {
  onSelectConversation: (conversation: Conversation) => void;
}

export default function ConversationList({ onSelectConversation }: ConversationListProps) {
  const { conversations, loadConversations, searchConversations, unreadCounts, selectedConversation } = useMessage();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredConversations, setFilteredConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

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
                className={`w-full p-4 border-b hover:bg-gray-50 transition-colors flex items-start gap-3 ${
                  isSelected ? 'bg-blue-50' : ''
                }`}
              >
                {/* Avatar */}
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                  {getParticipantName(otherUser)?.[0]?.toUpperCase()}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-sm truncate">
                        {getParticipantName(otherUser)}
                      </h3>
                      <div className="ml-auto text-xs text-gray-400">
                        {getLastMessageTime(conversation)}
                      </div>
                      {unreadCount > 0 && (
                        <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full flex-shrink-0">
                          {unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 truncate mt-1">
                    {otherUser?.role === 'doctor' && otherUser.Doctor?.title
                      ? `${otherUser.Doctor.title}`
                      : otherUser?.role}
                  </p>
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
