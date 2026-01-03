'use client';

import React, { createContext, useContext, useReducer, useCallback, useEffect, useRef } from 'react';
import { Socket } from 'socket.io-client';
import { createSocket } from '@/lib/socket';

function getAccessToken(): string | undefined {
  if (typeof document === 'undefined') return undefined;
  const value = `; ${document.cookie}`;
  const parts = value.split('; accessToken=');
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift();
  }
  return undefined;
}

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
    Doctor?: {
      full_name: string;
      avatar_url?: string;
    };
    Patient?: {
      full_name: string;
    };
  };
}

export interface ChatParticipant {
  userId: string;
  chatRoomId: string;
  lastReadMessageId?: string;
  lastReadAt?: string;
  createdAt: string;
  updatedAt: string;
  user: {
    user_id: string;
    role: 'patient' | 'doctor' | 'admin';
    Doctor?: {
      doctor_id: string;
      full_name: string;
      avatar_url?: string;
      Specialty?: {
        name: string;
      };
    };
    Patient?: {
      patient_id: string;
      full_name: string;
    };
  };
}

export interface Conversation {
  id: string;
  type: 'patient_doctor' | 'doctor_doctor';
  createdAt: string;
  updatedAt: string;
  lastMessageAt?: string;
  participants: ChatParticipant[];
  messages?: Message[];
  unreadCount?: number;
  lastMessage?: Message;
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

  // Actions
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
      const newMessages = new Map(state.messages);
      newMessages.set(action.payload.roomId, action.payload.messages);
      return { ...state, messages: newMessages };
    }
    case 'PREPEND_MESSAGES': {
      const existing = state.messages.get(action.payload.roomId) || [];
      const newMessages = new Map(state.messages);
      newMessages.set(action.payload.roomId, [...action.payload.messages, ...existing]);
      return { ...state, messages: newMessages };
    }
    case 'ADD_MESSAGE': {
      const roomId = action.payload.chatRoomId;
      const messages = state.messages.get(roomId) || [];
      const newMessages = new Map(state.messages);
      newMessages.set(roomId, [...messages, action.payload]);
      const newConversations = state.conversations.map((c) =>
        c.id === roomId ? { ...c, lastMessage: action.payload, lastMessageAt: action.payload.createdAt } : c
      );
      return { ...state, messages: newMessages, conversations: newConversations };
    }
    case 'UPDATE_MESSAGE': {
      const roomId = action.payload.chatRoomId;
      const messages = state.messages.get(roomId) || [];
      const newMessages = new Map(state.messages);
      newMessages.set(
        roomId,
        messages.map((m) => (m.id === action.payload.id ? action.payload : m))
      );
      return { ...state, messages: newMessages };
    }
    case 'DELETE_MESSAGE': {
      const newMessages = new Map(state.messages);
      for (const [roomId, msgs] of newMessages.entries()) {
        const filtered = msgs.filter((m) => m.id !== action.payload);
        if (filtered.length < msgs.length) {
          newMessages.set(roomId, filtered);
        }
      }
      return { ...state, messages: newMessages };
    }
    case 'SET_UNREAD_COUNTS':
      return { ...state, unreadCounts: action.payload };
    case 'ADD_ONLINE_USER':
      return {
        ...state,
        onlineUsers: new Set([...state.onlineUsers, action.payload]),
      };
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


