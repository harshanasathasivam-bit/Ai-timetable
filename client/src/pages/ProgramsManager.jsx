import React, { useState, useEffect } from 'react';
import API from '../utils/api';
import { toast } from 'react-toastify';

const ProgramsManager = () => {
    const [programs, setPrograms] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        type: 'FYUP',
        semesters: ''
    });

    useEffect(() => {
        fetchPrograms();
    }, []);

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
        try {
            const semestersArray = formData.semesters.split(',').map(Number);
            await API.post('/data/programs', { ...formData, semesters: semestersArray });
            toast.success('Program Created');
            fetchPrograms();
            setFormData({ name: '', code: '', type: 'FYUP', semesters: '' });
        } catch (error) {
            toast.error('Failed to create program');
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded shadow">
                <h2 className="text-xl font-bold mb-4">Add New Program</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        type="text"
                        placeholder="Program Name (e.g. B.Sc. CS)"
                        className="border p-2 rounded"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Program Code (e.g. BSC-CS)"
                        className="border p-2 rounded"
                        value={formData.code}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                        required
                    />
                    <select
                        className="border p-2 rounded"
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    >
                        <option value="FYUP">FYUP</option>
                        <option value="B.Ed">B.Ed</option>
                        <option value="M.Ed">M.Ed</option>
                        <option value="ITEP">ITEP</option>
                    </select>
                    <input
                        type="text"
                        placeholder="Semesters (e.g. 1,2,3,4)"
                        className="border p-2 rounded"
                        value={formData.semesters}
                        onChange={(e) => setFormData({ ...formData, semesters: e.target.value })}
                        required
                    />
                    <button type="submit" className="bg-indigo-600 text-white p-2 rounded md:col-span-2">
                        Add Program
                    </button>
                </form>
            </div>

            <div className="bg-white p-6 rounded shadow">
                <h2 className="text-xl font-bold mb-4">Existing Programs</h2>
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b">
                            <th className="p-2">Code</th>
                            <th className="p-2">Name</th>
                            <th className="p-2">Type</th>
                            <th className="p-2">Semesters</th>
                        </tr>
                    </thead>
                    <tbody>
                        {programs.map((prog) => (
                            <tr key={prog._id} className="border-b">
                                <td className="p-2">{prog.code}</td>
                                <td className="p-2">{prog.name}</td>
                                <td className="p-2">{prog.type}</td>
                                <td className="p-2">{prog.semesters.join(', ')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProgramsManager;
