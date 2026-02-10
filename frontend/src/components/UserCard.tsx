import { Button } from "@/components/ui/button";
import updateUserBeers from "@/api/admin/update-user-beers";
import type { UserResponse } from "@/types";
import { Loader2, Save } from "lucide-react";
import { useState } from "react";

import type { UserUpdateAdmin } from "@/types";

export default function UserCard({ user }: { user: UserResponse }) {
  const [currBeers, setCurrBeers] = useState<number>(user.beers);
  const [inputValue, setInputValue] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // We compare against the current display value to determine if there are changes
  const oldValue: number = currBeers;

  const inputValueAsNumber: number = isNaN(parseInt(inputValue))
    ? oldValue
    : Math.max(0, parseInt(inputValue));

  const hasChanges: boolean = inputValueAsNumber !== oldValue;

  const handleSave = async () => {
    if (!hasChanges) return;
    setIsSaving(true);
    try {
      const toUpdate: UserUpdateAdmin = {
        id: user.id,
        beers: inputValueAsNumber,
      };
      const success: boolean = await updateUserBeers(toUpdate);
      if (success) {
        setCurrBeers(inputValueAsNumber);
        setInputValue("");
      } else {
        setErrorMessage("Failed to update beers. Please try again.");
      }
    } catch {
      setErrorMessage("Failed to update beers. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className={`bg-slate-900 border rounded-2xl p-5 transition-all duration-300 ${
        hasChanges
          ? "border-emerald-500/50 bg-emerald-500/5"
          : "border-slate-800"
      }`}
    >
      <div className="flex flex-col gap-5">
        {/* Top Row: User Info & Admin Badge */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold text-white leading-tight">
              {user.name}
            </h3>
            <p className="text-sm text-slate-400 font-mono mt-1">
              {user.phone_number}
            </p>
          </div>
          {user.admin && (
            <span className="text-[10px] uppercase tracking-wider font-bold bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded">
              Admin
            </span>
          )}
        </div>

        {/* Action Bar */}
        <div className="bg-slate-950/50 rounded-xl p-3 flex items-center justify-between border border-slate-800/50">
          {/* Current Display */}
          <div className="flex flex-col px-2">
            <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">
              Current
            </span>
            <span className="text-3xl font-bold text-white tabular-nums leading-none mt-1">
              {currBeers}
            </span>
          </div>

          <div className="w-px h-10 bg-slate-800" />

          {/* Edit Input Area */}
          <div className="flex flex-col items-end relative">
            <div className="flex items-center gap-3">
              <input
                inputMode="numeric"
                pattern="[0-9]*"
                min="0"
                placeholder="Set"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSave()}
                className="w-30 h-10 text-center text-3xl font-bold bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 tabular-nums placeholder:text-slate-600 transition-all p-0"
              />
              <Button
                onClick={handleSave}
                disabled={!hasChanges || isSaving}
                size="icon"
                className={`h-10 w-10 shrink-0 transition-all duration-200 ${
                  hasChanges
                    ? "bg-emerald-500 text-white hover:bg-emerald-600 shadow-[0_0_15px_-3px_rgba(16,185,129,0.4)]"
                    : "bg-slate-800 text-slate-500 hover:bg-slate-700 hover:text-slate-300"
                }`}
              >
                {isSaving ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Save className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
