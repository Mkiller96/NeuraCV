<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class DeepseekService
{
    protected string $apiKey;
    protected string $baseUrl = 'https://api.deepseek.com/v1';

    public function __construct()
    {
        $this->apiKey = config('services.deepseek.api_key');
    }

    /**
     * Generate a complete CV using Deepseek AI
     */
    public function generateCV(array $userData): array
    {
        $prompt = $this->buildCVPrompt($userData);

        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $this->apiKey,
            'Content-Type' => 'application/json',
        ])->post($this->baseUrl . '/chat/completions', [
            'model' => 'deepseek-chat',
            'messages' => [
                [
                    'role' => 'system',
                    'content' => 'Eres un asistente experto en creación de currículums vitae (CV). 
                    Genera contenido profesional, relevante y bien estructurado en español.
                    Siempre responde ÚNICAMENTE con JSON válido, sin markdown, sin explicaciones adicionales.
                    Asegúrate de que las fechas estén en formato Y-m (ej: 2020-03).'
                ],
                [
                    'role' => 'user',
                    'content' => $prompt
                ]
            ],
            'temperature' => 0.7,
            'max_tokens' => 4000,
        ]);

        if ($response->failed()) {
            Log::error('Deepseek API error: ' . $response->body());
            throw new \Exception('Error al comunicarse con la IA: ' . ($response->json('error.message') ?? 'Error desconocido'));
        }

        $content = $response->json('choices.0.message.content');

        // Clean the response - remove markdown code blocks if present
        $content = preg_replace('/^```(?:json)?\s*|\s*```$/i', '', trim($content));

        $generated = json_decode($content, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            Log::error('Deepseek: Invalid JSON response', ['content' => $content]);
            throw new \Exception('La IA devolvió una respuesta inválida. Intenta de nuevo.');
        }

        return $generated;
    }

    /**
     * Build the prompt for CV generation
     */
    protected function buildCVPrompt(array $data): string
    {
        $prompt = "Genera un currículum vitae profesional con la siguiente información del usuario:\n\n";

        $prompt .= "DATOS PERSONALES:\n";
        $prompt .= "- Nombre completo: {$data['full_name']}\n";
        $prompt .= "- Email: {$data['email']}\n";
        if (!empty($data['phone'])) $prompt .= "- Teléfono: {$data['phone']}\n";
        if (!empty($data['address'])) $prompt .= "- Dirección: {$data['address']}\n";
        if (!empty($data['website'])) $prompt .= "- Sitio web: {$data['website']}\n";
        if (!empty($data['linkedin'])) $prompt .= "- LinkedIn: {$data['linkedin']}\n";
        if (!empty($data['github'])) $prompt .= "- GitHub: {$data['github']}\n";

        if (!empty($data['professional_summary'])) {
            $prompt .= "\nRESUMEN PROFESIONAL (mejóralo si es necesario):\n{$data['professional_summary']}\n";
        }

        if (!empty($data['experiences'])) {
            $prompt .= "\nEXPERIENCIA LABORAL (mejora las descripciones y genera más si es apropiado):\n";
            foreach ($data['experiences'] as $exp) {
                $prompt .= "- Empresa: {$exp['company']}, Puesto: {$exp['position']}, ";
                $prompt .= "Desde: {$exp['start_date']}, ";
                $prompt .= !empty($exp['end_date']) ? "Hasta: {$exp['end_date']}" : "Actualidad";
                $prompt .= !empty($exp['description']) ? ", Descripción: {$exp['description']}" : "";
                $prompt .= "\n";
            }
        }

        if (!empty($data['education'])) {
            $prompt .= "\nEDUCACIÓN (mejora las descripciones):\n";
            foreach ($data['education'] as $edu) {
                $prompt .= "- Institución: {$edu['institution']}, Título: {$edu['degree']}, ";
                $prompt .= "Desde: {$edu['start_date']}, ";
                $prompt .= !empty($edu['end_date']) ? "Hasta: {$edu['end_date']}" : "Actualidad";
                $prompt .= "\n";
            }
        }

        if (!empty($data['skills'])) {
            $prompt .= "\nHABILIDADES (sugiere nivel de proficiencia 0-100 y categorías):\n";
            foreach ($data['skills'] as $skill) {
                $prompt .= "- {$skill['name']}\n";
            }
        }

        if (!empty($data['languages'])) {
            $prompt .= "\nIDIOMAS:\n";
            foreach ($data['languages'] as $lang) {
                $prompt .= "- {$lang['name']}: {$lang['proficiency']}\n";
            }
        }

        $prompt .= "\n\nDebes responder con un JSON con esta estructura EXACTA:
{
    \"professional_summary\": \"resumen profesional mejorado\",
    \"experiences\": [
        {
            \"company\": \"nombre empresa\",
            \"position\": \"puesto\",
            \"description\": \"descripción detallada y profesional\",
            \"start_date\": \"YYYY-MM\",
            \"end_date\": \"YYYY-MM\" o null,
            \"is_current\": false,
            \"location\": \"ciudad, país\"
        }
    ],
    \"education\": [
        {
            \"institution\": \"nombre institución\",
            \"degree\": \"título\",
            \"field_of_study\": \"campo de estudio\",
            \"description\": \"descripción\",
            \"start_date\": \"YYYY-MM\",
            \"end_date\": \"YYYY-MM\" o null,
            \"is_current\": false,
            \"grade\": \"calificación\" o null
        }
    ],
    \"skills\": [
        {
            \"name\": \"nombre habilidad\",
            \"category\": \"categoría\",
            \"proficiency\": 85
        }
    ],
    \"languages\": [
        {
            \"name\": \"idioma\",
            \"proficiency\": \"basic|intermediate|advanced|native\"
        }
    ]
}

IMPORTANTE: 
- Genera descripciones profesionales y detalladas en español.
- Si no se proporcionaron experiencias/educación, genera ejemplos relevantes basados en el perfil.
- Para habilidades, asigna niveles de proficiencia realistas (0-100).
- Para idiomas, usa solo: basic, intermediate, advanced, native.
- No incluyas campos que no estén en la estructura.
- Responde SOLO con el JSON, sin markdown ni texto adicional.";

        return $prompt;
    }

    /**
     * Improve an existing CV section using AI
     */
    public function improveSection(string $sectionType, string $content, ?string $context = null): string
    {
        $prompt = "Mejora y expande la siguiente sección de un currículum vitae.\n\n";
        $prompt .= "Sección: {$sectionType}\n";
        $prompt .= "Contenido actual:\n{$content}\n";
        
        if ($context) {
            $prompt .= "\nContexto adicional:\n{$context}\n";
        }

        $prompt .= "\n\nGenera una versión mejorada, más profesional y detallada. Responde solo con el texto mejorado, sin explicaciones adicionales.";

        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $this->apiKey,
            'Content-Type' => 'application/json',
        ])->post($this->baseUrl . '/chat/completions', [
            'model' => 'deepseek-chat',
            'messages' => [
                ['role' => 'system', 'content' => 'Eres un experto en redacción de currículums vitae. Mejora el contenido manteniendo profesionalismo y relevancia. Responde solo con el contenido mejorado.'],
                ['role' => 'user', 'content' => $prompt]
            ],
            'temperature' => 0.5,
            'max_tokens' => 2000,
        ]);

        if ($response->failed()) {
            Log::error('Deepseek API error (improve): ' . $response->body());
            throw new \Exception('Error al mejorar el contenido con IA');
        }

        return trim($response->json('choices.0.message.content'));
    }
}
