export const INSTRUCTOR_CHECKLIST_FIELDS = [
  {
    key: "coolingSystemOn",
    labelKey: "coolingSystem",
  },
  {
    key: "antechamberTvOn",
    labelKey: "antechamberTv",
  },
  {
    key: "replayScreensOn",
    labelKey: "replayScreens",
  },
  {
    key: "downstairsScreenOn",
    labelKey: "downstairsScreen",
  },
] as const;

export type InstructorChecklistFieldKey =
  (typeof INSTRUCTOR_CHECKLIST_FIELDS)[number]["key"];

export type InstructorChecklistFieldLabelKey =
  (typeof INSTRUCTOR_CHECKLIST_FIELDS)[number]["labelKey"];

export type NullableBoolean = boolean | null;

export type InstructorChecklistValues = Record<
  InstructorChecklistFieldKey,
  NullableBoolean
>;

export const EMPTY_INSTRUCTOR_CHECKLIST_VALUES: InstructorChecklistValues = {
  coolingSystemOn: null,
  antechamberTvOn: null,
  replayScreensOn: null,
  downstairsScreenOn: null,
};

export const INSTRUCTOR_EVENT_TYPES = [
  "coolingSystemReset",
  "emergencyShutdown",
  "other",
] as const;

export type InstructorEventType = (typeof INSTRUCTOR_EVENT_TYPES)[number];

export type SubmissionType = "opening" | "closing" | "event";

export function getStatusDisplay(
  value: NullableBoolean,
  labels: { on: string; off: string; notSet: string },
) {
  if (value === true) {
    return { label: labels.on, className: "text-emerald-600 dark:text-emerald-400" };
  }

  if (value === false) {
    return { label: labels.off, className: "text-muted-foreground" };
  }

  return { label: labels.notSet, className: "text-muted-foreground" };
}
