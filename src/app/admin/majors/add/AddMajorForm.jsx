"use client";
import React, { useState } from 'react';
import AdminSection from '../../AdminSection';

const AddMajorForm = () => {
    const [formData, setFormData] = useState({
        degreeType: 'B.Sc',
        programName: '',
        programCode: ''
    });

    return (
        <AdminSection>
            <div className="bg-slate-50 font-sans flex flex-col justify-center items-center py-10">

                <div className="w-full container px-4">
                    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">

                        {/* Header */}
                        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 px-8 py-6 text-white">
                            <h2 className="text-2xl font-bold">Add New Program</h2>
                            <p className="text-emerald-100 text-sm mt-1">Enter the basic details for the new academic program.</p>
                        </div>

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

                                {/* 3. Program Code */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-600 mb-1">Program Code</label>
                                    <div className="flex">
                                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm font-bold">
                                            UGV-
                                        </span>
                                        <input
                                            type="text"
                                            placeholder="101"
                                            value={formData.programCode}
                                            onChange={(e) => setFormData({ ...formData, programCode: e.target.value })}
                                            className="w-full border border-gray-300 rounded-r-md px-4 py-3 focus:outline-none focus:border-emerald-500"
                                        />
                                    </div>
                                </div>

                            </div>

                            {/* Actions */}
                            <div className="flex justify-end gap-4 pt-8 mt-4 border-t border-gray-100">
                                <button type="button" className="px-6 py-2 rounded-md text-slate-600 hover:bg-slate-100 font-semibold transition-colors">
                                    Cancel
                                </button>
                                <button type="button" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-8 rounded-md shadow-lg transition-transform active:scale-95">
                                    Save Program
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