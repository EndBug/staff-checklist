"use client";

import { enUS, it } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

const calendarLocales = {
  it,
  en: enUS,
} as const;

type DatePickerProps = {
  date: Date;
  onDateChange: (date: Date) => void;
};

export function DatePicker({ date, onDateChange }: DatePickerProps) {
  const t = useTranslations("instructors");
  const locale = useLocale();
  const [open, setOpen] = useState(false);

  const calendarLocale =
    calendarLocales[locale as keyof typeof calendarLocales] ?? enUS;

  const formattedDate = new Intl.DateTimeFormat(locale, {
    dateStyle: "long",
  }).format(date);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            className="min-w-[200px] flex-1 justify-start gap-2 font-normal"
            aria-label={t("pickDate")}
          />
        }
      >
        <CalendarIcon className="size-4 shrink-0" />
        <span className="truncate">{formattedDate}</span>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="center">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(selectedDate) => {
            if (selectedDate) {
              onDateChange(selectedDate);
              setOpen(false);
            }
          }}
          locale={calendarLocale}
          defaultMonth={date}
        />
      </PopoverContent>
    </Popover>
  );
}
