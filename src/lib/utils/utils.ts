import { clsx, type ClassValue } from "clsx";
import { DateTime } from "luxon";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function extractInitialsFromName(name: string): string {
  if (name) {
    const splitName = name.split(" ");
    return splitName
      .filter((name) => name.length > 3)
      .map((name) => name.charAt(0))
      .join("");
  }
  return "";
}

export const handleDateTimeFormatting = (date: string): string => {
  //Day is today
  const dateToday = DateTime.local();
  const dateOfChat = DateTime.fromISO(date);
  const startOfWeek = dateToday.startOf("week");
  const endOfWeek = dateToday.endOf("week");
  if (dateOfChat.day === dateToday.day) {
    return `${dateOfChat.hour > 12 ? dateOfChat.hour - 12 : dateOfChat.hour}:${
      dateOfChat.minute < 10 ? "0" + dateOfChat.minute : dateOfChat.minute
    } ${dateOfChat.hour > 12 ? "PM" : "AM"}`;
  } else if (dateToday.day - dateOfChat.day === 1) {
    // is not today but yesterday
    return "yesterday";
  } else if (dateOfChat >= startOfWeek && dateOfChat <= endOfWeek) {
    // difference is less than one week
    return dateOfChat.weekdayLong || ""; //`${daysOfTheWeek[dateOfChat.localWeekday]}`
  } else {
    return dateOfChat.monthLong || "";
  }
};

export const formatDate = (date: Date | string): string => {
  console.log(date);
  if (typeof date === "string") {
    const stringDate = date as string;
    return DateTime.fromISO(stringDate, { zone: "utc" })
      .setZone("local")
      .toLocaleString(DateTime.DATE_FULL);
  } else {
    const dateType = date as Date;
    return DateTime.fromJSDate(dateType, { zone: "utc" })
      .setZone("local")
      .toLocaleString(DateTime.DATE_FULL);
  }
};

export const parseTimeLeft = (date: string | Date): string => {
  console.log(date);
  const now = DateTime.local();
  const targetDate =
    typeof date === "string"
      ? DateTime.fromISO(date)
      : DateTime.fromJSDate(date);

  if (!targetDate.isValid) {
    return "";
  }

  const diff = targetDate
    .diff(now, ["hours", "minutes", "seconds"])
    .shiftTo("hours", "minutes", "seconds");

  if (diff.as("seconds") <= 0) {
    return "0s";
  }

  const hours = Math.floor(diff.hours);
  const minutes = Math.floor(diff.minutes);
  const seconds = Math.floor(diff.seconds);

  if (hours >= 1) {
    return `${hours}h`;
  }

  if (minutes >= 1) {
    return `${minutes}m`;
  }

  return `${seconds}s`;
};
