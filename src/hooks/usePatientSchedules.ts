import { useCreateAppointment, useGetConsultantSchedules } from "@/lib/actions/patientQueryAndMutations";
import { LucideProps } from "lucide-react";
import { DateTime } from "luxon";
import { useCallback, useEffect, useState } from "react"



export const usePatientSchedule = (consultantId: string) => {
    const [selectedScheduleId, setSelectedScheduleId] = useState<string>();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState<string | undefined>();
    const [reason, setReason] = useState<string>()
    const { data, isPending } = useGetConsultantSchedules(consultantId, selectedDate.toISOString().split("T")[0]);
    const [consultationType, setConsultationType] = useState<ConsultationChannel>('in_person');
    const [currentStep, setCurrentStep] = useState(1);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [consultantScheduleData, setConsultantScheduleData] = useState<ConsultantScheduleData>();
    const callBackSchedulesToTimeSlots = useCallback(schedulesToTimeSlots, [data?.data, selectedDate])
    const {mutateAsync: createAnAppointment, isPending: isCreating} = useCreateAppointment()
    
    useEffect(() => {
        const scheduleData = data?.data
        if (scheduleData) {
            setConsultantScheduleData({
            fullName: scheduleData.profile?.fullName,
            fee: scheduleData.profile?.fee,
            image: scheduleData.profile?.image,
            location: scheduleData.profile?.location,
            rating: scheduleData.profile?.rating,
            title: scheduleData.profile?.title,
            timeSlots: callBackSchedulesToTimeSlots(scheduleData.scheduleSlots)
        })
    }

    }, [data?.data, selectedDate, callBackSchedulesToTimeSlots])

    const isTimeSlotAvailable = (time: string): boolean => {
        return !consultantScheduleData?.timeSlots.unavailableSlots.map((slot) => slot.dateTime).includes(time) &&
            !consultantScheduleData?.timeSlots.bookedSlots.map((slot) => slot.dateTime).includes(time);
    }

    const handleFinalBooking = async () => {
        console.log(selectedScheduleId)
        if (selectedScheduleId) {
            await createAnAppointment({
                channel: consultationType,
                consultantId: consultantId,
                date: selectedDate.toISOString().split("T")[0],
                scheduleId: selectedScheduleId,
                reason: reason || ''
            });
        }
    }



    return {
        selectedTime,
        setSelectedDate,
        setSelectedTime,
        selectedDate,
        isPending,
        consultationType,
        currentStep,
        currentMonth,
        setCurrentMonth,
        setCurrentStep,
        callBackSchedulesToTimeSlots,
        consultantScheduleData,
        setConsultationType, isTimeSlotAvailable,
        handleFinalBooking,
        isCreating,
        setSelectedScheduleId,
        selectedScheduleId,
        reason,
        setReason
    }
}

export const schedulesToTimeSlots = (schedules: TimeSlot[]): TimeSlots => {
    const morning: TimeSlot[] = []
    const afternoon: TimeSlot[] = []
    const evening: TimeSlot[] = []
    const unavailableSlots: TimeSlot[] = []
    const bookedSlots: TimeSlot[] = []

        schedules?.forEach(schedule => {
            function toSeconds(timeStr: string) {
                const [h, m, s = 0] = timeStr.split(':').map(Number)
                const offsetInMinutes = new Date().getTimezoneOffset()*60
                return h * 3600 + m * 60 + s + offsetInMinutes;
            }
            const morningTime = toSeconds('8:00')
            const afternoonTime = toSeconds('11:00');
            const eveningTime = toSeconds("16:00")
            const formattedTime: string = DateTime.fromISO(schedule.dateTime, {zone: 'utc'}).toFormat('HH:mm')
            const scheduleTime = toSeconds(formattedTime)
            console.log(afternoonTime);
            console.log(schedule.dateTime)
            console.log(formattedTime)
            const scheduleTimeIsMorning = scheduleTime >= morningTime && scheduleTime < afternoonTime;
            const scheduleTimeIsAfternoon = scheduleTime >= afternoonTime && scheduleTime < eveningTime;
            const scheduleTimeIsEvening = scheduleTime >= eveningTime;
            console.log(scheduleTimeIsAfternoon)
            if (scheduleTimeIsMorning) {
                morning.push({
                    scheduleId: schedule.scheduleId, dateTime: schedule.dateTime
                })
            }
            if (scheduleTimeIsAfternoon) {
                afternoon.push({
                    scheduleId: schedule.scheduleId, dateTime: schedule.dateTime
                })
            }
            if (scheduleTimeIsEvening) {
                evening.push({
                    scheduleId: schedule.scheduleId, dateTime: schedule.dateTime
                })
            }
        })
    return {
        afternoon: afternoon,
        morning: morning,
        evening: evening,
        bookedSlots: bookedSlots,
        unavailableSlots: unavailableSlots
    }
}


export type ConsultationChannel = "in_person" | "online"
export type ConsultationType = {
    id: ConsultationChannel,
    name: string,
    description: string,
    duration: string,
    icon: React.ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>>,
    fee: number,
    recommended?: boolean
}

export interface ScheduleData {
    consultantId: string,
    scheduleId: string,
    channel: ConsultationChannel
}

export interface Fee {
    online: number
    in_person: number
}
export interface TimeSlot {
    scheduleId: string,
    dateTime: string
}
export interface TimeSlots {
    morning: TimeSlot[]
    afternoon: TimeSlot[]
    evening: TimeSlot[]
    unavailableSlots: TimeSlot[]
    bookedSlots: TimeSlot[]
}

export interface ConsultantScheduleData {
    fullName: string
    title?: string
    rating: number
    image: string
    fee: Fee
    timeSlots: TimeSlots
    location: string
}
