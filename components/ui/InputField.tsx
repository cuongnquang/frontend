export default function InputField({ label, icon, value, onChange, error, type = 'text', placeholder }: any) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{label} *</label>
            <div className="relative">
                <div className="absolute left-3 top-3">{icon}</div>
                <input
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${error ? 'border-red-300' : 'border-gray-300'}`}
                />
            </div>
            {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
        </div>
    )
}
