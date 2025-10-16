'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Clock, Stethoscope, Calendar, MapPin, Star, Heart, CheckCircle, XCircle } from 'lucide-react';

// Dữ liệu và Types giữ nguyên như phiên bản trước
type Slot = { iso: string, date: Date };
type Doctor = { id: string; name: string; specialty: string; experienceYears: number; clinicAddress: string; rating: number; bio: string; availableSlots: string[] };
type ChatMessage = { 
  id: string; 
  sender: 'user' | 'bot'; 
  text: string; 
  timestamp: Date; 
  options?: string[]; 
  relatedDoctorId?: string; 
  bookingStep?: 'select_time' | 'confirm_booking' | 'doctor_info' | 'final_confirm';
};

const mockDoctors: Doctor[] = [
  {
    id: 'd001',
    name: 'TS.BS Nguyễn Văn A',
    specialty: 'Tim mạch',
    experienceYears: 15,
    clinicAddress: '123 Đường Nguyễn Huệ, Q.1, TP.HCM',
    rating: 4.8,
    bio: 'Chuyên gia tim mạch với hơn 15 năm kinh nghiệm. Đã thực hiện thành công hơn 1000 ca phẫu thuật tim mạch phức tạp.',
    availableSlots: ['2025-10-20T09:00:00', '2025-10-20T14:30:00', '2025-10-21T10:00:00'],
  },
  {
    id: 'd002',
    name: 'BS.CK1 Trần Thị B',
    specialty: 'Nội tiết',
    experienceYears: 10,
    clinicAddress: '456 Đường Lê Lợi, Q.3, TP.HCM',
    rating: 4.6,
    bio: 'Chuyên khoa nội tiết, điều trị tiểu đường và các rối loạn tuyến giáp.',
    availableSlots: ['2025-10-22T10:00:00', '2025-10-23T15:00:00', '2025-10-24T09:00:00'],
  },
  {
    id: 'd003',
    name: 'BS Lê Văn C',
    specialty: 'Nha khoa',
    experienceYears: 8,
    clinicAddress: '789 Đường Trần Hưng Đạo, Q.5, TP.HCM',
    rating: 4.7,
    bio: 'Bác sĩ nha khoa thẩm mỹ và chỉnh nha, với phương châm mang lại nụ cười hoàn hảo cho mọi bệnh nhân.',
    availableSlots: ['2025-10-24T08:30:00', '2025-10-25T13:00:00'],
  },
];

// --- HELPER FUNCTIONS ---
const formatDateTime = (isoString: string) => {
  const date = new Date(isoString);
  const time = date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  const day = date.toLocaleDateString('vi-VN', { weekday: 'short', day: '2-digit', month: '2-digit' });
  return { time, day };
};

const formatTimeOnly = (date: Date) => date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

// --- UI COMPONENTS ---

const DoctorCard: React.FC<{ doctor: Doctor }> = ({ doctor }) => (
  <div className="mt-4 p-4 bg-white rounded-xl border-2 border-blue-100 shadow-md transition-all duration-300">
    <div className="flex items-center gap-3 border-b border-gray-100 pb-2 mb-2">
        <Heart className="w-5 h-5 text-red-500 fill-red-500 flex-shrink-0" />
        <h5 className="text-xl font-bold text-blue-800 leading-tight">{doctor.name}</h5>
    </div>
    
    <p className="text-base text-gray-700 font-medium my-2">{doctor.specialty} | {doctor.experienceYears} năm kinh nghiệm</p>
    
    <div className="flex justify-between items-center text-sm">
        <span className="flex items-center text-yellow-600 font-semibold">
            <Star className="w-4 h-4 fill-yellow-500 mr-1" />
            Đánh giá: {doctor.rating}
        </span>
        <span className="flex items-center text-gray-500">
            <MapPin className="w-4 h-4 mr-1 text-blue-500" />
            {doctor.clinicAddress.split(',')[0]}
        </span>
    </div>
    <p className="text-sm text-gray-600 mt-2 italic border-t border-gray-100 pt-2">{doctor.bio}</p>
  </div>
);

