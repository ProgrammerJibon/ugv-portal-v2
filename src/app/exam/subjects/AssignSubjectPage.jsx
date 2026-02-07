"use client";

import Section from '@/Components/Section';
import React, { useState } from 'react';

const AssignSubjectPage = ({ user }) => {
    // --- State for Context Filters ---
    const [session, setSession] = useState('Spring 2026');
    const [department, setDepartment] = useState('CSE');

    // --- Mock Data ---
    const teachers = [
        { id: 1, name: "Dr. Abul Kalam", designation: "Professor" },
        { id: 2, name: "Ms. Farhana Ahmed", designation: "Lecturer" },
        { id: 3, name: "Mr. Rahim Uddin", designation: "Asst. Professor" },
        { id: 4, name: "Mrs. Salma Begum", designation: "Senior Lecturer" }
    ];

    const subjects = [
        { code: 'CSE-101', name: 'Computer Fundamentals' },
        { code: 'CSE-102', name: 'Structured Programming' },
        { code: 'CSE-201', name: 'Data Structures' },
        { code: 'CSE-205', name: 'Algorithms' },
        { code: 'CSE-301', name: 'Database Systems' },
        { code: 'CSE-401', name: 'Artificial Intelligence' }
    ];

    // --- State for Form & List ---
    const [assignments, setAssignments] = useState([
        { id: 1, semester: '1st', code: 'CSE-101', subject: 'Computer Fundamentals', teacher: 'Ms. Farhana Ahmed' },
        { id: 2, semester: '3rd', code: 'CSE-201', subject: 'Data Structures', teacher: 'Mr. Rahim Uddin' }
    ]);

    const [formData, setFormData] = useState({
        semester: '1st',
        subjectCode: '',
        teacherId: ''
    });

    // --- Handlers ---
    const handleAssign = (e) => {
        e.preventDefault();
        if (!formData.subjectCode || !formData.teacherId) return;

        const selectedSubject = subjects.find(s => s.code === formData.subjectCode);
        const selectedTeacher = teachers.find(t => t.id === parseInt(formData.teacherId));

        const newAssignment = {
            id: Date.now(),
            semester: formData.semester,
            code: selectedSubject.code,
            subject: selectedSubject.name,
            teacher: selectedTeacher.name
        };

        setAssignments([...assignments, newAssignment]);
        // Reset form slightly
        setFormData({ ...formData, subjectCode: '', teacherId: '' });
    };

    const removeAssignment = (id) => {
        setAssignments(assignments.filter(item => item.id !== id));
    };

    return (
        <Section user={user} title="Course Allocation Manager">
            <div className="min-h-screen bg-slate-50 font-sans flex flex-col">

                {/* --- Main Content (Navbar Removed) --- */}
                <div className="container mx-auto p-6">

                    {/* Page Header */}
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-slate-800">Course Allocation Manager</h1>
                        <p className="text-sm text-slate-500">Exam Controller Dashboard</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* --- Left Column: Allocation Form --- */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden sticky top-6">
                                <div className="bg-indigo-600 px-6 py-4">
                                    <h2 className="text-white font-bold text-lg flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                        </svg>
                                        Assign Faculty
                                    </h2>
                                </div>

                                <form onSubmit={handleAssign} className="p-6 space-y-5">

                                    {/* --- NEW: Context Selectors (Session & Dept) --- */}
                                    <div className="grid grid-cols-2 gap-4 p-4 bg-indigo-50 rounded-lg border border-indigo-100 mb-2">
                                        <div>
                                            <label className="block text-xs font-bold text-indigo-800 mb-1 uppercase">Session</label>
                                            <select
                                                value={session}
                                                onChange={(e) => setSession(e.target.value)}
                                                className="w-full border border-indigo-200 rounded text-sm px-2 py-1.5 focus:outline-none focus:border-indigo-500 bg-white"
                                            >
                                                <option>Spring 2026</option>
                                                <option>Summer 2026</option>
                                                <option>Fall 2026</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-indigo-800 mb-1 uppercase">Major/Dept</label>
                                            <select
                                                value={department}
                                                onChange={(e) => setDepartment(e.target.value)}
                                                className="w-full border border-indigo-200 rounded text-sm px-2 py-1.5 focus:outline-none focus:border-indigo-500 bg-white"
                                            >
                                                <option value="CSE">CSE</option>
                                                <option value="EEE">EEE</option>
                                                <option value="BBA">BBA</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* 1. Select Semester */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Target Semester</label>
                                        <select
                                            value={formData.semester}
                                            onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-indigo-500 bg-white"
                                        >
                                            <option value="1st">1st Semester</option>
                                            <option value="2nd">2nd Semester</option>
                                            <option value="3rd">3rd Semester</option>
                                            <option value="4th">4th Semester</option>
                                            <option value="5th">5th Semester</option>
                                            <option value="6th">6th Semester</option>
                                            <option value="7th">7th Semester</option>
                                            <option value="8th">8th Semester</option>
                                        </select>
                                    </div>

                                    {/* 2. Select Subject */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Course / Subject</label>
                                        <select
                                            value={formData.subjectCode}
                                            onChange={(e) => setFormData({ ...formData, subjectCode: e.target.value })}
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-indigo-500 bg-white"
                                        >
                                            <option value="">-- Select Course --</option>
                                            {subjects.map((sub) => (
                                                <option key={sub.code} value={sub.code}>{sub.code} - {sub.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* 3. Select Teacher */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Assign Teacher</label>
                                        <select
                                            value={formData.teacherId}
                                            onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-indigo-500 bg-white"
                                        >
                                            <option value="">-- Select Faculty --</option>
                                            {teachers.map((t) => (
                                                <option key={t.id} value={t.id}>{t.name} ({t.designation})</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md shadow transition-colors flex justify-center items-center gap-2 mt-2"
                                    >
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
                                            {session}
                                        </span>
                                        <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded border border-indigo-200">
                                            {department} Major
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
                                                assignments.sort((a, b) => a.semester.localeCompare(b.semester)).map((item) => (
                                                    <tr key={item.id} className="hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0">
                                                        <td className="px-6 py-4 font-medium text-slate-700">
                                                            <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-bold border border-slate-200">
                                                                {item.semester} Sem
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="font-bold text-slate-800">{item.code}</div>
                                                            <div className="text-xs text-slate-500">{item.subject}</div>
                                                        </td>
                                                        <td className="px-6 py-4 text-slate-600 flex items-center gap-2">
                                                            <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">
                                                                {item.teacher.charAt(0)}
                                                            </div>
                                                            {item.teacher}
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            <button
                                                                onClick={() => removeAssignment(item.id)}
                                                                className="text-red-400 hover:text-red-600 p-1 hover:bg-red-50 rounded transition-colors"
                                                                title="Remove Assignment"
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                                </svg>
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
                </div>
            </div>
        </Section>
    );
};

export default AssignSubjectPage;