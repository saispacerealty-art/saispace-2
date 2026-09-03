"use client";

import { useCallback, useRef, useState, type ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

type PendingConfirm = { message: string };

export function useConfirmDialog(): { confirm: (message: string) => Promise<boolean>; dialog: ReactNode } {
  const [pending, setPending] = useState<PendingConfirm | null>(null);
  const resolverRef = useRef<((result: boolean) => void) | null>(null);

  const confirm = useCallback((message: string) => {
    return new Promise<boolean>((resolve) => {
      resolverRef.current = resolve;
      setPending({ message });
    });
  }, []);

  function settle(result: boolean) {
    resolverRef.current?.(result);
    resolverRef.current = null;
    setPending(null);
  }

  const dialog = pending ? (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-navy-950/50 p-4 backdrop-blur-[1px]"
      role="alertdialog"
      aria-modal="true"
      onClick={() => settle(false)}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
            <AlertTriangle className="h-4.5 w-4.5" />
          </span>
          <p className="pt-1.5 text-sm leading-relaxed text-navy-900">{pending.message}</p>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => settle(false)}
            className="rounded-lg px-4 py-2 text-sm font-semibold text-navy-900/70 hover:bg-navy-900/5"
          >
            Cancel
          </button>
          <button
            type="button"
            autoFocus
            onClick={() => settle(true)}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  ) : null;

  return { confirm, dialog };
}
