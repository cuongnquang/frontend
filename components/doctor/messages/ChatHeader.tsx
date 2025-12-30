import React from "react";
import { MoreVertical, Phone, Video, Info } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import type { Conversation } from '@/contexts/MessageContext';

interface ChatHeaderProps {
  conversation?: Conversation | null;
  onToggleInfo?: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ conversation, onToggleInfo }) => {
  const { user } = useAuth();
  // Prefer participant info, otherwise try to derive the other user from recent messages
  let other = conversation?.participants?.find(p => p.user.user_id !== user?.user_id)?.user;
  if (!other && conversation?.messages && conversation.messages.length > 0) {
    const recent = conversation.messages.find(m => m.senderId && m.senderId !== user?.user_id);
    other = recent?.sender ?? other;
  }

  const name = other?.Doctor?.full_name || other?.Patient?.full_name || conversation.name || 'Không rõ';
  const avatar = other?.Doctor?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${name}`;
  const online = conversation.online || false;
  const roleLabel = other?.role === 'patient' ? 'Bệnh nhân' : other?.role === 'doctor' ? 'Bác sĩ' : '';
  const roleClass = other?.role === 'doctor' 
    ? 'bg-blue-50 text-blue-700 border border-blue-200' 
    : 'bg-purple-50 text-purple-700 border border-purple-200';

  return (
    <div className="px-4 py-3 border-b border-gray-200 bg-white/80 backdrop-blur-sm flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-3 min-w-0">
        <div className="relative flex-shrink-0">
          <img 
            className="h-10 w-10 rounded-full ring-2 ring-white object-cover shadow-sm" 
            src={avatar} 
            alt={name} 
          />
          {online && (
            <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white"></span>
          )}
        </div>
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-gray-900 truncate">{name}</h2>
          <p className="text-xs text-gray-500 flex items-center gap-1.5">
            {roleLabel && (
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${roleClass}`}>
                {roleLabel}
              </span>
            )}
            <span className="text-gray-400">•</span>
            <span>{online ? 'Đang hoạt động' : 'Không hoạt động'}</span>
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1 flex-shrink-0">
        <button className="p-2 hover:bg-gray-100 rounded-md" title="Gọi điện"><Phone className="h-4 w-4 text-gray-600" /></button>
        <button className="p-2 hover:bg-gray-100 rounded-md" title="Gọi video"><Video className="h-4 w-4 text-gray-600" /></button>
        <button 
          onClick={onToggleInfo} 
          className="p-2 hover:bg-gray-100 rounded-md" 
          title="Thông tin"
        >
          <MoreVertical className="h-4 w-4 text-gray-600" />
        </button>
      </div>
    </div>
  );
};