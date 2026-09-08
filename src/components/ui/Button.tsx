import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline" | "danger";
  size?: "sm" | "md" | "lg" | "xl";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    const base = [
      "inline-flex items-center justify-center gap-2 font-semibold select-none whitespace-nowrap",
      "transition-all duration-150 ease-out",
      "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--indigo-500)] focus-visible:ring-offset-2",
      "disabled:opacity-50 disabled:pointer-events-none",
    ].join(" ");

    const variants = {
      primary: [
        "bg-[var(--indigo-600)] text-white",
        "border border-[var(--indigo-700)]",
        "shadow-[0_1px_3px_rgba(10,10,15,0.2),inset_0_1px_0_rgba(255,255,255,0.1)]",
        "hover:bg-[var(--indigo-500)] hover:shadow-[0_4px_16px_rgba(99,102,241,0.35)]",
        "hover:-translate-y-[1px]",
        "active:translate-y-0 active:shadow-[0_1px_2px_rgba(10,10,15,0.2)]",
      ].join(" "),
      secondary: [
        "bg-white text-[var(--text-primary)]",
        "border border-[var(--border-strong)]",
        "shadow-[var(--shadow-xs)]",
        "hover:border-[var(--indigo-500)] hover:shadow-[var(--shadow-sm)] hover:text-[var(--indigo-600)]",
        "hover:-translate-y-[1px]",
        "active:translate-y-0",
      ].join(" "),
      ghost: [
        "bg-transparent text-[var(--text-secondary)]",
        "border border-transparent",
        "hover:bg-[var(--surface-1)] hover:text-[var(--text-primary)]",
      ].join(" "),
      outline: [
        "bg-transparent text-[var(--indigo-600)]",
        "border border-[var(--border-brand)]",
        "hover:bg-[var(--indigo-50)] hover:shadow-[var(--shadow-brand)]",
        "hover:-translate-y-[1px]",
      ].join(" "),
      danger: [
        "bg-[#EF4444] text-white",
        "border border-[#DC2626]",
        "hover:bg-[#DC2626]",
      ].join(" "),
    };

    const sizes = {
      sm: "h-8 px-3.5 text-xs rounded-[10px]",
      md: "h-10 px-5 text-sm rounded-[12px]",
      lg: "h-12 px-7 text-[15px] rounded-[14px]",
      xl: "h-14 px-9 text-base rounded-[16px]",
    };

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
