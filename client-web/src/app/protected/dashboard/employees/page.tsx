'use client';

import EmployeeList from '@/components/EmployeeList';

export default function EmployeePage() {
  return (
    <div className="min-h-screen p-6">
      <h1 className="text-4xl font-extrabold mb-8 text-gray-900">Quản lý nhân viên</h1>
      <EmployeeList />
    </div>
  );
}
