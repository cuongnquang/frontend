import { CheckCheck } from "lucide-react";

export const MessageBubble = ({ msg, avatar }) => (
  <div className={`flex ${msg.sender === 'doctor' ? 'justify-end' : 'justify-start'}`}>
    <div className={`flex items-end space-x-2 max-w-lg ${msg.sender === 'doctor' ? 'flex-row-reverse space-x-reverse' : ''}`}>
      {msg.sender === 'patient' && (
        <img className="h-8 w-8 rounded-full flex-shrink-0" src={avatar} alt="" />
      )}
      <div>
        <div className={`px-4 py-2.5 rounded-2xl ${
          msg.sender === 'doctor' 
            ? 'bg-blue-600 text-white rounded-br-none' 
            : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-sm'
        }`}>
          <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
        </div>
        <div className={`flex items-center mt-1 space-x-1 ${msg.sender === 'doctor' ? 'justify-end' : ''}`}>
          <span className="text-xs text-gray-500">{msg.time}</span>
          {msg.sender === 'doctor' && (
            <CheckCheck className={`h-3.5 w-3.5 ${msg.read ? 'text-blue-600' : 'text-gray-400'}`} />
          )}
        </div>
      </div>
    </div>
  </div>
);