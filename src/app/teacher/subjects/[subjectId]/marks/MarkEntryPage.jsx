"use client";
import Section from '@/Components/Section';
import React, { useState, useEffect } from 'react';

const MarkEntryPage = ({ user }) => {
    // --- Context Data (Passed from previous page or routing) ---
    const courseInfo = {
        session: "Spring 2026",
        subjectCode: "CSE-101",
        subjectName: "Computer Fundamentals",
        program: "B.Sc in CSE (1st Semester)"
    };

    // --- Helper: Calculate Grade based on Total ---
    const calculateGrade = (total) => {
        if (total >= 80) return { grade: 'A+', point: 4.00 };
        if (total >= 75) return { grade: 'A', point: 3.75 };
        if (total >= 70) return { grade: 'A-', point: 3.50 };
        if (total >= 65) return { grade: 'B+', point: 3.25 };
        if (total >= 60) return { grade: 'B', point: 3.00 };
        if (total >= 55) return { grade: 'B-', point: 2.75 };
        if (total >= 50) return { grade: 'C+', point: 2.50 };
        if (total >= 45) return { grade: 'C', point: 2.25 };
        if (total >= 40) return { grade: 'D', point: 2.00 };
        return { grade: 'F', point: 0.00 };
    };

    // --- State: Student Marks Data ---
    const [students, setStudents] = useState([
        { id: '191002041', name: 'Md. Rahim Uddin', att: 8, quiz: 12, assign: 15, mid: 22, final: 0 },
        { id: '191002042', name: 'Farhana Akter', att: 10, quiz: 14, assign: 18, mid: 28, final: 0 },
        { id: '191002043', name: 'Sajid Ahmed', att: 6, quiz: 9, assign: 12, mid: 18, final: 0 },
        { id: '191002044', name: 'Nusrat Jahan', att: 9, quiz: 13, assign: 19, mid: 25, final: 0 },
        { id: '191002045', name: 'Karim Hassan', att: 7, quiz: 10, assign: 14, mid: 20, final: 0 },
    ]);

    // --- State: Saving Status ---
    const [saveStatus, setSaveStatus] = useState('saved'); // 'saved', 'saving'

    // --- Handler: Update Marks ---
    const handleInputChange = (id, field, value) => {
        setSaveStatus('saving');

        // Convert input to number (handle empty string)
        const numValue = value === '' ? 0 : parseFloat(value);

        setStudents(prevStudents =>
            prevStudents.map(student => {
                if (student.id === id) {
                    return { ...student, [field]: numValue };
                }
                return student;
            })
        );

        // Simulate API delay for "Live Save" effect
        setTimeout(() => setSaveStatus('saved'), 800);
    };

    return (
        <Section user={user}>
            <div className="min-h-screen bg-slate-50 font-sans flex flex-col">

                {/* --- Header & Controls --- */}
                <div className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
                    <div className="container mx-auto px-6 py-4">

                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                            {/* Course Details */}
                            <div>
                                <div className="flex items-center gap-3">
                                    <h1 className="text-xl font-bold text-slate-800">{courseInfo.subjectCode}</h1>
                                    <span className="text-slate-300">|</span>
                                    <h2 className="text-lg text-slate-600 font-medium">{courseInfo.subjectName}</h2>
                                </div>
                                <p className="text-xs text-slate-400 mt-1 uppercase tracking-wide font-bold">
                                    {courseInfo.program} • {courseInfo.session}
                                </p>
                            </div>

                            {/* Status & Actions */}
                            <div className="flex items-center gap-4">
                                {/* Live Save Indicator */}
                                <div className="flex items-center gap-2">
                                    {saveStatus === 'saving' ? (
                                        <>
                                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-indigo-600"></div>
                                            <span className="text-xs text-indigo-600 font-bold">Syncing...</span>
                                        </>
                                    ) : (
                                        <>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            <span className="text-xs text-emerald-600 font-bold">All Changes Saved</span>
                                        </>
                                    )}
                                </div>

                                <button className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold py-2 px-4 rounded shadow transition-colors">
                                    Finalize & Submit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- Mark Entry Table --- */}
                <div className="container mx-auto p-6">
                    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-slate-100 text-slate-600 text-xs uppercase font-bold sticky top-0">
                                    <tr>
                                        <th className="px-6 py-4 border-b border-slate-200">Student ID</th>
                                        <th className="px-6 py-4 border-b border-slate-200 w-1/4">Student Name</th>
                                        <th className="px-2 py-4 border-b border-slate-200 text-center w-20 bg-blue-50/50">Att (10)</th>
                                        <th className="px-2 py-4 border-b border-slate-200 text-center w-20 bg-teal-50/50">Quiz (15)</th> {/* NEW COLUMN Header */}
                                        <th className="px-2 py-4 border-b border-slate-200 text-center w-20 bg-orange-50/50">Assgn (20)</th>
                                        <th className="px-2 py-4 border-b border-slate-200 text-center w-20 bg-purple-50/50">Mid (30)</th>
                                        <th className="px-2 py-4 border-b border-slate-200 text-center w-20 bg-pink-50/50">Final (40)</th>
                                        <th className="px-4 py-4 border-b border-slate-200 text-center bg-gray-50 text-slate-800">Total</th>
                                        <th className="px-4 py-4 border-b border-slate-200 text-center bg-gray-50 text-slate-800">Grade</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm divide-y divide-slate-100">
                                    {students.map((student) => {
                                        // Dynamic Calculation including Quiz
                                        const total = student.att + student.quiz + student.assign + student.mid + student.final;
                                        const { grade, point } = calculateGrade(total);
                                        const isFail = grade === 'F';

                                        return (
                                            <tr key={student.id} className="hover:bg-slate-50 transition-colors group">
                                                <td className="px-6 py-3 font-mono text-slate-600 font-bold">
                                                    {student.id}
                                                </td>
                                                <td className="px-6 py-3 font-medium text-slate-700">
                                                    {student.name}
                                                </td>

                                                {/* --- Input Columns --- */}
                                                <td className="px-2 py-2 text-center">
                                                    <input
                                                        type="number"
                                                        max="10"
                                                        value={student.att || ''}
                                                        onChange={(e) => handleInputChange(student.id, 'att', e.target.value)}
                                                        className="w-14 text-center border border-gray-300 rounded focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 py-1.5 font-bold text-slate-700 bg-white"
                                                    />
                                                </td>

                                                {/* --- NEW Quiz Column Input --- */}
                                                <td className="px-2 py-2 text-center">
                                                    <input
                                                        type="number"
                                                        max="15"
                                                        value={student.quiz || ''}
                                                        onChange={(e) => handleInputChange(student.id, 'quiz', e.target.value)}
                                                        className="w-14 text-center border border-gray-300 rounded focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 py-1.5 font-bold text-slate-700 bg-white"
                                                    />
                                                </td>

                                                <td className="px-2 py-2 text-center">
                                                    <input
                                                        type="number"
                                                        max="20"
                                                        value={student.assign || ''}
                                                        onChange={(e) => handleInputChange(student.id, 'assign', e.target.value)}
                                                        className="w-14 text-center border border-gray-300 rounded focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 py-1.5 font-bold text-slate-700 bg-white"
                                                    />
                                                </td>
                                                <td className="px-2 py-2 text-center">
                                                    <input
                                                        type="number"
                                                        max="30"
                                                        value={student.mid || ''}
                                                        onChange={(e) => handleInputChange(student.id, 'mid', e.target.value)}
                                                        className="w-14 text-center border border-gray-300 rounded focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 py-1.5 font-bold text-slate-700 bg-white"
                                                    />
                                                </td>
                                                <td className="px-2 py-2 text-center">
                                                    <input
                                                        type="number"
                                                        max="40"
                                                        value={student.final || ''}
                                                        onChange={(e) => handleInputChange(student.id, 'final', e.target.value)}
                                                        className="w-14 text-center border border-gray-300 rounded focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 py-1.5 font-bold text-slate-700 bg-white"
                                                    />
                                                </td>

                                                {/* --- Calculated Columns (Read Only) --- */}
                                                <td className="px-4 py-3 text-center bg-gray-50/50">
                                                    <span className={`font-bold text-base ${isFail ? 'text-red-500' : 'text-slate-700'}`}>
                                                        {total}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-center bg-gray-50/50">
                                                    <div className={`inline-flex flex-col leading-none ${isFail ? 'text-red-600' : 'text-emerald-600'}`}>
                                                        <span className="font-bold text-lg">{grade}</span>
                                                        <span className="text-[10px] font-bold opacity-60">{point.toFixed(2)}</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Footer / Empty Space */}
                        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 text-center">
                            <p className="text-xs text-slate-400">End of student list. Total {students.length} records found.</p>
                        </div>
                    </div>
                </div>

            </div>
        </Section>
    );
};

export default MarkEntryPage;