import React, { useMemo, useState } from 'react'
import LocalSearch from './LocalSearch'
import { ChevronDown, Filter, Star, Stethoscope } from 'lucide-react'
import { Label } from './ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from './ui/select';
import ConsultantThumbnail from './ConsultantThumbnail';
import { handleDateTimeFormatting } from '@/lib/utils/utils';


interface ConsultantListProps {
    consultants: {
        id: number,
        name: string,
        specialty: string,
        rating: number,
        reviews: number,
        experience: string,
        location: string,
        availability: string,
        consultationFee: string,
        image: string,
        qualifications: string[],
        languages: string[],
        nextSlot: string
    }[],
    handleViewProfile?: (consultantId: number) => void,
    handleScheduleConsultant: (consultantId: number) => void
}


const ConsultantList = (consultants: ConsultantListProps) => {
    const specialties = ['all', 'Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 'Dermatology', 'Psychiatry'];
    const [showFilters, setShowFilter] = useState(false);
    const [selectedAvailability, setSelectedAvailability] = useState('all');
    const [selectedRating, setSelectedRating] = useState('all');
    const [selectedSpecialty, setSelectedSpecialty] = useState('all');
    const [searchValue, setSearchValue] = useState('')

    const filteredConsultants = useMemo(() => {
        return consultants.consultants.filter(consultant => {
            const matchedSearch = consultant.name.toLowerCase().includes(searchValue.toLowerCase()) ||
                consultant.specialty.toLowerCase().includes(searchValue.toLowerCase());
            const matchesSpecialty = selectedSpecialty === 'all' || consultant.specialty === selectedSpecialty;
            const matchesRating = selectedRating === 'all' || consultant.rating >= parseFloat(selectedRating);
            const matchesAvailability = selectedAvailability === 'all' ||
                (selectedAvailability === 'today' && consultant.availability.includes('Today')) ||
                (selectedAvailability === 'tomorrow' && consultant.availability.includes('Tomorrow')) ||
                (selectedAvailability === 'week' && consultant.availability.includes('Week'));
            return matchedSearch && matchesAvailability && matchesRating && matchesSpecialty;
        });
    }
        , [searchValue, selectedSpecialty, selectedRating, selectedAvailability]);

    return (
        <div hidden className='max-w-4xl mx-auto p-6 bg-light-4'>
            <header className='mb-4 px-2'>
                <h1 className='h3-bold text-dark-4'>Find Medical Consultants</h1>
                <p className='text-dark-1'>Connect with qualified healthcare professionals</p>
            </header>
            <LocalSearch placeholder='Search by name or specialty' setSearchValue={setSearchValue} />
            <div className='mb-4'></div>
            <section className='mb-4 px-2'>
                <button
                    onClick={() => setShowFilter(() => !showFilters)}
                    className='flex items-center gap-2 px-4 py-2 mb-4 rounded-sm border border-light-3 hover:bg-light-1 transition-colors'
                >
                    <Filter className='w-4 h-4' />
                    Filters
                    <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </button>
                {showFilters && (
                    <div className='bg-white p-4 rounded-lg border border-light-3 mb-4 grid grid-cols-1 md-grid-cols-3 gap-4'>
                        <div>
                            <Label className='block text-dark-1 font-semibold mb-2'>Specialty</Label>
                            <Select
                                onValueChange={(value) => setSelectedSpecialty(value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder='Select specialty' />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Specialties</SelectLabel>
                                        {specialties.map((specialty) => (
                                            <SelectItem key={specialty} value={specialty}>
                                                {specialty === 'all' ? 'All Specialties' : specialty}
                                            </SelectItem>
                                        ))
                                        }
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label className='block text-dark-1 font-semibold mb-2'>Minimum Rating</Label>
                            <Select
                                onValueChange={(value) => setSelectedRating(value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder='Select minimum rating' />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Rating</SelectLabel>
                                        <SelectItem value='all'>Any Rating</SelectItem>
                                        <SelectItem value='4.5'>4.5+ Stars</SelectItem>
                                        <SelectItem value='4.0'>4.0+ Stars</SelectItem>
                                        <SelectItem value='3.5'>3.5+ Stars</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label className='block text-dark-1 font-semibold mb-2'>Availability</Label>
                            <Select
                                onValueChange={(value) => setSelectedAvailability(value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder='Select Availability' />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Availability</SelectLabel>
                                        <SelectItem value='all'>Any TIme</SelectItem>
                                        <SelectItem value='today'>Available Today</SelectItem>
                                        <SelectItem value='tomorrow'>Available Tomorrow</SelectItem>
                                        <SelectItem value='week'>Available this week</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                )}
            </section>

            <div className='mb-2 px-2'>
                <p className='text-dark-2'>{filteredConsultants.length} results</p>
            </div>

            <section className='space-y-4 overflow-y-auto max-h-[600px] px-2'>
                {filteredConsultants.map(consultant => (
                    <ConsultantThumbnail
                        experience={consultant.experience}
                        fee={consultant.consultationFee}
                        id={consultant.id}
                        location={consultant.location}
                        name={consultant.name}
                        availability={consultant.availability}
                        qualifications={consultant.qualifications}
                        rating={consultant.rating}
                        reviewCount={consultant.reviews}
                        specialty={consultant.specialty}
                        verificationScore={2}
                        avatarUrl={consultant.image}
                        key={consultant.id}
                        languages={consultant.languages}
                        nextSlot={consultant.nextSlot}
                        handleViewProfile={consultants.handleViewProfile}
                        handleScheduleConsultant={consultants.handleScheduleConsultant}
                    />
                ))

                }
                {filteredConsultants.length === 0 && (
                    <div className='text-center py-12 text-gray-400'>
                        <Stethoscope className='w-12 h-12 mx-auto mb-4 text-gray-500' />
                        <p>No consultants found matching your criteria.</p>
                        <p className="text-sm">Try adjusting your search or filters.</p>
                    </div>
                )}
            </section>
        </div>
    )
}

export default ConsultantList