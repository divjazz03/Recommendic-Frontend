import { TimeSlot, TimeSlots } from '@/hooks/usePatientSchedules'
import { DateTime } from 'luxon'
import React from 'react'

export interface ConsultantTimeSlotsProps {
    timeSlots: TimeSlots,
    setSelectedTime: (value: React.SetStateAction<string | undefined>) => void
    setSelectedScheduleId: (value: React.SetStateAction<string | undefined>) => void
    selectedTime: string
}
const ConsultantTimeSlots: React.FC<ConsultantTimeSlotsProps> = ({
    timeSlots,
    selectedTime,
    setSelectedScheduleId,
    setSelectedTime
}) => {
  return (
    <div>
        {timeSlots && Object.entries(timeSlots)
                            .filter(([period, slots]: [string, TimeSlot[]]) => period !== 'unavailableSlots' && period !== 'bookedSlots' && slots.length > 0)
                            .map(([period, slots]: [string, TimeSlot[]]) => (
                              <div key={period} className='mb-6'>
                                <h3 className='text-lg font-medium text-dark-2 mb-3 capitalize'>{period}</h3>
                                <div className='grid grid-cols-3 sm:grid-cols-6 gap-3'>
                                  {slots.map((slot: TimeSlot, index) => {
                                    const slotTime = DateTime.fromISO(slot.dateTime, {zone: 'utc'})
                                    .setZone(DateTime.local().zone)
                                    .toFormat('hh:mm a')
                                    return (
                                      slot &&
                                      <button
                                        key={index}
                                        onClick={() => {
                                          setSelectedTime(slot.dateTime)
                                          setSelectedScheduleId(slot.scheduleId)
                                        }}
                                        className={`
                                      p-3 rounded-lg text-sm font-medium transition-all duration-100
                                      ${selectedTime === slot.dateTime
                                            ? 'bg-main text-white shadow-lg'
                                            : 'bg-gray-50 text-dark-2 hover:bg-main-light hover:text-white'
                                          }
                                      `}
                                      >
                                        {slotTime}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            ))}
    </div>
  )
}

export default ConsultantTimeSlots