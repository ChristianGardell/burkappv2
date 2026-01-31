import * as React from "react";

type ButtonVariant =
  | "default"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost"
  | "link";
type ButtonSize =
  | "default"
  | "xs"
  | "sm"
  | "lg"
  | "icon"
  | "icon-xs"
  | "icon-sm"
  | "icon-lg";

interface ButtonProps extends React.ComponentProps<"button"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

function Button({
  className = "",
  variant = "default",
  size = "default",
  ...props
}: ButtonProps) {
  const baseClasses =
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none";

  const variantClasses: Record<ButtonVariant, string> = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    destructive: "bg-destructive text-white hover:bg-destructive/90",
    outline:
      "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    link: "text-primary underline-offset-4 hover:underline",
  };

  const sizeClasses: Record<ButtonSize, string> = {
    default: "h-9 px-4 py-2",
    xs: "h-6 gap-1 rounded-md px-2 text-xs",
    sm: "h-8 rounded-md gap-1.5 px-3",
    lg: "h-10 rounded-md px-6",
    icon: "size-9",
    "icon-xs": "size-6 rounded-md",
    "icon-sm": "size-8",
    "icon-lg": "size-10",
  };

  const classes =
    `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`.trim();

  return (
    <button
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={classes}
      {...props}
    />
  );
}

export { Button };
