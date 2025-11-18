'use client';

import { useState, useEffect } from 'react';
import { fetcher } from '@/config/fetcher';
import Sidebar from '@/components/Sidebar';
import useProtectedRoute from '@/hooks/useProtectedRoute';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';

type DashboardStats = {
  totalClients: number;
  activeClients: number;
  trialClients: number;
  totalUsers: number;
};

export default function AdminDashboard() {
  useProtectedRoute("admin"); // Bảo vệ route

  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await fetcher<DashboardStats>("/admin/dashboard");
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch dashboard stats:", err);
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
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        {/* Widget Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded shadow">
            <p className="text-gray-500">Total Clients</p>
            <p className="text-2xl font-bold">{stats?.totalClients ?? "..."}</p>
          </div>
          <div className="bg-white p-6 rounded shadow">
            <p className="text-gray-500">Active Clients</p>
            <p className="text-2xl font-bold">{stats?.activeClients ?? "..."}</p>
          </div>
          <div className="bg-white p-6 rounded shadow">
            <p className="text-gray-500">Trial Clients</p>
            <p className="text-2xl font-bold">{stats?.trialClients ?? "..."}</p>
          </div>
          <div className="bg-white p-6 rounded shadow">
            <p className="text-gray-500">Total Users</p>
            <p className="text-2xl font-bold">{stats?.totalUsers ?? "..."}</p>
          </div>
        </div>

        {/* PieChart */}
        <div className="bg-white p-6 rounded shadow h-96">
          <h2 className="text-xl font-bold mb-4">Client Status</h2>
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
                {pieData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
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
