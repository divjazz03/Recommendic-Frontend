"use client";

import * as React from "react";
import {
  Calendar as CalendarIcon,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DateTime } from "luxon";

interface DatePickerProps {
  currentDate: Date;
  setDate: (date: React.SetStateAction<Date>) => void;
}
export function DatePicker({ currentDate, setDate }: DatePickerProps) {
  const [isOpen, setIsOpen] = React.useState<boolean>();
  return (
    <Popover onOpenChange={(value) => setIsOpen(value)}>
      <PopoverTrigger>
        <div className="flex gap-2 border px-2 py-2 h-10 rounded-md text-sm">
          <CalendarIcon className="w-5 h-5 text-slate-500" />
          {currentDate ? (
            DateTime.fromJSDate(currentDate).toLocaleString({
              dateStyle: "medium",
            })
          ) : (
            <span>Pick a date</span>
          )}
          {isOpen ? (
            <ChevronDown className="w-5 h-5 text-slate-500" />
          ) : (
            <ChevronRight className="w-5 h-5 text-slate-500" />
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          required
          mode="single"
          selected={currentDate}
          onSelect={setDate}
        />
      </PopoverContent>
    </Popover>
  );
}
