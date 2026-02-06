"use client";
import React, { useState } from 'react';
import AdminNavbar from '../AdminNavbar';

const AddUserForm = () => {
    // State to handle the selected role to show/hide specific fields
    const [role, setRole] = useState('teacher');

    return (
        <div className="min-h-screen bg-slate-50 font-sans flex flex-col">


            <>
                <AdminNavbar />
            </>

            <div className="flex-grow container mx-auto py-10 px-4">

                <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">

                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-6 text-white">
                        <h2 className="text-2xl font-bold">Register New Staff</h2>
                        <p className="text-blue-100 text-sm mt-1">Create accounts for Teachers, Accountants, and Admission Officers.</p>
                    </div>

                    <form className="px-8 py-8">

                        {/* Section 1: User Role & Basic Info */}
                        <div className="mb-8">
                            <h3 className="text-lg font-bold text-slate-800 border-b border-gray-200 pb-2 mb-4">1. Account Role</h3>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                {/* Radio Cards for Role Selection */}
                                <label className={`cursor-pointer border p-4 rounded-lg flex items-center justify-between transition-all ${role === 'teacher' ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'border-gray-200 hover:border-blue-300'}`}>
                                    <div className="flex items-center gap-3">
                                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${role === 'teacher' ? 'border-blue-600' : 'border-gray-400'}`}>
                                            {role === 'teacher' && <div className="w-2 h-2 rounded-full bg-blue-600"></div>}
                                        </div>
                                        <span className="font-semibold text-slate-700">Teacher</span>
                                    </div>
                                    <input type="radio" name="role" value="teacher" className="hidden" checked={role === 'teacher'} onChange={() => setRole('teacher')} />
                                </label>

                                <label className={`cursor-pointer border p-4 rounded-lg flex items-center justify-between transition-all ${role === 'accountant' ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'border-gray-200 hover:border-blue-300'}`}>
                                    <div className="flex items-center gap-3">
                                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${role === 'accountant' ? 'border-blue-600' : 'border-gray-400'}`}>
                                            {role === 'accountant' && <div className="w-2 h-2 rounded-full bg-blue-600"></div>}
                                        </div>
                                        <span className="font-semibold text-slate-700">Accountant</span>
                                    </div>
                                    <input type="radio" name="role" value="accountant" className="hidden" checked={role === 'accountant'} onChange={() => setRole('accountant')} />
                                </label>

                                <label className={`cursor-pointer border p-4 rounded-lg flex items-center justify-between transition-all ${role === 'admission' ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'border-gray-200 hover:border-blue-300'}`}>
                                    <div className="flex items-center gap-3">
                                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${role === 'admission' ? 'border-blue-600' : 'border-gray-400'}`}>
                                            {role === 'admission' && <div className="w-2 h-2 rounded-full bg-blue-600"></div>}
                                        </div>
                                        <span className="font-semibold text-slate-700">Admission Guider</span>
                                    </div>
                                    <input type="radio" name="role" value="admission" className="hidden" checked={role === 'admission'} onChange={() => setRole('admission')} />
                                </label>
                            </div>
                        </div>

                        {/* Section 2: Personal Details */}
                        <div className="mb-8">
                            <h3 className="text-lg font-bold text-slate-800 border-b border-gray-200 pb-2 mb-4">2. Personal Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-600 mb-1">Full Name</label>
                                    <input type="text" placeholder="e.g. Dr. Md. Rahim Uddin" className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-600 mb-1">Email Address</label>
                                    <input type="email" placeholder="email@ugv.edu.bd" className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-600 mb-1">Phone Number</label>
                                    <input type="tel" placeholder="+880 1XXX XXXXXX" className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-600 mb-1">Joining Date</label>
                                    <input type="date" className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" />
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Role Specific Fields (Conditional Rendering) */}
                        <div className="mb-8 p-6 bg-slate-50 rounded-lg border border-slate-200">
                            <h3 className="text-md font-bold text-slate-700 mb-4 uppercase tracking-wider text-xs">
                                {role === 'teacher' ? 'Faculty Assignment' : role === 'accountant' ? 'Financial Access Control' : 'Admission Desk Info'}
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {role === 'teacher' && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-600 mb-1">Department</label>
                                            <select className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500 bg-white">
                                                <option>Computer Science & Engineering</option>
                                                <option>Electrical & Electronic Engineering</option>
                                                <option>Business Administration</option>
                                                <option>English</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-600 mb-1">Designation</label>
                                            <select className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500 bg-white">
                                                <option>Lecturer</option>
                                                <option>Assistant Professor</option>
                                                <option>Associate Professor</option>
                                                <option>Professor</option>
                                            </select>
                                        </div>
                                    </>
                                )}

                                {role === 'accountant' && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-600 mb-1">Access Level</label>
                                            <select className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500 bg-white">
                                                <option>Level 1 (View Only)</option>
                                                <option>Level 2 (Tuition Collection)</option>
                                                <option>Level 3 (Full Financial Admin)</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-600 mb-1">Desk / Counter No.</label>
                                            <input type="text" placeholder="e.g. Counter-04" className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500 bg-white" />
                                        </div>
                                    </>
                                )}

                                {role === 'admission' && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-600 mb-1">Assigned Session</label>
                                            <select className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500 bg-white">
                                                <option>Spring 2026</option>
                                                <option>Summer 2026</option>
                                                <option>Fall 2026</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-600 mb-1">Region Responsibility</label>
                                            <input type="text" placeholder="e.g. Barishal Division" className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500 bg-white" />
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Section 4: Login Credentials */}
                        <div className="mb-8">
                            <h3 className="text-lg font-bold text-slate-800 border-b border-gray-200 pb-2 mb-4">4. Login Credentials</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-600 mb-1">Assign User ID</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2 text-gray-400 font-bold select-none">
                                            {role === 'teacher' ? 'T-' : role === 'accountant' ? 'A-' : 'AG-'}
                                        </span>
                                        <input type="text" placeholder="XXXX" className="w-full border border-gray-300 rounded-md pl-12 pr-4 py-2 focus:outline-none focus:border-blue-500 bg-gray-50" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-600 mb-1">Temporary Password</label>
                                    <input type="text" value="Welcome@2026" readOnly className="w-full border border-gray-300 rounded-md px-4 py-2 bg-gray-100 text-gray-500 cursor-not-allowed" />
                                    <p className="text-xs text-gray-400 mt-1">* User will be asked to change this on first login.</p>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-4 mt-10 pt-6 border-t border-gray-100">
                            <button type="button" className="px-6 py-2 rounded-md text-slate-600 hover:bg-slate-100 font-semibold transition-colors">
                                Cancel
                            </button>
                            <button type="button" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded-md shadow-lg transition-transform active:scale-95 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                                </svg>
                                Create User
                            </button>
                        </div>

                    </form>
                </div>
            </div>

        </div>
    );
};

export default AddUserForm;