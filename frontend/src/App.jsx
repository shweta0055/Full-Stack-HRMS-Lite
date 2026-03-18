import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, CalendarCheck, Info } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Attendance from './pages/Attendance';

const SidebarItem = ({ to, icon: Icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive
        ? 'bg-primary-600 text-white'
        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
      }`
    }
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </NavLink>
);

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
        {/* Sidebar */}
        <aside className="w-64 bg-[#d2eafa] dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-primary-600 flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-600 rounded-md flex items-center justify-center text-white">H</div>
              HRMS Lite
            </h1>
          </div>

          <nav className="flex-1 px-4 space-y-2 mt-4">
            <SidebarItem to="/" icon={LayoutDashboard} label="Dashboard" />
            <SidebarItem to="/employees" icon={Users} label="Employees" />
            <SidebarItem to="/attendance" icon={CalendarCheck} label="Attendance" />
          </nav>

          <div className="p-4 mt-auto border-t border-slate-200 dark:border-slate-800">
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1">HRMS Lite v1.0</h3>
              <p className="text-xs text-slate-500">Internal Management Tool</p>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-8 max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/employees" element={<Employees />} />
              <Route path="/attendance" element={<Attendance />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
