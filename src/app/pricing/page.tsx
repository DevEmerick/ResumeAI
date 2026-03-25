"use client";
import PricingCard from "@/components/PricingCard";
import Navbar from "@/components/Navbar";
import { useTranslation } from "@/contexts/I18nContext";

export default function PricingPage() {
  const { t } = useTranslation();
  const plans = [
    {
      name: t("pricing.p1.name", "Free"),
      price: t("pricing.p1.price", "$0/mo"),
      features: [
        t("pricing.p1.f1", "2 resume analyses per month"),
      ],
      ctaLabel: t("pricing.p1.cta", "Get Started"),
      cta: "/account",
      highlight: false,
    },
    {
      name: t("pricing.p2.name", "Pro"),
      price: t("pricing.p2.price", "$19/mo"),
      features: [
        t("pricing.p2.f1", "Unlimited analysis"),
        t("pricing.p2.f2", "Resume rewriting"),
        t("pricing.p2.f3", "Keyword optimization"),
      ],
      ctaLabel: t("pricing.p2.cta", "Upgrade to Pro"),
      cta: "/account",
      highlight: true,
    },
    {
      name: t("pricing.p3.name", "Team"),
      price: t("pricing.p3.price", "$49/mo"),
      features: [
        t("pricing.p3.f1", "Multiple users"),
        t("pricing.p3.f2", "Shared dashboard"),
        t("pricing.p3.f3", "Advanced analytics"),
      ],
      ctaLabel: t("pricing.p3.cta", "Contact Sales"),
      cta: "/account",
      highlight: false,
    },
  ];

  return (
    <>
      <Navbar />
      <section className="w-full pt-16 pb-8 px-4 transition-colors duration-300">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 flex flex-col gap-4">
            <h1 className="text-4xl font-bold text-white">{t("pricing.title", "Planos Simples e Transparentes")}</h1>
            <p className="text-slate-400 text-lg">{t("pricing.subtitle", "Invista no seu futuro com o plano que melhor atende às suas necessidades.")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <PricingCard key={plan.name} {...plan} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
