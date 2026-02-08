"use client";

import Section from '@/Components/Section';
import React, { useState, useEffect } from 'react';
import { FaSpinner, FaBook, FaExclamationTriangle, FaCheckCircle, FaArrowRight, FaRegSadTear } from 'react-icons/fa';
import Link from 'next/link';
import { getStudentRegistrationAction } from './registrationActions';

const StudentRegistrationPage = ({ user }) => {
    const [loading, setLoading] = useState(true);
    const [registrationData, setData] = useState(null);

    useEffect(() => {
        if (!user?.user_id) return;
        const load = async () => {
            const res = await getStudentRegistrationAction(user.user_id);
            if (res.status === 'success') setData(res);
            setLoading(false);
        };
        load();
    }, [user]);

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
                <div className="w-full container max-w-4xl px-4">

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

                            {/* <div className="flex gap-4">
                                <Link href="/student/payment" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform active:scale-95 flex items-center gap-2">
                                    Go to Payment <FaArrowRight />
                                </Link>
                                <button className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold py-3 px-8 rounded-full shadow-sm transition-colors">
                                    Contact Admin
                                </button>
                            </div> */}
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
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="4" className="px-6 py-12 text-center text-slate-400">
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
                                    <button className="flex items-center gap-1 font-bold text-indigo-600 hover:underline">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                        Download Registration Card
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </Section>
    );
};

export default StudentRegistrationPage;