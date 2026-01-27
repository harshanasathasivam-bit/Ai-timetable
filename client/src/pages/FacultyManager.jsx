import React, { useState, useEffect } from 'react';
import API from '../utils/api';
import { toast } from 'react-toastify';

const FacultyManager = () => {
    const [faculty, setFaculty] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        designation: '',
        department: '',
        maxLoad: 16
    });

    useEffect(() => {
        fetchFaculty();
    }, []);

    const fetchFaculty = async () => {
        try {
            const { data } = await API.get('/data/faculty');
            setFaculty(data);
        } catch (error) {
            toast.error('Failed to fetch faculty');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.post('/data/faculty', formData);
            toast.success('Faculty Added');
            fetchFaculty();
            setFormData({ name: '', email: '', designation: '', department: '', maxLoad: 16 });
        } catch (error) {
            toast.error('Failed to add faculty');
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded shadow">
                <h2 className="text-xl font-bold mb-4">Add New Faculty</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        type="text"
                        placeholder="Name"
                        className="border p-2 rounded"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        className="border p-2 rounded"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Designation"
                        className="border p-2 rounded"
                        value={formData.designation}
                        onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Department"
                        className="border p-2 rounded"
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    />
                    <input
                        type="number"
                        placeholder="Max Load (Hours/Week)"
                        className="border p-2 rounded"
                        value={formData.maxLoad}
                        onChange={(e) => setFormData({ ...formData, maxLoad: e.target.value })}
                    />
                    <button type="submit" className="bg-indigo-600 text-white p-2 rounded md:col-span-2">
                        Add Faculty
                    </button>
                </form>
            </div>

            <div className="bg-white p-6 rounded shadow">
                <h2 className="text-xl font-bold mb-4">Faculty List</h2>
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b">
                            <th className="p-2">Name</th>
                            <th className="p-2">Email</th>
                            <th className="p-2">Department</th>
                            <th className="p-2">Max Load</th>
                        </tr>
                    </thead>
                    <tbody>
                        {faculty.map((fac) => (
                            <tr key={fac._id} className="border-b">
                                <td className="p-2">{fac.name}</td>
                                <td className="p-2">{fac.email}</td>
                                <td className="p-2">{fac.department}</td>
                                <td className="p-2">{fac.maxLoad}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default FacultyManager;
