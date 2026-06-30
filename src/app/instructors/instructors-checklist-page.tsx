"use client";

import { useQuery } from "convex/react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

import { api } from "../../../convex/_generated/api";
import { SubmissionForm } from "~/app/_components/submission-form";
import { SubmissionStatusFields } from "~/app/_components/submission-status-fields";
import { type SubmissionType } from "~/lib/checklist";
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
        <CardContent>
          <SubmissionStatusFields values={lastSubmission} />
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

      <div className="text-center">
        <Button variant="link" render={<Link href="/instructors/submissions" />}>
          {t("seeAllSubmissions")}
        </Button>
      </div>
    </main>
  );
}
