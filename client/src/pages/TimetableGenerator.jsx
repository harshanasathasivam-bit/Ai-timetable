import React, { useState, useEffect } from 'react';
import API from '../utils/api';
import { toast } from 'react-toastify';
import { PERIOD_TIMINGS } from '../utils/constants';

const TimetableGenerator = () => {
    const [programs, setPrograms] = useState([]);
    const [timetables, setTimetables] = useState([]);
    const [formData, setFormData] = useState({
        programId: '',
        semester: '',
        academicYear: '2025-26'
    });

    useEffect(() => {
        fetchPrograms();
        fetchTimetables();
    }, []);

    const fetchPrograms = async () => {
        try {
            const { data } = await API.get('/data/programs');
            setPrograms(data);
        } catch (error) {
            toast.error('Failed to fetch programs');
        }
    };

    const fetchTimetables = async () => {
        try {
            const { data } = await API.get('/timetable');
            setTimetables(data);
        } catch (error) {
            toast.error('Failed to fetch timetables');
        }
    };

    const handleGenerate = async (e) => {
        e.preventDefault();
        try {
            await API.post('/timetable/generate', formData);
            toast.success('Timetable Generated Successfully');
            fetchTimetables();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to generate timetable');
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded shadow">
                <h2 className="text-xl font-bold mb-4">Generate Timetable</h2>
                <form onSubmit={handleGenerate} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <select
                        className="border p-2 rounded"
                        value={formData.programId}
                        onChange={(e) => setFormData({ ...formData, programId: e.target.value })}
                        required
                    >
                        <option value="">Select Program</option>
                        {programs.map((prog) => (
                            <option key={prog._id} value={prog._id}>{prog.name}</option>
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
                        type="text"
                        placeholder="Academic Year"
                        className="border p-2 rounded"
                        value={formData.academicYear}
                        onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                        required
                    />
                    <button type="submit" className="bg-green-600 text-white p-2 rounded md:col-span-3">
                        Generate Timetable
                    </button>
                </form>
            </div>

            <div className="bg-white p-6 rounded shadow">
                <h2 className="text-xl font-bold mb-4">Generated Timetables</h2>
                <div className="space-y-4">
                    {timetables.map((tt) => (
                        <div key={tt._id} className="border p-4 rounded">
                            <h3 className="font-bold text-lg">{tt.program?.name} - Sem {tt.semester} ({tt.academicYear})</h3>
                            <div className="mt-2 overflow-x-auto">
                                <table className="w-full border-collapse border border-gray-300">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            <th className="border p-2">Day</th>
                                            {[1, 2, 3, 4, 5, 6, 7, 8].map(p => (
                                                <th key={p} className="border p-2">
                                                    <div className="text-xs font-normal text-gray-500">{PERIOD_TIMINGS[p]}</div>
                                                    Period {p}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tt.schedule.map((daySch, idx) => (
                                            <tr key={idx}>
                                                <td className="border p-2 font-bold">{daySch.day}</td>
                                                {daySch.periods.map((p, pIdx) => (
                                                    <td key={pIdx} className="border p-2 text-sm min-w-[120px]">
                                                        {p.course ? (
                                                            <>
                                                                <div className="font-bold text-indigo-700">{p.course.code || 'N/A'}</div>
                                                                <div className="text-[10px] text-gray-600 font-medium truncate" title={p.course.title}>{p.course.title}</div>
                                                                <div className="text-[10px] text-gray-500 mt-1 italic">{p.faculty?.name || 'No Faculty'}</div>
                                                                <div className="text-[10px] text-gray-400 font-mono">{p.room?.name || 'No Room'}</div>
                                                            </>
                                                        ) : (
                                                            <div className="text-gray-300 italic text-center">Empty</div>
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
            </div>
        </div>
    );
};

export default TimetableGenerator;