export function MessageProvider({ children, initialUser }: { children: React.ReactNode; initialUser?: UserRef }) {
  const user = initialUser as UserRef;
  const [state, dispatch] = useReducer(messageReducer, initialState);

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
      console.error('Error loading conversation messages:', error);
      return { messages: [], hasMore: false };
    }
  }, []);

  const selectConversation = useCallback((conversation: Conversation | null) => {
    dispatch({ type: 'SELECT_CONVERSATION', payload: conversation });
  }, []);

  const createConversation = useCallback(
    async (recipientId: string) => {
      try {
        const token = getAccessToken();
        if (!token) throw new Error('No access token');

        const response = await fetch('/api/chat/conversations/find-or-create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ recipientId }),
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const data = await response.json();
        const conversation = data.data || data;

        dispatch({ type: 'ADD_CONVERSATION', payload: conversation });
        selectConversation(conversation);
        return conversation;
      } catch (error) {
        console.error('Error creating conversation:', error);
        return undefined;
      }
    },
    [selectConversation]
  );

  const loadConversations = useCallback(async (limit = 50, offset = 0) => {
    try {
      const token = getAccessToken();
      if (!token) return undefined;

      const response = await fetch(`/api/chat/conversations?limit=${limit}&offset=${offset}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      const conversations = data.data || data;

      if (Array.isArray(conversations)) {
        dispatch({ type: 'SET_CONVERSATIONS', payload: conversations });

        const unreadCounts = new Map<string, number>();
        conversations.forEach((conv) => {
          if (conv.unreadCount !== undefined) {
            unreadCounts.set(conv.id, conv.unreadCount);
          }
        });
        dispatch({ type: 'SET_UNREAD_COUNTS', payload: unreadCounts });

        return conversations;
      }
      return undefined;
    } catch (error) {
      console.error('Error loading conversations:', error);
      return undefined;
    }
  }, []);

  const sendMessage = useCallback(
    async (roomId: string, content: string) => {
      try {
        const token = getAccessToken();
        if (!token) throw new Error('No access token');

        const response = await fetch('/api/chat/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ chatRoomId: roomId, content }),
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const data = await response.json();
        const message = data.data || data;
        dispatch({ type: 'ADD_MESSAGE', payload: message });
      } catch (error) {
        console.error('Error sending message:', error);
      }
    },
    []
  );

  const markAsRead = useCallback(async (roomId: string) => {
    try {
      const token = getAccessToken();
      if (!token) return;

      await fetch(`/api/chat/conversations/${roomId}/read`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  }, []);

  const deleteMessage = useCallback(async (messageId: string) => {
    try {
      const token = getAccessToken();
      if (!token) return;

      const response = await fetch(`/api/chat/messages/${messageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isDeleted: true }),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      dispatch({ type: 'DELETE_MESSAGE', payload: messageId });
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  }, []);

  const editMessage = useCallback(async (messageId: string, content: string) => {
    try {
      const token = getAccessToken();
      if (!token) return;

      const response = await fetch(`/api/chat/messages/${messageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      const message = data.data || data;
      dispatch({ type: 'UPDATE_MESSAGE', payload: message });
    } catch (error) {
      console.error('Error editing message:', error);
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

  // Initialize socket connection
  useEffect(() => {
    if (!user?.user_id || typeof window === 'undefined') return;

    const socket = createSocket();

    socket.on('connect', () => {
      dispatch({ type: 'SET_CONNECTED', payload: true });
      socket.emit('user_online', { userId: user.user_id });
    });

    socket.on('disconnect', () => {
      dispatch({ type: 'SET_CONNECTED', payload: false });
    });

    socket.on('receive_message', (message: Message) => {
      dispatch({ type: 'ADD_MESSAGE', payload: message });
    });

    socket.on('message_updated', (message: Message) => {
      dispatch({ type: 'UPDATE_MESSAGE', payload: message });
    });

    socket.on('message_deleted', (data: { messageId: string }) => {
      dispatch({ type: 'DELETE_MESSAGE', payload: data.messageId });
    });

    socket.on('user_online', (data: { userId: string }) => {
      dispatch({ type: 'ADD_ONLINE_USER', payload: data.userId });
    });

    socket.on('user_offline', (data: { userId: string }) => {
      dispatch({ type: 'REMOVE_ONLINE_USER', payload: data.userId });
    });

    socket.on('typing', (data: { userId: string; chatRoomId: string; isTyping: boolean }) => {
      dispatch({ type: 'SET_TYPING', payload: { userId: data.userId, chatRoomId: data.chatRoomId, isTyping: data.isTyping } });
    });

    dispatch({ type: 'SET_SOCKET', payload: socket });

    return () => {
      socket.disconnect();
    };
  }, [user?.user_id]);

  const value: MessageContextType = {
    conversations: state.conversations,
    messages: state.messages,
    unreadCounts: state.unreadCounts,
    onlineUsers: state.onlineUsers,
    typingUsers: state.typingUsers,
    selectedConversation: state.selectedConversation,
    isConnected: state.isConnected,
    socket: state.socket,
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
