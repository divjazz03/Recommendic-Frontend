import React, { useEffect, useRef, useState } from 'react'
import InitialsOrAvartar from './shared/InitialsOrAvartar';
import { Award, BookOpen, Calendar, CheckCircle, Clock, Heart, MapPin, MessageCircle, Shield, Star, TrendingUp, Users, Video } from 'lucide-react';


interface ConsultantProfileProps {
        name: string,
        title: string,
        rating: number,
        totalReviews: number,
        bio: string,
        experience: number,
        location: string,
        image: string,
        specializations: string[],
        languages: string[],
        consultationFee: string,
        nextAvailable: string,
        education: { degree: string, institution: string, year: string }[],
        stats: {
            patientsHelped: number,
            successRate: number,
            responseTime: string,
            followUpRate: number
        },
        reviews: {name: string, rating: number, comment: string, date:string}[],
        availableSlots: {time: string, type: string}[],
        isVisible?: boolean
        
    

}



const ConsultantProfile: React.FC<ConsultantProfileProps> = ({
    name,
    availableSlots,
    bio,
    consultationFee,
    education,
    experience,
    image = "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop&crop=face",
    languages,
    location,
    nextAvailable,
    rating,
    reviews,
    specializations,
    stats,
    title,
    totalReviews,
    isVisible = false
}) => {
    const [activeTab, setActiveTab] = useState('overview');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [isAvailable, setIsAvailable] = useState(false);

    const thisRef: React.MutableRefObject<HTMLDivElement> = useRef(null);


    useEffect(() => {
        thisRef.current.hidden= !isVisible
    },[isVisible])

    

    const bgColors: Record<string, string> = {
        red: 'bg-red-100',
        green: 'bg-green-100',
        purple: 'bg-purple-100',
        blue: 'bg-blue-100'
    }
    const textColors: Record<string, string> = {
        red: 'text-red-600',
        green: 'text-green-600',
        purple: 'text-purple-600',
        blue: 'text-blue-600'
    }

    return (
        <section ref={thisRef} className='max-h-[780px] overflow-auto p-4'>
            <div className='max-w-6xl mx-auto'>
                {/* Header section */}
                <section className='bg-light-5 rounded-2xl shadow-md p-8 mb-6 relative overflow-hidden'>
                    <div className='absolute top-0 right-0 w-32 h-32  bg-main rounded-full translate-x-16 -translate-y-16 opacity-10'></div>
                    <div className='relative z-10'>
                        <div className='flex flex-col lg-flex-row items-start lg:items-center gap-6'>
                            <div className='relative'>
                                <InitialsOrAvartar name={name} avatarUrl={image} width='100' height='100' />
                                <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center ${isAvailable ? 'bg-green-500' : 'bg-gray-400'}`}>
                                    <div className='w-3 h-3 bg-white rounded-full'></div>
                                </div>

                            </div>
                            <div className='flex-1'>
                                <div className='flex items-center gap-3 mb-2'>
                                    <h1 className='text-3xl font-bold text-main'>{name}</h1>
                                    <Shield className='w-6 h-6 text-main' />
                                </div>
                                <p className='text-xl text-dark-3 mb-3'>{title}</p>
                                <div className="flex flex-wrap items-center gap-4 mb-4">
                                    <div className="flex items-center gap-1">
                                        <Star className="w-5 h-5 text-main fill-current" />
                                        <span className="font-semibold text-gray-900">{rating}</span>
                                        <span className="text-dark-1">({totalReviews} reviews)</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-dark-1">
                                        <Award className="w-5 h-5" />
                                        <span>{experience} years experience</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-dark-1">
                                        <MapPin className="w-5 h-5" />
                                        <span>{location}</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {specializations.map((spec, index) => (
                                            <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                                {spec}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="flex flex-col gap-3">
                                        <button className="px-6 py-3 bg-main-light hover:bg-main text-white rounded-xl font-semibold transition-color duration-100 flex items-center gap-2">
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
                <section className='grid grid-cols-1 sm:grid-cols-2 md-grid-cols-4 gap-4 mb-6 '>
                    {[
                        { icon: Users, label: "Patients Helped", value: stats.patientsHelped.toLocaleString(), color: 'blue' },
                        { icon: TrendingUp, label: "Success Rate", value: `${stats.successRate}%`, color: 'green' },
                        { icon: Clock, label: "Response Time", value: stats.responseTime, color: 'purple' },
                        { icon: Heart, label: "Follow-up Rate", value: `${stats.followUpRate}%`, color: 'red' }
                    ].map((stat, index) => (
                        <div key={index} className='bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-100'>
                            <div className={`w-12 h-12 rounded-xl flex items-center ${bgColors[stat.color]} justify-center mb-3`}
                            >
                                <stat.icon className={`w-6 h-6 ${textColors[stat.color]}`} />
                            </div>
                            <div className='text-2xl font-bold text-dark-3 mb-1'>{stat.value}</div>
                            <div className='text-sm text-dark-1 mb-1'>{stat.label}</div>
                        </div>
                    ))}
                </section>

                {/*Tab navigation */}
                <div className='bg-white rounded-xl shadow-lg mb-6'>
                    <div className='flex border-b border-light-3'>
                        {[
                            { id: 'overview', label: 'Overview', icon: BookOpen },
                            { id: 'availability', label: 'Availability', icon: Calendar },
                            { id: 'reviews', label: 'Reviews', icon: Star }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-6 py-5 font-medium transition-all duration-100 ${activeTab === tab.id
                                    ? 'text-main  border-b-2 border-main '
                                    : 'text-dark-1 hover:text-dark-1 hover:bg-light-3'
                                    }`}
                            >
                                <tab.icon className='w-5 h-5 ' />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                <section className='p-6'>
                    {/* Tab Overview */}
                    <section className=''>
                        {activeTab === 'overview' && (
                            <div className='space-y-6'>
                                <div>
                                    <h3 className='text-xl font-semibold text-dark-3 mb-3'>About {name}</h3>
                                    <p className='text-dark-1 leading-relaxed'>
                                        {bio}
                                    </p>
                                </div>

                                <div>
                                    <h3 className='text-xl font-semibold text-dark-3 mb-3'>Education & Certifications</h3>
                                    <div className='space-y-3'>
                                        {education.map((edu, index) => (
                                            <div key={index} className='flex items-center gap-3 p-3 bg-gray-50 rounded-lg'>
                                                <Award className='w-5 h-5 text-main' />
                                                <div>
                                                    <div className='font-medium text-dark-3'>{edu.degree}</div>
                                                    <div className='text-sm text-dark-1'>{edu.institution} • {edu.year}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h3 className='text-xl font-semibold text-dark-3 mb-3'>Languages</h3>
                                    <div className='flex gap-2'>
                                        {languages.map((lang, index) => (
                                            <span key={index} className='px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm'>
                                                {lang}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )
                        }

                        {/*Availabilty tab */}
                        {activeTab === 'availability' && (
                            <section className='space-y-6'>
                                <div className='flex items-center justify-between '>
                                    <h3 className='text-xl font-semibold text-dark-3'>Available Today</h3>
                                    <div className="text-lg font-semibold text-main">{consultationFee}</div>
                                </div>

                                <div className="grid gap-3">
                                    {availableSlots.map((slot, index) => (
                                        <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-light-1 hover:bg-grey-100 transition-all duration-300">
                                            <div className="flex items-center gap-3">
                                                <Clock className="w-5 h-5 text-dark-1" />
                                                <span className="font-medium text-dark-3">{slot.time}</span>
                                                <span className="text-sm text-dark-1">• {slot.type}</span>
                                            </div>
                                            <button className="px-4 py-2 bg-main-light hover:bg-main text-white rounded-lg  transition-colors duration-300">
                                                Book
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                                    <div className="flex items-center gap-2 text-green-800">
                                        <CheckCircle className="w-5 h-5" />
                                        <span className="font-medium">Next available: {nextAvailable}</span>
                                    </div>
                                </div>
                            </section>
                        )}
                        {/*Reviews Tab */}
                        {activeTab === 'reviews' && (
                            <section className='space-y-6'>
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-semibold text-dark-3">Patient Reviews</h3>
                                    <div className="text-right">
                                        <div className="text-3xl font-bold text-dark-3">{rating}</div>
                                        <div className="text-sm text-dark-1">{totalReviews} reviews</div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {reviews.map((review, index) => (
                                        <div key={index} className="p-4 border border-gray-200 rounded-lg">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-main-light rounded-full flex items-center justify-center">
                                                        <span className="text-light-4 font-medium">{review.name.charAt(0)}</span>
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-gray-900">{review.name}</div>
                                                        <div className="text-sm text-gray-600">{review.date}</div>
                                                    </div>
                                                </div>
                                                <div className="flex">
                                                    {[...Array(review.rating)].map((_, i) => (
                                                        <Star key={i} className="w-4 h-4 text-main fill-current" />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-gray-700">{review.comment}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                    </section>
                </section>

            </div >
        </section >
    )
}

export default ConsultantProfile