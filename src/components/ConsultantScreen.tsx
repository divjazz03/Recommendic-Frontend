import React, { useState } from 'react'
import InitialsOrAvartar from './InitialsOrAvartar';
import { Award, Clock, Heart, MapPin, MessageCircle, Shield, Star, TrendingUp, Users, Video } from 'lucide-react';

const ConsultantProfile = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [isAvailable, setIsAvailable] = useState(true);

    const consultant = {
        name: "Dr. Sarah Mitchell",
        title: "Cardiologist & Internal Medicine Specialist",
        rating: 4.9,
        totalReviews: 347,
        experience: 12,
        location: "Lagos University Teaching Hospital",
        image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop&crop=face",
        specializations: ["Cardiology", "Internal Medicine", "Preventive Care", "Hypertension Management"],
        languages: ["English", "Yoruba", "French"],
        consultationFee: "₦15,000",
        nextAvailable: "Today, 2:30 PM",
        education: [
            { degree: "MD", institution: "University of Lagos", year: "2012" },
            { degree: "Fellowship in Cardiology", institution: "Johns Hopkins", year: "2015" }
        ],
        stats: {
            patientsHelped: 2847,
            successRate: 96,
            responseTime: "< 30 min",
            followUpRate: 94
        }
    }
    const recentReviews = [
        { name: "Adunni O.", rating: 5, comment: "Excellent care and very thorough explanation of my condition.", date: "2 days ago" },
        { name: "Michael K.", rating: 5, comment: "Dr. Mitchell helped me manage my hypertension effectively.", date: "1 week ago" },
        { name: "Fatima A.", rating: 4, comment: "Professional and caring. Highly recommend for heart issues.", date: "2 weeks ago" }
    ];

    const availableSlots = [
        { time: "2:30 PM", type: "Video Call" },
        { time: "4:00 PM", type: "Phone Call" },
        { time: "5:30 PM", type: "Video Call" }
    ];

    return (
        <section className='min-h-screen p-4'>
            <div className='max-w-6xl mx-auto'>
                {/* Header section */}
                <section className='bg-light-5 rounded-2xl shadow-xl p-8 mb-6 relative overflow-hidden'>
                    <div className='absolute top-0 right-0 w-32 h-32  bg-main rounded-full translate-x-16 -translate-y-16 opacity-10'></div>
                    <div className='relative z-10'>
                        <div className='flex flex-col lg-flex-row items-start lg:items-center gap-6'>
                            <div className='relative'>
                                <InitialsOrAvartar name={consultant.name} avatarUrl='' width='100' height='100' />
                                <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center ${isAvailable ? 'bg-green-500' : 'bg-gray-400'}`}>
                                    <div className='w-3 h-3 bg-white rounded-full'></div>
                                </div>
                            </div>
                            <div className='flex-1'>
                                <div className='flex items-center gap-3 mb-2'>
                                    <h1 className='text-3xl font-bold text-main'>{consultant.name}</h1>
                                    <Shield className='w-6 h-6 text-main' />
                                </div>
                                <p className='text-xl text-dark-3 mb-3'>{consultant.title}</p>
                                <div className="flex flex-wrap items-center gap-4 mb-4">
                                    <div className="flex items-center gap-1">
                                        <Star className="w-5 h-5 text-yellow-400 fill-current" />
                                        <span className="font-semibold text-gray-900">{consultant.rating}</span>
                                        <span className="text-dark-1">({consultant.totalReviews} reviews)</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-dark-1">
                                        <Award className="w-5 h-5" />
                                        <span>{consultant.experience} years experience</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-dark-1">
                                        <MapPin className="w-5 h-5" />
                                        <span>{consultant.location}</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {consultant.specializations.map((spec, index) => (
                                            <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                                {spec}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="flex flex-col gap-3">
                                        <button className="px-6 py-3 bg-main text-white rounded-xl font-semibold transition-color duration-100 flex items-center gap-2 hover:opacity-80">
                                            <Video className="w-5 h-5" />
                                            Book Consultation
                                        </button>
                                        <button className="px-6 py-3 border-2 border-main text-main rounded-xl font-semibold hover:bg-light-2 transition-all duration-300 flex items-center gap-2">
                                            <MessageCircle className="w-5 h-5" />
                                            Send Message
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {/* Stats Grid*/}
                <section className='grid grid-cols-2 lg-grid-cols-4 gap-4 mb-6 '>
                    {[
                        { icon: Users, label: "Patients Helped", value: consultant.stats.patientsHelped.toLocaleString(), color: 'blue' },
                        { icon: TrendingUp, label: "Success Rate", value: `${consultant.stats.successRate}%`, color: 'green' },
                        { icon: Clock, label: "Response Time", value: consultant.stats.responseTime, color: 'purple' },
                        { icon: Heart, label: "Follow-up Rate", value: `${consultant.stats.followUpRate}%`, color: 'red' }
                    ].map((stat, index) => (
                        <div key={index} className='bg-white rounde-xl p-6 shadow-lg hover:shadow-xl transition-all duration-100'>
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3`}
                                style={{
                                    backgroundColor: `${stat.color}`
                                }}
                            >
                                <stat.icon className={'w-6 h-6'} 
                                style={{color: stat.color}}/>
                            </div>
                        </div>
                    ))

                    }
                </section>
            </div>
        </section>
    )
}

export default ConsultantProfile