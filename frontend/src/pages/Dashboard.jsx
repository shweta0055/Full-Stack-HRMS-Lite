import React, { useState, useEffect } from "react";
import { employeeApi } from "../api";
import {
  Users,
  UserCheck,
  UserMinus,
  Building2,
  TrendingUp,
} from "lucide-react";
//import { UserCheck } from "lucide-react";

const StatCard = ({ title, value, icon: Icon, color, trend }) => (
  <div className="bg-[#d2eafa] dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
        <Icon className={color.replace("bg-", "text-")} size={24} />
      </div>
      {trend && (
        <span className="flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
          <TrendingUp size={12} className="mr-1" /> {trend}
        </span>
      )}
    </div>
    <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">
      {title}
    </h3>
    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
      {value}
    </p>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    employeeApi
      .getDashboardStats()
      .then((res) => {
        setStats(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <div className="flex animate-pulse flex-col space-y-8">
        <div className="h-8 bg-slate-200 dark:bg-slate-800 w-48 rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-32 bg-slate-200 dark:bg-slate-800 rounded-2xl"
            ></div>
          ))}
        </div>
      </div>
    );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          Overview
        </h1>
        <p className="text-slate-500 mt-1">
          Summary of HR activity for your organization.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Employees"
          value={stats?.total_employees || 0}
          icon={Users}
          color="bg-blue-600"
        />
       <StatCard
          title="Present Today"
          value={stats?.present_today || 0}
          icon={UserCheck}
          color="bg-[#b3e1cf]"
        />
        <StatCard
          title="Absent Today"
          value={stats?.absent_today || 0}
          icon={UserMinus}
          color="bg-[#f18ba2]"
        />
        <StatCard
          title="Departments"
          value={stats?.dept_stats?.length || 0}
          icon={Building2}
          color="bg-amber-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Department Distribution */}
        <div className="bg-[#d2eafa] dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
          <h2 className="text-lg font-bold mb-6">Department Distribution</h2>
          <div className="space-y-4">
            {stats?.dept_stats?.map((dept, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600 dark:text-slate-400 font-medium">
                    {dept.department}
                  </span>
                  <span className="font-bold">{dept.count}</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                  <div
                    className="bg-primary-500 h-2 rounded-full"
                    style={{
                      width: `${(dept.count / stats.total_employees) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            ))}
            {(!stats?.dept_stats || stats.dept_stats.length === 0) && (
              <p className="text-slate-400 text-sm text-center py-8">
                No data available
              </p>
            )}
          </div>
        </div>

        {/* Quick Actions or some other info */}
        <div className="bg-primary-600 p-8 rounded-2xl shadow-lg relative overflow-hidden group">
          <div className="relative z-10">
            <h2 className="text-white text-2xl font-bold mb-2">
              Welcome Back!
            </h2>
            <p className="text-primary-100 mb-6 max-w-xs">
              Manage your team and track attendance efficiently from one place.
            </p>
            <button className="bg-white text-primary-600 px-6 py-3 rounded-xl font-bold hover:bg-primary-50 transition-colors shadow-sm">
              Get Started
            </button>
          </div>
          <Building2
            size={160}
            className="absolute -right-8 -bottom-8 text-primary-500 opacity-20 group-hover:scale-110 transition-transform duration-500"
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
