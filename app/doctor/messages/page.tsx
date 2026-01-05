'use client';

import React, { useState, useEffect } from 'react';
import { useMessage, Conversation } from '@/contexts/MessageContext';
import { useAuth } from '@/contexts/AuthContext';
import { 
  MessageSquare, 
  Plus, 
  Search, 
  ArrowLeft,
} from 'lucide-react';

import { ChatWindow } from '@/components/client/message/ChatWindow'; 
import DoctorListForChat from '@/components/client/message/DoctorListForChat'; 

export default function DoctorMessagesPage() {
  const { conversations, loadConversations, unreadCounts } = useMessage();
  const { user } = useAuth();
  
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [viewMode, setViewMode] = useState<'conversations' | 'new_chat'>('conversations');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadConversations().then(() => setLoading(false));
    }
  }, [user, loadConversations]);

  const filteredConversations = conversations.filter(conv => {
    const other = getOtherParticipant(conv, user);
    const name = getParticipantName(other);
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  }).sort((a, b) => {
    const tA = new Date(a.lastMessageAt || a.updatedAt).getTime();
    const tB = new Date(b.lastMessageAt || b.updatedAt).getTime();
    return tB - tA;
  });

  const handleStartNewChat = async (doctor: any) => {
    // ... (Giữ nguyên logic cũ của bạn)
    try {
      const token = document.cookie.split('; ').find(row => row.startsWith('accessToken='))?.split('=')[1];
      const res = await fetch('/api/chat/conversations/find-or-create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ recipientId: doctor.user_id }),
      });
      const data = await res.json();
      const conversation = data.data || data;
      await loadConversations();
      setSelectedConversation(conversation);
      setViewMode('conversations');
    } catch (error) {
      console.error("Lỗi tạo cuộc trò chuyện", error);
    }
  };

  if (!user) return <div className="flex items-center justify-center h-screen bg-gray-50"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;

  return (
    <div className="flex h-[calc(100vh-64px)] bg-white overflow-hidden border-t border-gray-100">
      
      {/* --- SIDEBAR --- */}
      <div className={`
        w-full md:w-[360px] bg-white border-r border-gray-200 flex flex-col h-full z-10
        ${selectedConversation ? 'hidden md:flex' : 'flex'} 
      `}>
        
        {/* Header Sidebar */}
        <div className="px-4 py-3 border-b border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold text-gray-800 tracking-tight">
              {viewMode === 'new_chat' ? 'Tin nhắn mới' : 'Đoạn chat'}
            </h2>
            
            <button 
              onClick={() => setViewMode(viewMode === 'conversations' ? 'new_chat' : 'conversations')}
              className="p-2 bg-gray-100 text-gray-600 rounded-full hover:bg-blue-50 hover:text-blue-600 transition-all"
            >
              {viewMode === 'conversations' ? <Plus size={20} /> : <ArrowLeft size={20} />}
            </button>
          </div>

          {viewMode === 'conversations' && (
            <div className="relative group">
              <Search className="absolute left-3 top-2.5 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
              <input
                type="text"
                placeholder="Tìm kiếm trên Messenger..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-100 border-transparent border focus:bg-white focus:border-blue-500 rounded-full text-sm focus:outline-none transition-all"
              />
            </div>
          )}
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {viewMode === 'new_chat' ? (
            <div className="p-2">
              <p className="text-xs text-gray-500 uppercase font-bold px-4 py-3 tracking-wider">Gợi ý</p>
              <DoctorListForChat onSelectDoctor={handleStartNewChat} />
            </div>
          ) : (
            <div className="flex flex-col p-2 space-y-1">
              {loading ? (
                <p className="text-center text-gray-400 py-4 text-sm">Đang tải...</p>
              ) : filteredConversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                  <MessageSquare size={48} strokeWidth={1} className="mb-2 opacity-50"/>
                  <p className="text-sm">Chưa có tin nhắn nào</p>
                </div>
              ) : (
                filteredConversations.map(conv => {
                  const other = getOtherParticipant(conv, user);
                  const name = getParticipantName(other);
                  const avatar = other?.Doctor?.avatar_url;
                  const unread = unreadCounts.get(conv.id) || 0;
                  const isSelected = selectedConversation?.id === conv.id;
                  const lastMsg = conv.lastMessage?.content || "Bắt đầu cuộc trò chuyện...";

                  return (
                    <button
                      key={conv.id}
                      onClick={() => setSelectedConversation(conv)}
                      className={`
                        flex items-center gap-3 p-3 rounded-xl w-full text-left transition-all duration-200
                        ${isSelected ? 'bg-blue-50' : 'hover:bg-gray-100'}
                      `}
                    >
                      <div className="relative shrink-0">
                        {avatar ? (
                          <img src={avatar} alt={name} className="w-12 h-12 rounded-full object-cover shadow-sm" />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                            {name.charAt(0)}
                          </div>
                        )}
                        {/* Status dot (giả lập) */}
                        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline mb-0.5">
                          <h4 className={`font-semibold text-[15px] truncate pr-2 ${unread > 0 ? 'text-gray-900' : 'text-gray-700'}`}>
                            {other?.Doctor ? 'BS. ' : ''}{name}
                          </h4>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className={`text-[13px] truncate max-w-[180px] ${unread > 0 ? 'font-bold text-gray-900' : 'text-gray-500'}`}>
                            {conv.lastMessage?.isDeleted ? <span className="italic">Tin nhắn đã thu hồi</span> : lastMsg}
                          </p>
                          <span className="text-[11px] text-gray-400 shrink-0">
                            {conv.lastMessageAt ? new Date(conv.lastMessageAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}
                          </span>
                        </div>
                      </div>

                      {unread > 0 && (
                        <div className="w-2.5 h-2.5 bg-blue-600 rounded-full shrink-0"></div>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>

      {/* --- MAIN CHAT AREA --- */}
      <div className={`
        flex-1 flex flex-col h-full bg-white
        ${!selectedConversation ? 'hidden md:flex' : 'flex'}
      `}>
        {selectedConversation ? (
          <ChatWindow 
            conversation={selectedConversation} 
            onBack={() => setSelectedConversation(null)} 
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 bg-gray-50">
            <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
              <img src="/placeholder-chat.png" alt="" className="w-20 h-20 opacity-50 object-contain" onError={(e) => e.currentTarget.style.display='none'} />
              <MessageSquare size={64} className="text-blue-100" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Chào mừng bạn quay lại!</h3>
            <p className="text-gray-500">Chọn một cuộc hội thoại để bắt đầu nhắn tin.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Helpers giữ nguyên
function getOtherParticipant(conversation: Conversation, currentUser: any) {
  return conversation.participants?.find((p) => String(p.user.user_id) !== String(currentUser?.user_id))?.user;
}
function getParticipantName(participant: any) {
  if (!participant) return 'Người dùng';
  return participant.Doctor?.full_name || participant.Patient?.full_name || 'Người dùng';
}