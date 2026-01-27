import React, { useState, useEffect } from 'react';
import API from '../utils/api';
import { toast } from 'react-toastify';

const RoomsManager = () => {
    const [rooms, setRooms] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        capacity: '',
        type: 'Classroom'
    });

    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        try {
            const { data } = await API.get('/data/rooms');
            setRooms(data);
        } catch (error) {
            toast.error('Failed to fetch rooms');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.post('/data/rooms', formData);
            toast.success('Room Added');
            fetchRooms();
            setFormData({ name: '', capacity: '', type: 'Classroom' });
        } catch (error) {
            toast.error('Failed to add room');
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded shadow">
                <h2 className="text-xl font-bold mb-4">Add New Room</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        type="text"
                        placeholder="Room Name (e.g. 101)"
                        className="border p-2 rounded"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                    <input
                        type="number"
                        placeholder="Capacity"
                        className="border p-2 rounded"
                        value={formData.capacity}
                        onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                        required
                    />
                    <select
                        className="border p-2 rounded"
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    >
                        <option value="Classroom">Classroom</option>
                        <option value="Lab">Lab</option>
                        <option value="Seminar Hall">Seminar Hall</option>
                    </select>
                    <button type="submit" className="bg-indigo-600 text-white p-2 rounded md:col-span-2">
                        Add Room
                    </button>
                </form>
            </div>

            <div className="bg-white p-6 rounded shadow">
                <h2 className="text-xl font-bold mb-4">Room List</h2>
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b">
                            <th className="p-2">Name</th>
                            <th className="p-2">Capacity</th>
                            <th className="p-2">Type</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rooms.map((room) => (
                            <tr key={room._id} className="border-b">
                                <td className="p-2">{room.name}</td>
                                <td className="p-2">{room.capacity}</td>
                                <td className="p-2">{room.type}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RoomsManager;
