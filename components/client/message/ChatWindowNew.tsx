'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useMessage, Conversation, Message } from '@/contexts/MessageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Send, MoreVertical, Trash2, Edit2, ChevronLeft } from 'lucide-react';

interface ChatWindowProps {
  conversation: Conversation;
  onBack: () => void;
}

export function ChatWindowNew({ conversation, onBack }: ChatWindowProps) {
  const {
    messages,
    loadConversationMessages,
    sendMessage,
    markAsRead,
    deleteMessage,
    editMessage,
    startTyping,
    stopTyping,
    typingUsers,
    onlineUsers,
  } = useMessage();

  const { user } = useAuth();
  const [messageContent, setMessageContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [messageMenuOpen, setMessageMenuOpen] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const typingDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load messages on conversation change
  useEffect(() => {
    setLoading(true);
    loadConversationMessages(conversation.id).then(() => {
      setLoading(false);
      markAsRead(conversation.id);
    });
  }, [conversation.id, loadConversationMessages, markAsRead]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation.id, messages.get(conversation.id)?.length]);

  // Stop typing on unmount
  useEffect(() => {
    return () => {
      stopTyping(conversation.id);
      if (typingDebounceRef.current) clearTimeout(typingDebounceRef.current);
    };
  }, [conversation.id, stopTyping]);

  const conversationMessages = messages.get(conversation.id) || [];

  const getOtherParticipant = () => {
    return conversation.participants?.find((p) => p.user.user_id !== user?.user_id)?.user;
  };

  const getParticipantName = (participant: any) => {
    return participant?.Doctor?.full_name || participant?.Patient?.full_name || 'Unknown';
  };

  const handleSendMessage = async () => {
    if (!messageContent.trim()) return;

    try {
      if (editingId) {
        await editMessage(editingId, messageContent);
        setEditingId(null);
      } else {
        await sendMessage(conversation.id, messageContent);
      }
      stopTyping(conversation.id);
      if (typingDebounceRef.current) clearTimeout(typingDebounceRef.current);
      setMessageContent('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!confirm('Xác nhận xóa tin nhắn này?')) return;
    try {
      await deleteMessage(messageId);
      setMessageMenuOpen(null);
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const handleEditMessage = (message: Message) => {
    setEditingId(message.id);
    setMessageContent(message.content);
    setMessageMenuOpen(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const otherUser = getOtherParticipant();
  const isOnline = otherUser ? onlineUsers.has(otherUser.user_id) : false;

  return (
    <div className="w-full h-[600px] flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-1.5 hover:bg-white/20 rounded-full transition-colors">
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-3">
            {otherUser?.Doctor?.avatar_url ? (
              <img
                src={otherUser.Doctor.avatar_url}
                alt="Doctor"
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 bg-white/30 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                {getParticipantName(otherUser).charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h3 className="font-semibold text-lg">Bác sĩ {getParticipantName(otherUser)}</h3>
              <p className="text-xs text-blue-100">{isOnline ? 'Đang hoạt động' : 'Ngoại tuyến'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={messageContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Đang tải tin nhắn...</p>
          </div>
        ) : conversationMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Chưa có tin nhắn nào</p>
          </div>
        ) : (
          conversationMessages.map((message) => {
            const isSender = message.senderId === user?.user_id;
            const outerClass = `flex ${isSender ? 'justify-end' : 'justify-start'} items-end gap-2`;
            const bubbleClass = isSender
              ? 'bg-blue-500 text-white rounded-tl-lg rounded-b-lg max-w-[70%]'
              : 'bg-white border border-gray-300 rounded-tr-lg rounded-b-lg max-w-[70%]';

            return (
              <div key={message.id} className={outerClass}>
                {isSender && !message.isDeleted && (
                  <div className="relative">
                    <button
                      onClick={() => setMessageMenuOpen(messageMenuOpen === message.id ? null : message.id)}
                      className="p-1.5 hover:bg-gray-200 rounded-full transition-colors"
                    >
                      <MoreVertical size={16} className="text-gray-600" />
                    </button>

                    {messageMenuOpen === message.id && (
                      <div className="absolute right-0 top-8 w-32 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
                        <button
                          onClick={() => handleEditMessage(message)}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-blue-50 flex items-center gap-2 text-blue-600 border-b"
                        >
                          <Edit2 size={14} />
                          Sửa
                        </button>
                        <button
                          onClick={() => handleDeleteMessage(message.id)}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 flex items-center gap-2 text-red-600"
                        >
                          <Trash2 size={14} />
                          Xóa
                        </button>
                      </div>
                    )}
                  </div>
                )}

                <div className={`p-3 ${bubbleClass}`}>
                  {message.isDeleted ? (
                    <p className="text-sm italic opacity-60">[Tin nhắn đã bị xóa]</p>
                  ) : (
                    <>
                      <p className="text-sm break-words">{message.content}</p>
                      <div className="flex items-center justify-between gap-2 mt-1">
                        <p className={`text-xs ${isSender ? 'text-blue-100' : 'text-gray-500'}`}>
                          {new Date(message.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                        {message.isEdited && <span className="text-xs opacity-60">đã sửa</span>}
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}

        {/* Typing indicator */}
        {Array.from(typingUsers.values())
          .filter((t) => t.chatRoomId === conversation.id && t.isTyping).length > 0 && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <div className="space-x-1">
              <span className="inline-block w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
              <span className="inline-block w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></span>
              <span className="inline-block w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></span>
            </div>
            Đang nhập...
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t bg-white">
        {editingId && (
          <div className="mb-2 p-2 bg-blue-50 rounded flex items-center justify-between">
            <p className="text-sm text-blue-900">Đang sửa tin nhắn...</p>
            <button
              onClick={() => {
                setEditingId(null);
                setMessageContent('');
              }}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              Hủy
            </button>
          </div>
        )}
        <div className="flex gap-2">
          <textarea
            value={messageContent}
            onChange={(e) => {
              const val = e.target.value;
              setMessageContent(val);

              if (val.trim()) {
                startTyping(conversation.id);
                if (typingDebounceRef.current) clearTimeout(typingDebounceRef.current);
                typingDebounceRef.current = setTimeout(() => {
                  stopTyping(conversation.id);
                }, 2000);
              } else {
                stopTyping(conversation.id);
              }
            }}
            onKeyPress={handleKeyPress}
            placeholder="Nhập tin nhắn..."
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
