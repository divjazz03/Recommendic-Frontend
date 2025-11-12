import { ChevronLeft, ChevronRight } from 'lucide-react'
import React from 'react'

interface CustomCalendarProps {
  currentMonth: Date | null,
  selectedDate: Date | null,
  setSelectedDate: (date: Date) => void
  toPreviousMonth: () => void;
  toNextMonth: () => void;

}

const getDaysInMonth = (date: Date): Date[] => {

  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  const days: Date[] = [];
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    days.push(new Date(year, month, day))
  }
  return days;
}

const isDateAvailable = (date: Date): boolean => {
  if (!date) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date >= today && date.getDay() != 0; // Not sunday and not in the past
}

const CustomCalender: React.FC<CustomCalendarProps> = (
  {
    currentMonth = new Date(),
    toPreviousMonth,
    toNextMonth,
    setSelectedDate,
    selectedDate = new Date()
  }
) => {
  return (
    <div className=''>
      <div className='bg-white rounded-2xl shadow-lg p-6 mb-6'>
        <header className='flex items-center justify-between mb-6'>
          <h2 className='text-xl font-semibold text-dark-3'>Select Date</h2>
          <div className='flex items-center gap-2'>
            <button onClick={() => toPreviousMonth()} className='p-2 hover:bg-light-3 rounded-lg'>
              <ChevronLeft className='w-5 h-5 text-dark-1' />
            </button>
            <span className='font-medium text-dark-3 min-w-[120px] text-center'>
              {currentMonth?.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
            <button onClick={() => toNextMonth()} className='p-2 hover:bg-light-3 rounded-lg'>
              <ChevronRight className='w-5 h-5 text-dark-1' />
            </button>
          </div>
        </header>

        <div className='grid grid-cols-7 gap-2 mb-4'>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-sm font-medium text-dark-1 py-2">
              {day}
            </div>
          ))}
        </div>

        <div className='grid grid-cols-7 gap-2 mb-4'>
          {getDaysInMonth(currentMonth).map((date, index) => (
            <button
              key={index}
              onClick={() => date && isDateAvailable(date) && setSelectedDate(date)}
              disabled={!date || !isDateAvailable(date)}
              className={
                `aspect-square p-2 rounded-lg text-sm font-medium transition-all duration-100
                          ${!date ? 'invisible' : ''}
                          ${!isDateAvailable(date)
                  ? 'text-light-1 cursor-not-allowed'
                  : selectedDate && date && selectedDate.toDateString() === date.toDateString()
                    ? 'bg-main text-light-5 shadow-lg'
                    : 'text-dark-2 hover:bg-main-light hover:text-light-5'
                }
                          `
              }
            >
              {date?.getDate()}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CustomCalender