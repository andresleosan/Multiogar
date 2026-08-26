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
  size = "md",
}) => {
  const sizeClasses = {
    sm: "h-8 w-auto",
    md: "h-11 w-auto",
    lg: "h-16 w-auto",
    xl: "h-24 w-auto",
  };

  return (
    <Link href="/" className={cn("inline-flex items-center gap-2.5 transition-opacity hover:opacity-90", className)}>
      <div className="relative flex items-center">
        {/* Next.js Image with LogoMultiogar.png */}
        <Image
          src="/LogoMultiogar.png"
          alt="Multiogar Ferretería"
          width={size === "xl" ? 280 : size === "lg" ? 220 : size === "md" ? 170 : 130}
          height={size === "xl" ? 80 : size === "lg" ? 60 : size === "md" ? 44 : 34}
          priority
          className={cn("object-contain drop-shadow-sm", sizeClasses[size])}
        />
      </div>
    </Link>
  );
};