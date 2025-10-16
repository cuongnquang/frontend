import { 
  Calendar, 
  CheckCircle2, 
  MessageSquare, 
  Users
} from "lucide-react";

// Dữ liệu cho StatsGrid
export const statsData = [
  { title: "Lịch hẹn hôm nay", value: "12", change: "+2", trend: "up", icon: Calendar, color: "blue" },
  { title: "Đã hoàn thành", value: "8", change: "+1", trend: "up", icon: CheckCircle2, color: "green" },
  { title: "Tin nhắn mới", value: "5", icon: MessageSquare, color: "yellow" },
  { title: "Bệnh nhân đang chờ", value: "3", icon: Users, color: "purple" },
];

// Dữ liệu cho UpcomingAppointments
export const appointmentsData = [
  { patient: "Nguyễn Văn A", time: "9:00 - 9:30", type: "offline", status: "confirmed", isUrgent: false },
  { patient: "Trần Thị B", time: "9:30 - 10:00", type: "online", status: "confirmed", isUrgent: true },
  { patient: "Lê Văn C", time: "10:00 - 10:30", type: "offline", status: "pending", isUrgent: false },
  { patient: "Phạm Thu D", time: "10:30 - 11:00", type: "online", status: "confirmed", isUrgent: false },
];

// Dữ liệu cho Notifications
export const notificationsData = [
  { type: "appointment", message: "Bệnh nhân Nguyễn Văn A đã xác nhận lịch hẹn", time: "5 phút trước" },
  { type: "message", message: "Tin nhắn mới từ Trần Thị B", time: "10 phút trước" },
  { type: "alert", message: "Lịch hẹn 14:00 cần xác nhận", time: "30 phút trước" },
];

// Dữ liệu cho NewPatients
export const newPatientsData = ['Phạm Thị E', 'Hoàng Văn F', 'Đỗ Thu G'];
// Định nghĩa các hằng số trạng thái
export const AppointmentStatus = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
  NO_SHOW: "no_show"
};

// Dữ liệu mock cho lịch hẹn
export const appointments = [
  { 
    id: "1", 
    patient: { name: "Nguyễn Văn A", phone: "0901234567", avatar: "https://api.dicebear.com/7.x/initials/svg?seed=A" }, 
    date: "2025-10-14", 
    time: "9:00 - 9:30", 
    status: AppointmentStatus.PENDING, 
    type: "online",
    reason: "Khám tổng quát"
  },
  { 
    id: "2", 
    patient: { name: "Trần Thị B", phone: "0912345678", avatar: "https://api.dicebear.com/7.x/initials/svg?seed=B" }, 
    date: "2025-10-14", 
    time: "9:30 - 10:00", 
    status: AppointmentStatus.CONFIRMED, 
    type: "offline",
    reason: "Tái khám tim mạch"
  },
  { 
    id: "3", 
    patient: { name: "Lê Văn C", phone: "0923456789", avatar: "https://api.dicebear.com/7.x/initials/svg?seed=C" }, 
    date: "2025-10-14", 
    time: "10:00 - 10:30", 
    status: AppointmentStatus.COMPLETED, 
    type: "offline",
    reason: "Kiểm tra huyết áp"
  },
  { 
    id: "4", 
    patient: { name: "Phạm Hùng D", phone: "0934567890", avatar: "https://api.dicebear.com/7.x/initials/svg?seed=D" }, 
    date: "2025-10-13", 
    time: "11:00 - 11:30", 
    status: AppointmentStatus.CANCELLED, 
    type: "online",
    reason: "Tư vấn sức khỏe"
  },
];

// Dữ liệu cho các tab
export const tabs = [
  { name: "Tất cả", status: "all", count: 4 },
  { name: "Chờ xác nhận", status: AppointmentStatus.PENDING, count: 1 },
  { name: "Đã xác nhận", status: AppointmentStatus.CONFIRMED, count: 1 },
  { name: "Đã hoàn thành", status: AppointmentStatus.COMPLETED, count: 1 },
  { name: "Đã hủy", status: AppointmentStatus.CANCELLED, count: 1 },
];
export const conversations = [
  { 
    id: "c1", 
    name: "Nguyễn Văn A", 
    lastMessage: "Cảm ơn bác sĩ, tôi đã khỏe hơn nhiều rồi ạ.", 
    unread: 0, 
    time: "Hôm qua", 
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=A",
    online: false,
    type: "patient"
  },
  { 
    id: "c2", 
    name: "Trần Thị B", 
    lastMessage: "Bác sĩ ơi, tôi bị đau đầu từ sáng nay...", 
    unread: 2, 
    time: "10:30 AM", 
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=B",
    online: true,
    type: "patient"
  },
  { 
    id: "c3", 
    name: "Lê Văn C", 
    lastMessage: "Cho tôi hỏi về kết quả xét nghiệm...", 
    unread: 1, 
    time: "9:15 AM", 
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=C",
    online: true,
    type: "patient"
  },
  { 
    id: "c4", 
    name: "Admin Phòng khám", 
    lastMessage: "Thông báo: Họp team vào 14h chiều nay", 
    unread: 0, 
    time: "Thứ 2", 
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Admin",
    online: false,
    type: "admin"
  },
];

