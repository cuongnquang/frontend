import { Search } from "lucide-react";

export const EmptyChat = () => (
  <div className="flex-1 flex items-center justify-center text-gray-500">
    <div className="text-center">
      <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
      <p>Chọn một cuộc hội thoại để bắt đầu nhắn tin</p>
    </div>
  </div>
);