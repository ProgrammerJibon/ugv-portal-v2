"use client";
import React, { useState } from 'react';
import { FaSpinner, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import addMajorAction from './addMajorAction';
import AdminSection from '../../AdminSection';

const AddMajorForm = () => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const [formData, setFormData] = useState({
        degreeType: 'B.Sc',
        programName: '',
        programCode: ''
    });

    const handleSubmit = async () => {
        // Basic Validation
        if (!formData.programName || !formData.programCode) {
            setMessage({ type: 'error', text: 'Please fill in all fields.' });
            return;
        }

        setLoading(true);
        setMessage({ type: '', text: '' });

        const payload = new FormData();
        payload.append("degreeType", formData.degreeType);
        payload.append("programName", formData.programName);
        payload.append("programShortName", formData.programCode);

        try {
            const result = await addMajorAction(payload);

            if (result.status === 'success') {
                setMessage({ type: 'success', text: result.message });
                // Reset form
                setFormData({ ...formData, programName: '', programCode: '' });
            } else {
                setMessage({ type: 'error', text: result.message });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Something went wrong.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminSection>
            <div className="min-h-screen bg-slate-50 font-sans flex flex-col items-center py-10">

                <div className="w-full container px-4">
                    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">

                        {/* Header */}
                        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 px-8 py-6 text-white">
                            <h2 className="text-2xl font-bold">Add New Program/Department</h2>
                            <p className="text-emerald-100 text-sm mt-1">Enter the basic details for the new academic program.</p>
                        </div>

                        {/* Message Banner */}
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

                                {/* 1. Degree Type */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-600 mb-1">Degree Type</label>
                                    <select
                                        value={formData.degreeType}
                                        onChange={(e) => setFormData({ ...formData, degreeType: e.target.value })}
                                        className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:border-emerald-500 bg-white"
                                    >
                                        <option value="B.Sc">B.Sc (Bachelor of Science)</option>
                                        <option value="BBA">BBA (Business Admin)</option>
                                        <option value="BA">BA (Bachelor of Arts)</option>
                                        <option value="M.Sc">M.Sc (Master of Science)</option>
                                        <option value="MBA">MBA</option>
                                    </select>
                                </div>

                                {/* 2. Program Name */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-600 mb-1">Program Name</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Computer Science & Engineering"
                                        value={formData.programName}
                                        onChange={(e) => setFormData({ ...formData, programName: e.target.value })}
                                        className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                                    />
                                </div>

                                {/* 3. Program Short Name */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-600 mb-1">Program Short Name</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. CSE"
                                        value={formData.programCode}
                                        onChange={(e) => setFormData({ ...formData, programCode: e.target.value })}
                                        className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                                    />
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
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-8 rounded-md shadow-lg transition-transform active:scale-95 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? <FaSpinner className="animate-spin" /> : null}
                                    {loading ? 'Saving...' : 'Save Program'}
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </AdminSection>
    );
};

export default AddMajorForm;