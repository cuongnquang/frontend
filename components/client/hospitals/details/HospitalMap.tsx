import React from 'react'
import { MapPin, ArrowUpRight } from 'lucide-react'

interface HospitalMapProps {
    address: string
    name: string
    // Trong thực tế, cần thêm tọa độ (latitude, longitude)
    latitude?: number
    longitude?: number
}

/**
 * Component giả lập Bản đồ Bệnh viện.
 * Trong dự án thực tế, bạn sẽ thay thế phần div chứa bản đồ bằng SDK của Google Maps/Leaflet.
 */
export default function HospitalMap({ address, name, latitude, longitude }: HospitalMapProps) {

    // Tạo link Google Maps (giả định)
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`

    return (
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-blue-600" /> Vị trí trên bản đồ
            </h3>

            {/* Giả lập khu vực hiển thị Bản đồ
              Trong ứng dụng thật: Khu vực này sẽ chứa component <GoogleMap> hoặc <LeafletMap>
            */}
            <div
                className="w-full h-48 bg-gray-200 rounded-lg overflow-hidden border border-gray-300 flex items-center justify-center text-center text-gray-500 font-medium"
                // Đây là một placeholder, bạn có thể thay bằng hình ảnh bản đồ tĩnh
                style={{
                    backgroundImage: 'url(/images/map-placeholder.png)', // Giả định có ảnh placeholder
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            >
                {/* Nếu không có ảnh placeholder, dùng text này:
                  Khu vực Bản đồ (Tích hợp Google Maps API)
                */}
            </div>

            <p className="text-sm font-semibold text-gray-800 mt-3 mb-2">{name}</p>
            <p className="text-sm text-gray-600 mb-4">{address}</p>

            {/* Nút chỉ đường */}
            <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex justify-center items-center px-4 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
            >
                <ArrowUpRight className="w-5 h-5 mr-2" />
                Chỉ đường (Mở Google Maps)
            </a>
        </div>
    )
}