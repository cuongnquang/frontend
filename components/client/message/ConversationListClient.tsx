'use client';

import React, { useState, useEffect } from 'react';
import { useMessage, Conversation } from '@/contexts/MessageContext';
import { useAuth } from '@/contexts/AuthContext';
import { MessageSquare, Search } from 'lucide-react';

interface ConversationListProps {
  onSelectConversation: (conversation: Conversation) => void;
  selectedId?: string;
}

export function ConversationListClient({ onSelectConversation, selectedId }: ConversationListProps) {
  const { conversations, loadConversations, unreadCounts } = useMessage();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadConversations().then(() => setLoading(false));
  }, [loadConversations]);

  const filteredConversations = conversations.filter((conv) => {
    const otherParticipant = conv.participants?.find((p) => p.user.user_id !== user?.user_id)?.user;
    const name = otherParticipant?.Doctor?.full_name || otherParticipant?.Patient?.full_name || '';
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (loading) {
    return <div className="p-4 text-center text-gray-500">Đang tải cuộc trò chuyện...</div>;
  }

  return (
    <div className="w-full h-full flex flex-col">
      {/* Search */}
      <div className="p-4 border-b">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm cuộc trò chuyện..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <MessageSquare size={32} className="mx-auto mb-2 opacity-50" />
            <p>Chưa có cuộc trò chuyện nào</p>
          </div>
        ) : (
          filteredConversations.map((conversation) => {
            const otherParticipant = conversation.participants?.find((p) => p.user.user_id !== user?.user_id)?.user;
            const name = otherParticipant?.Doctor?.full_name || otherParticipant?.Patient?.full_name || 'Unknown';
            const avatar = otherParticipant?.Doctor?.avatar_url;
            const lastMessage = conversation.lastMessage;
            const unread = unreadCounts.get(conversation.id) || 0;
            const isSelected = conversation.id === selectedId;

            return (
              <div
                key={conversation.id}
                onClick={() => onSelectConversation(conversation)}
                className={`p-4 border-b cursor-pointer transition-colors ${
                  isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  {avatar ? (
                    <img src={avatar} alt={name} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                      {name.charAt(0).toUpperCase()}
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900 truncate">Bác sĩ {name}</h3>
                      <span className="text-xs text-gray-500 flex-shrink-0">
                        {lastMessage && new Date(lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                      {lastMessage
                        ? lastMessage.isDeleted
                          ? '[Tin nhắn đã bị xóa]'
                          : lastMessage.content
                        : 'Không có tin nhắn'}
                    </p>
                  </div>

                  {unread > 0 && (
                    <div className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0">
                      {unread > 99 ? '99+' : unread}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
