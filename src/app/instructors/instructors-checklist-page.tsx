"use client";

import { useQuery } from "convex/react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

import { api } from "../../../convex/_generated/api";
import { SubmissionForm } from "~/app/_components/submission-form";
import {
  INSTRUCTOR_CHECKLIST_FIELDS,
  getStatusDisplay,
  type SubmissionType,
} from "~/lib/checklist";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

export function InstructorsChecklistPage() {
  const t = useTranslations("instructors");
  const locale = useLocale();
  const lastSubmission = useQuery(api.submissions.getLastSubmission, {
    staffGroup: "instructors",
  });
  const [activeSubmissionType, setActiveSubmissionType] =
    useState<SubmissionType | null>(null);

  const statusLabels = {
    on: t("status.on"),
    off: t("status.off"),
    notSet: t("status.notSet"),
  };

  const formatSubmittedAt = (timestamp: number) =>
    new Intl.DateTimeFormat(locale, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(timestamp));

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-4 py-8 sm:px-6">
      <section className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
        <p className="text-muted-foreground text-sm">{t("description")}</p>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>{t("lastStatusTitle")}</CardTitle>
          <CardDescription>
            {lastSubmission === undefined
              ? t("loadingSubmission")
              : lastSubmission
                ? t("lastSubmission", {
                    date: formatSubmittedAt(lastSubmission.submittedAt),
                    name: lastSubmission.instructorName,
                    type: t(`submissionType.${lastSubmission.submissionType}`),
                  })
                : t("noSubmissions")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {INSTRUCTOR_CHECKLIST_FIELDS.map((field) => {
            const value = lastSubmission?.[field.key] ?? null;
            const status = getStatusDisplay(value, statusLabels);

            return (
              <div
                key={field.key}
                className="flex items-center justify-between gap-4 border-b border-border pb-3 last:border-b-0 last:pb-0"
              >
                <span className="text-sm font-medium">
                  {t(`fields.${field.labelKey}`)}
                </span>
                <span className={status.className}>{status.label}</span>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          className="h-12 flex-1 text-base"
          onClick={() => setActiveSubmissionType("opening")}
        >
          {t("openingChecklist")}
        </Button>
        <Button
          className="h-12 flex-1 text-base"
          onClick={() => setActiveSubmissionType("closing")}
        >
          {t("closingChecklist")}
        </Button>
      </div>

      {activeSubmissionType ? (
        <SubmissionForm
          open={activeSubmissionType !== null}
          onOpenChange={(open) => {
            if (!open) {
              setActiveSubmissionType(null);
            }
          }}
          submissionType={activeSubmissionType}
        />
      ) : null}
    </main>
  );
}
