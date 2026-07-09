"use client";

import { useQuery } from "convex/react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

import { api } from "../../../convex/_generated/api";
import { SubmissionForm } from "~/app/_components/submission-form";
import { SubmissionStatusFields } from "~/app/_components/submission-status-fields";
import { type InstructorEventType, type SubmissionType } from "~/lib/checklist";
import { Button, buttonVariants } from "~/components/ui/button";
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
  const lastStatusSubmission = useQuery(api.submissions.getLastStatusSubmission, {
    staffGroup: "instructors",
  });
  const lastEventSubmission = useQuery(api.submissions.getLastEventSubmission, {
    staffGroup: "instructors",
  });
  const [activeSubmissionType, setActiveSubmissionType] =
    useState<SubmissionType | null>(null);
  const formatSubmissionType = (
    submissionType: SubmissionType,
    eventType: InstructorEventType | null,
  ) => {
    if (submissionType !== "event") {
      return t(`submissionType.${submissionType}`);
    }

    if (!eventType) {
      return t("submissionType.event");
    }

    return t(`eventType.${eventType}`);
  };

  const formatSubmittedAt = (timestamp: number) =>
    new Intl.DateTimeFormat(locale, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(timestamp));

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-4 py-8 sm:px-6">
      <section>
        <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>{t("lastStatusTitle")}</CardTitle>
          <CardDescription>
            {lastStatusSubmission === undefined
              ? t("loadingSubmission")
              : lastStatusSubmission
                ? t("lastSubmission", {
                    date: formatSubmittedAt(lastStatusSubmission.submittedAt),
                    name: lastStatusSubmission.instructorName,
                    type: formatSubmissionType(
                      lastStatusSubmission.submissionType,
                      lastStatusSubmission.eventType ?? null,
                    ),
                  })
                : t("noSubmissions")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {lastStatusSubmission ? (
            <SubmissionStatusFields values={lastStatusSubmission} />
          ) : (
            <p className="text-muted-foreground text-sm">{t("noSubmissions")}</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("lastEventTitle")}</CardTitle>
          <CardDescription>
            {lastEventSubmission === undefined
              ? t("loadingSubmission")
              : lastEventSubmission
                ? t("lastSubmission", {
                    date: formatSubmittedAt(lastEventSubmission.submittedAt),
                    name: lastEventSubmission.instructorName,
                    type: formatSubmissionType(
                      lastEventSubmission.submissionType,
                      lastEventSubmission.eventType ?? null,
                    ),
                  })
                : t("noEvents")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {lastEventSubmission ? (
            <p className="text-sm">
              {lastEventSubmission.eventType === "other" &&
              lastEventSubmission.eventDetails
                ? lastEventSubmission.eventDetails
                : t("eventNoDetails")}
            </p>
          ) : (
            <p className="text-muted-foreground text-sm">{t("noEvents")}</p>
          )}
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
        <Button
          className="h-12 flex-1 text-base"
          onClick={() => setActiveSubmissionType("event")}
        >
          {t("eventReport")}
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

      <div className="text-center">
        <Link
          href="/instructors/submissions"
          className={buttonVariants({ variant: "link" })}
        >
          {t("seeAllSubmissions")}
        </Link>
      </div>
    </main>
  );
}
