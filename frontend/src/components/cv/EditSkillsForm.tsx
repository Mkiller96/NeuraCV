"use client";

import { Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Skill, SkillPayload } from "@/lib/api/client";

interface EditSkillsFormProps {
  skills: Skill[];
  newSkill: SkillPayload;
  onNewSkillChange: (data: SkillPayload) => void;
  onAdd: () => void;
  onDelete: (id: number) => void;
}

export function EditSkillsForm({
  skills,
  newSkill,
  onNewSkillChange,
  onAdd,
  onDelete,
}: EditSkillsFormProps) {
  return (
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
              <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                {skill.category}
              </span>
            )}
            <div className="h-1.5 w-16 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
              <div
                className="h-full rounded-full bg-violet-600"
                style={{ width: `${skill.proficiency}%` }}
              />
            </div>
            <button
              onClick={() => onDelete(skill.id)}
              className="ml-1 rounded-lg p-1 text-red-500 opacity-0 transition-opacity hover:bg-red-50 group-hover:opacity-100 dark:hover:bg-red-950/50"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
      <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-900">
        <h3 className="mb-4 font-semibold text-zinc-900 dark:text-white">
          Añadir habilidad
        </h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Habilidad
            </label>
            <input
              value={newSkill.name}
              onChange={(e) =>
                onNewSkillChange({ ...newSkill, name: e.target.value })
              }
              placeholder="Ej: React, Python, Photoshop"
              className="mt-1 block w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Categoría
            </label>
            <input
              value={newSkill.category || ""}
              onChange={(e) =>
                onNewSkillChange({ ...newSkill, category: e.target.value })
              }
              placeholder="Ej: Frontend, Backend, Diseño"
              className="mt-1 block w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Nivel: {newSkill.proficiency}%
            </label>
            <input
              type="range"
              min={0}
              max={100}
              value={newSkill.proficiency}
              onChange={(e) =>
                onNewSkillChange({ ...newSkill, proficiency: Number(e.target.value) })
              }
              className="mt-2 block w-full accent-violet-600"
            />
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <Button onClick={onAdd} size="sm">
            <Plus className="h-4 w-4" />
            Añadir habilidad
          </Button>
        </div>
      </div>
    </div>
  );
}
