import React from 'react'
import { MapPin, Briefcase, Clock, Star, Heart, Share2, Verified } from 'lucide-react'
import { Doctor } from '@/types/types'

interface DoctorHeroSectionProps {
    doctor: Doctor
}

export const DoctorHeroSection: React.FC<DoctorHeroSectionProps> = ({ doctor }) => (
    <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="relative">
                    <img
                        src={doctor.image}
                        alt={doctor.name}
                        className="w-32 h-32 rounded-xl object-cover border-4 border-white shadow-lg"
                    />
                    {doctor.isVerified && (
                        <div className="absolute -top-2 -right-2 bg-green-500 p-2 rounded-full">
                            <Verified className="w-4 h-4 text-white" />
                        </div>
                    )}
                </div>

                <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-start gap-10 mb-4">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">{doctor.title} {doctor.name}</h1>
                            <p className="text-indigo-100 text-lg font-medium mb-1">{doctor.specialty}</p>
                            <div className="flex items-center text-indigo-100">
                                <MapPin className="w-4 h-4 mr-1" />
                                <span>{doctor.hospital} • {doctor.location}</span>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button className="p-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors">
                                <Heart className="w-5 h-5" color='red' />
                            </button>
                            <button className="p-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors">
                                <Share2 className="w-5 h-5" color='blue' />
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-indigo-100">
                        <div className="flex items-center">
                            <Star className="w-5 h-5 text-yellow-400 fill-current mr-1" />
                            <span className="font-semibold text-white">{doctor.rating}</span>
                            <span className="mx-1">•</span>
                            <span>{doctor.reviews} đánh giá</span>
                        </div>
                        <div className="flex items-center">
                            <Briefcase className="w-4 h-4 mr-1" />
                            <span>{doctor.experience} năm kinh nghiệm</span>
                        </div>
                        <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            <span>Phản hồi trong {doctor.responseTime}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
)