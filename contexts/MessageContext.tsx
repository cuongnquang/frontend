'use client';

import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import { createSocket } from '@/lib/socket';

// --- HELPER: Lấy Token ---
function getAccessToken(): string | undefined {
  if (typeof document === 'undefined') return undefined;
  const value = `; ${document.cookie}`;
  const parts = value.split('; accessToken=');
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift();
  }
  return undefined;
}

// --- TYPES ---
export interface Message {
  id: string;
  chatRoomId: string;
  tempId?: string;
  senderId: string;
  content: string;
  createdAt: string;
  isEdited: boolean;
  isDeleted: boolean;
  sender: {
    user_id: string;
    role: 'patient' | 'doctor' | 'admin';
    Doctor?: { full_name: string; avatar_url?: string; };
    Patient?: { full_name: string; };
  };
}

export interface ChatParticipant {
  userId: string;
  chatRoomId: string;
  user: {
    user_id: string;
    role: 'patient' | 'doctor' | 'admin';
    Doctor?: { full_name: string; avatar_url?: string; };
    Patient?: { full_name: string; };
  };
}

export interface Conversation {
  id: string;
  type: 'patient_doctor' | 'doctor_doctor';
  createdAt: string;
  updatedAt: string;
  lastMessageAt?: string;
  participants: ChatParticipant[];
  lastMessage?: Message;
  unreadCount?: number;
} 

interface MessageContextType {
  conversations: Conversation[];
  messages: Map<string, Message[]>;
  unreadCounts: Map<string, number>;
  onlineUsers: Set<string>;
  typingUsers: Map<string, { chatRoomId: string; isTyping: boolean }>;
  selectedConversation: Conversation | null;
  isConnected: boolean;
  socket: Socket | null;

  loadConversations: (limit?: number, offset?: number) => Promise<Conversation[] | undefined>;
  loadConversationMessages: (roomId: string, page?: number, pageSize?: number) => Promise<{ messages: Message[]; hasMore: boolean }>;
  sendMessage: (roomId: string, content: string) => Promise<void>;
  selectConversation: (conversation: Conversation | null) => void;
  createConversation: (recipientId: string) => Promise<Conversation | undefined>;
  markAsRead: (roomId: string) => Promise<void>;
  deleteMessage: (messageId: string) => Promise<void>;
  editMessage: (messageId: string, content: string) => Promise<void>;
  startTyping: (chatRoomId: string) => void;
  stopTyping: (chatRoomId: string) => void;
}

// --- STATE & REDUCER ---
const MessageContext = createContext<MessageContextType | undefined>(undefined);

interface State {
  conversations: Conversation[];
  messages: Map<string, Message[]>;
  unreadCounts: Map<string, number>;
  onlineUsers: Set<string>;
  typingUsers: Map<string, { chatRoomId: string; isTyping: boolean }>;
  selectedConversation: Conversation | null;
  isConnected: boolean;
  socket: Socket | null;
}

const initialState: State = {
  conversations: [],
  messages: new Map(),
  unreadCounts: new Map(),
  onlineUsers: new Set(),
  typingUsers: new Map(),
  selectedConversation: null,
  isConnected: false,
  socket: null,
};

type Action =
  | { type: 'SET_CONVERSATIONS'; payload: Conversation[] }
  | { type: 'ADD_CONVERSATION'; payload: Conversation }
  | { type: 'SET_MESSAGES'; payload: { roomId: string; messages: Message[] } }
  | { type: 'PREPEND_MESSAGES'; payload: { roomId: string; messages: Message[] } }
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'UPDATE_MESSAGE'; payload: Message }
  | { type: 'DELETE_MESSAGE'; payload: string }
  | { type: 'SET_UNREAD_COUNTS'; payload: Map<string, number> }
  | { type: 'ADD_ONLINE_USER'; payload: string }
  | { type: 'REMOVE_ONLINE_USER'; payload: string }
  | { type: 'SET_TYPING'; payload: { userId: string; chatRoomId: string; isTyping: boolean } }
  | { type: 'SELECT_CONVERSATION'; payload: Conversation | null }
  | { type: 'SET_CONNECTED'; payload: boolean }
  | { type: 'SET_SOCKET'; payload: Socket };

function messageReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_CONVERSATIONS':
      return { ...state, conversations: action.payload };

    case 'ADD_CONVERSATION': {
      const exists = state.conversations.some((c) => c.id === action.payload.id);
      if (exists) return state;
      return { ...state, conversations: [action.payload, ...state.conversations] };
    }

    case 'SET_MESSAGES': {
      // payload.roomId cần đảm bảo là string
      const rid = String(action.payload.roomId);
      const newMessages = new Map(state.messages);
      newMessages.set(rid, action.payload.messages);
      return { ...state, messages: newMessages };
    }

    case 'PREPEND_MESSAGES': {
      const rid = String(action.payload.roomId);
      const existing = state.messages.get(rid) || [];
      // Lọc trùng lặp khi load thêm trang cũ
      const incoming = action.payload.messages.filter(
         newMsg => !existing.some(exMsg => exMsg.id === newMsg.id)
      );
      const newMessages = new Map(state.messages);
      newMessages.set(rid, [...incoming, ...existing]);
      return { ...state, messages: newMessages };
    }

    // --- CASE QUAN TRỌNG NHẤT: NHẬN TIN NHẮN SOCKET ---
    case 'ADD_MESSAGE': {
      const msg = action.payload;
      
      // XỬ LÝ ĐA DẠNG KEY ID (Đây là lý do chính khiến tin nhắn không hiện)
      const rawId = msg.chatRoomId || 
                    (msg as any).chat_room_id || 
                    (msg as any).conversationId || 
                    (msg as any).room_id;

      const roomId = rawId ? String(rawId) : null;

      if (!roomId) {
        console.error("❌ Socket nhận tin nhưng thiếu RoomID:", msg);
        return state;
      }
      
      // ... (Code xử lý thêm vào map giữ nguyên như cũ)
      const currentMessages = state.messages.get(roomId) || [];
      if (currentMessages.some(m => m.id === msg.id)) return state;

      const newMessagesMap = new Map(state.messages);
      newMessagesMap.set(roomId, [...currentMessages, msg]);
      
      return { ...state, messages: newMessagesMap };
    }

    case 'UPDATE_MESSAGE': {
      const rawId = action.payload.chatRoomId || (action.payload as any).conversationId;
      const roomId = String(rawId);
      const messages = state.messages.get(roomId) || [];
      const newMessages = new Map(state.messages);
      newMessages.set(
        roomId,
        messages.map((m) => (m.id === action.payload.id ? action.payload : m))
      );
      return { ...state, messages: newMessages };
    }

    case 'DELETE_MESSAGE': {
      // Khi xóa, socket trả về messageId, ta phải duyệt map để tìm và xóa
      const newMessages = new Map(state.messages);
      let changed = false;

      // Duyệt qua từng phòng chat để tìm tin nhắn cần xóa (hoặc đánh dấu đã xóa)
      for (const [roomId, msgs] of newMessages.entries()) {
        const targetIndex = msgs.findIndex(m => m.id === action.payload);
        if (targetIndex !== -1) {
            const updatedMsgs = [...msgs];
            // Cách 1: Xóa hẳn
            // updatedMsgs.splice(targetIndex, 1);
            // Cách 2: Đánh dấu đã xóa (Recommended)
            updatedMsgs[targetIndex] = { ...updatedMsgs[targetIndex], isDeleted: true };
            
            newMessages.set(roomId, updatedMsgs);
            changed = true;
        }
      }
      return changed ? { ...state, messages: newMessages } : state;
    }

    case 'SET_UNREAD_COUNTS':
      return { ...state, unreadCounts: action.payload };

    case 'ADD_ONLINE_USER':
      return { ...state, onlineUsers: new Set([...state.onlineUsers, action.payload]) };

    case 'REMOVE_ONLINE_USER': {
      const newSet = new Set(state.onlineUsers);
      newSet.delete(action.payload);
      return { ...state, onlineUsers: newSet };
    }

    case 'SET_TYPING': {
      const newTyping = new Map(state.typingUsers);
      if (action.payload.isTyping) {
        newTyping.set(action.payload.userId, {
          chatRoomId: action.payload.chatRoomId,
          isTyping: true,
        });
      } else {
        newTyping.delete(action.payload.userId);
      }
      return { ...state, typingUsers: newTyping };
    }

    case 'SELECT_CONVERSATION':
      return { ...state, selectedConversation: action.payload };
    case 'SET_CONNECTED':
      return { ...state, isConnected: action.payload };
    case 'SET_SOCKET':
      return { ...state, socket: action.payload };
    default:
      return state;
  }
}

