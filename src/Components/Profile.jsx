"use client";

import React from 'react';
import {
    FaUser,
    FaGraduationCap,
    FaUsers,
    FaIdCard,
    FaEnvelope,
    FaPhone,
    FaMapMarkerAlt
} from 'react-icons/fa';

const Profile = ({ user }) => {
    // Helper to check user role
    const isStudent = user?.user_type === 'STUDENT';

    return (
        <div className="bg-slate-50 font-sans min-h-screen">

            {/* Main Content */}
            <main className="mx-auto py-10 px-4 max-w-6xl">

                {/* Page Title */}
                <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Profile Overview</h2>
                        <p className="text-slate-500 text-sm mt-1">Manage your personal and account information.</p>
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-sm font-bold border flex items-center gap-2 w-fit ${user?.status?.toUpperCase() === 'ACTIVE'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-red-50 text-red-700 border-red-200'
                        }`}>
                        <span className={`w-2 h-2 rounded-full ${user?.status?.toUpperCase() === 'ACTIVE' ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                        {user?.status}
                    </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* --- Left Column: Identity Card --- */}
                    <div className="lg:col-span-1 space-y-6">

                        {/* Avatar Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 flex flex-col items-center text-center">
                            <div className="w-32 h-32 bg-indigo-50 rounded-full flex items-center justify-center text-4xl mb-6 border-4 border-white shadow-md text-indigo-400">
                                {user?.name?.charAt(0)}
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-1">{user?.name}</h3>
                            <p className="text-indigo-600 font-medium mb-1">{user?.user_type}</p>
                            <p className="text-sm text-slate-400 font-mono bg-slate-100 px-3 py-1 rounded-full mt-2">
                                ID: {user?.user_id}
                            </p>
                        </div>

                        {/* Quick Contact Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Contact Info</h4>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400"><FaEnvelope size={14} /></div>
                                    <div className="text-sm overflow-hidden text-ellipsis">
                                        <p className="text-slate-400 text-xs">Email</p>
                                        <p className="font-semibold text-slate-700">{user?.email_address}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400"><FaPhone size={14} /></div>
                                    <div>
                                        <p className="text-slate-400 text-xs">Phone</p>
                                        <p className="font-semibold text-slate-700">{user?.phone_number}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 mt-1"><FaMapMarkerAlt size={14} /></div>
                                    <div>
                                        <p className="text-slate-400 text-xs">Address</p>
                                        <p className="font-semibold text-slate-700">{user?.address || "N/A"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- Right Column: Detailed Information --- */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* 1. Academic Information (Student Only) */}
                        {isStudent && (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2 bg-slate-50/50">
                                    <FaGraduationCap className="text-indigo-500" />
                                    <h4 className="font-bold text-slate-800">Academic Information</h4>
                                </div>
                                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <DetailItem label="Program ID" value={user?.program} />
                                    <DetailItem label="Session" value={user?.session} />
                                    <DetailItem label="Program Type" value={user?.program_type} />
                                    <DetailItem label="Section" value={user?.section} />
                                    <DetailItem label="Semester" value={`${user?.current_semester}${getOrdinal(user?.current_semester)}`} />
                                    {user?.batch && <DetailItem label="Batch" value={user?.batch} />}
                                </div>
                            </div>
                        )}

                        {/* 2. Professional Info (Staff Only) */}
                        {!isStudent && (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2 bg-slate-50/50">
                                    <FaIdCard className="text-purple-500" />
                                    <h4 className="font-bold text-slate-800">Professional Details</h4>
                                </div>
                                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <DetailItem label="Faculty ID" value={user?.faculty_id || "N/A"} />
                                    <DetailItem label="Designation" value={user?.designation || "N/A"} />
                                    <DetailItem label="Joining Date" value={user?.joining_date || "N/A"} />
                                </div>
                            </div>
                        )}

                        {/* 3. Personal Details (Everyone) */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2 bg-slate-50/50">
                                <FaUser className="text-blue-500" />
                                <h4 className="font-bold text-slate-800">Personal Details</h4>
                            </div>
                            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                <DetailItem label="Date of Birth" value={user?.date_of_birth} />
                                <DetailItem label="Gender" value={user?.gender} />
                                <DetailItem label="Blood Group" value={user?.blood_group} />
                                <DetailItem label="Religion" value={user?.religion} />
                                <DetailItem label="NID / Birth Cert." value={user?.student_nid || "N/A"} />
                            </div>
                        </div>

                        {/* 4. Guardian Information (Student Only) */}
                        {isStudent && (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2 bg-slate-50/50">
                                    <FaUsers className="text-orange-500" />
                                    <h4 className="font-bold text-slate-800">Guardian Information</h4>
                                </div>
                                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <DetailItem label="Father's Name" value={user?.father_name} />
                                    <DetailItem label="Mother's Name" value={user?.mother_name} />
                                    <DetailItem label="Guardian Phone" value={user?.guardian_phone} />
                                    <DetailItem label="Guardian NID" value={user?.guardian_nid} />
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </main>
        </div>
    );
};

// --- Helper Components & Functions ---

const DetailItem = ({ label, value }) => (
    <div className="flex flex-col">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            {label}
        </span>
        <span className="text-slate-700 font-semibold text-sm break-words">
            {value || "—"}
        </span>
    </div>
);

// Helper to add 'st', 'nd', 'rd', 'th' to semester numbers
const getOrdinal = (n) => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return s[(v - 20) % 10] || s[v] || s[0];
};

export default Profile;