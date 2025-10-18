import React from "react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

type Variant = "primary" | "secondary" | "accent";

interface HoloIconProps {
  icon: LucideIcon;
  size?: number; // icon size in px
  variant?: Variant;
  className?: string;
}

const variantClasses: Record<Variant, { text: string; ring: string; glowVar: string }> = {
  primary: { text: "text-primary", ring: "ring-primary", glowVar: "--glow-primary" },
  secondary: { text: "text-secondary", ring: "ring-secondary", glowVar: "--glow-secondary" },
  accent: { text: "text-accent", ring: "ring-accent", glowVar: "--glow-primary" },
};

export function HoloIcon({ icon: Icon, size = 28, variant = "primary", className }: HoloIconProps) {
  const v = variantClasses[variant];
  return (
    <div
      className={cn(
        "relative inline-grid place-items-center rounded-xl border border-white/10 bg-card/60 backdrop-blur-md",
        "ring-1",
        v.ring,
        "shadow-[0_0_24px_hsl(var(--glow-primary)/0.25)]",
        "p-3",
        className,
      )}
      style={{ boxShadow: `0 0 24px hsl(var(${v.glowVar}) / 0.35)` }}
    >
      {/* inner glass highlight */}
      <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-br from-white/5 to-transparent" />
      <Icon size={size} className={cn(v.text)} />
    </div>
  );
}

export default HoloIcon;
