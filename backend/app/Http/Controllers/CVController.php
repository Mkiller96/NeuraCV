<?php

namespace App\Http\Controllers;

use App\Models\CV;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CVController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    public function index(Request $request): JsonResponse
    {
        $cvs = $request->user()->cvs()
            ->with(['experiences', 'education', 'skills', 'languages', 'cvTemplate.template'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($cvs);
    }

    public function store(Request $request): JsonResponse
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
        ]);

        $validated['user_id'] = $request->user()->id;

        $cv = CV::create($validated);

        return response()->json($cv, 201);
    }

    public function show(Request $request, CV $cv): JsonResponse
    {
        if ($cv->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $cv->load(['experiences', 'education', 'skills', 'languages', 'cvTemplate.template']);

        return response()->json($cv);
    }

    public function update(Request $request, CV $cv): JsonResponse
    {
        if ($cv->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'full_name' => 'sometimes|string|max:255',
            'email' => 'sometimes|string|email|max:255',
            'phone' => 'nullable|string|max:50',
            'address' => 'nullable|string|max:500',
            'website' => 'nullable|string|url|max:255',
            'linkedin' => 'nullable|string|max:255',
            'github' => 'nullable|string|max:255',
            'professional_summary' => 'nullable|string',
            'photo_url' => 'nullable|string|max:500',
        ]);

        $cv->update($validated);

        return response()->json($cv);
    }

    public function destroy(Request $request, CV $cv): JsonResponse
    {
        if ($cv->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $cv->delete();

        return response()->json(['message' => 'CV deleted successfully']);
    }

    // --- Experiences ---

    public function storeExperience(Request $request, CV $cv): JsonResponse
    {
        if ($cv->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $validated = $request->validate([
            'company' => 'required|string|max:255',
            'position' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'is_current' => 'boolean',
            'location' => 'nullable|string|max:255',
            'sort_order' => 'integer|min:0',
        ]);

        $validated['c_v_id'] = $cv->id;
        $experience = $cv->experiences()->create($validated);

        return response()->json($experience, 201);
    }

    public function updateExperience(Request $request, CV $cv, $experienceId): JsonResponse
    {
        if ($cv->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $experience = $cv->experiences()->findOrFail($experienceId);

        $validated = $request->validate([
            'company' => 'sometimes|string|max:255',
            'position' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'sometimes|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'is_current' => 'boolean',
            'location' => 'nullable|string|max:255',
            'sort_order' => 'integer|min:0',
        ]);

        $experience->update($validated);

        return response()->json($experience);
    }

    public function destroyExperience(Request $request, CV $cv, $experienceId): JsonResponse
    {
        if ($cv->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $experience = $cv->experiences()->findOrFail($experienceId);
        $experience->delete();

        return response()->json(['message' => 'Experience deleted successfully']);
    }

    // --- Education ---

    public function storeEducation(Request $request, CV $cv): JsonResponse
    {
        if ($cv->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $validated = $request->validate([
            'institution' => 'required|string|max:255',
            'degree' => 'required|string|max:255',
            'field_of_study' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'is_current' => 'boolean',
            'grade' => 'nullable|string|max:50',
            'sort_order' => 'integer|min:0',
        ]);

        $validated['c_v_id'] = $cv->id;
        $education = $cv->education()->create($validated);

        return response()->json($education, 201);
    }

    public function updateEducation(Request $request, CV $cv, $educationId): JsonResponse
    {
        if ($cv->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $education = $cv->education()->findOrFail($educationId);

        $validated = $request->validate([
            'institution' => 'sometimes|string|max:255',
            'degree' => 'sometimes|string|max:255',
            'field_of_study' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'sometimes|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'is_current' => 'boolean',
            'grade' => 'nullable|string|max:50',
            'sort_order' => 'integer|min:0',
        ]);

        $education->update($validated);

        return response()->json($education);
    }

    public function destroyEducation(Request $request, CV $cv, $educationId): JsonResponse
    {
        if ($cv->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $education = $cv->education()->findOrFail($educationId);
        $education->delete();

        return response()->json(['message' => 'Education deleted successfully']);
    }

    // --- Skills ---

    public function storeSkill(Request $request, CV $cv): JsonResponse
    {
        if ($cv->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'nullable|string|max:255',
            'proficiency' => 'integer|min:0|max:100',
            'sort_order' => 'integer|min:0',
        ]);

        $validated['c_v_id'] = $cv->id;
        $skill = $cv->skills()->create($validated);

        return response()->json($skill, 201);
    }

    public function updateSkill(Request $request, CV $cv, $skillId): JsonResponse
    {
        if ($cv->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $skill = $cv->skills()->findOrFail($skillId);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'category' => 'nullable|string|max:255',
            'proficiency' => 'integer|min:0|max:100',
            'sort_order' => 'integer|min:0',
        ]);

        $skill->update($validated);

        return response()->json($skill);
    }

    public function destroySkill(Request $request, CV $cv, $skillId): JsonResponse
    {
        if ($cv->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $skill = $cv->skills()->findOrFail($skillId);
        $skill->delete();

        return response()->json(['message' => 'Skill deleted successfully']);
    }

    // --- Languages ---

    public function storeLanguage(Request $request, CV $cv): JsonResponse
    {
        if ($cv->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'proficiency' => 'required|string|in:basic,intermediate,advanced,native',
            'sort_order' => 'integer|min:0',
        ]);

        $validated['c_v_id'] = $cv->id;
        $language = $cv->languages()->create($validated);

        return response()->json($language, 201);
    }

    public function updateLanguage(Request $request, CV $cv, $languageId): JsonResponse
    {
        if ($cv->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $language = $cv->languages()->findOrFail($languageId);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'proficiency' => 'sometimes|string|in:basic,intermediate,advanced,native',
            'sort_order' => 'integer|min:0',
        ]);

        $language->update($validated);

        return response()->json($language);
    }

    public function destroyLanguage(Request $request, CV $cv, $languageId): JsonResponse
    {
        if ($cv->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $language = $cv->languages()->findOrFail($languageId);
        $language->delete();

        return response()->json(['message' => 'Language deleted successfully']);
    }

    // --- Template Assignment ---

    public function assignTemplate(Request $request, CV $cv): JsonResponse
    {
        if ($cv->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $validated = $request->validate([
            'template_id' => 'required|exists:templates,id',
            'custom_colors' => 'nullable|array',
            'custom_colors.*' => 'string',
            'custom_fonts' => 'nullable|array',
            'custom_fonts.*' => 'string',
            'layout_style' => 'string|in:classic,modern,minimal,creative',
        ]);

        $cvTemplate = $cv->cvTemplate()->updateOrCreate(
            ['c_v_id' => $cv->id],
            $validated
        );

        $cvTemplate->load('template');

        return response()->json($cvTemplate);
    }
}
