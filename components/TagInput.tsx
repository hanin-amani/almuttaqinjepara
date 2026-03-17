"use client";

import { useState, KeyboardEvent } from "react";
import { X } from "lucide-react"; // Pastikan sudah install lucide-react

interface TagInputProps {
  tags: string[];
  setTags: (tags: string[]) => void;
}

export default function TagInput({ tags, setTags }: TagInputProps) {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const newTag = inputValue.trim().replace(/,/g, "");
      
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
        setInputValue("");
      }
    } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      setTags(tags.slice(0, -1));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="w-full">
      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">
        Keywords / Tags (Enter untuk menambah)
      </label>
      
      <div className="flex flex-wrap gap-2 p-2 bg-slate-50 border border-slate-100 rounded-none min-h-[50px] focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all">
        {tags.map((tag) => (
          <span 
            key={tag} 
            className="flex items-center gap-1 px-3 py-1 bg-emerald-600 text-white text-[11px] font-bold uppercase tracking-tight rounded-none shadow-sm"
          >
            {tag}
            <button 
              type="button" 
              onClick={() => removeTag(tag)}
              className="hover:text-emerald-200 transition-colors"
            >
              <X size={12} strokeWidth={3} />
            </button>
          </span>
        ))}
        
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? "Masukkan kata kunci..." : ""}
          className="flex-1 bg-transparent outline-none text-sm font-medium text-slate-900 placeholder:text-slate-300 min-w-[120px]"
        />
      </div>
      
      {/* Hidden input untuk form submission jika tidak pakai state langsung */}
      <input type="hidden" name="tags" value={tags.join(",")} />
    </div>
  );
}