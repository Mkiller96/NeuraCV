"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { type CV } from "@/lib/api/client";
import {
  FileText,
  Edit,
  Trash2,
  Calendar,
  Sparkles,
  Loader2,
} from "lucide-react";
import { useState } from "react";

interface CVCardProps {
  cv: CV;
  onDelete: (id: number) => Promise<void>;
}

export function CVCard({ cv, onDelete }: CVCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("¿Estás seguro de eliminar este CV? Esta acción no se puede deshacer.")) {
      return;
    }
    setIsDeleting(true);
    try {
      await onDelete(cv.id);
    } finally {
      setIsDeleting(false);
    }
  };

  const createdDate = new Date(cv.created_at).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 transition-all duration-200 hover:shadow-lg hover:border-violet-200 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-violet-800">
      {/* Gradient accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-600 to-indigo-600 opacity-0 transition-opacity group-hover:opacity-100" />

      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-100 to-indigo-100 dark:from-violet-950 dark:to-indigo-950">
            <FileText className="h-5 w-5 text-violet-600 dark:text-violet-400" />
          </div>
          <div>
            <h3 className="font-semibold text-zinc-900 dark:text-white">
              {cv.title}
            </h3>
            <p className="mt-0.5 text-sm text-zinc-600 dark:text-zinc-400">
              {cv.full_name}
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-4 flex flex-wrap gap-3">
        {cv.experiences && cv.experiences.length > 0 && (
          <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
            {cv.experiences.length} experiencias
          </span>
        )}
        {cv.skills && cv.skills.length > 0 && (
          <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
            {cv.skills.length} habilidades
          </span>
        )}
        {cv.cv_template && (
          <span className="inline-flex items-center gap-1 rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-medium text-violet-600 dark:bg-violet-950 dark:text-violet-400">
            <Sparkles className="h-3 w-3" />
            Con plantilla
          </span>
        )}
      </div>

      {/* Date */}
      <div className="mt-3 flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-500">
        <Calendar className="h-3.5 w-3.5" />
        Creado el {createdDate}
      </div>

      {/* Actions */}
      <div className="mt-4 flex items-center gap-2">
        <Link href={`/cvs/${cv.id}/edit`} className="flex-1">
          <Button variant="outline" size="sm" className="w-full">
            <Edit className="h-3.5 w-3.5" />
            Editar
          </Button>
        </Link>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDelete}
          disabled={isDeleting}
          className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950/50"
        >
          {isDeleting ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Trash2 className="h-3.5 w-3.5" />
          )}
        </Button>
      </div>
    </div>
  );
}
