import * as React from "react";

import { cn, scrollInputIntoView } from "../../lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, onFocus, ...props }, ref) => {
    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      scrollInputIntoView(e);
      if (onFocus) {
        onFocus(e);
      }
    };

    return (
      <input
        type={type}
        className={cn(
          "w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-mono",
          className,
        )}
        ref={ref}
        onFocus={handleFocus}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