const DoctorSlots: React.FC<{ doctor: Doctor, handleSelect: (slot: string) => void }> = ({ doctor, handleSelect }) => {
  const today = new Date();
  const futureSlots: Slot[] = doctor.availableSlots
    .map(iso => ({ iso, date: new Date(iso) }))
    .filter(slot => slot.date.getTime() > today.getTime() + 60000) 
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  if (futureSlots.length === 0) return <p className="text-red-500 italic mt-3">Rất tiếc, bác sĩ không có lịch trống trong tương lai gần.</p>;

  const slotsByDay = futureSlots.reduce((acc, slot) => {
    const dayKey = formatDateTime(slot.iso).day;
    if (!acc[dayKey]) acc[dayKey] = [];
    acc[dayKey].push(slot);
    return acc;
  }, {} as Record<string, Slot[]>);

  return (
    <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200 shadow-inner">
      <h4 className="font-bold text-blue-700 mb-3 flex items-center gap-2 text-lg">
          <Calendar className="w-5 h-5 text-blue-600" /> Chọn Lịch Khám Trống:
      </h4>
      {Object.entries(slotsByDay).map(([day, slots]) => (
        <div key={day} className="mb-4 p-3 bg-white rounded-lg shadow-sm border-l-4 border-cyan-500">
          <h5 className="font-semibold text-gray-800 mb-2">{day}</h5>
          <div className="flex flex-wrap gap-2">
            {slots.map((slot) => (
              <button
                key={slot.iso}
                onClick={() => handleSelect(slot.iso)}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-full text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-1 transform hover:scale-[1.05]"
              >
                <Clock className="w-4 h-4" />
                {formatTimeOnly(slot.date)}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// --- MAIN COMPONENT ---
const ChatAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentBooking, setCurrentBooking] = useState<{ doctorId?: string, doctorName?: string, slot?: string } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getDoctorBySpecialty = (specialty: string) => {
    return mockDoctors.find(d => d.specialty.toLowerCase().includes(specialty.toLowerCase()));
  };

  const handleBotResponse = (userMessage: string) => {
    setIsTyping(true);

    setTimeout(() => {
      let newBotMessage: ChatMessage = {
        id: Date.now().toString(),
        sender: 'bot',
        text: 'Xin lỗi, tôi không hiểu yêu cầu của bạn. Vui lòng chọn một tùy chọn hoặc nhập "Đặt lịch" để bắt đầu. 😊',
        timestamp: new Date(),
        options: ['Đặt lịch khám', 'Tìm bác sĩ', 'Tư vấn dịch vụ'],
        bookingStep: 'doctor_info',
      };

      const lowerMsg = userMessage.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

      // 1. --- BOOKING CONFIRMATION STEP ---
      if (currentBooking?.slot && lowerMsg.includes('xác nhận đặt lịch')) {
        const bookedDoctor = mockDoctors.find(d => d.id === currentBooking.doctorId);
        const { time, day } = formatDateTime(currentBooking.slot);
        newBotMessage = {
          id: Date.now().toString(),
          sender: 'bot',
          text: `🎉 **ĐẶT LỊCH THÀNH CÔNG!**\n\nBạn đã đặt lịch khám với **${bookedDoctor?.name}** (${bookedDoctor?.specialty}).\n\n⏰ **Thời gian:** ${time}, ${day}\n📍 **Địa điểm:** ${bookedDoctor?.clinicAddress}\n\nVui lòng kiểm tra email xác nhận. Hẹn gặp bạn!`,
          timestamp: new Date(),
          bookingStep: 'final_confirm',
        };
        setCurrentBooking(null);

      // 2. --- TIME SLOT SELECTION/BOOKING INITIATION ---
      } else if (currentBooking?.doctorId && (lowerMsg.includes('đặt lịch ngay') || lowerMsg.includes('xem chi tiết & đặt lịch'))) {
        const doctor = mockDoctors.find(d => d.id === currentBooking.doctorId);
        if (doctor && doctor.availableSlots.length > 0) {
          newBotMessage = {
            id: Date.now().toString(),
            sender: 'bot',
            text: `Bạn muốn đặt lịch với **${doctor.name}**. Vui lòng chọn khung giờ trống bên dưới:`,
            timestamp: new Date(),
            relatedDoctorId: doctor.id,
            bookingStep: 'select_time',
          };
        } else {
          newBotMessage = {
            id: Date.now().toString(),
            sender: 'bot',
            text: `Rất tiếc, ${doctor?.name} hiện không có lịch trống. Bạn có muốn tìm bác sĩ khác?`,
            timestamp: new Date(),
            options: ['Tìm bác sĩ khác'],
            bookingStep: 'doctor_info',
          };
          setCurrentBooking(null);
        }
        
      // 3. --- SPECIFIC TIME SLOT CHOSEN ---
      } else if (currentBooking?.doctorId && lowerMsg.startsWith('slot_')) {
        const slot = lowerMsg.substring(5);
        const doctor = mockDoctors.find(d => d.id === currentBooking.doctorId);
        const { time, day } = formatDateTime(slot);

        setCurrentBooking(prev => ({ ...prev, slot }));

        newBotMessage = {
          id: Date.now().toString(),
          sender: 'bot',
          text: `Bạn đã chọn lịch khám **${doctor?.specialty}** với **${doctor?.name}** vào lúc **${time}** ngày **${day}**.\n\nBạn có muốn **xác nhận đặt lịch** không?`,
          timestamp: new Date(),
          options: ['Xác nhận đặt lịch', 'Chọn lại khung giờ'],
          bookingStep: 'confirm_booking',
        };

      // 4. --- SPECIALTY SEARCH/INITIAL INTENTS ---
      } else if (lowerMsg.includes('đặt lịch') || lowerMsg.includes('dat lich') || lowerMsg.includes('chọn lại khung giờ')) {
        setCurrentBooking(null);
        newBotMessage = {
          id: Date.now().toString(),
          sender: 'bot',
          text: 'Vui lòng cho biết bạn muốn đặt lịch khám **chuyên khoa** nào? 🏥',
          timestamp: new Date(),
          options: ['Tim mạch', 'Nội tiết', 'Nha khoa', 'Tìm bác sĩ khác'],
          bookingStep: 'doctor_info',
        };
      } else if (lowerMsg.includes('tìm bác sĩ') || lowerMsg.includes('tim bac si') || lowerMsg.includes('tìm bác sĩ khác')) {
        setCurrentBooking(null);
        newBotMessage = {
          id: Date.now().toString(),
          sender: 'bot',
          text: 'Bạn muốn tìm bác sĩ chuyên khoa nào? 👨‍⚕️',
          timestamp: new Date(),
          options: ['Tim mạch', 'Nội tiết', 'Nha khoa'],
          bookingStep: 'doctor_info',
        };
      } else if (lowerMsg.includes('tư vấn dịch vụ') || lowerMsg.includes('tu van dich vu')) {
        newBotMessage = {
          id: Date.now().toString(),
          sender: 'bot',
          text: 'Dịch vụ nào bạn đang quan tâm? (Ví dụ: Khám tổng quát, Xét nghiệm máu, Chụp X-quang)',
          timestamp: new Date(),
          options: ['Khám Tổng Quát', 'Xét Nghiệm Máu'],
        };

      // 5. --- DOCTOR SPECIALTY RESULTS ---
      } else if (['tim mạch', 'tim mach', 'nội tiết', 'noi tiet', 'nha khoa'].some(term => lowerMsg.includes(term))) {
        const specialty = lowerMsg.includes('tim mạch') || lowerMsg.includes('tim mach') ? 'Tim mạch' : lowerMsg.includes('nội tiết') || lowerMsg.includes('noi tiet') ? 'Nội tiết' : 'Nha khoa';
        const foundDoctor = getDoctorBySpecialty(specialty);

        if (foundDoctor) {
          setCurrentBooking({ doctorId: foundDoctor.id, doctorName: foundDoctor.name });
          newBotMessage = {
            id: Date.now().toString(),
            sender: 'bot',
            text: `Tôi tìm thấy bác sĩ chuyên khoa **${foundDoctor.specialty}** phù hợp nhất.`,
            timestamp: new Date(),
            relatedDoctorId: foundDoctor.id,
            options: ['Đặt lịch ngay', 'Tìm bác sĩ khác'],
            bookingStep: 'doctor_info',
          };
        } else {
          newBotMessage = {
            id: Date.now().toString(),
            sender: 'bot',
            text: `Rất tiếc, tôi không tìm thấy bác sĩ chuyên khoa ${specialty} nào phù hợp. Bạn muốn tìm chuyên khoa khác không?`,
            timestamp: new Date(),
            options: ['Tim mạch', 'Nội tiết', 'Nha khoa'],
            bookingStep: 'doctor_info',
          };
        }
      } else {
          // Initial greeting / fallback
          if (messages.length === 0) {
            newBotMessage = {
              id: Date.now().toString(),
              sender: 'bot',
              text: 'Xin chào! Tôi là **Trợ Lý Y Tế AI**. Tôi có thể giúp bạn đặt lịch khám hoặc tìm kiếm thông tin y tế. 😊',
              timestamp: new Date(),
              options: ['Đặt lịch khám', 'Tìm bác sĩ', 'Tư vấn dịch vụ'],
              bookingStep: 'doctor_info',
            };
          }
      } 

      setMessages((prev) => [...prev, newBotMessage]);
      setIsTyping(false);
    }, 800);
  };

  const handleSlotSelect = (slotISO: string) => {
      const newUserMessage: ChatMessage = {
        id: Date.now().toString(),
        sender: 'user',
        text: `Tôi chọn lịch khám vào lúc ${formatDateTime(slotISO).time} ngày ${formatDateTime(slotISO).day}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, newUserMessage]);
      handleBotResponse(`slot_${slotISO}`);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const newUserMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: userInput.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setUserInput('');
    handleBotResponse(newUserMessage.text);
  };

  const handleOptionClick = (option: string) => {
    const newUserMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: option,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    handleBotResponse(option);
  };

  useEffect(() => {
    handleBotResponse('');
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* <Header/> // Placeholder for Header */}
      
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden">
          
          {/* Header Chat Window - Navy Blue Theme */}
          <div className="bg-blue-800 p-6 text-white border-b-4 border-cyan-400">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
                <Stethoscope className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight">Trợ Lý Y Tế Thông Minh</h1>
                <p className="text-blue-200 text-sm flex items-center gap-1 mt-1 font-medium">
                  <span className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse"></span>
                  Trực tuyến 24/7 | Sẵn sàng hỗ trợ
                </p>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="h-[600px] overflow-y-auto p-6 space-y-6 bg-white">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-4 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
              >
                {/* BOT Avatar */}
                {msg.sender === 'bot' && (
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                )}
                
                {/* Message Bubble */}
                <div className={`max-w-[75%] ${msg.sender === 'user' ? 'order-first' : ''}`}>
                  <div
                    className={`rounded-xl p-4 shadow-lg transition-all duration-200 ${
                      msg.sender === 'user'
                        ? 'bg-blue-800 text-white rounded-br-none font-medium'
                        : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none'
                    }`}
                  >
                    {/* Final Confirmation Message - Special Styling */}
                    {msg.bookingStep === 'final_confirm' ? (
                       <div className="flex items-center gap-3 text-green-700 bg-green-50 p-3 rounded-lg font-bold border-l-4 border-green-500">
                           <CheckCircle className="w-6 h-6 fill-green-500 text-white" />
                           <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>
                       </div>
                    ) : (
                        <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>
                    )}

                    {/* Conditional Doctor Card */}
                    {msg.relatedDoctorId && (msg.bookingStep === 'doctor_info' || msg.bookingStep === 'confirm_booking') && (
                        <DoctorCard doctor={mockDoctors.find(d => d.id === msg.relatedDoctorId) as Doctor} />
                    )}

                    {/* Conditional Slot Selector */}
                    {msg.relatedDoctorId && msg.bookingStep === 'select_time' && (
                        <DoctorSlots 
                            doctor={mockDoctors.find(d => d.id === msg.relatedDoctorId) as Doctor} 
                            handleSelect={handleSlotSelect}
                        />
                    )}

                    {/* General Options - "Pill buttons" */}
                    {msg.options && msg.bookingStep !== 'select_time' && (
                      <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-gray-100">
                        {msg.options.map((option) => (
                          <button
                            key={option}
                            onClick={() => handleOptionClick(option)}
                            className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-full text-sm font-semibold transition-all duration-300 shadow-sm hover:shadow-md active:scale-[0.98]"
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Timestamp */}
                  <div className={`flex items-center gap-1 mt-1 text-xs text-gray-400 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                    <Clock className="w-3 h-3" />
                    {msg.timestamp.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>

                {/* USER Avatar */}
                {msg.sender === 'user' && (
                  <div className="flex-shrink-0 w-12 h-12 bg-gray-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                    <User className="w-6 h-6 text-white" />
                  </div>
                )}
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex gap-4 justify-start animate-fade-in">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div className="bg-white border border-gray-200 rounded-xl rounded-tl-none p-4 shadow-md">
                  <div className="flex gap-1">
                    <span className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-bounce"></span>
                    <span className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                    <span className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 bg-gray-50 p-5">
            <form onSubmit={handleSubmit} className="flex gap-4">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Nhập câu hỏi, chuyên khoa hoặc yêu cầu đặt lịch..."
                className="flex-1 px-5 py-3 border-2 border-blue-300 rounded-full focus:outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-300 transition-all duration-200 text-gray-800 shadow-inner"
              />
              <button
                type="submit"
                disabled={!userInput.trim() || isTyping}
                className="px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-full font-bold transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Send className="w-5 h-5" />
                Gửi
              </button>
            </form>
            <p className="text-xs text-gray-400 mt-3 text-center">
              💡 Thông tin chỉ mang tính tham khảo. Vui lòng tham khảo ý kiến bác sĩ để được chẩn đoán chính xác.
            </p>
          </div>
        </div>
      </main>
      
      {/* <Footer /> // Placeholder for Footer */}
      
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-bounce span { animation: bounce 0.6s infinite alternate; }
        .animate-bounce span:nth-child(2) { animation-delay: 0.2s; }
        .animate-bounce span:nth-child(3) { animation-delay: 0.4s; }
      `}</style>
    </div>
  );
};

export default ChatAssistant;