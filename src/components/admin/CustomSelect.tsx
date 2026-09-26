import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
  badge?: string;
  icon?: React.ReactNode;
}

interface CustomSelectProps {
  label?: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function CustomSelect({
  label,
  options,
  value,
  onChange,
  placeholder = "Seçiniz...",
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={containerRef}>
      {label && (
        <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
          {label}
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between gap-2 rounded-xl border border-white/10 bg-neutral-950 px-3.5 py-2.5 text-xs text-white outline-none hover:border-orange-500/50 focus:border-orange-500 transition-all text-left cursor-pointer"
      >
        <span className="flex items-center gap-2 truncate">
          {selectedOption?.icon}
          <span className="font-medium">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </span>
        <ChevronDown
          className={`size-4 text-neutral-400 shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-orange-400" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 right-0 z-50 mt-1.5 max-h-60 overflow-y-auto rounded-xl border border-white/15 bg-neutral-900 p-1.5 shadow-2xl shadow-black/80 backdrop-blur-md animate-in fade-in zoom-in-95 duration-100">
          {options.length === 0 ? (
            <div className="px-3 py-2 text-center text-xs text-neutral-500">
              Seçenek bulunamadı
            </div>
          ) : (
            options.map((option) => {
              const isSelected = option.value === value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-xs transition-colors text-left cursor-pointer ${
                    isSelected
                      ? "bg-orange-500/20 text-orange-400 font-semibold"
                      : "text-neutral-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span className="flex items-center gap-2 truncate">
                    {option.icon}
                    <span>{option.label}</span>
                  </span>
                  {isSelected && <Check className="size-3.5 shrink-0 text-orange-400" />}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
