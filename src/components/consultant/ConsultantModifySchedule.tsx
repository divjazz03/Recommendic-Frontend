import React, { useEffect, useState } from 'react'
import { Calendar, Clock, Video, Users, Trash2, Save, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { RecurrenceRuleFrequency, Schedule, WeekDay } from '@/types';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDeleteSchedule, useGetScheduleWithUserId, useUpdateSchedule } from '@/lib/react-query/consultantQueryAndMutations';
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
export interface ModifyingRecurrenceRule {
    frequency?: RecurrenceRuleFrequency,
    weekDays?: WeekDay[],
    interval?: number,
    endDate?: string,
}

export interface ModifyingSchedule {
    name?: string;
    startTime?: string;
    endTime?: string;
    isRecurring?: boolean;
    offset?: string;
    channels?: string[];
    recurrenceRule?: ModifyingRecurrenceRule;
    isActive?: boolean;
}
const weekDays = [
    { value: 'monday', label: 'Mon' },
    { value: 'tuesday', label: 'Tue' },
    { value: 'wednesday', label: 'Wed' },
    { value: 'thursday', label: 'Thu' },
    { value: 'friday', label: 'Fri' },
    { value: 'saturday', label: 'Sat' },
    { value: 'sunday', label: 'Sun' }
];
const channelOptions = [
    { value: 'online', label: 'Online', icon: Video, color: 'bg-blue-100 text-blue-600' },
    { value: 'in_person', label: 'In-Person', icon: Users, color: 'bg-orange-100 text-orange-600' }
];


const ModificationSuccessModal = () => {

    useEffect(() => {
        const timeout = setTimeout(() => {
            window.history.back();
        }, 2000)

        return () => clearTimeout(timeout);
    }, [])
    return (
        <AlertDialog open={true} >
            <AlertDialogContent className='max-w-md'>
                <AlertDialogHeader>
                    <div className='flex items-center justify-center mb-4'>
                        <CheckCircle2 className='h-12 w-12 text-green-500' />
                    </div>
                    <AlertDialogTitle className='text-center text-xl'>Schedule change successful</AlertDialogTitle>
                    <AlertDialogDescription className='text-center'>
                        <p className='mt-2'>Your schedule has been modified successfully.</p>
                    </AlertDialogDescription>
                </AlertDialogHeader>
            </AlertDialogContent>
        </AlertDialog>
    )
}

