'use client';

import { useEffect, useState } from 'react';
import { DashboardStats } from '@/types/client-owner-types';
import { getDashboardStats } from '@/api/client-owner';
import { useAuthStore } from '@/store/authSlice';

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

export default function Stats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  // 🔥 lấy user để phân quyền
  const user = useAuthStore((s) => s.user);
  const isEmployee = user?.role === 'employee';
  const isClient = user?.role === 'client';

  // 🔥 employee KHÔNG gọi API admin
  useEffect(() => {
    if (isEmployee) return; // employee → bỏ qua API

    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchStats();
  }, [isEmployee]);

  // ===== UI RIÊNG CHO EMPLOYEE =====
  if (isEmployee) {
    return (
      <div className="flex min-h-screen relative">
        <main className="flex-1 pt-[8vh] p-8 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
          <h1 className="text-4xl font-extrabold mb-6 text-gray-900">
            Xin chào, {user?.name}
          </h1>

          <p className="text-lg text-gray-700 mb-6">
            Bạn đang đăng nhập với quyền <strong>Nhân viên</strong>.
          </p>

          <div className="rounded-2xl p-6 shadow-xl bg-gradient-to-br from-blue-500/40 to-purple-500/40 backdrop-blur-xl border border-white/20 text-white font-semibold mb-10">
            Đây là trang tổng quan rút gọn dành cho nhân viên.
          </div>

          <div className="mt-10 bg-white/50 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/20">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              Lịch làm việc
            </h2>

            <div className="flex justify-center">
              <Calendar
                onChange={(value) => console.log('Ngày được chọn:', value)}
                className="rounded-xl shadow-lg p-4"
              />
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ===== UI ĐẦY ĐỦ CHO CLIENT =====
  const pieData = stats
    ? [
        { name: 'Khách hàng hoạt động', value: stats.activeClients },
        { name: 'Khách hàng dùng thử', value: stats.trialClients },
      ]
    : [];

  const COLORS = ['#0b74ff', '#facc15'];

  const lineData = stats
    ? [
        { name: 'Tổng KH', active: stats.totalClients, trial: 0 },
        { name: 'Thành viên', active: stats.activeClients, trial: 0 },
        { name: 'Dùng thử', active: 0, trial: stats.trialClients },
      ]
    : [];

  return (
    <div className="flex min-h-screen relative">
      <main className="flex-1 pt-[8vh] p-8 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <h1 className="text-4xl font-extrabold mb-8 text-gray-900">
          Trang chủ
        </h1>

        {/* ====== CARDS ====== */}
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

        {/* ====== CHARTS ====== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white/50 backdrop-blur-xl rounded-2xl shadow-xl p-6 h-96 border border-white/20">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />

                <Tooltip formatter={(value: number) => [`${value} khách`, 'Số lượng']} />
                <Legend verticalAlign="bottom" height={40} />

                <Line
                  type="monotone"
                  dataKey="active"
                  name="Khách hàng thành viên"
                  stroke="#6366f1"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="trial"
                  name="Khách hàng dùng thử"
                  stroke="#ef4444"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ====== CALENDAR ====== */}
        <div className="mt-10 bg-white/50 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/20">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Lịch làm việc
          </h2>

          <div className="flex justify-center">
            <Calendar
              onChange={(value) => console.log('Ngày được chọn:', value)}
              className="rounded-xl shadow-lg p-4"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
