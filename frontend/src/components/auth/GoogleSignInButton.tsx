"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";

interface GoogleCredentialResponse {
  credential: string;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (options: {
            client_id: string;
            callback: (response: GoogleCredentialResponse) => void;
          }) => void;
          renderButton: (
            element: HTMLElement,
            options: Record<string, string | number | boolean>
          ) => void;
        };
      };
    };
  }
}

interface GoogleSignInButtonProps {
  onCredential: (credential: string) => void | Promise<void>;
}

const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

export function GoogleSignInButton({ onCredential }: GoogleSignInButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const callbackRef = useRef(onCredential);
  const [scriptError, setScriptError] = useState(false);

  useEffect(() => {
    callbackRef.current = onCredential;
  }, [onCredential]);

  const initializeGoogle = useCallback(() => {
    if (!googleClientId || !window.google || !containerRef.current) return;

    containerRef.current.replaceChildren();
    window.google.accounts.id.initialize({
      client_id: googleClientId,
      callback: ({ credential }) => {
        if (credential) void callbackRef.current(credential);
      },
    });
    window.google.accounts.id.renderButton(containerRef.current, {
      theme: "outline",
      size: "large",
      text: "continue_with",
      shape: "rectangular",
      width: 360,
      locale: "es",
    });
  }, []);

  if (!googleClientId) {
    return (
      <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
        El acceso con Google estará disponible cuando se configure.
      </p>
    );
  }

  return (
    <div className="flex min-h-10 justify-center">
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onReady={initializeGoogle}
        onError={() => setScriptError(true)}
      />
      <div ref={containerRef} />
      {scriptError && (
        <p className="text-center text-sm text-red-600" role="alert">
          No se pudo cargar el acceso con Google. Inténtalo de nuevo más tarde.
        </p>
      )}
    </div>
  );
}
