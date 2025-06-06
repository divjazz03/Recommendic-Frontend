import ConsultantList from '@/components/ConsultantList'
import ConsultantScreen from '@/components/ConsultantScreen'
import LocalSearch from '@/components/LocalSearch'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const consultantPreview = [
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

  const consultant = {
          name: "Dr. Sarah Mitchell",
          title: "Cardiologist & Internal Medicine Specialist",
          rating: 4.9,
          totalReviews: 347,
          bio: `Dr. Sarah Mitchell is a board-certified cardiologist with over 12 years of experience in treating 
                      cardiovascular diseases and internal medicine conditions. She specializes in preventive cardiology, 
                      hypertension management, and heart disease prevention. Dr. Mitchell is known for her patient-centered 
                      approach and commitment to providing comprehensive care.`,
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
          },
          recentReviews: [
          { name: "Adunni O.", rating: 5, comment: "Excellent care and very thorough explanation of my condition.", date: "2 days ago" },
          { name: "Michael K.", rating: 5, comment: "Dr. Mitchell helped me manage my hypertension effectively.", date: "1 week ago" },
          { name: "Fatima A.", rating: 4, comment: "Professional and caring. Highly recommend for heart issues.", date: "2 weeks ago" }
      ],
      availableSlots: [
          { time: "2:30 PM", type: "Video Call" },
          { time: "4:00 PM", type: "Phone Call" },
          { time: "5:30 PM", type: "Video Call" }
      ]
      }
      
  
      

const Consultant = () => {

  const [profileIsVisible, setProfileIsVisible] = useState(false);
  const navigate = useNavigate();

  const handleViewProfile = (consultantId: number) => {
      setProfileIsVisible(true);
  }
  const handleScheduleConsultant = (consultantId: number) => {
    navigate('/patient/schedule',{preventScrollReset:true})
  }
  
  return (
    <div className='flex flex-col space-y-2 bg-light-4 w-full max-h-screen min-h-[760px] p-2 rounded-md'>
      <section>
        <ConsultantList isVisible={profileIsVisible} consultants={consultantPreview} handleViewProfile={handleViewProfile} handleScheduleConsultant={handleScheduleConsultant}/>
        <ConsultantScreen
          availableSlots={consultant.availableSlots}
          bio={consultant.bio}
          consultationFee={consultant.consultationFee}
          education={consultant.education}
          experience={consultant.experience}
          image={consultant.image}
          languages={consultant.languages}
          location={consultant.location}
          name={consultant.name}
          nextAvailable={consultant.nextAvailable}
          rating={consultant.rating}
          reviews={consultant.recentReviews}
          specializations={consultant.specializations}
          stats={consultant.stats}
          title={consultant.title}
          totalReviews={consultant.totalReviews}
          isVisible={profileIsVisible}
        />
      </section>
    </div>
  )
}

export default Consultant