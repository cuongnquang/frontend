'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useMessage, Conversation } from '@/contexts/MessageContext';
import { useAuth } from '@/contexts/AuthContext';
import ConversationList from '@/components/client/message/ConversationList';
import { ChatWindow } from '@/components/client/message/ChatWindow';
import { Plus, Search, Menu, X, MessageSquare } from 'lucide-react';

interface Recipient {
  user_id: string;
  role: string;
  Doctor?: {
    full_name: string;
    avatar_url?: string;
    title?: string;
  };
  Patient?: {
    full_name: string;
  };
}

export default function MessagesPage() {
  const { selectedConversation, selectConversation, createConversation, getAvailableRecipients } = useMessage();
  const { user } = useAuth();
  const [showRecipients, setShowRecipients] = useState(false);
  const [availableRecipients, setAvailableRecipients] = useState<Recipient[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNewConversation = async () => {
    setLoading(true);
    try {
      const recipients = (await getAvailableRecipients()) as unknown as Recipient[];
      setAvailableRecipients(recipients);
      setShowRecipients(true);
    } catch (error) {
      console.error('Failed to load recipients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRecipient = async (recipient: Recipient) => {
    try {
      const tempConversation: Conversation = {
        id: `temp-${Date.now()}`,
        type: 'patient_doctor',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        participants: [
          {
            user: {
              user_id: recipient.user_id,
              role: 'doctor',
              Doctor: {
                full_name: recipient.Doctor?.full_name || 'Doctor',
                avatar_url: recipient.Doctor?.avatar_url,
                title: recipient.Doctor?.title,
              },
            },
          },
          {
            user: {
              user_id: user!.user_id,
              role: 'patient',
              Patient: {
                full_name: user!.full_name || 'Patient',
              },
            }
          },
        ],
        messages: [],
      };

      selectConversation(tempConversation);
      setShowRecipients(false);
      setMobileMenuOpen(false);

      const realConversation = await createConversation(recipient.user_id, tempConversation.id);
      selectConversation(realConversation);
    } catch (error) {
      console.error('Failed to create conversation:', error);
    }
  };

  const filteredRecipients = availableRecipients.filter((recipient) => {
    const name = recipient.Doctor?.full_name || recipient.Patient?.full_name || 'Unknown';
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (!selectedConversation) {
    return (
      <div className="h-screen bg-linear-to-b from-slate-50 to-slate-100">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 h-full">
          {/* Left Sidebar */}
          <div className={`lg:col-span-1 border-r border-slate-200 bg-white flex flex-col ${mobileMenuOpen ? 'block' : 'hidden'} lg:block`}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="bg-linear-to-br from-blue-600 to-blue-700 text-white p-2 rounded-xl shadow-lg">
                  <MessageSquare size={20} />
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Messages</h1>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Search & New Conversation */}
            <div className="p-4 space-y-3 border-b border-slate-200">
              <div className="relative">
                <Search className="absolute left-3 top-3 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 text-sm transition-all"
                />
              </div>
              <button
                onClick={handleNewConversation}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-linear-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                <Plus size={18} />
                New Message
              </button>
            </div>

            {/* Conversation List */}
            <div className="flex-1 overflow-y-auto">
              <ConversationList onSelectConversation={(conv) => {
                selectConversation(conv);
                setMobileMenuOpen(false);
              }} />
            </div>
          </div>

          {/* Main Area - Empty State */}
          <div className="lg:col-span-2 hidden lg:flex flex-col items-center justify-center bg-white relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-50 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
            </div>

            <div className="relative z-10 text-center space-y-6">
              <div className="bg-linear-to-br from-blue-100 to-blue-50 p-6 rounded-full w-fit mx-auto shadow-lg">
                <MessageSquare size={56} className="text-blue-600" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">No Conversation Selected</h2>
                <p className="text-slate-500 max-w-sm text-center">Select a conversation from the list or start a new one to begin messaging</p>
              </div>
              <button
                onClick={handleNewConversation}
                disabled={loading}
                className="inline-flex items-center gap-2 px-8 py-3 bg-linear-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus size={20} />
                Start Conversation
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Toggle Button */}
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="lg:hidden fixed bottom-6 right-6 p-4 bg-linear-to-r from-blue-600 to-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all z-40"
        >
          <Menu size={24} />
        </button>

        {/* Recipients Modal */}
        {showRecipients && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-hidden flex flex-col animate-in zoom-in duration-200">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-200 bg-linear-to-r from-blue-50 to-slate-50">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Start Conversation</h2>
                <button
                  onClick={() => setShowRecipients(false)}
                  className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Search in modal */}
              <div className="p-4 border-b border-slate-200 bg-slate-50">
                <div className="relative">
                  <Search className="absolute left-3 top-3 text-slate-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search by name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
                  />
                </div>
              </div>

              {/* Recipients List */}
              <div className="flex-1 overflow-y-auto">
                {filteredRecipients.length === 0 ? (
                  <div className="flex items-center justify-center h-40 text-center">
                    <div className="space-y-2">
                      <MessageSquare size={40} className="text-slate-300 mx-auto" />
                      <p className="text-slate-500 text-sm">
                        {searchQuery ? 'No matching recipients' : 'No recipients available'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 p-3">
                    {filteredRecipients.map((recipient) => {
                      const name = recipient.Doctor?.full_name || recipient.Patient?.full_name || 'Unknown';
                      const title = recipient.Doctor?.title || 'Patient';
                      const avatar = recipient.Doctor?.avatar_url;

                      return (
                        <button
                          key={recipient.user_id}
                          onClick={() => handleSelectRecipient(recipient)}
                          className="w-full p-3 text-left hover:bg-blue-50 rounded-xl transition-all border border-slate-200 hover:border-blue-300 hover:shadow-md flex items-center gap-3 group"
                        >
                          {avatar ? (
                            <Image 
                              src={avatar} 
                              alt={name} 
                              width={48}
                              height={48}
                              className="w-12 h-12 rounded-full object-cover" 
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-linear-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold shrink-0">
                              {name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-slate-900 truncate group-hover:text-blue-600 transition-colors">{name}</p>
                            <p className="text-xs text-slate-500">{title}</p>
                          </div>
                          <div className="text-slate-300 group-hover:text-blue-600 transition-colors">
                            <Plus size={20} />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="h-screen bg-linear-to-br from-slate-50 to-slate-100">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 h-full">
        {/* Left Sidebar */}
        <div className="lg:col-span-1 border-r border-slate-200 bg-white hidden lg:flex flex-col shadow-sm">
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <div className="bg-linear-to-br from-blue-600 to-blue-700 text-white p-2 rounded-xl shadow-lg">
                <MessageSquare size={20} />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Messages</h1>
            </div>
          </div>

          {/* Search & New Conversation */}
          <div className="p-4 space-y-3 border-b border-slate-200">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 text-sm transition-all"
              />
            </div>
            <button
              onClick={handleNewConversation}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-linear-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              <Plus size={18} />
              New Message
            </button>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto">
            <ConversationList onSelectConversation={selectConversation} />
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="lg:col-span-2 flex flex-col">
          {selectedConversation && (
            <ChatWindow
              conversation={selectedConversation}
              onBack={() => {
                selectConversation(null!);
              }}
              onClose={() => {
                selectConversation(null!);
              }}
            />
          )}
        </div>
      </div>

      {/* Recipients Modal */}
      {showRecipients && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-hidden flex flex-col animate-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-200 bg-linear-to-r from-blue-50 to-slate-50">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Start Conversation</h2>
              <button
                onClick={() => setShowRecipients(false)}
                className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Search in modal */}
            <div className="p-4 border-b border-slate-200 bg-slate-50">
              <div className="relative">
                <Search className="absolute left-3 top-3 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="Search by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
                />
              </div>
            </div>

            {/* Recipients List */}
            <div className="flex-1 overflow-y-auto">
              {filteredRecipients.length === 0 ? (
                <div className="flex items-center justify-center h-40 text-center">
                  <div className="space-y-2">
                    <MessageSquare size={40} className="text-slate-300 mx-auto" />
                    <p className="text-slate-500 text-sm">
                      {searchQuery ? 'No matching recipients' : 'No recipients available'}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 p-3">
                  {filteredRecipients.map((recipient) => {
                    const name = recipient.Doctor?.full_name || recipient.Patient?.full_name || 'Unknown';
                    const title = recipient.Doctor?.title || 'Patient';
                    const avatar = recipient.Doctor?.avatar_url;

                    return (
                      <button
                        key={recipient.user_id}
                        onClick={() => handleSelectRecipient(recipient)}
                        className="w-full p-3 text-left hover:bg-blue-50 rounded-xl transition-all border border-slate-200 hover:border-blue-300 hover:shadow-md flex items-center gap-3 group"
                      >
                        {avatar ? (
                          <Image 
                            src={avatar} 
                            alt={name} 
                            width={48}
                            height={48}
                            className="w-12 h-12 rounded-full object-cover" 
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-linear-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold shrink-0">
                            {name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-slate-900 truncate group-hover:text-blue-600 transition-colors">{name}</p>
                          <p className="text-xs text-slate-500">{title}</p>
                        </div>
                        <div className="text-slate-300 group-hover:text-blue-600 transition-colors">
                          <Plus size={20} />
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="h-screen bg-linear-to-br from-slate-50 to-slate-100">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 h-full"></div>
        {/* Left Sidebar */}
        <div className="lg:col-span-1 border-r border-slate-200 bg-white hidden lg:flex flex-col shadow-sm">
        <div className="lg:col-span-2">
          <ChatWindow
            conversation={selectedConversation}
            onBack={() => selectConversation(null)}
            onClose={() => selectConversation(null)}
          />
        </div>
      </div>
    </div>
  );
}
