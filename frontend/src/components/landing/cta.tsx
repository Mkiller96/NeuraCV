"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export function CTA() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700 px-8 py-16 text-center sm:px-16 sm:py-24"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 right-0 h-64 w-64 translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-48 w-48 -translate-x-1/3 translate-y-1/3 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]" />
          </div>

          <div className="relative">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
              <Sparkles className="h-4 w-4" />
              <span>Comienza gratis, actualiza cuando quieras</span>
            </div>

            <h2 className="mt-6 text-3xl font-bold tracking-tight text-white sm:text-5xl">
              Tu próximo empleo te está esperando
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-violet-100">
              Únete a más de 50,000 profesionales que ya transformaron su carrera con NeuraCV.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/register">
                <Button
                  size="xl"
                  className="bg-white text-violet-700 shadow-xl hover:bg-zinc-100 hover:shadow-2xl group"
                >
                  Crear mi CV Gratis
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Button
                variant="outline"
                size="xl"
                className="border-white/20 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
              >
                Ver Demo
              </Button>
            </div>

            <p className="mt-6 text-sm text-violet-200">
              No requiere tarjeta de crédito • Cancela cuando quieras
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
