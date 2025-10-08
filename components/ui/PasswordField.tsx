import { Eye, EyeOff, Lock } from "lucide-react"

export default function PasswordField({ label, value, onChange, show, setShow, error }: any) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{label} *</label>
            <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                    type={show ? 'text' : 'password'}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    autoComplete="off"
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 placeholder:text-gray-500 placeholder:font-medium ${error ? 'border-red-300' : 'border-gray-300'} [&::-ms-reveal]:hidden [&::-ms-clear]:hidden [&::-webkit-credentials-auto-fill-button]:hidden [&::-webkit-contacts-auto-fill-button]:hidden`}
                    placeholder="Tối thiểu 8 ký tự"
                />
                <button 
                    type="button" 
                    onClick={() => setShow(!show)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                    {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
            </div>
            {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
        </div>
    )
}