import CustomCalender from '@/components/shared/CustomCalender';
import InitialsOrAvartar from '@/components/shared/InitialsOrAvartar';
import { ArrowLeft, Calendar, CheckCircle,CreditCard, Info, Shield, Star, User, Video } from 'lucide-react';
import React, { useState } from 'react'
import { useLocation } from 'react-router-dom';

interface Fee {
  online: number
  inPerson: number
}
interface TimeSlots{
  morning: string[]
  afternoon: string[]
  evening: string[]
  unavailableSlots: string[]
  bookedSlots: string[]
}

export interface ConsultantScheduleData {
  fullName: string
  title?: string
  rating: number
  image: string
  fees: Fee
  timeSlots: TimeSlots
  location: string
}


const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export const PatientSchedule = () => {
  const location = useLocation();
  //const consultantId: number = location.state.id;
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState<string|null>(null);
  const [consultationType, setConsultationType] = useState<'inPerson'|'online'>('inPerson');
  const [currentStep, setCurrentStep] = useState(1);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [consultantScheduleData, setConsultantScheduleData] = useState<ConsultantScheduleData>({
    fullName: "Dr. " + "Sarah Mitchell",
    title: "Cardiologist & Internal Medicine",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop&crop=face",
    fees: {
      inPerson: 30,
      online: 15
    },
    timeSlots: {
      morning: ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30"],
      afternoon: ["14:00", "14:30", "15:00", "15:30", "16:00", "16:30"],
      evening: ["17:00", "17:30", "18:00", "18:30", "19:00", "19:30"],
      unavailableSlots: ["10:30", "15:00", "18:30"],
      bookedSlots: ["09:30", "14:30", "17:00"]
    },
    location: 'University Teaching hospital, Lagos'
  })

  const consultationTypes = [
    {
      id: 'inPerson',
      name: 'In Person',
      description: 'In-person consultation',
      duration: '1 hour',
      icon: User,
      fee: consultantScheduleData.fees.inPerson,
      recommended: true
    }
    ,
    {
      id: 'online',
      name: 'Online',
      icon: Video,
      description: 'Face-to-face consultation via video',
      duration: '30 mins',
      fee: consultantScheduleData.fees.online
    },
  ];

  const isTimeSlotAvailable = (time: string): boolean => {
    return !consultantScheduleData.timeSlots.unavailableSlots.includes(time) &&
      !consultantScheduleData.timeSlots.bookedSlots.includes(time);
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };
  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  }
  const handleBooking = () => {
    setCurrentStep(3);
    // booking process
    setTimeout(() => {
      setCurrentStep(4)
    }, 3000);
  };

  if (currentStep === 4) {
    return (
      <div className="h-full bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto pt-20">
          <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-dark-3 mb-4">Booking Confirmed!</h2>
            <p className="text-gray-600 mb-6">
              Your consultation with Dr. Sarah Mitchell has been successfully scheduled.
            </p>
            <div className="bg-gray-50 rounded-2xl p-6 mb-6">
              <div className="space-y-3 text-left">
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">{formatDate(selectedDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time:</span>
                  <span className="font-medium">{selectedTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium capitalize">{consultationType} Call</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fee:</span>
                  <span className="font-medium">{consultantScheduleData.fees[consultationType]}</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => window.history.back()}
              className="px-8 py-3 bg-main-light text-white rounded-xl font-semibold hover:bg-main transition-colors duration-300"
            >
              Back to Profile
            </button>
          </div>
        </div>
      </div>
    );
  }


  if (currentStep === 3) {
    return (
      <div className='max-h-[800px] h-full bg-gray-50 p-4'>
        <div className="max-w-2xl mx-auto pt-20">
          <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
            <div className="animate-spin w-12 h-12 border-4 border-main-light border-t-transparent rounded-full mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold text-dark-3 mb-4">Processing Your Booking...</h2>
            <p className="text-gray-600">Please wait while we confirm your appointment.</p>
          </div>
        </div>
      </div>
    )
  }


  return (
    <section className='bg-gray-50 h-full p-4 '>
      <div className='flex flex-col h-full max-w-3xl mx-auto overflow-auto scroll-smooth
       [&::-webkit-scrollbar]:hidden [scrollbar-width:none] [-ms-overflow-style:none]'>

        <header className='flex items-center gap-4 mb-4'>
          <button
            onClick={() => window.history.back()}
            className='p-2 hover:bg-white rounded-xl transition-colors duration-100'
          >
            <ArrowLeft className='w-6 h-6 text-dark-2' />
          </button>
          <div>
            <h1 className='text-3xl font-bold text-dark-3'>Schedule Appointment</h1>
            <p className='text-dark-1'>Book a consultation with {consultantScheduleData.fullName}</p>
          </div>
        </header>

        <section className=' bg-white rounded-2xl shadow-lg p-6 mb-6'>
          <div className='flex items-center gap-4'>
            <InitialsOrAvartar name={consultantScheduleData.fullName} avatarUrl={consultantScheduleData.image} />
            <div className='flex-1'>
              <div className='flex items-center gap-2 mb-1'>
                <h3 className='text-xl font-semibold text-dark-3'>{consultantScheduleData.fullName}</h3>
                <Shield className='w-5 h-5 text-main' />
              </div>
              <p className='text-dark-1'>{consultantScheduleData.title}</p>
              <div className='flex items-center gap-1 mt-1'>
                <Star className='w-4 h-4 text-main fill-current' />
                <span className='text-sm font-medium text-dark-3'>{consultantScheduleData.rating}</span>
              </div>
            </div>
          </div>
        </section>


        {/* Calendar Section*/}
        <section className='grid gap-6'>
          <div className=''>

            <CustomCalender 
              currentMonth={currentMonth}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              toNextMonth={nextMonth}
              toPreviousMonth={previousMonth}
              />

            {/* Time slots */}
            {selectedDate && (
              <div className='bg-white rounded-2xl shadow-lg p-6'>
                <h2 className='text-xl font-semibold text-dark-3 mb-4'>Available Times</h2>
                <p className='text-dark-2 mb-6'>{formatDate(selectedDate)}</p>

                {Object.entries(consultantScheduleData.timeSlots)
                .filter(([period]) => period !== 'unavailableSlots' && period !== 'bookedSlots')
                .map(([period, slots]:[string,string[]]) => (
                  <div key={period} className='mb-6'>
                    <h3 className='text-lg font-medium text-dark-2 mb-3 capitalize'>{period}</h3>
                    <div className='grid grid-cols-3 sm:grid-cols-6 gap-3'>
                      {slots.map((time: string) => {
                        const available = isTimeSlotAvailable(time);
                        const booked = consultantScheduleData.timeSlots.bookedSlots.includes(time);
                        return (
                          <button
                            key={time}
                            onClick={() => available && setSelectedTime(time)}
                            disabled={!available}
                            className={`
                              p-3 rounded-lg text-sm font-medium transition-all duration-100
                              ${!available
                                ? booked
                                  ? 'bg-red-100 text-red-400 cursor-not-allowed'
                                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : selectedTime === time
                                  ? 'bg-main text-white shadow-lg'
                                  : 'bg-gray-50 text-dark-2 hover:bg-main-light hover:text-white'
                              }
                              `}
                          >
                            {time}
                            {booked && <div className='text-xs mt-1'>Booked</div>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Booking summary */}
          <div className='space-y-6'>
            {/* Consultation type */}
            <div className='bg-white rounded-2xl shadow-lg p-6'>
              <h2 className='text-xl font-semibold text-dark-3 mb-4'>Consultation Type</h2>
              <div className='space-y-3'>
                {consultationTypes.map(type => (
                  <div key={type.id}
                    onClick={() => setConsultationType(type.id)}
                    className={`
                      p-4 rounded-xl border-2 cursor-pointer transition-all duration-100 relative
                      ${consultationType === type.id
                        ? 'border-main'
                        : 'border-light-2 hover:border-light-1'
                      }
                      `}
                  >
                    {type.recommended && (
                      <div className='absolute -top-2 -right-2 bg-main-light text-white text-xs px-2 py-1 rounded-full'>
                        Recommended
                      </div>
                    )}
                    <div>
                      <div className='flex items-start gap-3'>
                        <div className={`
                          w-10 h-10 rounded-lg flex items-center justify-center
                        ${consultationType === type.id ? 'bg-main text-white' : 'bg-gray-100 text-gray-600'}
                        `}>
                          <type.icon className='w-5 h-5' />
                        </div>
                        <div className='flex-1'>
                            <div className='flex items-center justify-between mb-1'>
                              <h3 className='font-medium text-dark-3'>{type.name}</h3>
                              <span className='font-semibold text-main'>{'$'+type.fee}</span>
                            </div>
                            <p className='text-sm text-gray-600 mb-1'>{type.description}</p>
                            <p className='text-xs text-gray-600 mb-1'>{type.duration}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/*Still under summary */}
            {selectedDate && selectedTime && (
              <section className='bg-white rounded-2xl shadow-lg p-6'>
                <h2 className='text-xl font-semibold text-dark-3 mb-4'>Booking Summary</h2>
                <div className='space-y-4'>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-dark-1" />
                    <div>
                      <div className="font-medium text-dark-3">
                        {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                      <div className="text-sm text-gray-600">{selectedTime}</div>
                    </div>
                  </div>

                  <div className='flex items-center gap-3 p-3 bg-gray-50 rounded-lg'>
                    {React.createElement(consultationTypes.find(t => t.id === consultationType).icon,
                     {className: 'w-5 h-5 text-dark-1'})

                    }
                    <div>
                      <div className='font-medium text-dark-3'>
                        {consultationTypes.find(t => t.id === consultationType).name}
                      </div>
                      <div className='font-sm text-gray-600'>
                        {consultationTypes.find(t => t.id === consultationType).duration}
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-lg font-medium text-dark-3">Total</span>
                      <span className="text-2xl font-bold text-main">
                        {consultantScheduleData.fees[consultationType]}
                      </span>
                    </div>
                    
                    <button 
                      onClick={handleBooking}
                      className="w-full py-4 bg-gradient-to-r from-main to-main-light text-white rounded-xl font-semibold hover:from-main-light hover:to-main transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
                    >
                      <CreditCard className="w-5 h-5" />
                      Confirm Booking
                    </button>
                  </div>

                  <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                    <Info className="w-5 h-5 text-main-light mt-0.5" />
                    <div className="text-sm text-main">
                      <p className="font-medium mb-1">Booking Policy</p>
                      <p>You can reschedule or cancel up to 2 hours before your appointment.</p>
                    </div>
                  </div>

                </div>
              </section>
            )}
          </div>
        </section>


      </div>
    </section>
  )
}
