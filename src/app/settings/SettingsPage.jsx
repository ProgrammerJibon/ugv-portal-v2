"use client";

import Section from '@/Components/Section';
import React, { useState } from 'react';
import {
    FaUserEdit, FaSave, FaLock, FaMapMarkerAlt, FaPhone, FaEnvelope,
    FaUniversity, FaUserTie, FaSpinner, FaIdCard, FaCircle, FaBriefcase,
    FaCheckCircle, FaExclamationCircle
} from 'react-icons/fa';
import { updateSettingsAction } from './updateSettingsAction';

const getOrdinal = (n) => {
    const num = parseInt(n, 10);
    if (isNaN(num)) return '';
    const s = ["th", "st", "nd", "rd"];
    const v = num % 100;
    return s[(v - 20) % 10] || s[v] || s[0];
};

const SettingsPage = ({ user }) => {
    // --- State ---
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [formData, setFormData] = useState({
        email: user?.email_address || user?.email || '',
        phone: user?.phone_number || user?.phone || '',
        address: user?.address || '',
        password: ''
    });

    // --- Role Logic (Case-Insensitive) ---
    const role = (user?.user_type || '').toUpperCase();
    const isStudent = role === 'STUDENT';
    const isTeacher = role === 'TEACHER';
    const isStaff = !isStudent && !isTeacher; // Admin, Accountant, Exam, Admission, etc.

    // --- Handlers ---
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        if (formData.password && formData.password.length < 6) {
            setMessage({ type: 'error', text: 'Password must be at least 6 characters long.' });
            return;
        }

        setLoading(true);
        const data = new FormData();
        data.append("userId", user?.user_id || "");
        data.append("id", user?.id || "");
        data.append("email", formData.email);
        data.append("phone", formData.phone);
        data.append("address", formData.address);
        if (formData.password) data.append("password", formData.password);

        const res = await updateSettingsAction(data);

        if (res.status === 'success') {
            setMessage({ type: 'success', text: res.message || 'Profile updated successfully!' });
            setFormData(prev => ({ ...prev, password: '' }));
        } else {
            setMessage({ type: 'error', text: res.message || 'Failed to update profile.' });
        }
        setLoading(false);
    };

    return (
        <Section user={user}>
            <div className="min-h-screen bg-slate-50 font-sans pb-20 relative overflow-hidden rounded-2xl">
                {/* Top Banner Background */}
                <div className="h-44 w-full bg-gradient-to-r from-slate-800 to-indigo-900 absolute top-0 left-0 z-0"></div>

                <div className="w-full container max-w-6xl mx-auto px-4 relative z-10 pt-10">

                    {/* Header Section */}
                    <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end text-white">
                        <div>
                            <h1 className="text-3xl font-bold">Account Settings</h1>
                            <p className="text-sm text-slate-300 mt-1">Manage your personal profile and security preferences.</p>
                        </div>
                    </div>

                    {/* Notification Alert */}
                    {message.text && (
                        <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 border shadow-sm ${
                            message.type === 'success' 
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                                : 'bg-red-50 border-red-200 text-red-800'
                        }`}>
                            {message.type === 'success' ? <FaCheckCircle className="text-emerald-500 flex-shrink-0" /> : <FaExclamationCircle className="text-red-500 flex-shrink-0" />}
                            <span className="text-sm font-medium">{message.text}</span>
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* --- LEFT COL: PROFILE & EDIT (Common for All) --- */}
                        <div className="lg:col-span-1 space-y-6">

                            {/* Profile Card */}
                            <div className="bg-white rounded-2xl p-6 shadow-md overflow-hidden border border-slate-100">
                                <div className="h-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl relative">
                                    <div className="absolute top-3 right-3">
                                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm ${user?.status?.toUpperCase() === 'ACTIVE' ? 'bg-emerald-400 text-white' : 'bg-red-500 text-white'}`}>
                                            <FaCircle className="text-[6px]" /> {user?.status || 'Inactive'}
                                        </span>
                                    </div>
                                </div>

                                <div className="px-4 pb-4 text-center relative">
                                    <div className="-mt-10 mb-3 inline-block">
                                        <div className="w-20 h-20 bg-white p-1 rounded-full shadow-md mx-auto">
                                            <div className="w-full h-full bg-slate-100 rounded-full flex items-center justify-center text-3xl text-slate-400 overflow-hidden">
                                                <FaUserTie />
                                            </div>
                                        </div>
                                    </div>

                                    <h2 className="text-lg font-bold text-slate-800">{user?.name}</h2>
                                    <p className="text-xs text-indigo-600 font-bold mb-1 uppercase tracking-wide">
                                        {isStudent ? (user?.program_type ? `${user.program_type} Student` : 'Student') : (user?.designation || user?.user_type)}
                                    </p>
                                    <div className="inline-block bg-slate-100 px-3 py-1 rounded text-xs font-mono font-semibold text-slate-500">
                                        {user?.user_id}
                                    </div>
                                </div>
                            </div>

                            {/* Edit Form (Common) */}
                            <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-100">
                                <h3 className="text-sm font-bold text-slate-800 mb-5 flex items-center gap-2 border-b border-slate-100 pb-3">
                                    <FaUserEdit className="text-indigo-500" /> Update Contact & Security
                                </h3>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {/* Email */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Email Address</label>
                                        <div className="relative group">
                                            <span className="absolute left-3 top-3 text-slate-400 group-focus-within:text-indigo-500 transition-colors"><FaEnvelope /></span>
                                            <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all" />
                                        </div>
                                    </div>

                                    {/* Phone */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Phone Number</label>
                                        <div className="relative group">
                                            <span className="absolute left-3 top-3 text-slate-400 group-focus-within:text-indigo-500 transition-colors"><FaPhone /></span>
                                            <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all" />
                                        </div>
                                    </div>

                                    {/* Address */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Mailing Address</label>
                                        <div className="relative group">
                                            <span className="absolute left-3 top-3 text-slate-400 group-focus-within:text-indigo-500 transition-colors"><FaMapMarkerAlt /></span>
                                            <textarea name="address" rows="2" value={formData.address} onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all resize-none"></textarea>
                                        </div>
                                    </div>

                                    {/* Password */}
                                    <div className="pt-3 border-t border-dashed border-slate-200">
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Change Password</label>
                                        <div className="relative group">
                                            <span className="absolute left-3 top-3 text-slate-400 group-focus-within:text-orange-500 transition-colors"><FaLock /></span>
                                            <input type="password" name="password" placeholder="Min. 6 chars (Leave empty to keep)" value={formData.password} onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 bg-orange-50 border border-orange-100 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all placeholder:text-orange-300" />
                                        </div>
                                    </div>

                                    <button type="submit" disabled={loading} className="w-full mt-2 bg-slate-900 hover:bg-indigo-600 text-white font-bold py-3 rounded-xl shadow-lg transition-all active:scale-95 flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
                                        {loading ? <FaSpinner className="animate-spin" /> : <FaSave />} Save Changes
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* --- RIGHT COL: CONDITIONAL INFO --- */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* Card 1: Official / Academic Information */}
                            <div className="bg-white rounded-2xl shadow-md border py-6 border-slate-100 overflow-hidden">
                                <div className="bg-slate-50/50 px-8 py-5 border-b border-slate-100">
                                    <h3 className="font-bold text-slate-800 flex items-center gap-3">
                                        <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                                            {isStudent ? <FaUniversity /> : <FaBriefcase />}
                                        </div>
                                        {isStudent ? 'Academic Information' : 'Official Information'}
                                    </h3>
                                </div>

                                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                                    {/* Common Fields for Everyone */}
                                    <ReadOnlyField label="Joining / Admission Date" value={user?.joining_date} />

                                    {/* STUDENT SPECIFIC */}
                                    {isStudent && (
                                        <>
                                            <div className="md:col-span-2"><ReadOnlyField label="Program / Department" value={user?.program} /></div>
                                            <ReadOnlyField label="Batch" value={user?.batch} />
                                            <ReadOnlyField label="Session" value={user?.session} />
                                            <ReadOnlyField 
                                                label="Current Semester" 
                                                value={user?.current_semester ? `${user.current_semester}${getOrdinal(user.current_semester)} Semester` : '0 (Freshman / Admitted)'} 
                                                highlight 
                                            />
                                            <ReadOnlyField label="Section" value={user?.section} />
                                            <ReadOnlyField label="Registration Status" value={user?.registerred == '1' ? 'Registered' : 'Not Registered'} status={user?.registerred == '1'} />
                                            <ReadOnlyField label="Waiver" value={user?.waiver ? `${user.waiver}%` : '0%'} />
                                            <ReadOnlyField label="Semester Fee" value={user?.semester_fee ? `৳ ${user.semester_fee}` : 'N/A'} />
                                        </>
                                    )}

                                    {/* TEACHER SPECIFIC */}
                                    {isTeacher && (
                                        <>
                                            <ReadOnlyField label="Faculty ID" value={user?.faculty_id} />
                                            <ReadOnlyField label="Designation" value={user?.designation} />
                                            <div className="md:col-span-2"><ReadOnlyField label="Department" value={user?.program} /></div>
                                        </>
                                    )}

                                    {/* STAFF (Admin, Accountant, Exam Controller, etc) */}
                                    {isStaff && (
                                        <>
                                            <ReadOnlyField label="Designation" value={user?.designation || user?.user_type} />
                                            <ReadOnlyField label="Employee ID" value={user?.user_id} />
                                            <div className="md:col-span-2"><ReadOnlyField label="Role Type" value={user?.user_type} highlight /></div>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Card 2: Personal Details */}
                            <div className="bg-white rounded-2xl shadow-md border border-slate-100 py-6 overflow-hidden">
                                <div className="bg-slate-50/50 px-8 py-5 border-b border-slate-100">
                                    <h3 className="font-bold text-slate-800 flex items-center gap-3">
                                        <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600"><FaIdCard /></div>
                                        Personal Details
                                    </h3>
                                </div>
                                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                                    {/* Common for ALL */}
                                    <ReadOnlyField label="Date of Birth" value={user?.date_of_birth} />
                                    <ReadOnlyField label="Gender" value={user?.gender} />
                                    <ReadOnlyField label="Blood Group" value={user?.blood_group} />
                                    <ReadOnlyField label="Religion" value={user?.religion} />

                                    {/* Student ONLY Extras (Parents/Guardian) */}
                                    {isStudent && (
                                        <>
                                            <div className="md:col-span-2">
                                                <ReadOnlyField label="National ID (NID)" value={user?.student_nid} />
                                            </div>
                                            <div className="md:col-span-2 border-t border-dashed border-slate-100"></div>
                                            <ReadOnlyField label="Father's Name" value={user?.father_name} />
                                            <ReadOnlyField label="Mother's Name" value={user?.mother_name} />
                                            <ReadOnlyField label="Guardian Phone" value={user?.guardian_phone} />
                                            <ReadOnlyField label="Guardian NID" value={user?.guardian_nid} />
                                        </>
                                    )}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </Section>
    );
};

// --- Reusable Read-Only Field Component ---
const ReadOnlyField = ({ label, value, highlight = false, status = null }) => (
    <div className="flex flex-col">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</label>
        <div className={`text-sm font-semibold truncate ${highlight ? 'text-indigo-600 text-base' : 'text-slate-700'}`}>
            {status !== null ? (
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${status ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                    <FaCircle className="text-[6px]" /> {value}
                </span>
            ) : (
                value || <span className="text-slate-300 italic font-normal">Not Provided</span>
            )}
        </div>
    </div>
);

export default SettingsPage;