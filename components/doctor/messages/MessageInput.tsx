import React, { useRef, useEffect } from "react";
import { Send, Paperclip, Image, Smile } from "lucide-react";

interface MessageInputProps {
  messageText: string;
  onTextChange: (text: string) => void;
  onSend: () => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({ messageText, onTextChange, onSend }) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const newHeight = Math.min(textareaRef.current.scrollHeight, 120);
      textareaRef.current.style.height = `${newHeight}px`;
    }
  }, [messageText]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="p-4 border-t border-gray-200 bg-white/80 backdrop-blur-sm">
      <div className="flex items-end gap-2">
        <button aria-label="Tệp đính kèm" title="Đính kèm tệp" className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors flex-shrink-0"><Paperclip className="h-5 w-5 text-gray-600" /></button>
        <button aria-label="Ảnh" title="Thêm ảnh" className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors flex-shrink-0"><Image className="h-5 w-5 text-gray-600" /></button>
        <div className="flex-1 relative min-w-0">
          <textarea
            ref={textareaRef}
            value={messageText}
            onChange={(e) => onTextChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Nhập tin nhắn..."
            rows={1}
            aria-label="Nội dung tin nhắn"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all"
            style={{ minHeight: '44px', maxHeight: '120px' }}
          />
        </div>
        <button aria-label="Emoji" title="Thêm biểu tượng" className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors flex-shrink-0"><Smile className="h-5 w-5 text-gray-600" /></button>
        <button 
          onClick={onSend}
          aria-label="Gửi tin nhắn"
          title="Gửi"
          disabled={!messageText.trim()}
          className="p-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex-shrink-0 disabled:hover:shadow-none"
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};