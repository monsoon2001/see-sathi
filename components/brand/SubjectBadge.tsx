import { tintFill, withAlpha } from "@/lib/subjectColors";
import { cn } from "@/lib/utils";

export function SubjectBadge({
  name,
  color,
  className,
  icon,
}: {
  name: string;
  color: string;
  className?: string;
  icon?: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-3 py-0.5 text-[11px] font-bold uppercase tracking-[0.06em]",
        className,
      )}
      style={{
        backgroundColor: tintFill(color),
        color,
        border: `1px solid ${withAlpha(color, 0.3)}`,
      }}
    >
      {icon}
      {name}
    </span>
  );
}