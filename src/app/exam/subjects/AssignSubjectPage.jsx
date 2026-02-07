"use client";

import Section from '@/Components/Section';
import React, { useState, useEffect } from 'react';
import {
    getAllocationDropdowns,
    getSubjectsForDropdown,
    getAssignmentsAction,
    assignTeacherAction,
    removeAssignmentAction
} from './assignSubjectActions';
import { FaSpinner, FaTrash, FaChalkboardTeacher } from 'react-icons/fa';

const AssignSubjectPage = ({ user }) => {
    // --- Data Sources ---
    const [sessionsList, setSessionsList] = useState([]);
    const [majorsList, setMajorsList] = useState([]);
    const [teachersList, setTeachersList] = useState([]);
    const [subjectsList, setSubjectsList] = useState([]); // Filtered subjects

    // --- Context Filters (IDs) ---
    const [selectedSessionId, setSelectedSessionId] = useState('');
    const [selectedProgramId, setSelectedProgramId] = useState('');

    // --- Form State ---
    const [semester, setSemester] = useState('1');
    const [selectedSubjectId, setSelectedSubjectId] = useState('');
    const [selectedTeacherId, setSelectedTeacherId] = useState('');

    // --- UI State ---
    const [assignments, setAssignments] = useState([]);
    const [loadingData, setLoadingData] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // 1. Initial Load (Dropdowns)
    useEffect(() => {
        const init = async () => {
            const res = await getAllocationDropdowns();
                console.log(res);
            if (res.status === 'success') {
                
                setSessionsList(res.sessions);
                setMajorsList(res.majors);
                setTeachersList(res.teachers);

                // Set defaults if data exists
                if (res.sessions.length > 0) setSelectedSessionId(res.sessions[0].id);
                if (res.majors.length > 0) setSelectedProgramId(res.majors[0].id);
            }
            setLoadingData(false);
        };
        init();
    }, []);

    // 2. Load Assignments (Table) when Filters Change
    useEffect(() => {
        if (selectedSessionId && selectedProgramId) {
            loadAssignments();
        }
    }, [selectedSessionId, selectedProgramId]);

    const loadAssignments = async () => {
        const res = await getAssignmentsAction(selectedSessionId, selectedProgramId);
        if (res.status === 'success') {
            setAssignments(res.data);
        }
    };

    // 3. Load Subjects (Form) when Program/Semester Changes
    useEffect(() => {
        if (selectedProgramId && semester) {
            const fetchSubjects = async () => {
                const res = await getSubjectsForDropdown(selectedProgramId, semester);
                if (res.status === 'success') setSubjectsList(res.data);
            };
            fetchSubjects();
        }
    }, [selectedProgramId, semester]);


    // --- Handlers ---
    const handleAssign = async (e) => {
        e.preventDefault();
        if (!selectedSessionId || !selectedProgramId || !selectedSubjectId || !selectedTeacherId) {
            alert("Please select all fields.");
            return;
        }

        setSubmitting(true);
        const formData = new FormData();
        formData.append("sessionId", selectedSessionId);
        formData.append("programId", selectedProgramId);
        formData.append("semester", semester);
        formData.append("subjectId", selectedSubjectId);
        formData.append("teacherId", selectedTeacherId);

        const res = await assignTeacherAction(formData);

        if (res.status === 'success') {
            await loadAssignments(); // Refresh table
            setSelectedSubjectId('');
            setSelectedTeacherId('');
        } else {
            alert(res.message);
        }
        setSubmitting(false);
    };

    const removeAssignment = async (id) => {
        if (!confirm("Remove this faculty assignment?")) return;

        const res = await removeAssignmentAction(id);
        if (res.status === 'success') {
            setAssignments(assignments.filter(item => item.id !== id));
        } else {
            alert(res.message);
        }
    };

    // Helper to get text for headers
    const getCurrentSessionName = () => {
        const s = sessionsList.find(i => i.id == selectedSessionId);
        return s ? `${s.session_season} ${s.session_year}` : 'Loading...';
    };
    const getCurrentProgramName = () => {
        const p = majorsList.find(i => i.id == selectedProgramId);
        return p ? p.program_short_name : '...';
    };

    return (
        <Section user={user} title="Course Allocation Manager">
            <div className="min-h-screen bg-slate-50 font-sans flex flex-col">

                <div className="container mx-auto p-6">

                    {/* Page Header */}
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-slate-800">Course Allocation Manager</h1>
                        <p className="text-sm text-slate-500">Exam Controller Dashboard</p>
                    </div>

                    {loadingData ? (
                        <div className="text-center py-10"><FaSpinner className="animate-spin inline" /> Loading Data...</div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                            {/* --- Left Column: Allocation Form --- */}
                            <div className="lg:col-span-1">
                                <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden sticky top-6">
                                    <div className="bg-indigo-600 px-6 py-4">
                                        <h2 className="text-white font-bold text-lg flex items-center gap-2">
                                            <FaChalkboardTeacher /> Assign Faculty
                                        </h2>
                                    </div>

                                    <form onSubmit={handleAssign} className="p-6 space-y-5">

                                        {/* --- Context Selectors --- */}
                                        <div className="grid grid-cols-2 gap-4 p-4 bg-indigo-50 rounded-lg border border-indigo-100 mb-2">
                                            <div>
                                                <label className="block text-xs font-bold text-indigo-800 mb-1 uppercase">Session</label>
                                                <select
                                                    value={selectedSessionId}
                                                    onChange={(e) => setSelectedSessionId(e.target.value)}
                                                    className="w-full border border-indigo-200 rounded text-sm px-2 py-1.5 focus:outline-none focus:border-indigo-500 bg-white"
                                                >
                                                    {sessionsList.map(s => (
                                                        <option key={s.id} value={s.id}>{s.session_season} {s.session_year}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-indigo-800 mb-1 uppercase">Major/Dept</label>
                                                <select
                                                    value={selectedProgramId}
                                                    onChange={(e) => setSelectedProgramId(e.target.value)}
                                                    className="w-full border border-indigo-200 rounded text-sm px-2 py-1.5 focus:outline-none focus:border-indigo-500 bg-white"
                                                >
                                                    {majorsList.map(m => (
                                                        <option key={m.id} value={m.id}>{m.program_short_name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        {/* 1. Select Semester */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">Target Semester</label>
                                            <select
                                                value={semester}
                                                onChange={(e) => setSemester(e.target.value)}
                                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-indigo-500 bg-white"
                                            >
                                                {[...Array(8)].map((_, i) => (
                                                    <option key={i} value={`${i + 1}`}>{i + 1}th Semester</option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* 2. Select Subject */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">Course / Subject</label>
                                            <select
                                                value={selectedSubjectId}
                                                onChange={(e) => setSelectedSubjectId(e.target.value)}
                                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-indigo-500 bg-white"
                                            >
                                                <option value="">-- Select Course --</option>
                                                {subjectsList.map((sub) => (
                                                    <option key={sub.id} value={sub.id}>{sub.subject_code} - {sub.subject_name}</option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* 3. Select Teacher */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">Assign Teacher</label>
                                            <select
                                                value={selectedTeacherId}
                                                onChange={(e) => setSelectedTeacherId(e.target.value)}
                                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-indigo-500 bg-white"
                                            >
                                                <option value="">-- Select Faculty --</option>
                                                {teachersList.map((t) => (
                                                    <option key={t.id} value={t.id}>{t.name} ({t.designation})</option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Submit Button */}
                                        <button
                                            type="submit"
                                            disabled={submitting}
                                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md shadow transition-colors flex justify-center items-center gap-2 mt-2 disabled:opacity-50"
                                        >
                                            {submitting ? <FaSpinner className="animate-spin" /> : null}
                                            Confirm Assignment
                                        </button>

                                    </form>
                                </div>
                            </div>


                            {/* --- Right Column: Assignment List Table --- */}
                            <div className="lg:col-span-2">
                                <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden min-h-[500px]">
                                    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                                        <h3 className="font-bold text-slate-700">Current Allocations</h3>
                                        <div className="flex gap-2">
                                            <span className="text-xs font-bold text-slate-500 bg-white px-2 py-1 rounded border border-slate-200">
                                                {getCurrentSessionName()}
                                            </span>
                                            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded border border-indigo-200">
                                                {getCurrentProgramName()} Major
                                            </span>
                                        </div>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-bold">
                                                <tr>
                                                    <th className="px-6 py-3 border-b border-slate-200">Semester</th>
                                                    <th className="px-6 py-3 border-b border-slate-200">Course Info</th>
                                                    <th className="px-6 py-3 border-b border-slate-200">Assigned Faculty</th>
                                                    <th className="px-6 py-3 border-b border-slate-200 text-right">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-sm">
                                                {assignments.length > 0 ? (
                                                    assignments.map((item) => (
                                                        <tr key={item.id} className="hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0">
                                                            <td className="px-6 py-4 font-medium text-slate-700">
                                                                <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-bold border border-slate-200">
                                                                    {item.semester} Sem
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <div className="font-bold text-slate-800">{item.subject_code}</div>
                                                                <div className="text-xs text-slate-500">{item.subject_name}</div>
                                                            </td>
                                                            <td className="px-6 py-4 text-slate-600 flex items-center gap-2">
                                                                <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">
                                                                    {item.teacher_name.charAt(0)}
                                                                </div>
                                                                <div>
                                                                    <p className="font-semibold text-xs">{item.teacher_name}</p>
                                                                    <p className="text-[10px] text-slate-400">{item.designation}</p>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 text-right">
                                                                <button
                                                                    onClick={() => removeAssignment(item.id)}
                                                                    className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded transition-colors"
                                                                    title="Remove Assignment"
                                                                >
                                                                    <FaTrash size={14} />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="4" className="text-center py-10 text-slate-400">
                                                            No subjects assigned for this selection yet.
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
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

export default AssignSubjectPage;