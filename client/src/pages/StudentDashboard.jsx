import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Calendar, Info } from 'lucide-react';
import API from '../utils/api';
import { toast } from 'react-toastify';
import { PERIOD_TIMINGS } from '../utils/constants';

const StudentDashboard = () => {
    const [timetables, setTimetables] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        fetchTimetables();
    }, []);

    const fetchTimetables = async () => {
        try {
            const { data } = await API.get('/timetable');
            setTimetables(data);
        } catch (error) {
            toast.error('Failed to fetch timetables');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <header className="bg-indigo-800 text-white p-4 shadow-md flex justify-between items-center">
                <div className="text-2xl font-bold flex items-center">
                    <Calendar className="mr-2" /> NEP Timetable Portal
                </div>
                <div className="flex items-center space-x-4">
                    <span className="hidden md:inline">Welcome, {user?.name} ({user?.role})</span>
                    <button
                        onClick={handleLogout}
                        className="flex items-center bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm transition"
                    >
                        <LogOut className="mr-2" size={16} /> Logout
                    </button>
                </div>
            </header>

            <main className="p-6 max-w-6xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">Your Timetable</h2>

                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-800"></div>
                        </div>
                    ) : timetables.length > 0 ? (
                        <div className="space-y-8">
                            {timetables.map((tt) => (
                                <div key={tt._id} className="border rounded-lg overflow-hidden shadow-sm">
                                    <div className="bg-indigo-50 p-4 border-b">
                                        <h3 className="font-bold text-xl text-indigo-900">
                                            {tt.program?.name} - Semester {tt.semester}
                                        </h3>
                                        <p className="text-sm text-indigo-700">Academic Year: {tt.academicYear}</p>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full border-collapse">
                                            <thead>
                                                <tr className="bg-gray-100 text-left">
                                                    <th className="border p-3 font-bold text-gray-700">Day</th>
                                                    {[1, 2, 3, 4, 5, 6, 7, 8].map(p => (
                                                        <th key={p} className="border p-3 font-bold text-gray-700 text-center">
                                                            <div className="text-[10px] font-normal text-gray-500 uppercase tracking-tighter">{PERIOD_TIMINGS[p]}</div>
                                                            Period {p}
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {tt.schedule.map((daySch, idx) => (
                                                    <tr key={idx} className="hover:bg-gray-50 transition">
                                                        <td className="border p-3 font-bold text-gray-800 bg-gray-50">{daySch.day}</td>
                                                        {daySch.periods.map((p, pIdx) => (
                                                            <td key={pIdx} className="border p-3 text-center min-w-[120px]">
                                                                {p.course ? (
                                                                    <>
                                                                        <div className="font-bold text-indigo-700">{p.course.code}</div>
                                                                        <div className="text-xs font-medium text-gray-800 mt-1">{p.course.title}</div>
                                                                        <div className="text-xs text-gray-600 mt-1 italic">{p.faculty?.name || 'No Faculty'}</div>
                                                                        <div className="text-xs text-gray-500 mt-1 font-mono">Room: {p.room?.name || 'N/A'}</div>
                                                                    </>
                                                                ) : (
                                                                    <div className="text-gray-300 italic">No Class</div>
                                                                )}
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="bg-yellow-100 p-4 rounded-full mb-4">
                                <Info className="text-yellow-600" size={48} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">No Timetable Generated Yet</h3>
                            <p className="text-gray-600 max-w-md">
                                Your department hasn't published the timetable for this semester yet.
                                <span className="block mt-2 font-semibold text-indigo-600">Please stay tuned!</span>
                            </p>
                        </div>
                    )}
                </div>
            </main>

            <footer className="mt-auto p-6 text-center text-gray-500 text-sm">
                &copy; {new Date().getFullYear()} NEP Intelligent Timetable Generator. All rights reserved.
            </footer>
        </div>
    );
};

export default StudentDashboard;
