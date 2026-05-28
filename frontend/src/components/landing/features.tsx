"use client";

import { motion } from "framer-motion";
import { 
  Brain, 
  FileText, 
  Download, 
  Search, 
  Globe, 
  Zap,
  Sparkles,
  Shield,
  BarChart3
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "IA que te entiende",
    description: "Nuestra IA analiza tu experiencia y redacta logros profesionales impactantes que los reclutadores quieren ver.",
    gradient: "from-violet-500 to-purple-500",
  },
  {
    icon: Search,
    title: "Optimizado para ATS",
    description: "Tu CV pasa los filtros automáticos. Optimizamos palabras clave según tu industria y puesto deseado.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: FileText,
    title: "Plantillas Premium",
    description: "Diseños modernos y profesionales creados por diseñadores. Elige entre 20+ plantillas exclusivas.",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    icon: Zap,
    title: "Generación en 2 Minutos",
    description: "Completa tu información y obtén un CV listo para enviar. Sin complicaciones, sin esperas.",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    icon: Globe,
    title: "Multi-idioma",
    description: "Crea CVs en español, inglés, portugués y francés. Ideal para oportunidades internacionales.",
    gradient: "from-rose-500 to-pink-500",
  },
  {
    icon: Download,
    title: "Exportación Inteligente",
    description: "Descarga en PDF, DOCX o comparte con un enlace. Tu CV siempre actualizado y accesible.",
    gradient: "from-indigo-500 to-violet-500",
  },
];

export function Features() {
  return (
    <section id="features" className="relative py-24 sm:py-32">
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
            Todo lo que necesitas
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-white">
            Tu CV perfecto en minutos
          </p>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
            No solo creamos CVs bonitos. Creamos CVs que consiguen entrevistas.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative rounded-2xl border border-zinc-200 bg-white p-6 transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/5 hover:border-violet-200 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-violet-800"
            >
              <div className={`inline-flex rounded-xl bg-gradient-to-br ${feature.gradient} p-3 text-white shadow-lg`}>
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
