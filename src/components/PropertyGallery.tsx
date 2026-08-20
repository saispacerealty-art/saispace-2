"use client";

import { useState } from "react";
import Image from "next/image";

export function PropertyGallery({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState(0);
  const shown = images.length ? images : ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80"];

  return (
    <div>
      <div className="relative h-[280px] w-full overflow-hidden rounded-2xl bg-navy-100 sm:h-[420px]">
        <Image src={shown[active]} alt={title} fill priority sizes="(min-width: 1024px) 800px, 100vw" className="object-cover" />
      </div>
      {shown.length > 1 && (
        <div className="mt-3 flex gap-3 overflow-x-auto scrollbar-none">
          {shown.map((img, i) => (
            <button
              key={img + i}
              onClick={() => setActive(i)}
              className={`relative h-20 w-28 shrink-0 overflow-hidden rounded-xl border-2 transition-colors ${
                active === i ? "border-gold-500" : "border-transparent"
              }`}
            >
              <Image src={img} alt={`${title} ${i + 1}`} fill sizes="112px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
