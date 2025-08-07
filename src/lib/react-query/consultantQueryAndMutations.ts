import { useMutation, useQuery } from "@tanstack/react-query"
import { getMySchedules, getScheduleById, updateSchedule } from "../api/consultant_api"
import { ModifyingSchedule } from "@/_root/pages/consultant/ConsultantModifySchedule"

export const useGetCurrentUserSchedules = () => {
    return useQuery({
        queryKey: ["My Schedules"],
        queryFn: getMySchedules,
        staleTime: 3600 * 1000,
        retry: false
    })
}

export const useGetScheduleWithUserId = (scheduleId: number) => {
    return useQuery({
        queryKey: ["Schedule", scheduleId],
        queryFn: () =>  getScheduleById(scheduleId),
        enabled: !!scheduleId
    })
}

type ScheduleModificationProps = {
    id: number,
    schedule: ModifyingSchedule
}

export const useUpdateSchedule = () => {
    return useMutation({
        mutationFn: (mutationFnProp: ScheduleModificationProps) => updateSchedule(mutationFnProp.id, mutationFnProp.schedule)
    })
}