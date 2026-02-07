"use client";

import Section from '@/Components/Section';
import React, { useState } from 'react';

const AccountantStudentPage = ({ user }) => {
    // --- State for Search & Filter ---
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All'); // All, Active, Inactive

    // --- Mock Data: Student List ---
    const [students, setStudents] = useState([
        { id: '191002041', name: 'Md. Rahim Uddin', dept: 'CSE', semester: '6th', balance: 15000, status: 'Active' },
        { id: '191002042', name: 'Farhana Akter', dept: 'CSE', semester: '6th', balance: 0, status: 'Active' },
        { id: '191002043', name: 'Sajid Ahmed', dept: 'EEE', semester: '4th', balance: 5000, status: 'Inactive' },
        { id: '191002044', name: 'Nusrat Jahan', dept: 'BBA', semester: '2nd', balance: 12500, status: 'Active' },
        { id: '191002045', name: 'Karim Hassan', dept: 'ENG', semester: '8th', balance: 0, status: 'Active' },
    ]);

    // --- Handlers ---
    const toggleStatus = (id) => {
        setStudents(students.map(std =>
            std.id === id ? { ...std, status: std.status === 'Active' ? 'Inactive' : 'Active' } : std
        ));
    };

    const handleRegister = (id) => {
        alert(`Registration processed for Student ID: ${id}`);
        // API call logic would go here
    };

    const handleAddPayment = (id) => {
        window.location.href = `/accountant/student-details/${id}/add-payment`; // Redirect to payment page
    };

    // --- Filtering Logic ---
    const filteredStudents = students.filter(std => {
        const matchesSearch = std.name.toLowerCase().includes(searchTerm.toLowerCase()) || std.id.includes(searchTerm);
        const matchesStatus = filterStatus === 'All' || std.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    return (
        <Section user={user}>
            <div className="min-h-screen bg-slate-50 font-sans">

                {/* --- Header & Summary --- */}
                <div className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm px-6 py-4">
                    <div className="container mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-xl font-bold text-slate-800">Student Financial Accounts</h1>
                            <p className="text-xs text-slate-500">Manage student records, payments, and enrollment status.</p>
                        </div>

                        {/* Search Bar */}
                        <div className="flex gap-2 w-full md:w-auto">
                            <div className="relative flex-grow md:w-64">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                                </span>
                                <input
                                    type="text"
                                    placeholder="Search by Name or ID..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full py-2 pl-10 pr-4 bg-slate-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                                />
                            </div>
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="bg-slate-100 border-none rounded-lg text-sm px-3 font-semibold text-slate-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                            >
                                <option value="All">All Status</option>
                                <option value="Active">Active Only</option>
                                <option value="Inactive">Inactive Only</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* --- Student List Table --- */}
                <div className="container mx-auto p-6">
                    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold border-b border-slate-200">
                                    <tr>
                                        <th className="px-6 py-4">Student Info</th>
                                        <th className="px-6 py-4">Program / Sem</th>
                                        <th className="px-6 py-4">Financial Status</th>
                                        <th className="px-6 py-4 text-center">Account Status</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm divide-y divide-slate-100">
                                    {filteredStudents.length > 0 ? (
                                        filteredStudents.map((std) => (
                                            <tr key={std.id} className="hover:bg-slate-50 transition-colors group">
                                                {/* Student Info */}
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                                                            {std.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <h3 className="font-bold text-slate-800">{std.name}</h3>
                                                            <p className="text-xs font-mono text-slate-500 font-bold">{std.id}</p>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Program */}
                                                <td className="px-6 py-4">
                                                    <div className="text-slate-600 font-medium">{std.dept}</div>
                                                    <div className="text-xs text-slate-400 font-bold bg-slate-100 inline-block px-2 py-0.5 rounded mt-1">
                                                        {std.semester} Semester
                                                    </div>
                                                </td>

                                                {/* Financial Status (Balance) */}
                                                <td className="px-6 py-4">
                                                    {std.balance > 0 ? (
                                                        <div>
                                                            <span className="text-red-600 font-bold text-base">Due: ৳{std.balance.toLocaleString()}</span>
                                                            <p className="text-[10px] text-red-400 font-semibold uppercase tracking-wide">Payment Pending</p>
                                                        </div>
                                                    ) : (
                                                        <div>
                                                            <span className="text-emerald-600 font-bold text-base">Clear</span>
                                                            <p className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wide">No Dues</p>
                                                        </div>
                                                    )}
                                                </td>

                                                {/* Account Status (Toggle Display) */}
                                                <td className="px-6 py-4 text-center">
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${std.status === 'Active'
                                                        ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                                                        : 'bg-slate-100 text-slate-500 border-slate-200'
                                                        }`}>
                                                        <span className={`w-2 h-2 rounded-full ${std.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                                                        {std.status}
                                                    </span>
                                                </td>

                                                {/* Actions Buttons */}
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">

                                                        {/* 1. Add Payment Button */}
                                                        {/* <button
                                                            onClick={() => handleAddPayment(std.id)}
                                                            className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2 px-3 rounded shadow transition-all active:scale-95"
                                                            title="Record New Payment"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                                                            Add Payment
                                                        </button> */}

                                                        {/* 2. Register Button */}
                                                        <button
                                                            onClick={() => handleRegister(std.id)}
                                                            className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold py-2 px-3 rounded transition-colors"
                                                            title="Process Semester Registration"
                                                        >
                                                            Register
                                                        </button>

                                                        {/* 3. Active/Deactivate Toggle Button */}
                                                        <button
                                                            onClick={() => toggleStatus(std.id)}
                                                            className={`p-2 rounded border transition-colors ${std.status === 'Active'
                                                                ? 'bg-red-50 text-red-600 border-red-100 hover:bg-red-100'
                                                                : 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100'
                                                                }`}
                                                            title={std.status === 'Active' ? 'Deactivate Account' : 'Activate Account'}
                                                        >
                                                            {std.status === 'Active' ? (
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path></svg>
                                                            ) : (
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                            )}
                                                        </button>

                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-10 text-center text-slate-400">
                                                No students found matching your search.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination / Footer */}
                        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-between items-center">
                            <span className="text-xs text-slate-500 font-medium">Showing {filteredStudents.length} Records</span>
                            <div className="flex gap-1">
                                <button className="px-3 py-1 bg-white border border-slate-300 rounded text-xs font-bold text-slate-500 disabled:opacity-50">Prev</button>
                                <button className="px-3 py-1 bg-white border border-slate-300 rounded text-xs font-bold text-slate-500 hover:bg-slate-100">Next</button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </Section>
    );
};

export default AccountantStudentPage;