'use client';
import { useState } from "react";
import { Search } from "lucide-react";
import { ConversationItem } from "./ConversationItem";

export const ConversationList = ({ conversations, activeConversationId, onConversationSelect }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full md:w-96 border-r border-gray-200 flex flex-col bg-gray-50">
      {/* Header & Search */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <h1 className="text-xl font-bold text-gray-900 mb-3">Tin nhắn</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="search"
            placeholder="Tìm kiếm cuộc hội thoại..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border text-black focus:outline-none border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div> 

      {/* List */}
      <nav className="flex-1 overflow-y-auto">
        {filteredConversations.map(conv => (
          <ConversationItem 
            key={conv.id}
            conv={conv}
            isActive={conv.id === activeConversationId}
            onClick={() => onConversationSelect(conv.id)}
          />
        ))}
      </nav>
    </div>
  );
};