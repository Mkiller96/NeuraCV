"use client";

import { Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Education, EducationPayload } from "@/lib/api/client";

interface EditEducationFormProps {
  education: Education[];
  newEducation: EducationPayload;
  onNewEducationChange: (data: EducationPayload) => void;
  onAdd: () => void;
  onDelete: (id: number) => void;
}

export function EditEducationForm({
  education,
  newEducation,
  onNewEducationChange,
  onAdd,
  onDelete,
}: EditEducationFormProps) {
  return (
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
              onClick={() => onDelete(edu.id)}
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
                onNewEducationChange({ ...newEducation, institution: e.target.value })
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
                onNewEducationChange({ ...newEducation, degree: e.target.value })
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
                onNewEducationChange({ ...newEducation, field_of_study: e.target.value })
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
                onNewEducationChange({ ...newEducation, grade: e.target.value })
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
                onNewEducationChange({ ...newEducation, start_date: e.target.value })
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
                onNewEducationChange({ ...newEducation, end_date: e.target.value })
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
                onNewEducationChange({
                  ...newEducation,
                  is_current: e.target.checked,
                  end_date: e.target.checked ? "" : newEducation.end_date,
                })
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
                onNewEducationChange({ ...newEducation, description: e.target.value })
              }
              rows={3}
              className="mt-1 block w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white resize-y"
            />
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <Button onClick={onAdd} size="sm">
            <Plus className="h-4 w-4" />
            Añadir educación
          </Button>
        </div>
      </div>
    </div>
  );
}
