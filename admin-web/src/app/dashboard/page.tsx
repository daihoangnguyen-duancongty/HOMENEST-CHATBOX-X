'use client';

import Sidebar from "@/components/Sidebar";
import Header from '@/components/Header';
import { useEffect, useState } from "react";
import type {DashboardStats} from '@/types/admin'
import {  getDashboardStats } from "@/api/admin";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

export default function AdminDashboard() {
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
        { name: "Active Clients", value: stats.activeClients },
        { name: "Trial Clients", value: stats.trialClients },
      ]
    : [];

  const COLORS = ["#0b74ff", "#facc15"];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
       <Header />
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Dashboard</h1>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <p className="text-gray-500 font-medium">Total Clients</p>
            <p className="text-2xl font-bold mt-2">{stats?.totalClients}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <p className="text-gray-500 font-medium">Active Clients</p>
            <p className="text-2xl font-bold mt-2">{stats?.activeClients}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <p className="text-gray-500 font-medium">Trial Clients</p>
            <p className="text-2xl font-bold mt-2">{stats?.trialClients}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <p className="text-gray-500 font-medium">Total Users</p>
            <p className="text-2xl font-bold mt-2">{stats?.totalUsers}</p>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-2xl shadow-lg p-6 h-96">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Client Status</h2>
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
              <Tooltip
                formatter={(value: number) => [`${value}`, "Clients"]}
                contentStyle={{ backgroundColor: "#f9f9f9", borderRadius: 10 }}
              />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </main>
    </div>
  );
}
