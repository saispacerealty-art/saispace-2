"use client";

import { MessageCircle } from "lucide-react";

export function WhatsAppButton({ phone }: { phone: string }) {
  const digits = phone.replace(/[^\d]/g, "");
  return (
    <a
      href={`https://wa.me/${digits}?text=${encodeURIComponent("Hi Sai Space Realty, I'd like to know more about your properties.")}`}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20 transition-transform hover:scale-105"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="h-7 w-7" fill="white" />
    </a>
  );
}
