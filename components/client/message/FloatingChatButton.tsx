import { MessageCircle } from 'lucide-react';

interface FloatingChatButtonProps {
  onClick: () => void;
  unreadTotal: number;
}

export const FloatingChatButton = ({ onClick, unreadTotal }: FloatingChatButtonProps) => (
  <button
    onClick={onClick}
    className="w-16 h-16 bg-linear-to-br from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center group relative"
  >
    <MessageCircle size={28} className="transition-transform group-hover:scale-110" />
    {unreadTotal > 0 && (
      <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white animate-pulse">
        {unreadTotal}
      </div>
    )}
  </button>
);
