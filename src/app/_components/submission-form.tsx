"use client";

import { useMutation } from "convex/react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { api } from "../../../convex/_generated/api";
import {
  INSTRUCTORS,
  formatInstructorName,
} from "../../../convex/instructors";
import {
  EMPTY_INSTRUCTOR_CHECKLIST_VALUES,
  INSTRUCTOR_CHECKLIST_FIELDS,
  type InstructorChecklistValues,
  type NullableBoolean,
  type SubmissionType,
} from "~/lib/checklist";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Label } from "~/components/ui/label";

type SubmissionFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  submissionType: SubmissionType;
};

function NullableToggle({
  label,
  value,
  onChange,
  onLabel,
  offLabel,
  ariaLabel,
}: {
  label: string;
  value: NullableBoolean;
  onChange: (value: NullableBoolean) => void;
  onLabel: string;
  offLabel: string;
  ariaLabel: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <Label className="text-sm font-medium">{label}</Label>
      <div
        className="border-border flex items-center rounded-md border p-0.5"
        role="group"
        aria-label={ariaLabel}
      >
        {(
          [
            { value: true, label: onLabel },
            { value: false, label: offLabel },
          ] as const
        ).map((option) => (
          <button
            key={option.label}
            type="button"
            onClick={() =>
              onChange(value === option.value ? null : option.value)
            }
            className={cn(
              "rounded px-2.5 py-1 text-xs font-medium transition-colors",
              value === option.value
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
            aria-pressed={value === option.value}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function SubmissionForm({
  open,
  onOpenChange,
  submissionType,
}: SubmissionFormProps) {
  const t = useTranslations("submissionForm");
  const tInstructors = useTranslations("instructors");
  const submitChecklist = useMutation(api.submissions.submitChecklist);
  const [instructorName, setInstructorName] = useState("");
  const [values, setValues] = useState<InstructorChecklistValues>(
    EMPTY_INSTRUCTOR_CHECKLIST_VALUES,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setInstructorName("");
    setValues(EMPTY_INSTRUCTOR_CHECKLIST_VALUES);
    setError(null);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      resetForm();
    }

    onOpenChange(nextOpen);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await submitChecklist({
        submissionType,
        staffGroup: "instructors",
        instructorName,
        ...values,
      });
      handleOpenChange(false);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : t("submitFailed"),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const title =
    submissionType === "opening" ? t("openingTitle") : t("closingTitle");
  const description =
    submissionType === "opening"
      ? t("openingDescription")
      : t("closingDescription");

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="instructor-name">{t("instructorName")}</Label>
            <select
              id="instructor-name"
              value={instructorName}
              onChange={(event) => setInstructorName(event.target.value)}
              required
              className={cn(
                "h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 md:text-sm dark:bg-input/30",
                !instructorName && "text-muted-foreground",
              )}
            >
              <option value="" disabled>
                {t("instructorNamePlaceholder")}
              </option>
              {INSTRUCTORS.map((instructor) => {
                const name = formatInstructorName(instructor);

                return (
                  <option key={name} value={name}>
                    {name}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="space-y-4">
            {INSTRUCTOR_CHECKLIST_FIELDS.map((field) => {
              const fieldLabel = tInstructors(`fields.${field.labelKey}`);

              return (
                <NullableToggle
                  key={field.key}
                  label={fieldLabel}
                  value={values[field.key]}
                  onChange={(nextValue) =>
                    setValues((current) => ({
                      ...current,
                      [field.key]: nextValue,
                    }))
                  }
                  onLabel={tInstructors("status.on")}
                  offLabel={tInstructors("status.off")}
                  ariaLabel={t("statusAriaLabel", { field: fieldLabel })}
                />
              );
            })}
          </div>

          {error ? (
            <p className="text-destructive text-sm" role="alert">
              {error}
            </p>
          ) : null}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isSubmitting}
            >
              {t("cancel")}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? t("submitting") : t("submit")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
