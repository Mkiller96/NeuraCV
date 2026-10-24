<?php

use App\Http\Controllers\AIController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CVController;
use App\Http\Controllers\TemplateController;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;

// Health check (sin verificación de DB ni Redis)
Route::get('/health', function () {
    try {
        DB::connection()->getPdo();

        return response()->json(['status' => 'ok', 'database' => 'connected', 'time' => now()]);
    } catch (\Throwable $exception) {
        return response()->json(['status' => 'error', 'database' => 'unavailable'], 503);
    }
});

// Public routes
Route::post('/register', [AuthController::class, 'register'])->middleware('throttle:5,1');
Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:10,1');
Route::post('/forgot-password', [AuthController::class, 'forgotPassword'])->middleware('throttle:5,1');
Route::post('/auth/google', [AuthController::class, 'googleLogin'])->middleware('throttle:10,1');

// Templates (public)
Route::get('/templates', [TemplateController::class, 'index']);
Route::get('/templates/{template}', [TemplateController::class, 'show']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    // CVs
    Route::apiResource('cvs', CVController::class);

    // AI - Generate CV with Deepseek
    Route::post('/cvs/generate-with-ai', [AIController::class, 'generateCV']);

    // AI - Improve section
    Route::post('/cvs/{cv}/improve-section', [AIController::class, 'improveSection']);

    // CV nested resources
    Route::prefix('cvs/{cv}')->group(function () {
        // Experiences
        Route::post('/experiences', [CVController::class, 'storeExperience']);
        Route::put('/experiences/{experience}', [CVController::class, 'updateExperience']);
        Route::delete('/experiences/{experience}', [CVController::class, 'destroyExperience']);

        // Education
        Route::post('/education', [CVController::class, 'storeEducation']);
        Route::put('/education/{education}', [CVController::class, 'updateEducation']);
        Route::delete('/education/{education}', [CVController::class, 'destroyEducation']);

        // Skills
        Route::post('/skills', [CVController::class, 'storeSkill']);
        Route::put('/skills/{skill}', [CVController::class, 'updateSkill']);
        Route::delete('/skills/{skill}', [CVController::class, 'destroySkill']);

        // Languages
        Route::post('/languages', [CVController::class, 'storeLanguage']);
        Route::put('/languages/{language}', [CVController::class, 'updateLanguage']);
        Route::delete('/languages/{language}', [CVController::class, 'destroyLanguage']);

        // Template assignment
        Route::post('/template', [CVController::class, 'assignTemplate']);
    });
});
