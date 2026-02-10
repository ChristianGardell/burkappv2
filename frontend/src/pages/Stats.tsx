import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import type { AdminStats } from "../types";
import getAllStats from "../api/admin/get-all-stats-admin";
import useApiCall from "@/hooks/useApiCall";

export default function Stats() {
  const [users, setUsers] = useState<AdminStats[]>([]);

  const {
    error: errorStats,
    loading: loadingStats,
    execute: executeGetStats,
  } = useApiCall(3000);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const userStats = await executeGetStats(() => getAllStats());
    if (userStats) {
      const sortedStats = userStats.sort(
        (a, b) => b.total_beers - a.total_beers,
      );
      setUsers(sortedStats);
    }
  };

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
    <div className="flex flex-col gap-8 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-white tracking-tight">Stats</h1>
      </div>

      {/* Pie Chart Section */}
      <div className="w-full h-full bg-slate-900/50 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
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
      </div>

      {/* Ranking List */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white px-2">Top</h2>
        <div className="space-y-3">
          {users.map((user, index) => (
            <div
              key={user.id}
              className={`flex items-center justify-between p-4 rounded-2xl border ${
                index === 0
                  ? "bg-amber-500/10 border-amber-500/50"
                  : index === 1
                    ? "bg-slate-300/10 border-slate-400/50"
                    : index === 2
                      ? "bg-orange-700/10 border-orange-700/50"
                      : "bg-slate-900 border-slate-800"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-8 flex justify-center text-lg font-bold text-slate-400">
                  <span>#{index + 1}</span>
                </div>
                <div>
                  <p className="font-semibold text-white text-lg">
                    {user.name}
                  </p>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${user.admin ? "bg-emerald-500/20 text-emerald-400" : "bg-blue-500/20 text-blue-400"}`}
                  >
                    {user.admin ? "Admin" : "User"}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-white">
                  {user.total_beers}
                </p>
                <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">
                  Beers
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
