"use client";

import React, { useEffect } from "react";
import { AlertTriangle, CheckCircle2, AlertCircle, Info } from "lucide-react";

export interface SwalModalProps {
  isOpen: boolean;
  type?: "warning" | "error" | "success" | "info";
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

export default function SwalModal({
  isOpen,
  type = "warning",
  title,
  message,
  confirmText = "Got It, I'll Fix It",
  cancelText,
  onConfirm,
  onCancel,
}: SwalModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (onCancel) onCancel();
        else onConfirm();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onConfirm, onCancel]);

  if (!isOpen) return null;

  const iconConfig = {
    warning: {
      bg: "bg-amber-100",
      text: "text-amber-700",
      icon: AlertTriangle,
      btnClass: "btn-red",
    },
    error: {
      bg: "bg-red-100",
      text: "text-red-700",
      icon: AlertCircle,
      btnClass: "btn-red",
    },
    success: {
      bg: "bg-emerald-100",
      text: "text-emerald-700",
      icon: CheckCircle2,
      btnClass: "bg-emerald-600 hover:bg-emerald-700 text-white",
    },
    info: {
      bg: "bg-blue-100",
      text: "text-blue-700",
      icon: Info,
      btnClass: "btn-yellow text-gray-950",
    },
  }[type];

  const IconComponent = iconConfig.icon;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={() => (onCancel ? onCancel() : onConfirm())}
    >
      <div
        className="bg-white rounded-2xl max-w-sm w-full p-6 text-center border-2 border-slate-200 shadow-2xl relative animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* SIMPLE COMPACT CIRCULAR ICON BADGE */}
        <div
          className={`w-12 h-12 rounded-full ${iconConfig.bg} ${iconConfig.text} flex items-center justify-center mx-auto mb-3.5 shadow-xs shrink-0`}
        >
          <IconComponent className="w-6 h-6 stroke-[2.2]" />
        </div>

        {/* TITLE */}
        <h3 className="text-lg font-black text-gray-950 tracking-tight leading-snug">
          {title}
        </h3>

        {/* MESSAGE */}
        <p className="mt-2 text-xs sm:text-sm text-gray-600 font-medium leading-relaxed">
          {message}
        </p>

        {/* ACTION BUTTONS */}
        <div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-2.5">
          {cancelText && onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-gray-700 bg-slate-100 hover:bg-slate-200 transition-all cursor-pointer"
            >
              {cancelText}
            </button>
          )}

          <button
            type="button"
            onClick={onConfirm}
            className={`w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-sm hover:scale-102 transition-all cursor-pointer whitespace-nowrap ${iconConfig.btnClass}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
