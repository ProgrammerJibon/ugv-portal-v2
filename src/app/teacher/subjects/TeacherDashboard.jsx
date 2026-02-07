"use client";

import Section from '@/Components/Section';
import React, { useState, useEffect } from 'react';
import { getTeacherDashboardData } from './teacherDashboardActions'; // Adjust path
import { FaSpinner, FaUsers, FaClock, FaClipboardList, FaArrowRight } from 'react-icons/fa';

const TeacherDashboard = ({ user }) => {
    const [loading, setLoading] = useState(true);
    const [currentSession, setCurrentSession] = useState("Loading...");
    const [assignedCourses, setAssignedCourses] = useState([]);

    // --- Load Data ---
    useEffect(() => {
        if (!user || !user.id) return;

        const fetchData = async () => {
            const res = await getTeacherDashboardData(user.id);
            if (res.status === 'success') {
                setCurrentSession(res.sessionLabel);
                setAssignedCourses(res.courses);
            } else {
                setCurrentSession("No Active Session");
            }
            setLoading(false);
        };

        fetchData();
    }, [user]);

    // --- Helper: Visual Coding for Dept ---
    const getDeptColor = (dept) => {
        const colors = {
            'CSE': 'bg-blue-600',
            'EEE': 'bg-orange-600',
            'BBA': 'bg-purple-600',
            'ENG': 'bg-emerald-600',
            'LLB': 'bg-red-600'
        };
        return colors[dept] || 'bg-slate-600'; // Default color
    };

    return (
        <Section user={user}>
            <div className="min-h-screen bg-slate-50 font-sans">

                {/* --- Main Content Area --- */}
                <div className="container mx-auto p-6">

                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800">My Assigned Courses</h1>
                            <p className="text-slate-500 mt-1">
                                Welcome back, <span className="font-semibold text-slate-700">{user?.name}</span>
                            </p>
                        </div>

                        {/* Session Badge */}
                        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Session</span>
                            <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                                {currentSession}
                            </span>
                        </div>
                    </div>

                    {/* --- Content Grid --- */}
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <FaSpinner className="animate-spin text-4xl text-indigo-500" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                            {assignedCourses.length > 0 ? (
                                assignedCourses.map((course) => (
                                    <div key={course.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-slate-100 flex flex-col h-full group">

                                        {/* Card Top: Color Banner & Dept Info */}
                                        <div className={`${getDeptColor(course.dept)} px-6 py-4 text-white relative overflow-hidden`}>
                                            {/* Decorative Background Text */}
                                            <h3 className="text-5xl font-bold opacity-10 absolute -bottom-4 -right-2 select-none group-hover:scale-110 transition-transform duration-500">
                                                {course.dept}
                                            </h3>

                                            <div className="flex justify-between items-start relative z-10">
                                                <div>
                                                    <div className="inline-block bg-white/20 backdrop-blur-md border border-white/30 rounded px-2 py-1 text-xs font-bold uppercase tracking-wide mb-2">
                                                        {course.dept} Dept
                                                    </div>
                                                    <h2 className="text-xl font-bold leading-tight">{course.code}</h2>
                                                </div>
                                                <div className="text-right">
                                                    <span className="block text-2xl font-bold">{course.semester}</span>
                                                    <span className="text-xs font-medium opacity-80 uppercase">Semester</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Card Body: Course Details */}
                                        <div className="p-6 flex-grow flex flex-col justify-between">
                                            <div>
                                                <h3 className="text-lg font-bold text-slate-800 mb-2 line-clamp-2" title={course.title}>
                                                    {course.title}
                                                </h3>

                                                {/* Meta Info (Mocked for now as specific schedule table doesn't exist yet) */}
                                                <div className="space-y-3 mt-4 border-t border-slate-100 pt-4">
                                                    <div className="flex items-center text-sm text-slate-500">
                                                        <FaUsers className="mr-3 text-slate-400" />
                                                        <span>Students Enrolled: <span className="font-semibold text-slate-700">TBA</span></span>
                                                    </div>
                                                    <div className="flex items-center text-sm text-slate-500">
                                                        <FaClock className="mr-3 text-slate-400" />
                                                        <span>Schedule: <span className="italic text-slate-400">Not set</span></span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="mt-6 pt-4 grid grid-cols-2 gap-3">
                                                <button 
                                                    onClick={() => window.location.href = `/teacher/subjects/${course.subject_id}/materials`} 
                                                className="flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold py-2 px-3 rounded border border-slate-200 transition-colors">
                                                    <FaClipboardList /> Materials
                                                </button>
                                                <button
                                                    className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2 px-3 rounded shadow transition-colors"
                                                    onClick={() => window.location.href = `/teacher/subjects/${course.subject_id}/marks`} // Future link
                                                >
                                                    Enter Marks <FaArrowRight />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full py-12 flex flex-col items-center justify-center text-slate-400 bg-white rounded-xl border border-dashed border-slate-300">
                                    <FaClipboardList className="text-4xl mb-3 opacity-50" />
                                    <p className="text-lg font-semibold">No Courses Assigned</p>
                                    <p className="text-sm">You have not been assigned any courses for the {currentSession} session yet.</p>
                                </div>
                            )}

                            {/* Contact Card */}
                            <div className="bg-slate-100 rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center p-6 text-slate-400 min-h-[200px] hover:bg-slate-200 transition-colors cursor-pointer">
                                <p className="text-sm font-medium text-center">Missing a course?</p>
                                <p className="text-xs mt-1 text-center max-w-[200px]">Contact the Exam Controller assigned to your department to rectify allocation issues.</p>
                            </div>

                        </div>
                    )}
                </div>
            </div>
        </Section>
    );
};

export default TeacherDashboard;