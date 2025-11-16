import CustomCalender from '@/components/shared/CustomCalender';
import InitialsOrAvartar from '@/components/shared/InitialsOrAvartar';
import { ArrowLeft, Calendar, CheckCircle, CreditCard, Info, Shield, Star, User, Video } from 'lucide-react';
import React from 'react'
import { useLocation } from 'react-router-dom';
import Loader from '../shared/Loader';
import { DateTime } from 'luxon';
import { ConsultationChannel, ConsultationType,  usePatientSchedule } from '@/hooks/usePatientSchedules';
import { formatDate } from '@/lib/utils/utils';
import ConsultantTimeSlots from '../shared/ConsultantTimeSlots';

export const PatientSchedule = () => {
  const location = useLocation();
  const consultantId: string = location.state?.id;

  const {
    consultantScheduleData,
    consultationType,
    currentMonth,
    currentStep,
    isPending,
    selectedDate,
    selectedTime,
    setCurrentMonth,
    setCurrentStep,
    setSelectedDate,
    setSelectedTime,
    setConsultationType,
    handleFinalBooking,
    isCreating,
    setSelectedScheduleId,
    selectedScheduleId,
    reason,
    setReason
  } = usePatientSchedule(consultantId);




  const consultationTypes: ConsultationType[] = [
    {
      id: 'in_person',
      name: 'In Person',
      description: 'In-person consultation',
      duration: '1 hour',
      icon: User,
      fee: consultantScheduleData?.fee?.in_person ?? 0,
      recommended: true
    }
    ,
    {
      id: 'online',
      name: 'Online',
      icon: Video,
      description: 'Face-to-face consultation via video',
      duration: '30 mins',
      fee: consultantScheduleData?.fee?.online ?? 0
    },
  ];



  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };
  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  }
  const handleBooking = async () => {
    setCurrentStep(3);
    await handleFinalBooking();
  };

  if (currentStep === 3 && !isCreating) {
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
                  <span className="font-medium">{DateTime.fromISO(selectedTime).toFormat('HH:MM a ZZZZ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium capitalize">{consultationType} Call</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fee:</span>
                  <span className="font-medium">${consultantScheduleData?.fee[consultationType]}</span>
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


  if (currentStep === 3 && isCreating) {
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
            {isPending ? <Loader /> : <p className='text-dark-1'>Book a consultation with {consultantScheduleData?.fullName}</p>}
          </div>
        </header>

        {isPending ? <Loader /> : <section className=' bg-white rounded-2xl shadow-lg p-6 mb-6'>
          <div className='flex items-center gap-4'>
            <InitialsOrAvartar name={consultantScheduleData?.fullName} avatarUrl={consultantScheduleData?.image} />
            <div className='flex-1'>
              <div className='flex items-center gap-2 mb-1'>
                <h3 className='text-xl font-semibold text-dark-3'>{consultantScheduleData?.fullName}</h3>
                <Shield className='w-5 h-5 text-main' />
              </div>
              <p className='text-dark-1'>{consultantScheduleData?.title}</p>
              <div className='flex items-center gap-1 mt-1'>
                <Star className='w-4 h-4 text-main fill-current' />
                <span className='text-sm font-medium text-dark-3'>{consultantScheduleData?.rating}</span>
              </div>
            </div>
          </div>
        </section>}


        {/* Calendar Section*/}
        {isPending ? <Loader /> :
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

                  {consultantScheduleData &&
                    <ConsultantTimeSlots
                      selectedTime={selectedTime ?? ''}
                      setSelectedScheduleId={setSelectedScheduleId}
                      setSelectedTime={setSelectedTime}
                      timeSlots={consultantScheduleData.timeSlots} />
                  }
                </div>
              )}
            </div>

            <div className='bg-white rounded-2xl shadow-lg p-6'>
              <h2>Reason</h2>
              <textarea
                onChange={(e) => setReason(e.target.value)}
                value={reason}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main-light  outline-none disabled:bg-gray-50 resize-none"
              />
            </div>

            {/* Booking summary */}
            <div className='space-y-6'>
              {/* Consultation type */}
              <div className='bg-white rounded-2xl shadow-lg p-6'>
                <h2 className='text-xl font-semibold text-dark-3 mb-4'>Consultation Type</h2>
                <div className='space-y-3'>
                  {consultationTypes.map(type => (
                    <div key={type.id}
                      onClick={() => setConsultationType(type.id as ConsultationChannel)}
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
                              <span className='font-semibold text-main'>{'$' + type.fee}</span>
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
              {selectedDate && selectedTime && selectedScheduleId && reason && (
                <section className='bg-white rounded-2xl shadow-lg p-6'>
                  <h2 className='text-xl font-semibold text-dark-3 mb-4'>Booking Summary</h2>
                  <div className='space-y-4'>

                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Calendar className="w-5 h-5 text-dark-1" />
                      <div>
                        <div className="font-medium text-dark-3">
                          {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                        <div className="text-sm text-gray-600">{DateTime.fromISO(selectedTime).toFormat("hh:mm a")}</div>
                      </div>
                    </div>

                    <div className='flex items-center gap-3 p-3 bg-gray-50 rounded-lg'>
                      {React.createElement(consultationTypes.find(t => t.id === consultationType).icon,
                        { className: 'w-5 h-5 text-dark-1' })

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
                          {`$${consultantScheduleData?.fee[consultationType]}`}
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
        }

      </div>
    </section>
  )
}







