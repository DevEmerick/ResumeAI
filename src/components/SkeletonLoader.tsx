import React from "react";

export default function SkeletonLoader({ className = "", style = {} }) {
  return (
    <div
      className={`animate-pulse bg-slate-700/60 rounded-md h-5 w-40 my-1 ${className}`}
      style={style}
    >
      <div className="h-full w-full bg-gradient-to-r from-slate-700/60 via-slate-600/40 to-slate-700/60 rounded-md" />
    </div>
  );
}
