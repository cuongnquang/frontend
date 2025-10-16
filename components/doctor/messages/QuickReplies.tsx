const QuickReplyButton = ({ text, onClick }) => (
  <button onClick={onClick} className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors">
    {text}
  </button>
);

export const QuickReplies = ({ replies, onQuickReply }) => (
  <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
    <div className="flex items-center space-x-2 overflow-x-auto pb-2">
      <span className="text-xs font-medium text-gray-600 whitespace-nowrap">Trả lời nhanh:</span>
      {replies.map((reply, idx) => (
        <QuickReplyButton key={idx} text={reply} onClick={() => onQuickReply(reply)} />
      ))}
    </div>
  </div>
);