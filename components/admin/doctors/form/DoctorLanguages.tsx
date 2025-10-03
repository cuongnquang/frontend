import { X, Plus } from 'lucide-react'

interface DoctorLanguagesProps {
    languages: string[]
    newLanguage: string
    setNewLanguage: (value: string) => void
    addLanguage: () => void
    removeLanguage: (lang: string) => void
}

export function DoctorLanguages({
    languages,
    newLanguage,
    setNewLanguage,
    addLanguage,
    removeLanguage
}: DoctorLanguagesProps) {
    return (
        <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ngôn ngữ</h3>
            <div className="flex flex-wrap gap-2 mb-4">
                {languages.map((lang) => (
                    <span
                        key={lang}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                    >
                        {lang}
                        <button
                            type="button"
                            onClick={() => removeLanguage(lang)}
                            className="ml-2 text-blue-600 hover:text-blue-800"
                            aria-label={`Remove language ${lang}`}
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </span>
                ))}
            </div>
            <div className="flex gap-2">
                <input
                    type="text"
                    value={newLanguage}
                    onChange={(e) => setNewLanguage(e.target.value)}
                    placeholder="Thêm ngôn ngữ"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                    type="button"
                    onClick={addLanguage}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    aria-label="Add language"
                >
                    <Plus className="w-4 h-4" />
                </button>
            </div>
        </div>
    )
}