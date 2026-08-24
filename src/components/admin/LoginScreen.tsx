"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Loader2, Lock, ShieldCheck, User } from "lucide-react";
import { LogoMark } from "@/components/Logo";

const FLOATERS = [
  { size: 160, top: "8%", left: "12%", delay: 0 },
  { size: 90, top: "62%", left: "8%", delay: 0.6 },
  { size: 120, top: "20%", left: "78%", delay: 0.3 },
  { size: 60, top: "72%", left: "70%", delay: 0.9 },
];

export function LoginScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [shake, setShake] = useState(0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) throw new Error("Invalid credentials");
      router.push(searchParams.get("next") ?? "/admin");
      router.refresh();
    } catch {
      setStatus("error");
      setShake((s) => s + 1);
    }
  }

  return (
    <div className="flex min-h-screen w-full overflow-hidden bg-navy-950">
      <div className="relative hidden w-1/2 items-center justify-center overflow-hidden lg:flex">
        <div className="absolute inset-0 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800" />

        {FLOATERS.map((f, i) => (
          <motion.span
            key={i}
            className="absolute rounded-full bg-gold-500/10 blur-2xl"
            style={{ width: f.size, height: f.size, top: f.top, left: f.left }}
            animate={{ y: [0, -18, 0], opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 6 + i, repeat: Infinity, delay: f.delay, ease: "easeInOut" }}
          />
        ))}

        <motion.svg
          className="absolute bottom-0 left-0 w-full text-navy-800/60"
          viewBox="0 0 500 120"
          fill="currentColor"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <rect x="30" y="40" width="26" height="80" />
          <rect x="66" y="20" width="26" height="100" />
          <rect x="102" y="55" width="26" height="65" />
          <rect x="330" y="30" width="26" height="90" />
          <rect x="366" y="55" width="26" height="65" />
          <rect x="402" y="10" width="26" height="110" />
        </motion.svg>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative z-10 flex max-w-sm flex-col items-center px-10 text-center"
        >
          <motion.span
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="flex h-20 w-20 items-center justify-center rounded-2xl bg-ivory-100 shadow-lg"
          >
            <LogoMark className="h-14 w-14" />
          </motion.span>
          <h2 className="mt-8 font-display text-2xl font-semibold text-white">Sai Space Realty</h2>
          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.35em] text-gold-300">Admin Console</p>
          <p className="mt-6 text-sm leading-relaxed text-white/50">
            Manage listings, respond to leads, and keep your site content up to date — all from one place.
          </p>

          <div className="mt-10 flex items-center gap-2 text-xs text-white/40">
            <ShieldCheck className="h-4 w-4 text-gold-400" />
            Secure, session-based access for authorised staff only
          </div>
        </motion.div>
      </div>

      <div className="relative flex w-full items-center justify-center bg-ivory-50 px-6 py-16 lg:w-1/2">
        <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-gold-400/10 blur-3xl lg:hidden" />

        <motion.div
          key={shake}
          initial={{ opacity: 0, y: 16 }}
          animate={
            status === "error"
              ? { opacity: 1, y: 0, x: [0, -10, 10, -8, 8, -4, 4, 0] }
              : { opacity: 1, y: 0 }
          }
          transition={{ duration: status === "error" ? 0.5 : 0.6, ease: "easeOut" }}
          className="w-full max-w-sm"
        >
          <div className="mb-8 flex justify-center lg:hidden">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-ivory-100 shadow-sm ring-1 ring-navy-900/10">
              <LogoMark className="h-11 w-11" />
            </span>
          </div>

          <h1 className="font-display text-2xl font-semibold text-navy-900">Welcome back</h1>
          <p className="mt-1 text-sm text-navy-900/60">Sign in to manage your listings and leads.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-navy-900/50">
                Username
              </label>
              <div className="flex items-center gap-2.5 rounded-xl border border-navy-900/10 bg-white px-4 py-3 transition-colors focus-within:border-gold-500 focus-within:ring-2 focus-within:ring-gold-500/20">
                <User className="h-4 w-4 text-navy-900/40" />
                <input
                  required
                  autoFocus
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full bg-transparent text-sm text-navy-900 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-navy-900/50">
                Password
              </label>
              <div className="flex items-center gap-2.5 rounded-xl border border-navy-900/10 bg-white px-4 py-3 transition-colors focus-within:border-gold-500 focus-within:ring-2 focus-within:ring-gold-500/20">
                <Lock className="h-4 w-4 text-navy-900/40" />
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-transparent text-sm text-navy-900 outline-none"
                />
                <button type="button" onClick={() => setShowPassword((v) => !v)} className="text-navy-900/40 hover:text-navy-900">
                  <AnimatePresence mode="wait" initial={false}>
                    {showPassword ? (
                      <motion.span key="hide" initial={{ opacity: 0, rotate: -20 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 20 }}>
                        <EyeOff className="h-4 w-4" />
                      </motion.span>
                    ) : (
                      <motion.span key="show" initial={{ opacity: 0, rotate: 20 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: -20 }}>
                        <Eye className="h-4 w-4" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              </div>
            </div>

            <AnimatePresence>
              {status === "error" && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600"
                >
                  Invalid username or password. Please try again.
                </motion.p>
              )}
            </AnimatePresence>

            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={status === "submitting"}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-navy-900 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-navy-800 disabled:opacity-70"
            >
              {status === "submitting" && <Loader2 className="h-4 w-4 animate-spin" />}
              {status === "submitting" ? "Signing in..." : "Sign In"}
            </motion.button>
          </form>

          <p className="mt-8 text-center text-xs text-navy-900/40">
            Sai Space Realty © {new Date().getFullYear()} — Internal use only
          </p>
        </motion.div>
      </div>
    </div>
  );
}
