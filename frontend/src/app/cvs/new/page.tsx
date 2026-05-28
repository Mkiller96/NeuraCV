"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { api, type CreateCVPayload } from "@/lib/api/client";
import { DashboardNavbar } from "@/components/dashboard/DashboardNavbar";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";

export default function CreateCVPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<CreateCVPayload>({
    title: "",
    full_name: "",
    email: "",
    phone: "",
    address: "",
    website: "",
    linkedin: "",
    github: "",
    professional_summary: "",
  });

  // Redirect if not authenticated
  if (!authLoading && !isAuthenticated) {
    router.push("/login");
    return null;
  }

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
      </div>
    );
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await api.createCV(formData);
      router.push(`/cvs/${response.id}/edit`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear el CV");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardNavbar />

      <main className="flex-1 pt-16">
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Back */}
          <Link
            href="/dashboard"
            className="mb-6 inline-flex items-center gap-1 text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al dashboard
          </Link>

          <div className="rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
                Crear Nuevo CV
              </h1>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                Completa la información básica. Luego podrás añadir experiencia,
                educación y más detalles.
              </p>
            </div>

            {error && (
              <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-950/50 dark:text-red-400">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                  >
                    Título del CV <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Ej: Desarrollador Full Stack - 2026"
                    required
                    className="mt-1.5 block w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 transition-colors focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="full_name"
                    className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                  >
                    Nombre completo <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="full_name"
                    name="full_name"
                    type="text"
                    value={formData.full_name}
                    onChange={handleChange}
                    placeholder="Ej: Juan Pérez García"
                    required
                    className="mt-1.5 block w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 transition-colors focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                  >
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="juan@ejemplo.com"
                    required
                    className="mt-1.5 block w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 transition-colors focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                  >
                    Teléfono
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone || ""}
                    onChange={handleChange}
                    placeholder="+34 600 000 000"
                    className="mt-1.5 block w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 transition-colors focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="website"
                    className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                  >
                    Sitio web
                  </label>
                  <input
                    id="website"
                    name="website"
                    type="url"
                    value={formData.website || ""}
                    onChange={handleChange}
                    placeholder="https://tusitio.com"
                    className="mt-1.5 block w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 transition-colors focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="linkedin"
                    className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                  >
                    LinkedIn
                  </label>
                  <input
                    id="linkedin"
                    name="linkedin"
                    type="url"
                    value={formData.linkedin || ""}
                    onChange={handleChange}
                    placeholder="https://linkedin.com/in/tu-perfil"
                    className="mt-1.5 block w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 transition-colors focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="github"
                    className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                  >
                    GitHub
                  </label>
                  <input
                    id="github"
                    name="github"
                    type="url"
                    value={formData.github || ""}
                    onChange={handleChange}
                    placeholder="https://github.com/tu-usuario"
                    className="mt-1.5 block w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 transition-colors focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                  >
                    Dirección
                  </label>
                  <input
                    id="address"
                    name="address"
                    type="text"
                    value={formData.address || ""}
                    onChange={handleChange}
                    placeholder="Ciudad, País"
                    className="mt-1.5 block w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 transition-colors focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="professional_summary"
                    className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                  >
                    Resumen profesional
                  </label>
                  <textarea
                    id="professional_summary"
                    name="professional_summary"
                    value={formData.professional_summary || ""}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Breve descripción sobre ti, tu experiencia y objetivos profesionales..."
                    className="mt-1.5 block w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 transition-colors focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-500 resize-y"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4">
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creando CV...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Crear CV
                    </>
                  )}
                </Button>
                <Link href="/dashboard">
                  <Button type="button" variant="outline" size="lg">
                    Cancelar
                  </Button>
                </Link>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
