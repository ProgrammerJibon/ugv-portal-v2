"use client";

import Section from '@/Components/Section';
import React, { useState, useEffect } from 'react';
import { findStudentAction, getActiveSessionsAction, processReadmissionAction } from './readmissionActions'; // Adjust path
import { FaSearch, FaUserGraduate, FaCheckCircle, FaExclamationTriangle, FaSpinner } from 'react-icons/fa';

const ReadmissionPage = ({ user }) => {
    // --- State ---
    const [searchId, setSearchId] = useState('');
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(false);
    const [processing, setProcessing] = useState(false);

    // --- State: Re-admission Form ---
    const [sessionsList, setSessionsList] = useState([]);
    const [targetSession, setTargetSession] = useState('');
    const [rejoinSemester, setRejoinSemester] = useState('1');
    const [remarks, setRemarks] = useState('');

    // Load Sessions on Mount
    useEffect(() => {
        const load = async () => {
            const res = await getActiveSessionsAction();
            if (res.status === 'success') {
                setSessionsList(res.data);
                if (res.data.length > 0) {
                    setTargetSession(`${res.data[0].session_season} ${res.data[0].session_year}`);
                }
            }
        };
        load();
    }, []);

    // --- Handlers ---
    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchId) return;

        setLoading(true);
        setStudent(null);

        const res = await findStudentAction(searchId);
        if (res.status === 'success') {
            setStudent(res.data);
            // Auto-select next semester based on current
            const nextSem = parseInt(res.data.current_semester) || 1;
            setRejoinSemester(nextSem.toString());
        } else {
            alert(res.message);
        }
        setLoading(false);
    };

    const handleReadmission = async () => {
        if (!student) return;

        const confirmMsg = `Confirm Re-admission for ${student.name}?\n\nTarget Session: ${targetSession}\nRe-joining Semester: ${rejoinSemester}`;

        if (window.confirm(confirmMsg)) {
            setProcessing(true);
            const res = await processReadmissionAction(student.id, targetSession, rejoinSemester);

            if (res.status === 'success') {
                alert(res.message);
                // Update local state to reflect ACTIVE status immediately
                setStudent(prev => ({ ...prev, status: 'ACTIVE', session: targetSession, current_semester: rejoinSemester }));
            } else {
                alert(res.message);
            }
            setProcessing(false);
        }
    };

    return (
        <Section user={user}>
            <div className="min-h-screen bg-slate-50 font-sans flex flex-col items-center py-10">

                <div className="w-full container max-w-4xl px-4">

                    {/* --- Header --- */}
                    <div className="mb-8 border-b border-gray-200 pb-4">
                        <h1 className="text-2xl font-bold text-slate-800">Student Re-admission</h1>
                        <p className="text-slate-500 text-sm">Reactivate dropout or inactive students for the current academic session.</p>
                    </div>

                    {/* --- Search Section --- */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Locate Student</label>
                        <form onSubmit={handleSearch} className="flex gap-4">
                            <div className="relative flex-grow">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                                    <FaSearch />
                                </span>
                                <input
                                    type="text"
                                    placeholder="Enter Student ID (e.g. 182001055)"
                                    value={searchId}
                                    onChange={(e) => setSearchId(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono font-bold text-slate-700"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-slate-800 hover:bg-slate-900 text-white px-8 py-3 rounded-lg font-bold transition-colors shadow-lg disabled:opacity-70 flex items-center gap-2"
                            >
                                {loading ? <FaSpinner className="animate-spin" /> : 'Find Student'}
                            </button>
                        </form>
                    </div>

                    {/* --- Main Content (Conditional) --- */}
                    {student && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                            {/* Left: Student Profile Snapshot */}
                            <div className="md:col-span-1">
                                <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden relative">

                                    {/* Status Ribbon */}
                                    <div className={`absolute top-4 right-0 px-3 py-1 text-xs font-bold text-white rounded-l shadow-sm ${student.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-red-500'}`}>
                                        {student.status}
                                    </div>

                                    <div className="p-6 text-center pt-10">
                                        <div className="w-24 h-24 mx-auto bg-slate-100 rounded-full mb-4 border-4 border-white shadow-sm flex items-center justify-center text-slate-300">
                                            <FaUserGraduate size={40} />
                                        </div>
                                        <h2 className="text-lg font-bold text-slate-800">{student.name}</h2>
                                        <p className="text-sm font-mono font-bold text-slate-500 mb-4">{student.user_id}</p>

                                        <div className="text-left space-y-3 mt-6 text-sm">
                                            <div className="flex justify-between border-b border-gray-50 pb-2">
                                                <span className="text-slate-500">Program</span>
                                                <span className="font-bold text-slate-700 text-right text-xs">{student.programName}</span>
                                            </div>
                                            <div className="flex justify-between border-b border-gray-50 pb-2">
                                                <span className="text-slate-500">Original Batch</span>
                                                <span className="font-bold text-slate-700">{student.batch}</span>
                                            </div>
                                            <div className="flex justify-between border-b border-gray-50 pb-2">
                                                <span className="text-slate-500">Last Session</span>
                                                <span className="font-bold text-slate-700">{student.session}</span>
                                            </div>
                                            <div className="flex justify-between pt-1">
                                                <span className="text-slate-500">Type</span>
                                                <span className="font-bold text-indigo-600">{student.program_type}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Re-admission Form */}
                            <div className="md:col-span-2">
                                <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden h-full flex flex-col">

                                    <div className="bg-slate-50 px-8 py-4 border-b border-gray-200">
                                        <h3 className="font-bold text-slate-700">Re-admission Details</h3>
                                    </div>

                                    <div className="p-8 space-y-6 flex-grow">

                                        {student.status === 'ACTIVE' ? (
                                            <div className="h-full flex flex-col items-center justify-center text-center p-6">
                                                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                                                    <FaCheckCircle size={32} />
                                                </div>
                                                <h3 className="text-xl font-bold text-emerald-700">Student is ACTIVE</h3>
                                                <p className="text-slate-500 mt-2">This student account is currently active.</p>
                                            </div>
                                        ) : (
                                            <>
                                                {/* Alert Box */}
                                                <div className="bg-orange-50 border-l-4 border-orange-400 p-4 rounded-r">
                                                    <div className="flex">
                                                        <div className="flex-shrink-0">
                                                            <FaExclamationTriangle className="h-5 w-5 text-orange-400" />
                                                        </div>
                                                        <div className="ml-3">
                                                            <p className="text-sm text-orange-700">
                                                                You are about to reactivate a <strong>{student.status}</strong> student. This will restore their portal access immediately.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Form Fields */}
                                                <div className="grid grid-cols-2 gap-6">
                                                    <div>
                                                        <label className="block text-sm font-bold text-slate-700 mb-2">Target Session</label>
                                                        <select
                                                            value={targetSession}
                                                            onChange={(e) => setTargetSession(e.target.value)}
                                                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-indigo-500 bg-white"
                                                        >
                                                            {sessionsList.map((s, idx) => (
                                                                <option key={idx} value={`${s.session_season} ${s.session_year}`}>
                                                                    {s.session_season} {s.session_year}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-bold text-slate-700 mb-2">Re-joining Semester</label>
                                                        <select
                                                            value={rejoinSemester}
                                                            onChange={(e) => setRejoinSemester(e.target.value)}
                                                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-indigo-500 bg-white"
                                                        >
                                                            {[...Array(12)].map((_, i) => (
                                                                <option key={i} value={i + 1}>{i + 1} Semester</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-bold text-slate-700 mb-2">Remarks / Reason</label>
                                                    <textarea
                                                        rows="2"
                                                        value={remarks}
                                                        onChange={(e) => setRemarks(e.target.value)}
                                                        placeholder="e.g. Returned from medical leave, re-payment cleared..."
                                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-indigo-500 resize-none"
                                                    ></textarea>
                                                </div>

                                                {/* Action Button */}
                                                <div className="pt-4">
                                                    <button
                                                        onClick={handleReadmission}
                                                        disabled={processing}
                                                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg shadow-indigo-200 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70"
                                                    >
                                                        {processing ? <FaSpinner className="animate-spin" /> : <FaCheckCircle />}
                                                        Confirm Re-admission
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                        </div>
                    )}

                </div>
            </div>
        </Section>
    );
};

export default ReadmissionPage;