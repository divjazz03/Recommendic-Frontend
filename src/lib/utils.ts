import { clsx, type ClassValue } from "clsx"
import { DateTime } from "luxon";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function extractInitialsFromName(name: string): string{
  const splitName = name.split(" ");
  return splitName.map((name) => name.charAt(0)).join("");
}

export const handleDateTimeFormatting = (date: string): string => {
    //Day is today
    const dateToday = DateTime.local();
    const dateOfChat = DateTime.fromISO(date);
    const startOfWeek = dateToday.startOf('week');
    const endOfWeek = dateToday.endOf('week')
    const daysOfTheWeek = ["Sunday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    if (dateOfChat.day === dateToday.day) {
        return `${dateOfChat.hour > 12 ? dateOfChat.hour - 12 : dateOfChat.hour}:${dateOfChat.minute < 10 ? '0' + (dateOfChat.minute):dateOfChat.minute } ${dateOfChat.hour > 12? 'PM':'AM'}`
    } else if (dateToday.day - dateOfChat.day === 1) { // is not today but yesterday
        return 'yesterday';
    } else if (dateOfChat >= startOfWeek && dateOfChat <= endOfWeek ) { // difference is less than one week
        return dateOfChat.weekdayLong //`${daysOfTheWeek[dateOfChat.localWeekday]}`
    } else {
        return dateOfChat.monthLong;
    }
}
