"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { RotateCcw, Check, PenLine } from "lucide-react";

interface SignaturePadProps {
  onChange: (dataUrl: string | null) => void;
  disabled?: boolean;
}

export default function SignaturePad({ onChange, disabled = false }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);

  // Resize canvas for device pixel ratio for crisp lines
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.scale(dpr, dpr);
      ctx.lineWidth = 2.5;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = "#0F172A";
    }
  }, []);

  useEffect(() => {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [resizeCanvas]);

  const getCanvasPoint = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (disabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.setPointerCapture(e.pointerId);
    setIsDrawing(true);
    const point = getCanvasPoint(e);
    lastPointRef.current = point;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(point.x, point.y);
      ctx.lineTo(point.x + 0.1, point.y + 0.1);
      ctx.stroke();
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing || disabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const currentPoint = getCanvasPoint(e);
    const lastPoint = lastPointRef.current;

    if (ctx && lastPoint) {
      ctx.beginPath();
      ctx.moveTo(lastPoint.x, lastPoint.y);
      ctx.lineTo(currentPoint.x, currentPoint.y);
      ctx.stroke();
    }

    lastPointRef.current = currentPoint;
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    setIsDrawing(false);
    lastPointRef.current = null;

    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      canvas.releasePointerCapture(e.pointerId);
    } catch {
      // Ignore if pointer capture already released
    }

    setHasSignature(true);
    onChange(canvas.toDataURL("image/png"));
  };

  const handleClear = () => {
    if (disabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    setHasSignature(false);
    onChange(null);
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-black uppercase tracking-wider text-gray-800 flex items-center gap-1.5">
          <PenLine className="w-4 h-4 text-red-600" />
          <span>Authorized Customer Signature (Draw with finger, stylus, or mouse)</span>
        </label>
        {hasSignature && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className="text-[11px] font-bold text-gray-600 hover:text-red-600 flex items-center gap-1 bg-gray-100 hover:bg-gray-200 px-2.5 py-1 rounded-lg transition-all cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Clear / Redo</span>
          </button>
        )}
      </div>

      <div
        className={`relative w-full h-44 sm:h-52 rounded-2xl bg-white border-2 transition-all overflow-hidden ${
          disabled
            ? "border-gray-200 bg-gray-50 opacity-90 cursor-not-allowed"
            : hasSignature
            ? "border-emerald-600 shadow-sm"
            : "border-slate-300 hover:border-slate-400 focus-within:border-red-600 shadow-inner"
        }`}
      >
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          style={{ touchAction: "none" }}
          className="w-full h-full cursor-crosshair block select-none"
        />

        {/* GUIDELINE & SIGNATURE WATERMARK */}
        <div className="absolute bottom-9 left-6 right-6 pointer-events-none flex items-center gap-2 border-b border-dashed border-gray-300 pb-1">
          <span className="text-xs font-black text-gray-400 select-none">✕</span>
          <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest select-none">
            Sign on the line above
          </span>
        </div>

        {/* STATUS BADGE */}
        <div className="absolute top-2.5 right-2.5 pointer-events-none select-none">
          {hasSignature ? (
            <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-black uppercase px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
              <Check className="w-3 h-3 text-emerald-600" />
              <span>Signature Captured</span>
            </span>
          ) : (
            <span className="bg-gray-100 text-gray-500 text-[10px] font-bold uppercase px-2 py-0.5 rounded-md">
              Awaiting Signature
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
