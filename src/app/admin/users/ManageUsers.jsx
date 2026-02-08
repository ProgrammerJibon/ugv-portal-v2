"use client";

import React, { useState, useEffect } from 'react';
import {
    getUsersAction,
    toggleUserStatusAction,
    resetPasswordAction
} from './userManagementActions';
import { FaSearch, FaUserEdit, FaUnlockAlt, FaBan, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import Section from '@/Components/Section';

const ManageUsers = ({ user }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [actionLoading, setActionLoading] = useState(null); // Stores ID of user currently being updated

    // 1. Load Users on Mount
    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        const res = await getUsersAction();
        if (res.status === 'success') {
            setUsers(res.data);
        }
        setLoading(false);
    };

    // 2. Handle Search Filter
    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.user_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email_address.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // 3. Action Handlers
    const handleStatusToggle = async (id, currentStatus) => {
        if (!confirm(`Are you sure you want to ${currentStatus === 'ACTIVE' ? 'DEACTIVATE' : 'ACTIVATE'} this user?`)) return;

        setActionLoading(id);
        const res = await toggleUserStatusAction(id, currentStatus);

        if (res.status === 'success') {
            // Update local state instantly
            setUsers(users.map(u => u.id === id ? { ...u, status: res.newStatus } : u));
        } else {
            alert(res.message);
        }
        setActionLoading(null);
    };

    const handlePasswordReset = async (id) => {
        if (!confirm("Are you sure you want to reset the password to 'Welcome@2026'?")) return;

        setActionLoading(id);
        const res = await resetPasswordAction(id);

        if (res.status === 'success') {
            alert(res.message);
        } else {
            alert(res.message);
        }
        setActionLoading(null);
    };

    return (
        <Section user={user}>
            <div className="min-h-screen bg-slate-50 font-sans p-6">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">User Management</h1>
                        <p className="text-sm text-slate-500">View and manage staff accounts.</p>
                    </div>

                    {/* Search Bar */}
                    <div className="relative w-full md:w-96">
                        <span className="absolute left-3 top-3 text-gray-400">
                            <FaSearch />
                        </span>
                        <input
                            type="text"
                            placeholder="Search by Name, ID, or Email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm"
                        />
                    </div>
                </div>

                {/* Table Container */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-100 text-slate-600 text-xs uppercase font-bold tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">User Info</th>
                                    <th className="px-6 py-4">Role & Designation</th>
                                    <th className="px-6 py-4">Contact</th>
                                    <th className="px-6 py-4 text-center">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {loading ? (
                                    <tr>
                                        <td colSpan="5" className="text-center py-10 text-slate-500">
                                            <FaSpinner className="animate-spin inline mr-2" /> Loading users...
                                        </td>
                                    </tr>
                                ) : filteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="text-center py-10 text-slate-500">No users found.</td>
                                    </tr>
                                ) : (
                                    filteredUsers.map((user) => (
                                        <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                                            {/* User Info */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-sm">
                                                        {user.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-800 text-sm">{user.name}</p>
                                                        <p className="text-xs text-slate-500 font-mono">ID: {user.user_id}</p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Role */}
                                            <td className="px-6 py-4">
                                                <span className="bg-blue-50 text-blue-700 py-1 px-2 rounded text-xs font-semibold border border-blue-100">
                                                    {user.user_type}
                                                </span>
                                                <p className="text-xs text-slate-500 mt-1">{user.designation || 'N/A'}</p>
                                            </td>

                                            {/* Contact */}
                                            <td className="px-6 py-4">
                                                <p className="text-sm text-slate-600">{user.email_address}</p>
                                                <p className="text-xs text-slate-400">{user.phone_number}</p>
                                            </td>

                                            {/* Status Badge */}
                                            <td className="px-6 py-4 text-center">
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${user.status === 'ACTIVE'
                                                        ? 'bg-green-50 text-green-700 border-green-200'
                                                        : 'bg-red-50 text-red-700 border-red-200'
                                                    }`}>
                                                    {user.status === 'ACTIVE' ? <FaCheckCircle size={10} /> : <FaBan size={10} />}
                                                    {user.status}
                                                </span>
                                            </td>

                                            {/* Action Buttons */}
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">

                                                    {/* Toggle Status Button */}
                                                    <button
                                                        onClick={() => handleStatusToggle(user.id, user.status)}
                                                        disabled={actionLoading === user.id}
                                                        className={`p-2 rounded-lg transition-colors border ${user.status === 'ACTIVE'
                                                                ? 'text-red-500 border-red-200 hover:bg-red-50'
                                                                : 'text-green-500 border-green-200 hover:bg-green-50'
                                                            }`}
                                                        title={user.status === 'ACTIVE' ? "Deactivate User" : "Activate User"}
                                                    >
                                                        {actionLoading === user.id ? <FaSpinner className="animate-spin" /> : (
                                                            user.status === 'ACTIVE' ? <FaBan /> : <FaCheckCircle />
                                                        )}
                                                    </button>

                                                    {/* Reset Password Button */}
                                                    <button
                                                        onClick={() => handlePasswordReset(user.id)}
                                                        disabled={actionLoading === user.id}
                                                        className="p-2 text-yellow-600 border border-yellow-200 rounded-lg hover:bg-yellow-50 transition-colors"
                                                        title="Reset Password to Default"
                                                    >
                                                        <FaUnlockAlt />
                                                    </button>

                                                    {/* Generic Edit Button (Link only) */}
                                                    {/* <button className="p-2 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors" title="Edit Details">
                                                        <FaUserEdit />
                                                    </button> */}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination / Footer Info */}
                    <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 text-right">
                        <p className="text-xs text-gray-500">
                            Showing {filteredUsers.length} of {users.length} users
                        </p>
                    </div>
                </div>
            </div>
        </Section>
    );
};

export default ManageUsers;