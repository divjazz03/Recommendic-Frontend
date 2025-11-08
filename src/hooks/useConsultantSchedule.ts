import { ApiError } from "@/lib/axios";
import { useCreateNewSchedules, useDeleteSchedule, useGetScheduleWithUserId, useUpdateSchedule } from "@/lib/react-query/consultantQueryAndMutations";
import { RecurrenceRule, Schedule, WeekDay } from "@/types";
import { VideoIcon, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "./use-toast";
import { Location } from "react-router-dom";
import { ModifyingSchedule, ModifyingRecurrenceRule } from "@/components/consultant/ConsultantModifySchedule";

export interface NewSchedule {
    id: number,
    name: string,
    startTime: string,
    endTime: string,
    recurrenceRule?: RecurrenceRule,
    zoneOffset: string,
    channels: string[],
    isActive: boolean
}
export const weekDays = [
    { value: 'monday', label: 'Mon' },
    { value: 'tuesday', label: 'Tue' },
    { value: 'wednesday', label: 'Wed' },
    { value: 'thursday', label: 'Thu' },
    { value: 'friday', label: 'Fri' },
    { value: 'saturday', label: 'Sat' },
    { value: 'sunday', label: 'Sun' }
];

export const channelOptions = [
    { value: 'online', label: 'Online', icon: VideoIcon, color: 'bg-blue-100 text-blue-600' },
    { value: 'in_person', label: 'In-Person', icon: Users, color: 'bg-orange-100 text-orange-600' }
];

export const useCreateSchedule = () => {
    let id = 0
    const [schedules, setSchedules] = useState<NewSchedule[]>([{
        id: id++,
        name: '',
        startTime: '09:00',
        endTime: '17:00',
        recurrenceRule: {
            frequency: 'weekly',
            weekDays: ['monday'],
            interval: 1
        },
        zoneOffset: "+01:00",
        channels: [],
        isActive: true
    }]);
    const { mutateAsync: createNewSchedules, isError, error, isPending: isCreating } = useCreateNewSchedules();

    const [createdModalOpen, setCreatedModalOpen] = useState(false)

    const addSchedule = () => {
        const newSchedule: NewSchedule = {
            id: id++,
            name: '',
            startTime: '09:00',
            endTime: '17:00',
            zoneOffset: "+01:00",
            recurrenceRule: {
                frequency: 'weekly',
                weekDays: ['monday'],
                interval: 1
            },
            channels: ['online'],
            isActive: true
        };
        setSchedules([...schedules, newSchedule]);
    };

    const removeSchedule = (id: number) => {
        setSchedules(schedules => schedules.filter(schedule => schedule.id !== id));
    };

    const updateSchedule = (id: number, field: keyof Schedule, value: any) => {
        setSchedules(schedules => schedules.map(schedule =>
            schedule.id === id ? { ...schedule, [field]: value } : schedule
        ));
    };

    const updateRecurrenceRule = (id: number, field: keyof RecurrenceRule, value: unknown) => {
        const scheduleLocal = schedules.filter(schedule => schedule.id === id)[0];
        if (scheduleLocal && scheduleLocal.recurrenceRule) {
            setSchedules(schedules.map(schedule =>
                schedule.id === id
                    ? { ...schedule, recurrenceRule: { ...schedule.recurrenceRule, [field]: value } }
                    : schedule
            ));
        }
    };

    const toggleChannel = (scheduleId: number, channel: string) => {
        setSchedules(schedules.map(schedule => {
            if (schedule.id === scheduleId) {
                const channels = schedule.channels.includes(channel)
                    ? schedule.channels.filter(c => c !== channel)
                    : [...schedule.channels, channel];
                return { ...schedule, channels };
            }
            return schedule;
        }));
    };

    const toggleDayOfWeek2 = (scheduleId: number, day: WeekDay) => {
        setSchedules(schedules.map(schedule => {
            if (scheduleId != schedule.id) {
                return schedule;
            }
            if (schedule.recurrenceRule && schedule.recurrenceRule.weekDays) {
                schedule.recurrenceRule.weekDays = schedule.recurrenceRule.weekDays.includes(day)
                    ? schedule.recurrenceRule.weekDays.filter(d => d !== day)
                    : [...schedule.recurrenceRule?.weekDays, day];
                return schedule;
            } else if (schedule.recurrenceRule && !schedule.recurrenceRule.weekDays) {
                schedule.recurrenceRule.weekDays = [day];
                return schedule;
            } else {
                return schedule;
            }
        }))
    }



    const createSchedules = async () => {
        console.log('creating schedules: ', schedules);
        try {
            await createNewSchedules(schedules);

            setCreatedModalOpen(true)
        } catch (error) {
            const apiError = error as ApiError;
            return toast({ title: `Could not create schedule - ${apiError.message}:  ${apiError?.data}` })
        }

    }


    return {
        createdModalOpen,
        schedules,
        createSchedules,
        toggleDayOfWeek2,
        toggleChannel,
        updateRecurrenceRule,
        updateSchedule,
        removeSchedule,
        addSchedule,
        isCreating
    }

}

export const useModifySchedule = (location: Location) => {
    const [scheduleId, setScheduleId] = useState<string>(location.state.scheduleId);
    const { data: scheduleResponse, isPending } = useGetScheduleWithUserId(scheduleId);
    const { mutateAsync: updateAsyncSchedule, isPending: isUpdating } = useUpdateSchedule()
    const { mutateAsync: deleteAsyncSchedule, isPending: isDeleting } = useDeleteSchedule();
    const [modificationSuccess, setModificationSuccess] = useState<boolean>(false);
    const [schedule, setSchedule] = useState<Schedule>();
    const [modifiedSchedule, setModifiedSchedule] = useState<ModifyingSchedule>();

    useEffect(() => {
        console.log(scheduleResponse)
        const scheduleData = scheduleResponse?.data;
        if (scheduleData) {
            setSchedule(scheduleData);
            setModifiedSchedule(
                {
                    name: scheduleData?.name,
                    channels: scheduleData?.channels,
                    endTime: scheduleData?.endTime,
                    startTime: scheduleData?.startTime,
                    isActive: scheduleData?.isActive,
                    offset: scheduleData?.offset,
                    recurrenceRule: {
                        endDate: scheduleData?.recurrenceRule?.endDate,
                        frequency: scheduleData?.recurrenceRule?.frequency,
                        interval: scheduleData?.recurrenceRule?.interval,
                        weekDays: scheduleData?.recurrenceRule?.weekDays
                    }
                })
        }

    }, [scheduleResponse]);

    const removeSchedule = async () => {
        await deleteAsyncSchedule(scheduleId);
        window.history.back();
    };

    const updateSchedule = (field: keyof ModifyingSchedule, value: unknown) => {
        setModifiedSchedule(schedule => ({ ...schedule, [field]: value }));
    };

    const toggleRecurrence = (isRecurring: boolean) => {
        isRecurring ? setModifiedSchedule(schedule => ({ ...schedule, isRecurring: true, recurrenceRule: {} }))
            : setModifiedSchedule(schedule => ({ ...schedule, isRecurring: false, recurrenceRule: undefined }))
    }

    const updateRecurrenceRule = (field: keyof ModifyingRecurrenceRule, value: unknown) => {
        setModifiedSchedule(schedule => ({ ...schedule, recurrenceRule: { ...schedule?.recurrenceRule, [field]: value } })
        );

    };

    const toggleChannel = (channel: string) => {
        setModifiedSchedule(schedule => {
            if (channel) {
                const channels = schedule?.channels?.includes(channel)
                    ? schedule.channels.filter(c => c !== channel)
                    : schedule?.channels ? [...schedule?.channels, channel] : [channel];
                return { ...schedule, channels };
            }
            return schedule;
        });
    };

    const toggleDayOfWeek = (day: WeekDay) => {
        if (modifiedSchedule) {
            setModifiedSchedule(schedule => {
                if (day) {
                    if (modifiedSchedule.recurrenceRule) {
                        const weekDays = modifiedSchedule?.recurrenceRule?.weekDays?.includes(day)
                            ? modifiedSchedule?.recurrenceRule.weekDays.filter(d => d !== day)
                            : schedule?.recurrenceRule?.weekDays
                                ? [...schedule.recurrenceRule?.weekDays, day]
                                : [day];
                        return {
                            ...schedule,
                            recurrenceRule: { ...schedule?.recurrenceRule, weekDays }
                        };
                    }

                }
                return schedule;
            });
        }
    };

    const saveSchedule = async () => {
        console.log('Saving schedules:', schedule);
        if (modifiedSchedule) {
            await updateAsyncSchedule({ id: scheduleId, schedule: modifiedSchedule });
            setModificationSuccess(true)
        }
    };

    return {
        saveSchedule,
        toggleChannel,
        toggleDayOfWeek,
        updateRecurrenceRule,
        updateSchedule,
        removeSchedule,
        modificationSuccess,
        schedule,
        modifiedSchedule

    }
}