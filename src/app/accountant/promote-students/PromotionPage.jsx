"use client";

import Section from '@/Components/Section';
import React, { useState, useEffect } from 'react';
import { getPromotableStudentsAction, promoteStudentsAction, getPromotionOptionsAction } from './promotionActions';
import { FaSpinner, FaFilter, FaCheckCircle } from 'react-icons/fa';

const PromotionPage = ({ user }) => {
    // --- State ---
    const [loading, setLoading] = useState(false);
    const [initializing, setInitializing] = useState(true); // New loading state for page init
    const [promoting, setPromoting] = useState(false);
    const [students, setStudents] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);

    // --- Dynamic Options State ---
    const [majors, setMajors] = useState([]);

    // --- Configuration State ---
    const [filters, setFilters] = useState({
        department: '', // Will be set after loading majors
        currentSemester: '1',
        targetSession: '' // Will be set after loading session
    });

    // --- 1. Load Metadata (Majors & Session) on Mount ---
    useEffect(() => {
        const init = async () => {
            const res = await getPromotionOptionsAction();
            if (res.status === 'success') {
                setMajors(res.majors);
                setFilters(prev => ({
                    ...prev,
                    targetSession: res.currentSession,
                    // Default to the first major in the list if available
                    department: res.majors.length > 0 ? res.majors[0].id : ''
                }));
            }
            setInitializing(false);
        };
        init();
    }, []);

    // --- 2. Load Students when Filters Change ---
    const loadStudents = async () => {
        if (!filters.department) return; // Don't fetch if no dept selected yet

        setLoading(true);
        const res = await getPromotableStudentsAction(filters);
        if (res.status === 'success') {
            setStudents(res.data);
            setSelectedIds([]);
        } else {
            alert(res.message);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (!initializing) {
            loadStudents();
        }
    }, [filters.department, filters.currentSemester, initializing]);

    // --- Computed Values ---
    const eligibleStudents = students.filter(s => parseFloat(s.due) <= 0);
    const eligibleCount = eligibleStudents.length;
    const pendingCount = students.length - eligibleCount;

    // --- Handlers ---
    const handleSelectAllEligible = () => {
        const eligibleIds = eligibleStudents.map(s => s.id);
        if (selectedIds.length === eligibleIds.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(eligibleIds);
        }
    };

    const toggleSelect = (id) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(sid => sid !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const handlePromote = async () => {
        if (selectedIds.length === 0) return;

        const confirmMsg = `Promote ${selectedIds.length} students to ${parseInt(filters.currentSemester) + 1}th Semester for ${filters.targetSession}?`;

        if (window.confirm(confirmMsg)) {
            setPromoting(true);
            const res = await promoteStudentsAction(selectedIds, filters.targetSession);

            if (res.status === 'success') {
                alert(res.message);
                loadStudents();
            } else {
                alert(res.message);
            }
            setPromoting(false);
        }
    };

    if (initializing) {
        return (
            <Section user={user}>
                <div className="min-h-screen flex justify-center items-center">
                    <FaSpinner className="animate-spin text-slate-400 text-2xl" />
                </div>
            </Section>
        );
    }

    return (
        <Section user={user}>
            <div className="min-h-screen bg-slate-50 font-sans flex flex-col items-center py-10">
                <div className="w-full container max-w-5xl px-4">

                    {/* Header */}
                    <div className="mb-8 border-b border-gray-200 pb-4 flex flex-col md:flex-row justify-between items-end gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800">Semester Promotion</h1>
                            <p className="text-slate-500 text-sm">Promote eligible students to the next academic session.</p>
                        </div>
                        <div className="bg-white border border-indigo-100 px-4 py-2 rounded-lg shadow-sm text-right">
                            <p className="text-xs font-bold text-slate-400 uppercase">Promoting To</p>
                            <input
                                type="text"
                                value={filters.targetSession}
                                onChange={(e) => setFilters({ ...filters, targetSession: e.target.value })}
                                className="text-indigo-600 font-bold text-right focus:outline-none border-b border-dashed border-indigo-200 w-40 bg-transparent"
                            />
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <FaFilter /> Select Batch to Process
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Program</label>
                                <select
                                    className="w-full bg-slate-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-semibold focus:outline-none focus:border-indigo-500"
                                    value={filters.department}
                                    onChange={(e) => setFilters({ ...filters, department: e.target.value })}
                                >
                                    {majors.map((major) => (
                                        <option key={major.id} value={major.id}>
                                            {major.program_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Current Semester</label>
                                <select
                                    className="w-full bg-slate-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-semibold focus:outline-none focus:border-indigo-500"
                                    value={filters.currentSemester}
                                    onChange={(e) => setFilters({ ...filters, currentSemester: e.target.value })}
                                >
                                    {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                                        <option key={sem} value={sem}>{sem}th Semester</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex items-end">
                                <button onClick={loadStudents} className="w-full bg-slate-800 text-white font-bold py-2.5 rounded-lg hover:bg-slate-700 transition-colors">
                                    Refresh List
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm text-center">
                            <span className="text-2xl font-bold text-slate-700">{students.length}</span>
                            <span className="block text-xs text-slate-400 font-bold uppercase">Total Students</span>
                        </div>
                        <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100 shadow-sm text-center">
                            <span className="text-2xl font-bold text-emerald-600">{eligibleCount}</span>
                            <span className="block text-xs text-emerald-600/70 font-bold uppercase">Ready (No Dues)</span>
                        </div>
                        <div className="bg-red-50 p-4 rounded-lg border border-red-100 shadow-sm text-center">
                            <span className="text-2xl font-bold text-red-600">{pendingCount}</span>
                            <span className="block text-xs text-red-600/70 font-bold uppercase">Dues Pending</span>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">

                        {/* Toolbar */}
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    onChange={handleSelectAllEligible}
                                    checked={selectedIds.length === eligibleCount && eligibleCount > 0}
                                    disabled={eligibleCount === 0}
                                    className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 cursor-pointer disabled:opacity-50"
                                />
                                <label className="text-sm font-bold text-slate-600">Select All Eligible</label>
                            </div>
                            {selectedIds.length > 0 && (
                                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                                    {selectedIds.length} Selected
                                </span>
                            )}
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-white text-slate-500 text-xs uppercase font-bold border-b border-slate-200">
                                    <tr>
                                        <th className="px-6 py-4 w-10">Select</th>
                                        <th className="px-6 py-4">Student Details</th>
                                        <th className="px-6 py-4 text-right">Outstanding Due</th>
                                        <th className="px-6 py-4 text-center">Eligibility</th>
                                        <th className="px-6 py-4 text-right">Adm. Fee</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm divide-y divide-slate-100">
                                    {loading ? (
                                        <tr><td colSpan="5" className="py-10 text-center text-slate-400"><FaSpinner className="animate-spin inline" /> Loading...</td></tr>
                                    ) : students.length === 0 ? (
                                        <tr><td colSpan="5" className="py-10 text-center text-slate-400">All students in this batch have been promoted to {filters.targetSession}.</td></tr>
                                    ) : (
                                        students.map((std) => {
                                            const isEligible = parseFloat(std.due) <= 0;
                                            const isSelected = selectedIds.includes(std.id);
                                            return (
                                                <tr key={std.id} className={`transition-colors ${isSelected ? 'bg-indigo-50/40' : 'hover:bg-slate-50'}`}>
                                                    <td className="px-6 py-4">
                                                        <input
                                                            type="checkbox"
                                                            checked={isSelected}
                                                            disabled={!isEligible}
                                                            onChange={() => toggleSelect(std.id)}
                                                            className={`w-4 h-4 rounded focus:ring-indigo-500 ${!isEligible ? 'bg-gray-100 text-gray-300 cursor-not-allowed' : 'text-indigo-600 cursor-pointer'}`}
                                                        />
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="font-bold text-slate-700">{std.name}</div>
                                                        <div className="text-xs text-slate-400 font-mono">{std.user_id}</div>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        {parseFloat(std.due) > 0 ? (
                                                            <span className="text-red-600 font-bold">৳ {Number(std.due).toLocaleString()}</span>
                                                        ) : (
                                                            <span className="text-emerald-600 font-bold text-xs uppercase">Paid</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        {isEligible ? (
                                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">Ready</span>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700">Hold</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 text-right font-mono text-xs text-slate-500">
                                                        ৳ {Number(std.admission_fee).toLocaleString()}
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Footer Action */}
                        <div className="bg-white border-t border-gray-200 p-4 sticky bottom-0 flex justify-between items-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                            <div>
                                <p className="text-xs text-slate-500">
                                    Promoting will move students to <strong className="text-slate-800">{parseInt(filters.currentSemester) + 1}th Semester</strong>.
                                </p>
                            </div>
                            <button
                                onClick={handlePromote}
                                disabled={selectedIds.length === 0 || promoting}
                                className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold shadow-lg transition-all active:scale-95 ${selectedIds.length > 0 && !promoting
                                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'
                                    : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                                    }`}
                            >
                                {promoting ? <FaSpinner className="animate-spin" /> : <FaCheckCircle />}
                                Promote {selectedIds.length > 0 ? `(${selectedIds.length})` : ''}
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </Section>
    );
};

export default PromotionPage;