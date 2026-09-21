"use client";

import { useState } from "react";

export interface ToggleRowProps {
  title: string;
  body?: string;
  defaultValue?: boolean;
  disabled?: boolean;
}

export function ToggleRow({ title, body, defaultValue = false, disabled = false }: ToggleRowProps) {
  const [on, setOn] = useState(defaultValue);
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-4">
      <div className="min-w-0">
        <p className="font-display text-[15px] font-semibold text-on-surface">{title}</p>
        {body && <p className="mt-0.5 font-body text-[13px] leading-relaxed text-on-surface-variant">{body}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        disabled={disabled}
        onClick={() => setOn((v) => !v)}
        className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${
          disabled ? "cursor-not-allowed opacity-40" : ""
        } ${on ? "bg-primary" : "bg-surface-container-high"}`}
      >
        <span
          className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-all ${on ? "left-[22px]" : "left-0.5"}`}
        />
      </button>
    </div>
  );
}