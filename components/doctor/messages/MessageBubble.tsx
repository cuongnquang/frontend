import { CheckCheck } from "lucide-react";
import { Message } from '@/contexts/MessageContext';

interface MessageBubbleProps {
  msg: Message;
  avatar?: string;
  isMine: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ msg, avatar, isMine }) => {
  const createdAt = msg.createdAt || (msg as any).created_at;
  const timeLabel = createdAt ? new Date(createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
  
  return (
    <div className={`flex ${isMine ? 'justify-end' : 'justify-start'} mb-4 animate-in fade-in slide-in-from-bottom-2 duration-300`}>
      <div className={`flex items-end gap-2 max-w-[70%] ${isMine ? 'flex-row-reverse' : ''}`}>
        {!isMine && (
          <img 
            src={avatar} 
            alt="Avatar" 
            className="w-8 h-8 rounded-full flex-shrink-0 shadow-sm"
          />
        )}
        <div className="flex flex-col">
          <div
            className={`px-4 py-3 rounded-2xl shadow-sm ${
              isMine
                ? 'bg-gradient-to-br from-blue-600 to-blue-500 text-white rounded-br-sm'
                : 'bg-white text-gray-800 border border-gray-200 rounded-bl-sm'
            }`}
          >
            <p className="text-sm leading-relaxed">{msg.content}</p>
          </div>
          <div className={`flex items-center mt-1 text-xs ${isMine ? 'justify-end text-gray-400' : 'text-gray-500'}`}>
            <time dateTime={msg.createdAt || ''} className="mr-1">{timeLabel}</time>
            {isMine && (
              <CheckCheck className={`h-3 w-3 ${msg.isDeleted ? 'text-gray-400' : 'text-blue-500'}`} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};