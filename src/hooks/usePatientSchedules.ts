import { useCreateAppointment, useGetConsultantSchedules } from "@/lib/react-query/patientQueryAndMutations";
import { ScheduleWithAppointmentDetail } from "@/types";
import { LucideProps } from "lucide-react";
import { useCallback, useEffect, useState } from "react"



export const usePatientSchedule = (consultantId: string) => {
    const [selectedScheduleId, setSelectedScheduleId] = useState<string>();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const { data, isPending } = useGetConsultantSchedules(consultantId, selectedDate.toISOString().split("T")[0]);
    const [consultationType, setConsultationType] = useState<ConsultationChannel>('in_person');
    const [currentStep, setCurrentStep] = useState(1);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [consultantScheduleData, setConsultantScheduleData] = useState<ConsultantScheduleData>();
    const callBackSchedulesToTimeSlots = useCallback(schedulesToTimeSlots, [data?.data, selectedDate])
    const {mutateAsync: createAnAppointment, isPending: isCreating} = useCreateAppointment()
    useEffect(() => {
        const scheduleData = data?.data
        scheduleData && setConsultantScheduleData({
            fullName: scheduleData.profile.fullName,
            fee: scheduleData.profile.fee,
            image: scheduleData.profile.image,
            location: scheduleData.profile.location,
            rating: scheduleData.profile.rating,
            title: scheduleData.profile.title,
            timeSlots: callBackSchedulesToTimeSlots(scheduleData.schedules, selectedDate)
        })
    }, [data?.data, selectedDate])

    const isTimeSlotAvailable = (time: string): boolean => {
        return !consultantScheduleData?.timeSlots.unavailableSlots.map((slot) => slot.time).includes(time) &&
            !consultantScheduleData?.timeSlots.bookedSlots.map((slot) => slot.time).includes(time);
    }

    const handleFinalBooking = async () => {
        console.log(selectedScheduleId)
        if (selectedScheduleId) {
            await createAnAppointment({
                channel: consultationType,
                consultantId: consultantId,
                date: selectedDate.toISOString().split("T")[0],
                scheduleId: selectedScheduleId,
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
        selectedScheduleId
    }
}

const schedulesToTimeSlots = (schedules: ScheduleWithAppointmentDetail[], selectedDate: Date): TimeSlots => {
    const weekdays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const morning: TimeSlot[] = []
    const afternoon: TimeSlot[] = []
    const evening: TimeSlot[] = []
    const unavailableSlots: TimeSlot[] = []
    const bookedSlots: TimeSlot[] = []

    schedules?.filter(schedule => {
        if (schedule.schedule.recurrenceRule?.frequency === 'weekly') {
            return schedule.schedule.recurrenceRule.weekDays.includes(weekdays[selectedDate.getDay()] as WeekDay)
        } else {
            return true
        }
    })
        .forEach(schedule => {
            function toSeconds(timeStr: string) {
                const [h, m, s = 0] = timeStr.split(':').map(Number)
                return h * 3600 + m * 60 + s;
            }
            const morningTime = toSeconds('9:00')
            const afternoonTime = toSeconds('12:00');
            const eveningTime = toSeconds("17:00")
            const scheduleTime = toSeconds(schedule.schedule.startTime)
            const scheduleTimeIsMorning = scheduleTime >= morningTime && scheduleTime < afternoonTime;
            const scheduleTimeIsAfternoon = scheduleTime >= afternoonTime && scheduleTime < eveningTime;
            const scheduleTimeIsEvening = scheduleTime >= eveningTime;
            const scheduleIsAvailable = schedule.schedule.isActive;
            const scheduleSlotIsBooked = schedule.schedule.recurrenceRule?.frequency === 'one-off' && schedule.appointmentDateAndTimes.length !== 0
            if (scheduleTimeIsMorning) {
                morning.push({
                    scheduleId: schedule.schedule.id, time: schedule.schedule.startTime
                })
            }
            if (scheduleTimeIsAfternoon) {
                afternoon.push({
                    scheduleId: schedule.schedule.id, time: schedule.schedule.startTime
                })
            }
            if (scheduleTimeIsEvening) {
                evening.push({
                    scheduleId: schedule.schedule.id, time: schedule.schedule.startTime
                })
            }
            if (!scheduleIsAvailable) {
                unavailableSlots.push({
                    scheduleId: schedule.schedule.id, time: schedule.schedule.startTime
                })
            }
            if (scheduleSlotIsBooked) {
                bookedSlots.push({
                    scheduleId: schedule.schedule.id, time: schedule.schedule.startTime
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
export const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
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
    time: string
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
