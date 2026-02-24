import React, { useState, useEffect } from 'react';
import { employeeApi, attendanceApi } from '../api';
import { Calendar, User, CheckCircle2, XCircle, Search, Loader2, Filter } from 'lucide-react';

const Attendance = () => {
    const [employees, setEmployees] = useState([]);
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [status, setStatus] = useState('Present');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [marking, setMarking] = useState(false);
    const [filterEmployeeId, setFilterEmployeeId] = useState('');

    const fetchData = async () => {
        try {
            setLoading(true);
            const [empRes, attRes] = await Promise.all([
                employeeApi.list(),
                attendanceApi.list(filterEmployeeId || null)
            ]);
            setEmployees(empRes.data);
            setAttendanceRecords(attRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [filterEmployeeId]);

    const handleMarkAttendance = async (e) => {
        e.preventDefault();
        if (!selectedEmployee) return alert("Please select an employee");

        setMarking(true);
        try {
            await attendanceApi.mark({
                employee: selectedEmployee,
                date: date,
                status: status
            });
            fetchData();
            alert("Attendance marked successfully");
        } catch (err) {
            alert(err.response?.data?.error || "Failed to mark attendance");
        } finally {
            setMarking(false);
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Attendance Tracking</h1>
                <p className="text-slate-500">Log daily presence of your team members.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Mark Attendance Form */}
                <div className="lg:col-span-1">
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 sticky top-8">
                        <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <CheckCircle2 size={20} className="text-primary-600" />
                            Mark Attendance
                        </h2>
                        <form onSubmit={handleMarkAttendance} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-sm font-semibold text-slate-600">Employee</label>
                                <select
                                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-2.5 outline-none focus:ring-2 ring-primary-500/20"
                                    value={selectedEmployee}
                                    onChange={(e) => setSelectedEmployee(e.target.value)}
                                    required
                                >
                                    <option value="">Select Employee</option>
                                    {employees.map(emp => (
                                        <option key={emp.id} value={emp.id}>{emp.full_name} ({emp.employee_id})</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-semibold text-slate-600">Date</label>
                                <input
                                    type="date"
                                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-2.5 outline-none focus:ring-2 ring-primary-500/20"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    max={new Date().toISOString().split('T')[0]}
                                    required
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-semibold text-slate-600">Status</label>
                                <div className="flex gap-4">
                                    <label className={`flex-1 flex items-center justify-center gap-2 border-2 rounded-xl p-3 cursor-pointer transition-all ${status === 'Present' ? 'border-primary-600 bg-primary-50 text-primary-600' : 'border-transparent bg-slate-50'}`}>
                                        <input type="radio" className="hidden" value="Present" checked={status === 'Present'} onChange={(e) => setStatus(e.target.value)} />
                                        <CheckCircle2 size={18} /> Present
                                    </label>
                                    <label className={`flex-1 flex items-center justify-center gap-2 border-2 rounded-xl p-3 cursor-pointer transition-all ${status === 'Absent' ? 'border-rose-600 bg-rose-50 text-rose-600' : 'border-transparent bg-slate-50'}`}>
                                        <input type="radio" className="hidden" value="Absent" checked={status === 'Absent'} onChange={(e) => setStatus(e.target.value)} />
                                        <XCircle size={18} /> Absent
                                    </label>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={marking}
                                className="w-full bg-primary-600 text-white font-bold py-3 rounded-xl mt-4 hover:bg-primary-700 transition-colors shadow-lg shadow-primary-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {marking ? <Loader2 className="animate-spin" size={20} /> : "Submit Record"}
                            </button>
                        </form>
                    </div>
                </div>

                {/* History Table */}
                <div className="lg:col-span-2">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between flex-wrap gap-4">
                            <h2 className="text-lg font-bold">Attendance History</h2>
                            <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 px-4 py-2 rounded-xl">
                                <Filter size={16} className="text-slate-400" />
                                <select
                                    className="bg-transparent border-none text-sm outline-none focus:ring-0"
                                    value={filterEmployeeId}
                                    onChange={(e) => setFilterEmployeeId(e.target.value)}
                                >
                                    <option value="">All Employees</option>
                                    {employees.map(emp => (
                                        <option key={emp.id} value={emp.id}>{emp.full_name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 font-medium text-sm">
                                    <tr>
                                        <th className="px-6 py-4">Date</th>
                                        <th className="px-6 py-4">Employee</th>
                                        <th className="px-6 py-4">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {loading ? (
                                        <tr>
                                            <td colSpan="3" className="px-6 py-12 text-center">
                                                <Loader2 className="animate-spin inline-block text-primary-600 mb-2" size={24} />
                                            </td>
                                        </tr>
                                    ) : attendanceRecords.length === 0 ? (
                                        <tr>
                                            <td colSpan="3" className="px-6 py-12 text-center">
                                                <p className="text-slate-500">No attendance records found.</p>
                                            </td>
                                        </tr>
                                    ) : (
                                        attendanceRecords.map((record) => (
                                            <tr key={record.id} className="hover:bg-slate-50">
                                                <td className="px-6 py-4 font-medium">{record.date}</td>
                                                <td className="px-6 py-4">{record.employee_name}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${record.status === 'Present'
                                                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
                                                            : 'bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400'
                                                        }`}>
                                                        {record.status === 'Present' ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                                                        {record.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Attendance;
