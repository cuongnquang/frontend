'use client';
import { useState } from "react";
import { ChatHeader } from "./ChatHeader";
import { MessageList } from "./MessageList";
import { QuickReplies } from "./QuickReplies";
import { MessageInput } from "./MessageInput";
import { EmptyChat } from "./EmptyChat";
import { quickReplies } from "@/app/doctor/data";

export const ChatWindow = ({ conversation, messages }) => {
  const [messageText, setMessageText] = useState("");

  const handleSendMessage = (text = messageText) => {
    if (!text.trim()) return;
    console.log("Sending message:", text, "to", conversation.id);
    // Logic gửi tin nhắn sẽ ở đây
    setMessageText("");
  };
  
  if (!conversation) {
    return <EmptyChat />;
  }

  return (
    <div className="flex-1 flex-col hidden md:flex">
      <ChatHeader conversation={conversation} />
      <MessageList messages={messages} activeConversation={conversation} />
      <QuickReplies replies={quickReplies} onQuickReply={handleSendMessage} />
      <MessageInput 
        messageText={messageText}
        onTextChange={setMessageText}
        onSend={() => handleSendMessage()}
      />
    </div>
  );
};