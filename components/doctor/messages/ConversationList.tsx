'use client';
import { Search, Circle } from "lucide-react";
import { ConversationItem } from "./ConversationItem";
import { DoctorItem } from "./DoctorItem";
import { Conversation } from "@/contexts/MessageContext";
import { Doctor } from "@/contexts/DoctorContext";

interface ConversationListProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onConversationSelect: (conversationId: string) => void;
  searchQuery: string;
  onSearch: (query: string) => void;
  searchResults: Doctor[];
  isSearching: boolean;
  onCreateConversation: (recipientId: string) => void;
}

export function ConversationList({
  conversations, 
  activeConversationId, 
  onConversationSelect,
  searchQuery,
  onSearch,
  searchResults,
  isSearching,
  onCreateConversation
}: ConversationListProps) {
  // Helper function to get conversation display name from participants
  const getConversationName = (conv: Conversation): string => {
    if (conv.name) return conv.name;
    
    // Get participant names (excluding current doctor)
    const participantNames = conv.participants
      ?.map(p => p.user?.Patient?.full_name || p.user?.Doctor?.full_name || '')
      .filter(name => name && name.length > 0)
      .join(', ') || 'Conversation';
    
    return participantNames;
  };

  const filteredConversations = conversations.filter(conv => {
    const name = getConversationName(conv);
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="w-full h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-500 rounded-lg flex items-center justify-center shadow-sm">
            <Circle className="w-5 h-5 text-white fill-white" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
            MediConnect
          </h1>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="search"
            placeholder="Tìm kiếm cuộc trò chuyện..."
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
      </div> 

      {/* List */}
      <nav className="flex-1 overflow-y-auto">
        {searchQuery ? (
          <>
            {filteredConversations.length > 0 && (
              <>
                <div className="px-4 py-2">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Cuộc trò chuyện</h3>
                </div>
                {filteredConversations.map((conv, index) => (
                  <ConversationItem 
                    key={`${conv.id}-${index}`}
                    conv={conv}
                    isActive={conv.id === activeConversationId}
                    onClick={() => onConversationSelect(conv.id)}
                  />
                ))}
              </>
            )}
            {isSearching && <p className="text-center text-gray-500 text-sm py-4">Đang tìm kiếm...</p>}
            {!isSearching && searchResults.length > 0 && (
              <>
                <div className="px-4 py-2">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Bác sĩ có thể liên hệ</h3>
                </div>
                {searchResults.map(doctor => (
                  <DoctorItem 
                    key={doctor.user_id}
                    doctor={doctor}
                    onClick={() => onCreateConversation(doctor.user_id)}
                  />
                ))}
              </>
            )}
            {!isSearching && searchResults.length === 0 && filteredConversations.length === 0 && (
              <p className="text-center text-gray-500 text-sm py-6">Không tìm thấy kết quả nào.</p>
            )}
          </>
        ) : (
          <>
            <div className="px-4 py-2">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Tin nhắn gần đây</h3>
            </div>
            {conversations.map((conv, index) => (
              <ConversationItem 
                key={`${conv.id}-${index}`}
                conv={conv}
                isActive={conv.id === activeConversationId}
                onClick={() => onConversationSelect(conv.id)}
              />
            ))}
          </>
        )}
      </nav>
    </div>
  );
};