'use client';

import { useEffect, useState } from 'react';
import { DashboardStats } from '@/types/admin';
import { getDashboardStats } from '@/api/admin';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import Calendar from '@/components/ClientCalendar';
import 'react-calendar/dist/Calendar.css';

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
        { name: 'Khách hàng hoạt động', value: stats.activeClients },
        { name: 'Khách hàng dùng thử', value: stats.trialClients },
      ]
    : [];

  const COLORS = ['#0b74ff', '#facc15'];

  const lineData = stats
    ? [
        // { name: 'Tổng KH', active: stats.totalClients, trial: 0 },
        { name: 'Thành viên', active: stats.activeClients, trial: 0 },
        { name: 'Dùng thử', active: 0, trial: stats.trialClients },
      ]
    : [];

  return (
    <div className='flex min-h-screen  relative'>
      {/* Dashboard */}
      <main className='flex-1 pt-[8vh] p-8 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50'>
        <h1 className='text-4xl font-extrabold mb-8 text-gray-900'>
          Trang chủ
        </h1>

        {/* CARD THỐNG KÊ — gradient + blur + đẹp */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10'>
          <div className='rounded-2xl p-6 shadow-xl bg-gradient-to-br from-indigo-500/40 to-purple-500/40 backdrop-blur-xl border border-white/20 text-white font-semibold'>
            Tổng khách hàng: {stats?.totalClients}
          </div>

          <div className='rounded-2xl p-6 shadow-xl bg-gradient-to-br from-green-400/40 to-emerald-500/40 backdrop-blur-xl border border-white/20 text-white font-semibold'>
            Khách hàng thành viên: {stats?.activeClients}
          </div>

          <div className='rounded-2xl p-6 shadow-xl bg-gradient-to-br from-yellow-400/40 to-orange-500/40 backdrop-blur-xl border border-white/20 text-white font-semibold'>
            Khách hàng dùng thử: {stats?.trialClients}
          </div>

          <div className='rounded-2xl p-6 shadow-xl bg-gradient-to-br from-pink-400/40 to-rose-500/40 backdrop-blur-xl border border-white/20 text-white font-semibold'>
            Thành viên: {stats?.totalUsers}
          </div>
        </div>

        {/* CHART */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {/* PIE CHART */}
          <div className='bg-white/50 backdrop-blur-xl rounded-2xl shadow-xl p-6 h-96 border border-white/20'>
            <ResponsiveContainer width='100%' height='100%'>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey='value'
                  nameKey='name'
                  cx='50%'
                  cy='50%'
                  outerRadius={90}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                  paddingAngle={4}
                >
                  {pieData.map((_, idx) => (
                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign='bottom' height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>

         {/* BAR CHART */}
<div className='bg-white/50 backdrop-blur-xl rounded-2xl shadow-xl p-6 h-96 border border-white/20'>
  <ResponsiveContainer width='100%' height='100%'>
    <BarChart data={lineData}>
      <CartesianGrid strokeDasharray='3 3' />
      <XAxis dataKey='name' />
      <YAxis />
      <Tooltip formatter={(value: number) => [`${value} khách`, 'Số lượng']} />
      <Legend verticalAlign='bottom' height={40} />

      {/* Active Clients - tím */}
      <Bar
        dataKey='active'
        name='Khách hàng thành viên'
        fill='#6366f1'
        barSize={30}
      />

      {/* Trial Clients - đỏ */}
      <Bar
        dataKey='trial'
        name='Khách hàng dùng thử'
        fill='#ef4444'
        barSize={30}
      />
    </BarChart>
  </ResponsiveContainer>
</div>

        </div>
       {/* CALENDAR + STATS ROW */}
<div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6 bg-transparent">
  {/* Cột trái: Calendar */}
  <div className="bg-white/50 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/20 bg-transparent">
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

  {/* Cột phải: Thống kê số lượng khách hàng */}
  <div className=" bg-white/50 ackdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/20 bg-transparent">
    <h2 className="text-xl font-semibold mb-4 text-gray-700">
      Thống kê khách hàng
    </h2>
    <div className="space-y-4">
      <div className="flex justify-between bg-indigo-100/50 p-3 rounded-lg">
        <span>Tổng khách hàng:</span>
        <span className="font-semibold">{stats?.totalClients}</span>
      </div>
      <div className="flex justify-between bg-purple-100/50 p-3 rounded-lg">
        <span>Khách hàng thành viên:</span>
        <span className="font-semibold">{stats?.activeClients}</span>
      </div>
      <div className="flex justify-between bg-red-100/50 p-3 rounded-lg">
        <span>Khách hàng dùng thử:</span>
        <span className="font-semibold">{stats?.trialClients}</span>
      </div>
      <div className="flex justify-between bg-green-100/50 p-3 rounded-lg">
        <span>Thành viên hệ thống:</span>
        <span className="font-semibold">{stats?.totalUsers}</span>
      </div>
    </div>
  </div>
</div>

      </main>
    </div>
  );
}
