'use client'

import { useState } from 'react'
import { Save, User, Mail, Lock } from 'lucide-react'

export default function AdminProfileSettings() {
  const [adminInfo, setAdminInfo] = useState({
    name: 'Admin',
    email: 'admin@youmed.vn',
  })
  const [password, setPassword] = useState({
    current: '',
    new: '',
    confirm: '',
  })
  const [isSaving, setIsSaving] = useState(false)

  const handleSaveInfo = async () => {
    setIsSaving(true)
    console.log('Saving admin info:', adminInfo)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
    alert('Đã cập nhật thông tin cá nhân.')
  }

  const handleSavePassword = async () => {
    if (password.new !== password.confirm) {
      alert('Mật khẩu mới không khớp.')
      return
    }
    if (password.new.length < 8) {
      alert('Mật khẩu mới phải có ít nhất 8 ký tự.')
      return
    }
    setIsSaving(true)
    console.log('Changing password.')
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
    setPassword({ current: '', new: '', confirm: '' })
    alert('Đã thay đổi mật khẩu.')
  }

  return (
    <div className="p-6 space-y-8">
      {/* Personal Info Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <User className="w-5 h-5 mr-2" />
          Thông tin cá nhân
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Họ và tên</label>
            <input
              type="text"
              value={adminInfo.name}
              onChange={(e) => setAdminInfo({ ...adminInfo, name: e.target.value })}
              className="w-full p-3 border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg text-black"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={adminInfo.email}
              onChange={(e) => setAdminInfo({ ...adminInfo, email: e.target.value })}
              className="w-full p-3 border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg text-black"
            />
          </div>
        </div>
        <div className="mt-4">
          <button
            onClick={handleSaveInfo}
            disabled={isSaving}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center disabled:opacity-50"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Đang lưu...' : 'Lưu thông tin'}
          </button>
        </div>
      </div>

      {/* Change Password Section */}
      <div className="border-t pt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Lock className="w-5 h-5 mr-2" />
          Đổi mật khẩu
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mật khẩu hiện tại</label>
            <input
              type="password"
              value={password.current}
              onChange={(e) => setPassword({ ...password, current: e.target.value })}
              className="w-full p-3 border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg text-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mật khẩu mới</label>
            <input
              type="password"
              value={password.new}
              onChange={(e) => setPassword({ ...password, new: e.target.value })}
              className="w-full p-3 border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg text-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Xác nhận mật khẩu mới</label>
            <input
              type="password"
              value={password.confirm}
              onChange={(e) => setPassword({ ...password, confirm: e.target.value })}
              className="w-full p-3 border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg text-black"
            />
          </div>
        </div>
        <div className="mt-4">
          <button
            onClick={handleSavePassword}
            disabled={isSaving}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center disabled:opacity-50"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Đang lưu...' : 'Đổi mật khẩu'}
          </button>
        </div>
      </div>
    </div>
  )
}
