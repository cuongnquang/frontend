'use client';

import React, { useState, useEffect } from 'react';
import { useMessage } from '@/contexts/MessageContext';
import { useAuth } from '@/contexts/AuthContext';
import { ConversationList } from '@/components/doctor/messages/ConversationList';
import ChatWindow from '@/components/doctor/messages/ChatWindow';
import { EmptyChat } from '@/components/doctor/messages/EmptyChat';

export default function DoctorMessagesPage() {
  const { 
    conversations, 
    messages, 
    selectedConversation, 
    selectConversation, 
    createConversation, 
    sendMessage, 
    getAvailableRecipients 
  } = useMessage();
  const { user } = useAuth();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [allRecipients, setAllRecipients] = useState<any[]>([]);

  useEffect(() => {
    getAvailableRecipients().then(data => setAllRecipients(data));
  }, [getAvailableRecipients]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setIsSearching(true);
    
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const results = allRecipients.filter(r => {
       const name = r.Doctor?.full_name || r.Patient?.full_name || '';
       return name.toLowerCase().includes(query.toLowerCase());
    }).map(r => ({
       user_id: r.user_id,
       full_name: r.Doctor?.full_name || r.Patient?.full_name,
       avatar_url: r.Doctor?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${r.user_id}`,
       specialty: { name: r.Doctor?.title || r.role }
    }));

    setSearchResults(results);
    setIsSearching(false);
  };

  const handleCreateConversation = async (recipientId: string) => {
     try {
       await createConversation(recipientId);
       setSearchQuery('');
       setSearchResults([]);
     } catch (e) {
       console.error(e);
     }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-3 h-full max-w-screen-2xl mx-auto">
        <div className="lg:col-span-1 border-r border-slate-200 bg-white flex flex-col h-full shadow-sm z-10">
          <ConversationList 
            conversations={conversations}
            activeConversationId={selectedConversation?.id || null}
            onConversationSelect={(id) => {
                const conv = conversations.find(c => c.id === id);
                selectConversation(conv || null);
            }}
            searchQuery={searchQuery}
            onSearch={handleSearch}
            searchResults={searchResults}
            isSearching={isSearching}
            onCreateConversation={handleCreateConversation}
          />
        </div>
        
        <div className="lg:col-span-2 flex flex-col h-full bg-white/50 backdrop-blur-sm">
          {selectedConversation ? (
            <ChatWindow 
              conversation={selectedConversation}
              messages={[...(messages.get(selectedConversation.id) || [])]}
              onSendMessage={(content) => sendMessage(selectedConversation.id, content)}
              currentUserId={user?.user_id || ''}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <EmptyChat />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
