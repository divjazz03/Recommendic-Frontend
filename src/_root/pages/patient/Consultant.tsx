import ConsultantList from '@/components/ConsultantList'
import ConsultantScreen from '@/components/ConsultantScreen'
import LocalSearch from '@/components/LocalSearch'
import React, { useState } from 'react'



const Consultant = () => {

  const handleViewProfile = (consultantId: number) => {

  }
  const handleScheduleConsultant = (consultantId: number) => {

  }
  const consultants = [
      {
          id: 1,
          name: "Dr. Sarah Johnson",
          specialty: "Cardiology",
          rating: 4.9,
          reviews: 156,
          experience: "15 years",
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
          experience: "12 years",
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
          experience: "8 years",
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
          experience: "20 years",
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
          experience: "11 years",
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
          experience: "14 years",
          location: "Mental Health Center",
          availability: "Available Tomorrow",
          consultationFee: "$175",
          image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&h=150&fit=crop&crop=face",
          qualifications: ["MD", "Psychiatry Board Certified"],
          languages: ["English", "Korean"],
          nextSlot: "11:00 AM"
      }
  ];
  return (
    <div className='flex flex-col space-y-2 bg-light-4 w-full max-h-screen min-h-[760px] p-2 rounded-md'>
      <section>
        <ConsultantList consultants={consultants} handleViewProfile={handleViewProfile} handleScheduleConsultant={handleScheduleConsultant}/>
        <ConsultantScreen />
      </section>
    </div>
  )
}

export default Consultant