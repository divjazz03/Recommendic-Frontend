import React, { useState } from 'react';
import { Calendar, Clock, Video, Phone, MessageCircle, Users, Plus, Trash2, Save, ArrowLeft } from 'lucide-react';
import { RecurrenceRule, Schedule } from '@/types';
import { createNewSchedule } from '@/lib/api/consultant_api';
import axios, { AxiosError } from 'axios';
import { toast } from '@/hooks/use-toast';
import { weeksToDays } from 'date-fns';

export interface NewSchedule {
    id: number,
    name: string,
    startTime: string,
    endTime: string,
    isRecurring: boolean,
    recurrenceRule?: RecurrenceRule,
    zoneOffset: string,
    channels: string[],
    isActive: boolean
}
const NewConsultatantCreatedModal = () => {
    return <div className='ab'>

    </div>
}
const ConsultantNewSchedule = () => {
    let id = 0
    const [schedules, setSchedules] = useState<NewSchedule[]>([{
        id: id++,
        name: '',
        startTime: '09:00',
        endTime: '17:00',
        isRecurring: true,
        recurrenceRule: {
            frequency: 'weekly',
            weekDays: ['monday'],
            interval: 1
        },
        zoneOffset: "+01:00",
        channels: ['video'],
        isActive: true
    }]);

    const channelOptions = [
        { value: 'chat', label: 'Chat', icon: MessageCircle, color: 'bg-blue-100 text-blue-600' },
        { value: 'voice', label: 'Voice Call', icon: Phone, color: 'bg-green-100 text-green-600' },
        { value: 'video', label: 'Video Call', icon: Video, color: 'bg-purple-100 text-purple-600' },
        { value: 'in_person', label: 'In-Person', icon: Users, color: 'bg-orange-100 text-orange-600' }
    ];

    const weekDays = [
        { value: 'monday', label: 'Mon' },
        { value: 'tuesday', label: 'Tue' },
        { value: 'wednesday', label: 'Wed' },
        { value: 'thursday', label: 'Thu' },
        { value: 'friday', label: 'Fri' },
        { value: 'saturday', label: 'Sat' },
        { value: 'sunday', label: 'Sun' }
    ];

    const addSchedule = () => {
        const newSchedule: NewSchedule = {
            id: id++,
            name: '',
            startTime: '09:00',
            endTime: '17:00',
            isRecurring: true,
            zoneOffset: "+01:00",
            recurrenceRule: {
                frequency: 'weekly',
                weekDays: ['monday'],
                interval: 1
            },
            channels: ['video'],
            isActive: true
        };
        setSchedules([...schedules, newSchedule]);
    };

    const removeSchedule = (id: number) => {
        setSchedules(schedules.filter(schedule => schedule.id !== id));
    };

    const updateSchedule = (id: number, field: keyof Schedule, value: any) => {
        setSchedules(schedules.map(schedule =>
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

    const toggleDayOfWeek2 = (scheduleId: number, day: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday") => {
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

    const saveSchedules = async () => {
        console.log('Saving schedules:', schedules);
        try {
            const response = await createNewSchedule(schedules[0]);
            window.history.back()
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const err = error as AxiosError;
                console.log(err)
                return toast({ title: `Creating Schedule failed: ${err.response?.data?.message}`, variant: 'destructive' });
            }

            console.error(error)
            return toast({ title: `Creating Schedule failed Something went wrong`, variant: 'destructive' });
        }

    };

    return (
        <div className="max-h-[800px] lg:max-h-screen overflow-auto bg-gray-50 p-6">
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
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Schedule Setup</h1>
                        <p className="text-gray-600">Configure your availability and consultation channels</p>
                    </div>
                </header>

                {/* Schedules */}
                <div className="space-y-6">
                    {schedules.map((schedule, index) => (
                        <div key={schedule.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-main" />
                                    Schedule {index + 1}
                                </h3>
                                {schedules.length > 1 && (
                                    <button
                                        onClick={() => removeSchedule(schedule.id)}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>


                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                                <div className='flex flex-col'>
                                    {/* Name */}
                                    <div className='mb-2'>
                                        <h4 className='font-medium text-gray-900 items-center mb-2'>Name</h4>
                                        <input type='text'
                                            placeholder='My weekend schedule'
                                            value={schedule.name}
                                            onChange={(e) => updateSchedule(schedule.id, 'name', e.target.value)}
                                            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent'
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
                                                    value={schedule.startTime}
                                                    onChange={(e) => updateSchedule(schedule.id, 'startTime', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                                                <input
                                                    type="time"
                                                    value={schedule.endTime}
                                                    onChange={(e) => updateSchedule(schedule.id, 'endTime', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                                                />
                                            </div>
                                        </div>


                                        {/* Recurring Toggle */}
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="checkbox"
                                                id={`recurring-${schedule.id}`}
                                                checked={schedule.isRecurring}
                                                onChange={(e) => updateSchedule(schedule.id, 'isRecurring', e.target.checked)}
                                                className="w-4 h-4 text-blue-600 rounded focus:ring-main"
                                            />
                                            <label htmlFor={`recurring-${schedule.id}`} className="text-sm font-medium text-gray-700">
                                                Recurring Schedule
                                            </label>
                                        </div>

                                        {/* Recurrence Settings */}
                                        {schedule.isRecurring && (
                                            <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Frequency</label>
                                                    <select
                                                        value={schedule.recurrenceRule?.frequency}
                                                        onChange={(e) => updateRecurrenceRule(schedule.id, 'frequency', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main"
                                                    >
                                                        <option value="daily">Daily</option>
                                                        <option value="weekly">Weekly</option>
                                                        <option value="monthly">Monthly</option>
                                                    </select>
                                                </div>

                                                {schedule.recurrenceRule?.frequency === 'weekly' && (
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">Days of Week</label>
                                                        <div className="flex flex-wrap gap-2">
                                                            {weekDays.map(day => (
                                                                <button
                                                                    key={day.value}
                                                                    onClick={() => toggleDayOfWeek2(schedule.id, day.value)}
                                                                    className={`px-3 py-1 text-sm rounded-lg transition-colors ${schedule.recurrenceRule?.weekDays.includes(day.value)
                                                                        ? 'bg-main-light text-white'
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
                                                            value={schedule.recurrenceRule?.interval}
                                                            onChange={(e) => updateRecurrenceRule(schedule.id, 'interval', parseInt(e.target.value))}
                                                            className="w-20 px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main"
                                                        />
                                                        <span className="text-sm text-gray-600">
                                                            {schedule.recurrenceRule?.frequency === 'daily' ? 'day(s)' :
                                                                schedule.recurrenceRule?.frequency === 'weekly' ? 'week(s)' : 'month(s)'}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">End Date (Optional)</label>
                                                    <input
                                                        type="date"
                                                        value={schedule.recurrenceRule?.endDate}
                                                        onChange={(e) => updateRecurrenceRule(schedule.id, 'endDate', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>


                                {/* Channel Settings */}
                                <div className="space-y-4">
                                    <h4 className="font-medium text-gray-900">Consultation Channels</h4>
                                    <div className="grid grid-cols-1 gap-3">
                                        {channelOptions.map(channel => {
                                            const Icon = channel.icon;
                                            const isSelected = schedule.channels.includes(channel.value);

                                            return (
                                                <button
                                                    key={channel.value}
                                                    onClick={() => toggleChannel(schedule.id, channel.value)}
                                                    className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${isSelected
                                                        ? 'border-main-light '
                                                        : 'border-gray-200 bg-white hover:border-gray-300'
                                                        }`}
                                                >
                                                    <div className={`p-2 rounded-lg ${channel.color}`}>
                                                        <Icon className="w-4 h-4" />
                                                    </div>
                                                    <div className="flex-1 text-left">
                                                        <div className="font-medium text-gray-900">{channel.label}</div>
                                                    </div>
                                                    <div className={`w-4 h-4 rounded-full border-2 ${isSelected ? 'bg-main border-main' : 'border-gray-300'
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
                                    <input
                                        type="checkbox"
                                        id={`active-${schedule.id}`}
                                        checked={schedule.isActive}
                                        onChange={(e) => updateSchedule(schedule.id, 'isActive', e.target.checked)}
                                        className="w-4 h-4"
                                    />
                                    <label htmlFor={`active-${schedule.id}`} className="text-sm font-medium text-gray-700">
                                        Schedule is active
                                    </label>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                    <button
                        onClick={addSchedule}
                        className="flex items-center gap-2 px-6 py-3 text-main-light bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Add Another Schedule
                    </button>

                    <button
                        onClick={saveSchedules}
                        className="flex items-center gap-2 px-6 py-3 text-white bg-main-light hover:bg-main rounded-lg transition-colors font-medium"
                    >
                        <Save className="w-4 h-4" />
                        Save Schedules
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConsultantNewSchedule;