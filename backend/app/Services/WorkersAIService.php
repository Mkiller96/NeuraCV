<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class WorkersAIService
{
    private string $accountId;
    private string $apiToken;
    private string $model;

    public function __construct()
    {
        $this->accountId = (string) config('services.workers_ai.account_id', '');
        $this->apiToken = (string) config('services.workers_ai.api_token', '');
        $this->model = (string) config('services.workers_ai.model', '@cf/meta/llama-3.1-8b-instruct');
    }

    /** Generate a CV while keeping user-provided facts unchanged. */
    public function generateCV(array $userData): array
    {
        $content = $this->complete(
            'Eres un asistente experto en creación de currículums vitae. Escribe en español profesional. '
            .'Responde únicamente con JSON válido, sin markdown ni texto adicional. No inventes datos.',
            $this->buildCVPrompt($userData),
            1800,
            0.2,
        );

        $content = preg_replace('/^\s*```(?:json)?\s*|\s*```\s*$/i', '', trim($content)) ?? trim($content);

        try {
            $generated = json_decode($content, true, 512, JSON_THROW_ON_ERROR);
        } catch (\JsonException $exception) {
            Log::warning('Workers AI returned invalid CV JSON');
            throw new WorkersAIException('La IA devolvió una respuesta no válida. Inténtalo de nuevo.', 502, $exception);
        }

        if (!is_array($generated)) {
            throw new WorkersAIException('La IA devolvió una respuesta no válida. Inténtalo de nuevo.');
        }

        $generated['professional_summary'] = is_string($generated['professional_summary'] ?? null)
            ? $generated['professional_summary']
            : ($userData['professional_summary'] ?? '');

        foreach (['experiences', 'education', 'skills', 'languages'] as $field) {
            $generated[$field] = is_array($generated[$field] ?? null) ? $generated[$field] : [];
        }

        return $generated;
    }

    /** Improve one CV section without saving over the user's version automatically. */
    public function improveSection(string $sectionType, string $content, ?string $context = null): string
    {
        $prompt = "Mejora la redacción de esta sección de un currículum en español. "
            .'Mantén exactamente los hechos aportados, no inventes información y responde solo con el texto mejorado.'
            ."\n\nSección: {$sectionType}\nContenido actual:\n{$content}";

        if ($context) {
            $prompt .= "\n\nContexto adicional:\n{$context}";
        }

        $improved = trim($this->complete(
            'Eres un experto en redacción de currículums. No inventes logros, cifras ni experiencia.',
            $prompt,
            700,
            0.2,
        ));

        if ($improved === '') {
            throw new WorkersAIException('La IA devolvió una respuesta vacía. Inténtalo de nuevo.');
        }

        return $improved;
    }

    private function complete(string $systemPrompt, string $userPrompt, int $maxTokens, float $temperature): string
    {
        if ($this->accountId === '' || $this->apiToken === '') {
            throw new WorkersAIException('La generación con IA aún no está configurada.', 503);
        }

        $url = sprintf(
            'https://api.cloudflare.com/client/v4/accounts/%s/ai/run/%s',
            rawurlencode($this->accountId),
            $this->model,
        );

        try {
            $response = Http::acceptJson()
                ->withToken($this->apiToken)
                ->timeout(45)
                ->post($url, [
                    'messages' => [
                        ['role' => 'system', 'content' => $systemPrompt],
                        ['role' => 'user', 'content' => $userPrompt],
                    ],
                    'temperature' => $temperature,
                    'max_tokens' => $maxTokens,
                ]);
        } catch (\Throwable $exception) {
            Log::warning('Workers AI request failed', ['exception_class' => $exception::class]);
            throw new WorkersAIException('La IA no está disponible temporalmente. Inténtalo de nuevo.', 503, $exception);
        }

        if (!$response->successful()) {
            Log::warning('Workers AI returned an error', ['status' => $response->status()]);

            if (in_array($response->status(), [401, 403, 429], true)) {
                throw new WorkersAIException(
                    'La IA no está disponible ahora o alcanzó el límite gratuito diario. Inténtalo más tarde.',
                    503,
                );
            }

            throw new WorkersAIException('No se pudo generar el contenido ahora. Inténtalo de nuevo.', 502);
        }

        $text = $response->json('result.response');

        if (!is_string($text) || trim($text) === '') {
            Log::warning('Workers AI returned an empty response');
            throw new WorkersAIException('La IA devolvió una respuesta vacía. Inténtalo de nuevo.');
        }

        return $text;
    }

    /** Build a prompt that explicitly preserves the facts and chronology supplied by the user. */
    protected function buildCVPrompt(array $data): string
    {
        $prompt = "Crea contenido para un currículum usando únicamente los datos proporcionados.\n\n";
        $prompt .= "Objetivo del CV: {$data['title']}\n";

        if (!empty($data['professional_summary'])) {
            $prompt .= "\nResumen profesional actual:\n{$data['professional_summary']}\n";
        }

        if (!empty($data['experiences'])) {
            $prompt .= "\nExperiencia laboral (mejora solo las descripciones; conserva empresa, puesto y fechas):\n";
            foreach ($data['experiences'] as $experience) {
                $prompt .= '- '.json_encode($experience, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES)."\n";
            }
        }

        if (!empty($data['education'])) {
            $prompt .= "\nEstudios (mejora solo las descripciones; conserva institución, título y fechas):\n";
            foreach ($data['education'] as $education) {
                $prompt .= '- '.json_encode($education, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES)."\n";
            }
        }

        if (!empty($data['skills'])) {
            $prompt .= "\nHabilidades aportadas (no añadas otras):\n";
            foreach ($data['skills'] as $skill) {
                $prompt .= '- '.json_encode($skill, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES)."\n";
            }
        }

        if (!empty($data['languages'])) {
            $prompt .= "\nIdiomas aportados (no añadas otros):\n";
            foreach ($data['languages'] as $language) {
                $prompt .= '- '.json_encode($language, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES)."\n";
            }
        }

        $prompt .= <<<'PROMPT'

Devuelve únicamente un JSON con esta estructura:
{
  "professional_summary": "resumen breve y profesional",
  "experiences": [{"description": "descripción mejorada"}],
  "education": [{"description": "descripción mejorada"}],
  "skills": [{"category": "categoría", "proficiency": 50}],
  "languages": []
}

Reglas: no inventes empleadores, puestos, fechas, estudios, certificaciones, idiomas, habilidades, cifras ni logros. Mantén el orden y los datos exactos del usuario. Si una sección no se proporcionó, devuelve un array vacío. Para habilidades usa solo las habilidades que el usuario ya indicó. No cambies el nombre, correo, teléfono ni fechas.
PROMPT;

        return $prompt;
    }
}
