<?php

namespace App\Http\Controllers;

use App\Models\CV;
use App\Services\DeepseekService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AIController extends Controller
{
    public function __construct(
        protected DeepseekService $deepseek
    ) {}

    /**
     * Generate a complete CV using AI
     * POST /api/cvs/generate-with-ai
     */
    public function generateCV(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'full_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255',
            'phone' => 'nullable|string|max:50',
            'address' => 'nullable|string|max:500',
            'website' => 'nullable|string|url|max:255',
            'linkedin' => 'nullable|string|max:255',
            'github' => 'nullable|string|max:255',
            'professional_summary' => 'nullable|string',
            'photo_url' => 'nullable|string|max:500',

            // Optional: provide base info for AI to improve
            'experiences' => 'nullable|array',
            'experiences.*.company' => 'required_with:experiences|string|max:255',
            'experiences.*.position' => 'required_with:experiences|string|max:255',
            'experiences.*.description' => 'nullable|string',
            'experiences.*.start_date' => 'required_with:experiences|string',
            'experiences.*.end_date' => 'nullable|string',
            'experiences.*.is_current' => 'sometimes|boolean',
            'experiences.*.location' => 'nullable|string|max:255',

            'education' => 'nullable|array',
            'education.*.institution' => 'required_with:education|string|max:255',
            'education.*.degree' => 'required_with:education|string|max:255',
            'education.*.field_of_study' => 'nullable|string|max:255',
            'education.*.description' => 'nullable|string',
            'education.*.start_date' => 'required_with:education|string',
            'education.*.end_date' => 'nullable|string',
            'education.*.is_current' => 'sometimes|boolean',
            'education.*.grade' => 'nullable|string|max:50',

            'skills' => 'nullable|array',
            'skills.*.name' => 'required_with:skills|string|max:255',
            'skills.*.category' => 'nullable|string|max:255',
            'skills.*.proficiency' => 'sometimes|integer|min:0|max:100',

            'languages' => 'nullable|array',
            'languages.*.name' => 'required_with:languages|string|max:255',
            'languages.*.proficiency' => 'required_with:languages|string|in:basic,intermediate,advanced,native',
        ]);

        try {
            // Call Deepseek to generate/enhance the CV content
            $aiContent = $this->deepseek->generateCV($validated);

            // Create the CV with AI-generated content
            $cv = DB::transaction(function () use ($request, $validated, $aiContent) {
                $cv = CV::create([
                    'user_id' => $request->user()->id,
                    'title' => $validated['title'],
                    'full_name' => $validated['full_name'],
                    'email' => $validated['email'],
                    'phone' => $validated['phone'] ?? null,
                    'address' => $validated['address'] ?? null,
                    'website' => $validated['website'] ?? null,
                    'linkedin' => $validated['linkedin'] ?? null,
                    'github' => $validated['github'] ?? null,
                    'professional_summary' => $aiContent['professional_summary'] ?? $validated['professional_summary'] ?? null,
                    'photo_url' => $validated['photo_url'] ?? null,
                ]);

                // Keep factual details supplied by the user; AI only rewrites descriptions.
                foreach ($validated['experiences'] ?? [] as $index => $provided) {
                    $exp = $aiContent['experiences'][$index] ?? [];
                    $cv->experiences()->create([
                        'company' => $provided['company'],
                        'position' => $provided['position'],
                        'description' => $exp['description'] ?? $provided['description'] ?? null,
                        'start_date' => $this->formatDate($provided['start_date']),
                        'end_date' => empty($provided['end_date']) ? null : $this->formatDate($provided['end_date']),
                        'is_current' => $provided['is_current'] ?? empty($provided['end_date']),
                        'location' => $provided['location'] ?? null,
                        'sort_order' => $index,
                    ]);
                }

                foreach ($validated['education'] ?? [] as $index => $provided) {
                    $edu = $aiContent['education'][$index] ?? [];
                    $cv->education()->create([
                        'institution' => $provided['institution'],
                        'degree' => $provided['degree'],
                        'field_of_study' => $provided['field_of_study'] ?? null,
                        'description' => $edu['description'] ?? $provided['description'] ?? null,
                        'start_date' => $this->formatDate($provided['start_date']),
                        'end_date' => empty($provided['end_date']) ? null : $this->formatDate($provided['end_date']),
                        'is_current' => $provided['is_current'] ?? empty($provided['end_date']),
                        'grade' => $provided['grade'] ?? null,
                        'sort_order' => $index,
                    ]);
                }

                foreach ($validated['skills'] ?? [] as $index => $provided) {
                    $skill = $aiContent['skills'][$index] ?? [];
                    $cv->skills()->create([
                        'name' => $provided['name'],
                        'category' => $skill['category'] ?? $provided['category'] ?? null,
                        'proficiency' => $skill['proficiency'] ?? $provided['proficiency'] ?? 50,
                        'sort_order' => $index,
                    ]);
                }

                foreach ($validated['languages'] ?? [] as $index => $provided) {
                    $cv->languages()->create([
                        'name' => $provided['name'],
                        'proficiency' => $provided['proficiency'],
                        'sort_order' => $index,
                    ]);
                }

                $cv->load(['experiences', 'education', 'skills', 'languages']);
                return $cv;
            });

            return response()->json([
                'message' => 'CV generado con IA exitosamente',
                'cv' => $cv,
            ], 201);

        } catch (\Exception $e) {
            Log::error('CV generation failed', ['exception_class' => $e::class]);
            $status = str_contains($e->getMessage(), 'aún no está configurada') ? 503 : 502;
            return response()->json([
                'message' => $status === 503
                    ? 'La generación con IA aún no está configurada.'
                    : 'No se pudo generar el CV ahora. Inténtalo de nuevo.',
            ], $status);
        }
    }

    /**
     * Improve a specific section of an existing CV
     * POST /api/cvs/{cv}/improve-section
     */
    public function improveSection(Request $request, CV $cv): JsonResponse
    {
        if ($cv->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $validated = $request->validate([
            'section' => 'required|string|in:professional_summary,experience_description,education_description',
            'content' => 'required|string',
            'context' => 'nullable|string',
        ]);

        try {
            $improved = $this->deepseek->improveSection(
                $validated['section'],
                $validated['content'],
                $validated['context'] ?? null
            );

            return response()->json([
                'message' => 'Contenido mejorado exitosamente',
                'improved_content' => $improved,
            ]);

        } catch (\Exception $e) {
            Log::error('CV section improvement failed', ['exception_class' => $e::class]);
            $status = str_contains($e->getMessage(), 'aún no está configurada') ? 503 : 502;
            return response()->json([
                'message' => $status === 503
                    ? 'La generación con IA aún no está configurada.'
                    : 'No se pudo mejorar el contenido ahora. Inténtalo de nuevo.',
            ], $status);
        }
    }

    private function formatDate(string $date): string
    {
        return preg_match('/^\d{4}-\d{2}$/', $date) ? $date . '-01' : $date;
    }
}
