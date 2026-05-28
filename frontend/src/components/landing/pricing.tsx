"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, Sparkles } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Perfecto para empezar",
    features: [
      "1 CV básico",
      "3 plantillas gratuitas",
      "Exportación PDF",
      "Soporte por email",
    ],
    cta: "Crear CV Gratis",
    popular: false,
  },
  {
    name: "Pro",
    price: "$9.99",
    period: "/mes",
    description: "Para profesionales serios",
    features: [
      "CVs ilimitados",
      "20+ plantillas premium",
      "IA avanzada para redacción",
      "Optimización ATS",
      "Multi-idioma",
      "Soporte prioritario",
    ],
    cta: "Empezar Pro",
    popular: true,
  },
  {
    name: "Premium",
    price: "$19.99",
    period: "/mes",
    description: "Para crecimiento profesional",
    features: [
      "Todo lo de Pro",
      "Cartas de presentación con IA",
      "Análisis de CV avanzado",
      "Integración LinkedIn",
      "Exportación DOCX",
      "Soporte 24/7",
    ],
    cta: "Empezar Premium",
    popular: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="relative py-24 sm:py-32">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-50/50 to-transparent dark:from-violet-950/20" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-base font-semibold text-violet-600">
            Precios simples
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-white">
            Invierte en tu futuro profesional
          </p>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
            Sin contratos ocultos. Cancela cuando quieras.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative flex flex-col rounded-2xl border p-8 transition-all duration-300 ${
                plan.popular
                  ? "border-violet-200 bg-white shadow-xl shadow-violet-500/10 dark:border-violet-800 dark:bg-zinc-900"
                  : "border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-1 text-xs font-semibold text-white shadow-lg">
                    <Sparkles className="h-3 w-3" />
                    Más Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                  {plan.name}
                </h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-zinc-900 dark:text-white">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-sm text-zinc-500">{plan.period}</span>
                  )}
                </div>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  {plan.description}
                </p>
              </div>

              <ul className="mb-8 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-violet-600" />
                    <span className="text-sm text-zinc-700 dark:text-zinc-300">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                variant={plan.popular ? "default" : "outline"}
                size="lg"
                className="w-full"
              >
                {plan.cta}
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Enterprise CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 rounded-2xl border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900"
        >
          <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">
            ¿Eres una empresa o agencia?
          </h3>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Plan Enterprise con marca blanca, API dedicada y soporte personalizado desde $499/mes
          </p>
          <Button variant="outline" size="lg" className="mt-6">
            Contactar Ventas
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
