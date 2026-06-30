import { v } from "convex/values";

import { isValidInstructorName } from "./instructors";
import { mutation, query } from "./_generated/server";

const nullableBoolean = v.union(v.boolean(), v.null());

export const submitChecklist = mutation({
  args: {
    submissionType: v.union(v.literal("opening"), v.literal("closing")),
    staffGroup: v.literal("instructors"),
    instructorName: v.string(),
    coolingSystemOn: nullableBoolean,
    antechamberTvOn: nullableBoolean,
    replayScreensOn: nullableBoolean,
    downstairsScreenOn: nullableBoolean,
  },
  handler: async (ctx, args) => {
    const instructorName = args.instructorName.trim();

    if (!instructorName) {
      throw new Error("Instructor name is required");
    }

    if (!isValidInstructorName(instructorName)) {
      throw new Error("Invalid instructor name");
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
