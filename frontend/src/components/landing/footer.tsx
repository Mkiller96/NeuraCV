import { Sparkles } from "lucide-react";

const footerLinks = {
  product: {
    title: "Producto",
    links: [
      { label: "Características", href: "#features" },
      { label: "Precios", href: "#pricing" },
      { label: "Plantillas", href: "#" },
      { label: "API", href: "#" },
    ],
  },
  company: {
    title: "Compañía",
    links: [
      { label: "Sobre Nosotros", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Carreras", href: "#" },
      { label: "Contacto", href: "#" },
    ],
  },
  resources: {
    title: "Recursos",
    links: [
      { label: "Guía de CV", href: "#" },
      { label: "Consejos ATS", href: "#" },
      { label: "FAQ", href: "#" },
      { label: "Documentación", href: "#" },
    ],
  },
  legal: {
    title: "Legal",
    links: [
      { label: "Privacidad", href: "#" },
      { label: "Términos", href: "/terms" },
      { label: "Cookies", href: "#" },
    ],
  },
};

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-1">
            <a href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold text-zinc-900 dark:text-white">
                Neura<span className="text-violet-600">CV</span>
              </span>
            </a>
            <p className="mt-4 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              Crea CVs profesionales con IA. Consigue más entrevistas y avanza en tu carrera.
            </p>
          </div>

          {/* Links */}
          {Object.values(footerLinks).map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
                {group.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-16 border-t border-zinc-200 pt-8 dark:border-zinc-800">
          <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
            &copy; {new Date().getFullYear()} NeuraCV. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
