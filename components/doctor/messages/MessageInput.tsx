import { Send, Paperclip, Image, Smile } from "lucide-react";

export const MessageInput = ({ messageText, onTextChange, onSend }) => {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="p-4 border-t border-gray-200 bg-white">
      <div className="flex items-end space-x-3">
        <button className="p-2 hover:bg-gray-100 rounded-lg"><Paperclip className="h-5 w-5 text-gray-600" /></button>
        <button className="p-2 hover:bg-gray-100 rounded-lg"><Image className="h-5 w-5 text-gray-600" /></button>
        <div className="flex-1 relative">
          <textarea
            value={messageText}
            onChange={(e) => onTextChange(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Nhập tin nhắn..."
            rows={1}
            className="w-full px-4 py-2.5 bg-gray-50 border text-black focus:outline-none border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          />
        </div>
        <button className="p-2 hover:bg-gray-100 rounded-lg"><Smile className="h-5 w-5 text-gray-600" /></button>
        <button 
          onClick={onSend}
          disabled={!messageText.trim()}
          className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-gray-300 transition-colors"
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};