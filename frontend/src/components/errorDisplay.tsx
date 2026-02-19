import { useState, useEffect } from "react";

interface ErrorDisplayProps {
  error: string | null; 
  className?: string;
  timer?: number;
}

export default function ErrorDisplay({
  error,
  className = "",
  timer,
}: ErrorDisplayProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (error && timer && timer > 0) {
      setVisible(true);
      
      const timeoutId = setTimeout(() => {
        setVisible(false);
      }, timer);

      return () => clearTimeout(timeoutId);
    } else if (error) {
      setVisible(true);
    }
  }, [error, timer]); 

  if (!error || !visible) return null;

  return (
    <div
      className={`text-red-500 text-xs font-medium text-center bg-red-500/10 py-3 px-4 rounded-xl border border-red-500/20 animate-in fade-in slide-in-from-top-2 ${className}`}
    >
      {error}
    </div>
  );
}