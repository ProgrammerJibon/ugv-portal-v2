"use client";
import React, { useState, useEffect } from 'react';
import { FaSpinner, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import addSessionAction from './addSessionAction';
import Section from '@/Components/Section';

const AddSessionForm = ({ user }) => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const [formData, setFormData] = useState({
        sessionYear: new Date().getFullYear(),
        sessionSeason: 'Summer',
        shortCode: ''
    });

    // Auto-generate Short Code (Your original logic)
    useEffect(() => {
        const seasonMap = {
            'Summer': 'SUM',
            'Winter': 'WIN'
        };

        const seasonCode = seasonMap[formData.sessionSeason] || 'SUM';
        const yearCode = formData.sessionYear.toString().slice(-2); // Get last 2 digits of year

        setFormData(prev => ({
            ...prev,
            shortCode: `${seasonCode}${yearCode}`
        }));
    }, [formData.sessionYear, formData.sessionSeason]);

    // Handle Form Submission
    const handleSubmit = async () => {
        setLoading(true);
        setMessage({ type: '', text: '' });

        const payload = new FormData();
        payload.append("sessionYear", formData.sessionYear);
        payload.append("sessionSeason", formData.sessionSeason);
        payload.append("shortCode", formData.shortCode);

        try {
            const result = await addSessionAction(payload);

            if (result.status === 'success') {
                setMessage({ type: 'success', text: result.message });
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
        <Section user={user}>
            <div className="bg-slate-50 font-sans flex flex-col justify-center items-center py-10">

                <div className="w-full container px-4">
                    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">

                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-6 text-white">
                            <h2 className="text-2xl font-bold">Add New Session</h2>
                            <p className="text-blue-100 text-sm mt-1">Initialize a new academic semester or term.</p>
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

                                {/* 1. Session Year */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-600 mb-1">Session Year</label>
                                    <select
                                        value={formData.sessionYear}
                                        onChange={(e) => setFormData({ ...formData, sessionYear: e.target.value })}
                                        className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:border-blue-500 bg-white"
                                    >
                                        <option value={new Date().getFullYear()}>{new Date().getFullYear()}</option>
                                        <option value={new Date().getFullYear() + 1}>{new Date().getFullYear() + 1}</option>
                                    </select>
                                </div>

                                {/* 2. Session Season */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-600 mb-1">Session Season</label>
                                    <select
                                        value={formData.sessionSeason}
                                        onChange={(e) => setFormData({ ...formData, sessionSeason: e.target.value })}
                                        className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:border-blue-500 bg-white"
                                    >
                                        <option value="Winter">Winter</option>
                                        <option value="Summer">Summer</option>
                                    </select>
                                </div>

                                {/* 3. Session Short Code */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-600 mb-1">Session Short Code</label>
                                    <div className="flex">
                                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm font-bold">
                                            Code
                                        </span>
                                        <input
                                            type="text"
                                            value={formData.shortCode}
                                            readOnly // Auto-generated, so likely shouldn't be edited manually
                                            className="w-full border border-gray-300 rounded-r-md px-4 py-3 focus:outline-none bg-gray-50 text-slate-500 font-mono tracking-wider uppercase font-bold cursor-not-allowed"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-400 mt-2">
                                        * Used for generating student IDs (e.g., {formData.shortCode}-0001)
                                    </p>
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
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded-md shadow-lg transition-transform active:scale-95 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? <FaSpinner className="animate-spin" /> : null}
                                    {loading ? 'Creating...' : 'Create Session'}
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </Section>
    );
};

export default AddSessionForm;