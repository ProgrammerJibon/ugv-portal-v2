"use client";

import React, { useState, useEffect } from 'react';
import { FaEdit, FaSpinner, FaGraduationCap, FaTimes, FaSave } from 'react-icons/fa';
import { getMajorsAction, updateMajorAction } from './manageMajorsActions';

const ManageMajors = () => {
    const [majors, setMajors] = useState([]);
    const [loading, setLoading] = useState(true);

    // Edit Modal State
    const [isEditing, setIsEditing] = useState(false);
    const [currentMajor, setCurrentMajor] = useState(null); // The major being edited
    const [saveLoading, setSaveLoading] = useState(false);

    // 1. Load Data
    useEffect(() => {
        loadMajors();
    }, []);

    const loadMajors = async () => {
        const res = await getMajorsAction();
        if (res.status === 'success') {
            setMajors(res.data);
        }
        setLoading(false);
    };

    // 2. Open Edit Modal
    const handleEditClick = (major) => {
        setCurrentMajor({ ...major }); // Create a copy to avoid direct state mutation
        setIsEditing(true);
    };

    // 3. Handle Update Submit
    const handleUpdate = async (e) => {
        e.preventDefault();
        setSaveLoading(true);

        const res = await updateMajorAction(
            currentMajor.id,
            currentMajor.degree_type,
            currentMajor.program_name,
            currentMajor.program_short_name
        );

        if (res.status === 'success') {
            // Update local list instantly
            setMajors(majors.map(m => m.id === currentMajor.id ? currentMajor : m));
            setIsEditing(false);
            alert("Updated Successfully");
        } else {
            alert(res.message);
        }
        setSaveLoading(false);
    };

    return (
        <Section>
            <div className="min-h-screen bg-slate-50 font-sans p-6">

                {/* Page Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Academic Programs</h1>
                        <p className="text-sm text-slate-500">Manage university majors and departments.</p>
                    </div>
                    <button
                        onClick={() => window.location.href = '/admin/majors/add'}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-semibold shadow-sm transition-colors text-sm"
                    >
                        + Add New Major
                    </button>
                </div>

                {/* Majors List Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-100 text-slate-600 text-xs uppercase font-bold tracking-wider">
                            <tr>
                                <th className="px-6 py-4">ID</th>
                                <th className="px-6 py-4">Degree</th>
                                <th className="px-6 py-4">Program Name</th>
                                <th className="px-6 py-4">Short Code</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-10 text-center text-slate-500">
                                        <FaSpinner className="animate-spin inline mr-2" /> Loading Programs...
                                    </td>
                                </tr>
                            ) : majors.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-10 text-center text-slate-500">
                                        No majors found.
                                    </td>
                                </tr>
                            ) : (
                                majors.map((major) => (
                                    <tr key={major.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 text-slate-400 font-mono text-xs">#{major.id}</td>
                                        <td className="px-6 py-4">
                                            <span className="bg-purple-50 text-purple-700 px-2 py-1 rounded text-xs font-bold border border-purple-100">
                                                {major.degree_type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-slate-700">
                                            {major.program_name}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-mono text-slate-500 bg-gray-100 px-2 py-1 rounded text-xs">
                                                {major.program_short_name}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleEditClick(major)}
                                                className="text-blue-600 hover:bg-blue-50 p-2 rounded-full transition-colors"
                                                title="Edit Program"
                                            >
                                                <FaEdit />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* --- EDIT MODAL --- */}
                {isEditing && currentMajor && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">

                            {/* Modal Header */}
                            <div className="bg-slate-800 px-6 py-4 flex justify-between items-center text-white">
                                <h3 className="font-bold flex items-center gap-2">
                                    <FaGraduationCap /> Edit Program
                                </h3>
                                <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-white transition-colors">
                                    <FaTimes />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <form onSubmit={handleUpdate} className="p-6 space-y-4">

                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Degree Type</label>
                                    <select
                                        value={currentMajor.degree_type}
                                        onChange={(e) => setCurrentMajor({ ...currentMajor, degree_type: e.target.value })}
                                        className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                    >
                                        <option value="B.Sc">B.Sc</option>
                                        <option value="BBA">BBA</option>
                                        <option value="BA">BA</option>
                                        <option value="M.Sc">M.Sc</option>
                                        <option value="MBA">MBA</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Program Name</label>
                                    <input
                                        type="text"
                                        value={currentMajor.program_name}
                                        onChange={(e) => setCurrentMajor({ ...currentMajor, program_name: e.target.value })}
                                        className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Short Code</label>
                                    <input
                                        type="text"
                                        value={currentMajor.program_short_name}
                                        onChange={(e) => setCurrentMajor({ ...currentMajor, program_short_name: e.target.value })}
                                        className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
                                    />
                                </div>

                                {/* Modal Footer */}
                                <div className="pt-4 flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(false)}
                                        className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-lg font-medium transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={saveLoading}
                                        className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-md transition-transform active:scale-95 flex items-center gap-2"
                                    >
                                        {saveLoading ? <FaSpinner className="animate-spin" /> : <FaSave />}
                                        Save Changes
                                    </button>
                                </div>

                            </form>
                        </div>
                    </div>
                )}

            </div>
        </Section>
    );
};

export default ManageMajors;