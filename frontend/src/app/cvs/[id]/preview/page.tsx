"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthContext";
import { api, type CV } from "@/lib/api/client";
import { DashboardNavbar } from "@/components/dashboard/DashboardNavbar";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  ArrowLeft,
  Edit,
  Download,
  Printer,
  FileX,
  Mail,
  Phone,
  MapPin,
  Globe,
} from "lucide-react";

const proficiencyLabels: Record<string, string> = {
  basic: "Básico",
  intermediate: "Intermedio",
  advanced: "Avanzado",
  native: "Nativo",
};

export default function PreviewCVPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [cv, setCv] = useState<CV | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
      return;
    }

    if (isAuthenticated && params.id) {
      const fetchCV = async () => {
        try {
          const response = await api.getCV(Number(params.id));
          setCv(response);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Error al cargar el CV");
        } finally {
          setIsLoading(false);
        }
      };
      fetchCV();
    }
  }, [authLoading, isAuthenticated, params.id, router]);

  const handlePrint = () => {
    window.print();
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

  if (error || !cv) {
    return (
      <div className="flex min-h-screen flex-col">
        <DashboardNavbar />
        <main className="flex-1 pt-16">
          <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-900 dark:bg-red-950/50">
              <FileX className="mx-auto h-12 w-12 text-red-400" />
              <h3 className="mt-4 text-lg font-semibold text-red-800 dark:text-red-200">
                Error al cargar el CV
              </h3>
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {error || "CV no encontrado"}
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

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardNavbar />

      {/* Toolbar - hidden when printing */}
      <div className="fixed top-16 left-0 right-0 z-40 border-b border-zinc-200 bg-white/80 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-950/80 print:hidden">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4 sm:px-6">
          <Link
            href={`/cvs/${cv.id}`}
            className="inline-flex items-center gap-1 text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Link>
          <div className="flex items-center gap-2">
            <Link href={`/cvs/${cv.id}/edit`}>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4" />
                Editar
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="h-4 w-4" />
              Imprimir
            </Button>
            <Button size="sm" onClick={handlePrint}>
              <Download className="h-4 w-4" />
              Descargar PDF
            </Button>
          </div>
        </div>
      </div>

      {/* CV Preview */}
      <main className="flex-1 pt-32 print:pt-0">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 print:px-0 print:py-0">
          <div
            ref={printRef}
            className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-white print:rounded-none print:border-none print:shadow-none"
          >
            {/* CV Content - Professional Print Layout */}
            <div className="p-8 print:p-0">
              {/* Header Section */}
              <div className="border-b-2 border-zinc-900 pb-6 print:border-zinc-900">
                <h1 className="text-4xl font-bold tracking-tight text-zinc-900">
                  {cv.full_name}
                </h1>
                <p className="mt-1 text-lg text-zinc-600">{cv.title}</p>
                <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm text-zinc-600">
                  {cv.email && (
                    <span className="inline-flex items-center gap-1">
                      <Mail className="h-3.5 w-3.5" />
                      {cv.email}
                    </span>
                  )}
                  {cv.phone && (
                    <span className="inline-flex items-center gap-1">
                      <Phone className="h-3.5 w-3.5" />
                      {cv.phone}
                    </span>
                  )}
                  {cv.address && (
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {cv.address}
                    </span>
                  )}
                  {cv.website && (
                    <span className="inline-flex items-center gap-1">
                      <Globe className="h-3.5 w-3.5" />
                      {cv.website.replace(/^https?:\/\//, "")}
                    </span>
                  )}
                  {cv.linkedin && (
                    <span className="inline-flex items-center gap-1">
                      <Globe className="h-3.5 w-3.5" />
                      {cv.linkedin.replace(/^https?:\/\//, "")}
                    </span>
                  )}
                  {cv.github && (
                    <span className="inline-flex items-center gap-1">
                      <Globe className="h-3.5 w-3.5" />
                      {cv.github.replace(/^https?:\/\//, "")}
                    </span>
                  )}
                </div>
              </div>

              {/* Professional Summary */}
              {cv.professional_summary && (
                <div className="mt-6">
                  <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                    Resumen Profesional
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-700">
                    {cv.professional_summary}
                  </p>
                </div>
              )}

              {/* Experience */}
              {cv.experiences && cv.experiences.length > 0 && (
                <div className="mt-6">
                  <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                    Experiencia Laboral
                  </h2>
                  <div className="mt-3 space-y-5">
                    {cv.experiences.map((exp) => (
                      <div key={exp.id}>
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-zinc-900">
                              {exp.position}
                            </h3>
                            <p className="text-sm text-zinc-600">
                              {exp.company}
                              {exp.location && `, ${exp.location}`}
                            </p>
                          </div>
                          <p className="shrink-0 text-xs text-zinc-500">
                            {new Date(exp.start_date).toLocaleDateString("es-ES", {
                              month: "short",
                              year: "numeric",
                            })}{" "}
                            -{" "}
                            {exp.is_current
                              ? "Actualidad"
                              : exp.end_date
                              ? new Date(exp.end_date).toLocaleDateString("es-ES", {
                                  month: "short",
                                  year: "numeric",
                                })
                              : ""}
                          </p>
                        </div>
                        {exp.description && (
                          <p className="mt-1 text-sm leading-relaxed text-zinc-600">
                            {exp.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Education */}
              {cv.education && cv.education.length > 0 && (
                <div className="mt-6">
                  <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                    Educación
                  </h2>
                  <div className="mt-3 space-y-5">
                    {cv.education.map((edu) => (
                      <div key={edu.id}>
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-zinc-900">
                              {edu.degree}
                            </h3>
                            <p className="text-sm text-zinc-600">
                              {edu.institution}
                              {edu.field_of_study && ` - ${edu.field_of_study}`}
                            </p>
                          </div>
                          <p className="shrink-0 text-xs text-zinc-500">
                            {new Date(edu.start_date).toLocaleDateString("es-ES", {
                              month: "short",
                              year: "numeric",
                            })}{" "}
                            -{" "}
                            {edu.is_current
                              ? "Actualidad"
                              : edu.end_date
                              ? new Date(edu.end_date).toLocaleDateString("es-ES", {
                                  month: "short",
                                  year: "numeric",
                                })
                              : ""}
                          </p>
                        </div>
                        {edu.grade && (
                          <p className="mt-0.5 text-xs text-zinc-500">
                            Nota: {edu.grade}
                          </p>
                        )}
                        {edu.description && (
                          <p className="mt-1 text-sm leading-relaxed text-zinc-600">
                            {edu.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills & Languages - Two columns */}
              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                {cv.skills && cv.skills.length > 0 && (
                  <div>
                    <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                      Habilidades
                    </h2>
                    <div className="mt-3 space-y-2">
                      {cv.skills.map((skill) => (
                        <div key={skill.id}>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-zinc-900">
                              {skill.name}
                            </span>
                            <span className="text-xs text-zinc-500">
                              {skill.proficiency}%
                            </span>
                          </div>
                          <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-zinc-200">
                            <div
                              className="h-full rounded-full bg-zinc-900"
                              style={{ width: `${skill.proficiency}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {cv.languages && cv.languages.length > 0 && (
                  <div>
                    <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                      Idiomas
                    </h2>
                    <div className="mt-3 space-y-2">
                      {cv.languages.map((lang) => (
                        <div
                          key={lang.id}
                          className="flex items-center justify-between"
                        >
                          <span className="text-sm font-medium text-zinc-900">
                            {lang.name}
                          </span>
                          <span className="text-xs text-zinc-500">
                            {proficiencyLabels[lang.proficiency] || lang.proficiency}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
