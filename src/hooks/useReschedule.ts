import { useGetConsultantTimeSlots } from "@/lib/react-query/generalQueriesAndMutation";
import React, { useMemo, useState } from "react";
import { toast } from "./use-toast";
import { schedulesToTimeSlots } from "./usePatientSchedules";
import { ActionModalType, ConsultantAppointmentType } from "./useAppointment";
import { useUserContext } from "@/context/AuthContext";



export const usePatientReschedule = (consultantId: string) => {
  const [rescheduleDate, setRescheduleDate] = useState<Date>(new Date());
  const [selectedScheduleId, setSelectedScheduleId] = useState<string | undefined>();
  const { data: timeSlots, isError, error } = useGetConsultantTimeSlots(consultantId, rescheduleDate?.toISOString().split('T')[0])
  const [rescheduleTime, setRescheduleTime] = useState<string>();
  const [reason, setReason] = useState("")
  const timeSlotsMem = useMemo(() => schedulesToTimeSlots(timeSlots? timeSlots.data : []), [timeSlots])

  if (isError) {
    console.log(error)
  }

  const handleReschedule = (appointmentId: string) => {

  }
  return {
    rescheduleDate,
    rescheduleTime,
    reason,
    setReason,
    setRescheduleDate,
    setRescheduleTime,
    timeSlotsMem,
    setSelectedScheduleId,
    handleReschedule
  }
}

export const useConsultantAction = (action: ActionModalType,
  setAppointments:(value: React.SetStateAction<ConsultantAppointmentType[]>) => void,
  setActionModal:(value: React.SetStateAction<ActionModalType | null>) => void) => {

  const [actionReason, setActionReason] = useState('');
  const [rescheduleDate, setRescheduleDate] = useState<Date>(new Date());
  const [rescheduleTime, setRescheduleTime] = useState('');
  const {userContext} = useUserContext()
  const { data: timeSlots, isError, error } = useGetConsultantTimeSlots(userContext.user_id !!, rescheduleDate?.toISOString().split('T')[0], action.type === 'reschedule')
  const [selectedScheduleId, setSelectedScheduleId] = useState<string | undefined>();
  const timeSlotsMem = useMemo(() => schedulesToTimeSlots(timeSlots? timeSlots.data : []), [timeSlots])




  const handleDecline = (appointmentId: string) => {
    if (!actionReason.trim()) {
      alert('Please provide a reason for declining');
      return;
    }
    setAppointments(appointments => appointments.map(apt =>
      apt.id === appointmentId
        ? { ...apt, status: 'cancelled', cancellationReason: actionReason }
        : apt
    ));
    setActionModal(null);
    setActionReason('');
  };

  const handleCancel = () => {
    setActionModal(null);
    setActionReason('');
    setRescheduleDate(null);
    setRescheduleTime('');
  }

  const handleReschedule = (appointmentId: string) => {
    if (!rescheduleDate || !rescheduleTime) {
      alert('Please select a new date and time');
      return;
    }
    setAppointments(appointments => appointments.map(apt =>
      apt.id === appointmentId
        ? {
          ...apt,
          date: rescheduleDate.toUTCString(),
          time: rescheduleTime,
          status: 'confirmed',
          rescheduleReason: actionReason
        }
        : apt
    ));
    setActionModal(null);
    setActionReason('');
    setRescheduleDate(null);
    setRescheduleTime('');
  };

  return {
    handleCancel,
    handleDecline,
    handleReschedule,
    rescheduleDate,
    rescheduleTime,
    setRescheduleDate,
    setRescheduleTime,
    actionReason,
    setActionReason,
    timeSlotsMem,
    setSelectedScheduleId
  }
}