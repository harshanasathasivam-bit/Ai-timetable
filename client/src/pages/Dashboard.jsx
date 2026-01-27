import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import ProgramsManager from './ProgramsManager';
import CoursesManager from './CoursesManager';
import FacultyManager from './FacultyManager';
import RoomsManager from './RoomsManager';
import TimetableGenerator from './TimetableGenerator';
import LeaveManagement from './LeaveManagement';
import { LogOut, LayoutDashboard, BookOpen, Users, School, Calendar, MessageSquare } from 'lucide-react';

const Dashboard = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-64 bg-indigo-800 text-white flex flex-col">
                <div className="p-4 text-2xl font-bold border-b border-indigo-700">
                    NEP Timetable
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <a href="/dashboard" className="flex items-center p-2 hover:bg-indigo-700 rounded">
                        <LayoutDashboard className="mr-3" size={20} /> Dashboard
                    </a>
                    <a href="/dashboard/programs" className="flex items-center p-2 hover:bg-indigo-700 rounded">
                        <BookOpen className="mr-3" size={20} /> Programs
                    </a>
                    <a href="/dashboard/courses" className="flex items-center p-2 hover:bg-indigo-700 rounded">
                        <BookOpen className="mr-3" size={20} /> Courses
                    </a>
                    <a href="/dashboard/faculty" className="flex items-center p-2 hover:bg-indigo-700 rounded">
                        <Users className="mr-3" size={20} /> Faculty
                    </a>
                    <a href="/dashboard/rooms" className="flex items-center p-2 hover:bg-indigo-700 rounded">
                        <School className="mr-3" size={20} /> Rooms
                    </a>
                    <a href="/dashboard/generate" className="flex items-center p-2 hover:bg-indigo-700 rounded">
                        <Calendar className="mr-3" size={20} /> Timetable
                    </a>
                    <a href="/dashboard/leaves" className="flex items-center p-2 hover:bg-indigo-700 rounded">
                        <MessageSquare className="mr-3" size={20} /> Leave Requests
                    </a>
                </nav>
                <div className="p-4 border-t border-indigo-700">
                    <div className="mb-2 text-sm">{user?.name}</div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center text-sm text-red-200 hover:text-white"
                    >
                        <LogOut className="mr-2" size={16} /> Logout
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                <header className="bg-white shadow p-4">
                    <h1 className="text-xl font-semibold text-gray-800">Admin Dashboard</h1>
                </header>
                <main className="p-6">
                    <Routes>
                        <Route path="/" element={<DashboardHome />} />
                        <Route path="/programs" element={<ProgramsManager />} />
                        <Route path="/courses" element={<CoursesManager />} />
                        <Route path="/faculty" element={<FacultyManager />} />
                        <Route path="/rooms" element={<RoomsManager />} />
                        <Route path="/generate" element={<TimetableGenerator />} />
                        <Route path="/leaves" element={<LeaveManagement />} />
                        {/* Add other routes here */}
                    </Routes>
                </main>
            </div>
        </div>
    );
};

import API from '../utils/api';
import { useEffect, useState } from 'react';

const DashboardHome = () => {
    const [stats, setStats] = useState({ programs: 0, courses: 0, faculty: 0, rooms: 0 });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await API.get('/data/stats');
                setStats(data);
            } catch (error) {
                console.error("Failed to fetch stats", error);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded shadow">
                <h3 className="text-lg font-bold text-gray-700">Total Programs</h3>
                <p className="text-3xl font-bold text-indigo-600">{stats.programs}</p>
            </div>
            <div className="bg-white p-6 rounded shadow">
                <h3 className="text-lg font-bold text-gray-700">Total Courses</h3>
                <p className="text-3xl font-bold text-indigo-600">{stats.courses}</p>
            </div>
            <div className="bg-white p-6 rounded shadow">
                <h3 className="text-lg font-bold text-gray-700">Total Faculty</h3>
                <p className="text-3xl font-bold text-indigo-600">{stats.faculty}</p>
            </div>
            <div className="bg-white p-6 rounded shadow">
                <h3 className="text-lg font-bold text-gray-700">Total Rooms</h3>
                <p className="text-3xl font-bold text-indigo-600">{stats.rooms}</p>
            </div>
        </div>
    );
};

const ProgramsView = () => (
    <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Manage Programs</h2>
        <p>Program management list will go here.</p>
    </div>
);

export default Dashboard;
