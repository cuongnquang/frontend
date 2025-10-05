export type PatientFormData = any
export type SetFormData = React.Dispatch<React.SetStateAction<PatientFormData>>;

export interface PatientFormProps {
    patient?: any
    onClose: () => void
    onSubmit: (data: any) => void
    mode: 'create' | 'edit' | 'view'
}
export interface PatientFormInfoProps {
    formData: PatientFormData
    setFormData: SetFormData
    isReadOnly: boolean
}
export interface PatientActionFormProps {
    onClose: () => void
    mode: 'create' | 'edit' | 'view'
    isReadOnly: boolean
}