"use client";
import React, { useState, useEffect } from 'react';
import {
    getProgramsAction,
    getSubjectsByProgramAction,
    addSubjectAction,
    deleteSubjectAction // [NEW] Import this
} from './addSubjectAction';
import { FaBook, FaSpinner, FaCheckCircle, FaExclamationCircle, FaListAlt, FaTrash } from 'react-icons/fa';
import AdminSection from '../AdminSection';

const AddSubjectForm = () => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Data Loading State
    const [programs, setPrograms] = useState([]);
    const [existingSubjects, setExistingSubjects] = useState([]);
    const [loadingSubjects, setLoadingSubjects] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        programId: '',
        semester: '',
        subjectName: '',
        subjectCode: ''
    });

    // 1. Load Programs on Mount
    useEffect(() => {
        const fetchPrograms = async () => {
            const res = await getProgramsAction();
            if (res.status === 'success') setPrograms(res.data);
        };
        fetchPrograms();
    }, []);

    // 2. Load Subjects Helper
    const loadSubjects = async () => {
        if (!formData.programId) return;
        setLoadingSubjects(true);
        const res = await getSubjectsByProgramAction(formData.programId, formData.semester);
        if (res.status === 'success') setExistingSubjects(res.data);
        setLoadingSubjects(false);
    };

    // Trigger load on change
    useEffect(() => {
        if (!formData.programId) {
            setExistingSubjects([]);
            return;
        }
        loadSubjects();
    }, [formData.programId, formData.semester]);


    // 3. Handle Submit
    const handleSubmit = async () => {
        setLoading(true);
        setMessage({ type: '', text: '' });

        const payload = new FormData();
        payload.append("programId", formData.programId);
        payload.append("semester", formData.semester);
        payload.append("subjectName", formData.subjectName);
        payload.append("subjectCode", formData.subjectCode);

        try {
            const result = await addSubjectAction(payload);

            if (result.status === 'success') {
                setMessage({ type: 'success', text: result.message });
                setFormData(prev => ({ ...prev, subjectName: '', subjectCode: '' }));
                loadSubjects(); // Refresh list
            } else {
                setMessage({ type: 'error', text: result.message });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Something went wrong.' });
        } finally {
            setLoading(false);
        }
    };

    // 4. [NEW] Handle Delete
    const handleDelete = async (subjectId) => {
        if (!window.confirm("Are you sure you want to delete this subject?")) return;

        // Optimistically remove from UI or show loading
        setLoadingSubjects(true);
        try {
            const res = await deleteSubjectAction(subjectId);
            if (res.status === 'success') {
                loadSubjects(); // Refresh the list from DB
            } else {
                alert("Failed to delete");
                setLoadingSubjects(false);
            }
        } catch (e) {
            alert("Error deleting subject");
            setLoadingSubjects(false);
        }
    };

    return (
        <AdminSection>
            <div className="min-h-screen bg-slate-50 font-sans flex flex-col justify-center items-center py-10">

                <div className="w-full container px-4">
                    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">

                        {/* Header */}
                        <div className="bg-gradient-to-r from-purple-600 to-indigo-700 px-8 py-6 text-white">
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <FaBook /> Add New Subject
                            </h2>
                            <p className="text-purple-100 text-sm mt-1">Register a new course/subject under an academic program.</p>
                        </div>

                        {/* Status Message */}
                        {message.text && (
                            <div className={`mx-8 mt-6 p-4 rounded-md flex items-center gap-2 ${message.type === 'success'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-red-50 text-red-700 border border-red-200'
                                }`}>
                                {message.type === 'success' ? <FaCheckCircle /> : <FaExclamationCircle />}
                                {message.text}
                            </div>
                        )}

                        <form className="px-8 py-8">

                            <div className="space-y-6">

                                


                                {/* Divider */}
                                <div className="relative flex py-1 items-center">
                                    <div className="flex-grow border-t border-gray-200"></div>
                                    <span className="flex-shrink-0 mx-4 text-gray-400 text-xs font-bold uppercase tracking-widest">New Entry Details</span>
                                    <div className="flex-grow border-t border-gray-200"></div>
                                </div>


                                {/* 1. Program Name (Select) */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-600 mb-1">Program Name</label>
                                    <select
                                        value={formData.programId}
                                        onChange={(e) => setFormData({ ...formData, programId: e.target.value })}
                                        className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:border-purple-500 bg-white"
                                    >
                                        <option value="" disabled>Select a Program</option>
                                        {programs.map(prog => (
                                            <option key={prog.id} value={prog.id}>
                                                {prog.program_name} ({prog.program_short_name})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* 2. Semester (Select) */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-600 mb-1">Semester</label>
                                    <select
                                        value={formData.semester}
                                        onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                                        className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:border-purple-500 bg-white"
                                    >
                                        <option value="" disabled>Select Semester</option>
                                        {[...Array(8)].map((_, i) => (
                                            <option key={i} value={`${i + 1}`}>{i + 1}th Semester</option>
                                        ))}
                                    </select>
                                </div>


                                {/* --- Dynamic List Viewer --- */}
                                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg mb-6">
                                    <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                                        <FaListAlt className="text-purple-500" /> Check Existing Subjects
                                    </label>

                                    <p className="text-xs text-slate-500 mb-2">Select a Program & Semester below to see subjects.</p>

                                    {formData.programId && formData.semester && (
                                        <div className="mt-3 bg-white border border-gray-200 rounded-md shadow-inner max-h-60 overflow-y-auto">
                                            {loadingSubjects ? (
                                                <div className="p-4 text-center text-xs text-slate-400">Loading...</div>
                                            ) : (
                                                <ul className="divide-y divide-gray-100">
                                                    {existingSubjects.length > 0 ? (
                                                        existingSubjects.map((sub) => (
                                                            <li key={sub.id} className="px-3 py-2 text-sm flex justify-between items-center hover:bg-gray-50 group">
                                                                <div className="flex items-center gap-3">
                                                                    <span className="text-xs font-mono font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded border border-purple-100">
                                                                        {sub.subject_code}
                                                                    </span>
                                                                    <span className="text-gray-700 font-medium">{sub.subject_name}</span>
                                                                </div>

                                                                {/* [NEW] Delete Button */}
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleDelete(sub.id)}
                                                                    className="text-gray-300 hover:text-red-500 transition-colors p-2"
                                                                    title="Delete Subject"
                                                                >
                                                                    <FaTrash size={14} />
                                                                </button>
                                                            </li>
                                                        ))
                                                    ) : (
                                                        <li className="p-3 text-sm text-gray-400 italic">No subjects found for this semester.</li>
                                                    )}
                                                </ul>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* 3. Subject Name */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-600 mb-1">Subject Name</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Data Structures & Algorithms"
                                        value={formData.subjectName}
                                        onChange={(e) => setFormData({ ...formData, subjectName: e.target.value })}
                                        className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                                    />
                                </div>

                                {/* 4. Subject Code */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-600 mb-1">Subject Code</label>
                                    <div className="flex">
                                        <input
                                            type="text"
                                            placeholder="e.g. CSE-2101"
                                            value={formData.subjectCode}
                                            onChange={(e) => setFormData({ ...formData, subjectCode: e.target.value.toUpperCase() })}
                                            className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:border-purple-500 font-mono text-slate-700 font-bold uppercase tracking-wide"
                                        />
                                    </div>
                                </div>

                            </div>

                            {/* Actions */}
                            <div className="flex justify-end gap-4 pt-8 mt-4 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => window.history.back()}
                                    className="px-6 py-2 rounded-md text-slate-600 hover:bg-slate-100 font-semibold transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-8 rounded-md shadow-lg transition-transform active:scale-95 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? <FaSpinner className="animate-spin" /> : null}
                                    {loading ? 'Adding...' : 'Add Subject'}
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </AdminSection>
    );
};

export default AddSubjectForm;