export const messageHistory = {
  c2: [
    { id: "m1", sender: "patient", text: "Bác sĩ ơi, tôi bị đau đầu từ 2 hôm nay.", time: "9:00 AM", read: true },
    { id: "m2", sender: "doctor", text: "Chào chị B, cho bác sĩ hỏi chi tiết hơn về triệu chứng nhé. Chị bị đau đầu ở vị trí nào?", time: "9:05 AM", read: true },
    { id: "m3", sender: "patient", text: "Đau âm ỉ ở phía trước trán, kèm theo chóng mặt nhẹ ạ.", time: "9:10 AM", read: true },
    { id: "m4", sender: "doctor", text: "Chị có bị buồn nôn hoặc nhạy cảm với ánh sáng không?", time: "9:12 AM", read: true },
    { id: "m5", sender: "patient", text: "Có ạ, tôi thấy hơi buồn nôn và không thích ánh sáng mạnh.", time: "9:15 AM", read: true },
    { id: "m6", sender: "doctor", text: "Triệu chứng của chị có thể là đau nửa đầu (migraine). Bác sĩ khuyên chị nên:\n\n1. Nghỉ ngơi trong phòng tối, yên tĩnh\n2. Uống đủ nước\n3. Tránh stress\n\nNếu triệu chứng kéo dài hoặc nặng hơn, chị nên đặt lịch khám trực tiếp nhé.", time: "9:20 AM", read: false },
    { id: "m7", sender: "patient", text: "Vâng ạ, cảm ơn bác sĩ. Cho tôi hỏi có cần dùng thuốc gì không ạ?", time: "10:25 AM", read: false },
    { id: "m8", sender: "patient", text: "Bác sĩ ơi, tôi bị đau đầu từ sáng nay...", time: "10:30 AM", read: false },
  ]
};

export const quickReplies = [
  "Vâng, tôi hiểu rồi",
  "Cảm ơn bạn đã liên hệ",
  "Hãy đặt lịch khám để được tư vấn chi tiết",
  "Tôi sẽ kiểm tra và phản hồi lại"
];

export const patients = [
  { 
    id: "p1", 
    full_name: "Nguyễn Văn A", 
    date_of_birth: "1980-01-01", 
    age: 45,
    phone_number: "0901234567",
    email: "nguyenvana@email.com",
    last_visit: "2025-10-01", 
    total_visits: 12,
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=A",
    address: "123 Nguyễn Huệ, Q1, TP.HCM",
    blood_type: "O+",
    status: "active"
  },
  { 
    id: "p2", 
    full_name: "Trần Thị B", 
    date_of_birth: "1992-05-10",
    age: 33,
    phone_number: "0912345678",
    email: "tranthib@email.com",
    last_visit: "2025-10-14", 
    total_visits: 5,
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=B",
    address: "456 Lê Lợi, Q3, TP.HCM",
    blood_type: "A+",
    status: "active"
  },
  { 
    id: "p3", 
    full_name: "Lê Văn C", 
    date_of_birth: "1975-11-20",
    age: 49,
    phone_number: "0923456789",
    email: "levanc@email.com",
    last_visit: "2025-10-14", 
    total_visits: 23,
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=C",
    address: "789 Võ Văn Tần, Q10, TP.HCM",
    blood_type: "B+",
    status: "active"
  },
];

export const reviews = [
  { 
    id: "r1", 
    patient_name: "Nguyễn Văn A", 
    rating: 5, 
    comment: "Bác sĩ rất tận tình và chu đáo. Giải thích rõ ràng về tình trạng bệnh và hướng điều trị. Tôi rất hài lòng với dịch vụ.", 
    date: "2025-10-12", 
    verified: true, 
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=A",
    helpful: 12,
    response: null
  },
  { 
    id: "r2", 
    patient_name: "Trần Thị B", 
    rating: 4, 
    comment: "Phòng khám sạch sẽ, bác sĩ tư vấn kỹ càng. Tuy nhiên thời gian chờ hơi lâu một chút. Nhìn chung vẫn rất tốt!", 
    date: "2025-10-11", 
    verified: true, 
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=B",
    helpful: 8,
    response: {
      text: "Cảm ơn chị đã tin tưởng. Chúng tôi sẽ cải thiện thời gian chờ để phục vụ tốt hơn.",
      date: "2025-10-12"
    }
  },
  { 
    id: "r3", 
    patient_name: "Lê Văn C", 
    rating: 5, 
    comment: "Tuyệt vời! Bác sĩ rất chuyên nghiệp, nhiệt tình. Khám online rất tiện lợi và hiệu quả.", 
    date: "2025-10-10", 
    verified: true, 
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=C",
    helpful: 15,
    response: null
  },
  { 
    id: "r4", 
    patient_name: "Phạm Thị D", 
    rating: 5, 
    comment: "Đã khám nhiều lần, mỗi lần đều hài lòng. Bác sĩ luôn lắng nghe và tư vấn chi tiết.", 
    date: "2025-10-09", 
    verified: true, 
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=D",
    helpful: 20,
    response: {
      text: "Cảm ơn chị đã đồng hành cùng chúng tôi!",
      date: "2025-10-10"
    }
  },
  { 
    id: "r5", 
    patient_name: "Hoàng Văn E", 
    rating: 3, 
    comment: "Bác sĩ tốt nhưng lịch hẹn thường bị delay. Mong cải thiện về mặt này.", 
    date: "2025-10-08", 
    verified: false, 
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=E",
    helpful: 5,
    response: null
  },
];

