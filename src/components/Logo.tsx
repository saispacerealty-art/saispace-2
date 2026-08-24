import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";

function Mark({ className }: { className?: string }) {
  return (
    <span className={clsx("relative block", className)}>
      <Image src="/logo-icon.png" alt="" fill priority sizes="64px" className="object-contain" />
    </span>
  );
}

export function LogoMark({ className }: { className?: string }) {
  return <Mark className={className} />;
}

export function Logo({
  href = "/",
  variant = "light",
  className,
}: {
  href?: string;
  variant?: "light" | "dark";
  className?: string;
}) {
  const isDark = variant === "dark";
  return (
    <Link href={href} className={clsx("group flex items-center gap-3", className)}>
      <span
        className={clsx(
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-ivory-100 shadow-sm transition-transform group-hover:scale-105",
          isDark ? "ring-1 ring-white/15" : "ring-1 ring-navy-900/10"
        )}
      >
        <Mark className="h-8 w-8" />
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={clsx(
            "font-display text-[17px] font-bold tracking-wide",
            isDark ? "text-white" : "text-navy-900"
          )}
        >
          SAI <span className="gold-gradient-text">SPACE</span>
        </span>
        <span
          className={clsx(
            "mt-0.5 text-[10px] font-semibold tracking-[0.35em]",
            isDark ? "text-gold-300" : "text-gold-600"
          )}
        >
          REALTY
        </span>
      </span>
    </Link>
  );
}
