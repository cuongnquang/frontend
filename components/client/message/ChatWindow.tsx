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
    onlineUsers,
    startTyping,
    stopTyping
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
  const typingDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  // stop typing when unmounting or when conversation changes
  useEffect(() => {
    return () => {
      stopTyping(conversation.id);
      if (typingDebounceRef.current) clearTimeout(typingDebounceRef.current);
    };
  }, [conversation.id, stopTyping]);

  // Auto-scroll to bottom on new messages (and after sending)
  const prevCountRef = useRef<number>(0);

  const conversationMessages = messages.get(conversation.id) || [];

  useEffect(() => {
    const prev = prevCountRef.current;
    const curr = conversationMessages.length;

    // Only auto-scroll if we're on the first page (not paginating older messages)
    // or if we've just added a message (curr > prev)
    if (currentPage === 1 && !loading && curr >= prev) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }

    prevCountRef.current = curr;
  }, [conversationMessages.length, currentPage, loading]);

  // Ensure scroll to bottom immediately after send for better UX
  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });

  const getOtherParticipant = () => {
    if (conversation?.participants?.length > 0) {
      return conversation.participants.find(p => p.user.Doctor?.full_name !== user?.full_name)?.user;
    }
    // Fallback for minimal chat objects from search results
    const otherId = (conversation as unknown as { otherParticipantId?: string })?.otherParticipantId;
    if (otherId) {
      return { user_id: otherId, Doctor: { full_name: (conversation as unknown as { name?: string }).name || 'User' } };
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

    // Ensure other users see that typing has stopped
    stopTyping(conversation.id);
    if (typingDebounceRef.current) clearTimeout(typingDebounceRef.current);

    setMessageContent('');
    setIsTyping(false);

    // Immediately scroll to the bottom to reveal the sent message
    scrollToBottom();
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
          conversationMessages.map((message, idx) => {
            // Robust sender detection: prefer message.senderId, fall back to nested sender.user_id
            const msg = message as any;
            const senderId = msg.senderId || msg.sender_id || (msg.sender?.user_id) || (msg.sender?.id);
            const messageSenderId = String(senderId || '');
            const currentUserId = String(user?.user_id || (user as any)?.id || '');
            const isSender = messageSenderId === currentUserId;
            let senderName = 'Unknown';
            if (message.sender) {
              const senderObj = message.sender as { Doctor?: { full_name?: string }; Patient?: { full_name?: string }; full_name?: string };
              senderName = senderObj.Doctor?.full_name || senderObj.Patient?.full_name || senderObj.full_name || senderName;
            } else if (messageSenderId && !isSender) {
              const p = conversation.participants?.find((pp) => String(pp.user.user_id) === messageSenderId)?.user as { Doctor?: { full_name?: string }; Patient?: { full_name?: string }; full_name?: string } | undefined;
              senderName = p ? (p.Doctor?.full_name || p.Patient?.full_name || p.full_name || senderName) : senderName;
            }
            const prev = conversationMessages[idx - 1];
            const prevSenderId = prev ? String(prev.senderId || (prev.sender?.user_id) || '') : null;
            const showSenderName = !isSender && (!prev || prevSenderId !== messageSenderId);

            // layout helpers
            const outerClass = `flex ${isSender ? 'justify-end' : 'justify-start'} items-end`;
            const bubbleBase = 'max-w-[70%] group relative rounded-lg p-3';
            const bubbleVariant = isSender
              ? 'bg-blue-600 text-white ml-4 mr-2 rounded-tr-lg rounded-bl-lg'
              : 'bg-gray-100 text-gray-900 mr-4 ml-2 rounded-tl-lg rounded-br-lg';

            return (
              <div key={message.id} className={outerClass}>
                <div className={`${bubbleBase} ${bubbleVariant}`}>
                  {!isSender && showSenderName && (
                    <p className="text-xs font-semibold text-gray-600 mb-1">
                      {senderName}
                    </p>
                  )}

                  {message.isDeleted ? (
                    <p className="text-sm italic opacity-60">[Message deleted]</p>
                  ) : (
                    <>
                      <p className="text-sm break-words">{message.content}</p>
                      {message.isEdited && (
                        <p className="text-xs opacity-75 mt-1">(edited)</p>
                      )}
                    </>
                  )}

                  {/* Message Actions */}
                  {isSender && !message.isDeleted && (
                    <div className="absolute -left-6 top-0 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                      {/* actions */}
                    </div>
                  )}

                  <p className={`text-xs ${isSender ? 'text-blue-100' : 'text-gray-500'} mt-1 text-right`}> 
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
        {
          (() => {
            const typers = Array.from(typingUsers.entries())
              .filter(([uid, u]) => u.chatRoomId === conversation.id && u.isTyping)
              .map(([uid]) => {
                const participantUser = conversation.participants?.find(p => p.user.user_id === uid)?.user || null;
                return getParticipantName(participantUser as Record<string, unknown> | null);
              });

            if (typers.length === 0) return null;

            const label = `${typers.slice(0, 2).join(', ')}${typers.length > 2 ? ` and ${typers.length - 2} more` : ''} ${typers.length > 1 ? 'are' : 'is'} typing...`;

            return (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <div className="space-x-1">
                  <span className="inline-block w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                  <span className="inline-block w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                  <span className="inline-block w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></span>
                </div>
                {label}
              </div>
            );
          })()
        }

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
              const val = e.target.value;
              setMessageContent(val);
              setIsTyping(val.length > 0);

              // Auto resize
              try {
                const ta = e.target as HTMLTextAreaElement;
                ta.style.height = 'auto';
                ta.style.height = Math.min(160, ta.scrollHeight) + 'px';
              } catch {}

              if (val.trim()) {
                startTyping(conversation.id);
                if (typingDebounceRef.current) clearTimeout(typingDebounceRef.current);
                typingDebounceRef.current = setTimeout(() => {
                  stopTyping(conversation.id);
                  setIsTyping(false);
                }, 2000);
              } else {
                stopTyping(conversation.id);
                if (typingDebounceRef.current) clearTimeout(typingDebounceRef.current);
                setIsTyping(false);
              }
            }}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            rows={1}
            className="flex-1 p-3 border border-gray-200 rounded-lg resize-none text-black outline-none focus:ring-2 focus:ring-indigo-500"
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