import React from 'react'
import InitialsOrAvartar from './shared/InitialsOrAvartar'
import { Calendar, Clock, MapPin, Star, Stethoscope } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ConsultantThumbnailProps {
    id: number
    name: string;
    specialty: string;
    experience: number;
    fee: string;
    rating: number;
    reviewCount: number;
    location: string;
    qualifications: string[];
    availability: string;
    avatarUrl?: string;
    nextSlot?: string;
}

const renderStats = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
        <Star
            key={i}
            className={`'w-4 h-4 ${i < Math.floor(rating) ?
                'fill-main text-main' : 'text-light-1'}`}
        />
    ));
};
const getAvailabilityColor = (availability: string) => {
    if (availability.includes('Today')) {
        return 'text-green-600 bg-green-50'
    }
    if (availability.includes('Tomorrow')) {
        return 'text-blue-600 bg-blue-50'
    }
    return 'text-orange-600 bg-orange-50'
}

const ConsultantThumbnail: React.FC<ConsultantThumbnailProps> = ({
    name,
    specialty,
    avatarUrl,
    rating = 0,
    id,
    availability,
    experience,
    fee,
    location,
    qualifications,
    reviewCount,
    nextSlot
}) => {
    return (
        <div key={id} className='bg-white rounded-lg border-light-3 p-6 hover:shadow-md transition-shadow'>
            <div className='flex gap-4'>
                {/* Profile Image*/}
                <InitialsOrAvartar name={name} avatarUrl={avatarUrl} width='80' height='80' />
                {/* Main  Content*/}
                <div className='flex-1'>
                    <div className='flex justify-between items-center mb-2'>
                        <div>
                            <h3 className='text-lg font-semibold text-dark-4'>{name}</h3>
                            <div className='flex items-center gap-2 text-sm text-dark-1'>
                                <Stethoscope className='w-4 h-4' />
                                <span>{specialty}</span>
                                <span>•</span>
                                <span>{experience} years experience</span>
                            </div>
                        </div>
                        <div className='text-right'>
                            <div className='text-lg font-semibold text-dark-4 '>{fee}</div>
                            <div className='text-sm text-dark-1'>per consultation</div>
                        </div>
                    </div>
                    {/* Rating */}
                    <div className='flex items-center gap-2'>
                        <div className='flex items-center gap-1'>
                            {renderStats(rating)}
                        </div>
                        <span className='text-sm font-medium text-dark-5'>{rating}</span>
                        <span className='text-sm text-dark-1'>{reviewCount} reviews</span>
                    </div>
                    {/* Location */}
                    <div className="flex items-center gap-2 mb-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{location}</span>
                    </div>
                    {/* Qualifications */}
                    <div className="flex items-center gap-2 mb-3">
                        {qualifications.map(qual => (
                            <span key={qual} className="px-2 py-1 bg-main text-light-5 text-xs rounded-full">
                                {qual}
                            </span>
                        ))}
                    </div>
                    {/* Bottom Row */}
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div className={`px-3 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(availability)}`}>
                                {availability}
                            </div>
                            {availability.includes('Today') && (
                                <div className="hidden sm:flex items-center gap-1 text-sm text-gray-600">
                                    <Clock className="w-4 h-4" />
                                    <span>Next: {nextSlot}</span>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <Link to={`profile`} state={{id: id}} className="px-4 py-2 text-main border border-main rounded-lg hover:bg-light-1 transition-colors">
                                View Profile
                            </Link>
                            <Link to={`/patient/schedule`} state={{id: id}} className="px-4 py-2 bg-main text-white rounded-lg hover:bg-main transition-colors flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                Schedule
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ConsultantThumbnail