const ConsultantModifySchedule = () => {
    const location = useLocation();

    const [scheduleId, setScheduleId] = useState<number>(location.state.scheduleId);
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
                    isRecurring: scheduleData?.isRecurring,
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
        if (modifiedSchedule?.isRecurring) {
            setModifiedSchedule(schedule => ({ ...schedule, recurrenceRule: { ...schedule?.recurrenceRule, [field]: value } })
            );
        }
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

    return (
        <main className="max-h-[800px] lg:max-h-screen overflow-auto bg-gray-50 p-6">
            <div className="max-w-4xl overflow-auto mx-auto">
                {/* Header */}
                <header className="mb-8 flex gap-2">
                    <button
                        onClick={() => window.history.back()}
                        className='p-2 hover:bg-white rounded-xl transition-colors duration-100'
                    >
                        <ArrowLeft className='w-6 h-6 text-dark-2' />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Modify Schedule</h1>
                        <p className="text-gray-600">Reconfigure your availability and consultation channels</p>
                    </div>
                </header>

                {/* Schedules */}
                <div className="">

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-blue-600" />
                                Schedule
                            </h3>
                            {schedule && (
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <button
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </PopoverTrigger>
                                    <PopoverContent>
                                        <div className='p-2 w-60 flex flex-col space-y-2'>
                                            <h3 className='text-lg font-semibold text-center'>Are you sure you want to delete?</h3>
                                            <div className='px-1 flex justify-center gap-4'>
                                                <Button className='w-32' onClick={removeSchedule} variant={'destructive'}>
                                                    Yes
                                                </Button>
                                            </div>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            )}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Name */}
                            <div className='mb-2'>
                                <h4 className='font-medium text-gray-900 items-center mb-2'>Name</h4>
                                <input type='text'
                                    placeholder='My weekend schedule'
                                    value={modifiedSchedule?.name}
                                    onChange={(e) => updateSchedule('name', e.target.value)}
                                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                />
                            </div>
                            {/* Time Settings */}
                            <div className="space-y-4">
                                <h4 className="font-medium text-gray-900 flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    Time Settings
                                </h4>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                                        <input
                                            type="time"
                                            value={modifiedSchedule?.startTime}
                                            onChange={(e) => updateSchedule('startTime', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                                        <input
                                            type="time"
                                            value={modifiedSchedule?.endTime}
                                            onChange={(e) => updateSchedule('endTime', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                {/* Recurring Toggle */}
                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        id='recurring'
                                        checked={modifiedSchedule?.isRecurring}
                                        onChange={(e) => toggleRecurrence(e.target.checked)}
                                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                    />
                                    <label htmlFor={`recurring`} className="text-sm font-medium text-gray-700">
                                        Recurring Schedule
                                    </label>
                                </div>

                                {/* Recurrence Settings */}
                                {modifiedSchedule?.isRecurring && (
                                    <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Frequency</label>
                                            <select
                                                onChange={(e) => updateRecurrenceRule('frequency', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="daily">Daily</option>
                                                <option value="weekly">Weekly</option>
                                                <option value="monthly">Monthly</option>
                                            </select>
                                        </div>

                                        {modifiedSchedule.recurrenceRule?.frequency === 'weekly' && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Days of Week</label>
                                                <div className="flex flex-wrap gap-2">
                                                    {weekDays && weekDays.map(day => (
                                                        <button
                                                            key={day.value}
                                                            onClick={() => toggleDayOfWeek(day.value as WeekDay)}
                                                            className={`px-3 py-1 text-sm rounded-lg transition-colors
                                                                ${modifiedSchedule.recurrenceRule?.weekDays?.includes(day.value as typeof modifiedSchedule.recurrenceRule.weekDays[0])
                                                                ? 'bg-blue-600 text-white'
                                                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                                                }`}
                                                        >
                                                            {day.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Repeat Every</label>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={modifiedSchedule?.recurrenceRule?.interval}
                                                    onChange={(e) => updateRecurrenceRule('interval', parseInt(e.target.value))}
                                                    className="w-20 px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                />
                                                <span className="text-sm text-gray-600">
                                                    {modifiedSchedule?.recurrenceRule?.frequency === 'daily' ? 'day(s)' :
                                                        modifiedSchedule?.recurrenceRule?.frequency === 'weekly' ? 'week(s)' : 'month(s)'}
                                                </span>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">End Date (Optional)</label>
                                            <input
                                                type="date"
                                                value={modifiedSchedule?.recurrenceRule?.endDate}
                                                onChange={(e) => updateRecurrenceRule('endDate', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Channel Settings */}
                            <div className="space-y-4">
                                <h4 className="font-medium text-gray-900">Consultation Channels</h4>
                                <div className="grid grid-cols-1 gap-3">
                                    {channelOptions.map(channel => {
                                        const Icon = channel.icon;
                                        const isSelected = modifiedSchedule?.channels?.includes(channel.value);

                                        return (
                                            <button
                                                key={channel.value}
                                                onClick={() => toggleChannel(channel.value)}
                                                className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${isSelected
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : 'border-gray-200 bg-white hover:border-gray-300'
                                                    }`}
                                            >
                                                <div className={`p-2 rounded-lg ${channel.color}`}>
                                                    <Icon className="w-4 h-4" />
                                                </div>
                                                <div className="flex-1 text-left">
                                                    <div className="font-medium text-gray-900">{channel.label}</div>
                                                </div>
                                                <div className={`w-4 h-4 rounded-full border-2 ${isSelected ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
                                                    }`}>
                                                    {isSelected && <div className="w-2 h-2 bg-white rounded-full m-0.5" />}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Active Toggle */}
                        <div className="mt-6 pt-4 border-t border-gray-200">
                            <div className="flex items-center gap-3">
                                <Input
                                    type="checkbox"
                                    id={`active`}
                                    checked={modifiedSchedule?.isActive}
                                    onChange={(e) => updateSchedule('isActive', e.target.checked)}
                                    className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                                />
                                <label htmlFor={`active`} className="text-sm font-medium text-gray-700">
                                    Schedule is active
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">

                    <Button
                        onClick={saveSchedule}
                        className="shad-button_primary transition-colors font-medium"
                    >
                        <Save className="w-4 h-4" />
                        Save Schedules
                    </Button>
                </div>
            </div>
            {modificationSuccess && <ModificationSuccessModal />}
        </main>
    );
};

export default ConsultantModifySchedule