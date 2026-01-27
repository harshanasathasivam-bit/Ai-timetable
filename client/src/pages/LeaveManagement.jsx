import React, { useState, useEffect } from 'react';
import API from '../utils/api';
import { toast } from 'react-toastify';
import { Check, X, Clock, User, Calendar as CalendarIcon } from 'lucide-react';

const LeaveManagement = () => {
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAllLeaves();
    }, []);

    const fetchAllLeaves = async () => {
        try {
            const { data } = await API.get('/leaves/admin');
            setLeaves(data);
        } catch (error) {
            toast.error('Failed to fetch leave applications');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (leaveId, status) => {
        try {
            await API.put(`/leaves/${leaveId}/status`, { status });
            toast.success(`Leave ${status}`);
            fetchAllLeaves();
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                    <CalendarIcon className="mr-2 text-indigo-600" /> Faculty Leave Requests
                </h2>

                {loading ? (
                    <div className="flex justify-center py-10">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
                    </div>
                ) : leaves.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b">
                                    <th className="p-4 font-bold text-gray-600">Faculty</th>
                                    <th className="p-4 font-bold text-gray-600">Duration</th>
                                    <th className="p-4 font-bold text-gray-600">Reason</th>
                                    <th className="p-4 font-bold text-gray-600">Status</th>
                                    <th className="p-4 font-bold text-gray-600 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leaves.map((leave) => (
                                    <tr key={leave._id} className="border-b hover:bg-gray-50 transition">
                                        <td className="p-4">
                                            <div className="flex items-center">
                                                <div className="bg-indigo-100 p-2 rounded-full mr-3">
                                                    <User size={16} className="text-indigo-600" />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-800">{leave.facultyName || leave.faculty?.name}</div>
                                                    <div className="text-xs text-gray-500">{leave.faculty?.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="text-sm font-semibold text-gray-700">
                                                {new Date(leave.startDate).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })} -
                                                {new Date(leave.endDate).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                            <div className="text-[10px] text-gray-400 font-mono">
                                                Applied: {new Date(leave.appliedAt).toLocaleString()}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <p className="text-sm text-gray-600 max-w-xs truncate" title={leave.reason}>
                                                {leave.reason}
                                            </p>
                                        </td>
                                        <td className="p-4">
                                            {leave.status === 'Pending' ? (
                                                <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2.5 py-0.5 rounded flex items-center w-fit">
                                                    <Clock size={12} className="mr-1" /> Pending
                                                </span>
                                            ) : leave.status === 'Approved' ? (
                                                <span className="bg-green-100 text-green-800 text-xs font-bold px-2.5 py-0.5 rounded flex items-center w-fit">
                                                    <Check size={12} className="mr-1" /> Approved
                                                </span>
                                            ) : (
                                                <span className="bg-red-100 text-red-800 text-xs font-bold px-2.5 py-0.5 rounded flex items-center w-fit">
                                                    <X size={12} className="mr-1" /> Rejected
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            {leave.status === 'Pending' && (
                                                <div className="flex justify-center space-x-2">
                                                    <button
                                                        onClick={() => handleStatusUpdate(leave._id, 'Approved')}
                                                        className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition shadow-sm"
                                                        title="Approve"
                                                    >
                                                        <Check size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusUpdate(leave._id, 'Rejected')}
                                                        className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition shadow-sm"
                                                        title="Reject"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-20 text-gray-400">
                        <Clock size={48} className="mx-auto mb-4 opacity-20" />
                        <p className="text-lg">No leave requests to show.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LeaveManagement;
