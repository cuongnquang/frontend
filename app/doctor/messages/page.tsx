'use client';
import { useState, useEffect, useCallback } from "react";
import { ConversationList } from "@/components/doctor/messages/ConversationList";
import { ChatWindow } from "@/components/doctor/messages/ChatWindow";
import { apiClient } from "@/lib/api";
import { socket } from "@/lib/socket";
import { useAuth } from "@/contexts/AuthContext";


// Định nghĩa kiểu dữ liệu cho các đối tượng trong trang
interface Conversation {
  id: string; // chat_room_id
  name: string;
  lastMessage: string;
  unread: number;
  time: string; // ISO string date
  avatar: string;
  online: boolean;
  type: 'patient' | 'doctor' | 'admin';
  otherParticipantId: string; // user_id của người đối thoại
}

interface Message {
  id: string | number;
  senderId: string;
  recipientId: string;
  content: string;
  createdAt: string; // ISO string date
}

interface Doctor {
  user_id: string;
  full_name: string;
  avatar_url: string;
  specialty: { name: string };
}

export default function MessagesPage() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messageHistory, setMessageHistory] = useState<Record<string, Message[]>>({});
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Doctor[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Hàm xử lý tin nhắn mới (gửi hoặc nhận)
  const handleNewMessage = useCallback((newMessage: Message) => {
    const conversationId = newMessage.senderId === user?.user_id ? newMessage.recipientId : newMessage.senderId;

    // Tránh thêm tin nhắn trùng lặp (quan trọng cho optimistic UI)
    if (messageHistory[conversationId]?.some(msg => msg.id === newMessage.id)) {
      return;
    }

    // Cập nhật lịch sử tin nhắn
    setMessageHistory(prev => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] || []), newMessage],
    }));

    

    // Cập nhật danh sách cuộc trò chuyện
    setConversations(prev => {
      const index = prev.findIndex(c => c.id === conversationId);
      if (index === -1) return prev; // Nếu không tìm thấy, không làm gì

      const updatedConv = {
        ...prev[index],
        lastMessage: newMessage.content,
        time: newMessage.createdAt,
      };

      // Đưa cuộc trò chuyện vừa có tin nhắn mới lên đầu
      const newConversations = [updatedConv, ...prev.slice(0, index), ...prev.slice(index + 1)];
      return newConversations;
    });
  }, [user?.user_id]);

  // Lấy danh sách cuộc trò chuyện ban đầu
  useEffect(() => {
    const fetchConversations = async () => {
      setLoading(true);
      // Sử dụng API mới để lấy danh sách cuộc trò chuyện
      const res = await apiClient<any[]>('/v1/chat/conversations');
      if (res.status && res.data) {
        // Xử lý dữ liệu trả về từ API
        const conversationsData: Conversation[] = res.data.map(room => {
          const otherParticipant = room.participants[0]; // Vì đã lọc ra người dùng hiện tại
          const profile = otherParticipant.user.Patient || otherParticipant.user.Doctor;
          const lastMessage = room.messages[0];
          return {
            id: room.id, // ID của phòng chat
            otherParticipantId: otherParticipant.user_id,
            name: profile?.full_name || otherParticipant.user.email,
            lastMessage: lastMessage.content,
            unread: 0, // Cần logic để tính toán
            time: lastMessage.created_at,
            avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${profile?.full_name || otherParticipant.user.email}`,
            online: false,
            type: otherParticipant.user.role,
          };
        });
        setConversations(conversationsData);
        if (conversationsData.length > 0) {
          setActiveConversationId(conversationsData[0].id);
        }
      }
      setLoading(false);
    };
    if (user) {
      fetchConversations();
    }
  }, [user]);

  // Tải lịch sử tin nhắn khi chọn một cuộc trò chuyện
  useEffect(() => {
    const fetchHistory = async () => {
      if (activeConversationId && !messageHistory[activeConversationId]) {
        const res = await apiClient<Message[]>(`/v1/chat/history/${activeConversationId}`);
        if (res.status && res.data) {
          setMessageHistory(prev => ({ ...prev, [activeConversationId]: res.data }));
        }
      }
    };
    fetchHistory();
  }, [activeConversationId]);

  // Kết nối và lắng nghe Socket.IO
  useEffect(() => {
    if (user) {
      socket.connect();
      socket.on('message', handleNewMessage);

      return () => {
        socket.off('privateMessage', handleNewMessage);
        socket.disconnect();
      };
    }
  }, [user, handleNewMessage]);

  const handleSendMessage = (content: string) => {
    const activeConv = conversations.find(c => c.id === activeConversationId);
    if (!activeConv || !user?.user_id) return;

    // Gửi sự kiện lên server
    socket.emit('message', { recipientId: activeConv.otherParticipantId, content });

    // Tạo tin nhắn tạm thời để cập nhật UI ngay lập tức (Optimistic Update)
    const optimisticMessage: Message = {
      id: `temp_${Date.now()}`,
      senderId: user.user_id,
      recipientId: activeConversationId,
      content: content,
      createdAt: new Date().toISOString()
    };

    handleNewMessage(optimisticMessage);
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length > 2) {
      setIsSearching(true);
      const res = await apiClient<Doctor[]>(`/v1/chat/users/search?name=${query}&role=doctor`);
      if (res.status && res.data) {
        setSearchResults(res.data);
      }
    } else {
      setIsSearching(false);
      setSearchResults([]);
    }
  };

  const handleCreateConversation = async (recipientId: string) => {
    const res = await apiClient<any>('/v1/chat/conversations', {
      method: 'POST',
      body: JSON.stringify({ recipientId }),
    });

    if (res.status && res.data) {
      const newConversation = res.data;
      // Add the new conversation to the list if it doesn't exist
      if (!conversations.some(c => c.id === newConversation.id)) {
        const otherParticipant = newConversation.participants.find(p => p.user_id !== user.user_id);
        const profile = otherParticipant.user.Patient || otherParticipant.user.Doctor;
        const newConvData: Conversation = {
          id: newConversation.id,
          otherParticipantId: otherParticipant.user_id,
          name: profile?.full_name || otherParticipant.user.email,
          lastMessage: '',
          unread: 0,
          time: new Date().toISOString(),
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${profile?.full_name || otherParticipant.user.email}`,
          online: false,
          type: otherParticipant.user.role,
        };
        setConversations(prev => [newConvData, ...prev]);
      }
      setActiveConversationId(newConversation.id);
      setIsSearching(false);
      setSearchQuery("");
      setSearchResults([]);
    }
  };

  const activeConversation = conversations.find(c => c.id === activeConversationId);
  const activeMessages = (activeConversationId && messageHistory[activeConversationId]) || [];

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
      <ConversationList 
        conversations={conversations}
        activeConversationId={activeConversationId}
        onConversationSelect={setActiveConversationId}
        loading={loading}
        searchQuery={searchQuery}
        onSearch={handleSearch}
        searchResults={searchResults}
        isSearching={isSearching}
        onCreateConversation={handleCreateConversation}
      />
      <ChatWindow
        conversation={activeConversation}
        messages={activeMessages}
        onSendMessage={handleSendMessage}
        currentUserId={user?.user_id || ''}
      />
    </div>
  );
}