'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, ChevronLeft, Bot, RefreshCw, MapPin, Calendar, Clock, ArrowRight, Stethoscope, History } from 'lucide-react';
import { apiClient } from '@/lib/api';

// --- INTERFACES (Giữ nguyên) ---
interface Message {
  id: string;
  role: 'user' | 'bot';
  content: React.ReactNode;
  createdAt: Date;
}

interface DoctorData {
  doctor_id: string;
  full_name: string;
  title?: string;
  specialty_id?: string;
  avatar_url?: string;
  Specialty?: { name: string };
  clinic_address?: string;
}

interface BotResponse {
    type: 'TEXT' | 'DIAGNOSIS_RESULT' | 'DOCTOR_LIST' | 'BOOKING_SUGGESTION' | 'BOOKING_SUCCESS';
    message: string;
    data?: any;
    analysis?: { detected_disease: string; specialty: string; };
    rag_advice?: string;
    doctors?: DoctorData | DoctorData[];
}

interface AIChatWindowProps {
  onBack: () => void;
}

export function AIChatWindow({ onBack }: AIChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]); // Khởi tạo rỗng để chờ load lịch sử
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [contextDoctor, setContextDoctor] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, loadingHistory]);

  // --- COMPONENT HELPERS (Để tái sử dụng khi load lịch sử) ---
  const DoctorCard = ({ doc }: { doc: DoctorData }) => (
    <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-2 mt-2 hover:shadow-md transition-shadow">
      <div className="flex gap-3 items-center">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold flex-shrink-0 overflow-hidden">
             {doc.avatar_url ? <img src={doc.avatar_url} className="w-full h-full object-cover" /> : doc.full_name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
             <div className="font-bold text-gray-800 text-sm truncate">{doc.title || 'BS'} {doc.full_name}</div>
             <div className="text-xs text-blue-600 font-medium truncate">{doc.Specialty?.name || 'Chuyên khoa'}</div>
        </div>
      </div>
      <div className="flex items-start gap-1.5 text-[11px] text-gray-500 bg-gray-50 p-1.5 rounded">
          <MapPin size={12} className="mt-0.5 flex-shrink-0" />
          <span className="line-clamp-2">{doc.clinic_address || 'Địa chỉ đang cập nhật'}</span>
      </div>
      <button className="w-full mt-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2 rounded-lg flex items-center justify-center gap-2 transition-colors">
          <Calendar size={14} /> Đặt lịch khám
      </button>
    </div>
  );

  const BookingSlots = ({ doctorName, slots, onSelectSlot }: { doctorName: string, slots: any[], onSelectSlot: (time: string) => void }) => {
      const formatTime = (timeInput: string) => {
          if (!timeInput) return "??:??";
          try {
              if (timeInput.includes('T') || timeInput.includes('-')) {
                  const date = new Date(timeInput);
                  if (isNaN(date.getTime())) return timeInput.slice(0, 5);
                  return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false });
              }
              return timeInput.slice(0, 5);
          } catch (e) { return timeInput; }
      };

      return (
        <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm mt-2">
            <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-gray-700">
                <Clock size={16} className="text-blue-500"/> Giờ trống của BS. {doctorName}
            </div>
            <div className="grid grid-cols-3 gap-2">
                {slots.map((slot, idx) => {
                    let timeDisplay = "";
                    let rawTime = "";
                    let key = idx.toString();
                    if (typeof slot === 'object' && slot !== null) {
                        rawTime = slot.start_time || slot.time || "";
                        key = slot.schedule_id || idx.toString();
                    } else { rawTime = String(slot); }
                    timeDisplay = formatTime(rawTime);

                    return (
                        <button key={key} className="text-xs bg-blue-50 text-blue-700 py-2 px-2 rounded-lg border border-blue-100 hover:bg-blue-600 hover:text-white transition-colors font-medium active:scale-95"
                            onClick={() => onSelectSlot(timeDisplay)}
                        >
                            {timeDisplay}
                        </button>
                    );
                })}
            </div>
        </div>
      );
  };

  // --- HÀM TÁI TẠO NỘI DUNG TỪ JSON (Quan trọng) ---
  const renderContentFromData = useCallback((data: BotResponse) => {
      if (!data) return "Tin nhắn bị lỗi.";

      // 1. Chẩn đoán
      if (data.type === 'DIAGNOSIS_RESULT' && data.analysis) {
          const cleanAdvice = data.rag_advice?.replace(/Trang chủ >.*(?:\r\n|\r|\n)/g, '').replace(/https?:\/\/[^\s]+/g, '').substring(0, 300) + "..." || "";
          const doctors = data.doctors ? (Array.isArray(data.doctors) ? data.doctors : [data.doctors]) : [];
          return (
             <div className="flex flex-col gap-2">
                 <div>
                     <p className="font-bold text-blue-700 text-sm mb-1 uppercase flex items-center gap-1">
                         <Stethoscope size={16}/> {data.analysis.detected_disease}
                     </p>
                     <p className="mb-2">Chuyên khoa: <b>{data.analysis.specialty}</b></p>
                     {cleanAdvice && <div className="text-gray-600 italic bg-white/50 p-2 rounded border border-gray-100 text-xs mb-2">💡 {cleanAdvice}</div>}
                 </div>
                 {doctors.length > 0 && (
                     <div className="border-t border-gray-200 pt-2 mt-1">
                         <p className="text-xs font-bold text-gray-500 mb-1 uppercase">Bác sĩ phù hợp:</p>
                         <div className="flex flex-col gap-2">
                             {doctors.map((d: DoctorData) => <DoctorCard key={d.doctor_id} doc={d} />)}
                         </div>
                     </div>
                 )}
             </div>
          );
      }
      
      // 2. Danh sách bác sĩ
      if (Array.isArray(data) || (data.type === 'DOCTOR_LIST' && Array.isArray(data.data))) {
          const docs = Array.isArray(data) ? data : data.data;
          return (
             <div className="flex flex-col gap-2">
                 <p>{data.message || "Danh sách bác sĩ:"}</p>
                 <div className="flex flex-col gap-2">
                     {docs.map((d: DoctorData) => <DoctorCard key={d.doctor_id} doc={d} />)}
                 </div>
             </div>
          );
      }

      // 3. Gợi ý đặt lịch
      if (data.type === 'BOOKING_SUGGESTION' && data.data) {
          return (
              <div>
                  <p className="mb-1">{data.message}</p>
                  <BookingSlots 
                    doctorName={data.data.doctorName || ""} 
                    slots={data.data.slots || []} 
                    onSelectSlot={(time) => handleSendMessage(`Đặt lịch khám với bác sĩ ${data.data.doctorName} vào lúc ${time}`)} 
                  />
              </div>
          );
      }

      // 4. Mặc định
      return data.message || "Tin nhắn văn bản.";
  }, []);

  // --- 1. LOAD LỊCH SỬ CHAT TỪ API ---
  useEffect(() => {
      const fetchHistory = async () => {
          try {
              // Gọi API lấy lịch sử (đã tạo ở Backend)
              // GET /api/medbot/history -> Backend trả về mảng [{ role, content, meta_data, created_at }, ...]
              const res = await apiClient<any>('/api/medbot/history', { method: 'GET' });
              const historyData = res.data || res;

              if (Array.isArray(historyData) && historyData.length > 0) {
                  const mappedMessages = historyData.map((item: any) => ({
                      id: item.id,
                      role: item.role,
                      content: item.role === 'bot' && item.meta_data 
                          ? renderContentFromData(item.meta_data) // Tái tạo Card từ JSON
                          : item.content, // Text thường
                      createdAt: new Date(item.created_at)
                  }));
                  setMessages(mappedMessages);
              } else {
                  // Nếu chưa có lịch sử, hiện tin chào mừng
                  setMessages([{
                      id: 'welcome', role: 'bot', 
                      content: 'Xin chào! Tôi là MediBot AI. Tôi có thể giúp gì cho sức khỏe của bạn hôm nay?', 
                      createdAt: new Date()
                  }]);
              }
          } catch (error) {
              console.error("Lỗi tải lịch sử:", error);
          } finally {
              setLoadingHistory(false);
          }
      };

      fetchHistory();
  }, [renderContentFromData]);

  // --- MAIN HANDLER: Gửi tin nhắn ---
  const handleSendMessage = async (overrideText?: string) => {
    const textToSend = overrideText || inputValue;
    if (!textToSend.trim()) return;

    let apiPrompt = textToSend;
    if (!overrideText && contextDoctor) {
        apiPrompt = `Đặt lịch với bác sĩ ${contextDoctor} vào lúc ${textToSend}`;
    }

    // UI: Tin nhắn User
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', content: textToSend, createdAt: new Date() }]);
    setInputValue('');
    setIsTyping(true);

    try {
      // Gọi API Chat (Backend sẽ tự lưu lịch sử) - Fix: apiClient expects 2 arguments for POST
      const res = await apiClient<any>('/api/medbot/chat', { method: 'POST', body: JSON.stringify({ prompt: apiPrompt }) });
      const apiResponse = res.data || res;

      if (apiResponse) {
          // Render nội dung từ phản hồi mới nhất
          const contentRendered = renderContentFromData(apiResponse);
          
          setMessages(prev => [...prev, {
            id: (Date.now() + 1).toString(),
            role: 'bot',
            content: contentRendered,
            createdAt: new Date(),
          }]);

          // Cập nhật context
          if (apiResponse.type === 'BOOKING_SUGGESTION') setContextDoctor(apiResponse.data.doctorName);
          if (apiResponse.type === 'BOOKING_SUCCESS') setContextDoctor(null);
      }
    } catch (error) {
       setMessages(prev => [...prev, { id: Date.now().toString(), role: 'bot', content: "Lỗi kết nối.", createdAt: new Date() }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearChat = () => {
      // Có thể gọi thêm API xóa lịch sử ở Backend nếu cần
      setMessages([{ id: Date.now().toString(), role: 'bot', content: 'Cuộc trò chuyện đã được làm mới.', createdAt: new Date() }]);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* HEADER */}
      <div className="px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white flex justify-between items-center shadow-md flex-shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="hover:bg-white/20 p-1.5 rounded-full transition-colors"><ChevronLeft size={20} /></button>
          <div className="relative">
            <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center border border-white/30"><Bot size={20} className="text-white" /></div>
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-blue-500 rounded-full animate-pulse"></div>
          </div>
          <div>
            <h3 className="font-bold text-sm">MediBot AI</h3>
            <p className="text-[10px] text-blue-100 flex items-center gap-1"><span className="w-1.5 h-1.5 bg-green-300 rounded-full"></span> Trực tuyến</p>
          </div>
        </div>
        <button onClick={handleClearChat} className="p-2 hover:bg-white/20 rounded-full transition-colors"><RefreshCw size={18} /></button>
      </div>

      {/* MESSAGES AREA */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-[#F0F2F5]">
        {loadingHistory ? (
            <div className="flex justify-center items-center h-full text-gray-400 text-sm">
                <RefreshCw className="animate-spin mr-2" size={16}/> Đang tải lịch sử...
            </div>
        ) : messages.map((msg) => (
          <div key={msg.id} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
            {msg.role === 'bot' && (
               <div className="w-8 h-8 mr-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex-shrink-0 flex items-center justify-center mt-1 shadow-sm border border-white">
                 <Bot size={16} className="text-white" />
               </div>
            )}
            
            <div className={`max-w-[85%] text-[13px] shadow-sm leading-relaxed ${
                msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-2xl rounded-tr-sm px-4 py-3' 
                : 'text-gray-800'
            }`}>
              {msg.role === 'bot' ? (
                  <div className="bg-white p-3 rounded-2xl rounded-tl-sm border border-gray-100">
                      {msg.content}
                      <div className="text-[10px] mt-2 text-right text-gray-400">
                        {msg.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                  </div>
              ) : (
                  <>
                    {msg.content}
                    <div className="text-[10px] mt-1.5 text-right text-blue-200">
                        {msg.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </>
              )}
            </div>
          </div>
        ))}
        
        {isTyping && (
           <div className="flex w-full justify-start items-center gap-2">
             <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-sm"><Bot size={16} className="text-white" /></div>
             <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1.5 h-[46px]">
               <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></span>
               <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-100"></span>
               <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-200"></span>
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT AREA */}
      <div className="p-3 bg-white border-t border-gray-200 sticky bottom-0">
        <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full border border-transparent focus-within:border-blue-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100 transition-all">
          <input type="text" className="flex-1 bg-transparent border-none outline-none text-sm text-gray-800 placeholder-gray-500" placeholder="Mô tả triệu chứng hoặc tìm bác sĩ..." value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()} disabled={isTyping} autoFocus />
          <button onClick={() => handleSendMessage()} disabled={!inputValue.trim() || isTyping} className={`p-2 rounded-full transition-all flex-shrink-0 ${inputValue.trim() && !isTyping ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}><Send size={18} className={inputValue.trim() ? 'ml-0.5' : ''} /></button>
        </div>
      </div>
    </div>
  );
}