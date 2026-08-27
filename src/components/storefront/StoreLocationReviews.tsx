import { ExternalLink, MapPin, Navigation, Phone, Star } from "lucide-react";
import {
  OFFICIAL_STORE_MAP_EMBED_URL,
  OFFICIAL_STORE_MAP_URL,
  OFFICIAL_STORE_PHONE_FORMATTED,
} from "@/lib/utils";

const reviews = [
  {
    author: "Hery Meza",
    text: "Excelente ferretería, encuentras toda la línea de protectores Exceline.",
  },
  {
    author: "Hery Meza",
    text: "Excelente ferretería: puedes conseguir todo a excelente precio, distribuidor de los protectores Exceline.",
  },
  {
    author: "ynht.0101",
    text: "\u{1F525} \u{1F525} \u{1F525} \u{1F525} \u{1F525} tremendo equipo !!!!",
    metadata: "59 sem · 2 Me gusta · Responder",
  },
];

function FiveStars() {
  return (
    <span className="inline-flex gap-0.5 text-orange-500" aria-label="5 estrellas">
      {Array.from({ length: 5 }, (_, index) => (
        <Star key={index} className="h-4 w-4 fill-current" aria-hidden="true" />
      ))}
    </span>
  );
}

export function StoreLocationReviews() {
  return (
    <section className="border-t border-slate-200 bg-white py-14 dark:border-slate-800 dark:bg-slate-900 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-5 border-b border-slate-200 pb-8 dark:border-slate-800 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <p className="mb-3 flex items-center gap-3 text-xs font-extrabold uppercase tracking-[0.14em] text-orange-700 dark:text-orange-400">
              <span className="h-1 w-8 bg-orange-500" aria-hidden="true" />
              Visítanos y conócenos
            </p>
            <h2 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white sm:text-3xl">
              Ferreteria Multiogar en Cúa
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
              Encuentra el local, consulta la ruta y revisa algunas opiniones públicas compartidas en Google Maps.
            </p>
          </div>
          <a
            href={OFFICIAL_STORE_MAP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 bg-blue-700 px-5 py-3 text-sm font-extrabold text-white transition-colors hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            Abrir en Google Maps
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="overflow-hidden border-4 border-orange-500 bg-slate-100 shadow-sm dark:bg-slate-950">
            <iframe
              title="Ubicación de Ferreteria Multiogar en Cúa, Miranda"
              src={OFFICIAL_STORE_MAP_EMBED_URL}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-72 w-full border-0 sm:h-96"
            />
          </div>

          <div className="flex flex-col justify-between gap-7">
            <div>
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-orange-600" aria-hidden="true" />
                <div>
                  <h3 className="text-base font-black text-slate-950 dark:text-white">Ubicación y contacto</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    Cúa 1211, Miranda, Venezuela
                  </p>
                  <a
                    href={`tel:${OFFICIAL_STORE_PHONE_FORMATTED.replace(/\s/g, "")}`}
                    className="mt-2 inline-flex items-center gap-2 text-sm font-extrabold text-blue-700 transition-colors hover:text-orange-600 dark:text-blue-300 dark:hover:text-orange-400"
                  >
                    <Phone className="h-4 w-4" aria-hidden="true" />
                    {OFFICIAL_STORE_PHONE_FORMATTED}
                  </a>
                </div>
              </div>
              <a
                href={OFFICIAL_STORE_MAP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wide text-orange-700 transition-colors hover:text-blue-700 dark:text-orange-300 dark:hover:text-blue-300"
              >
                <Navigation className="h-4 w-4" aria-hidden="true" />
                Ver indicaciones
              </a>
            </div>

            <div className="border-l-4 border-slate-950 bg-orange-500 p-5 dark:bg-orange-500">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-slate-950">
                  Opiniones destacadas
                </p>
                <FiveStars />
              </div>
              <div className="mt-4 space-y-4">
                {reviews.map((review) => (
                  <blockquote key={review.text} className="border-t border-slate-950/25 pt-3 text-sm leading-6 text-slate-950/85 first:border-t-0 first:pt-0">
                    “{review.text}”
                    <cite className="mt-1 block text-xs font-bold not-italic text-slate-950/80">
                      — {review.author}, Google Maps
                    </cite>
                    {review.metadata && (
                      <span className="mt-1 block text-[11px] font-medium text-slate-950/65">{review.metadata}</span>
                    )}
                  </blockquote>
                ))}
              </div>
              <p className="mt-4 text-[11px] leading-4 text-slate-950/70">
                Reseñas mostradas como referencia desde la ficha pública compartida por la empresa.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
