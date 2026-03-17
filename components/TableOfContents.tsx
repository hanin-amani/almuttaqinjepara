"use client";

import { useEffect, useState } from "react";

export default function TableOfContents() {
  const [headings, setHeadings] = useState<{ id: string; text: string; level: number }[]>([]);

  useEffect(() => {
    // Cari container artikel
    const container = document.querySelector(".article-content");
    if (!container) return;

    // Cari h2 dan h3
    const elements = Array.from(container.querySelectorAll("h2, h3"));

    const mapped = elements.map((el, index) => {
      // Buat ID yang unik & bersih
      const text = el.textContent || "";
      const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-") || `section-${index}`;
      
      // SUNTIK ID LANGSUNG KE DOM
      el.id = id;

      return {
        id,
        text,
        level: Number(el.tagName.replace("H", ""))
      };
    });

    setHeadings(mapped);
  }, []);

  if (headings.length === 0) return null;

  return (
    <div className="bg-slate-50 border-l-4 border-emerald-600 p-6 mb-10 rounded-[4px]">
      <h4 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-5">
        Daftar Isi
      </h4>

      <nav>
        <ul className="space-y-3">
          {headings.map((item) => (
            <li 
              key={item.id} 
              className={`flex items-start gap-2 group ${item.level === 3 ? "ml-4" : ""}`}
            >
              <span className="text-emerald-600 font-bold text-[10px] mt-1.5 group-hover:translate-x-1 transition-transform">
                &gt;
              </span>
              <a
                href={`#${item.id}`}
                className={`text-[13px] hover:text-emerald-700 transition-colors leading-snug ${
                  item.level === 2 ? "font-bold text-slate-800" : "font-medium text-slate-500"
                }`}
              >
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}