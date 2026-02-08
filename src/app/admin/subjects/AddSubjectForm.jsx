"use client";
import React, { useState, useEffect } from 'react';
import {
    getProgramsAction,
    getSubjectsByProgramAction,
    addSubjectAction,
    deleteSubjectAction
} from './addSubjectAction';
import { FaBook, FaSpinner, FaCheckCircle, FaExclamationCircle, FaListAlt, FaTrash, FaCalculator } from 'react-icons/fa';
import Section from '@/Components/Section';

const AddSubjectForm = ({ user }) => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const [programs, setPrograms] = useState([]);
    const [existingSubjects, setExistingSubjects] = useState([]);
    const [loadingSubjects, setLoadingSubjects] = useState(false);

    
    const initialState = {
        programId: '',
        semester: '',
        subjectName: '',
        subjectCode: '',
        credit: '3', 
        markAttendance: '15',
        markQuize: '15',
        markAssignment: '15',
        markMid: '45',
        markFinal: '60' 
    };

    const [formData, setFormData] = useState(initialState);

    
    useEffect(() => {
        const fetchPrograms = async () => {
            const res = await getProgramsAction();
            if (res.status === 'success') setPrograms(res.data);
        };
        fetchPrograms();
    }, []);

    
    const loadSubjects = async () => {
        if (!formData.programId) return;
        setLoadingSubjects(true);
        const res = await getSubjectsByProgramAction(formData.programId, formData.semester);
        if (res.status === 'success') setExistingSubjects(res.data);
        setLoadingSubjects(false);
    };

    useEffect(() => {
        if (!formData.programId) {
            setExistingSubjects([]);
            return;
        }
        loadSubjects();
    }, [formData.programId, formData.semester]);

    
    const handleChange = (e) => {
        let { name, value } = e.target;

        
        if (name === 'credit') {
            if (value > 3) value = '3';
            if (value < 1 && value !== '') value = '1';
        }

        setFormData({ ...formData, [name]: value });
    };

    
    const creditValue = parseInt(formData.credit || 0);
    const maxAllowedMarks = creditValue * 50; 

    const currentTotalMarks =
        parseInt(formData.markAttendance || 0) +
        parseInt(formData.markQuize || 0) +
        parseInt(formData.markAssignment || 0) +
        parseInt(formData.markMid || 0) +
        parseInt(formData.markFinal || 0);

    const isTotalValid = currentTotalMarks === maxAllowedMarks;
    const isOverLimit = currentTotalMarks > maxAllowedMarks;

    const handleSubmit = async () => {
        setLoading(true);
        setMessage({ type: '', text: '' });

        
        if (creditValue < 1 || creditValue > 3) {
            setMessage({ type: 'error', text: 'Credit must be between 1 and 3.' });
            setLoading(false);
            return;
        }

        
        if (currentTotalMarks !== maxAllowedMarks) {
            setMessage({
                type: 'error',
                text: `Total marks must be exactly ${maxAllowedMarks} for a ${creditValue} credit course. Current: ${currentTotalMarks}`
            });
            setLoading(false);
            return;
        }

        const payload = new FormData();
        
        payload.append("programId", formData.programId);
        payload.append("semester", formData.semester);
        payload.append("subjectName", formData.subjectName);
        payload.append("subjectCode", formData.subjectCode);
        
        payload.append("credit", formData.credit);
        payload.append("markAttendance", formData.markAttendance);
        payload.append("markQuize", formData.markQuize);
        payload.append("markAssignment", formData.markAssignment);
        payload.append("markMid", formData.markMid);
        payload.append("markFinal", formData.markFinal);

        try {
            const result = await addSubjectAction(payload);

            if (result.status === 'success') {
                setMessage({ type: 'success', text: result.message });
                
                setFormData(prev => ({
                    ...initialState,
                    programId: prev.programId,
                    semester: prev.semester
                }));
                loadSubjects();
            } else {
                setMessage({ type: 'error', text: result.message });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Something went wrong.' });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (subjectId) => {
        if (!window.confirm("Are you sure you want to delete this subject?")) return;
        setLoadingSubjects(true);
        try {
            const res = await deleteSubjectAction(subjectId);
            if (res.status === 'success') {
                loadSubjects();
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
        <Section user={user}>
            <div className="min-h-screen bg-slate-50 font-sans flex flex-col justify-center items-center py-10">
                <div className="w-full container px-4">
                    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">

                        {}
                        <div className="bg-gradient-to-r from-purple-600 to-indigo-700 px-8 py-6 text-white">
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <FaBook /> Add New Subject
                            </h2>
                            <p className="text-purple-100 text-sm mt-1">Register course details and marks distribution.</p>
                        </div>

                        {}
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
                            <div className="space-y-8">

                                {}
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-600 mb-1">Program Name</label>
                                            <select
                                                name="programId"
                                                value={formData.programId}
                                                onChange={handleChange}
                                                className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:outline-none focus:border-purple-500 bg-white"
                                            >
                                                <option value="" disabled>Select Program</option>
                                                {programs.map(prog => (
                                                    <option key={prog.id} value={prog.id}>{prog.program_name} ({prog.program_short_name})</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-600 mb-1">Semester</label>
                                            <select
                                                name="semester"
                                                value={formData.semester}
                                                onChange={handleChange}
                                                className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:outline-none focus:border-purple-500 bg-white"
                                            >
                                                <option value="" disabled>Select Semester</option>
                                                {[...Array(8)].map((_, i) => (
                                                    <option key={i} value={`${i + 1}`}>{i + 1}th Semester</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {}
                                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                                        <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                                            <FaListAlt className="text-purple-500" /> Existing Subjects
                                        </label>
                                        {formData.programId && formData.semester ? (
                                            <div className="mt-2 bg-white border border-gray-200 rounded-md shadow-inner max-h-40 overflow-y-auto">
                                                {loadingSubjects ? <div className="p-3 text-xs text-center">Loading...</div> : (
                                                    <ul className="divide-y divide-gray-100">
                                                        {existingSubjects.length > 0 ? (
                                                            existingSubjects.map((sub) => (
                                                                <li key={sub.id} className="px-3 py-2 text-sm flex justify-between items-center hover:bg-gray-50">
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="text-xs font-mono font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded border border-purple-100">{sub.subject_code}</span>
                                                                        <span className="text-gray-700">{sub.subject_name}</span>
                                                                    </div>
                                                                    <button type="button" onClick={() => handleDelete(sub.id)} className="text-gray-300 hover:text-red-500 p-1"><FaTrash size={12} /></button>
                                                                </li>
                                                            ))
                                                        ) : <li className="p-3 text-sm text-gray-400 italic">No subjects found.</li>}
                                                    </ul>
                                                )}
                                            </div>
                                        ) : <p className="text-xs text-slate-400">Select Program & Semester to view list.</p>}
                                    </div>
                                </div>

                                {}
                                <div>
                                    <div className="relative flex py-1 items-center mb-4">
                                        <div className="flex-grow border-t border-gray-200"></div>
                                        <span className="flex-shrink-0 mx-4 text-gray-400 text-xs font-bold uppercase tracking-widest">Course Details</span>
                                        <div className="flex-grow border-t border-gray-200"></div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-600 mb-1">Subject Name</label>
                                            <input
                                                type="text"
                                                name="subjectName"
                                                placeholder="e.g. Data Structures"
                                                value={formData.subjectName}
                                                onChange={handleChange}
                                                className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:outline-none focus:border-purple-500"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-600 mb-1">Code</label>
                                                <input
                                                    type="text"
                                                    name="subjectCode"
                                                    placeholder="CSE-101"
                                                    value={formData.subjectCode}
                                                    onChange={(e) => setFormData({ ...formData, subjectCode: e.target.value.toUpperCase() })}
                                                    className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:outline-none focus:border-purple-500 font-mono font-bold uppercase"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-600 mb-1">Credit (1-3)</label>
                                                <input
                                                    type="number"
                                                    name="credit"
                                                    min="1"
                                                    max="3"
                                                    value={formData.credit}
                                                    onChange={handleChange}
                                                    className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:outline-none focus:border-purple-500 text-center"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {}
                                <div className={`p-6 rounded-xl border transition-colors ${isOverLimit ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-200'
                                    }`}>
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                            <FaCalculator className="text-purple-500" /> Marks Distribution
                                        </h3>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-slate-500">Target: {maxAllowedMarks}</span>
                                            <span className={`text-xs font-bold px-2 py-1 rounded border ${isTotalValid
                                                    ? 'bg-green-100 text-green-700 border-green-200'
                                                    : 'bg-red-100 text-red-700 border-red-200'
                                                }`}>
                                                Total: {currentTotalMarks}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                        {[
                                            { label: 'Attendance', name: 'markAttendance' },
                                            { label: 'Quiz', name: 'markQuize' },
                                            { label: 'Assignment', name: 'markAssignment' },
                                            { label: 'Mid Term', name: 'markMid' },
                                            { label: 'Final', name: 'markFinal' },
                                        ].map((field) => (
                                            <div key={field.name}>
                                                <label className="block text-xs font-semibold text-gray-500 mb-1">{field.label}</label>
                                                <input
                                                    type="number"
                                                    name={field.name}
                                                    value={formData[field.name]}
                                                    onChange={handleChange}
                                                    onFocus={(e) => e.target.select()}
                                                    className={`w-full border rounded-md px-2 py-2 focus:outline-none text-center font-bold ${isOverLimit ? 'border-red-300 focus:border-red-500 text-red-700' : 'border-gray-300 focus:border-purple-500 text-slate-700'
                                                        }`}
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    {isOverLimit && (
                                        <p className="text-xs text-red-600 mt-2 font-semibold text-center">
                                            ⚠️ Total marks exceed the allowed limit of {maxAllowedMarks} for {creditValue} credit(s).
                                        </p>
                                    )}
                                </div>

                                <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
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
                                        disabled={loading || !isTotalValid}
                                        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-8 rounded-md shadow-lg transition-transform active:scale-95 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? <FaSpinner className="animate-spin" /> : 'Save Subject'}
                                    </button>
                                </div>

                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Section>
    );
};

export default AddSubjectForm;