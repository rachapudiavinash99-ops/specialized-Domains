import React, { useEffect, useState } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/reports/dashboard');
        setStats(res.data);
      } catch (err) {
        console.error("Failed to load dashboard", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stat Card 1 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">Total Students</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {stats?.overall?.total_students || 0}
          </p>
        </div>

        {/* Stat Card 2 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">Today's Attendance</h3>
          <p className="mt-2 text-3xl font-bold text-green-600">
            {stats?.today?.attendance_percentage?.toFixed(1) || 0}%
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {stats?.today?.present || 0} Present / {stats?.today?.absent || 0} Absent
          </p>
        </div>

        {/* Stat Card 3 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">Low Attendance Alerts</h3>
          <p className="mt-2 text-3xl font-bold text-red-600">
            {stats?.low_attendance_students || 0}
          </p>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Welcome back, {user?.email}</h2>
        <p className="text-gray-600">
          This is your central hub for managing and monitoring attendance. Use the sidebar to navigate to different modules depending on your role permissions.
        </p>
      </div>
    </div>
  );
}
