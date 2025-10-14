'use client';
import { useState } from "react";
import { conversations, messageHistory } from "../data";
import { ConversationList } from "@/components/doctor/messages/ConversationList";
import { ChatWindow } from "@/components/doctor/messages/ChatWindow";

export default function MessagesPage() {
  const [activeConversationId, setActiveConversationId] = useState("c2");

  const activeConversation = conversations.find(c => c.id === activeConversationId);
  const activeMessages = messageHistory[activeConversationId] || [];

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
      <ConversationList 
        conversations={conversations}
        activeConversationId={activeConversationId}
        onConversationSelect={setActiveConversationId}
      />
      <ChatWindow
        conversation={activeConversation}
        messages={activeMessages}
      />
    </div>
  );
}