type UserRef = { user_id: string; role: string; full_name?: string } | null;

// --- PROVIDER COMPONENT ---
export function MessageProvider({ children, initialUser }: { children: React.ReactNode; initialUser?: UserRef }) {
  const user = initialUser as UserRef;
  const [state, dispatch] = useReducer(messageReducer, initialState);

  // 1. Load Messages API
  const loadConversationMessages = useCallback(async (roomId: string, page = 1, pageSize = 20) => {
    try {
      const token = getAccessToken();
      if (!token) return { messages: [], hasMore: false };
      const response = await fetch(`/api/chat/messages/${roomId}?page=${page}&pageSize=${pageSize}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      const messages = data.data?.messages || data.messages || [];

      if (page === 1) {
        dispatch({ type: 'SET_MESSAGES', payload: { roomId, messages } });
      } else {
        dispatch({ type: 'PREPEND_MESSAGES', payload: { roomId, messages } });
      }
      return { messages, hasMore: page < (data.data?.totalPages || 1) };
    } catch (error) {
      console.error('Error loading msgs:', error);
      return { messages: [], hasMore: false };
    }
  }, []);

  // 2. Socket Initialization (NẰM TRONG COMPONENT, KHÔNG PHẢI REDUCER)
  useEffect(() => {
    if (!user?.user_id || typeof window === 'undefined') return;

    // Khởi tạo socket
    const socket = createSocket();

    // Các hàm xử lý sự kiện
    const handleConnect = () => {
        console.log("✅ Socket Connected");
        dispatch({ type: 'SET_CONNECTED', payload: true });
        socket.emit('user_online', { userId: user.user_id });
    };

    const handleDisconnect = () => {
        console.log("❌ Socket Disconnected");
        dispatch({ type: 'SET_CONNECTED', payload: false });
    };

    const handleReceiveMessage = (message: Message) => {
    console.log("📩 RECEIVED MESSAGE:", message);
    console.log("📍 ChatRoomId:", message.chatRoomId);
    console.log("🗺️ Current messages map keys:", Array.from(state.messages.keys()));
    
    // Đảm bảo chatRoomId là string
    const roomId = String(message.chatRoomId);
    
    // Kiểm tra xem message đã tồn tại chưa
    const currentMessages = state.messages.get(roomId) || [];
    const exists = currentMessages.some(m => m.id === message.id);
    
    if (exists) {
      console.log("⚠️ Message already exists, skipping");
      return;
    }
    
    console.log("✅ Adding message to state");
    dispatch({ type: 'ADD_MESSAGE', payload: { ...message, chatRoomId: roomId } });
  };

    const handleUpdateMessage = (message: Message) => dispatch({ type: 'UPDATE_MESSAGE', payload: message });
    const handleDeleteMessage = (data: { messageId: string }) => dispatch({ type: 'DELETE_MESSAGE', payload: data.messageId });
    const handleUserOnline = (data: { userId: string }) => dispatch({ type: 'ADD_ONLINE_USER', payload: data.userId });
    const handleUserOffline = (data: { userId: string }) => dispatch({ type: 'REMOVE_ONLINE_USER', payload: data.userId });
    const handleTyping = (data: { userId: string; chatRoomId: string; isTyping: boolean }) => dispatch({ type: 'SET_TYPING', payload: data });

    // Đăng ký sự kiện
    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('receive_message', handleReceiveMessage);
    socket.on('message_updated', handleUpdateMessage);
    socket.on('message_deleted', handleDeleteMessage);
    socket.on('user_online', handleUserOnline);
    socket.on('user_offline', handleUserOffline);
    socket.on('typing', handleTyping);

    // Lưu socket vào state
    dispatch({ type: 'SET_SOCKET', payload: socket });

    // Cleanup khi component unmount
    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('receive_message', handleReceiveMessage);
      socket.off('message_updated', handleUpdateMessage);
      socket.off('message_deleted', handleDeleteMessage);
      socket.off('user_online', handleUserOnline);
      socket.off('user_offline', handleUserOffline);
      socket.off('typing', handleTyping);
      socket.disconnect();
    };
  }, [user?.user_id]);

  // 3. API Actions
  const loadConversations = useCallback(async (limit = 50, offset = 0) => {
    const token = getAccessToken();
    if (!token) return undefined;
    try {
        const res = await fetch(`/api/chat/conversations?limit=${limit}&offset=${offset}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(res.statusText);
        const data = await res.json();
        const convs = data.data || data;
        if (Array.isArray(convs)) {
            dispatch({ type: 'SET_CONVERSATIONS', payload: convs });
            const unread = new Map();
            convs.forEach(c => c.unreadCount && unread.set(c.id, c.unreadCount));
            dispatch({ type: 'SET_UNREAD_COUNTS', payload: unread });
            return convs;
        }
    } catch (e) { console.error(e); }
  }, []);

  const sendMessage = useCallback(async (roomId: string, content: string) => {
    const token = getAccessToken();
    if (!token) return;
    try {
        const res = await fetch('/api/chat/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ chatRoomId: roomId, content }),
        });
        if (!res.ok) throw new Error(res.statusText);
        const data = await res.json();
        const msg = data.data || data;
        // Backend sẽ emit socket, nhưng ta add luôn vào state để UI phản hồi nhanh
        dispatch({ type: 'ADD_MESSAGE', payload: msg });
    } catch (e) { console.error(e); }
  }, []);

  const selectConversation = useCallback((c: Conversation | null) => dispatch({ type: 'SELECT_CONVERSATION', payload: c }), []);
  
  const createConversation = useCallback(async (recipientId: string) => {
    const token = getAccessToken();
    if (!token) return undefined;
    try {
        const res = await fetch('/api/chat/conversations/find-or-create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ recipientId }),
        });
        const data = await res.json();
        const conv = data.data || data;
        dispatch({ type: 'ADD_CONVERSATION', payload: conv });
        selectConversation(conv);
        return conv;
    } catch (e) { console.error(e); return undefined; }
  }, [selectConversation]);

  const markAsRead = useCallback(async (roomId: string) => {
     const token = getAccessToken();
     if(token) fetch(`/api/chat/conversations/${roomId}/read`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
  }, []);

  const deleteMessage = useCallback(async (id: string) => {
    const token = getAccessToken();
    if(token) {
        await fetch(`/api/chat/messages/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ isDeleted: true }) });
        dispatch({ type: 'DELETE_MESSAGE', payload: id });
    }
  }, []);

  const editMessage = useCallback(async (id: string, content: string) => {
    const token = getAccessToken();
    if(token) {
        const res = await fetch(`/api/chat/messages/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ content }) });
        const data = await res.json();
        dispatch({ type: 'UPDATE_MESSAGE', payload: data.data || data });
    }
  }, []);

  const startTyping = useCallback((chatRoomId: string) => {
    if (!user?.user_id || !state.socket) return;
    dispatch({ type: 'SET_TYPING', payload: { userId: user.user_id, chatRoomId, isTyping: true } });
    state.socket.emit('typing', { chatRoomId, isTyping: true });
  }, [user?.user_id, state.socket]);

  const stopTyping = useCallback((chatRoomId: string) => {
    if (!user?.user_id || !state.socket) return;
    dispatch({ type: 'SET_TYPING', payload: { userId: user.user_id, chatRoomId, isTyping: false } });
    state.socket.emit('typing', { chatRoomId, isTyping: false });
  }, [user?.user_id, state.socket]);

  const value: MessageContextType = {
    ...state,
    loadConversations,
    loadConversationMessages,
    sendMessage,
    selectConversation,
    createConversation,
    markAsRead,
    deleteMessage,
    editMessage,
    startTyping,
    stopTyping,
  };

  return <MessageContext.Provider value={value}>{children}</MessageContext.Provider>;
}

export function useMessage() {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error('useMessage must be used within MessageProvider');
  }
  return context;
}