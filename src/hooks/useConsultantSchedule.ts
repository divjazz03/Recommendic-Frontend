import { ApiError } from "@/lib/axios";
import { useCreateNewSchedules, useDeleteSchedule, useGetCurrentUserSchedules, useGetScheduleWithUserId, useUpdateSchedule } from "@/lib/actions/consultantQueryAndMutations";
import { RecurrenceRule, Schedule, WeekDay } from "@/types";
import { VideoIcon, Users, Video, LucideProps } from "lucide-react";
import { useEffect, useState } from "react";
import { Location, useNavigate } from "react-router-dom";
import { ModifyingSchedule, ModifyingRecurrenceRule } from "@/components/consultant/ConsultantModifySchedule";
import { toast } from "sonner";

export interface NewSchedule {
    id: number,
    name: string,
    startTime: string,
    endTime: string,
    recurrenceRule?: RecurrenceRule,
    channels: string[],
    isActive: boolean,
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

export const ChannelOptions = {
    online: {
        value: 'online', label: 'Online', icon: VideoIcon, color: 'bg-blue-100 text-blue-600'
    },
    in_person: {value: 'in_person', label: 'In-Person', icon: Users, color: 'bg-orange-100 text-orange-600'}
}

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
            return toast.error(`Could not create schedule - ${apiError.message}:  ${apiError?.data}`)
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
    const [scheduleId] = useState<string>(location.state.scheduleId);
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
        try {
            await deleteAsyncSchedule(scheduleId);
        } catch (error) {
            const apiError = error as ApiError
            if (apiError.status === 404) {
                return toast.error(apiError.message)
            }
        } finally {
            window.history.back();
        }
    };

    const updateSchedule = (field: keyof ModifyingSchedule, value: unknown) => {
        setModifiedSchedule(schedule => ({ ...schedule, [field]: value }));
    };

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

export const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
};

export const formatDays = (days: string[]) => {
    const dayNames = {
        monday: 'Mondays', tuesday: 'Tuesdays', wednesday: 'Wednesdays', thursday: 'Thursdays',
        friday: 'Fridays', saturday: 'Saturdays', sunday: 'Sundays'
    };
    return days.map(day => dayNames[day as keyof typeof dayNames]).join(', ');
};

export const formatRecurrence = (rule: RecurrenceRule) => {
    if (rule.frequency === 'weekly') {
        const interval = rule.interval > 1 ? `every ${rule.interval} weeks` : 'weekly';
        return `${interval} on ${formatDays(rule.weekDays)}`;
    }
    return rule.frequency;
};
export const useScheduleDisplay = () => {


    const navigate = useNavigate();
    const [schedules, setSchedules] = useState<Schedule[]>([]);

    const { data: schedulesResponse, isPending: isUserSchedulesLoading } = useGetCurrentUserSchedules();

    useEffect(() => {
        if (schedulesResponse) {
            setSchedules(schedulesResponse.data.content)
        }
    }, [schedulesResponse])

    

    const handleModifySchedule = (scheduleId: string) => {
        // In your app, this would navigate to the schedule setup page with the schedule ID
        console.log('Modify schedule:', scheduleId);
        navigate('modify', { state: { scheduleId: scheduleId } })
    };

    const handleCreateNewSchedule = () => {
        // In your app, this would navigate to the schedule setup page
        console.log('Create new schedule');
        navigate("new");
    };

    const activeSchedules = schedules.filter(s => s.isActive);
    const inactiveSchedules = schedules.filter(s => !s.isActive);
    
    return {
        inactiveSchedules,
        activeSchedules,
        handleCreateNewSchedule,
        handleModifySchedule,
        schedules,
        isUserSchedulesLoading
    }
}