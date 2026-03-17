import type { ReactNode } from "react";
import ErrorDisplay from "@/components/errorDisplay";

interface AuthLayoutProps {
  children: ReactNode;
  error?: string | null;
}

export default function AuthLayout({ children, error }: AuthLayoutProps) {
  return (
    <div className="relative flex flex-col h-dvh overflow-hidden bg-slate-950 font-libre text-slate-200">
      {/* Fixated Shared Header that is independent of page content */}
      <div className="absolute top-[8vh] left-0 w-full flex flex-col items-center justify-start z-10 p-4">
        <div className="w-full max-w-md text-center space-y-2">
          <h1 className="text-4xl font-black text-white tracking-tighter">
            BurkApp
          </h1>
          <div className="min-h-10 text-sm text-rose-400">
            <ErrorDisplay error={error ?? null} />
          </div>
        </div>
      </div>

      <main className="flex-1 flex flex-col items-center mt-[10vh] justify-center p-4 z-20">
        <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-slate-900 rounded-3xl p-8 shadow-xl shadow-slate-900/50 w-full border border-slate-800">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
