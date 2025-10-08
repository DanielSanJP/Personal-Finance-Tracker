"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DateTimePickerProps {
  date?: Date;
  onDateTimeChange?: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
  id?: string;
  disabled?: (date: Date) => boolean;
  fromDate?: Date;
  toDate?: Date;
  fromYear?: number;
  toYear?: number;
  showLabel?: boolean;
  required?: boolean;
}

export function DateTimePicker({
  date,
  onDateTimeChange,
  placeholder = "Select date",
  className,
  id = "date-time-picker",
  disabled,
  fromDate,
  toDate,
  fromYear,
  toYear,
  showLabel = true,
  required = false,
}: DateTimePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    date
  );
  const [timeValue, setTimeValue] = React.useState<string>(() => {
    if (date) {
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      return `${hours}:${minutes}`;
    }
    return "12:00";
  });

  // Sync with external date prop changes
  React.useEffect(() => {
    if (date) {
      setSelectedDate(date);
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      setTimeValue(`${hours}:${minutes}`);
    }
  }, [date]);

  const handleDateSelect = (newDate: Date | undefined) => {
    if (newDate) {
      // Preserve the time when date changes
      const [hours, minutes] = timeValue.split(":").map(Number);
      newDate.setHours(hours, minutes, 0, 0);
      setSelectedDate(newDate);
      onDateTimeChange?.(newDate);
      setOpen(false);
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setTimeValue(newTime);

    if (selectedDate) {
      const [hours, minutes] = newTime.split(":").map(Number);
      const newDateTime = new Date(selectedDate);
      newDateTime.setHours(hours, minutes, 0, 0);
      setSelectedDate(newDateTime);
      onDateTimeChange?.(newDateTime);
    }
  };

  return (
    <div className={cn("flex gap-4", className)}>
      <div className="flex flex-col gap-2 flex-1">
        {showLabel && (
          <Label htmlFor={id} className="px-1">
            Date {required && <span className="text-red-500">*</span>}
          </Label>
        )}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id={id}
              className={cn(
                "justify-between font-normal",
                !selectedDate && "text-muted-foreground"
              )}
            >
              {selectedDate
                ? selectedDate.toLocaleDateString("en-GB")
                : placeholder}
              <ChevronDownIcon className="h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              captionLayout="dropdown"
              disabled={disabled}
              fromDate={fromDate}
              toDate={toDate}
              fromYear={
                fromYear ||
                fromDate?.getFullYear() ||
                new Date().getFullYear() - 10
              }
              toYear={
                toYear || toDate?.getFullYear() || new Date().getFullYear() + 10
              }
              onSelect={handleDateSelect}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex flex-col gap-2 flex-1">
        {showLabel && (
          <Label htmlFor={`${id}-time`} className="px-1">
            Time {required && <span className="text-red-500">*</span>}
          </Label>
        )}
        <Input
          type="time"
          id={`${id}-time`}
          value={timeValue}
          onChange={handleTimeChange}
          className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
        />
      </div>
    </div>
  );
}
