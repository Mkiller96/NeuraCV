import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-200/60 bg-white/80 backdrop-blur-xl dark:border-zinc-800/60 dark:bg-zinc-950/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold text-zinc-900 dark:text-white">
              Neura<span className="text-violet-600">CV</span>
            </span>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 pt-24 pb-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
            Términos y Condiciones
          </h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Última actualización: 28 de mayo de 2026
          </p>

          <div className="mt-8 space-y-8 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            <section>
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
                1. Aceptación de los Términos
              </h2>
              <p className="mt-3">
                Al acceder y utilizar NeuraCV ("la Plataforma"), aceptas cumplir con estos
                Términos y Condiciones. Si no estás de acuerdo con alguna parte, no debes
                utilizar nuestros servicios.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
                2. Descripción del Servicio
              </h2>
              <p className="mt-3">
                NeuraCV es una plataforma que permite a los usuarios crear currículums
                profesionales utilizando inteligencia artificial. Ofrecemos plantillas
                personalizables, sugerencias de contenido generadas por IA y herramientas
                de optimización para mejorar tus oportunidades laborales.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
                3. Registro y Cuenta
              </h2>
              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li>
                  Debes proporcionar información precisa, actualizada y completa durante
                  el proceso de registro.
                </li>
                <li>
                  Eres responsable de mantener la confidencialidad de tu contraseña y de
                  todas las actividades que ocurran bajo tu cuenta.
                </li>
                <li>
                  Debes notificarnos inmediatamente sobre cualquier uso no autorizado de
                  tu cuenta.
                </li>
                <li>
                  Nos reservamos el derecho de suspender o cancelar cuentas que violen
                  estos términos.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
                4. Uso de la Inteligencia Artificial
              </h2>
              <p className="mt-3">
                El contenido generado por IA se proporciona como sugerencia. Eres
                responsable de verificar la exactitud, relevancia y adecuación del
                contenido generado antes de su uso. NeuraCV no garantiza que el contenido
                generado por IA sea preciso, completo o libre de errores.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
                5. Propiedad Intelectual
              </h2>
              <p className="mt-3">
                El contenido que creas en NeuraCV te pertenece. No reclamamos propiedad
                sobre los CVs, datos personales o cualquier otro contenido que
                proporciones. Las plantillas, el diseño de la plataforma y la tecnología
                subyacente son propiedad de NeuraCV.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
                6. Privacidad y Protección de Datos
              </h2>
              <p className="mt-3">
                Tu privacidad es importante para nosotros. Consulta nuestra Política de
                Privacidad para entender cómo recopilamos, usamos y protegemos tus datos
                personales. Al utilizar NeuraCV, aceptas nuestras prácticas de
                privacidad.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
                7. Limitación de Responsabilidad
              </h2>
              <p className="mt-3">
                NeuraCV no será responsable por daños indirectos, incidentales o
                consecuentes derivados del uso o la imposibilidad de usar nuestros
                servicios. No garantizamos que el uso de nuestros servicios resulte en
                ofertas de empleo o entrevistas.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
                8. Modificaciones
              </h2>
              <p className="mt-3">
                Nos reservamos el derecho de modificar estos términos en cualquier
                momento. Te notificaremos sobre cambios significativos a través de la
                plataforma o por correo electrónico. El uso continuado después de las
                modificaciones constituye tu aceptación de los nuevos términos.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
                9. Contacto
              </h2>
              <p className="mt-3">
                Si tienes preguntas sobre estos Términos y Condiciones, puedes
                contactarnos en{" "}
                <a
                  href="mailto:support@neuracy.com"
                  className="text-violet-600 hover:text-violet-500 dark:text-violet-400"
                >
                  support@neuracy.com
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 bg-white py-8 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-zinc-500 dark:text-zinc-400">
          <p>&copy; {new Date().getFullYear()} NeuraCV. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
