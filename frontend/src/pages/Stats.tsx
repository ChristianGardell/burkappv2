import { useEffect, useState } from "react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import useApiCall from "@/hooks/useApiCall";

import getAllStats from "../api/admin/get-all-stats-admin";
import type { AdminStatsResponse } from "../types";
import { StatsCard } from "./../components/StatsCard";

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

  const pieData = [
    { name: "Admins", value: adminTotal },
    { name: "Users", value: userTotal },
  ];

  const COLORS = ["#10b981", "#3b82f6"]; // Emerald (Admin) & Blue (User)

  if (loadingStats)
    return (
      <div className="p-8 text-center text-slate-400">Loading stats...</div>
    );

  return (
    <div className="flex flex-col gap-8 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-400">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-white tracking-tight">Stats</h1>
      </div>

      {/* Pie Chart Section */}
      <div className="w-full h-full bg-slate-900/50 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {errorStats && <p> {errorStats}</p>}
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={1}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                animationDuration={400}
              >
                {pieData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  borderColor: "#334155",
                  color: "#fff",
                }}
                itemStyle={{ color: "#fff" }}
              />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <h1 className="text-center text-white font-bold">
          Total Beers Consumed: {adminTotal + userTotal}
        </h1>
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
