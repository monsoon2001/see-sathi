import {
  BookOpen,
  Calculator,
  FlaskConical,
  Languages,
  Globe,
  SquareFunction,
  TerminalSquare,
  HeartPulse,
  Library,
} from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap: Record<string, typeof Calculator> = {
  calculate: Calculator,
  flask: FlaskConical,
  languages: Languages,
  "book-open": BookOpen,
  globe: Globe,
  "square-function": SquareFunction,
  terminal: TerminalSquare,
  "heart-pulse": HeartPulse,
  default: Library,
};

export function SubjectIcon({
  icon,
  className,
  strokeWidth,
}: {
  icon?: string;
  className?: string;
  strokeWidth?: number;
}) {
  const Comp = (icon && iconMap[icon]) || iconMap.default;
  return <Comp className={cn("h-5 w-5", className)} strokeWidth={strokeWidth ?? 2} aria-hidden="true" />;
}

export function getSubjectIconName(slug: string): string {
  const map: Record<string, string> = {
    mathematics: "calculate",
    science: "flask",
    english: "languages",
    nepali: "book-open",
    "social-studies": "globe",
    "optional-mathematics": "square-function",
    "computer-science": "terminal",
    "health-population-environment": "heart-pulse",
  };
  return map[slug] ?? "default";
}