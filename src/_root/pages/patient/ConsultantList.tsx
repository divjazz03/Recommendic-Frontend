import React, { useEffect, useMemo, useRef, useState } from 'react'
import LocalSearch from '../../../components/LocalSearch'
import { ChevronDown, Filter, Stethoscope } from 'lucide-react'
import { Label } from '../../../components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../../../components/ui/select';
import ConsultantThumbnail from '../../../components/ConsultantThumbnail';
import { ConsultantTypeMinimal } from '@/types';


const consultantPreview: ConsultantTypeMinimal[] = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialty: "Cardiology",
    rating: 4.9,
    reviews: 156,
    experience: 15,
    location: "Downtown Medical Center",
    availability: "Available Today",
    consultationFee: "$150",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face",
    qualifications: ["MD", "FACC"],
    languages: ["English", "Spanish"],
    nextSlot: "2:00 PM"
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    specialty: "Neurology",
    rating: 4.8,
    reviews: 203,
    experience: 12,
    location: "City Hospital",
    availability: "Available Tomorrow",
    consultationFee: "$180",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face",
    qualifications: ["MD", "PhD"],
    languages: ["English", "Mandarin"],
    nextSlot: "10:30 AM"
  },
  {
    id: 3,
    name: "Dr. Emily Rodriguez",
    specialty: "Pediatrics",
    rating: 4.9,
    reviews: 89,
    experience: 8,
    location: "Children's Medical Center",
    availability: "Available Today",
    consultationFee: "$120",
    image: "https://images.unsplash.com/photo-1594824694996-f4653b95c95b?w=150&h=150&fit=crop&crop=face",
    qualifications: ["MD", "FAAP"],
    languages: ["English", "Spanish"],
    nextSlot: "4:15 PM"
  },
  {
    id: 4,
    name: "Dr. James Wilson",
    specialty: "Orthopedics",
    rating: 4.7,
    reviews: 134,
    experience: 20,
    location: "Sports Medicine Clinic",
    availability: "Available This Week",
    consultationFee: "$200",
    image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face",
    qualifications: ["MD", "FAAOS"],
    languages: ["English"],
    nextSlot: "Tomorrow 9:00 AM"
  },
  {
    id: 5,
    name: "Dr. Priya Patel",
    specialty: "Dermatology",
    rating: 4.8,
    reviews: 167,
    experience: 11,
    location: "Skin Care Institute",
    availability: "Available Today",
    consultationFee: "$160",
    image: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=150&h=150&fit=crop&crop=face",
    qualifications: ["MD", "FAAD"],
    languages: ["English", "Hindi"],
    nextSlot: "3:30 PM"
  },
  {
    id: 6,
    name: "Dr. Robert Kim",
    specialty: "Psychiatry",
    rating: 4.6,
    reviews: 92,
    experience: 14,
    location: "Mental Health Center",
    availability: "Available Tomorrow",
    consultationFee: "$175",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&h=150&fit=crop&crop=face",
    qualifications: ["MD", "Psychiatry Board Certified"],
    languages: ["English", "Korean"],
    nextSlot: "11:00 AM"
  }
];

const ConsultantList = () => {
    const specialties = ['all', 'Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 'Dermatology', 'Psychiatry'];
    const [showFilters, setShowFilter] = useState(false);
    const [selectedAvailability, setSelectedAvailability] = useState('all');
    const [selectedRating, setSelectedRating] = useState('all');
    const [selectedSpecialty, setSelectedSpecialty] = useState('all');
    const [searchValue, setSearchValue] = useState('')
    const [consultants, setConsultants] = useState<ConsultantTypeMinimal[]>(consultantPreview)

    const thisRef: React.MutableRefObject<HTMLDivElement | null> = useRef(null);

    const filteredConsultants = useMemo(() => {
        return consultantPreview.filter(consultant => {
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
        <div ref={thisRef} className='max-w-4x h-full border-2 mx-auto  p-6 bg-blue-50'>
            <header className='mb-4 px-2'>
                <h1 className='font-bold text-3xl text-dark-4'>Find Medical Consultants</h1>
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

            <section className='space-y-4 overflow-y-auto h-full max-h-[560px] lg:max-h-[660px] px-2'>
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
                        avatarUrl={consultant.image}
                        key={consultant.id}
                        nextSlot={consultant.nextSlot}
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