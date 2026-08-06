import { forwardRef } from "react";

type DiamondCardProps = {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  as?: "div" | "article" | "section";
  /** Adds an animated rotating glow border */
  animatedGlow?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

export const DiamondCard = forwardRef<HTMLDivElement, DiamondCardProps>(
  ({ children, className = "", glow = false, animatedGlow = false, as: Tag = "div", ...props }, ref) => {
    const base = "relative clip-diamond p-6";
    const surface = glow ? "glass-glow" : "glass";
    const anim = animatedGlow ? " glow-border-animated" : "";

    return (
      <Tag
        ref={ref}
        className={`${base} ${surface}${anim} ${className}`}
        {...props}
      >
        {children}
      </Tag>
    );
  }
);

DiamondCard.displayName = "DiamondCard";
