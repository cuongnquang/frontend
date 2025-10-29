import { useState } from 'react';
import { Minimize2, MessageCircle as MessageCircleIcon, Search } from 'lucide-react';
import { Chat } from './FloatingChatWidget';

interface ChatListProps {
  chatList: Chat[];
  onSelectChat: (chat: Chat) => void;
  onClose: () => void;
}

export const ChatList = ({ chatList, onSelectChat, onClose }: ChatListProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDoctors = chatList.filter(chat =>
    chat.type === 'doctor' &&
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-[600px]">
      <div className="bg-linear-to-r from-blue-600 to-indigo-600 px-4 py-4 text-white">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <MessageCircleIcon size={24} />
            <div>
              <h3 className="font-bold text-lg">Tin nhắn</h3>
              <p className="text-xs text-blue-100">Y tế trực tuyến</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
            >
              <Minimize2 size={18} />
            </button>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-blue-300" size={16} />
          <input
            type="text"
            placeholder="Tìm bác sĩ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder-blue-200 text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        <h4 className="text-xs font-semibold text-gray-500 uppercase px-2 py-2">
          Bác sĩ của bạn
        </h4>
        {filteredDoctors.length > 0 ? (
          filteredDoctors.map((chat) => (
            <button
              key={chat.id}
              onClick={() => onSelectChat(chat)}
              className="w-full p-3 hover:bg-gray-50 rounded-xl transition-all text-left mb-1"
            >
              <div className="flex items-start gap-3">
                <div className="relative">
                  <div className="text-3xl">{chat.avatar}</div>
                  {chat.status === 'online' && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>}
                  {chat.unread > 0 && <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">{chat.unread}</div>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <h3 className="font-bold text-gray-800 text-sm truncate">{chat.name}</h3>
                    <span className="text-xs text-gray-500 ml-2 shrink-0">{chat.lastTime && new Date(chat.lastTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="text-xs text-blue-600 font-medium mb-0.5">{chat.specialty}</p>
                  <p className="text-xs text-gray-600 truncate">{chat.lastMessage}</p>
                </div>
              </div>
            </button>
          ))
        ) : (
          <p className="text-center text-gray-500 text-sm py-6">
            Không tìm thấy bác sĩ nào.
          </p>
        )}
      </div>
    </div>
  );
};
