import { Conversation } from "@/contexts/MessageContext";

interface ConversationItemProps {
  conv: Conversation;
  isActive: boolean;
  onClick: () => void;
}

export const ConversationItem = ({ conv, isActive, onClick }: ConversationItemProps) => (
  <button
    onClick={onClick}
    className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-all duration-200 border-l-4 ${
      isActive 
        ? 'bg-gradient-to-r from-blue-50 to-transparent border-blue-500' 
        : 'border-transparent hover:bg-gray-50'
    }`}
  >
    <div className="relative flex-shrink-0">
      <img 
        className="h-12 w-12 rounded-full object-cover ring-2 ring-white shadow-sm" 
        src={conv.avatar} 
        alt={conv.name} 
      />
      {conv.online && (
        <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 ring-2 ring-white"></span>
      )}
      {conv.unread > 0 && (
        <span className="absolute -top-1 -right-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white px-1.5 shadow-sm">
          {conv.unread}
        </span>
      )}
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex justify-between items-center mb-1">
        <p className={`text-sm font-semibold truncate ${conv.unread > 0 ? 'text-gray-900' : 'text-gray-700'}`}>
          {conv.name}
        </p>
        <p className="text-xs text-gray-400 ml-2 flex-shrink-0">{conv.time}</p>
      </div>
      <p className={`text-sm truncate ${conv.unread > 0 ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
        {conv.lastMessage}
      </p>
    </div>
  </button>
);