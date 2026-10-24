<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password as PasswordRule;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    public function login(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $validated['email'])->first();

        if (! $user || ! Hash::check($validated['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully']);
    }

    public function user(Request $request): JsonResponse
    {
        return response()->json($request->user());
    }

    public function forgotPassword(Request $request): JsonResponse
    {
        $validated = $request->validate(['email' => 'required|string|email|max:255']);

        $mailer = config('mail.default');
        $mailConfig = config("mail.mailers.{$mailer}", []);
        if (in_array($mailer, ['log', 'array'], true) || empty($mailConfig['host']) || $mailConfig['host'] === '127.0.0.1') {
            return response()->json(['message' => 'La recuperación por correo aún no está configurada.'], 503);
        }

        try {
            // Always return the same response to avoid exposing whether an account exists.
            Password::sendResetLink(['email' => $validated['email']]);
        } catch (\Throwable $exception) {
            Log::warning('Password reset email could not be sent', ['exception' => $exception::class]);

            return response()->json(['message' => 'No se pudo enviar el correo ahora. Inténtalo más tarde.'], 503);
        }

        return response()->json([
            'message' => 'Si existe una cuenta con ese correo, recibirás un enlace para restablecer tu contraseña.',
        ]);
    }

    public function resetPassword(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'token' => 'required|string',
            'email' => 'required|string|email|max:255',
            'password' => ['required', 'string', 'confirmed', PasswordRule::min(8)],
        ]);

        $status = Password::reset(
            $validated,
            function (User $user, string $password): void {
                $user->forceFill([
                    'password' => $password,
                    'remember_token' => Str::random(60),
                ])->save();

                // Revoke existing sessions after the credential changes.
                $user->tokens()->delete();
                event(new PasswordReset($user));
            }
        );

        if ($status !== Password::PASSWORD_RESET) {
            return response()->json([
                'message' => 'El enlace ha caducado o no es válido. Solicita uno nuevo.',
            ], 422);
        }

        return response()->json(['message' => 'Contraseña actualizada correctamente.']);
    }

    public function googleLogin(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'credential' => 'required|string',
        ]);

        $clientId = config('services.google.client_id');
        if (! $clientId) {
            return response()->json(['message' => 'El inicio de sesión con Google aún no está configurado.'], 503);
        }

        try {
            // Verify the Google token
            $response = Http::timeout(10)->get('https://oauth2.googleapis.com/tokeninfo', [
                'id_token' => $validated['credential'],
            ]);

            if (! $response->successful()) {
                return response()->json(['message' => 'Invalid Google credential'], 401);
            }

            $googleUser = $response->json();

            $validIssuer = in_array($googleUser['iss'] ?? null, [
                'accounts.google.com',
                'https://accounts.google.com',
            ], true);

            if (($googleUser['aud'] ?? null) !== $clientId
                || ! $validIssuer
                || (int) ($googleUser['exp'] ?? 0) <= time()
                || ! filter_var($googleUser['email_verified'] ?? false, FILTER_VALIDATE_BOOLEAN)
                || empty($googleUser['email'])) {
                return response()->json(['message' => 'Invalid Google credential'], 401);
            }

            // Find or create user
            $user = User::where('email', $googleUser['email'])->first();

            if (! $user) {
                $user = User::create([
                    'name' => $googleUser['name'] ?? $googleUser['email'],
                    'email' => $googleUser['email'],
                    'password' => Hash::make(Str::random(32)),
                    'email_verified_at' => now(),
                ]);
            }

            $token = $user->createToken('auth-token')->plainTextToken;

            return response()->json([
                'user' => $user,
                'token' => $token,
            ]);
        } catch (\Exception $e) {
            Log::warning('Google authentication failed', ['exception' => $e::class]);
            return response()->json(['message' => 'Failed to authenticate with Google'], 500);
        }
    }
}
