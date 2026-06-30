"use client";

import { useTranslations } from "next-intl";

import {
  INSTRUCTOR_CHECKLIST_FIELDS,
  getStatusDisplay,
  type InstructorChecklistValues,
} from "~/lib/checklist";

export function SubmissionStatusFields({
  values,
}: {
  values: InstructorChecklistValues | null | undefined;
}) {
  const t = useTranslations("instructors");

  const statusLabels = {
    on: t("status.on"),
    off: t("status.off"),
    notSet: t("status.notSet"),
  };

  return (
    <div className="space-y-3">
      {INSTRUCTOR_CHECKLIST_FIELDS.map((field) => {
        const value = values?.[field.key] ?? null;
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
    </div>
  );
}
