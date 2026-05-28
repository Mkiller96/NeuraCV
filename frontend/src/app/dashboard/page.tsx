"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthContext";
import { api, type CV } from "@/lib/api/client";
import { DashboardNavbar } from "@/components/dashboard/DashboardNavbar";
import { CVCard } from "@/components/cv/CVCard";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Plus,
  Loader2,
  FileX,
  Sparkles,
  BarChart3,
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [cvs, setCvs] = useState<CV[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCVs = useCallback(async () => {
    try {
      const response = await api.getCVs();
      setCvs(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar los CVs");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
      return;
    }

    if (isAuthenticated) {
      fetchCVs();
    }
  }, [authLoading, isAuthenticated, router, fetchCVs]);

  const handleDelete = async (id: number) => {
    await api.deleteCV(id);
    setCvs((prev) => prev.filter((cv) => cv.id !== id));
  };

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
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
                Mis CVs
              </h1>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                Gestiona y edita tus currículums profesionales
              </p>
            </div>
            <Link href="/cvs/new">
              <Button size="lg">
                <Plus className="h-5 w-5" />
                Crear Nuevo CV
              </Button>
            </Link>
          </div>

          {/* Stats */}
          {!isLoading && cvs.length > 0 && (
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 dark:bg-violet-950">
                    <FileText className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-zinc-900 dark:text-white">
                      {cvs.length}
                    </p>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400">
                      Total CVs
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-950">
                    <Sparkles className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-zinc-900 dark:text-white">
                      {cvs.filter((cv) => cv.cv_template).length}
                    </p>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400">
                      Con plantilla
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-950">
                    <BarChart3 className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-zinc-900 dark:text-white">
                      {cvs.reduce(
                        (acc, cv) =>
                          acc +
                          (cv.experiences?.length || 0) +
                          (cv.skills?.length || 0),
                        0
                      )}
                    </p>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400">
                      Entradas totales
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

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
                  onClick={fetchCVs}
                >
                  Reintentar
                </Button>
              </div>
            ) : cvs.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-zinc-300 p-12 text-center dark:border-zinc-700">
                <FileText className="mx-auto h-16 w-16 text-zinc-300 dark:text-zinc-600" />
                <h3 className="mt-6 text-lg font-semibold text-zinc-900 dark:text-white">
                  No tienes CVs todavía
                </h3>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  Crea tu primer CV profesional con IA en minutos
                </p>
                <Link href="/cvs/new">
                  <Button className="mt-6" size="lg">
                    <Plus className="h-5 w-5" />
                    Crear mi primer CV
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {cvs.map((cv) => (
                  <CVCard key={cv.id} cv={cv} onDelete={handleDelete} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
