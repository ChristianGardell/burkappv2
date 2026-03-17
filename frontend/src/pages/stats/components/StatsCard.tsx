import { useState } from "react";

import type { AdminStatsResponse } from "@/types";

export function StatsCard({
  index,
  user,
  maxBeers = 1,
}: {
  index: number;
  user: AdminStatsResponse;
  maxBeers?: number;
}) {
  const [selected, setSelected] = useState(false);
  const percent = maxBeers > 0 ? (user.total_beers / maxBeers) * 100 : 0;

  return (
    <div
      onClick={() => setSelected(!selected)}
      className={`relative flex flex-col gap-4 p-4 rounded-2xl border transition-all duration-300 bg-slate-900 overflow-hidden cursor-pointer ${
        selected
          ? "border-emerald-500 ring-1 ring-emerald-500/20"
          : "border-slate-800"
      }`}
    >
      {/* Background Progress Bar */}
      <div
        className="absolute top-0 left-0 bottom-0 bg-slate-800/30 transition-all duration-1000 ease-out"
        style={{ width: `${percent}%` }}
      />

      {/* Top Row (Always Visible) relative to stay above background */}
      <div className="relative flex items-center justify-between z-10">
        <div className="flex items-center gap-4">
          <div className="w-8 flex justify-center text-lg font-bold text-slate-400">
            <span>#{index + 1}</span>
          </div>
          <div>
            <p className="font-semibold text-white text-lg">{user.name}</p>
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${
                user.admin
                  ? "bg-emerald-500/20 text-emerald-400"
                  : "bg-blue-500/20 text-blue-400"
              }`}
            >
              {user.admin ? "Admin" : "User"}
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-white">{user.total_beers}</p>
          <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">
            Beers
          </p>
        </div>
      </div>

      {/* Expanded Content (Visible on click) */}
      {selected && (
        <div className="relative pt-4 border-t border-slate-800 animate-in fade-in slide-in-from-top-2 z-10">
          <p className="text-sm font-bold text-emerald-400 mb-2">
            24h Activity Log
          </p>
          <p className="text-sm italic text-emerald-400 mb-2">
            Total: {user.beer_log?.length || 0} beers
          </p>
          <div className="space-y-2">
            {user.beer_log?.length > 0 ? (
              user.beer_log.map((log) => (
                <div
                  key={log.id}
                  className="flex justify-between text-xs text-slate-400"
                >
                  <span>Beer Logged</span>
                  <span>
                    {new Date(log.timestamp).toLocaleTimeString("se-SV")}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 italic">
                No activity recorded today
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
export default StatsCard;
