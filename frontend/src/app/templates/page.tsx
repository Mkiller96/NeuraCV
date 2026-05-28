"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthContext";
import { api, type Template } from "@/lib/api/client";
import { DashboardNavbar } from "@/components/dashboard/DashboardNavbar";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  ArrowLeft,
  Sparkles,
  Layout,
  Check,
  FileX,
  Star,
} from "lucide-react";

export default function TemplatesPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
      return;
    }

    if (isAuthenticated) {
      const fetchTemplates = async () => {
        try {
          const response = await api.getTemplates();
          setTemplates(response);
        } catch (err) {
          setError(
            err instanceof Error ? err.message : "Error al cargar las plantillas"
          );
        } finally {
          setIsLoading(false);
        }
      };
      fetchTemplates();
    }
  }, [authLoading, isAuthenticated, router]);

  if (authLoading || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardNavbar />

      <main className="flex-1 pt-16">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Link
                href="/dashboard"
                className="mb-4 inline-flex items-center gap-1 text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver al dashboard
              </Link>
              <h1 className="mt-2 text-2xl font-bold text-zinc-900 dark:text-white">
                Galería de Plantillas
              </h1>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                Elige una plantilla profesional para tu CV
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="mt-8">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
              </div>
            ) : error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-900 dark:bg-red-950/50">
                <FileX className="mx-auto h-12 w-12 text-red-400" />
                <h3 className="mt-4 text-lg font-semibold text-red-800 dark:text-red-200">
                  Error al cargar
                </h3>
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                  {error}
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => window.location.reload()}
                >
                  Reintentar
                </Button>
              </div>
            ) : templates.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-zinc-300 p-12 text-center dark:border-zinc-700">
                <Layout className="mx-auto h-16 w-16 text-zinc-300 dark:text-zinc-600" />
                <h3 className="mt-6 text-lg font-semibold text-zinc-900 dark:text-white">
                  No hay plantillas disponibles
                </h3>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  Pronto añadiremos nuevas plantillas para ti
                </p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white transition-all duration-200 hover:shadow-lg hover:border-violet-200 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-violet-800"
                  >
                    {/* Premium badge */}
                    {template.is_premium && (
                      <div className="absolute top-3 right-3 z-10">
                        <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
                          <Star className="h-3 w-3 fill-white" />
                          Premium
                        </span>
                      </div>
                    )}

                    {/* Preview */}
                    <div className="aspect-[210/297] w-full bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-800 dark:to-zinc-900">
                      {template.preview_url ? (
                        <img
                          src={template.preview_url}
                          alt={template.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <Layout className="h-12 w-12 text-zinc-300 dark:text-zinc-600" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-5">
                      <h3 className="font-semibold text-zinc-900 dark:text-white">
                        {template.name}
                      </h3>
                      {template.description && (
                        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
                          {template.description}
                        </p>
                      )}

                      {/* Category */}
                      {template.category && (
                        <span className="mt-3 inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                          {template.category}
                        </span>
                      )}

                      {/* Actions */}
                      <div className="mt-4 flex items-center gap-2">
                        <Link href={`/cvs/new?template=${template.id}`}>
                          <Button size="sm" className="w-full">
                            <Check className="h-4 w-4" />
                            Usar plantilla
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
