import { forwardRef } from "react";

type DiamondButtonVariant = "primary" | "secondary" | "ghost" | "gold";

type DiamondButtonProps = {
  children: React.ReactNode;
  variant?: DiamondButtonVariant;
  size?: "sm" | "md" | "lg";
  className?: string;
  disabled?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const variantStyles: Record<DiamondButtonVariant, string> = {
  primary:
    "bg-bd-cyan text-[#05060A] hover:bg-[#8EEBFF] active:bg-[#5CD5F5] shadow-[0_0_20px_rgba(111,227,255,0.25)]",
  secondary:
    "bg-transparent border border-bd-cyan/40 text-bd-cyan hover:bg-bd-cyan-dim hover:border-bd-cyan/60",
  ghost:
    "bg-transparent text-bd-text-secondary hover:text-bd-text-primary hover:bg-bd-raised",
  gold:
    "bg-bd-gold text-[#05060A] hover:bg-[#F0D47E] active:bg-[#DAB84E] shadow-[0_0_20px_rgba(232,196,106,0.25)]",
};

const sizeStyles: Record<string, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

export const DiamondButton = forwardRef<HTMLButtonElement, DiamondButtonProps>(
  (
    { children, variant = "primary", size = "md", className = "", disabled = false, ...props },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={`
          clip-diamond-btn font-semibold
          transition-all duration-150 ease-crystal
          focus-visible:outline-2 focus-visible:outline-bd-cyan
          disabled:opacity-40 disabled:cursor-not-allowed
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${className}
        `.trim()}
        {...props}
      >
        {children}
      </button>
    );
  }
);

DiamondButton.displayName = "DiamondButton";
