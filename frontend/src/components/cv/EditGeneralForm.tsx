"use client";

import { Button } from "@/components/ui/button";
import { Save, Loader2 } from "lucide-react";

interface GeneralFormData {
  title: string;
  full_name: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  linkedin: string;
  github: string;
  professional_summary: string;
}

interface EditGeneralFormProps {
  formData: GeneralFormData;
  isSaving: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onSave: () => void;
}

export function EditGeneralForm({ formData, isSaving, onChange, onSave }: EditGeneralFormProps) {
  return (
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
            onChange={onChange}
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
            onChange={onChange}
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
            onChange={onChange}
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
            onChange={onChange}
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
            onChange={onChange}
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
            onChange={onChange}
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
            onChange={onChange}
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
            onChange={onChange}
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
            onChange={onChange}
            rows={5}
            className="mt-1.5 block w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white resize-y"
          />
        </div>
      </div>
      <div className="mt-6 flex justify-end">
        <Button onClick={onSave} disabled={isSaving}>
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Guardar cambios
        </Button>
      </div>
    </div>
  );
}
