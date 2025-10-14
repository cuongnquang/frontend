export const ConversationItem = ({ conv, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full text-left p-4 flex items-center space-x-3 hover:bg-gray-100 border-b border-gray-200 transition-colors ${
      isActive ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
    }`}
  >
    <div className="relative flex-shrink-0">
      <img className="h-12 w-12 rounded-full ring-2 ring-white" src={conv.avatar} alt={conv.name} />
      {conv.online && <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 ring-2 ring-white"></span>}
      {conv.unread > 0 && (
        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
          {conv.unread}
        </span>
      )}
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex justify-between items-center mb-1">
        <p className={`text-sm font-semibold truncate ${conv.unread > 0 ? 'text-gray-900' : 'text-gray-700'}`}>
          {conv.name}
        </p>
        <p className="text-xs text-gray-500">{conv.time}</p>
      </div>
      <p className={`text-sm truncate ${conv.unread > 0 ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
        {conv.lastMessage}
      </p>
    </div>
  </button>
);