import React from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  className?: string;
  variant?: "light" | "dark" | "auto";
  showText?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className,
  variant = "auto",
  showText = true,
  size = "md",
}) => {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-11 w-11",
    lg: "h-16 w-16",
    xl: "h-20 w-20",
  };
  const imageSizes = {
    sm: 32,
    md: 44,
    lg: 64,
    xl: 80,
  };
  const textClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-xl",
    xl: "text-2xl",
  };
  const colorClass = {
    light: "text-white",
    dark: "text-slate-950",
    auto: "text-slate-950 dark:text-white",
  };

  return (
    <Link
      href="/"
      aria-label="Ir al inicio de Multiogar Ferretería"
      className={cn(
        "inline-flex items-center gap-2.5 transition-opacity hover:opacity-85",
        className,
      )}
    >
      <Image
        src="/LogoMultiogar.png"
        alt=""
        width={imageSizes[size]}
        height={imageSizes[size]}
        priority
        className={cn("shrink-0 object-contain", sizeClasses[size])}
      />
      {showText && (
        <span className={cn("flex flex-col leading-none", colorClass[variant])}>
          <strong className={cn("font-black uppercase", textClasses[size])}>Multiogar</strong>
          <span className="mt-1 text-[10px] font-bold uppercase text-orange-600">
            Ferretería
          </span>
        </span>
      )}
    </Link>
  );
};
