"use client";

import { MessageCircle, Phone, Send } from "lucide-react";
import {
  FacebookIcon,
  InstagramIcon,
  TikTokIcon,
} from "@/components/common/SocialIcons";
import {
  OFFICIAL_STORE_PHONE,
  OFFICIAL_STORE_PHONE_FORMATTED,
  SOCIAL_LINKS,
} from "@/lib/utils";
import { StoreLocationReviews } from "@/components/storefront/StoreLocationReviews";

const socialLinks = [
  { href: SOCIAL_LINKS.instagram, name: "Instagram", handle: "@multiogar", icon: InstagramIcon },
  { href: SOCIAL_LINKS.tiktok, name: "TikTok", handle: "@multiogar", icon: TikTokIcon },
  { href: SOCIAL_LINKS.facebook, name: "Facebook", handle: "Multiogar", icon: FacebookIcon },
];

export default function ContactPage() {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    const text = `Hola Ferreteria Multiogar. Mi nombre es ${name}, mi teléfono es ${phone}. ${message}`;
    window.open(`https://wa.me/${OFFICIAL_STORE_PHONE}?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 dark:bg-slate-950 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-extrabold uppercase text-orange-600">Contacto</p>
          <h1 className="mt-2 text-3xl font-black text-slate-950 dark:text-white sm:text-4xl">
            Habla con ventas
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
            Envía productos, cantidades y ciudad para consultar disponibilidad y despacho.
          </p>
        </div>

        <div className="mt-9 grid overflow-hidden rounded-md border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 lg:grid-cols-12">
          <aside className="border-b border-slate-200 p-6 dark:border-slate-800 lg:col-span-5 lg:border-b-0 lg:border-r lg:p-8">
            <div className="flex h-11 w-11 items-center justify-center rounded-md bg-emerald-600 text-white">
              <MessageCircle className="h-5 w-5" />
            </div>
            <h2 className="mt-5 text-lg font-black text-slate-950 dark:text-white">WhatsApp Multiogar</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
              Solicita una cotización y confirma con el asesor los datos oficiales antes de pagar.
            </p>
            <a
              href={SOCIAL_LINKS.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-md bg-emerald-600 px-4 py-3 text-sm font-extrabold text-white hover:bg-emerald-700"
            >
              <Phone className="h-4 w-4" />
              {OFFICIAL_STORE_PHONE_FORMATTED}
            </a>

            <div className="mt-8 border-t border-slate-200 pt-6 dark:border-slate-800">
              <h2 className="text-xs font-extrabold uppercase text-slate-500">Redes sociales</h2>
              <div className="mt-4 space-y-2">
                {socialLinks.map(({ href, name, handle, icon: Icon }) => (
                  <a
                    key={name}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-md px-2 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-blue-700 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-bold">{name}</span>
                    <span className="ml-auto text-xs text-slate-400">{handle}</span>
                  </a>
                ))}
              </div>
            </div>
          </aside>

          <section className="p-6 lg:col-span-7 lg:p-8">
            <h2 className="text-lg font-black text-slate-950 dark:text-white">Preparar consulta</h2>
            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                  Nombre
                  <input
                    name="name"
                    required
                    maxLength={100}
                    className="h-11 w-full rounded-md border border-slate-300 bg-slate-50 px-3 text-sm font-normal text-slate-950 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </label>
                <label className="space-y-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                  Teléfono
                  <input
                    name="phone"
                    type="tel"
                    required
                    maxLength={25}
                    className="h-11 w-full rounded-md border border-slate-300 bg-slate-50 px-3 text-sm font-normal text-slate-950 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </label>
              </div>
              <label className="block space-y-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                Productos o consulta
                <textarea
                  name="message"
                  required
                  rows={7}
                  maxLength={1000}
                  placeholder="Ejemplo: 10 discos de corte de 4 1/2 pulgadas y entrega en Valencia."
                  className="w-full resize-none rounded-md border border-slate-300 bg-slate-50 p-3 text-sm font-normal text-slate-950 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </label>
              <button
                type="submit"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-blue-700 px-5 py-3 text-sm font-extrabold text-white hover:bg-blue-800"
              >
                <Send className="h-4 w-4" />
                Abrir consulta en WhatsApp
              </button>
            </form>
          </section>
        </div>

        <div className="mt-10">
          <StoreLocationReviews />
        </div>
      </div>
    </div>
  );
}
