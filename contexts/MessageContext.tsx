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
  // Optional UI helpers
  name?: string;
  avatar?: string;
  online?: boolean;
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
  loadConversationMessages: (roomId: string, page?: number, pageSize?: number) => Promise<{ messages: Message[], hasMore: boolean }>;
  sendMessage: (roomId: string, content: string) => Promise<void>;
  selectConversation: (conversation: Conversation | null) => void;
  createConversation: (recipientId: string, tempId?: string) => Promise<Conversation>;
  markAsRead: (roomId: string, messageId?: string) => Promise<void>;
  deleteMessage: (messageId: string) => Promise<void>;
  editMessage: (messageId: string, content: string) => Promise<void>;
  searchConversations: (query: string) => Promise<Conversation[]>;
  getAvailableRecipients: () => Promise<Record<string, unknown>[]>;
  // Typing helpers
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

type Action =
  | { type: 'SET_CONVERSATIONS'; payload: Conversation[] }
  | { type: 'ADD_CONVERSATION'; payload: Conversation }
  | { type: 'REPLACE_CONVERSATION'; payload: { tempId: string; conversation: Conversation } }
  | { type: 'SET_MESSAGES'; payload: { roomId: string; messages: Message[] } }
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'PREPEND_MESSAGES'; payload: { roomId: string; messages: Message[] } }
  | { type: 'APPEND_MESSAGE_TO_CONVERSATION'; payload: Message }
  | { type: 'SET_CONVERSATION_MESSAGES'; payload: { roomId: string; messages: Message[] } }
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
      // Normalize messages Map to be oldest-first (ascending by createdAt)
      const sortedAsc = [...action.payload.messages].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      newMessages.set(action.payload.roomId, sortedAsc);
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
      // Remove duplicates and normalize order (oldest-first)
      const uniqueMessages = allMessages.filter((msg, index, self) =>
        index === self.findIndex((m) => m.id === msg.id)
      );
      uniqueMessages.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      const newMessagesMap = new Map(state.messages);
      newMessagesMap.set(roomId, uniqueMessages);
      return { ...state, messages: newMessagesMap };
    }
    case 'APPEND_MESSAGE_TO_CONVERSATION': {
      const msg = action.payload;
      const convIndex = state.conversations.findIndex((c) => c.id === msg.chatRoomId);
      if (convIndex === -1) return state;
      const conv = state.conversations[convIndex];
      // Merge, dedupe and sort newest-first for conversation summaries
      const merged = [msg, ...(conv.messages || [])];
      const unique = merged.filter((m, index, self) => index === self.findIndex((x) => x.id === m.id));
      unique.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      const updatedConv: Conversation = {
        ...conv,
        messages: unique,
        lastMessageAt: msg.createdAt,
        updatedAt: msg.createdAt,
      };
      const newConversations = [updatedConv, ...state.conversations.filter((c) => c.id !== updatedConv.id)];
      return { ...state, conversations: newConversations };
    }
    case 'SET_CONVERSATION_MESSAGES': {
      const { roomId, messages } = action.payload;
      // Store conversation messages as newest-first for quick previews
      const sortedDesc = [...messages].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      const newConversations = state.conversations.map(c => c.id === roomId ? { ...c, messages: sortedDesc } : c);
      return { ...state, conversations: newConversations };
    }
    case 'UPDATE_MESSAGE': {
      const roomId = action.payload.chatRoomId;
      const messages = state.messages.get(roomId) || [];
      const newMessages = new Map(state.messages);
      newMessages.set(
        roomId,
        messages.map((m) => (m.id === action.payload.id ? action.payload : m))
      );
      // Also update conversation.messages if present
      const newConversations = state.conversations.map((c) =>
        c.id === roomId
          ? { ...c, messages: c.messages ? c.messages.map((m) => (m.id === action.payload.id ? action.payload : m)) : c.messages }
          : c
      );
      return { ...state, messages: newMessages, conversations: newConversations };
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
      // Also remove from conversation.messages to keep summaries in sync
      const newConversations = state.conversations.map((c) => {
        const filtered = c.messages ? c.messages.filter((m) => m.id !== action.payload) : c.messages;
        const lastMessageAt = filtered && filtered.length > 0 ? filtered[0].createdAt : undefined;
        return { ...c, messages: filtered, lastMessageAt } as Conversation;
      });
      return { ...state, messages: newMessages, conversations: newConversations };
    }
    case 'MARK_MESSAGE_FAILED': {
      const { tempId } = action.payload;
      const newMessages = new Map(state.messages);
      for (const [roomId, msgs] of newMessages.entries()) {
        const updated = msgs.map((m) => (m.id === tempId ? { ...m, content: `[Gửi thất bại] ${m.content}` } : m));
        newMessages.set(roomId, updated);
      }
      // Also mark the message in conversation summaries
      const newConversations = state.conversations.map((c) => ({
        ...c,
        messages: c.messages ? c.messages.map((m) => (m.id === tempId ? { ...m, content: `[Gửi thất bại] ${m.content}` } : m)) : c.messages,
      }));
      return { ...state, messages: newMessages, conversations: newConversations };
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
  const typingTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
  const failureTimersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
  // Keep a stable ref to conversations for use inside socket handlers to avoid stale closure issues
  const conversationsRef = useRef<Conversation[]>([]);
  useEffect(() => { conversationsRef.current = state.conversations; }, [state.conversations]);

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
          // keep conversation summary in sync with loaded messages
          dispatch({ type: 'SET_CONVERSATION_MESSAGES', payload: { roomId, messages: data } });
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
      } catch {
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
        console.debug('[MessageContext] createConversation response:', { recipientId, data });

        // Normalize conversation display name/avatar using the OTHER participant if available
        try {
          let otherPart = (Array.isArray(data.participants) ? data.participants.find((p: { user?: { user_id?: string } }) => p.user?.user_id !== user?.user_id) : undefined)?.user; 

          // Fallback: if server didn't include other participant details but caller provided a tempId,
          // try to use the currently selected temp conversation to derive the display name/avatar.
          if (!otherPart && tempId) {
            try {
              const tempSelected = state.selectedConversation && state.selectedConversation.id === tempId ? state.selectedConversation : conversationsRef.current.find((c) => c.id === tempId);
              if (tempSelected) {
                otherPart = (Array.isArray(tempSelected.participants) ? tempSelected.participants.find((p: { user?: { user_id?: string } }) => p.user?.user_id !== user?.user_id) : undefined)?.user; 
                if (otherPart) console.debug('[MessageContext] using temp conversation to normalize display:', { tempId });
              }
            } catch {
              // ignore
            }
          }

          if (otherPart) {
            const displayName = otherPart.Doctor?.full_name || otherPart.Patient?.full_name || otherPart.full_name || otherPart.user_id;
            data.name = displayName;
            if (!data.avatar) data.avatar = otherPart.Doctor?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${displayName}`;
            console.debug('[MessageContext] normalized conversation display from participant:', { id: data.id, name: data.name });
          } else {
            console.debug('[MessageContext] createConversation: no other participant available to normalize');
          }
        } catch (err) {
          console.warn('[MessageContext] Failed to normalize conversation display name', err);
        }

        if (tempId) {
          // Replace temp conversation in the list if present
          dispatch({ type: 'REPLACE_CONVERSATION', payload: { tempId, conversation: data } });
        } else {
          dispatch({ type: 'ADD_CONVERSATION', payload: data });
        }

        // Select and join the new conversation
        selectConversation(data);

        return data;
      } catch (err) {
        console.error('Failed to create conversation:', err);
        throw err;
      }
    },
    [selectConversation, user, state.selectedConversation]
  );

  // Typing helpers
  const startTyping = useCallback((chatRoomId: string) => {
    if (!state.socket) return;
    try {
      state.socket.emit('userTyping', { chatRoomId, isTyping: true });
      const existing = typingTimers.current.get(chatRoomId);
      if (existing) clearTimeout(existing);
      const t = setTimeout(() => {
        try { state.socket?.emit('userTyping', { chatRoomId, isTyping: false }); } catch {}
        typingTimers.current.delete(chatRoomId);
      }, 2000);
      typingTimers.current.set(chatRoomId, t);
    } catch {
      // ignore
    }
  }, [state.socket]);

  const stopTyping = useCallback((chatRoomId: string) => {
    if (!state.socket) return;
    try { state.socket.emit('userTyping', { chatRoomId, isTyping: false }); } catch {}
    const existing = typingTimers.current.get(chatRoomId);
    if (existing) { clearTimeout(existing); typingTimers.current.delete(chatRoomId); }
  }, [state.socket]);

  // Load conversations
  const loadConversations = useCallback(
    async (limit = 50, offset = 0): Promise<Conversation[] | undefined> => {
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
        const data: unknown = await response.json();
        type ApiConversation = {
          id?: string;
          name?: string;
          avatar?: string;
          participants?: Array<{ user?: { user_id?: string; Doctor?: { full_name?: string; avatar_url?: string }; Patient?: { full_name?: string } } }>;
        };
        console.debug('[MessageContext] loadConversations response:', Array.isArray(data) ? (data as ApiConversation[]).map((c) => ({ id: c.id, name: c.name, participants: (c.participants || []).map((p) => p.user?.user_id) })) : data);

        // Normalize each conversation to prefer the OTHER participant's display name/avatar when available
        const normalized = (Array.isArray(data) ? (data as ApiConversation[]) : []).map((convRaw) => {
          const conv = convRaw as ApiConversation & Partial<Conversation>;
          try {
            const other = Array.isArray(conv.participants) ? conv.participants.find((p) => p.user?.user_id !== user?.user_id)?.user : undefined;
            if (other) {
              const displayName = other.Doctor?.full_name || other.Patient?.full_name || other.full_name || other.user_id;
              conv.name = displayName;
              if (!conv.avatar) conv.avatar = other.Doctor?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${displayName}`;
            }
          } catch (err) {
            // ignore
          }
          return conv as Conversation;
        });

        dispatch({ type: 'SET_CONVERSATIONS', payload: normalized });
        return normalized;
      } catch (error) {
        console.error('Failed to load conversations:', error);
      }
    },
    [user]
  );

  // Initialize Socket.io connection
  useEffect(() => {
    if (!user) return;

    const token = getAccessToken();
    if (!token) {
      console.warn('No access token available for socket connection');
      return;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const s = createSocket(token, apiUrl);
    // Capture the timers map reference for a stable cleanup variable
    const typingTimersMap = typingTimers.current;
    const failureTimersMap = failureTimersRef.current;

    s.on('connect', () => {
      dispatch({ type: 'SET_CONNECTED', payload: true });
      console.log('Socket connected');
    });

    s.on('disconnect', () => {
      dispatch({ type: 'SET_CONNECTED', payload: false });
      console.log('Socket disconnected');
    });

    s.on('privateMessage', async (message: Message) => {
      console.debug('[MessageContext] privateMessage received:', message);

      // If this message confirms an optimistic one, clear the failure timer
      if (message.tempId) {
        const timer = failureTimersRef.current.get(message.tempId);
        if (timer) { clearTimeout(timer); failureTimersRef.current.delete(message.tempId); }
      }

      // Ignore malformed messages without chatRoomId
      if (!message.chatRoomId) {
        console.warn('[MessageContext] Ignoring privateMessage without chatRoomId', message);
        return;
      }

      // Check if we already know about this conversation
      let conversation = conversationsRef.current.find((c) => c.id === message.chatRoomId);

      // If not, try to fetch conversation details from backend
      if (!conversation) {
        try {
          const token = getAccessToken();
          if (token) {
            const resp = await fetch(`/api/chat/conversations/${message.chatRoomId}/details`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (resp.ok) {
              const data = await resp.json();
              console.debug('[MessageContext] fetched conversation details for incoming message:', { chatRoomId: message.chatRoomId, data });

              // Normalize using other participant if available
              try {
                const otherPart = (Array.isArray(data.participants) ? data.participants.find((p: { user?: { user_id?: string } }) => p.user?.user_id !== user?.user_id) : undefined)?.user; 
                if (otherPart) {
                  const displayName = otherPart.Doctor?.full_name || otherPart.Patient?.full_name || otherPart.full_name || otherPart.user_id;
                  data.name = displayName;
                  if (!data.avatar) data.avatar = otherPart.Doctor?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${displayName}`;
                  console.debug('[MessageContext] normalized fetched conversation display:', { id: data.id, name: data.name });
                }
              } catch (err) {
                console.warn('[MessageContext] Failed to normalize fetched conversation display', err);
              }

              dispatch({ type: 'ADD_CONVERSATION', payload: data });
              conversation = data;
            } else {
              // As a fallback, refresh the conversation list
              console.debug('[MessageContext] conversation details fetch returned non-ok, refreshing conversations list');
              const refreshedConversations = await loadConversations();
              if (refreshedConversations) {
                conversation = refreshedConversations.find((c) => c.id === message.chatRoomId);
              }
              console.debug('[MessageContext] conversation found after refresh:', conversation);
            }
          }
        } catch (err) {
          console.error('[MessageContext] Failed to fetch conversation details for incoming message', err);
        }
      }

      if (!conversation) {
        console.warn('[MessageContext] Received message for unknown conversation', message.chatRoomId);
        return;
      }

      // Ensure the current user is a participant of the conversation
      const isParticipant = conversation.participants?.some((p) => p.user.user_id === user?.user_id);
      if (!isParticipant) {
        console.warn('[MessageContext] Ignoring message for conversation the user is not part of', message.chatRoomId);
        return;
      }

      if (message.tempId) {
        try { dispatch({ type: 'DELETE_MESSAGE', payload: message.tempId }); } catch {}
      }
      dispatch({ type: 'ADD_MESSAGE', payload: message });
      console.debug('[MessageContext] dispatched ADD_MESSAGE for', { chatRoomId: message.chatRoomId, id: message.id, tempId: message.tempId });
      // Keep conversation summary/list in sync with incoming messages
      try { dispatch({ type: 'APPEND_MESSAGE_TO_CONVERSATION', payload: message }); console.debug('[MessageContext] dispatched APPEND_MESSAGE_TO_CONVERSATION for', { chatRoomId: message.chatRoomId, id: message.id }); } catch {}

    });

    s.on('messageEdited', (message: Message) => {
      dispatch({ type: 'UPDATE_MESSAGE', payload: message });
    });

    s.on('messageDeleted', ({ messageId }: { messageId: string }) => {
      dispatch({ type: 'DELETE_MESSAGE', payload: messageId });
    });

    s.on('userOnline', ({ userId }: { userId: string }) => {
      dispatch({ type: 'ADD_ONLINE_USER', payload: userId });
    });

    s.on('userOffline', ({ userId }: { userId: string }) => {
      dispatch({ type: 'REMOVE_ONLINE_USER', payload: userId });
    });

    s.on('userTyping', (data: { userId: string; chatRoomId: string; isTyping: boolean }) => {
      dispatch({ type: 'SET_TYPING', payload: { userId: data.userId, chatRoomId: data.chatRoomId, isTyping: data.isTyping } });
    });

    s.on('joinedRoom', (data: { roomId: string; success: boolean }) => {
      if (data?.success) {
        loadConversationMessages(data.roomId, 1, 20).catch(err => console.error('Failed to load messages on join', err));
      }
    });

    s.on('messageError', (data: { error: string; tempId?: string }) => {
      if (data?.tempId) {
        dispatch({ type: 'MARK_MESSAGE_FAILED', payload: { tempId: data.tempId } });
      } else {
        console.error('[MessageContext] messageError:', data.error);
      }
    });

    dispatch({ type: 'SET_SOCKET', payload: s });

    // actually connect
    try { s.connect(); } catch (err) { console.warn('Socket connect failed', err); }

    return () => {
      try { s.disconnect(); } catch { /* ignore */ }
      typingTimersMap.forEach((t) => clearTimeout(t));
      typingTimersMap.clear();
      failureTimersMap.forEach((t) => clearTimeout(t));
      failureTimersMap.clear();
      dispatch({ type: 'SET_SOCKET', payload: null });
    };
  }, [user, loadConversationMessages, loadConversations]);

  const sendMessage = useCallback(
    async (roomId: string, content: string) => {
      if (!user) {
        console.error('User not found');
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
      console.debug('[MessageContext] optimistic ADD_MESSAGE:', optimisticMessage);
      // Update conversation summary immediately (optimistic) so list/header show latest
      dispatch({ type: 'APPEND_MESSAGE_TO_CONVERSATION', payload: optimisticMessage });
      console.debug('[MessageContext] optimistic APPEND_MESSAGE_TO_CONVERSATION:', { chatRoomId: optimisticMessage.chatRoomId, tempId });

      // Failure fallback timeout: if server doesn't confirm the message (via privateMessage with tempId), mark failed
      const failureTimeoutMs = 8000; // 8 seconds
      const failureTimer = setTimeout(() => {
        failureTimersRef.current.delete(tempId);
        dispatch({ type: 'MARK_MESSAGE_FAILED', payload: { tempId } });
      }, failureTimeoutMs);
      failureTimersRef.current.set(tempId, failureTimer);

      // 2a. If socket is connected, emit via socket
      if (state.socket && state.socket.connected) {
        try {
          state.socket.emit('privateMessage', { chatRoomId: roomId, content, tempId });
          // The main 'privateMessage' handler will now be responsible for clearing the failure timer
          // when it receives the message back from the server with a matching tempId.
        } catch {
          console.error('Socket emit failed, falling back to HTTP');

          // Fall back to HTTP if socket emit failed
          try {
            const token = getAccessToken();
            if (!token) throw new Error('No access token');

            const resp = await fetch(`/api/chat/conversations/${roomId}/messages`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
              body: JSON.stringify({ content }),
            });

            if (!resp.ok) {
              if (failureTimersRef.current.has(tempId)) { clearTimeout(failureTimer); failureTimersRef.current.delete(tempId); }
              dispatch({ type: 'MARK_MESSAGE_FAILED', payload: { tempId } });
            } else {
              const msg = await resp.json();
              if (failureTimersRef.current.has(tempId)) { clearTimeout(failureTimer); failureTimersRef.current.delete(tempId); }
              // Remove temp message and add server message
              dispatch({ type: 'DELETE_MESSAGE', payload: tempId });
              dispatch({ type: 'ADD_MESSAGE', payload: msg as Message });
              // Ensure conversation summary is updated with confirmed message
              dispatch({ type: 'APPEND_MESSAGE_TO_CONVERSATION', payload: msg as Message });
            }
          } catch {
            if (failureTimersRef.current.has(tempId)) { clearTimeout(failureTimer); failureTimersRef.current.delete(tempId); }
            dispatch({ type: 'MARK_MESSAGE_FAILED', payload: { tempId } });
          }
        }

        return;
      }

      // 2b. Socket not connected: use HTTP POST fallback
      try {
        console.warn('Socket not connected, sending message via HTTP as fallback');
        const token = getAccessToken();
        if (!token) throw new Error('No access token');

        const resp = await fetch(`/api/chat/conversations/${roomId}/messages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ content }),
        });

        if (!resp.ok) {
          if (failureTimersRef.current.has(tempId)) { clearTimeout(failureTimer); failureTimersRef.current.delete(tempId); }
          dispatch({ type: 'MARK_MESSAGE_FAILED', payload: { tempId } });
          return;
        }

        const msg = await resp.json();
        if (failureTimersRef.current.has(tempId)) { clearTimeout(failureTimer); failureTimersRef.current.delete(tempId); }
        // Replace temp message with server message
        dispatch({ type: 'DELETE_MESSAGE', payload: tempId });
        dispatch({ type: 'ADD_MESSAGE', payload: msg as Message });
        // Update conversation summary with confirmed message
        dispatch({ type: 'APPEND_MESSAGE_TO_CONVERSATION', payload: msg as Message });
      } catch (err) {
        if (failureTimersRef.current.has(tempId)) { clearTimeout(failureTimer); failureTimersRef.current.delete(tempId); }
        console.error('Failed to send message via HTTP fallback:', err);
        dispatch({ type: 'MARK_MESSAGE_FAILED', payload: { tempId } });
      }
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
