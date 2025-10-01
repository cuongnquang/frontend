import Link from 'next/link'
import {
    Phone,
    Mail,
    MapPin,
    Facebook,
    Twitter,
    Instagram,
    Youtube,
    Shield,
    Star,
    Users,
    CheckCircle
} from 'lucide-react'

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white">
            <div className="container mx-auto px-4 py-16">
                <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
                    {/* Company info */}
                    <div>
                        <div className="flex items-center mb-6">
                            <div className="bg-blue-600 text-white px-3 py-2 rounded-lg font-bold text-xl">
                                Medi
                            </div>
                        </div>
                        <p className="text-gray-300 mb-6">
                            Nền tảng đặt lịch khám bệnh trực tuyến hàng đầu Việt Nam,
                            kết nối bạn với các bác sĩ và bệnh viện uy tín.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors">
                                <Youtube className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="text-lg font-semibold mb-6">Dịch vụ</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/doctors" className="text-gray-300 hover:text-white transition-colors">
                                    Tìm bác sĩ
                                </Link>
                            </li>
                            <li>
                                <Link href="/hospitals" className="text-gray-300 hover:text-white transition-colors">
                                    Tìm bệnh viện
                                </Link>
                            </li>
                            <li>
                                <Link href="/specialties" className="text-gray-300 hover:text-white transition-colors">
                                    Tìm chuyên khoa
                                </Link>
                            </li>
                            <li>
                                <Link href="/health-check" className="text-gray-300 hover:text-white transition-colors">
                                    Gói khám sức khỏe
                                </Link>
                            </li>
                            <li>
                                <Link href="/consultation" className="text-gray-300 hover:text-white transition-colors">
                                    Tư vấn trực tuyến
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="text-lg font-semibold mb-6">Hỗ trợ</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/help" className="text-gray-300 hover:text-white transition-colors">
                                    Trung tâm trợ giúp
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
                                    Liên hệ
                                </Link>
                            </li>
                            <li>
                                <Link href="/privacy" className="text-gray-300 hover:text-white transition-colors">
                                    Chính sách bảo mật
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms" className="text-gray-300 hover:text-white transition-colors">
                                    Điều khoản sử dụng
                                </Link>
                            </li>
                            <li>
                                <Link href="/faq" className="text-gray-300 hover:text-white transition-colors">
                                    Câu hỏi thường gặp
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-lg font-semibold mb-6">Liên hệ</h3>
                        <div className="space-y-4">
                            <div className="flex items-start">
                                <Phone className="w-5 h-5 text-blue-400 mr-3 mt-1 flex-shrink-0" />
                                <div>
                                    <p className="text-white font-medium">Hotline</p>
                                    <p className="text-gray-300">1900 2115</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <Mail className="w-5 h-5 text-blue-400 mr-3 mt-1 flex-shrink-0" />
                                <div>
                                    <p className="text-white font-medium">Email</p>
                                    <p className="text-gray-300">support@medicontect.vn</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <MapPin className="w-5 h-5 text-blue-400 mr-3 mt-1 flex-shrink-0" />
                                <div>
                                    <p className="text-white font-medium">Địa chỉ</p>
                                    <p className="text-gray-300">
                                        450 - 451 Lê Văn Việt, Phường Tăng <br />
                                        Nhơn Phú, TP. Hồ Chí Minh
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Download app section */}
                <div className="border-t border-gray-800 mt-12 pt-8">
                    <div className="text-center mb-8">
                        <h3 className="text-xl font-semibold mb-4">Tải ứng dụng MediContect</h3>
                        <p className="text-gray-300 mb-6">Trải nghiệm đặt lịch khám bệnh ngay trên điện thoại</p>
                        <div className="flex justify-center space-x-4">
                            <a href="#" className="bg-gray-800 hover:bg-gray-700 px-6 py-3 rounded-lg transition-colors flex items-center">
                                <div className="mr-3">
                                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                                    </svg>
                                </div>
                                <div className="text-left">
                                    <div className="text-xs text-gray-400">Tải về cho</div>
                                    <div className="text-sm font-semibold">App Store</div>
                                </div>
                            </a>
                            <a href="#" className="bg-gray-800 hover:bg-gray-700 px-6 py-3 rounded-lg transition-colors flex items-center">
                                <div className="mr-3">
                                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.496 12l2.202-2.491zM5.864 2.658L16.802 8.99l-2.302 2.302-8.636-8.634z" />
                                    </svg>
                                </div>
                                <div className="text-left">
                                    <div className="text-xs text-gray-400">Tải về cho</div>
                                    <div className="text-sm font-semibold">Google Play</div>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="bg-gray-800 border-t border-gray-700">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-gray-400 text-sm mb-4 md:mb-0">
                            © 2025 MediContect. Tất cả quyền được bảo lưu.
                        </p>
                        <div className="flex space-x-6 text-sm">
                            <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                                Chính sách bảo mật
                            </Link>
                            <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                                Điều khoản dịch vụ
                            </Link>
                            <Link href="/cookies" className="text-gray-400 hover:text-white transition-colors">
                                Chính sách Cookie
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}