"use client";
import Navbar from "@/components/Navbar";
import FeatureCard from "@/components/FeatureCard";
import { HiSparkles, HiKey, HiChartBar, HiPencilAlt } from "react-icons/hi";
import { useTranslation } from "@/contexts/I18nContext";

export default function FeaturesPage() {
  const { t } = useTranslation();
  const features = [
    {
      title: t("features.f1.title", "AI Powered"),
      description: t("features.f1.desc", "Get instant feedback powered by artificial intelligence."),
      icon: <HiSparkles />, 
      details: t("features.f1.details", "Our AI analyzes your resume and provides actionable insights to improve your chances."),
    },
    {
      title: t("features.f2.title", "Multi-language"),
      description: t("features.f2.desc", "Supports multiple languages for global users."),
      icon: <HiKey />, 
      details: t("features.f2.details", "You can upload resumes in different languages and get feedback tailored to your region."),
    },
    {
      title: t("features.f3.title", "File Uploads"),
      description: t("features.f3.desc", "Upload PDF, DOC, DOCX."),
      icon: <HiChartBar />, 
      details: t("features.f3.details", "Easily upload your resume in various formats and get instant analysis."),
    },
  ];
  return (
    <>
      <Navbar />
      <section className="w-full pt-16 pb-8 px-4 transition-colors duration-300">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 flex flex-col gap-4">
            <h1 className="text-4xl font-bold text-white">{t("features.title", "Nossos Recursos")}</h1>
            <p className="text-slate-400 text-lg">{t("features.subtitle", "Descubra como nossa plataforma pode transformar sua carreira.")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
