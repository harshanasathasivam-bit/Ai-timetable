import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Calendar, Send, Clock, CheckCircle, XCircle, ChevronLeft } from 'lucide-react';
import API from '../utils/api';
import { toast } from 'react-toastify';

const LeaveApplication = () => {
    const [leaves, setLeaves] = useState([]);
    const [formData, setFormData] = useState({
        startDate: '',
        endDate: '',
        reason: ''
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        fetchMyLeaves();
    }, []);

    const fetchMyLeaves = async () => {
        try {
            const { data } = await API.get('/leaves');
            setLeaves(data);
        } catch (error) {
            toast.error('Failed to fetch leave history');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await API.post('/leaves', formData);
            toast.success('Leave Application Submitted');
            setFormData({ startDate: '', endDate: '', reason: '' });
            fetchMyLeaves();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to submit application');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Approved':
                return <span className="bg-green-100 text-green-800 text-xs font-bold px-2.5 py-0.5 rounded flex items-center w-fit"><CheckCircle size={12} className="mr-1" /> Approved</span>;
            case 'Rejected':
                return <span className="bg-red-100 text-red-800 text-xs font-bold px-2.5 py-0.5 rounded flex items-center w-fit"><XCircle size={12} className="mr-1" /> Rejected</span>;
            default:
                return <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2.5 py-0.5 rounded flex items-center w-fit"><Clock size={12} className="mr-1" /> Pending</span>;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-indigo-900 text-white p-4 shadow-lg flex justify-between items-center sticky top-0 z-10">
                <div className="text-2xl font-bold flex items-center cursor-pointer" onClick={() => navigate('/faculty-dashboard')}>
                    <Calendar className="mr-2" /> Faculty Portal
                </div>
                <div className="flex items-center space-x-4">
                    <span className="hidden md:inline text-sm text-indigo-200">Logged in as: <span className="text-white font-bold">{user?.name}</span></span>
                    <button
                        onClick={handleLogout}
                        className="flex items-center bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-md"
                    >
                        <LogOut className="mr-2" size={18} /> Logout
                    </button>
                </div>
            </header>

            <main className="p-6 max-w-6xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => navigate('/faculty-dashboard')}
                            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                        >
                            <ChevronLeft size={24} className="text-gray-600" />
                        </button>
                        <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">Leave Management</h1>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Form Section */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                            <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 p-5 text-white font-bold flex items-center">
                                <Send className="mr-2" size={20} /> Apply for New Leave
                            </div>
                            <form onSubmit={handleSubmit} className="p-6 space-y-5">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Out Date & Time</label>
                                    <input
                                        type="datetime-local"
                                        className="w-full border-2 border-gray-100 rounded-xl p-3 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all"
                                        value={formData.startDate}
                                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">In Date & Time</label>
                                    <input
                                        type="datetime-local"
                                        className="w-full border-2 border-gray-100 rounded-xl p-3 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all"
                                        value={formData.endDate}
                                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Reason</label>
                                    <textarea
                                        className="w-full border-2 border-gray-100 rounded-xl p-3 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all h-32 resize-none"
                                        placeholder="Please provide a detailed reason for your leave request..."
                                        value={formData.reason}
                                        onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                        required
                                    ></textarea>
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-indigo-200 active:scale-[0.98] disabled:bg-indigo-300 disabled:shadow-none"
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Processing...
                                        </span>
                                    ) : 'Submit Application'}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* History Section */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 h-full">
                            <div className="bg-gray-800 p-5 text-white font-bold flex items-center">
                                <Clock className="mr-2" size={20} /> Application History
                            </div>
                            <div className="p-0">
                                {leaves.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="bg-gray-50 border-b border-gray-100">
                                                    <th className="p-5 font-bold text-gray-500 uppercase text-xs tracking-wider">Dates</th>
                                                    <th className="p-5 font-bold text-gray-500 uppercase text-xs tracking-wider">Reason</th>
                                                    <th className="p-5 font-bold text-gray-500 uppercase text-xs tracking-wider">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {leaves.map((leave) => (
                                                    <tr key={leave._id} className="border-b border-gray-50 hover:bg-indigo-50/30 transition-colors">
                                                        <td className="p-5">
                                                            <div className="text-sm font-bold text-gray-800">
                                                                {new Date(leave.startDate).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })} -
                                                                {new Date(leave.endDate).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                            </div>
                                                            <div className="text-[10px] text-gray-400 mt-1 font-medium">Applied: {new Date(leave.appliedAt).toLocaleString()}</div>
                                                        </td>
                                                        <td className="p-5 text-sm text-gray-600 leading-relaxed">
                                                            {leave.reason}
                                                        </td>
                                                        <td className="p-5">
                                                            {getStatusBadge(leave.status)}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="text-center py-24 text-gray-400">
                                        <Clock size={48} className="mx-auto mb-4 opacity-10" />
                                        <p className="text-lg font-medium">No leave applications found.</p>
                                        <p className="text-sm">Your history will appear here once you submit a request.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="p-10 text-center text-gray-400 text-sm">
                &copy; {new Date().getFullYear()} NEP Intelligent Timetable Generator. All rights reserved.
            </footer>
        </div>
    );
};

export default LeaveApplication;
