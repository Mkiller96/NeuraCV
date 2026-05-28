"use client";

import { Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Language, LanguagePayload } from "@/lib/api/client";

interface EditLanguagesFormProps {
  languages: Language[];
  newLanguage: LanguagePayload;
  onNewLanguageChange: (data: LanguagePayload) => void;
  onAdd: () => void;
  onDelete: (id: number) => void;
}

const proficiencyLabels: Record<string, string> = {
  basic: "Básico",
  intermediate: "Intermedio",
  advanced: "Avanzado",
  native: "Nativo",
};

export function EditLanguagesForm({
  languages,
  newLanguage,
  onNewLanguageChange,
  onAdd,
  onDelete,
}: EditLanguagesFormProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        {languages.map((lang) => (
          <div
            key={lang.id}
            className="group inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <span className="text-sm font-medium text-zinc-900 dark:text-white">
              {lang.name}
            </span>
            <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
              {proficiencyLabels[lang.proficiency] || lang.proficiency}
            </span>
            <button
              onClick={() => onDelete(lang.id)}
              className="ml-1 rounded-lg p-1 text-red-500 opacity-0 transition-opacity hover:bg-red-50 group-hover:opacity-100 dark:hover:bg-red-950/50"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
      <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-900">
        <h3 className="mb-4 font-semibold text-zinc-900 dark:text-white">
          Añadir idioma
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Idioma
            </label>
            <input
              value={newLanguage.name}
              onChange={(e) =>
                onNewLanguageChange({ ...newLanguage, name: e.target.value })
              }
              placeholder="Ej: Inglés, Francés"
              className="mt-1 block w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Nivel
            </label>
            <select
              value={newLanguage.proficiency}
              onChange={(e) =>
                onNewLanguageChange({
                  ...newLanguage,
                  proficiency: e.target.value as LanguagePayload["proficiency"],
                })
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
          <Button onClick={onAdd} size="sm">
            <Plus className="h-4 w-4" />
            Añadir idioma
          </Button>
        </div>
      </div>
    </div>
  );
}
