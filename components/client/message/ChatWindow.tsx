'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useMessage, Conversation } from '@/contexts/MessageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Send, MoreVertical, Trash2, Edit2, ChevronLeft, Phone, Video, Info, Image as ImageIcon, Smile } from 'lucide-react';

interface ChatWindowProps {
  conversation: Conversation;
  onBack: () => void;
  onClose?: () => void;
}

export function ChatWindow({ conversation, onBack }: ChatWindowProps) {
  const { 
    messages, 
    loadConversationMessages, 
    sendMessage, 
    markAsRead, 
    deleteMessage: deleteMessageAction, 
    typingUsers,
    startTyping,
    stopTyping,
    socket,
  } = useMessage();

  const { user } = useAuth();
  const [messageContent, setMessageContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [messageMenuOpen, setMessageMenuOpen] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageContainerRef = useRef<HTMLDivElement>(null);
  
  const conversationMessages = messages.get(String(conversation.id)) || [];

  // 1. Load API
  useEffect(() => {
    if(!conversation.id) return;
    setLoading(true);
    setCurrentPage(1);
    loadConversationMessages(conversation.id, 1).then((result) => {
      setHasMore(result.hasMore);
      setLoading(false);
      markAsRead(conversation.id);
      setTimeout(scrollToBottom, 100);
    });
  }, [conversation.id, loadConversationMessages, markAsRead]);

  // 2. Socket
  useEffect(() => {
  if (!socket || !conversation.id) return;

  const roomId = String(conversation.id);

  // Đợi socket connect trước khi join
  const joinRoom = () => {
    if (!socket.connected) {
      console.log("⏳ Waiting for socket to connect...");
      socket.once('connect', () => {
        console.log("🔌 Socket connected, joining room:", roomId);
        socket.emit('join_room', { chatRoomId: roomId });
      });
    } else {
      console.log("✅ Socket already connected, joining room:", roomId);
      socket.emit('join_room', { chatRoomId: roomId });
    }
  };

  joinRoom();

  // Lắng nghe event join thành công (nếu backend emit)
  const handleJoinSuccess = (data: any) => {
    console.log("✅ Joined room successfully:", data);
  };

  socket.on('join_room', handleJoinSuccess);

  return () => {
    socket.off('join_room', handleJoinSuccess);
    socket.emit('leave_room', { chatRoomId: roomId });
  };
}, [conversation.id, socket]);
  // 3. Scroll
  useEffect(() => {
    if (!loading && conversationMessages.length > 0) {
        scrollToBottom();
        markAsRead(conversation.id);
    }
  }, [conversationMessages.length, loading, conversation.id, markAsRead]);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });

  const handleScroll = async () => {
    const container = messageContainerRef.current;
    if (container && container.scrollTop === 0 && !loadingMore && hasMore) {
      setLoadingMore(true);
      const nextPage = currentPage + 1;
      const oldScrollHeight = container.scrollHeight;
      const result = await loadConversationMessages(conversation.id, nextPage);
      setHasMore(result.hasMore);
      setCurrentPage(nextPage);
      requestAnimationFrame(() => {
        if (messageContainerRef.current) {
          messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight - oldScrollHeight;
        }
      });
      setLoadingMore(false);
    }
  };

  const handleSendMessage = async () => {
    if (!messageContent.trim()) return;
    try {
      if (editingId) {
         const token = document.cookie.split('; ').find(row => row.startsWith('accessToken='))?.split('=')[1];
         await fetch(`/api/chat/messages/${editingId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ content: messageContent }),
         });
         setEditingId(null);
      } else {
        await sendMessage(conversation.id, messageContent);
      }
      stopTyping(conversation.id);
      setMessageContent('');
      setTimeout(scrollToBottom, 50);
    } catch (error) {
      console.error('Error sending:', error);
    }
  };

  const handleDeleteMessage = async (msgId: string) => {
    if(confirm("Xóa tin nhắn này?")) {
        await deleteMessageAction(msgId);
        setMessageMenuOpen(null);
    }
  };

  const getOtherParticipant = () => {
    return conversation.participants?.find((p) => String(p.user.user_id) !== String(user?.user_id || (user as any)?.id))?.user;
  };
  
  const getParticipantName = (p: any) => p?.Doctor?.full_name || p?.Patient?.full_name || 'Người dùng';
  const otherUser = getOtherParticipant();
  const avatarUrl = otherUser?.Doctor?.avatar_url;

  return (
    <div className="flex flex-col h-full bg-gray-50/50">
      
      {/* 1. HEADER */}
      <div className="px-4 py-3 bg-white border-b border-gray-200 flex justify-between items-center shadow-sm sticky top-0 z-20">
         <div className="flex items-center gap-3">
             {/* --- NÚT TRỞ VỀ (Đã sửa: Luôn hiển thị) --- */}
             <button 
                onClick={onBack} 
                className="p-2 -ml-2 mr-1 hover:bg-gray-100 rounded-full text-gray-600 transition-colors"
                title="Quay lại"
             >
                <ChevronLeft size={24} />
             </button>
             
             <div className="relative">
                {avatarUrl ? (
                    <img src={avatarUrl} className="w-10 h-10 rounded-full object-cover border border-gray-100 shadow-sm" alt="Avatar"/> 
                ) : (
                    <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm">
                        {getParticipantName(otherUser).charAt(0).toUpperCase()}
                    </div>
                )}
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
             </div>

             <div>
                <h3 className="font-bold text-gray-800 text-[15px] leading-tight">
                    {otherUser?.Doctor ? 'BS. ' : ''}{getParticipantName(otherUser)}
                </h3>
                <p className="text-xs text-green-600 font-medium mt-0.5">Đang hoạt động</p>
             </div>
         </div>

         <div className="flex items-center gap-1 text-blue-600">
            <button className="p-2 hover:bg-blue-50 rounded-full transition-colors"><Phone size={20} /></button>
            <button className="p-2 hover:bg-blue-50 rounded-full transition-colors"><Video size={20} /></button>
            <button className="p-2 hover:bg-blue-50 rounded-full transition-colors"><Info size={20} /></button>
         </div>
      </div>

      {/* 2. MESSAGES LIST */}
      <div 
        ref={messageContainerRef} 
        onScroll={handleScroll} 
        className={`overflow-y-auto p-4 space-y-2 bg-[#F0F2F5] scroll-smooth custom-scrollbar ${user?.role === 'doctor' ? 'flex-1' : 'h-[450px]'}`}
      >
        {loadingMore && <div className="text-center py-2"><div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full mx-auto"></div></div>}
        
        {loading ? (
            <div className="flex h-full items-center justify-center">
                <div className="animate-spin h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full"></div>
            </div>
        ) : conversationMessages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-60">
                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                    <img src={avatarUrl} className="w-full h-full rounded-full opacity-50 grayscale object-cover" />
                </div>
                <p>Hãy bắt đầu cuộc trò chuyện!</p>
            </div>
        ) : (
            conversationMessages.map((msg: any, index) => {
                const isSender = String(msg.senderId || msg.sender_id || msg.sender?.user_id) === String(user?.user_id || (user as any)?.id);
                const isSequence = index > 0 && conversationMessages[index-1]?.senderId === msg.senderId;

                return (
                    <div key={msg.id} className={`flex w-full ${isSender ? 'justify-end' : 'justify-start'} group animate-in fade-in zoom-in-95 duration-200`}>
                       
                       {!isSender && (
                           <div className={`w-8 h-8 mr-2 flex-shrink-0 flex items-end ${isSequence ? 'invisible' : ''}`}>
                               {avatarUrl ? (
                                   <img src={avatarUrl} className="w-8 h-8 rounded-full object-cover border border-gray-200" />
                               ) : (
                                   <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-[10px] text-white font-bold">
                                       {getParticipantName(otherUser).charAt(0)}
                                   </div>
                               )}
                           </div>
                       )}

                       <div className={`relative max-w-[70%] md:max-w-[60%]`}>
                          {isSender && !msg.isDeleted && (
                              <div className="absolute top-1/2 -translate-y-1/2 -left-8 opacity-0 group-hover:opacity-100 transition-opacity px-1">
                                  <button onClick={() => setMessageMenuOpen(messageMenuOpen === msg.id ? null : msg.id)} className="p-1 hover:bg-gray-200 rounded-full text-gray-500">
                                      <MoreVertical size={14} />
                                  </button>
                                  {messageMenuOpen === msg.id && (
                                      <div className="absolute right-0 bottom-full mb-1 w-24 bg-white shadow-xl border rounded-lg overflow-hidden z-30">
                                          <button onClick={() => { setEditingId(msg.id); setMessageContent(msg.content); setMessageMenuOpen(null); }} className="w-full text-left px-3 py-2 text-xs hover:bg-blue-50 text-blue-600 flex gap-2 items-center"><Edit2 size={12}/> Sửa</button>
                                          <button onClick={() => handleDeleteMessage(msg.id)} className="w-full text-left px-3 py-2 text-xs hover:bg-red-50 text-red-600 flex gap-2 items-center"><Trash2 size={12}/> Xóa</button>
                                      </div>
                                  )}
                              </div>
                          )}

                          <div className={`
                              px-4 py-2 text-[15px] leading-relaxed break-words shadow-sm
                              ${isSender 
                                  ? 'bg-blue-600 text-white rounded-2xl rounded-tr-sm' 
                                  : 'bg-white text-gray-800 border border-gray-200 rounded-2xl rounded-tl-sm'}
                              ${msg.isDeleted ? 'opacity-70 italic border-dashed border-gray-400 bg-gray-100 text-gray-500' : ''}
                          `}>
                              {msg.isDeleted ? 'Tin nhắn đã thu hồi' : msg.content}
                          </div>

                          <div className={`text-[10px] mt-1 px-1 opacity-70 ${isSender ? 'text-right text-gray-500' : 'text-left text-gray-500'}`}>
                              {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                              {msg.isEdited && <span className="ml-1 italic">(đã sửa)</span>}
                          </div>
                       </div>
                    </div>
                )
            })
        )}
        
        {Array.from(typingUsers.values()).some(t => t.chatRoomId === conversation.id && t.isTyping) && (
            <div className="flex items-center gap-2 ml-10">
                <div className="bg-gray-200 px-3 py-2 rounded-full rounded-tl-none flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce delay-100"></span>
                    <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce delay-200"></span>
                </div>
                <span className="text-xs text-gray-400">Đang nhập...</span>
            </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 3. INPUT AREA */}
      <div className="p-3 bg-white border-t border-gray-200 sticky bottom-0 z-20">
         {editingId && (
             <div className="flex justify-between items-center bg-blue-50 px-3 py-1.5 mb-2 rounded text-xs text-blue-700 border border-blue-100">
                 <span>Đang chỉnh sửa tin nhắn...</span>
                 <button onClick={() => {setEditingId(null); setMessageContent('')}} className="font-bold hover:underline">Hủy</button>
             </div>
         )}
         <div className="flex items-end gap-2">
            <div className="flex gap-1 pb-2 text-blue-600">
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors"><ImageIcon size={20}/></button>
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors"><Smile size={20}/></button>
            </div>

            <div className="flex-1 bg-gray-100 rounded-3xl flex items-center px-4 py-2 border border-transparent focus-within:border-blue-300 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                <textarea 
                    className="flex-1 bg-transparent border-none focus:ring-0 outline-none max-h-32 min-h-[24px] resize-none text-sm text-gray-800 placeholder-gray-500 py-1 scrollbar-hide"
                    placeholder="Nhập tin nhắn..."
                    value={messageContent}
                    rows={1}
                    onChange={e => {
                        setMessageContent(e.target.value);
                        if(e.target.value) startTyping(conversation.id);
                        else stopTyping(conversation.id);
                    }}
                    onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
                />
            </div>
            
            <button 
                onClick={handleSendMessage} 
                disabled={!messageContent.trim()}
                className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-all shadow-sm flex-shrink-0"
            >
                <Send size={18} className={messageContent.trim() ? "ml-0.5" : ""} />
            </button>
         </div>
      </div>
    </div>
  );
}