"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "María García",
    role: "Marketing Digital",
    avatar: "MG",
    content: "En 5 minutos tenía un CV increíble. La IA escribió descripciones mucho mejores de lo que yo podría haber hecho. Conseguí 3 entrevistas en la primera semana.",
    rating: 5,
  },
  {
    name: "Carlos Mendoza",
    role: "Ingeniero de Software",
    avatar: "CM",
    content: "El optimizador ATS es un game changer. Pasé de no recibir respuestas a tener entrevistas semanales. La mejor inversión para mi carrera.",
    rating: 5,
  },
  {
    name: "Ana López",
    role: "Diseñadora UX",
    avatar: "AL",
    content: "Las plantillas son hermosas y muy profesionales. Me encanta poder tener mi CV en español e inglés con un solo clic. Súper recomendado.",
    rating: 5,
  },
  {
    name: "Roberto Sánchez",
    role: "Gerente de Ventas",
    avatar: "RS",
    content: "Pasé de un CV aburrido a uno que realmente muestra mi valor. La IA sabe exactamente qué palabras usar para cada industria.",
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="relative py-24 sm:py-32">
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
            Testimonios
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-white">
            Lo que dicen nuestros usuarios
          </p>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
            Más de 50,000 profesionales confían en NeuraCV para impulsar su carrera.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="rounded-2xl border border-zinc-200 bg-white p-6 transition-all duration-300 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
            >
              {/* Rating */}
              <div className="flex gap-1">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>

              {/* Content */}
              <p className="mt-4 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                &ldquo;{testimonial.content}&rdquo;
              </p>

              {/* Author */}
              <div className="mt-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 text-sm font-semibold text-white">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="text-sm font-semibold text-zinc-900 dark:text-white">
                    {testimonial.name}
                  </div>
                  <div className="text-xs text-zinc-500">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
