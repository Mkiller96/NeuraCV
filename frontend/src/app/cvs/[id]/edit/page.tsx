"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthContext";
import {
  api,
  type CV,
  type Experience,
  type Education,
  type Skill,
  type Language,
  type Template,
  type ExperiencePayload,
  type EducationPayload,
  type SkillPayload,
  type LanguagePayload,
} from "@/lib/api/client";
import { DashboardNavbar } from "@/components/dashboard/DashboardNavbar";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  Briefcase,
  GraduationCap,
  Wrench,
  Globe,
  Palette,
  Brain,
  Star,
} from "lucide-react";

type Tab =
  | "general"
  | "experience"
  | "education"
  | "skills"
  | "languages"
  | "template"
  | "ai";

const tabs: { id: Tab; label: string }[] = [
  { id: "general", label: "General" },
  { id: "experience", label: "Experiencia" },
  { id: "education", label: "Educación" },
  { id: "skills", label: "Habilidades" },
  { id: "languages", label: "Idiomas" },
  { id: "template", label: "Plantilla" },
  { id: "ai", label: "Mejorar con IA" },
];

export default function EditCVPage() {
  const router = useRouter();
  const params = useParams();
  const cvId = Number(params.id);
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const [cv, setCv] = useState<CV | null>(null);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("general");

  // Form state
  const [formData, setFormData] = useState({
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

  // Nested resources
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);

  // New item forms
  const [newExperience, setNewExperience] = useState<ExperiencePayload>({
    company: "",
    position: "",
    description: "",
    start_date: "",
    end_date: "",
    is_current: false,
    location: "",
  });
  const [newEducation, setNewEducation] = useState<EducationPayload>({
    institution: "",
    degree: "",
    field_of_study: "",
    description: "",
    start_date: "",
    end_date: "",
    is_current: false,
    grade: "",
  });
  const [newSkill, setNewSkill] = useState<SkillPayload>({
    name: "",
    category: "",
    proficiency: 50,
  });
  const [newLanguage, setNewLanguage] = useState<LanguagePayload>({
    name: "",
    proficiency: "intermediate",
  });

  // Template assignment
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(null);
  const [layoutStyle, setLayoutStyle] = useState("modern");

  // AI
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSection, setAiSection] = useState<"professional_summary" | "experience_description" | "education_description">("professional_summary");
  const [aiContent, setAiContent] = useState("");
  const [aiContext, setAiContext] = useState("");
  const [aiResult, setAiResult] = useState("");

  const fetchCV = useCallback(async () => {
    try {
      const response = await api.getCV(cvId);
      setCv(response);
      setFormData({
        title: response.title,
        full_name: response.full_name,
        email: response.email,
        phone: response.phone || "",
        address: response.address || "",
        website: response.website || "",
        linkedin: response.linkedin || "",
        github: response.github || "",
        professional_summary: response.professional_summary || "",
      });
      setExperiences(response.experiences || []);
      setEducation(response.education || []);
      setSkills(response.skills || []);
      setLanguages(response.languages || []);
      if (response.cv_template) {
        setSelectedTemplateId(response.cv_template.template_id);
        setLayoutStyle(response.cv_template.layout_style || "modern");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar el CV");
    } finally {
      setIsLoading(false);
    }
  }, [cvId]);

  const fetchTemplates = useCallback(async () => {
    try {
      const response = await api.getTemplates();
      setTemplates(response);
    } catch {
      // Silently fail
    }
  }, []);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
      return;
    }
    if (isAuthenticated) {
      fetchCV();
      fetchTemplates();
    }
  }, [authLoading, isAuthenticated, router, fetchCV, fetchTemplates]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveGeneral = async () => {
    setIsSaving(true);
    setError("");
    setSuccess("");
    try {
      const updated = await api.updateCV(cvId, formData);
      setCv(updated);
      setSuccess("CV actualizado correctamente");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setIsSaving(false);
    }
  };

  // Experiences
  const handleAddExperience = async () => {
    if (!newExperience.company || !newExperience.position || !newExperience.start_date) return;
    try {
      const created = await api.storeExperience(cvId, newExperience);
      setExperiences((prev) => [...prev, created]);
      setNewExperience({
        company: "",
        position: "",
        description: "",
        start_date: "",
        end_date: "",
        is_current: false,
        location: "",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al añadir experiencia");
    }
  };

  const handleDeleteExperience = async (id: number) => {
    try {
      await api.deleteExperience(cvId, id);
      setExperiences((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al eliminar experiencia");
    }
  };

  // Education
  const handleAddEducation = async () => {
    if (!newEducation.institution || !newEducation.degree || !newEducation.start_date) return;
    try {
      const created = await api.storeEducation(cvId, newEducation);
      setEducation((prev) => [...prev, created]);
      setNewEducation({
        institution: "",
        degree: "",
        field_of_study: "",
        description: "",
        start_date: "",
        end_date: "",
        is_current: false,
        grade: "",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al añadir educación");
    }
  };

  const handleDeleteEducation = async (id: number) => {
    try {
      await api.deleteEducation(cvId, id);
      setEducation((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al eliminar educación");
    }
  };

  // Skills
  const handleAddSkill = async () => {
    if (!newSkill.name) return;
    try {
      const created = await api.storeSkill(cvId, newSkill);
      setSkills((prev) => [...prev, created]);
      setNewSkill({ name: "", category: "", proficiency: 50 });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al añadir habilidad");
    }
  };

  const handleDeleteSkill = async (id: number) => {
    try {
      await api.deleteSkill(cvId, id);
      setSkills((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al eliminar habilidad");
    }
  };

  // Languages
  const handleAddLanguage = async () => {
    if (!newLanguage.name) return;
    try {
      const created = await api.storeLanguage(cvId, newLanguage);
      setLanguages((prev) => [...prev, created]);
      setNewLanguage({ name: "", proficiency: "intermediate" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al añadir idioma");
    }
  };

  const handleDeleteLanguage = async (id: number) => {
    try {
      await api.deleteLanguage(cvId, id);
      setLanguages((prev) => prev.filter((l) => l.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al eliminar idioma");
    }
  };

  const handleSelectTemplate = (templateId: number) => {
    setSelectedTemplateId(templateId);
  };

  // Template
  const handleAssignTemplate = async () => {
    if (!selectedTemplateId) return;
    try {
      await api.assignTemplate(cvId, {
        template_id: selectedTemplateId,
        layout_style: layoutStyle,
      });
      setSuccess("Plantilla asignada correctamente");
      setTimeout(() => setSuccess(""), 3000);
      fetchCV();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al asignar plantilla");
    }
  };

  // AI
  const handleImproveWithAI = async () => {
    if (!aiContent) return;
    setAiLoading(true);
    setAiResult("");
    try {
      const response = await api.improveSection(cvId, {
        section: aiSection,
        content: aiContent,
        context: aiContext || undefined,
      });
      setAiResult(response.improved_content);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al mejorar con IA");
    } finally {
      setAiLoading(false);
    }
  };

  const applyAiResult = async () => {
    if (!aiResult) return;
    if (aiSection === "professional_summary") {
      setFormData((prev) => ({ ...prev, professional_summary: aiResult }));
      await api.updateCV(cvId, { professional_summary: aiResult });
    }
    setSuccess("Contenido mejorado aplicado correctamente");
    setTimeout(() => setSuccess(""), 3000);
    setAiResult("");
    setAiContent("");
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

  if (!cv) {
    return (
      <div className="flex min-h-screen flex-col">
        <DashboardNavbar />
        <main className="flex-1 pt-16">
          <div className="mx-auto max-w-3xl px-4 py-8 text-center">
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
              CV no encontrado
            </h1>
            <Link href="/dashboard">
              <Button className="mt-4">Volver al dashboard</Button>
            </Link>
          </div>
        </main>
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
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1 text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver
              </Link>
              <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-700" />
              <h1 className="text-xl font-bold text-zinc-900 dark:text-white">
                {cv.title}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Link href={`/cvs/${cvId}/preview`}>
                <Button variant="outline" size="sm">
                  Vista previa
                </Button>
              </Link>
              <Button size="sm" onClick={handleSaveGeneral} disabled={isSaving}>
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Guardar
              </Button>
            </div>
          </div>

          {/* Messages */}
          {success && (
            <div className="mt-4 rounded-lg bg-emerald-50 p-4 text-sm text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
              {success}
            </div>
          )}
          {error && (
            <div className="mt-4 rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-950/50 dark:text-red-400">
              {error}
            </div>
          )}

          {/* Tabs */}
          <div className="mt-6 border-b border-zinc-200 dark:border-zinc-800">
            <nav className="-mb-px flex gap-0 overflow-x-auto">
              {tabs.map((tab) => {
                const icons: Record<string, React.ReactNode> = {
                  general: <Briefcase className="h-4 w-4" />,
                  experience: <Briefcase className="h-4 w-4" />,
                  education: <GraduationCap className="h-4 w-4" />,
                  skills: <Wrench className="h-4 w-4" />,
                  languages: <Globe className="h-4 w-4" />,
                  template: <Palette className="h-4 w-4" />,
                  ai: <Brain className="h-4 w-4" />,
                };
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setError("");
                      setSuccess("");
                    }}
                    className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? "border-violet-600 text-violet-600 dark:border-violet-400 dark:text-violet-400"
                        : "border-transparent text-zinc-500 hover:border-zinc-300 hover:text-zinc-700 dark:hover:border-zinc-700 dark:hover:text-zinc-300"
                    }`}
                  >
                    {icons[tab.id]}
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="mt-6">
            {/* General */}
            {activeTab === "general" && (
              <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
                  Información General
                </h2>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  Datos básicos de tu CV
                </p>
                <div className="mt-6 grid gap-6 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      Título del CV
                    </label>
                    <input
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="mt-1.5 block w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      Nombre completo
                    </label>
                    <input
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      className="mt-1.5 block w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      Email
                    </label>
                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="mt-1.5 block w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      Teléfono
                    </label>
                    <input
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="mt-1.5 block w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      Sitio web
                    </label>
                    <input
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      className="mt-1.5 block w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      LinkedIn
                    </label>
                    <input
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleChange}
                      className="mt-1.5 block w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      GitHub
                    </label>
                    <input
                      name="github"
                      value={formData.github}
                      onChange={handleChange}
                      className="mt-1.5 block w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      Dirección
                    </label>
                    <input
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="mt-1.5 block w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      Resumen profesional
                    </label>
                    <textarea
                      name="professional_summary"
                      value={formData.professional_summary}
                      onChange={handleChange}
                      rows={5}
                      className="mt-1.5 block w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white resize-y"
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <Button onClick={handleSaveGeneral} disabled={isSaving}>
                    {isSaving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    Guardar cambios
                  </Button>
                </div>
              </div>
            )}

            {/* Experience */}
            {activeTab === "experience" && (
              <div className="space-y-6">
                {experiences.map((exp) => (
                  <div
                    key={exp.id}
                    className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-zinc-900 dark:text-white">
                          {exp.position}
                        </h3>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                          {exp.company}
                          {exp.location && ` - ${exp.location}`}
                        </p>
                        <p className="mt-1 text-xs text-zinc-500">
                          {exp.start_date} - {exp.is_current ? "Actualidad" : exp.end_date}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteExperience(exp.id)}
                        className="rounded-lg p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    {exp.description && (
                      <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
                        {exp.description}
                      </p>
                    )}
                  </div>
                ))}
                <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-900">
                  <h3 className="mb-4 font-semibold text-zinc-900 dark:text-white">
                    Añadir experiencia
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Empresa
                      </label>
                      <input
                        value={newExperience.company}
                        onChange={(e) =>
                          setNewExperience((prev) => ({ ...prev, company: e.target.value }))
                        }
                        className="mt-1 block w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Puesto
                      </label>
                      <input
                        value={newExperience.position}
                        onChange={(e) =>
                          setNewExperience((prev) => ({ ...prev, position: e.target.value }))
                        }
                        className="mt-1 block w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Fecha inicio
                      </label>
                      <input
                        type="date"
                        value={newExperience.start_date}
                        onChange={(e) =>
                          setNewExperience((prev) => ({ ...prev, start_date: e.target.value }))
                        }
                        className="mt-1 block w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Fecha fin
                      </label>
                      <input
                        type="date"
                        value={newExperience.end_date || ""}
                        disabled={newExperience.is_current}
                        onChange={(e) =>
                          setNewExperience((prev) => ({ ...prev, end_date: e.target.value }))
                        }
                        className="mt-1 block w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="is_current_exp"
                        checked={newExperience.is_current || false}
                        onChange={(e) =>
                          setNewExperience((prev) => ({
                            ...prev,
                            is_current: e.target.checked,
                            end_date: e.target.checked ? "" : prev.end_date,
                          }))
                        }
                        className="h-4 w-4 rounded border-zinc-300 text-violet-600 focus:ring-violet-500"
                      />
                      <label htmlFor="is_current_exp" className="text-sm text-zinc-600 dark:text-zinc-400">
                        Trabajo actual
                      </label>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Ubicación
                      </label>
                      <input
                        value={newExperience.location || ""}
                        onChange={(e) =>
                          setNewExperience((prev) => ({ ...prev, location: e.target.value }))
                        }
                        className="mt-1 block w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Descripción
                      </label>
                      <textarea
                        value={newExperience.description || ""}
                        onChange={(e) =>
                          setNewExperience((prev) => ({ ...prev, description: e.target.value }))
                        }
                        rows={3}
                        className="mt-1 block w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white resize-y"
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button onClick={handleAddExperience} size="sm">
                      <Plus className="h-4 w-4" />
                      Añadir experiencia
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Education */}
            {activeTab === "education" && (
              <div className="space-y-6">
                {education.map((edu) => (
                  <div
                    key={edu.id}
                    className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-zinc-900 dark:text-white">
                          {edu.degree} en {edu.field_of_study}
                        </h3>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                          {edu.institution}
                        </p>
                        <p className="mt-1 text-xs text-zinc-500">
                          {edu.start_date} - {edu.is_current ? "Actualidad" : edu.end_date}
                          {edu.grade && ` · ${edu.grade}`}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteEducation(edu.id)}
                        className="rounded-lg p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    {edu.description && (
                      <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
                        {edu.description}
                      </p>
                    )}
                  </div>
                ))}
                <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-900">
                  <h3 className="mb-4 font-semibold text-zinc-900 dark:text-white">
                    Añadir educación
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Institución
                      </label>
                      <input
                        value={newEducation.institution}
                        onChange={(e) =>
                          setNewEducation((prev) => ({ ...prev, institution: e.target.value }))
                        }
                        className="mt-1 block w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Título
                      </label>
                      <input
                        value={newEducation.degree}
                        onChange={(e) =>
                          setNewEducation((prev) => ({ ...prev, degree: e.target.value }))
                        }
                        className="mt-1 block w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Campo de estudio
                      </label>
                      <input
                        value={newEducation.field_of_study || ""}
                        onChange={(e) =>
                          setNewEducation((prev) => ({ ...prev, field_of_study: e.target.value }))
                        }
                        className="mt-1 block w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Nota
                      </label>
                      <input
                        value={newEducation.grade || ""}
                        onChange={(e) =>
                          setNewEducation((prev) => ({ ...prev, grade: e.target.value }))
                        }
                        className="mt-1 block w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Fecha inicio
                      </label>
                      <input
                        type="date"
                        value={newEducation.start_date}
                        onChange={(e) =>
                          setNewEducation((prev) => ({ ...prev, start_date: e.target.value }))
                        }
                        className="mt-1 block w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Fecha fin
                      </label>
                      <input
                        type="date"
                        value={newEducation.end_date || ""}
                        disabled={newEducation.is_current}
                        onChange={(e) =>
                          setNewEducation((prev) => ({ ...prev, end_date: e.target.value }))
                        }
                        className="mt-1 block w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="is_current_edu"
                        checked={newEducation.is_current || false}
                        onChange={(e) =>
                          setNewEducation((prev) => ({
                            ...prev,
                            is_current: e.target.checked,
                            end_date: e.target.checked ? "" : prev.end_date,
                          }))
                        }
                        className="h-4 w-4 rounded border-zinc-300 text-violet-600 focus:ring-violet-500"
                      />
                      <label htmlFor="is_current_edu" className="text-sm text-zinc-600 dark:text-zinc-400">
                        En curso
                      </label>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Descripción
                      </label>
                      <textarea
                        value={newEducation.description || ""}
                        onChange={(e) =>
                          setNewEducation((prev) => ({ ...prev, description: e.target.value }))
                        }
                        rows={3}
                        className="mt-1 block w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white resize-y"
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button onClick={handleAddEducation} size="sm">
                      <Plus className="h-4 w-4" />
                      Añadir educación
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Skills */}
            {activeTab === "skills" && (
              <div className="space-y-6">
                <div className="flex flex-wrap gap-3">
                  {skills.map((skill) => (
                    <div
                      key={skill.id}
                      className="group inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2 dark:border-zinc-800 dark:bg-zinc-900"
                    >
                      <span className="text-sm font-medium text-zinc-900 dark:text-white">
                        {skill.name}
                      </span>
                      {skill.category && (
                        <span className="text-xs text-zinc-400">{skill.category}</span>
                      )}
                      <button
                        onClick={() => handleDeleteSkill(skill.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="h-3.5 w-3.5 text-red-400 hover:text-red-600" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add Skill Form */}
                <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-white mb-4">
                    Añadir habilidad
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400">
                        Nombre
                      </label>
                      <input
                        value={newSkill.name}
                        onChange={(e) =>
                          setNewSkill((prev) => ({ ...prev, name: e.target.value }))
                        }
                        className="mt-1 block w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400">
                        Categoría
                      </label>
                      <input
                        value={newSkill.category || ""}
                        onChange={(e) =>
                          setNewSkill((prev) => ({ ...prev, category: e.target.value }))
                        }
                        className="mt-1 block w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400">
                        Nivel (1-100)
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={100}
                        value={newSkill.proficiency || 50}
                        onChange={(e) =>
                          setNewSkill((prev) => ({ ...prev, proficiency: parseInt(e.target.value) || 50 }))
                        }
                        className="mt-1 block w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button onClick={handleAddSkill} size="sm">
                      <Plus className="h-4 w-4" />
                      Añadir habilidad
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Languages */}
            {activeTab === "languages" && (
              <div className="space-y-6">
                <div className="flex flex-wrap gap-3">
                  {languages.map((language) => (
                    <div
                      key={language.id}
                      className="group inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2 dark:border-zinc-800 dark:bg-zinc-900"
                    >
                      <span className="text-sm font-medium text-zinc-900 dark:text-white">
                        {language.name}
                      </span>
                      <span className="text-xs text-zinc-400">{language.proficiency}</span>
                      <button
                        onClick={() => handleDeleteLanguage(language.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="h-3.5 w-3.5 text-red-400 hover:text-red-600" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add Language Form */}
                <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-white mb-4">
                    Añadir idioma
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400">
                        Idioma
                      </label>
                      <input
                        value={newLanguage.name}
                        onChange={(e) =>
                          setNewLanguage((prev) => ({ ...prev, name: e.target.value }))
                        }
                        className="mt-1 block w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400">
                        Nivel
                      </label>
                      <select
                        value={newLanguage.proficiency}
                        onChange={(e) =>
                          setNewLanguage((prev) => ({
                            ...prev,
                            proficiency: e.target.value as LanguagePayload["proficiency"],
                          }))
                        }
                        className="mt-1 block w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                      >
                        <option value="basic">Básico</option>
                        <option value="intermediate">Intermedio</option>
                        <option value="advanced">Avanzado</option>
                        <option value="native">Nativo</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button onClick={handleAddLanguage} size="sm">
                      <Plus className="h-4 w-4" />
                      Añadir idioma
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Template */}
            {activeTab === "template" && (
              <div className="space-y-6">
                <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-white mb-4">
                    Seleccionar plantilla
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {templates.map((template) => (
                      <div
                        key={template.id}
                        onClick={() => handleSelectTemplate(template.id)}
                        className={`cursor-pointer rounded-xl border-2 p-4 transition-all hover:shadow-md ${
                          selectedTemplateId === template.id
                            ? "border-violet-500 bg-violet-50 dark:bg-violet-900/20"
                            : "border-zinc-200 dark:border-zinc-700"
                        }`}
                      >
                        <div className="aspect-[210/297] mb-3 rounded-lg bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-700 dark:to-zinc-800" />
                        <h4 className="text-sm font-medium text-zinc-900 dark:text-white">
                          {template.name}
                        </h4>
                        {template.is_premium && (
                          <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                            <Star className="h-3 w-3" />
                            Premium
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* AI */}
            {activeTab === "ai" && (
              <div className="space-y-6">
                <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-white mb-2 flex items-center gap-2">
                    <Brain className="h-4 w-4 text-violet-500" />
                    Mejorar con IA
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">
                    Usa inteligencia artificial para mejorar el contenido de tu CV.
                  </p>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                        Sección a mejorar
                      </label>
                      <select
                        value={aiSection}
                        onChange={(e) => setAiSection(e.target.value as typeof aiSection)}
                        className="block w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                      >
                        <option value="professional_summary">Resumen profesional</option>
                        <option value="experience_description">Descripción de experiencia</option>
                        <option value="education_description">Descripción de educación</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                        Contenido actual
                      </label>
                      <textarea
                        value={aiContent}
                        onChange={(e) => setAiContent(e.target.value)}
                        rows={4}
                        className="block w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white resize-y"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                        Contexto adicional (opcional)
                      </label>
                      <textarea
                        value={aiContext}
                        onChange={(e) => setAiContext(e.target.value)}
                        rows={2}
                        placeholder="Ej: Busco trabajo como desarrollador senior..."
                        className="block w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white resize-y"
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button
                        onClick={handleImproveWithAI}
                        disabled={aiLoading || !aiContent}
                      >
                        {aiLoading ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Mejorando...
                          </>
                        ) : (
                          <>
                            <Brain className="h-4 w-4" />
                            Mejorar con IA
                          </>
                        )}
                      </Button>
                    </div>
                    {aiResult && (
                      <div className="rounded-xl border border-violet-200 bg-violet-50 p-4 dark:border-violet-800 dark:bg-violet-900/20">
                        <h4 className="text-xs font-semibold text-violet-700 dark:text-violet-300 mb-2">
                          Resultado
                        </h4>
                        <p className="text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">
                          {aiResult}
                        </p>
                        <div className="mt-3 flex justify-end">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              if (aiSection === "professional_summary") {
                                setFormData((prev) => ({ ...prev, professional_summary: aiResult }));
                              }
                              setAiResult("");
                            }}
                          >
                            Aplicar cambios
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
