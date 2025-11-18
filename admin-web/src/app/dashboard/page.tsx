'use client';

import Sidebar from "@/components/Sidebar";
import { fetcher } from "@/config/fetcher";
import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

type DashboardStats = {
  totalClients: number;
  activeClients: number;
  trialClients: number;
  totalUsers: number;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await fetcher<DashboardStats>("/admin/dashboard");
        setStats(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  const pieData = stats
    ? [
        { name: "Active", value: stats.activeClients },
        { name: "Trial", value: stats.trialClients },
      ]
    : [];

  const COLORS = ["#0b74ff", "#facc15"];

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-8 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded shadow">
            <p>Total Clients</p>
            <p>{stats?.totalClients ?? "..."}</p>
          </div>
          <div className="bg-white p-6 rounded shadow">
            <p>Active Clients</p>
            <p>{stats?.activeClients ?? "..."}</p>
          </div>
          <div className="bg-white p-6 rounded shadow">
            <p>Trial Clients</p>
            <p>{stats?.trialClients ?? "..."}</p>
          </div>
          <div className="bg-white p-6 rounded shadow">
            <p>Total Users</p>
            <p>{stats?.totalUsers ?? "..."}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded shadow h-96">
          <h2>Client Status</h2>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {pieData.map((_, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
