import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Calendar, Search, User, BookOpen, MessageSquare } from 'lucide-react';
import API from '../utils/api';
import { toast } from 'react-toastify';
import { PERIOD_TIMINGS } from '../utils/constants';

const FacultyDashboard = () => {
    const [timetables, setTimetables] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
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

    // Filter timetables for "My Schedule"
    // In Mock Mode, we'll match by name since IDs might not align perfectly between signup and admin entry
    const mySchedule = timetables.map(tt => ({
        ...tt,
        schedule: tt.schedule.map(day => ({
            ...day,
            periods: day.periods.filter(p => p.faculty?.name === user?.name || p.faculty?._id === user?._id)
        })).filter(day => day.periods.length > 0)
    })).filter(tt => tt.schedule.length > 0);

    // Filter timetables for Search
    const filteredTimetables = timetables.filter(tt =>
        tt.program?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tt.semester?.toString().includes(searchQuery) ||
        tt.schedule.some(day => day.periods.some(p => p.course?.title?.toLowerCase().includes(searchQuery.toLowerCase())))
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-indigo-900 text-white p-4 shadow-lg flex justify-between items-center sticky top-0 z-10">
                <div className="text-2xl font-bold flex items-center">
                    <Calendar className="mr-2" /> Faculty Portal
                </div>
                <div className="flex items-center space-x-6">
                    <button
                        onClick={() => navigate('/leave-application')}
                        className="hidden md:flex items-center text-indigo-200 hover:text-white font-bold transition"
                    >
                        <MessageSquare className="mr-2" size={18} /> Apply Leave
                    </button>
                    <div className="hidden md:flex flex-col items-end">
                        <span className="font-semibold">{user?.name}</span>
                        <span className="text-xs text-indigo-200">Faculty Member</span>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-md"
                    >
                        <LogOut className="mr-2" size={18} /> Logout
                    </button>
                </div>
            </header>

            <main className="p-6 max-w-7xl mx-auto space-y-8">
                {/* My Schedule Section */}
                <section className="bg-white rounded-xl shadow-md overflow-hidden border border-indigo-100">
                    <div className="bg-indigo-600 p-4 flex items-center text-white">
                        <User className="mr-2" />
                        <h2 className="text-xl font-bold">My Teaching Schedule</h2>
                    </div>
                    <div className="p-6">
                        {mySchedule.length > 0 ? (
                            <div className="grid grid-cols-1 gap-6">
                                {mySchedule.map((tt, idx) => (
                                    <div key={idx} className="border rounded-lg p-4 bg-indigo-50">
                                        <h3 className="font-bold text-indigo-800 mb-4 border-b border-indigo-200 pb-2">
                                            {tt.program?.name} - Semester {tt.semester}
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {tt.schedule.map((day, dIdx) => (
                                                <div key={dIdx} className="bg-white p-3 rounded shadow-sm border-l-4 border-indigo-500">
                                                    <div className="font-bold text-gray-700 mb-2">{day.day}</div>
                                                    {day.periods.map((p, pIdx) => (
                                                        <div key={pIdx} className="text-sm space-y-1">
                                                            <div className="flex justify-between">
                                                                <span className="font-bold text-indigo-600">
                                                                    Period {p.periodNumber}
                                                                    <span className="block text-[10px] font-normal text-gray-400">{PERIOD_TIMINGS[p.periodNumber]}</span>
                                                                </span>
                                                                <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-xs font-bold h-fit">{p.type}</span>
                                                            </div>
                                                            <div className="font-semibold text-gray-800">{p.course?.title} ({p.course?.code})</div>
                                                            <div className="text-gray-500 flex items-center">
                                                                <BookOpen size={12} className="mr-1" /> Room: {p.room?.name}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10 text-gray-500">
                                <p>No classes assigned to you yet.</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* Search Student Timetables Section */}
                <section className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
                    <div className="bg-gray-800 p-4 flex flex-col md:flex-row md:items-center justify-between text-white space-y-4 md:space-y-0">
                        <div className="flex items-center">
                            <Search className="mr-2" />
                            <h2 className="text-xl font-bold">Search Student Timetables</h2>
                        </div>
                        <div className="relative w-full md:w-96">
                            <input
                                type="text"
                                placeholder="Search by Program, Course, or Semester..."
                                className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 border-none"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                        </div>
                    </div>

                    <div className="p-6">
                        {loading ? (
                            <div className="flex justify-center py-10">
                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
                            </div>
                        ) : filteredTimetables.length > 0 ? (
                            <div className="space-y-6">
                                {filteredTimetables.map((tt) => (
                                    <div key={tt._id} className="border rounded-lg overflow-hidden">
                                        <div className="bg-gray-50 p-3 border-b flex justify-between items-center">
                                            <span className="font-bold text-gray-700">{tt.program?.name} - Sem {tt.semester}</span>
                                            <span className="text-xs text-gray-500">{tt.academicYear}</span>
                                        </div>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm border-collapse">
                                                <thead>
                                                    <tr className="bg-gray-100">
                                                        <th className="border p-2 text-left">Day</th>
                                                        {[1, 2, 3, 4, 5, 6, 7, 8].map(p => (
                                                            <th key={p} className="border p-2 text-center">
                                                                <div className="text-[9px] font-normal text-gray-400 leading-none mb-1">{PERIOD_TIMINGS[p].split(' - ')[0]}</div>
                                                                P{p}
                                                            </th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {tt.schedule.map((day, idx) => (
                                                        <tr key={idx}>
                                                            <td className="border p-2 font-bold bg-gray-50">{day.day}</td>
                                                            {day.periods.map((p, pIdx) => (
                                                                <td key={pIdx} className="border p-2 text-center min-w-[80px]">
                                                                    {p.course ? (
                                                                        <>
                                                                            <div className="font-bold text-indigo-600">{p.course.code}</div>
                                                                            <div className="text-[10px] text-gray-500 truncate">{p.faculty?.name || 'No Faculty'}</div>
                                                                        </>
                                                                    ) : (
                                                                        <div className="text-gray-300 italic text-[10px]">No Class</div>
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
                            <div className="text-center py-10 text-gray-500">
                                <p>No timetables found matching your search.</p>
                            </div>
                        )}
                    </div>
                </section>
            </main>

            <footer className="p-8 text-center text-gray-400 text-sm">
                &copy; {new Date().getFullYear()} NEP Intelligent Timetable Generator
            </footer>
        </div>
    );
};

export default FacultyDashboard;
