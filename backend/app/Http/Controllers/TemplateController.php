<?php

namespace App\Http\Controllers;

use App\Models\Template;
use Illuminate\Http\JsonResponse;

class TemplateController extends Controller
{
    public function index(): JsonResponse
    {
        $templates = Template::where('is_active', true)->get();

        return response()->json($templates);
    }

    public function show(Template $template): JsonResponse
    {
        if (! $template->is_active) {
            return response()->json(['message' => 'Template not found'], 404);
        }

        return response()->json($template);
    }
}
