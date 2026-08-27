import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Iniciar sesión | Ferreteria Multiogar",
  description: "Accede a Multiogar con Google o con tu correo electrónico.",
  robots: { index: false, follow: false },
};

interface LoginPageProps {
  searchParams: Promise<{ redirect?: string | string[] }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const redirectPath = Array.isArray(params.redirect)
    ? params.redirect[0]
    : params.redirect;

  return <LoginForm requestedPath={redirectPath} />;
}
