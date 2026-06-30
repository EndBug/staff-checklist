import { Suspense } from "react";

import { SubmissionsPage } from "~/app/instructors/submissions/submissions-page";

function SubmissionsPageFallback() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-4 py-8 sm:px-6">
      <div className="bg-muted h-8 w-48 animate-pulse rounded-md" />
      <div className="bg-muted h-10 w-full animate-pulse rounded-md" />
      <div className="bg-muted h-32 w-full animate-pulse rounded-lg" />
    </main>
  );
}

export default function InstructorsSubmissionsPage() {
  return (
    <Suspense fallback={<SubmissionsPageFallback />}>
      <SubmissionsPage />
    </Suspense>
  );
}
