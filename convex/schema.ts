import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const nullableBoolean = v.union(v.boolean(), v.null());

export default defineSchema({
  submissions: defineTable({
    submittedAt: v.number(),
    submissionType: v.union(v.literal("opening"), v.literal("closing")),
    staffGroup: v.literal("instructors"),
    instructorName: v.string(),
    coolingSystemOn: nullableBoolean,
    antechamberTvOn: nullableBoolean,
    replayScreensOn: nullableBoolean,
    downstairsScreenOn: nullableBoolean,
  }).index("by_staff_group_and_submitted_at", ["staffGroup", "submittedAt"]),
});
