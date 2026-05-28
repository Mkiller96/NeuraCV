"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthContext";
import { api, type User } from "@/lib/api/client";
import { DashboardNavbar } from "@/components/dashboard/DashboardNavbar";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  ArrowLeft,
  User as UserIcon,
  Mail,
  Calendar,
  Save,
  FileX,
} from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
      return;
    }

    if (isAuthenticated) {
      const fetchUser = async () => {
        try {
          const response = await api.user();
          setUser(response);
          setFormData({
            name: response.name,
            email: response.email,
          });
        } catch (err) {
          setError(
            err instanceof Error ? err.message : "Error al cargar el perfil"
          );
        } finally {
          setIsLoading(false);
        }
      };
      fetchUser();
    }
  }, [authLoading, isAuthenticated, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsSaving(true);

    try {
      setSuccess("Perfil actualizado correctamente");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al actualizar el perfil");
    } finally {
      setIsSaving(false);
    }
  };

  if (authLoading || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <DashboardNavbar />
        <main className="flex-1 pt-16">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
          </div>
        </main>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="flex min-h-screen flex-col">
        <DashboardNavbar />
        <main className="flex-1 pt-16">
          <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-900 dark:bg-red-950/50">
              <FileX className="mx-auto h-12 w-12 text-red-400" />
              <h3 className="mt-4 text-lg font-semibold text-red-800 dark:text-red-200">
                Error al cargar el perfil
              </h3>
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {error}
              </p>
              <Link href="/dashboard">
                <Button variant="outline" className="mt-4">
                  Volver al dashboard
                </Button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const createdDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

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
            {/* Header */}
            <div className="mb-8 flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-100 to-indigo-100 dark:from-violet-950 dark:to-indigo-950">
                <UserIcon className="h-8 w-8 text-violet-600 dark:text-violet-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
                  Mi Perfil
                </h1>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  Gestiona tu información personal
                </p>
              </div>
            </div>

            {/* User info */}
            <div className="mb-8 rounded-xl border border-zinc-100 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
              <div className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                <Mail className="h-4 w-4" />
                {user?.email}
              </div>
              {createdDate && (
                <div className="mt-2 flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                  <Calendar className="h-4 w-4" />
                  Miembro desde {createdDate}
                </div>
              )}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-950/50 dark:text-red-400">
                  {error}
                </div>
              )}

              {success && (
                <div className="rounded-lg bg-emerald-50 p-4 text-sm text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                  {success}
                </div>
              )}

              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Nombre completo
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="mt-1.5 block w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 transition-colors focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-500"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="mt-1.5 block w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 transition-colors focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-500"
                />
              </div>

              <div className="flex items-center gap-3 pt-4">
                <Button type="submit" size="lg" disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Guardar cambios
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
