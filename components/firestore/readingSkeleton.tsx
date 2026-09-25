import { cn } from "@/lib/utils";

function Bar({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-full bg-surface-container", className)} />;
}

function HeaderSkeleton() {
  return (
    <div className="sticky top-16 z-40 border-b border-surface-container bg-background/90 backdrop-blur sm:top-20">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 lg:px-8">
        <div className="flex min-w-0 flex-wrap items-center gap-1.5">
          <Bar className="h-9 w-32 sm:w-44" />
          <Bar className="h-9 w-24 sm:w-32" />
        </div>
        <Bar className="h-9 w-36 sm:w-40" />
      </div>
    </div>
  );
}

export function NotesLoading({ title: _title }: { title: string }) {
  return (
    <div className="pb-24">
      <HeaderSkeleton />
      <div className="mx-auto max-w-5xl px-4 lg:px-0">
        <Bar className="mt-8 h-6 w-40 sm:w-56" />
        <Bar className="mt-4 h-12 w-3/4" />
        <Bar className="mt-3 h-4 w-1/2" />

        <div className="mt-8 space-y-5">
          <Bar className="h-5 w-full" />
          <Bar className="h-5 w-full" />
          <Bar className="h-5 w-11/12" />
          <Bar className="h-32 w-full rounded-2xl" />
          <Bar className="h-5 w-3/4" />
          <Bar className="h-5 w-5/6" />
          <Bar className="h-5 w-1/2" />
        </div>
      </div>
    </div>
  );
}

export function QuestionsLoading({ title: _title }: { title: string }) {
  return (
    <div className="pb-24">
      <HeaderSkeleton />
      <div className="mx-auto max-w-4xl px-4 lg:px-0">
        <Bar className="mt-8 h-6 w-36 sm:w-44" />
        <Bar className="mt-4 h-12 w-3/4" />
        <Bar className="mt-3 h-4 w-2/5" />

        <div className="mt-8 space-y-6">
          <div className="space-y-3">
            <Bar className="h-7 w-40 sm:w-48" />
            <Bar className="h-28 w-full rounded-2xl" />
            <Bar className="h-28 w-full rounded-2xl" />
          </div>
          <div className="space-y-3">
            <Bar className="h-7 w-40" />
            <Bar className="h-28 w-full rounded-2xl" />
            <Bar className="h-28 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}