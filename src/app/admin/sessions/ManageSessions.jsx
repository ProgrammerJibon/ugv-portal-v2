"use client";

import React, { useState, useEffect } from 'react';
import { getSessionsAction, setActiveSessionAction, deleteSessionAction } from './manageSessionActions';
import { FaCalendarAlt, FaCheckCircle, FaHistory, FaPowerOff, FaSpinner, FaTrash, FaClock } from 'react-icons/fa';
import AdminSection from '../AdminSection';

const ManageSessions = () => {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);

    // Load Data
    useEffect(() => {
        loadSessions();
    }, []);

    const loadSessions = async () => {
        const res = await getSessionsAction();
        if (res.status === 'success') {
            setSessions(res.data);
        }
        setLoading(false);
    };

    // Handle Activating a Session
    const handleActivate = async (id, year, season) => {
        if (!confirm(`Are you sure you want to make ${season} ${year} the ACTIVE session? \n\nThe previous active session will be marked as 'Completed'.`)) {
            return;
        }

        setActionLoading(id);
        const res = await setActiveSessionAction(id);

        if (res.status === 'success') {
            // Optimistically update UI
            const updatedSessions = sessions.map(s => {
                if (s.id === id) return { ...s, status: 'Active' };
                if (s.status === 'Active') return { ...s, status: 'Completed' };
                return s;
            });
            setSessions(updatedSessions);
            alert(res.message);
        } else {
            alert(res.message);
        }
        setActionLoading(null);
    };

    // Handle Delete
    const handleDelete = async (id) => {
        if (!confirm("Are you sure? This cannot be undone.")) return;

        const res = await deleteSessionAction(id);
        if (res.status === 'success') {
            setSessions(sessions.filter(s => s.id !== id));
        } else {
            alert(res.message);
        }
    };

    return (
        <AdminSection>
            <div className="min-h-screen bg-slate-50 font-sans p-6">

                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Session Management</h1>
                        <p className="text-sm text-slate-500">Control the current academic semester.</p>
                    </div>
                    <button
                        onClick={() => window.location.href = '/admin/sessions/add'}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold shadow-sm transition-colors text-sm flex items-center gap-2"
                    >
                        + New Session
                    </button>
                </div>

                {/* Session List */}
                <div className="grid gap-4">
                    {loading ? (
                        <div className="text-center py-10 text-slate-500">
                            <FaSpinner className="animate-spin inline mr-2 text-2xl" /> Loading sessions...
                        </div>
                    ) : sessions.length === 0 ? (
                        <div className="text-center py-10 text-slate-500 bg-white rounded-xl border border-dashed border-gray-300">
                            No sessions found. Create one to get started.
                        </div>
                    ) : (
                        sessions.map((session) => (
                            <div
                                key={session.id}
                                className={`relative flex flex-col md:flex-row items-center justify-between p-6 rounded-xl border transition-all ${session.status === 'Active'
                                        ? 'bg-white border-green-500 shadow-lg ring-1 ring-green-500 z-10'
                                        : 'bg-white border-gray-200 hover:border-blue-300'
                                    }`}
                            >
                                {/* Left: Info */}
                                <div className="flex items-center gap-6 w-full md:w-auto">
                                    <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-inner ${session.status === 'Active' ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'
                                        }`}>
                                        <FaCalendarAlt />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                            {session.session_season} {session.session_year}
                                            {session.status === 'Active' && (
                                                <span className="bg-green-100 text-green-700 text-[10px] uppercase px-2 py-0.5 rounded-full border border-green-200 font-extrabold tracking-wider">
                                                    Current
                                                </span>
                                            )}
                                        </h3>
                                        <p className="text-sm text-slate-500 font-mono mt-1">
                                            Code: <span className="font-bold text-slate-700">{session.short_code}</span>
                                        </p>
                                    </div>
                                </div>

                                {/* Right: Status & Actions */}
                                <div className="flex items-center gap-4 mt-4 md:mt-0 w-full md:w-auto justify-end">

                                    {/* Status Indicator Text */}
                                    <div className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${session.status === 'Active' ? 'text-green-600 bg-green-50' :
                                            session.status === 'Completed' ? 'text-slate-500 bg-slate-100' :
                                                'text-blue-500 bg-blue-50'
                                        }`}>
                                        {session.status === 'Active' ? <FaCheckCircle /> :
                                            session.status === 'Completed' ? <FaHistory /> : <FaClock />}
                                        {session.status}
                                    </div>

                                    {/* Activate Button */}
                                    {session.status !== 'Active' && (
                                        <button
                                            onClick={() => handleActivate(session.id, session.session_year, session.session_season)}
                                            disabled={actionLoading === session.id}
                                            className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white text-sm rounded-lg hover:bg-green-600 transition-all shadow-sm active:scale-95 disabled:opacity-50"
                                            title="Set as Current Session"
                                        >
                                            {actionLoading === session.id ? <FaSpinner className="animate-spin" /> : <FaPowerOff />}
                                            Activate
                                        </button>
                                    )}

                                    {/* Delete Button (Only if not active) */}
                                    {session.status !== 'Active' && (
                                        <button
                                            onClick={() => handleDelete(session.id)}
                                            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Delete Session"
                                        >
                                            <FaTrash />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>

            </div>
        </AdminSection>
    );
};

export default ManageSessions;