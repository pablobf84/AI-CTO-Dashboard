import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

type ButtonProps = {
  asChild?: boolean;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
  href?: string;
} & ButtonHTMLAttributes<HTMLButtonElement> &
  AnchorHTMLAttributes<HTMLAnchorElement>;

export function Button({
  asChild,
  variant = "primary",
  size = "md",
  className,
  children,
  href = "#",
  ...props
}: ButtonProps) {
  const classes = cn(
    "inline-flex min-h-10 items-center justify-center gap-2 rounded-md border px-4 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-60",
    variant === "primary" && "border-primary bg-primary text-primary-foreground hover:bg-[#173f39]",
    variant === "secondary" && "border-border bg-card text-card-foreground hover:bg-muted",
    variant === "ghost" && "border-transparent bg-transparent hover:bg-muted",
    variant === "danger" && "border-destructive bg-destructive text-white hover:bg-[#8f1c13]",
    size === "sm" && "min-h-9 px-3 text-sm",
    size === "lg" && "min-h-12 px-5 text-base",
    className
  );

  if (asChild) {
    return (
      <Link className={classes} href={href} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
