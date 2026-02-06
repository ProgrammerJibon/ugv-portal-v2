"use client";

import React from 'react';


const AdminProfile = ({ user }) => {


    console.log(user);

    return (
        <div className="bg-slate-50 font-sans">

            {/* Main Content */}
            <main className="mx-auto py-10">

                <div className="mx-auto">

                    {/* Page Title */}
                    <div className="mb-8 flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-slate-800">Profile Overview</h2>
                        <span className={`px-4 py-1.5 rounded-full text-sm font-semibold border ${user?.status?.toLowerCase() === 'active'
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : 'bg-red-50 text-red-700 border-red-200'
                            }`}>
                            {user?.status}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                        {/* Left Column: Identity Card */}
                        <div className="md:col-span-1">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center h-full">
                                <div className="w-32 h-32 bg-slate-100 rounded-full flex items-center justify-center text-4xl mb-4 border-4 border-purple-50 text-slate-400">
                                    {/* Placeholder Avatar based on Initials */}
                                    {user?.name?.charAt(0)}
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 mb-1">{user?.name}</h3>
                                <p className="text-purple-600 font-medium mb-1">{user?.designation}</p>
                                <p className="text-sm text-slate-400">{user?.user_type}</p>
                            </div>
                        </div>

                        {/* Right Column: Detailed Information */}
                        <div className="md:col-span-2">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                                <h4 className="text-lg font-bold text-slate-800 border-b border-gray-100 pb-4 mb-6">
                                    Personal & Account Details
                                </h4>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4">

                                
                                    <DetailItem label="User? ID" value={user?.user_id} />
                                    {user?.faculty_id && <DetailItem label="Faculty ID" value={user?.faculty_id || "N/A"} />}

                                    <DetailItem label="Email Address" value={user?.email_address} />
                                    <DetailItem label="Phone Number" value={user?.phone_number} />

                                    <DetailItem label="Designation" value={user?.designation} />
                                    <DetailItem label="Joining Date" value={user?.joining_date} />

                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
};

// Helper component for consistent label/value styling
const DetailItem = ({ label, value }) => (
    <div className="flex flex-col">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">
            {label}
        </span>
        <span className="text-slate-700 font-medium text-base break-words">
            {value}
        </span>
    </div>
);

export default AdminProfile;