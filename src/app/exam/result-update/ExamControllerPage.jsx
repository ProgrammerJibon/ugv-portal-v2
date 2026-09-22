"use client";

import Section from '@/Components/Section';
import React, { useState, useEffect } from 'react';
import { getExamSessionsAction, toggleMarkEntryAction } from './examControllerActions';
import { FaSpinner, FaHistory, FaCheckCircle, FaLock, FaUnlock } from 'react-icons/fa';

const ExamControllerPage = ({ user }) => {
    // --- State ---
    const [sessions, setSessions] = useState([]);
    const [selectedSessionId, setSelectedSessionId] = useState('');
    const [loading, setLoading] = useState(true);
    const [toggling, setToggling] = useState(false);

    // --- 1. Load Data on Mount ---
    useEffect(() => {
        const loadSessions = async () => {
            const res = await getExamSessionsAction();
            if (res.status === 'success' && res.data.length > 0) {
                setSessions(res.data);

                // Try to find the 'ACTIVE' session to select by default, otherwise pick the first one
                const activeSession = res.data.find(s => s.status === 'ACTIVE');
                setSelectedSessionId(activeSession ? activeSession.id : res.data[0].id);
            }
            setLoading(false);
        };
        loadSessions();
    }, []);

    // --- Computed Properties ---
    // Find the full object of the currently selected session
    const currentSessionObj = sessions.find(s => s.id == selectedSessionId);

    // Check if mark entry is open (handle '1'/'0' string or number from MySQL)
    const isMarkEntryOpen = currentSessionObj ? (currentSessionObj.mark_open == 1 || currentSessionObj.mark_open === '1') : false;

    // --- Handlers ---
    const handleToggle = async () => {
        if (!currentSessionObj) return;

        const action = isMarkEntryOpen ? "CLOSE" : "OPEN";
        // if (!confirm(`Are you sure you want to ${action} the mark entry portal for ${currentSessionObj.session_season} ${currentSessionObj.session_year}?`)) return;

        setToggling(true);
        const res = await toggleMarkEntryAction(selectedSessionId, isMarkEntryOpen);

        if (res.status === 'success') {
            // Update local state to reflect change immediately
            setSessions(prev => prev.map(s =>
                s.id == selectedSessionId ? { ...s, mark_open: res.newStatus } : s
            ));
        } else {
            alert(res.message);
        }
        setToggling(false);
    };

    return (
        <Section user={user}>
            <div className="bg-slate-50 font-sans flex flex-col justify-center items-center py-10">

                <div className="w-full max-w-3xl px-4">

                    {/* --- Page Title --- */}
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-bold text-slate-800">Exam Controller Panel</h1>
                        <p className="text-slate-500 mt-2">Manage academic periods and grading portals.</p>
                    </div>

                    {loading ? (
                        <div className="text-center py-20 text-slate-500"><FaSpinner className="animate-spin inline text-2xl" /> Loading Sessions...</div>
                    ) : sessions.length === 0 ? (
                        <div className="text-center py-20 text-slate-500">No sessions found. Please ask Admin to create a session.</div>
                    ) : (
                        <>
                            {/* --- Session Selector Dropdown --- */}
                            <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                                        <FaHistory />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-700 text-sm">Select Session Context</h3>
                                        <p className="text-xs text-slate-400">Manage settings for a specific term</p>
                                    </div>
                                </div>
                                <select
                                    value={selectedSessionId}
                                    onChange={(e) => setSelectedSessionId(e.target.value)}
                                    className="w-full md:w-64 border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 bg-slate-50 font-semibold text-slate-700"
                                >
                                    {sessions.map(s => (
                                        <option key={s.id} value={s.id}>
                                            {s.session_season} {s.session_year} {s.status === 'ACTIVE' ? '(Current)' : ''}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* --- Main Status Card --- */}
                            <div className={`bg-white rounded-xl shadow-xl overflow-hidden border-2 transition-all duration-500 ${isMarkEntryOpen ? 'border-emerald-500 shadow-emerald-100' : 'border-rose-500 shadow-rose-100'}`}>

                                {/* Header with Dynamic Color */}
                                <div className={`px-8 py-6 text-white flex justify-between items-center transition-colors duration-500 ${isMarkEntryOpen ? 'bg-emerald-600' : 'bg-rose-600'}`}>
                                    <div>
                                        <h2 className="text-2xl font-bold">Mark Entry Portal</h2>
                                        <p className="opacity-90 text-sm mt-1">
                                            Target Session:
                                            <span className="font-mono font-bold bg-white/20 px-2 py-0.5 rounded ml-1">
                                                {currentSessionObj?.session_season} {currentSessionObj?.session_year}
                                            </span>
                                        </p>
                                    </div>
                                    {/* Status Icon/Badge */}
                                    <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/30">
                                        <span className="flex items-center gap-2 font-bold tracking-wide uppercase text-sm">
                                            {isMarkEntryOpen ? (
                                                <><FaUnlock /> Portal Open</>
                                            ) : (
                                                <><FaLock /> Portal Closed</>
                                            )}
                                        </span>
                                    </div>
                                </div>

                                {/* Controls Body */}
                                <div className="px-8 py-10">
                                    <div className="flex flex-col md:flex-row gap-8 items-center justify-between">

                                        {/* Left: Info Text */}
                                        <div className="flex-1">
                                            <h3 className={`font-bold text-lg mb-2 ${isMarkEntryOpen ? 'text-emerald-700' : 'text-rose-700'}`}>
                                                Status: {isMarkEntryOpen ? 'Accepting Grades' : 'Submission Locked'}
                                            </h3>
                                            <p className="text-slate-600 text-sm leading-relaxed">
                                                {isMarkEntryOpen
                                                    ? "Teachers are currently allowed to submit and update marks for courses in this session. Ensure you close this portal once the grading deadline has passed."
                                                    : "Mark submission is disabled. Teachers cannot make any changes to grades for this session. Toggle the switch to allow access."
                                                }
                                            </p>
                                        </div>

                                        {/* Right: The Toggle Switch */}
                                        <div className="shrink-0 flex flex-col items-center">
                                            <button
                                                onClick={handleToggle}
                                                disabled={toggling}
                                                className={`relative inline-flex h-14 w-28 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-4 ${isMarkEntryOpen
                                                        ? 'bg-emerald-600 focus:ring-emerald-300'
                                                        : 'bg-slate-300 focus:ring-slate-200'
                                                    } ${toggling ? 'opacity-70 cursor-not-allowed' : ''}`}
                                            >
                                                <span className="sr-only">Toggle Mark Entry</span>
                                                <span
                                                    className={`inline-block h-10 w-10 transform rounded-full bg-white shadow-lg transition duration-300 ease-in-out flex items-center justify-center ${isMarkEntryOpen ? 'translate-x-16' : 'translate-x-2'
                                                        }`}
                                                >
                                                    {toggling ? <FaSpinner className="animate-spin text-slate-400" /> : null}
                                                </span>
                                            </button>
                                            <span className="mt-3 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                                {isMarkEntryOpen ? "Click to Close" : "Click to Open"}
                                            </span>
                                        </div>

                                    </div>
                                </div>

                                {/* Footer Warning */}
                                <div className="bg-slate-50 px-8 py-4 border-t border-slate-100 flex items-start gap-3">
                                    <FaCheckCircle className="text-slate-400 mt-0.5 flex-shrink-0" />
                                    <p className="text-xs text-slate-500">
                                        <strong>System Note:</strong> Changes to this setting apply immediately. Closing the portal will revoke write access for all faculty members assigned to this specific session.
                                    </p>
                                </div>

                            </div>
                        </>
                    )}
                </div>
            </div>
        </Section>
    );
};

export default ExamControllerPage;