"use client";

import Section from '@/Components/Section';
import React, { useState, useEffect } from 'react';
import {
    FaSpinner, FaBook, FaExclamationTriangle, FaCheckCircle, FaArrowRight,
    FaDownload, FaFilePdf, FaFileWord, FaFileVideo, FaFileAlt, FaTimes
} from 'react-icons/fa';
import Link from 'next/link';
import { getStudentRegistrationAction, getStudentCourseMaterialsAction } from './registrationActions';

const StudentRegistrationPage = ({ user }) => {
    const [loading, setLoading] = useState(true);
    const [registrationData, setData] = useState(null);

    // Course Materials Modal State
    const [activeSubject, setActiveSubject] = useState(null);
    const [materials, setMaterials] = useState([]);
    const [loadingMaterials, setLoadingMaterials] = useState(false);

    useEffect(() => {
        if (!user?.user_id) return;
        const load = async () => {
            const res = await getStudentRegistrationAction(user.user_id);
            if (res.status === 'success') setData(res);
            setLoading(false);
        };
        load();
    }, [user]);

    const handleOpenMaterials = async (sub) => {
        setActiveSubject(sub);
        setLoadingMaterials(true);
        const res = await getStudentCourseMaterialsAction(sub.id);
        if (res.status === 'success') {
            setMaterials(res.materials || []);
        } else {
            setMaterials([]);
        }
        setLoadingMaterials(false);
    };

    const getFileIcon = (type) => {
        const t = (type || '').toLowerCase();
        if (t.includes('pdf')) return <FaFilePdf className="text-red-500 text-2xl" />;
        if (t.includes('doc')) return <FaFileWord className="text-blue-500 text-2xl" />;
        if (t.includes('mp4') || t.includes('video')) return <FaFileVideo className="text-purple-500 text-2xl" />;
        return <FaFileAlt className="text-slate-400 text-2xl" />;
    };

    if (loading) {
        return (
            <Section user={user}>
                <div className="min-h-screen flex justify-center items-center text-slate-400">
                    <FaSpinner className="animate-spin text-2xl" />
                </div>
            </Section>
        );
    }

    // --- Helper for Suffix (1st, 2nd) ---
    const getOrdinal = (n) => {
        const s = ["th", "st", "nd", "rd"];
        const v = n % 100;
        return n + (s[(v - 20) % 10] || s[v] || s[0]);
    };

    return (
        <Section user={user}>
            <div className="min-h-screen bg-slate-50 font-sans flex flex-col items-center py-12">
                <div className="w-full container max-w-5xl px-4">

                    {/* --- STATE 1: NOT REGISTERED --- */}
                    {!registrationData?.isRegistered ? (
                        <div className="flex flex-col items-center justify-center text-center py-16 animate-fade-in-up">
                            <div className="bg-red-50 p-8 rounded-full mb-6 relative">
                                <div className="absolute inset-0 bg-red-100 rounded-full animate-ping opacity-75"></div>
                                <FaExclamationTriangle className="text-6xl text-red-500 relative z-10" />
                            </div>

                            <h1 className="text-4xl font-extrabold text-slate-800 mb-4">Registration Pending!</h1>
                            <p className="text-lg text-slate-500 max-w-lg mb-8 leading-relaxed">
                                You are not yet registered for the <strong>{getOrdinal(registrationData?.semester)} Semester</strong>.
                                Please clear your dues or contact the administration office immediately to avoid late fees.
                            </p>

                            <div className="flex gap-4">
                                <Link href="/student/payments" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform active:scale-95 flex items-center gap-2">
                                    Go to Financials / Clear Dues <FaArrowRight />
                                </Link>
                            </div>
                        </div>
                    ) : (

                        /* --- STATE 2: REGISTERED (SHOW SUBJECTS) --- */
                        <div className="animate-fade-in-up">
                            {/* Header */}
                            <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                                <div>
                                    <div className="flex items-center gap-2 text-emerald-600 font-bold mb-1">
                                        <FaCheckCircle /> Registration Confirmed
                                    </div>
                                    <h1 className="text-3xl font-bold text-slate-800">My Courses</h1>
                                    <p className="text-slate-500">
                                        Enrolled subjects for <strong>{getOrdinal(registrationData.semester)} Semester</strong>
                                    </p>
                                </div>
                                <div className="bg-white px-5 py-2 rounded-lg shadow-sm border border-slate-200 text-right">
                                    <p className="text-xs font-bold text-slate-400 uppercase">Total Credits</p>
                                    <p className="text-xl font-bold text-slate-800">
                                        {registrationData.subjects.reduce((sum, sub) => sum + parseFloat(sub.credit), 0).toFixed(1)}
                                    </p>
                                </div>
                            </div>

                            {/* Subject Table */}
                            <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold border-b border-slate-200">
                                            <tr>
                                                <th className="px-6 py-4 w-24">Code</th>
                                                <th className="px-6 py-4">Course Title</th>
                                                <th className="px-6 py-4 w-32 text-center">Type</th>
                                                <th className="px-6 py-4 w-24 text-center">Credit</th>
                                                <th className="px-6 py-4 w-36 text-center">Materials</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {registrationData.subjects.length > 0 ? (
                                                registrationData.subjects.map((sub, idx) => (
                                                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                                                        <td className="px-6 py-4 font-mono font-bold text-slate-600">
                                                            {sub.subject_code}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="font-bold text-slate-700">{sub.subject_name}</div>
                                                        </td>
                                                        <td className="px-6 py-4 text-center">
                                                            <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase border ${sub.subject_type === 'Lab'
                                                                    ? 'bg-purple-50 text-purple-600 border-purple-100'
                                                                    : 'bg-blue-50 text-blue-600 border-blue-100'
                                                                }`}>
                                                                {sub.subject_type || 'Theory'}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-center font-bold text-slate-600">
                                                            {parseFloat(sub.credit).toFixed(1)}
                                                        </td>
                                                        <td className="px-6 py-4 text-center">
                                                            <button
                                                                onClick={() => handleOpenMaterials(sub)}
                                                                className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold py-1.5 px-3 rounded-lg border border-indigo-200 transition-colors inline-flex items-center gap-1.5"
                                                            >
                                                                <FaDownload className="text-xs" /> Materials
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="5" className="px-6 py-12 text-center text-slate-400">
                                                        <FaBook className="text-4xl mx-auto mb-2 opacity-20" />
                                                        No subjects found for this semester.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Footer */}
                                <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 text-xs text-slate-400 flex justify-between items-center">
                                    <span>* Standard academic load. Contact advisor for changes.</span>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>

            {/* --- Course Materials Modal --- */}
            {activeSubject && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 animate-fade-in-up">
                        <div className="bg-slate-900 text-white p-6 flex justify-between items-center">
                            <div>
                                <span className="text-xs font-mono font-bold text-indigo-300 uppercase tracking-wider">{activeSubject.subject_code}</span>
                                <h3 className="text-lg font-bold text-white">{activeSubject.subject_name}</h3>
                            </div>
                            <button
                                onClick={() => setActiveSubject(null)}
                                className="text-slate-400 hover:text-white transition-colors p-2"
                            >
                                <FaTimes className="text-lg" />
                            </button>
                        </div>

                        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
                            {loadingMaterials ? (
                                <div className="py-12 flex justify-center items-center text-slate-400 gap-2">
                                    <FaSpinner className="animate-spin text-xl text-indigo-600" />
                                    <span>Loading study materials...</span>
                                </div>
                            ) : materials.length > 0 ? (
                                materials.map((m) => (
                                    <div key={m.id} className="p-4 rounded-xl border border-slate-200 hover:border-indigo-300 bg-slate-50/50 hover:bg-indigo-50/30 transition-all flex items-center justify-between gap-4">
                                        <div className="flex items-start gap-4">
                                            <div className="p-3 bg-white rounded-lg shadow-sm border border-slate-200">
                                                {getFileIcon(m.file_type)}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-800 text-sm">{m.title}</h4>
                                                {m.description && <p className="text-xs text-slate-500 mt-0.5">{m.description}</p>}
                                                <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400 font-medium">
                                                    <span>Size: {m.file_size}</span>
                                                    <span>•</span>
                                                    <span>Uploaded: {m.upload_date}</span>
                                                    {m.teacher_name && (
                                                        <>
                                                            <span>•</span>
                                                            <span className="text-indigo-600 font-semibold">{m.teacher_name}</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <a
                                            href={m.file_path}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            download
                                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2 px-4 rounded-lg shadow transition-colors flex items-center gap-1.5 shrink-0"
                                        >
                                            <FaDownload /> Download
                                        </a>
                                    </div>
                                ))
                            ) : (
                                <div className="py-12 text-center text-slate-400">
                                    <FaBook className="text-4xl mx-auto mb-3 opacity-20" />
                                    <p className="font-medium text-slate-600">No Course Materials Yet</p>
                                    <p className="text-xs text-slate-400 mt-1">Your instructor has not uploaded lecture materials or slides for this subject yet.</p>
                                </div>
                            )}
                        </div>

                        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-end">
                            <button
                                onClick={() => setActiveSubject(null)}
                                className="bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold py-2.5 px-6 rounded-lg transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </Section>
    );
};

export default StudentRegistrationPage;