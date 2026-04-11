import type { VariantProps } from "class-variance-authority"
import { cva } from "class-variance-authority"

export { default as Button } from "./Button.vue"

/**
 * Brand button system — strict palette adherence.
 *   --color-primary       #6B4DD1   purple  (brand)
 *   --color-primary-dark  #362061   violet  (brand dark)
 *   --color-secondary     #FFD71D   yellow  (accent)
 *   --color-bg-soft       #E1C3FF   lavender (soft bg)
 *   --color-bg            #FFF9F1   cream    (main bg)
 *
 * Hover/active darker shades (#2A1849, #E6BC00, #D4AC00, #C9A3FF, #B197E0)
 * are in-family tints of the palette — no new brand colors introduced.
 */
export const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap select-none",
    "rounded-xl text-sm font-semibold tracking-tight",
    "transition-all duration-[250ms] ease-out",
    "outline-none focus-visible:ring-[3px] focus-visible:ring-offset-0",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0",
    "aria-invalid:ring-destructive/20 aria-invalid:border-destructive",
  ].join(" "),
  {
    variants: {
      variant: {
        // Primary — purple brand button with soft shadow
        default: [
          "bg-primary text-white",
          "shadow-[0_4px_14px_0_rgba(107,77,209,0.3)]",
          "hover:bg-primary-dark hover:shadow-[0_6px_18px_0_rgba(107,77,209,0.35)]",
          "active:bg-[#2A1849] active:shadow-[0_2px_8px_0_rgba(107,77,209,0.25)]",
          "focus-visible:ring-primary/40",
        ].join(" "),

        // Accent — yellow with dark-purple text (never white on yellow)
        secondary: [
          "bg-secondary text-primary-dark",
          "hover:bg-[#E6BC00]",
          "active:bg-[#D4AC00]",
          "focus-visible:ring-secondary/50",
        ].join(" "),

        // Secondary (outline) — 2px purple border, purple text
        outline: [
          "bg-transparent border-2 border-primary text-primary",
          "hover:bg-[#E1C3FF] hover:text-primary-dark",
          "active:bg-[#C9A3FF]",
          "focus-visible:ring-primary/40",
        ].join(" "),

        // Soft — lavender background with dark-purple text
        soft: [
          "bg-[#E1C3FF] text-primary-dark",
          "hover:bg-[#C9A3FF]",
          "active:bg-[#B197E0]",
          "focus-visible:ring-primary/40",
        ].join(" "),

        // Retained non-brand utility variants (existing app usage)
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/30",
        ghost:
          "bg-transparent text-primary-dark hover:bg-[#E1C3FF] hover:text-primary-dark",
        link:
          "bg-transparent text-primary underline-offset-4 hover:underline focus-visible:ring-primary/40",
      },
      size: {
        default: "h-10 px-[18px] py-[10px] has-[>svg]:px-3.5",
        sm: "h-8 rounded-lg gap-1.5 px-3 text-xs has-[>svg]:px-2.5",
        lg: "h-12 px-7 text-base has-[>svg]:px-5",
        icon: "size-10 rounded-xl",
        "icon-sm": "size-8 rounded-lg",
        "icon-lg": "size-12 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)
export type ButtonVariants = VariantProps<typeof buttonVariants>
