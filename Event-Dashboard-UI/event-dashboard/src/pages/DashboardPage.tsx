import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import DashboardHeader from '../components/Layout/DashboardHeader';
import DashboardSidebar from '../components/Layout/DashboardSidebar';
import { dashboardService } from '../services/dashboardService';

// ─── Stat Card Component ─────────────────────────────────────────────────────
const StatCard = ({ label, value, suffix, icon, gradient }) => (
  <div className={`bg-gradient-to-br ${gradient} rounded-xl shadow-lg p-6 text-white relative overflow-hidden`}>
    <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
    <div className="flex items-start justify-between relative z-10">
      <div>
        <p className="text-white/80 text-sm font-medium mb-1">{label}</p>
        <p className="text-3xl font-bold tracking-tight">
          {value}
          {suffix && <span className="text-lg font-normal ml-1 text-white/70">{suffix}</span>}
        </p>
      </div>
      <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-lg">
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
        </svg>
      </div>
    </div>
  </div>
);

// ─── Custom Tooltip for Charts ───────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-gray-900 text-white p-3 rounded-lg shadow-lg text-sm">
      <p className="font-semibold mb-1">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} style={{ color: entry.color }}>
          {entry.name}: {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
        </p>
      ))}
    </div>
  );
};

// ─── Dashboard Page ──────────────────────────────────────────────────────────
const DashboardPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await dashboardService.getDashboardData();
        setData(result);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <svg className="animate-spin h-8 w-8 text-blue-600" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-gray-700 dark:text-gray-300">{t('common.loading')}</span>
        </div>
      </div>
    );
  }

  const stats = data?.stats;
  const monthlyData = data?.monthlyData ?? [];
  const statusDistribution = data?.statusDistribution ?? [];
  const monthlyRevenue = data?.monthlyRevenue ?? [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardHeader />
      <div className="flex">
        <DashboardSidebar />
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Page Title */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('dashboard.welcome')}</h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">{t('dashboard.overview')}</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                label={t('stats.totalEvents')}
                value={stats?.totalEvents ?? 0}
                icon="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                gradient="from-blue-500 to-indigo-600"
              />
              <StatCard
                label={t('stats.confirmedEvents')}
                value={stats?.confirmedEvents ?? 0}
                icon="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                gradient="from-emerald-500 to-teal-600"
              />
              <StatCard
                label={t('stats.totalRevenue')}
                value={(stats?.totalRevenue ?? 0).toLocaleString()}
                suffix="SYR"
                icon="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                gradient="from-purple-500 to-pink-600"
              />
              <StatCard
                label={t('stats.pendingEvents')}
                value={stats?.pendingEvents ?? 0}
                icon="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                gradient="from-amber-500 to-orange-600"
              />
            </div>

            {/* Charts Row 1: Monthly Events + Status Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Monthly Events Bar Chart */}
              <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  {t('dashboard.monthlyEventsOverview')}
                </h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} vertical={false} />
                      <XAxis dataKey="month" stroke="#6B7280" tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                      <YAxis stroke="#6B7280" tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ paddingTop: '20px' }} />
                      <Bar dataKey="confirmed" name={t('status.approved')} fill="#10B981" radius={[4, 4, 0, 0]} maxBarSize={30} />
                      <Bar dataKey="pending" name={t('status.pending')} fill="#F59E0B" radius={[4, 4, 0, 0]} maxBarSize={30} />
                      <Bar dataKey="cancelled" name={t('status.rejected')} fill="#EF4444" radius={[4, 4, 0, 0]} maxBarSize={30} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Status Pie Chart */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  {t('dashboard.eventStatusDistribution')}
                </h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {statusDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Charts Row 2: Monthly Revenue */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                {t('dashboard.monthlyRevenue')}
              </h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyRevenue}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} vertical={false} />
                    <XAxis dataKey="month" stroke="#6B7280" tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis stroke="#6B7280" tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="revenue" name={t('dashboard.revenue')} fill="#8B5CF6" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;