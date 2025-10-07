import { Eye, EyeOff, Lock } from "lucide-react";

export default function PasswordField({ label, value, onChange, show, setShow, error }: any) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{label} *</label>
            <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
                <input
                    type={show ? 'text' : 'password'}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className={`w-full pl-10 pr-12 py-3 border focus:outline-none text-black rounded-lg focus:ring-2 focus:ring-blue-500 ${error ? 'border-red-300' : 'border-gray-300'}`}
                    placeholder="Tối thiểu 8 ký tự"
                />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-3 text-gray-400">
                    {show ? <EyeOff /> : <Eye />}
                </button>
            </div>
            {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
        </div>
    )
}
