"use client";

import { useQuery } from "convex/react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useQueryState } from "nuqs";

import { api } from "../../../../convex/_generated/api";
import { DatePicker } from "~/app/_components/date-picker";
import { SubmissionStatusFields } from "~/app/_components/submission-status-fields";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "~/components/ui/card";
import {
  addLocalDays,
  endOfLocalDayExclusiveMs,
  startOfLocalDayMs,
} from "~/lib/dates";
import { dateParser } from "~/lib/search-params";

export function SubmissionsPage() {
  const t = useTranslations("instructors");
  const locale = useLocale();
  const [date, setDate] = useQueryState("date", dateParser);

  const submissions = useQuery(api.submissions.listSubmissionsForDay, {
    staffGroup: "instructors",
    dayStart: startOfLocalDayMs(date),
    dayEnd: endOfLocalDayExclusiveMs(date),
  });

  const formatTime = (timestamp: number) =>
    new Intl.DateTimeFormat(locale, {
      timeStyle: "short",
    }).format(new Date(timestamp));

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-4 py-8 sm:px-6">
      <section>
        <h1 className="text-2xl font-semibold tracking-tight">
          {t("submissionsTitle")}
        </h1>
      </section>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          aria-label={t("previousDay")}
          onClick={() => void setDate(addLocalDays(date, -1))}
        >
          <ChevronLeftIcon />
        </Button>

        <DatePicker
          date={date}
          onDateChange={(selectedDate) => void setDate(selectedDate)}
        />

        <Button
          variant="outline"
          size="icon"
          aria-label={t("nextDay")}
          onClick={() => void setDate(addLocalDays(date, 1))}
        >
          <ChevronRightIcon />
        </Button>
      </div>

      {submissions === undefined ? (
        <p className="text-muted-foreground text-sm">{t("loadingSubmissions")}</p>
      ) : submissions.length === 0 ? (
        <p className="text-muted-foreground rounded-lg border border-dashed border-border px-4 py-8 text-center text-sm">
          {t("noSubmissionsForDay")}
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {submissions.map((submission) => (
            <Card key={submission._id}>
              <CardHeader>
                <CardDescription>
                  {t("submissionMeta", {
                    time: formatTime(submission.submittedAt),
                    name: submission.instructorName,
                    type: t(`submissionType.${submission.submissionType}`),
                  })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SubmissionStatusFields values={submission} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
