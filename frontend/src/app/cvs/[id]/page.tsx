"use client";

import { useState, useEffect } from "react";
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
  Eye,
  Calendar,
  MapPin,
  Globe,
  Mail,
  Phone,
  Briefcase,
  GraduationCap,
  Wrench,
  Languages,
  FileX,
} from "lucide-react";

const proficiencyLabels: Record<string, string> = {
  basic: "Básico",
  intermediate: "Intermedio",
  advanced: "Avanzado",
  native: "Nativo",
};

export default function ViewCVPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [cv, setCv] = useState<CV | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

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

  const createdDate = new Date(cv.created_at).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardNavbar />

      <main className="flex-1 pt-16">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Navigation */}
          <div className="mb-6 flex items-center justify-between">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1 text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver al dashboard
            </Link>
            <div className="flex items-center gap-2">
              <Link href={`/cvs/${cv.id}/edit`}>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4" />
                  Editar
                </Button>
              </Link>
              <Link href={`/cvs/${cv.id}/preview`}>
                <Button size="sm">
                  <Eye className="h-4 w-4" />
                  Vista previa
                </Button>
              </Link>
            </div>
          </div>

          {/* CV Content */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
            {/* Header */}
            <div className="border-b border-zinc-100 pb-6 dark:border-zinc-800">
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
                {cv.full_name}
              </h1>
              <p className="mt-1 text-lg text-zinc-600 dark:text-zinc-400">
                {cv.title}
              </p>
              <div className="mt-4 flex flex-wrap gap-4 text-sm text-zinc-600 dark:text-zinc-400">
                {cv.email && (
                  <span className="inline-flex items-center gap-1.5">
                    <Mail className="h-4 w-4" />
                    {cv.email}
                  </span>
                )}
                {cv.phone && (
                  <span className="inline-flex items-center gap-1.5">
                    <Phone className="h-4 w-4" />
                    {cv.phone}
                  </span>
                )}
                {cv.address && (
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" />
                    {cv.address}
                  </span>
                )}
                {cv.website && (
                  <a
                    href={cv.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-violet-600 hover:text-violet-700 dark:text-violet-400"
                  >
                    <Globe className="h-4 w-4" />
                    Sitio web
                  </a>
                )}
                {cv.linkedin && (
                  <a
                    href={cv.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-violet-600 hover:text-violet-700 dark:text-violet-400"
                  >
                    <Globe className="h-4 w-4" />
                    LinkedIn
                  </a>
                )}
                {cv.github && (
                  <a
                    href={cv.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-violet-600 hover:text-violet-700 dark:text-violet-400"
                  >
                    <Globe className="h-4 w-4" />
                    GitHub
                  </a>
                )}
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-xs text-zinc-500">
                <Calendar className="h-3.5 w-3.5" />
                Creado el {createdDate}
              </div>
            </div>

            {/* Professional Summary */}
            {cv.professional_summary && (
              <div className="mt-6">
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
                  Resumen Profesional
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                  {cv.professional_summary}
                </p>
              </div>
            )}

            {/* Experiences */}
            {cv.experiences && cv.experiences.length > 0 && (
              <div className="mt-8">
                <h2 className="flex items-center gap-2 text-lg font-semibold text-zinc-900 dark:text-white">
                  <Briefcase className="h-5 w-5 text-violet-600" />
                  Experiencia Laboral
                </h2>
                <div className="mt-4 space-y-6">
                  {cv.experiences.map((exp) => (
                    <div
                      key={exp.id}
                      className="border-l-2 border-violet-200 pl-4 dark:border-violet-800"
                    >
                      <h3 className="font-semibold text-zinc-900 dark:text-white">
                        {exp.position}
                      </h3>
                      <p className="text-sm text-violet-600 dark:text-violet-400">
                        {exp.company}
                        {exp.location && ` - ${exp.location}`}
                      </p>
                      <p className="mt-0.5 text-xs text-zinc-500">
                        {new Date(exp.start_date).toLocaleDateString("es-ES", {
                          month: "long",
                          year: "numeric",
                        })}{" "}
                        -{" "}
                        {exp.is_current
                          ? "Actualidad"
                          : exp.end_date
                          ? new Date(exp.end_date).toLocaleDateString("es-ES", {
                              month: "long",
                              year: "numeric",
                            })
                          : ""}
                      </p>
                      {exp.description && (
                        <p className="mt-2 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
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
              <div className="mt-8">
                <h2 className="flex items-center gap-2 text-lg font-semibold text-zinc-900 dark:text-white">
                  <GraduationCap className="h-5 w-5 text-violet-600" />
                  Educación
                </h2>
                <div className="mt-4 space-y-6">
                  {cv.education.map((edu) => (
                    <div
                      key={edu.id}
                      className="border-l-2 border-violet-200 pl-4 dark:border-violet-800"
                    >
                      <h3 className="font-semibold text-zinc-900 dark:text-white">
                        {edu.degree}
                      </h3>
                      <p className="text-sm text-violet-600 dark:text-violet-400">
                        {edu.institution}
                        {edu.field_of_study && ` - ${edu.field_of_study}`}
                      </p>
                      <p className="mt-0.5 text-xs text-zinc-500">
                        {new Date(edu.start_date).toLocaleDateString("es-ES", {
                          month: "long",
                          year: "numeric",
                        })}{" "}
                        -{" "}
                        {edu.is_current
                          ? "Actualidad"
                          : edu.end_date
                          ? new Date(edu.end_date).toLocaleDateString("es-ES", {
                              month: "long",
                              year: "numeric",
                            })
                          : ""}
                        {edu.grade && ` · ${edu.grade}`}
                      </p>
                      {edu.description && (
                        <p className="mt-2 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                          {edu.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills */}
            {cv.skills && cv.skills.length > 0 && (
              <div className="mt-8">
                <h2 className="flex items-center gap-2 text-lg font-semibold text-zinc-900 dark:text-white">
                  <Wrench className="h-5 w-5 text-violet-600" />
                  Habilidades
                </h2>
                <div className="mt-4 flex flex-wrap gap-3">
                  {cv.skills.map((skill) => (
                    <div
                      key={skill.id}
                      className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2 dark:border-zinc-700 dark:bg-zinc-800"
                    >
                      <span className="text-sm font-medium text-zinc-900 dark:text-white">
                        {skill.name}
                      </span>
                      {skill.category && (
                        <span className="rounded-md bg-zinc-200 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400">
                          {skill.category}
                        </span>
                      )}
                      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
                        <div
                          className="h-full rounded-full bg-violet-600"
                          style={{ width: `${skill.proficiency}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Languages */}
            {cv.languages && cv.languages.length > 0 && (
              <div className="mt-8">
                <h2 className="flex items-center gap-2 text-lg font-semibold text-zinc-900 dark:text-white">
                  <Languages className="h-5 w-5 text-violet-600" />
                  Idiomas
                </h2>
                <div className="mt-4 flex flex-wrap gap-3">
                  {cv.languages.map((lang) => (
                    <div
                      key={lang.id}
                      className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2 dark:border-zinc-700 dark:bg-zinc-800"
                    >
                      <span className="text-sm font-medium text-zinc-900 dark:text-white">
                        {lang.name}
                      </span>
                      <span className="rounded-md bg-zinc-200 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400">
                        {proficiencyLabels[lang.proficiency] || lang.proficiency}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Template info */}
            {cv.cv_template && cv.cv_template.template && (
              <div className="mt-8 rounded-xl border border-violet-200 bg-violet-50 p-4 dark:border-violet-800 dark:bg-violet-950/50">
                <p className="text-sm text-violet-700 dark:text-violet-300">
                  Plantilla asignada:{" "}
                  <span className="font-semibold">
                    {cv.cv_template.template.name}
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
