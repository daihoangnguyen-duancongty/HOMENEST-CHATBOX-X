"use client";

import Sidebar from "@/components/Sidebar";

import { useEffect, useState } from "react";
import { DashboardStats } from "@/types/admin";
import Header from "@/components/Header";
import { getDashboardStats } from "@/api/admin";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

export default function Stats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  const pieData = stats
    ? [
        { name: "Khách hàng hoạt động", value: stats.activeClients },
        { name: "Khách hàng dùng thử", value: stats.trialClients },
      ]
    : [];

  const COLORS = ["#0b74ff", "#facc15"];

  return (
    <div className="flex min-h-screen bg-gray-100 relative">

      {/* Sidebar */}
      <Sidebar />


{/* Dashboard */}
      <main className="flex-1 pt-[8vh] p-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Trang chủ</h1>

        {/* CARD THỐNG KÊ — gradient + blur + đẹp */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

          <div className="rounded-2xl p-6 shadow-xl bg-gradient-to-br from-indigo-500/40 to-purple-500/40 backdrop-blur-xl border border-white/20 text-white font-semibold">
            Tổng khách hàng: {stats?.totalClients}
          </div>

          <div className="rounded-2xl p-6 shadow-xl bg-gradient-to-br from-green-400/40 to-emerald-500/40 backdrop-blur-xl border border-white/20 text-white font-semibold">
            Khách hàng thành viên: {stats?.activeClients}
          </div>

          <div className="rounded-2xl p-6 shadow-xl bg-gradient-to-br from-yellow-400/40 to-orange-500/40 backdrop-blur-xl border border-white/20 text-white font-semibold">
            Khách hàng dùng thử: {stats?.trialClients}
          </div>

          <div className="rounded-2xl p-6 shadow-xl bg-gradient-to-br from-pink-400/40 to-rose-500/40 backdrop-blur-xl border border-white/20 text-white font-semibold">
            Thành viên: {stats?.totalUsers}
          </div>
        </div>

        {/* PIE CHART */}
        <div className="bg-white/50 backdrop-blur-xl rounded-2xl shadow-xl p-6 h-96 border border-white/20">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label={(entry) => `${entry.name}: ${entry.value}`}
                paddingAngle={4}
              >
                {pieData.map((_, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => [`${value}`, "Clients"]} />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </main>
    </div>
  );
}
