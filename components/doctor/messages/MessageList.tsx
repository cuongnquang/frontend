import { MessageBubble } from "./MessageBubble";

export const MessageList = ({ messages, activeConversation }) => (
  <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
    {messages.map(msg => (
      <MessageBubble 
        key={msg.id}
        msg={msg}
        avatar={activeConversation.avatar}
      />
    ))}
  </div>
);