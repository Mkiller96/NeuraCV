<?php

namespace App\Http\Controllers;

use App\Models\CV;
use App\Services\DeepseekService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

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
            'experiences.*.location' => 'nullable|string|max:255',

            'education' => 'nullable|array',
            'education.*.institution' => 'required_with:education|string|max:255',
            'education.*.degree' => 'required_with:education|string|max:255',
            'education.*.field_of_study' => 'nullable|string|max:255',
            'education.*.description' => 'nullable|string',
            'education.*.start_date' => 'required_with:education|string',
            'education.*.end_date' => 'nullable|string',
            'education.*.grade' => 'nullable|string|max:50',

            'skills' => 'nullable|array',
            'skills.*.name' => 'required_with:skills|string|max:255',

            'languages' => 'nullable|array',
            'languages.*.name' => 'required_with:languages|string|max:255',
            'languages.*.proficiency' => 'required_with:languages|string|in:basic,intermediate,advanced,native',
        ]);

        try {
            // Call Deepseek to generate/enhance the CV content
            $aiContent = $this->deepseek->generateCV($validated);

            // Create the CV with AI-generated content
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

            // Create experiences
            if (isset($aiContent['experiences'])) {
                foreach ($aiContent['experiences'] as $index => $exp) {
                    $cv->experiences()->create([
                        'company' => $exp['company'],
                        'position' => $exp['position'],
                        'description' => $exp['description'] ?? null,
                        'start_date' => $exp['start_date'],
                        'end_date' => $exp['end_date'] ?? null,
                        'is_current' => $exp['is_current'] ?? empty($exp['end_date']),
                        'location' => $exp['location'] ?? null,
                        'sort_order' => $index,
                    ]);
                }
            }

            // Create education
            if (isset($aiContent['education'])) {
                foreach ($aiContent['education'] as $index => $edu) {
                    $cv->education()->create([
                        'institution' => $edu['institution'],
                        'degree' => $edu['degree'],
                        'field_of_study' => $edu['field_of_study'] ?? null,
                        'description' => $edu['description'] ?? null,
                        'start_date' => $edu['start_date'],
                        'end_date' => $edu['end_date'] ?? null,
                        'is_current' => $edu['is_current'] ?? empty($edu['end_date']),
                        'grade' => $edu['grade'] ?? null,
                        'sort_order' => $index,
                    ]);
                }
            }

            // Create skills
            if (isset($aiContent['skills'])) {
                foreach ($aiContent['skills'] as $index => $skill) {
                    $cv->skills()->create([
                        'name' => $skill['name'],
                        'category' => $skill['category'] ?? null,
                        'proficiency' => $skill['proficiency'] ?? 50,
                        'sort_order' => $index,
                    ]);
                }
            }

            // Create languages
            if (isset($aiContent['languages'])) {
                foreach ($aiContent['languages'] as $index => $lang) {
                    $cv->languages()->create([
                        'name' => $lang['name'],
                        'proficiency' => $lang['proficiency'] ?? 'intermediate',
                        'sort_order' => $index,
                    ]);
                }
            }

            // Reload with relationships
            $cv->load(['experiences', 'education', 'skills', 'languages']);

            return response()->json([
                'message' => 'CV generado con IA exitosamente',
                'cv' => $cv,
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al generar el CV con IA',
                'error' => $e->getMessage(),
            ], 500);
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
            return response()->json([
                'message' => 'Error al mejorar el contenido',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
