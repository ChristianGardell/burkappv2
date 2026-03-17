import { useEffect, useState } from "react";

import Loading from "@/components/Loading";
import useApiCall from "@/hooks/useApiCall";

import getAllStats from "../../api/admin/get-all-stats-admin";
import type { AdminStatsResponse } from "../../types";
import { StatsCard } from "./components/StatsCard";

export default function Stats() {
  const [users, setUsers] = useState<AdminStatsResponse[]>([]);

  const {
    error: errorStats,
    loading: loadingStats,
    execute: executeGetStats,
  } = useApiCall<AdminStatsResponse[]>(3000);

  useEffect(() => {
    const loadUsers = async () => {
      const userStats = await executeGetStats(() => getAllStats());
      if (userStats) {
        const sortedStats = [...userStats].sort(
          (a: AdminStatsResponse, b: AdminStatsResponse) =>
            b.total_beers - a.total_beers,
        );
        setUsers(sortedStats);
      }
    };

    loadUsers();
  }, [executeGetStats]);

  const adminTotal = users
    .filter((u) => u.admin)
    .reduce((total, current) => total + (current.total_beers || 0), 0);
  const userTotal = users
    .filter((u) => !u.admin)
    .reduce((total, current) => total + (current.total_beers || 0), 0);

  const totalBeers = adminTotal + userTotal;
  const adminPercent =
    totalBeers > 0 ? Math.round((adminTotal / totalBeers) * 100) : 0;
  const userPercent = totalBeers > 0 ? 100 - adminPercent : 0;

  if (loadingStats) return <Loading />;

  return (
    <div className="flex flex-col gap-8 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-400">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-white tracking-tight">Stats</h1>
      </div>

      {/* Summary Card Section */}
      <div className="w-full bg-slate-900/50 border border-slate-800 rounded-3xl p-8 shadow-xl flex flex-col items-center justify-center space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wider">
            Total Beers
          </h2>
          <p className="text-6xl font-black text-white drop-shadow-md">
            {totalBeers}
          </p>
        </div>

        {totalBeers > 0 && (
          <div className="w-full space-y-3 pt-4 border-t border-slate-800/50 mt-2">
            {/* Progress Bar */}
            <div className="h-3 w-full bg-slate-950 rounded-full flex overflow-hidden ring-1 ring-white/5 mx-auto">
              <div
                className="bg-emerald-500 transition-all duration-1000 ease-out"
                style={{ width: `${adminPercent}%` }}
              />
              <div
                className="bg-blue-500 transition-all duration-1000 ease-out"
                style={{ width: `${userPercent}%` }}
              />
            </div>
            {/* Labels */}
            <div className="flex justify-between text-sm px-1">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                <span className="text-slate-300">
                  Admins:{" "}
                  <span className="font-bold text-white">{adminTotal}</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-300">
                  Users:{" "}
                  <span className="font-bold text-white">{userTotal}</span>
                </span>
                <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
              </div>
            </div>
          </div>
        )}

        {errorStats && (
          <p className="text-red-400 text-sm text-center">{errorStats}</p>
        )}
      </div>

      {/* Ranking List */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white px-2">Top</h2>
        <div className="space-y-3">
          {users.map((user, index) => (
            <StatsCard key={user.id} index={index} user={user} />
          ))}
        </div>
      </div>
    </div>
  );
}
