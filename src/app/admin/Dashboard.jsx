"use client";

import React from 'react';
import Link from 'next/link';

const AdminDashboard = () => {
    // defined based on your requirements list
    const adminActions = [
        {
            title: "Manage Users",
            description: "Add Main Users (Teachers, Accountants, Admission Guiders)",
            link: "/admin/users",
            icon: "👥"
        },
        {
            title: "Manage Majors",
            description: "Add Majors (B.Sc, BA, BBA) & Auto-assign Semesters",
            link: "/admin/majors",
            icon: "🎓"
        },
        {
            title: "Session Management",
            description: "Add New Sessions & Configure Semesters",
            link: "/admin/sessions",
            icon: "📅"
        },
        {
            title: "Manage Subjects",
            description: "Add new subjects to the curriculum",
            link: "/admin/subjects",
            icon: "📚"
        },
        {
            title: "Promote Session",
            description: "Promote current session and update academic year",
            link: "/admin/promote-session",
            icon: "🚀"
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 font-sans flex flex-col">

            {/* Header / Navbar */}
            <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <img
                            src="https://ugv.edu.bd/assets/images/logos/UGV-Logo-02.png"
                            alt="UGV Logo"
                            className="h-10 w-auto"
                        />
                        <div>
                            <h1 className="text-xl font-bold text-slate-800 leading-tight">Admin Portal</h1>
                            <p className="text-xs text-purple-600 font-medium">University of Global Village</p>
                        </div>
                    </div>
                    <button
                        onClick={() => window.location.href = '/logout'}
                        className="text-sm text-red-500 hover:text-red-700 font-semibold transition-colors"
                    >
                        Logout
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow container mx-auto px-6 py-10">

                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-slate-800">Dashboard Overview</h2>
                    <p className="text-slate-500 mt-1">Select an action to manage university data.</p>
                </div>

                {/* Grid of Admin Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {adminActions.map((action, index) => (
                        <Link
                            key={index}
                            href={action.link}
                            className="group block bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg hover:border-purple-200 transition-all duration-200 transform hover:-translate-y-1"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 rounded-lg bg-purple-50 text-2xl flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                                    {action.icon}
                                </div>
                                <span className="text-gray-300 group-hover:text-purple-400 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                    </svg>
                                </span>
                            </div>

                            <h3 className="text-lg font-bold text-slate-800 group-hover:text-purple-700 mb-2 transition-colors">
                                {action.title}
                            </h3>
                            <p className="text-sm text-slate-500 leading-relaxed">
                                {action.description}
                            </p>
                        </Link>
                    ))}
                </div>

            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 py-6 mt-auto">
                <div className="container mx-auto px-6 text-center text-xs text-gray-400">
                    <p>Copyright © 2026 University of Global Village, Bangladesh. All rights reserved.</p>
                </div>
            </footer>

        </div>
    );
};

export default AdminDashboard;