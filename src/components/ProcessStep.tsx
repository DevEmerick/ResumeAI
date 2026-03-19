"use client";
import React from "react";
import { useRouter } from "next/navigation";

interface ProcessStepProps {
  step: number;
  icon: React.ReactNode;
  title: string;
  description: string;
  cta: string;
  ctaLabel: string;
}

const ProcessStep: React.FC<ProcessStepProps> = ({ step, icon, title, description, cta, ctaLabel }) => {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center text-center relative group focus-within:scale-[1.03] focus-within:ring-2 focus-within:ring-[#3B82F6] dark:focus-within:ring-[#2563EB] transition-transform duration-200" tabIndex={0} aria-label={title}>
      <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[#23272A] dark:bg-[#E3E6ED] border-2 border-[#3B82F6] dark:border-[#2563EB] text-[#3B82F6] dark:text-[#2563EB] text-4xl mb-2 shadow-md group-hover:scale-105 transition-transform duration-200">
        {icon}
      </div>
      <div className="absolute left-1/2 top-14 w-1 h-12 bg-[#3B82F6]/30 dark:bg-[#2563EB]/30 -translate-x-1/2 z-0" style={{ display: step === 3 ? 'none' : undefined }} />
      <div className="z-10">
        <div className="text-sm text-[#AAB4C2] dark:text-[#23272A] mb-1">Step {step}</div>
        <h3 className="text-xl font-semibold text-[#E3E6ED] dark:text-[#181A1B] mb-2">{title}</h3>
        <p className="text-[#AAB4C2] dark:text-[#23272A] text-base mb-4 max-w-xs">{description}</p>
        <button
          className="bg-[#3B82F6] dark:bg-[#2563EB] hover:bg-[#2563EB] dark:hover:bg-[#3B82F6] text-[#E3E6ED] dark:text-[#181A1B] px-4 py-2 rounded-lg text-base font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6] dark:focus-visible:ring-[#2563EB] shadow-sm"
          onClick={() => router.push(cta)}
          aria-label={ctaLabel}
        >
          {ctaLabel}
        </button>
      </div>
    </div>
  );
};

export default ProcessStep;
