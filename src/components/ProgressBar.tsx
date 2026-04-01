import React, { useEffect, useRef } from "react";

interface ProgressBarProps {
  progress: number; // 0 a 100
  indeterminate?: boolean;
  finished?: boolean;
}

export default function ProgressBar({ progress, indeterminate, finished }: ProgressBarProps) {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (indeterminate && barRef.current) {
      barRef.current.classList.add("animate-pulse");
    } else if (barRef.current) {
      barRef.current.classList.remove("animate-pulse");
    }
  }, [indeterminate]);

  return (
    <div className="w-full flex items-center gap-2 select-none">
      <div className={`relative w-full h-4 bg-slate-700 rounded-full overflow-hidden mt-4 mb-4 transition-all duration-500 ${finished ? "shadow-[0_0_0_2px_#22c55e]" : ""}`}
        style={{ boxShadow: finished ? "0 0 0 2px #22c55e" : undefined }}>
        <div
          ref={barRef}
          className={`h-full transition-all duration-700 ${finished ? "bg-green-500" : "bg-blue-500"} ${indeterminate ? "animate-pulse" : ""}`}
          style={{ width: indeterminate ? "60%" : `${progress}%` }}
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          role="progressbar"
        />
        {finished && (
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-green-300 animate-fade-in">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
          </span>
        )}
      </div>
      <span className={`text-xs font-bold w-10 text-right tabular-nums transition-all duration-500 ${finished ? "text-green-400" : "text-blue-400"}`}>{Math.round(progress)}%</span>
    </div>
  );
}
