import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-accent text-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.08)] hover:-translate-y-px hover:bg-accent-hover hover:shadow-[0_2px_4px_rgba(0,0,0,0.06),0_8px_18px_rgba(79,70,229,0.25)]",
  secondary:
    "border border-slate-200 bg-surface text-text-primary shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:-translate-y-px hover:bg-layer",
};

export function Button({
  className,
  type = "button",
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex h-11 items-center justify-center rounded-xl px-4 text-sm font-semibold transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/20 focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60",
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  );
}