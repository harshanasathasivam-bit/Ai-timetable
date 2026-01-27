import React, { useState, useEffect } from 'react';
import API from '../utils/api';
import { toast } from 'react-toastify';

const CoursesManager = () => {
    const [courses, setCourses] = useState([]);
    const [programs, setPrograms] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        code: '',
        credits: 4,
        type: 'Theory',
        semester: '',
        program: ''
    });

    useEffect(() => {
        fetchCourses();
        fetchPrograms();
    }, []);

    const fetchCourses = async () => {
        try {
            const { data } = await API.get('/data/courses');
            setCourses(data);
        } catch (error) {
            toast.error('Failed to fetch courses');
        }
    };

    const fetchPrograms = async () => {
        try {
            const { data } = await API.get('/data/programs');
            setPrograms(data);
        } catch (error) {
            toast.error('Failed to fetch programs');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.program) {
            toast.error('Please select a program');
            return;
        }
        try {
            await API.post('/data/courses', formData);
            toast.success('Course Added Successfully');
            fetchCourses();
            setFormData({
                title: '',
                code: '',
                credits: 4,
                type: 'Theory',
                semester: '',
                program: formData.program // Keep the program selected for convenience
            });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add course');
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded shadow">
                <h2 className="text-xl font-bold mb-4">Add New Course</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        type="text"
                        placeholder="Course Title (e.g. Operating Systems)"
                        className="border p-2 rounded"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Course Code (e.g. CS301)"
                        className="border p-2 rounded"
                        value={formData.code}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                        required
                    />
                    <select
                        className="border p-2 rounded"
                        value={formData.program}
                        onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                        required
                    >
                        <option value="">Select Program</option>
                        {programs.map(p => (
                            <option key={p._id} value={p._id}>{p.name}</option>
                        ))}
                    </select>
                    <input
                        type="number"
                        placeholder="Semester"
                        className="border p-2 rounded"
                        value={formData.semester}
                        onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                        required
                    />
                    <input
                        type="number"
                        placeholder="Credits"
                        className="border p-2 rounded"
                        value={formData.credits}
                        onChange={(e) => setFormData({ ...formData, credits: e.target.value })}
                        required
                    />
                    <select
                        className="border p-2 rounded"
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    >
                        <option value="Theory">Theory</option>
                        <option value="Lab">Lab</option>
                    </select>
                    <button type="submit" className="bg-indigo-600 text-white p-2 rounded md:col-span-2">
                        Add Course
                    </button>
                </form>
            </div>

            <div className="bg-white p-6 rounded shadow">
                <h2 className="text-xl font-bold mb-4">Existing Courses</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b bg-gray-50">
                                <th className="p-2">Code</th>
                                <th className="p-2">Title</th>
                                <th className="p-2">Program</th>
                                <th className="p-2">Sem</th>
                                <th className="p-2">Type</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courses.map((course) => {
                                const prog = programs.find(p => p._id === course.program);
                                return (
                                    <tr key={course._id} className="border-b hover:bg-gray-50">
                                        <td className="p-2 font-mono text-sm">{course.code}</td>
                                        <td className="p-2">{course.title}</td>
                                        <td className="p-2 text-sm text-gray-600">{prog ? prog.name : 'Unknown'}</td>
                                        <td className="p-2">{course.semester}</td>
                                        <td className="p-2 text-sm">{course.type}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CoursesManager;
