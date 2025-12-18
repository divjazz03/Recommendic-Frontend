import { useGetConsultantTimeSlots } from "@/lib/actions/generalQueriesAndMutation";
import React, { useMemo, useState } from "react";
import { schedulesToTimeSlots } from "./usePatientSchedules";
import { ActionModalType, ConsultantAppointmentType } from "./useAppointment";
import { useUserContext } from "@/context/AuthContext";
import { useConfirmAppointment } from "@/lib/actions/consultantQueryAndMutations";



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

  const handleReschedule = () => {

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
  const [rescheduleDate, setRescheduleDate] = useState<Date | null>(new Date());
  const [rescheduleTime, setRescheduleTime] = useState('');
  const {userContext} = useUserContext()
  const { data: timeSlots } = useGetConsultantTimeSlots(userContext.user_id !!, rescheduleDate?.toISOString().split('T')[0], action.type === 'reschedule')
  const [_, setSelectedScheduleId] = useState<string | undefined>();
  const [notes, setNotes] = useState<string>()
  const timeSlotsMem = useMemo(() => schedulesToTimeSlots(timeSlots? timeSlots.data : []), [timeSlots])

  const {mutateAsync: confirmAppointment} = useConfirmAppointment()

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
          status: 'resheduled',
          rescheduleReason: actionReason
        }
        : apt
    ));
    setActionModal(null);
    setActionReason('');
    setRescheduleDate(null);
    setRescheduleTime('');
  };

  const handleApprove = async (appointmentId: string) => {
    await confirmAppointment({appointmentId: appointmentId, note: notes})
    setAppointments(appointments => appointments.map(apt => 
      apt.id === appointmentId ?
       {
      ...apt,
      status: 'confirmed',
      notes: notes
      
    }: apt));
    setActionModal(null);
    setActionReason('');
    setRescheduleDate(null);
    setRescheduleTime('');
  }
  

  return {
    handleCancel,
    handleDecline,
    handleApprove,
    notes,
    setNotes,
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