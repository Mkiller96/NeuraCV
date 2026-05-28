"use client";

import { Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Experience, ExperiencePayload } from "@/lib/api/client";

interface EditExperienceFormProps {
  experiences: Experience[];
  newExperience: ExperiencePayload;
  onNewExperienceChange: (data: ExperiencePayload) => void;
  onAdd: () => void;
  onDelete: (id: number) => void;
}

export function EditExperienceForm({
  experiences,
  newExperience,
  onNewExperienceChange,
  onAdd,
  onDelete,
}: EditExperienceFormProps) {
  return (
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
              onClick={() => onDelete(exp.id)}
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
                onNewExperienceChange({ ...newExperience, company: e.target.value })
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
                onNewExperienceChange({ ...newExperience, position: e.target.value })
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
                onNewExperienceChange({ ...newExperience, start_date: e.target.value })
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
                onNewExperienceChange({ ...newExperience, end_date: e.target.value })
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
                onNewExperienceChange({
                  ...newExperience,
                  is_current: e.target.checked,
                  end_date: e.target.checked ? "" : newExperience.end_date,
                })
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
                onNewExperienceChange({ ...newExperience, location: e.target.value })
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
                onNewExperienceChange({ ...newExperience, description: e.target.value })
              }
              rows={3}
              className="mt-1 block w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white resize-y"
            />
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <Button onClick={onAdd} size="sm">
            <Plus className="h-4 w-4" />
            Añadir experiencia
          </Button>
        </div>
      </div>
    </div>
  );
}
