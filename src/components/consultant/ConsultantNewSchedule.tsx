import { useEffect} from 'react';
import { Calendar, Clock, Plus, Trash2, Save, ArrowLeft, Loader, CheckCircle2 } from 'lucide-react';
import { WeekDay } from '@/types';
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { channelOptions, useCreateSchedule, weekDays } from '@/hooks/useConsultantSchedule';
import { Button } from '../ui/button';




const NewConsultantCreatedModal = () => {

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
                    <AlertDialogTitle className='text-center text-xl'>Successful</AlertDialogTitle>
                    <AlertDialogDescription className='text-center'>
                        <p className='mt-2'>Your schedule has been created successfully.</p>
                    </AlertDialogDescription>
                </AlertDialogHeader>
            </AlertDialogContent>
        </AlertDialog>
    )
}

const ConsultantNewSchedule = () => {
    
    const {
        addSchedule,
        createSchedules,
        createdModalOpen,
        removeSchedule,
        schedules,
        toggleChannel,
        toggleDayOfWeek2,
        updateRecurrenceRule,
        updateSchedule,
        isCreating
    } = useCreateSchedule();

    return (
        <div className="h-full overflow-y-auto bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <header className="mb-8 flex gap-2">
                    <button
                        onClick={() => window.history.back()}
                        className='p-2 hover:bg-white rounded-xl transition-colors duration-100'
                    >
                        <ArrowLeft className='w-6 h-6 text-dark-2' />
                    </button>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Schedule Setup</h1>
                        <p className="text-sm sm:text-base text-gray-600">Configure your availability and consultation channels</p>
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
                                <div className="space-y-4">
                                    {/* Name */}
                                    <div className='mb-8'>
                                        <h4 className='font-medium text-sm sm:text-base text-gray-900 items-center mb-2'>Name</h4>
                                        <input type='text'
                                            placeholder='My weekend schedule'
                                            value={schedule.name}
                                            onChange={(e) => updateSchedule(schedule.id, 'name', e.target.value)}
                                            className='w-full text-sm sm:text-base px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent'
                                        />
                                    </div>

                                    {/* Time Settings */}
                                    <div className='space-y-2'>
                                        <h4 className="font-medium text-gray-900 flex items-center gap-2">
                                            <Clock className="w-4 h-4" />
                                            Time Settings
                                        </h4>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">Start Time</label>
                                                <input
                                                    type="time"
                                                    value={schedule.startTime}
                                                    onChange={(e) => updateSchedule(schedule.id, 'startTime', e.target.value)}
                                                    className="text-sm sm:text-base w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">End Time</label>
                                                <input
                                                    type="time"
                                                    value={schedule.endTime}
                                                    onChange={(e) => updateSchedule(schedule.id, 'endTime', e.target.value)}
                                                    className="text-sm sm:text-base w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                                                />
                                            </div>
                                        </div>

                                    </div>

                                    {/* Recurrence Settings */}
                                    {(
                                        <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
                                            <div>
                                                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">Frequency</label>
                                                <select
                                                    value={schedule.recurrenceRule?.frequency}
                                                    onChange={(e) => updateRecurrenceRule(schedule.id, 'frequency', e.target.value)}
                                                    className="text-sm sm:text-base w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main"
                                                >
                                                    <option value={"one-off"}>One off</option>
                                                    <option value="daily">Daily</option>
                                                    <option value="weekly">Weekly</option>
                                                    <option value="monthly">Monthly</option>
                                                </select>
                                            </div>

                                            {schedule.recurrenceRule?.frequency === 'weekly' && (
                                                <div>
                                                    <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">Days of Week</label>
                                                    <div className="flex flex-wrap gap-2">
                                                        {weekDays.map(day => (
                                                            <button
                                                                key={day.value}
                                                                onClick={() => toggleDayOfWeek2(schedule.id, day.value as WeekDay)}
                                                                className={`px-3 py-1 text-sm sm:text-base rounded-lg transition-colors ${schedule.recurrenceRule?.weekDays?.includes(day.value as WeekDay)
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

                                            {schedule.recurrenceRule?.frequency !== 'one-off' &&
                                                <div>
                                                    <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">Repeat Every</label>
                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            value={schedule.recurrenceRule?.interval}
                                                            onChange={(e) => updateRecurrenceRule(schedule.id, 'interval', parseInt(e.target.value))}
                                                            className="text-sm sm:text-base w-20 px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main"
                                                        />
                                                        <span className="text-sm sm:text-base text-gray-600">
                                                            {schedule.recurrenceRule?.frequency === 'daily' ? 'day(s)' :
                                                                schedule.recurrenceRule?.frequency === 'weekly' ? 'week(s)' : 'month(s)'}
                                                        </span>
                                                    </div>
                                                </div>}

                                            <div>
                                                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">End Date (Optional)</label>
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


                                {/* Channel Settings */}
                                <div className="space-y-4">
                                    <h4 className="text-sm sm:text-base font-medium text-gray-900">Consultation Channels</h4>
                                    <div className="grid grid-cols-1 gap-3">
                                        {channelOptions.map(channel => {
                                            const Icon = channel.icon;
                                            const isSelected = schedule.channels.includes(channel.value);

                                            return (
                                                <button
                                                    key={channel.value}
                                                    onClick={() => toggleChannel(schedule.id, channel.value)}
                                                    className={`text-sm sm:text-base flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${isSelected
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
                                    <label htmlFor={`active-${schedule.id}`} className="text-sm sm:text-base font-medium text-gray-700">
                                        Schedule is active
                                    </label>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                    <Button
                        onClick={addSchedule}
                        variant={'outline'}
                    >
                        <Plus className="w-4 h-4" />
                        <p className='hidden sm:block'>Add Another Schedule</p>
                    </Button>

                    <Button
                        onClick={createSchedules}
                        disabled={isCreating}
                    >
                        {isCreating ? <>
                            <Loader /> Saving
                        </> :
                            <>
                                <Save className="w-4 h-4" />
                                Save Schedules
                            </>
                        }
                    </Button>
                </div>
            </div>
            {createdModalOpen && <NewConsultantCreatedModal />}
        </div>
    );
};

export default ConsultantNewSchedule;