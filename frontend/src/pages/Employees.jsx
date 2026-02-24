import React, { useState, useEffect } from 'react';
import { employeeApi } from '../api';
import { Plus, Trash2, Search, Mail, Building, User, Loader2, X } from 'lucide-react';

const Employees = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        employee_id: '',
        full_name: '',
        email: '',
        department: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchEmployees = async () => {
        try {
            setLoading(true);
            const res = await employeeApi.list();
            setEmployees(res.data);
        } catch (err) {
            console.error(err);
            setError("Failed to load employees");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        try {
            await employeeApi.create(formData);
            setShowModal(false);
            setFormData({ employee_id: '', full_name: '', email: '', department: '' });
            fetchEmployees();
        } catch (err) {
            const errorMsg = err.response?.data ? JSON.stringify(err.response.data) : "Failed to add employee";
            setError(errorMsg);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this employee?")) return;
        try {
            await employeeApi.delete(id);
            fetchEmployees();
        } catch (err) {
            alert("Failed to delete employee");
        }
    };

    const filteredEmployees = employees.filter(emp =>
        emp.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.employee_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.department.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Employee Directory</h1>
                    <p className="text-slate-500">Manage your workforce records.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-primary-600 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 hover:bg-primary-700 transition-colors shadow-lg shadow-primary-500/20"
                >
                    <Plus size={20} /> Add Employee
                </button>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
                    <Search size={20} className="text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by name, ID or department..."
                        className="flex-1 bg-transparent border-none focus:ring-0 text-sm outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 font-medium text-sm">
                            <tr>
                                <th className="px-6 py-4">Employee ID</th>
                                <th className="px-6 py-4">Full Name</th>
                                <th className="px-6 py-4">Email</th>
                                <th className="px-6 py-4">Department</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center">
                                        <Loader2 className="animate-spin inline-block text-primary-600 mb-2" size={24} />
                                        <p className="text-slate-500 text-sm">Loading records...</p>
                                    </td>
                                </tr>
                            ) : filteredEmployees.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center">
                                        <p className="text-slate-500">No employees found.</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredEmployees.map((emp) => (
                                    <tr key={emp.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                        <td className="px-6 py-4 font-mono text-xs font-bold text-primary-600 bg-primary-50 dark:bg-primary-900/10 inline-block m-4 rounded-md uppercase">
                                            {emp.employee_id}
                                        </td>
                                        <td className="px-6 py-4 font-semibold">{emp.full_name}</td>
                                        <td className="px-6 py-4 text-slate-500 text-sm">{emp.email}</td>
                                        <td className="px-6 py-4">
                                            <span className="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full text-xs font-medium">
                                                {emp.department}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleDelete(emp.id)}
                                                className="text-rose-500 hover:text-rose-700 p-2 hover:bg-rose-50 dark:hover:bg-rose-900/10 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Employee Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all">
                        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
                            <h2 className="text-xl font-bold">Add New Employee</h2>
                            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {error && (
                                <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-xl text-sm mb-4">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-1">
                                <label className="text-sm font-semibold flex items-center gap-2">
                                    <User size={14} className="text-slate-400" /> Employee ID
                                </label>
                                <input
                                    required
                                    name="employee_id"
                                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-2.5 outline-none focus:ring-2 ring-primary-500/20"
                                    placeholder="EMP001"
                                    value={formData.employee_id}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-semibold flex items-center gap-2">
                                    <User size={14} className="text-slate-400" /> Full Name
                                </label>
                                <input
                                    required
                                    name="full_name"
                                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-2.5 outline-none focus:ring-2 ring-primary-500/20"
                                    placeholder="John Doe"
                                    value={formData.full_name}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-semibold flex items-center gap-2">
                                    <Mail size={14} className="text-slate-400" /> Email Address
                                </label>
                                <input
                                    required
                                    type="email"
                                    name="email"
                                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-2.5 outline-none focus:ring-2 ring-primary-500/20"
                                    placeholder="john@example.com"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-semibold flex items-center gap-2">
                                    <Building size={14} className="text-slate-400" /> Department
                                </label>
                                <select
                                    required
                                    name="department"
                                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-2.5 outline-none focus:ring-2 ring-primary-500/20"
                                    value={formData.department}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select Department</option>
                                    <option value="Engineering">Engineering</option>
                                    <option value="HR">HR</option>
                                    <option value="Sales">Sales</option>
                                    <option value="Marketing">Marketing</option>
                                    <option value="Finance">Finance</option>
                                </select>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-4 py-2.5 rounded-xl font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 px-4 py-2.5 rounded-xl font-semibold bg-primary-600 text-white hover:bg-primary-700 flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {submitting ? <Loader2 className="animate-spin" size={20} /> : "Save Employee"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Employees;
