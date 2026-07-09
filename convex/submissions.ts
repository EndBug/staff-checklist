import { v } from "convex/values";

import { isValidInstructorName } from "./instructors";
import { mutation, query } from "./_generated/server";

const nullableBoolean = v.union(v.boolean(), v.null());

export const submitChecklist = mutation({
  args: {
    submissionType: v.union(
      v.literal("opening"),
      v.literal("closing"),
      v.literal("event"),
    ),
    staffGroup: v.literal("instructors"),
    instructorName: v.string(),
    coolingSystemOn: nullableBoolean,
    antechamberTvOn: nullableBoolean,
    replayScreensOn: nullableBoolean,
    downstairsScreenOn: nullableBoolean,
    eventType: v.union(
      v.literal("coolingSystemReset"),
      v.literal("emergencyShutdown"),
      v.literal("other"),
      v.null(),
    ),
    eventDetails: v.union(v.string(), v.null()),
  },
  handler: async (ctx, args) => {
    const instructorName = args.instructorName.trim();
    const eventDetails = args.eventDetails?.trim() ?? "";

    if (!instructorName) {
      throw new Error("Instructor name is required");
    }

    if (!isValidInstructorName(instructorName)) {
      throw new Error("Invalid instructor name");
    }

    if (args.submissionType === "event") {
      if (args.eventType === null) {
        throw new Error("Event type is required");
      }

      if (args.eventType === "other" && !eventDetails) {
        throw new Error("Event details are required");
      }
    }

    return await ctx.db.insert("submissions", {
      submittedAt: Date.now(),
      submissionType: args.submissionType,
      staffGroup: args.staffGroup,
      instructorName,
      coolingSystemOn: args.coolingSystemOn,
      antechamberTvOn: args.antechamberTvOn,
      replayScreensOn: args.replayScreensOn,
      downstairsScreenOn: args.downstairsScreenOn,
      eventType: args.submissionType === "event" ? args.eventType : null,
      eventDetails:
        args.submissionType === "event" && args.eventType === "other"
          ? eventDetails
          : null,
    });
  },
});

export const getLastSubmission = query({
  args: {
    staffGroup: v.literal("instructors"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("submissions")
      .withIndex("by_staff_group_and_submitted_at", (q) =>
        q.eq("staffGroup", args.staffGroup),
      )
      .order("desc")
      .first();
  },
});

export const getLastStatusSubmission = query({
  args: {
    staffGroup: v.literal("instructors"),
  },
  handler: async (ctx, args) => {
    const submissions = await ctx.db
      .query("submissions")
      .withIndex("by_staff_group_and_submitted_at", (q) =>
        q.eq("staffGroup", args.staffGroup),
      )
      .order("desc")
      .collect();

    return (
      submissions.find(
        (submission) =>
          submission.submissionType === "opening" ||
          submission.submissionType === "closing",
      ) ?? null
    );
  },
});

export const getLastEventSubmission = query({
  args: {
    staffGroup: v.literal("instructors"),
  },
  handler: async (ctx, args) => {
    const submissions = await ctx.db
      .query("submissions")
      .withIndex("by_staff_group_and_submitted_at", (q) =>
        q.eq("staffGroup", args.staffGroup),
      )
      .order("desc")
      .collect();

    return submissions.find((submission) => submission.submissionType === "event") ?? null;
  },
});

export const listSubmissionsForDay = query({
  args: {
    staffGroup: v.literal("instructors"),
    dayStart: v.number(),
    dayEnd: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("submissions")
      .withIndex("by_staff_group_and_submitted_at", (q) =>
        q
          .eq("staffGroup", args.staffGroup)
          .gte("submittedAt", args.dayStart)
          .lt("submittedAt", args.dayEnd),
      )
      .order("desc")
      .collect();
  },
});
