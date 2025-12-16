'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useMessage, Conversation, Message } from '@/contexts/MessageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Send, MoreVertical, Trash2, Edit2, ChevronLeft, Minimize2 } from 'lucide-react';

interface ChatWindowProps {
  conversation: Conversation;
  onBack: () => void;
  onClose: () => void;
}

export function ChatWindow({ conversation, onBack }: ChatWindowProps) {
  const { 
    messages, 
    loadConversationMessages, 
    sendMessage, 
    markAsRead, 
    deleteMessage: deleteMessageAction,
    editMessage: editMessageAction,
    typingUsers,
    onlineUsers
  } = useMessage();
  const { user } = useAuth();
  const [messageContent, setMessageContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const [isTyping, setIsTyping] = useState(false);

  // Load messages on conversation change
  useEffect(() => {
    // Reset state for new conversation
    setCurrentPage(1);
    setHasMore(true);
    setLoading(true);

    loadConversationMessages(conversation.id, 1).then((result) => {
      setHasMore(result.hasMore);
      setLoading(false);
      markAsRead(conversation.id);
    });
  }, [conversation.id, loadConversationMessages, markAsRead]);

  // Auto-scroll to bottom
  useEffect(() => {
    // Only auto-scroll for new messages, not when loading more old messages
    if (currentPage === 1 && !loading) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
    }
  }, [messages.get(conversation.id), currentPage, loading]);

  const conversationMessages = messages.get(conversation.id) || [];

  const getOtherParticipant = () => {
    if (conversation?.participants?.length > 0) {
      return conversation.participants.find(p => p.user.user_id !== user?.user_id)?.user;
    }
    // Fallback for minimal chat objects from search results
    const otherId = (conversation as any).otherParticipantId;
    if (otherId) {
      return { user_id: otherId, Doctor: { full_name: (conversation as any).name } };
    }
    return null;
  };

  const getParticipantName = (participant: Record<string, unknown> | null) => {
    if (!participant) {
      return 'Unknown';
    }
    // Correctly access nested full_name for either Doctor or Patient
    const fullName = (participant.Doctor as { full_name: string })?.full_name || (participant.Patient as { full_name: string })?.full_name;
    return fullName || 'Unknown';
  };

  const handleSendMessage = async () => {
    if (!messageContent.trim()) return;

    if (editingId) {
      await editMessageAction(editingId, messageContent);
      setEditingId(null);
      setEditContent('');
    } else {
      await sendMessage(conversation.id, messageContent);
    }

    setMessageContent('');
    setIsTyping(false);
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (confirm('Are you sure you want to delete this message?')) {
      await deleteMessageAction(messageId);
    }
  };

  const handleEditMessage = (message: Message) => {
    setEditingId(message.id);
    setEditContent(message.content);
    setMessageContent(message.content);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleScroll = async () => {
    const container = messageContainerRef.current;
    if (container) {
      // Check if scrolled to the top
      if (container.scrollTop === 0 && !loadingMore && hasMore) {
        setLoadingMore(true);
        const nextPage = currentPage + 1;
        
        // Giữ vị trí cuộn hiện tại để tránh bị nhảy
        const oldScrollHeight = container.scrollHeight;

        const result = await loadConversationMessages(conversation.id, nextPage);
        
        setHasMore(result.hasMore);
        setCurrentPage(nextPage);
        
        // Sau khi tin nhắn mới được thêm vào, khôi phục vị trí cuộn
        requestAnimationFrame(() => {
          container.scrollTop = container.scrollHeight - oldScrollHeight;
        });

        setLoadingMore(false);
      }
    }
  };
  const otherUser = getOtherParticipant();
  const isOnline = otherUser ? onlineUsers.has(otherUser.user_id) : false;

  return (
    <div className="w-full h-[600px] flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b bg-linear-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h3 className="font-semibold text-lg">
              {getParticipantName(otherUser)}
            </h3>
            <p className="text-xs text-blue-100">
              {isOnline ? '🟢 Online' : '⚪ Offline'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-1.5 hover:bg-white/20 rounded-full transition-colors">
            <MoreVertical size={20} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={messageContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {loadingMore && <div className="text-center text-gray-500 text-sm">Loading more...</div>}
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Loading messages...</p>
          </div>
        ) : conversationMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          conversationMessages.map((message) => {
            const isSender = message.senderId === user?.user_id;
            const senderName = message.sender.Doctor?.full_name || message.sender.Patient?.full_name || 'Unknown';

            return (
              <div key={message.id} className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-xs lg:max-w-md group relative ${
                    isSender
                      ? 'bg-blue-600 text-white rounded-bl-lg'
                      : 'bg-gray-100 text-gray-900 rounded-br-lg'
                  } rounded-lg p-3`}
                >
                  {!isSender && (
                    <p className="text-xs font-semibold text-gray-600 mb-1">
                      {senderName}
                    </p>
                  )}
                  
                  {message.isDeleted ? (
                    <p className="text-sm italic opacity-60">[Message deleted]</p>
                  ) : (
                    <>
                      <p className="text-sm wrap-break-word">{message.content}</p>
                      {message.isEdited && (
                        <p className="text-xs opacity-75 mt-1">(edited)</p>
                      )}
                    </>
                  )}

                  {/* Message Actions */}
                  {isSender && !message.isDeleted && (
                    <div className="absolute right-0 top-0 translate-x-full ml-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                      {/* <button
                        onClick={() => handleEditMessage(message)}
                        className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={14} />
                      </button> */}
                      {/* <button
                        onClick={() => handleDeleteMessage(message.id)}
                        className="p-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button> */}
                    </div>
                  )}

                  <p className={`text-xs ${isSender ? 'text-blue-100' : 'text-gray-500'} mt-1`}>
                    {new Date(message.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            );
          })
        )}

        {/* Typing Indicator */}
        {Array.from(typingUsers.values()).some(
          (u) => u.chatRoomId === conversation.id && u.isTyping
        ) && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <div className="space-x-1">
              <span className="inline-block w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
              <span className="inline-block w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></span>
              <span className="inline-block w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></span>
            </div>
            Someone is typing...
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t">
        {editingId && (
          <div className="mb-2 p-2 bg-blue-50 rounded flex items-center justify-between">
            <p className="text-sm text-blue-900">Editing message...</p>
            <button
              onClick={() => {
                setEditingId(null);
                setEditContent('');
                setMessageContent('');
              }}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              Cancel
            </button>
          </div>
        )}
        <div className="flex gap-2">
          <textarea
            value={messageContent}
            onChange={(e) => {
              setMessageContent(e.target.value);
              setIsTyping(e.target.value.length > 0);
            }}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            rows={1}
            className="flex-1 p-3 border border-gray-200 rounded-lg resize-none text-black outline-none"
          />
          <button
            onClick={handleSendMessage}
            disabled={!messageContent.trim()}
            className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}