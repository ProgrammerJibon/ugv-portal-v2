"use client";

import Section from '@/Components/Section';
import React, { useState, useEffect } from 'react';
import { getStudentFinancialsAction, toggleStudentStatusAction, registerStudentAction } from './accountantActions';
import { FaSearch, FaSpinner, FaUserCheck, FaUserTimes, FaMoneyBillWave, FaIdCard, FaCheckDouble } from 'react-icons/fa';
import Link from 'next/link';

const AccountantStudentPage = ({ user }) => {
    // --- State ---
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');

    // --- Load Data ---
    const loadData = async () => {
        setLoading(true);
        const res = await getStudentFinancialsAction();
        if (res.status === 'success') {
            setStudents(res.data);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    // --- Handlers ---
    const toggleStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
        if (!confirm(`Change status to ${newStatus}?`)) return;

        // Optimistic Update
        setStudents(prev => prev.map(s => s.id === id ? { ...s, account_status: newStatus } : s));

        const res = await toggleStudentStatusAction(id, newStatus);
        if (res.status !== 'success') {
            alert(res.message);
            loadData(); // Revert
        }
    };

    const handleRegister = async (id) => {
        if (!confirm("Confirm semester registration for this student?")) return;

        // Optimistic Update
        setStudents(prev => prev.map(s => s.id === id ? { ...s, registerred: '1' } : s));

        const res = await registerStudentAction(id);
        alert(res.message);
        if (res.status !== 'success') loadData(); // Revert on fail
    };

    // --- Filtering Logic ---
    const filteredStudents = students.filter(std => {
        const matchesSearch = std.name.toLowerCase().includes(searchTerm.toLowerCase()) || std.id.toString().includes(searchTerm);
        const matchesStatus = filterStatus === 'All' || std.account_status === filterStatus;
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
                                    <FaSearch />
                                </span>
                                <input
                                    type="text"
                                    placeholder="Search by Name or ID..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full py-2 pl-10 pr-4 bg-slate-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none"
                                />
                            </div>
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="bg-slate-100 border-none rounded-lg text-sm px-3 font-semibold text-slate-600 focus:ring-2 focus:ring-indigo-500 cursor-pointer outline-none"
                            >
                                <option value="All">All Status</option>
                                <option value="ACTIVE">ACTIVE Only</option>
                                <option value="INACTIVE">ACTIVE Only</option>
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
                                    {loading ? (
                                        <tr><td colSpan="5" className="py-10 text-center text-slate-400"><FaSpinner className="animate-spin inline" /> Loading Data...</td></tr>
                                    ) : filteredStudents.length > 0 ? (
                                        filteredStudents.map((std) => (
                                            <tr key={std.id} className="hover:bg-slate-50 transition-colors group">
                                                {/* Student Info */}
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm uppercase">
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
                                                    <div className="text-slate-600 font-medium">{std.dept || 'N/A'}</div>
                                                    <div className="text-xs text-slate-400 font-bold bg-slate-100 inline-block px-2 py-0.5 rounded mt-1">
                                                        {std.current_semester} Semester
                                                    </div>
                                                </td>

                                                {/* Financial Status */}
                                                <td className="px-6 py-4">
                                                    {Number(std.balance) > 0 ? (
                                                        <div>
                                                            <span className="text-red-600 font-bold text-base">Due: ৳{Number(std.balance).toLocaleString()}</span>
                                                            <p className="text-[10px] text-red-400 font-semibold uppercase tracking-wide">Payment Pending</p>
                                                        </div>
                                                    ) : (
                                                        <div>
                                                            <span className="text-emerald-600 font-bold text-base">Clear</span>
                                                            <p className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wide">No Dues</p>
                                                        </div>
                                                    )}
                                                </td>

                                                {/* Account Status */}
                                                <td className="px-6 py-4 text-center">
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${std.account_status === 'ACTIVE'
                                                        ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                                                        : 'bg-slate-100 text-slate-500 border-slate-200'
                                                        }`}>
                                                        <span className={`w-2 h-2 rounded-full ${std.account_status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                                                        {std.account_status}
                                                    </span>
                                                </td>

                                                {/* Actions */}
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">

                                                        {/* Add Payment */}
                                                        {/* <Link
                                                            href={`/accountant/student-details/${std.id}/add-payment`}
                                                            className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2 px-3 rounded shadow transition-all active:scale-95"
                                                            title="Record New Payment"
                                                        >
                                                            <FaMoneyBillWave /> Pay
                                                        </Link> */}

                                                        {/* Register Button (Conditional) */}
                                                        {std.registerred === '1' ? (
                                                            <button
                                                                disabled
                                                                className="bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs font-bold py-2 px-3 rounded cursor-default flex items-center gap-1"
                                                                title="Student already registered"
                                                            >
                                                                <FaCheckDouble /> Registered
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={() => handleRegister(std.id)}
                                                                className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold py-2 px-3 rounded transition-colors flex items-center gap-1"
                                                                title="Process Semester Registration"
                                                            >
                                                                <FaIdCard /> Register
                                                            </button>
                                                        )}

                                                        {/* Toggle Status */}
                                                        <button
                                                            onClick={() => toggleStatus(std.id, std.account_status)}
                                                            className={`p-2 rounded border transition-colors ${std.account_status === 'ACTIVE'
                                                                ? 'bg-red-50 text-red-600 border-red-100 hover:bg-red-100'
                                                                : 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100'
                                                                }`}
                                                            title={std.account_status === 'ACTIVE' ? 'Deactivate Account' : 'Activate Account'}
                                                        >
                                                            {std.account_status === 'ACTIVE' ? <FaUserTimes /> : <FaUserCheck />}
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