export const averageRating = 4.6;
export const totalReviews = 158;
export const ratingDistribution = [
  { stars: 5, count: 120, percentage: 76 },
  { stars: 4, count: 25, percentage: 16 },
  { stars: 3, count: 8, percentage: 5 },
  { stars: 2, count: 3, percentage: 2 },
  { stars: 1, count: 2, percentage: 1 },
];

export const schedules = [
  { id: "s1", schedule_date: "2025-10-15", day: "Thứ Tư", start_time: "08:00", end_time: "12:00", slots: 8, booked: 5, status: "active" },
  { id: "s2", schedule_date: "2025-10-15", day: "Thứ Tư", start_time: "13:00", end_time: "17:00", slots: 8, booked: 3, status: "active" },
  { id: "s3", schedule_date: "2025-10-16", day: "Thứ Năm", start_time: "08:00", end_time: "12:00", slots: 8, booked: 8, status: "active" },
  { id: "s4", schedule_date: "2025-10-17", day: "Thứ Sáu", start_time: "08:00", end_time: "12:00", slots: 8, booked: 2, status: "active" },
  { id: "s5", schedule_date: "2025-10-17", day: "Thứ Sáu", start_time: "13:00", end_time: "17:00", slots: 8, booked: 0, status: "active" },
];

export const weeklyTemplate = {
  monday: { active: true, shifts: [{ start: "08:00", end: "12:00" }, { start: "13:00", end: "17:00" }] },
  tuesday: { active: true, shifts: [{ start: "08:00", end: "12:00" }, { start: "13:00", end: "17:00" }] },
  wednesday: { active: true, shifts: [{ start: "08:00", end: "12:00" }, { start: "13:00", end: "17:00" }] },
  thursday: { active: true, shifts: [{ start: "08:00", end: "12:00" }, { start: "13:00", end: "17:00" }] },
  friday: { active: true, shifts: [{ start: "08:00", end: "12:00" }, { start: "13:00", end: "17:00" }] },
  saturday: { active: false, shifts: [] },
  sunday: { active: false, shifts: [] },
};

export const doctorProfile = {
  full_name: "Dr. Nguyễn Văn A",
  title: "Bác sĩ Chuyên khoa I",
  specializations: ["Tim mạch", "Huyết áp", "Nội khoa"],
  introduction: "Bác sĩ có hơn 10 năm kinh nghiệm trong lĩnh vực Tim mạch. Tốt nghiệp Đại học Y Dược TP.HCM, từng công tác tại Bệnh viện Chợ Rẫy. Chuyên điều trị các bệnh lý về tim mạch, huyết áp và tư vấn sức khỏe tim mạch.",
  avatar_url: "https://api.dicebear.com/7.x/initials/svg?seed=Dr. Nguyễn Văn A",
  experience_years: 10,
  email: "bs.nguyenvana@clinic.com",
  phone: "0901234567",
  address: "Phòng khám ABC, 123 Nguyễn Huệ, Q1, TP.HCM",
  education: [
    { degree: "Bác sĩ Chuyên khoa I", institution: "Đại học Y Dược TP.HCM", year: "2018" },
    { degree: "Bác sĩ Đa khoa", institution: "Đại học Y Dược TP.HCM", year: "2013" }
  ],
  certifications: [
    { name: "Chứng chỉ Tim mạch học", org: "Hội Tim mạch học Việt Nam", year: "2019" },
    { name: "Chứng chỉ Siêu âm tim", org: "Bệnh viện Chợ Rẫy", year: "2020" }
  ],
  consultation_fee: 300000,
  languages: ["Tiếng Việt", "English"]
};

export const allSpecializations = [
  "Tim mạch", "Huyết áp", "Nội khoa", "Ngoại khoa", "Nhi khoa", 
  "Sản phụ khoa", "Da liễu", "Mắt", "Tai mũi họng", "Răng hàm mặt"
];