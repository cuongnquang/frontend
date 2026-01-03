import { MoreVertical, Trash2, Edit2 } from "lucide-react";
import { Message } from '@/contexts/MessageContext';
import { useState } from "react";

interface MessageBubbleProps {
  msg: Message;
  avatar?: string;
  isMine: boolean;
  onEdit?: (msg: Message) => void;
  onDelete?: (msgId: string) => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ msg, avatar, isMine, onEdit, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);
  const createdAt = msg.createdAt || (msg as any).created_at;
  const timeLabel = createdAt ? new Date(createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
  
  const handleEdit = () => {
    if (onEdit) onEdit(msg);
    setShowMenu(false);
  };

  const handleDelete = () => {
    if (onDelete) onDelete(msg.id);
    setShowMenu(false);
  };
  
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
        <div className="flex flex-col relative group">
          {/* Menu 3 chấm bên trái cho tin nhắn của tôi */}
          {isMine && !msg.isDeleted && (
            <div className="absolute -left-10 top-0 flex items-center">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1.5 hover:bg-gray-200 rounded-full transition-colors opacity-0 group-hover:opacity-100"
              >
                <MoreVertical size={16} className="text-blue-500" />
              </button>
              
              {showMenu && (
                <div className="absolute left-0 top-8 w-32 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
                  <button
                    onClick={handleEdit}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-blue-50 flex items-center gap-2 text-blue-600 border-b"
                  >
                    <Edit2 size={14} />
                    Sửa
                  </button>
                  <button
                    onClick={handleDelete}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 flex items-center gap-2 text-red-600"
                  >
                    <Trash2 size={14} />
                    Xóa
                  </button>
                </div>
              )}
            </div>
          )}

          <div
            className={`px-4 py-3 rounded-2xl shadow-sm ${
              isMine
                ? 'bg-gradient-to-br from-blue-600 to-blue-500 text-white rounded-br-sm'
                : 'bg-white text-gray-800 border border-gray-200 rounded-bl-sm'
            }`}
          >
            {msg.isDeleted ? (
              <p className="text-sm italic opacity-60">[Tin nhắn đã được thu hồi]</p>
            ) : (
              <p className="text-sm leading-relaxed">{msg.content}</p>
            )}
          </div>
          <div className={`flex items-center mt-1 text-xs ${isMine ? 'justify-end text-gray-400' : 'text-gray-500'}`}>
            <time dateTime={msg.createdAt || ''} className="">{timeLabel}</time>
          </div>
        </div>
      </div>
    </div>
  );
};