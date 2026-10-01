import Link from "next/link";
import type { ReactNode } from "react";

type ButtonProps = {
  href?: string;
  type?: "button" | "submit";
  variant?: "primary" | "secondary" | "ghost";
  disabled?: boolean;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
};

export function Button({
  href,
  type = "button",
  variant = "primary",
  disabled = false,
  className = "",
  children,
  onClick,
}: ButtonProps) {
  const variantClasses = {
    primary:
      "bg-[#007aff] text-white shadow-[0_8px_18px_rgba(0,122,255,0.2)] hover:bg-[#006fe6] hover:shadow-[0_10px_22px_rgba(0,122,255,0.26)]",
    secondary:
      "border border-white/80 bg-white/75 text-slate-900 shadow-sm hover:bg-white",
    ghost: "bg-slate-200/65 text-slate-700 hover:bg-slate-200",
  };

  const classes = `inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#007aff]/40 disabled:cursor-not-allowed disabled:opacity-60 ${variantClasses[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
