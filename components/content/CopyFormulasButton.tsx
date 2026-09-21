"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

const defaultFormulas = `SEE Set Theory Core Formulas:
1) n(A ∪ B) = n(A) + n(B) - n(A ∩ B)
2) n(A ∪ B ∪ C) = n(A) + n(B) + n(C) - n(A ∩ B) - n(B ∩ C) - n(C ∩ A) + n(A ∩ B ∩ C)
3) nₒ(A) = n(A) - n(A ∩ B)`;

export function CopyFormulasButton({ formulas = defaultFormulas }: { formulas?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formulas);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex cursor-pointer items-center gap-1 self-start rounded-full bg-surface-container px-4 py-2 font-title text-body-sm text-on-surface transition-colors hover:bg-surface-container-high md:self-auto"
    >
      {copied ? <Check className="h-[18px] w-[18px] text-tertiary" aria-hidden="true" /> : <Copy className="h-[18px] w-[18px]" aria-hidden="true" />}
      <span>{copied ? "Copied to Clipboard!" : "Copy All Formulas"}</span>
    </button>
  );
}