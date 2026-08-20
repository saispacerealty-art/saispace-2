import Link from "next/link";
import clsx from "clsx";

function Mark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="logoGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f3d896" />
          <stop offset="55%" stopColor="#d4a94a" />
          <stop offset="100%" stopColor="#a67827" />
        </linearGradient>
      </defs>
      <g>
        <rect x="38" y="18" width="7" height="24" rx="1.5" fill="url(#logoGold)" />
        <rect x="47.5" y="12" width="7" height="30" rx="1.5" fill="url(#logoGold)" />
        <rect x="57" y="22" width="7" height="20" rx="1.5" fill="url(#logoGold)" />
      </g>
      <path d="M50 38 L74 68 L57 68 L50 60 L43 68 L26 68 Z" className="fill-navy-800" />
      <path d="M50 44 L68 68 L57 68 L50 59.5 L43 68 L32 68 Z" fill="url(#logoGold)" />
      <g fill="currentColor" className="text-white">
        <rect x="46.6" y="60.5" width="3" height="3" />
        <rect x="50.4" y="60.5" width="3" height="3" />
        <rect x="46.6" y="64.3" width="3" height="3" />
        <rect x="50.4" y="64.3" width="3" height="3" />
      </g>
    </svg>
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
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-105",
          isDark ? "bg-white/10" : "bg-navy-900"
        )}
      >
        <Mark className="h-7 w-7" />
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
