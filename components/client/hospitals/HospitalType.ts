export interface Hospital {
    id: number
    name: string
    type: string
    address: string
    district: string
    city: string
    rating: number
    reviews: number
    phone: string
    image: string
    description: string
    specialties: string[]
    beds: number
    doctors: number
    established: number
    certifications: string[]
    facilities: string[]
    workingHours: { weekday: string; weekend: string }
    emergencyAvailable: boolean
}