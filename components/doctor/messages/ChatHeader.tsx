import { MoreVertical, Phone, Video, Info } from "lucide-react";

export const ChatHeader = ({ conversation }) => (
  <div className="p-4 border-b border-gray-200 bg-white flex items-center justify-between">
    <div className="flex items-center space-x-3">
      <div className="relative">
        <img className="h-11 w-11 rounded-full ring-2 ring-gray-100" src={conversation.avatar} alt={conversation.name} />
        {conversation.online && <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 ring-2 ring-white"></span>}
      </div>
      <div>
        <h2 className="text-base font-semibold text-gray-900">{conversation.name}</h2>
        <p className="text-sm text-gray-500">{conversation.online ? 'Đang hoạt động' : 'Không hoạt động'}</p>
      </div>
    </div>
    <div className="flex items-center space-x-2">
      <button className="p-2 hover:bg-gray-100 rounded-lg" title="Gọi điện"><Phone className="h-5 w-5 text-gray-600" /></button>
      <button className="p-2 hover:bg-gray-100 rounded-lg" title="Gọi video"><Video className="h-5 w-5 text-gray-600" /></button>
      <button className="p-2 hover:bg-gray-100 rounded-lg" title="Thông tin"><Info className="h-5 w-5 text-gray-600" /></button>
      <button className="p-2 hover:bg-gray-100 rounded-lg"><MoreVertical className="h-5 w-5 text-gray-600" /></button>
    </div>
  </div>
);