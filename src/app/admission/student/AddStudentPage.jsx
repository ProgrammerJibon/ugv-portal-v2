"use client";
import Section from '@/Components/Section';
import React, { useState, useEffect } from 'react';
import { addStudentAction, getAdmissionDropdowns } from './addStudentAction';
import { FaSpinner, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

const AddStudentPage = ({ user }) => {
    // --- State: Dropdown Data ---
    const [programsList, setProgramsList] = useState([]);
    const [sessionsList, setSessionsList] = useState([]);
    const [loadingData, setLoadingData] = useState(true);

    // --- State: Form Data ---
    const initialFormState = {
        fullName: '',
        dateOfBirth: '',
        gender: 'Male',
        bloodGroup: '',
        religion: 'Islam',
        studentNid: '',

        program: '', // Stores Program ID now
        session: '',
        programType: 'Regular', // New
        section: 'A', // New

        email: '',
        phone: '',
        address: '',

        fatherName: '',
        motherName: '',
        guardianPhone: '',
        guardianNid: ''
    };

    const [formData, setFormData] = useState(initialFormState);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // --- 1. Load Dropdowns on Mount ---
    useEffect(() => {
        const loadDropdowns = async () => {
            const res = await getAdmissionDropdowns();
            if (res.status === 'success') {
                setProgramsList(res.programs);
                setSessionsList(res.sessions);

                // Set defaults
                if (res.programs.length > 0) setFormData(prev => ({ ...prev, program: res.programs[0].id }));
                if (res.sessions.length > 0) setFormData(prev => ({ ...prev, session: `${res.sessions[0].session_season} ${res.sessions[0].session_year}` }));
            }
            setLoadingData(false);
        };
        loadDropdowns();
    }, []);

    // --- Handlers ---
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        const payload = new FormData();
        Object.keys(formData).forEach(key => payload.append(key, formData[key]));

        try {
            const result = await addStudentAction(payload);
            if (result.status === 'success') {
                setMessage({ type: 'success', text: result.message });
                setFormData(initialFormState); // Reset form
                setImagePreview(null);

                // Re-apply defaults for UX
                if (programsList.length > 0) setFormData(prev => ({ ...prev, program: programsList[0].id }));
                if (sessionsList.length > 0) setFormData(prev => ({ ...prev, session: `${sessionsList[0].session_season} ${sessionsList[0].session_year}` }));

            } else {
                setMessage({ type: 'error', text: result.message });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'An error occurred during submission.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Section user={user}>
            <div className="min-h-screen bg-slate-50 font-sans flex flex-col items-center py-10">

                <div className="w-full container max-w-5xl px-4">

                    {/* --- Page Header --- */}
                    <div className="mb-8 border-b border-gray-200 pb-4">
                        <h1 className="text-2xl font-bold text-slate-800">New Student Admission</h1>
                        <p className="text-slate-500 text-sm">Register a new student. ID will be generated automatically upon submission.</p>
                    </div>

                    {/* Message Banner */}
                    {message.text && (
                        <div className={`mb-6 p-4 rounded-md flex items-center gap-2 ${message.type === 'success'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                            }`}>
                            {message.type === 'success' ? <FaCheckCircle /> : <FaExclamationCircle />}
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* --- Left Column: Photo & Academic Info --- */}
                        <div className="lg:col-span-1 space-y-6">

                            {/* 1. Profile Photo Upload */}
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Student Photo</label>
                                <div className="relative w-32 h-32 mx-auto mb-4 bg-slate-100 rounded-full border-4 border-white shadow-md overflow-hidden group">
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-slate-300">
                                            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                        <span className="text-white text-xs font-bold">Change</span>
                                    </div>
                                    <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                </div>
                                <p className="text-xs text-slate-400">Allowed *.jpeg, *.jpg, *.png<br />Max size of 3 MB</p>
                                <p className='text-xs text-gray-200'>Not Uploading</p>
                            </div>

                            {/* 2. Academic Assignment */}
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <h3 className="text-sm font-bold text-slate-800 mb-4 border-b border-gray-100 pb-2">Academic Info</h3>
                                <div className="space-y-4">

                                    {/* Program Select */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1">Program / Department</label>
                                        <select
                                            name="program"
                                            value={formData.program}
                                            onChange={handleInputChange}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 bg-white"
                                            disabled={loadingData}
                                        >
                                            {loadingData ? <option>Loading...</option> : (
                                                programsList.map(prog => (
                                                    <option key={prog.id} value={prog.id}>
                                                        {prog.program_name} ({prog.program_short_name})
                                                    </option>
                                                ))
                                            )}
                                        </select>
                                    </div>

                                    {/* Session Select */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1">Admission Session</label>
                                        <select
                                            name="session"
                                            value={formData.session}
                                            onChange={handleInputChange}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 bg-white"
                                            disabled={loadingData}
                                        >
                                            {loadingData ? <option>Loading...</option> : (
                                                sessionsList.map(sess => (
                                                    <option key={sess.id} value={`${sess.session_season} ${sess.session_year}`}>
                                                        {sess.session_season} {sess.session_year}
                                                    </option>
                                                ))
                                            )}
                                        </select>
                                    </div>

                                    {/* Program Type & Section */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 mb-1">Type</label>
                                            <select name="programType" value={formData.programType} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 bg-white">
                                                <option>Regular</option>
                                                <option>Evening</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 mb-1">Section</label>
                                            <select name="section" value={formData.section} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 bg-white">
                                                <option>A</option><option>B</option><option>C</option><option>D</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* ID Info Box */}
                                    <div className="bg-slate-50 border border-slate-200 rounded p-3 text-center">
                                        <p className="text-xs text-slate-500 font-medium">Student ID will be generated automatically based on the selection.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* --- Right Column: Personal & Contact Info --- */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* 1. Personal Details */}
                            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm">1</span>
                                    Personal Details
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                                        <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-indigo-500" required />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Date of Birth</label>
                                        <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-indigo-500 text-slate-600" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Gender</label>
                                        <select name="gender" value={formData.gender} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-indigo-500 bg-white">
                                            <option>Male</option><option>Female</option><option>Other</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Blood Group</label>
                                        <select name="bloodGroup" value={formData.bloodGroup} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-indigo-500 bg-white">
                                            <option value="">Select Group</option><option value="A+">A+</option><option value="O+">O+</option><option value="B+">B+</option><option value="AB+">AB+</option><option value="A-">A-</option><option value="O-">O-</option><option value="B-">B-</option><option value="AB-">AB-</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Religion</label>
                                        <select name="religion" value={formData.religion} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-indigo-500 bg-white">
                                            <option>Islam</option><option>Hinduism</option><option>Christianity</option><option>Buddhism</option><option>Other</option>
                                        </select>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Student NID / Birth Cert. No</label>
                                        <input type="text" name="studentNid" value={formData.studentNid} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-indigo-500 font-mono" placeholder="Enter NID or Birth Certificate Number" />
                                    </div>
                                </div>
                            </div>

                            {/* 2. Guardian & Contact Info */}
                            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm">2</span>
                                    Guardian & Contact Info
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Father's Name</label>
                                        <input type="text" name="fatherName" value={formData.fatherName} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-indigo-500" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Mother's Name</label>
                                        <input type="text" name="motherName" value={formData.motherName} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-indigo-500" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Student Phone</label>
                                        <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-indigo-500" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Guardian Phone</label>
                                        <input type="tel" name="guardianPhone" value={formData.guardianPhone} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-indigo-500" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Guardian NID Number</label>
                                        <input type="text" name="guardianNid" value={formData.guardianNid} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-indigo-500 font-mono" placeholder="Father or Mother's NID" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                                        <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-indigo-500" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Permanent Address</label>
                                        <textarea name="address" rows="3" value={formData.address} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-indigo-500 resize-none"></textarea>
                                    </div>
                                </div>
                            </div>

                            {/* Form Actions */}
                            <div className="flex justify-end gap-4 pt-4">
                                <button type="button" onClick={() => setFormData(initialFormState)} className="px-6 py-3 rounded-lg text-slate-500 font-bold hover:bg-slate-200 transition-colors">Reset Form</button>
                                <button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-10 rounded-lg shadow-lg shadow-indigo-200 transition-transform active:scale-95 flex items-center gap-2 disabled:opacity-50">
                                    {loading ? <FaSpinner className="animate-spin" /> : 'Complete Admission'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </Section>
    );
};

export default AddStudentPage;