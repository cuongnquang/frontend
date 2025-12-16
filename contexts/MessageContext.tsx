'use client';

import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

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

export interface Conversation {
  id: string;
  type: 'patient_doctor' | 'doctor_doctor';
  createdAt: string;
  updatedAt: string;
  lastMessageAt?: string;
  participants: Array<{
    user: {
      user_id: string;
      role: 'patient' | 'doctor' | 'admin';
      Doctor?: {
        full_name: string;
        avatar_url?: string;
        title?: string;
      };
      Patient?: {
        full_name: string;
      };
    };
  }>;
  messages: Message[];
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
  loadConversations: (limit?: number, offset?: number) => Promise<void>;
  loadConversationMessages: (roomId: string, page?: number, pageSize?: number) => Promise<{ messages: Message[], hasMore: boolean }>;
  sendMessage: (roomId: string, content: string) => Promise<void>;
  selectConversation: (conversation: Conversation) => void;
  createConversation: (recipientId: string) => Promise<Conversation>;
  markAsRead: (roomId: string, messageId?: string) => Promise<void>;
  deleteMessage: (messageId: string) => Promise<void>;
  editMessage: (messageId: string, content: string) => Promise<void>;
  searchConversations: (query: string) => Promise<Conversation[]>;
  getAvailableRecipients: () => Promise<Record<string, unknown>[]>;
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

type Action =
  | { type: 'SET_CONVERSATIONS'; payload: Conversation[] }
  | { type: 'ADD_CONVERSATION'; payload: Conversation }
  | { type: 'REPLACE_CONVERSATION'; payload: { tempId: string; conversation: Conversation } }
  | { type: 'SET_MESSAGES'; payload: { roomId: string; messages: Message[] } }
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'PREPEND_MESSAGES'; payload: { roomId: string; messages: Message[] } }
  | { type: 'UPDATE_MESSAGE'; payload: Message }
  | { type: 'DELETE_MESSAGE'; payload: string }
  | { type: 'MARK_MESSAGE_FAILED'; payload: { tempId: string } }
  | { type: 'SET_UNREAD_COUNTS'; payload: Map<string, number> }
  | { type: 'ADD_ONLINE_USER'; payload: string }
  | { type: 'REMOVE_ONLINE_USER'; payload: string }
  | { type: 'SET_TYPING'; payload: { userId: string; chatRoomId: string; isTyping: boolean } }
  | { type: 'SELECT_CONVERSATION'; payload: Conversation | null }
  | { type: 'SET_CONNECTED'; payload: boolean }
  | { type: 'SET_SOCKET'; payload: Socket | null };

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

function messageReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_CONVERSATIONS':
      return { ...state, conversations: action.payload };
    case 'ADD_CONVERSATION':
      return {
        ...state,
        conversations: [action.payload, ...state.conversations],
      };
    case 'REPLACE_CONVERSATION': {
      const { tempId, conversation } = action.payload;
      const newConversations = state.conversations.map((c) => (c.id === tempId ? conversation : c));
      // If temp was not found, prepend the real conversation
      if (!newConversations.find((c) => c.id === conversation.id)) {
        newConversations.unshift(conversation);
      }
      return { ...state, conversations: newConversations };
    }
    case 'SET_MESSAGES': {
      const newMessages = new Map(state.messages);
      newMessages.set(action.payload.roomId, action.payload.messages);
      return { ...state, messages: newMessages };
    }
    case 'ADD_MESSAGE': {
      const messages = state.messages.get(action.payload.chatRoomId) || [];
      const newMessages = new Map(state.messages);
      newMessages.set(action.payload.chatRoomId, [...messages, action.payload]);
      return { ...state, messages: newMessages };
    }
    case 'PREPEND_MESSAGES': {
      const { roomId, messages: newMsgs } = action.payload;
      const existingMessages = state.messages.get(roomId) || [];
      const allMessages = [...newMsgs, ...existingMessages];
      // Loại bỏ tin nhắn trùng lặp để đảm bảo tính nhất quán
      const uniqueMessages = allMessages.filter((msg, index, self) =>
        index === self.findIndex((m) => m.id === msg.id)
      );
      const newMessagesMap = new Map(state.messages);
      newMessagesMap.set(roomId, uniqueMessages);
      return { ...state, messages: newMessagesMap };
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
      // Find which room contains this message and remove it
      const newMessages = new Map(state.messages);
      for (const [roomId, msgs] of newMessages.entries()) {
        const filtered = msgs.filter((m) => m.id !== action.payload);
        if (filtered.length < msgs.length) {
          newMessages.set(roomId, filtered);
        }
      }
      return { ...state, messages: newMessages };
    }
    case 'MARK_MESSAGE_FAILED': {
      const { tempId } = action.payload;
      const newMessages = new Map(state.messages);
      for (const [roomId, msgs] of newMessages.entries()) {
        const updated = msgs.map((m) => (m.id === tempId ? { ...m, content: `[Gửi thất bại] ${m.content}` } : m));
        newMessages.set(roomId, updated);
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
      newTyping.set(action.payload.userId, {
        chatRoomId: action.payload.chatRoomId,
        isTyping: action.payload.isTyping,
      });
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

  const loadConversationMessages = useCallback(
    async (roomId: string, page = 1, pageSize = 20, retries = 0) => {
      const emptyResult = { messages: [], hasMore: false };
      try {
        const token = getAccessToken();
        if (!token) {
          console.warn('[MessageContext] No access token available');
          return emptyResult;
        }

        const url = `/api/chat/conversations/${roomId}/messages?page=${page}&pageSize=${pageSize}`;
        console.log(`[MessageContext] Loading messages from ${url} (attempt ${retries + 1}/4)`);
        
        const response = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`[MessageContext] HTTP ${response.status} from ${url}:`, errorText);
          
          // Retry on 403 (authorization issue that might be due to race condition with newly created conversation)
          if (response.status === 403 && retries < 5) { // Increased retries to 5 (6 attempts total)
            const delayMs = 500 * Math.pow(2, retries); // Exponential backoff: 500ms, 1s, 2s
            console.warn(`[MessageContext] 403 Forbidden - Retrying after ${delayMs}ms (attempt ${retries + 1}/6)`);
            await new Promise(resolve => setTimeout(resolve, delayMs));
            return await loadConversationMessages(roomId, page, pageSize, retries + 1);
          }
          
          throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        console.log(`[MessageContext] Successfully loaded ${data.length} messages for room ${roomId}`);
        
        if (page === 1) {
          dispatch({ type: 'SET_MESSAGES', payload: { roomId, messages: data } });
        } else {
          dispatch({ type: 'PREPEND_MESSAGES', payload: { roomId, messages: data } });
        }

        return { messages: data, hasMore: data.length === pageSize };
      } catch (error) {
        console.error('[MessageContext] Failed to load messages:', error);
        return emptyResult;
      }
    },
    []
  );

  const selectConversation = useCallback(
    (conversation: Conversation | null) => {
      // Leave previous room if any
      try {
        const prev = state.selectedConversation;
        if (prev && conversation && prev.id !== conversation.id) {
          state.socket?.emit('leaveRoom', prev.id);
        } else if (prev && !conversation) {
          state.socket?.emit('leaveRoom', prev.id);
        }
      } catch (err) {
        // ignore
      }

      dispatch({ type: 'SELECT_CONVERSATION', payload: conversation });

      // Join new room and load its messages
      if (conversation && state.socket) {
        try {
          state.socket.emit('joinRoom', conversation.id);
          // Attempt to load messages asynchronously; server may also trigger 'joinedRoom' event
          Promise.resolve().then(() => void loadConversationMessages(conversation.id, 1, 20));
        } catch (err) {
          console.error('Failed to join room:', err);
        }
      }
    },
    [state.socket, state.selectedConversation, loadConversationMessages]
  );

  const createConversation = useCallback(
    async (recipientId: string, tempId?: string) => {
      try {
        const token = getAccessToken();
        if (!token) {
          throw new Error('No access token available');
        }

        const response = await fetch(`/api/chat/conversations`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ recipientId }),
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();

        if (tempId) {
          // Replace temp conversation in the list if present
          dispatch({ type: 'REPLACE_CONVERSATION', payload: { tempId, conversation: data } });
        } else {
          dispatch({ type: 'ADD_CONVERSATION', payload: data });
        }

        // Select and join the new conversation
        selectConversation(data);

        return data;
      } catch (error) {
        console.error('Failed to create conversation:', error);
        throw error;
      }
    },
    [selectConversation]
  );

  // Initialize Socket.io connection
  useEffect(() => {
    if (!user) return;

    const token = getAccessToken();
    if (!token) {
      console.warn('No access token available for socket connection');
      return;
    }

    console.debug('Connecting socket with token:', token.substring(0, 20) + '...');
    const newSocket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000', {
      auth: { token },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    newSocket.on('connect', () => {
      dispatch({ type: 'SET_CONNECTED', payload: true });
      console.log('Socket connected');
    });

    newSocket.on('disconnect', () => {
      dispatch({ type: 'SET_CONNECTED', payload: false });
      console.log('Socket disconnected');
    });

    newSocket.on('privateMessage', (message: Message) => {
      // If server provides a tempId for an optimistic message, remove the temp one first
      if (message.tempId) {
        try {
          dispatch({ type: 'DELETE_MESSAGE', payload: message.tempId });
        } catch {
          // ignore
        }
      }
      dispatch({ type: 'ADD_MESSAGE', payload: message });
    });

    newSocket.on('messageEdited', (message: Message) => {
      dispatch({ type: 'UPDATE_MESSAGE', payload: message });
    });

    newSocket.on('messageDeleted', ({ messageId }: { messageId: string }) => {
      dispatch({ type: 'DELETE_MESSAGE', payload: messageId });
    });

    newSocket.on('userOnline', ({ userId }: { userId: string }) => {
      dispatch({ type: 'ADD_ONLINE_USER', payload: userId });
    });

    newSocket.on('userOffline', ({ userId }: { userId: string }) => {
      dispatch({ type: 'REMOVE_ONLINE_USER', payload: userId });
    });

    newSocket.on('userTyping', (data: { userId: string; chatRoomId: string; isTyping: boolean }) => {
      dispatch({
        type: 'SET_TYPING',
        payload: { userId: data.userId, chatRoomId: data.chatRoomId, isTyping: data.isTyping },
      });
    });

    // When the server confirms joining a room, load its messages
    newSocket.on('joinedRoom', (data: { roomId: string; success: boolean }) => {
      if (data?.success) {
        // load first page of messages for this room
        // Call asynchronously to avoid referencing a function before it's initialized
        loadConversationMessages(data.roomId, 1, 20).catch(err => console.error("Failed to load messages on join", err));
      }
    });

    newSocket.on('messageError', (data: { error: string; tempId?: string }) => {
      if (data?.tempId) {
        dispatch({ type: 'MARK_MESSAGE_FAILED', payload: { tempId: data.tempId } });
      } else {
        console.error('[MessageContext] messageError:', data.error);
      }
    });

    dispatch({ type: 'SET_SOCKET', payload: newSocket });

    return () => {
      newSocket.disconnect();
    };
  }, [user, loadConversationMessages]); 

  const loadConversations = useCallback(
    async (limit = 50, offset = 0) => {
      try {
        const token = getAccessToken();
        if (!token) {
          console.warn('No access token available in cookies');
          return;
        }

        console.debug('Loading conversations with token:', token.substring(0, 20) + '...');
        const response = await fetch(
          `/api/chat/conversations?limit=${limit}&offset=${offset}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`HTTP ${response.status}:`, errorText);
          if (response.status === 401) {
            console.warn('Token expired or invalid, user may need to re-login');
          }
          throw new Error(`HTTP ${response.status}`);
        }
        const data = await response.json();
        dispatch({ type: 'SET_CONVERSATIONS', payload: data });
      } catch (error) {
        console.error('Failed to load conversations:', error);
      }
    },
    []
  );

  const sendMessage = useCallback(
    async (roomId: string, content: string) => {
      if (!state.socket || !user) {
        console.error('Socket not connected or user not found');
        return;
      }

      // 1. Optimistic UI: Create a temporary message
      const tempId = `temp-${Date.now()}`;
      const optimisticMessage: Message = {
        id: tempId,
        chatRoomId: roomId,
        senderId: user.user_id,
        content: content,
        createdAt: new Date().toISOString(),
        isEdited: false,
        isDeleted: false,
        sender: {
          user_id: user.user_id,
          role: user.role as 'patient' | 'doctor' | 'admin',
          // The sender profile might be incomplete here, but it's for UI only
          Doctor: user.role === 'doctor' ? { full_name: user.full_name || 'Doctor' } : undefined,
          Patient: user.role === 'patient' ? { full_name: user.full_name || 'Patient' } : undefined,
        },
      };

      // Dispatch to show the message immediately
      dispatch({ type: 'ADD_MESSAGE', payload: optimisticMessage });

      // 2. Emit message with acknowledgement
      // include tempId so the server can echo it back to allow deduplication
      state.socket.emit('privateMessage', { chatRoomId: roomId, content, tempId });
    },
    [state.socket, user]
  );

  const markAsRead = useCallback(
    async (roomId: string, messageId?: string) => {
      try {
        state.socket?.emit('markAsRead', { chatRoomId: roomId, messageId });
      } catch (error) {
        console.error('Failed to mark as read:', error);
      }
    },
    [state.socket]
  );

  const deleteMessage = useCallback(
    async (messageId: string) => {
      try {
        state.socket?.emit('deleteMessage', messageId);
      } catch (error) {
        console.error('Failed to delete message:', error);
      }
    },
    [state.socket]
  );

  const editMessage = useCallback(
    async (messageId: string, content: string) => {
      try {
        state.socket?.emit('editMessage', { messageId, content });
      } catch (error) {
        console.error('Failed to edit message:', error);
      }
    },
    [state.socket]
  );

  const searchConversations = useCallback(
    async (query: string) => {
      try {
        const token = getAccessToken();
        if (!token) {
          console.warn('No access token available');
          return [];
        }

        const response = await fetch(`/api/chat/conversations/search`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ query }),
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Failed to search conversations:', error);
        return [];
      }
    },
    []
  );

  const getAvailableRecipients = useCallback(async () => {
    try {
      const token = getAccessToken();
      if (!token) {
        console.warn('No access token available');
        return [];
      }

      const response = await fetch(`/api/chat/recipients`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to get recipients:', error);
      return [];
    }
  }, []);

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
    searchConversations,
    getAvailableRecipients,
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
