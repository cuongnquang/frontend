'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Conversation } from '@/contexts/MessageContext';
import { ConversationListClient } from '@/components/client/message/ConversationListClient';
import { ChatWindowNew } from '@/components/client/message/ChatWindowNew';
import { MessageSquare } from 'lucide-react';

export default function ClientMessagesPage() {
  const { user } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);

  if (!user) {
    return <div className="p-8 text-center text-gray-500">Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      {/* Conversation List */}
      <div className="md:col-span-1 bg-white rounded-lg shadow">
        <ConversationListClient onSelectConversation={setSelectedConversation} selectedId={selectedConversation?.id} />
      </div>

      {/* Chat Window */}
      <div className="md:col-span-2">
        {selectedConversation ? (
          <div className="bg-white rounded-lg shadow">
            <ChatWindowNew conversation={selectedConversation} onBack={() => setSelectedConversation(null)} />
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow h-[600px] flex items-center justify-center">
            <div className="text-center">
              <MessageSquare size={48} className="mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Chọn cuộc trò chuyện</h3>
              <p className="text-gray-500">Chọn một bác sĩ để bắt đầu trò chuyện</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

