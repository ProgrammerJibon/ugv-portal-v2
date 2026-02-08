"use client";
import Section from '@/Components/Section';
import React, { useState, useEffect, useRef } from 'react';
import { getClassMarksData, saveStudentMark } from './markEntryActions'; // Adjust path
import { useParams } from 'next/navigation';
import { FaSpinner, FaSave } from 'react-icons/fa';

const MarkEntryPage = ({ user }) => {
    // Get Subject ID from URL
    const params = useParams();
    const subjectId = params.subjectId; // Matches folder name [subjectId]
    

    // --- State ---
    const [loading, setLoading] = useState(true);
    const [courseInfo, setCourseInfo] = useState(null);
    const [students, setStudents] = useState([]);
    const [saveStatus, setSaveStatus] = useState('saved'); // 'saved', 'saving', 'error'

    // --- Data Loading ---
    useEffect(() => {
        if (!user?.id || !subjectId) return;

        const loadData = async () => {
            const res = await getClassMarksData(subjectId, user.id);
            if (res.status === 'success') {
                setCourseInfo(res.courseInfo);

                // Map DB columns to frontend keys
                const mappedStudents = res.students.map(s => ({
                    id: s.user_id,
                    name: s.name,
                    att: parseFloat(s.mark_attendance),
                    quiz: parseFloat(s.mark_quiz),
                    assign: parseFloat(s.mark_assignment),
                    mid: parseFloat(s.mark_mid),
                    final: parseFloat(s.mark_final),
                    registerred: s.registerred
                }));
                setStudents(mappedStudents);
            } else {
                alert(res.message);
            }
            setLoading(false);
        };
        loadData();
    }, [user, subjectId]);

    // --- Helper: Calculate Grade ---
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

    // --- Handler: Update Marks (with Debounce) ---
    // We use a ref to store timeouts for each field to avoid race conditions
    const debounceTimers = useRef({});

    const handleInputChange = (studentId, field, value) => {
        // 1. Validations (Ensure numbers and max limits)
        let numValue = value === '' ? 0 : parseFloat(value);
        if (numValue < 0) numValue = 0;

        // Define limits per field
        const limits = { att: 10, quiz: 15, assign: 20, mid: 30, final: 40 };
        if (numValue > limits[field]) numValue = limits[field];

        // 2. Optimistic Update (Update UI Immediately)
        setStudents(prev => prev.map(s =>
            s.id === studentId ? { ...s, [field]: numValue } : s
        ));

        setSaveStatus('saving');

        // 3. Debounced Server Save
        // Clear existing timer for this specific cell
        const key = `${studentId}-${field}`;
        if (debounceTimers.current[key]) clearTimeout(debounceTimers.current[key]);

        debounceTimers.current[key] = setTimeout(async () => {
            // Map frontend field names to DB columns
            const dbFieldMap = {
                att: 'mark_attendance',
                quiz: 'mark_quiz',
                assign: 'mark_assignment',
                mid: 'mark_mid',
                final: 'mark_final'
            };

            const payload = {
                studentUserId: studentId,
                subjectId: subjectId,
                teacherId: user.id,
                sessionId: courseInfo.session_id,
                programId: courseInfo.program_id,
                semester: courseInfo.semester,
                field: dbFieldMap[field],
                value: numValue
            };

            const res = await saveStudentMark(payload);
            if (res.status === 'success') {
                setSaveStatus('saved');
            } else {
                setSaveStatus('error');
            }
        }, 1000); // Wait 1 second after typing stops
    };

    if (loading) {
        return <div className="h-screen flex items-center justify-center text-slate-500"><FaSpinner className="animate-spin mr-2" /> Loading Class Data...</div>;
    }

    if (!courseInfo) {
        return <div className="h-screen flex items-center justify-center text-red-500">Course info not found or access denied.</div>;
    }

    return (
        <Section user={user}>
            <div className="min-h-screen bg-slate-50 font-sans flex flex-col">

                {/* --- Header --- */}
                <div className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
                    <div className="container mx-auto px-6 py-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-3">
                                    <h1 className="text-xl font-bold text-slate-800">{courseInfo.subject_code}</h1>
                                    <span className="text-slate-300">|</span>
                                    <h2 className="text-lg text-slate-600 font-medium">{courseInfo.subject_name}</h2>
                                </div>
                                <p className="text-xs text-slate-400 mt-1 uppercase tracking-wide font-bold">
                                    {courseInfo.program_name} • {courseInfo.formattedSession} • {courseInfo.semester} Semester
                                </p>
                            </div>

                            {/* Save Status Indicator */}
                            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
                                {saveStatus === 'saving' && <><div className="animate-spin h-3 w-3 border-2 border-indigo-500 border-t-transparent rounded-full"></div><span className="text-xs text-indigo-600 font-bold">Saving...</span></>}
                                {saveStatus === 'saved' && <><FaSave className="text-emerald-500" /><span className="text-xs text-emerald-600 font-bold">All Saved</span></>}
                                {saveStatus === 'error' && <span className="text-xs text-red-600 font-bold">Save Failed! Check Connection</span>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- Table --- */}
                <div className="container mx-auto p-6">
                    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-slate-100 text-slate-600 text-xs uppercase font-bold sticky top-0">
                                    <tr>
                                        <th className="px-6 py-4 border-b border-slate-200">Student ID</th>
                                        <th className="px-6 py-4 border-b border-slate-200 w-1/4">Name</th>
                                        <th className="px-2 py-4 border-b border-slate-200 text-center w-24 bg-blue-50/50">Att ({courseInfo.mark_attendance})</th>
                                        <th className="px-2 py-4 border-b border-slate-200 text-center w-24 bg-teal-50/50">Quiz ({courseInfo.mark_quize})</th>
                                        <th className="px-2 py-4 border-b border-slate-200 text-center w-24 bg-orange-50/50">Assgn ({courseInfo.mark_assignment})</th>
                                        <th className="px-2 py-4 border-b border-slate-200 text-center w-24 bg-purple-50/50">Mid ({courseInfo.mark_mid})</th>
                                        <th className="px-2 py-4 border-b border-slate-200 text-center w-24 bg-pink-50/50">Final ({courseInfo.mark_final})</th>
                                        <th className="px-4 py-4 border-b border-slate-200 text-center bg-gray-50 text-slate-800">Total({Number.parseInt(courseInfo.mark_attendance) + Number.parseInt(courseInfo.mark_quize) + Number.parseInt(courseInfo.mark_assignment) + Number.parseInt(courseInfo.mark_mid) + Number.parseInt(courseInfo.mark_final)})</th>
                                        <th className="px-4 py-4 border-b border-slate-200 text-center bg-gray-50 text-slate-800">Grade</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm divide-y divide-slate-100">
                                    {students.length > 0 ? students.map((student, i) => {
                                        const total = student.att + student.quiz + student.assign + student.mid + student.final;
                                        const { grade, point } = calculateGrade(total);
                                        const isFail = grade === 'F';

                                        return (
                                            <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-3 font-mono text-slate-600 font-bold">{student.id}</td>
                                                <td className="px-6 py-3 font-medium text-slate-700">{student.name}</td>

                                                {/* Input Fields */}
                                                {['att', 'quiz', 'assign', 'mid', 'final'].map((field) => (
                                                    <td key={field} className="px-2 py-2 text-center">
                                                        <input
                                                            type="number"
                                                            title={student.registerred == 0 ? "This student is not registerred yet!" : ""}
                                                            disabled={student.registerred == 0}
                                                            value={student[field] === 0 ? '' : student[field]} // Show empty if 0 for better UX? Or keep 0.
                                                            placeholder="0"
                                                            onChange={(e) => handleInputChange(student.id, field, e.target.value)}
                                                            className={`w-16 text-center border rounded py-1.5 font-bold ${student.registerred == 0 ? 'text-gray-400' :'text-gray-900'} focus:outline-none focus:ring-2 transition-all
                                                                ${field === 'att' ? 'focus:border-blue-500 focus:ring-blue-200' : ''}
                                                                ${field === 'quiz' ? 'focus:border-teal-500 focus:ring-teal-200' : ''}
                                                                ${field === 'assign' ? 'focus:border-orange-500 focus:ring-orange-200' : ''}
                                                                ${field === 'mid' ? 'focus:border-purple-500 focus:ring-purple-200' : ''}
                                                                ${field === 'final' ? 'focus:border-pink-500 focus:ring-pink-200' : ''}
                                                                ${saveStatus === 'saving' ? 'bg-gray-50' : 'bg-white border-gray-300'}
                                                            `}
                                                        />
                                                    </td>
                                                ))}

                                                {/* Calculated Fields */}
                                                <td className="px-4 py-3 text-center bg-gray-50/50 font-bold text-base text-slate-700">
                                                    {total.toFixed(0)}
                                                </td>
                                                <td className="px-4 py-3 text-center bg-gray-50/50">
                                                    <div className={`inline-flex flex-col leading-none ${isFail ? 'text-red-600' : 'text-emerald-600'}`}>
                                                        <span className="font-bold text-lg">{student.registerred != 0 ? grade : "I"}</span>
                                                        <span className="text-[10px] font-bold opacity-60">{point.toFixed(2)}</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    }) : (
                                        <tr>
                                            <td colSpan="9" className="text-center py-10 text-slate-400">
                                                No students found for this course/session.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            </div>
        </Section>
    );
};

export default MarkEntryPage;