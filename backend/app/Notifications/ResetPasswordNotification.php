<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ResetPasswordNotification extends Notification
{
    use Queueable;

    public function __construct(private readonly string $token) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $frontendUrl = rtrim((string) config('app.frontend_url', 'https://www.neurocv.net'), '/');
        $resetUrl = $frontendUrl.'/reset-password?'.http_build_query([
            'token' => $this->token,
            'email' => $notifiable->getEmailForPasswordReset(),
        ]);

        return (new MailMessage)
            ->subject('Restablece tu contraseña de NeuroCV')
            ->greeting('Hola,')
            ->line('Hemos recibido una solicitud para cambiar la contraseña de tu cuenta de NeuroCV.')
            ->action('Restablecer contraseña', $resetUrl)
            ->line('El enlace caduca en 60 minutos. Si no solicitaste este cambio, puedes ignorar este correo.');
    }
}
