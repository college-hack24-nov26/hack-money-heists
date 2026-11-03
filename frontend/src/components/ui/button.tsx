import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-violet-600 text-white shadow-sm hover:bg-violet-700 shadow-[0_4px_14px_0_rgba(139,92,246,0.3)]",
        destructive:
          "bg-rose-500 text-white shadow-sm hover:bg-rose-600",
        outline:
          "border border-[#E5E5EB] bg-white text-[#15151B] hover:bg-[#F7F7FA] hover:border-[#D4D4DE] shadow-xs",
        secondary:
          "bg-[#EDE7FF] text-[#6D45CF] hover:bg-[#E3DAFC] font-semibold",
        ghost: "hover:bg-[#F7F7FA] text-[#15151B] hover:text-[#6D45CF]",
        link: "text-violet-600 underline-offset-4 hover:underline",
        gradient:
          "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-[0_4px_18px_0_rgba(109,69,207,0.35)] hover:opacity-95",
        dark: "bg-[#11131B] text-white hover:bg-[#1A1D29] border border-white/10"
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 rounded-lg px-3.5 text-xs",
        lg: "h-12 rounded-xl px-8 text-base font-semibold",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };

