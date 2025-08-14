import React, { useEffect, useState } from 'react';
import { Calendar, Clock, Video, Phone, MessageCircle, Users, Edit, Plus, Eye, EyeOff, Settings, LucideProps } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { RecurrenceRule, Schedule } from '@/types';
import { useGetCurrentUserSchedules } from '@/lib/react-query/consultantQueryAndMutations';
import Loader from '@/components/shared/Loader';

interface ChannelInfo {
    label: string
    icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
    color: string;
}

const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
};

const formatDays = (days: string[]) => {
    const dayNames = {
        monday: 'Mondays', tuesday: 'Tuesdays', wednesday: 'Wednesdays', thursday: 'Thursdays',
        friday: 'Fridays', saturday: 'Saturdays', sunday: 'Sundays'
    };
    return days.map(day => dayNames[day]).join(', ');
};

const formatRecurrence = (rule: RecurrenceRule) => {
    if (rule.frequency === 'weekly') {
        const interval = rule.interval > 1 ? `every ${rule.interval} weeks` : 'weekly';
        return `${interval} on ${formatDays(rule.weekDays)}`;
    }
    return rule.frequency;
};

const ConsultantScheduleDisplay = () => {
    // Sample schedule data - in your app, this would come from your backend
    const navigate = useNavigate();
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const location = useLocation();

    const { data: schedulesResponse, isPending: isUserSchedulesLoading, refetch: refetchSchedules } = useGetCurrentUserSchedules();

    useEffect(() => {
        if (schedulesResponse) {
            setSchedules(schedulesResponse.data)
        }
    }, [schedulesResponse])
    useEffect(() => {
        if (schedulesResponse) {
            refetchSchedules()
                .then(response => setSchedules(response.data?.data ? response.data?.data : []))
                .catch(error => console.error(error));
        }
    }, [location.key])

    const channelOptions = {
        'chat': { label: 'Chat', icon: MessageCircle, color: 'bg-blue-100 text-blue-600' },
        'voice': { label: 'Voice', icon: Phone, color: 'bg-green-100 text-green-600' },
        'video': { label: 'Video', icon: Video, color: 'bg-purple-100 text-purple-600' },
        'in_person': { label: 'In-Person', icon: Users, color: 'bg-orange-100 text-orange-600' }
    };

    const handleModifySchedule = (scheduleId: number) => {
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
    return (
        <div className="max-h-[800px] lg:max-h-screen overflow-auto bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Schedules</h1>
                        <p className="text-gray-600">Manage your consultation availability and channels</p>
                    </div>
                    <button
                        onClick={handleCreateNewSchedule}
                        className="flex items-center gap-2 px-4 py-2 shad-button_primary transition-colors font-medium"
                    >
                        <Plus className="w-4 h-4" />
                        New Schedule
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <Calendar className="w-5 h-5 text-green-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900">Active Schedules</h3>
                        </div>
                        {
                            isUserSchedulesLoading ? <Loader /> : <>
                                <p className="text-2xl font-bold text-gray-900">{activeSchedules.length}</p>
                                <p className="text-sm text-gray-600">Currently available</p>
                            </>
                        }

                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Clock className="w-5 h-5 text-blue-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900">Upcoming Sessions</h3>
                        </div>
                        {
                            isUserSchedulesLoading ? <Loader /> : <>
                                <p className="text-2xl font-bold text-gray-900">
                                    {schedules.reduce((total, schedule) => total + schedule.upcomingSessions, 0)}
                                </p>
                                <p className="text-sm text-gray-600">Scheduled consultations</p>
                            </>
                        }

                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <Settings className="w-5 h-5 text-purple-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900">Total Schedules</h3>
                        </div>
                        {
                            isUserSchedulesLoading ? <Loader /> : <>
                                <p className="text-2xl font-bold text-gray-900">{schedules.length}</p>
                                <p className="text-sm text-gray-600">Created schedules</p>
                            </>
                        }

                    </div>
                </div>

                {isUserSchedulesLoading ? <Loader /> : <>
                    {/* Active Schedules */}
                    {activeSchedules.length > 0 && (
                        <div className="mb-8">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Eye className="w-5 h-5 text-green-600" />
                                Active Schedules
                            </h2>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {activeSchedules.map((schedule) => (
                                    <div key={schedule.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                                    {schedule.name || `Schedule ${schedule.id}`}
                                                </h3>
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Clock className="w-4 h-4" />
                                                    {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                                                    Active
                                                </span>
                                            </div>
                                        </div>

                                        {/* Recurrence Info */}
                                        {schedule.isRecurring && schedule.recurrenceRule && (
                                            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                                                <div className="flex items-center gap-2 text-sm text-blue-700">
                                                    <Calendar className="w-4 h-4" />
                                                    <span className="font-medium">Recurring:</span>
                                                    <span>{formatRecurrence(schedule.recurrenceRule)}</span>
                                                </div>
                                                {schedule.recurrenceRule?.endDate && (
                                                    <div className="text-xs text-blue-600 mt-1">
                                                        Until {new Date(schedule.recurrenceRule.endDate).toLocaleDateString()}
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Channels */}
                                        <div className="mb-4">
                                            <div className="text-sm text-gray-600 mb-2">Available Channels:</div>
                                            <div className="flex flex-wrap gap-2">
                                                {schedule.channels.map(channel => {
                                                    const channelInfo: ChannelInfo = channelOptions[channel.toLowerCase()];
                                                    const Icon = channelInfo.icon;
                                                    return (
                                                        <div
                                                            key={channel}
                                                            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${channelInfo.color}`}
                                                        >
                                                            <Icon className="w-3 h-3" />
                                                            {channelInfo.label}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {/* Stats & Actions */}
                                        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                            <div className="text-sm text-gray-600">
                                                {schedule.upcomingSessions} upcoming sessions
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleModifySchedule(schedule.id)}
                                                    className="flex items-center gap-1 px-3 py-1 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                                                >
                                                    <Edit className="w-3 h-3" />
                                                    Modify
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Inactive Schedules */}
                    {inactiveSchedules.length > 0 && (
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <EyeOff className="w-5 h-5 text-gray-400" />
                                Inactive Schedules
                            </h2>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {inactiveSchedules.map((schedule) => (
                                    <div key={schedule.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 opacity-75">
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                                    {schedule.name || `Schedule ${schedule.id}`}
                                                </h3>
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Clock className="w-4 h-4" />
                                                    {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                                                    Inactive
                                                </span>
                                            </div>
                                        </div>

                                        {/* Recurrence Info */}
                                        {schedule.isRecurring && schedule.recurrenceRule && (
                                            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Calendar className="w-4 h-4" />
                                                    <span className="font-medium">Recurring:</span>
                                                    <span>{formatRecurrence(schedule.recurrenceRule)}</span>
                                                </div>
                                            </div>
                                        )}

                                        {/* Channels */}
                                        <div className="mb-4">
                                            <div className="text-sm text-gray-600 mb-2">Available Channels:</div>
                                            <div className="flex flex-wrap gap-2">
                                                {schedule.channels.map(channel => {
                                                    const channelInfo: ChannelInfo = channelOptions[channel.toLowerCase()];
                                                    const Icon = channelInfo.icon;
                                                    return (
                                                        <div
                                                            key={channel}
                                                            className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-600"
                                                        >
                                                            {Icon && <Icon className="w-3 h-3" />}
                                                            {channelInfo.label}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                            <div className="text-sm text-gray-500">
                                                Inactive since {new Date(schedule.createdAt).toLocaleDateString()}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleModifySchedule(schedule.id)}
                                                    className="flex items-center gap-1 px-3 py-1 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                                                >
                                                    <Edit className="w-3 h-3" />
                                                    Modify
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Empty State */}
                    {schedules.length === 0 && (
                        <div className="text-center py-12">
                            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No schedules created yet</h3>
                            <p className="text-gray-600 mb-6">Create your first schedule to start accepting consultations</p>
                            <button
                                onClick={handleCreateNewSchedule}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-main-light text-white rounded-lg hover:bg-main transition-colors font-medium"
                            >
                                <Plus className="w-4 h-4" />
                                Create Schedule
                            </button>
                        </div>
                    )}
                </>}
            </div>
        </div>
    );
};

export default ConsultantScheduleDisplay;