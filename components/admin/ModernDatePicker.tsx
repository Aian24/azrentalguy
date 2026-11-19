"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  X,
  RotateCcw,
} from "lucide-react";

interface ModernDatePickerProps {
  value: string; // "YYYY-MM-DD" or ""
  onChange: (dateStr: string) => void;
  placeholder?: string;
  highlightDates?: string[]; // e.g. ["2026-11-17", "2026-11-18", "2026-11-19", ...]
  className?: string;
  todayDate?: string; // defaults to "2026-11-19"
  tomorrowDate?: string; // defaults to "2026-11-20"
}

export default function ModernDatePicker({
  value,
  onChange,
  placeholder = "Select specific date...",
  highlightDates = [],
  className = "",
  todayDate = "2026-11-19",
  tomorrowDate = "2026-11-20",
}: ModernDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize view year & month from value, or default to todayDate
  const initialDate = value ? new Date(value + "T00:00:00") : new Date(todayDate + "T00:00:00");
  const [viewYear, setViewYear] = useState(initialDate.getFullYear() || 2026);
  const [viewMonth, setViewMonth] = useState(initialDate.getMonth() || 10); // 0-indexed (10 = November)

  // Sync view when value changes externally
  useEffect(() => {
    if (value) {
      const d = new Date(value + "T00:00:00");
      if (!isNaN(d.getTime())) {
        setViewYear(d.getFullYear());
        setViewMonth(d.getMonth());
      }
    }
  }, [value]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Month navigation
  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  // Calendar calculations
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay(); // 0 = Sunday
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const handleSelectDay = (day: number) => {
    const formattedMonth = String(viewMonth + 1).padStart(2, "0");
    const formattedDay = String(day).padStart(2, "0");
    const selectedStr = `${viewYear}-${formattedMonth}-${formattedDay}`;
    onChange(selectedStr);
    setIsOpen(false);
  };

  // Format label for display on the trigger button
  const formatDisplayLabel = (dateStr: string) => {
    if (!dateStr) return placeholder;
    const parts = dateStr.split("-");
    if (parts.length !== 3) return dateStr;
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const dateObj = new Date(year, month, day);

    if (dateStr === todayDate) {
      return `Today (Nov ${day})`;
    }
    if (dateStr === tomorrowDate) {
      return `Tomorrow (Nov ${day})`;
    }
    if (dateStr === "2026-11-18") {
      return `Yesterday (Nov ${day})`;
    }

    return dateObj.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`}>
      {/* TRIGGER BUTTON (MODERN REPLACEMENT FOR RAW INPUT) */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`h-9 px-3 rounded text-xs font-bold border flex items-center gap-2 transition-all cursor-pointer shadow-xs ${
          value
            ? "bg-red-50 text-red-900 border-red-400 hover:border-red-600 ring-1 ring-red-400/30"
            : "bg-white text-gray-800 border-gray-300 hover:border-red-600 hover:bg-gray-50"
        }`}
        title="Open Modern Calendar Date Picker"
      >
        <CalendarIcon className="w-4 h-4 text-red-600 flex-shrink-0" />
        <span className="font-bold">{formatDisplayLabel(value)}</span>

        {value ? (
          <span
            onClick={(e) => {
              e.stopPropagation();
              onChange("");
            }}
            className="p-0.5 hover:bg-red-200 text-red-700 rounded-full transition-colors ml-1 cursor-pointer"
            title="Clear date filter"
          >
            <X className="w-3.5 h-3.5" />
          </span>
        ) : (
          <span className="text-[10px] text-gray-400">▼</span>
        )}
      </button>

      {/* CUSTOM POPOVER CALENDAR */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-1.5 z-50 bg-white border-2 border-yellow-500 rounded-lg shadow-2xl p-4 w-72 animate-in fade-in zoom-in-95 text-gray-950 font-sans">
          {/* HEADER: MONTH & YEAR WITH CHEVRONS */}
          <div className="flex items-center justify-between pb-3 border-b border-gray-200">
            <button
              type="button"
              onClick={prevMonth}
              className="p-1.5 hover:bg-yellow-50 hover:text-red-600 rounded text-gray-700 transition-colors cursor-pointer"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="text-sm font-black text-gray-950 tracking-tight">
              {monthNames[viewMonth]} {viewYear}
            </div>
            <button
              type="button"
              onClick={nextMonth}
              className="p-1.5 hover:bg-yellow-50 hover:text-red-600 rounded text-gray-700 transition-colors cursor-pointer"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* WEEKDAYS ROW */}
          <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-gray-400 pt-2 pb-1 uppercase tracking-wider">
            <div>Su</div>
            <div>Mo</div>
            <div>Tu</div>
            <div>We</div>
            <div>Th</div>
            <div>Fr</div>
            <div>Sa</div>
          </div>

          {/* DAYS GRID */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {/* Empty lead cells */}
            {Array.from({ length: firstDayOfWeek }).map((_, idx) => (
              <div key={`empty-${idx}`} className="w-8 h-8" />
            ))}

            {/* Day number buttons */}
            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const day = idx + 1;
              const formattedMonth = String(viewMonth + 1).padStart(2, "0");
              const formattedDay = String(day).padStart(2, "0");
              const currentIso = `${viewYear}-${formattedMonth}-${formattedDay}`;

              const isSelected = value === currentIso;
              const isToday = currentIso === todayDate;
              const hasHighlight = highlightDates.includes(currentIso);

              return (
                <button
                  key={`day-${day}`}
                  type="button"
                  onClick={() => handleSelectDay(day)}
                  className={`w-8 h-8 rounded text-xs font-semibold flex flex-col items-center justify-center relative transition-all cursor-pointer ${
                    isSelected
                      ? "bg-red-600 text-white font-black shadow-xs ring-2 ring-red-300"
                      : isToday
                      ? "border-2 border-yellow-500 font-black text-gray-950 bg-yellow-50/50 hover:bg-yellow-100"
                      : "text-gray-800 hover:bg-yellow-100 hover:text-gray-950"
                  }`}
                  title={`${monthNames[viewMonth]} ${day}, ${viewYear}${
                    hasHighlight ? " (Dispatches Scheduled)" : ""
                  }`}
                >
                  <span>{day}</span>

                  {/* Operational Dot indicator if this day has dispatches */}
                  {hasHighlight && (
                    <span
                      className={`w-1 h-1 rounded-full absolute bottom-1 ${
                        isSelected ? "bg-yellow-300" : "bg-red-600"
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* FOOTER ACTIONS: TODAY / TOMORROW / CLEAR */}
          <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  onChange(todayDate);
                  setIsOpen(false);
                }}
                className="px-2 py-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-950 font-bold rounded transition-colors cursor-pointer"
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => {
                  onChange(tomorrowDate);
                  setIsOpen(false);
                }}
                className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded transition-colors cursor-pointer"
              >
                Tomorrow
              </button>
            </div>

            {value && (
              <button
                type="button"
                onClick={() => {
                  onChange("");
                  setIsOpen(false);
                }}
                className="text-red-600 hover:text-red-800 font-bold underline cursor-pointer flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Clear</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

