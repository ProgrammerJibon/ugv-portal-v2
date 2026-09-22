"use client";

import Section from '@/Components/Section';
import React, { useState, useEffect } from 'react';
import { getTeacherDashboardData } from './teacherDashboardActions';
import { FaSpinner, FaUsers, FaClipboardList, FaArrowRight, FaCalendarAlt, FaChalkboardTeacher } from 'react-icons/fa';
import Link from 'next/link';

const ExamMarksDashboard = ({ user }) => {
    const [loading, setLoading] = useState(true);
    const [sessions, setSessions] = useState([]);
    const [selectedSessionId, setSelectedSessionId] = useState("");
    const [currentSessionLabel, setCurrentSessionLabel] = useState("");
    const [assignedCourses, setAssignedCourses] = useState([]);

    const fetchData = async (sessionId = null) => {
        setLoading(true);
        const res = await getTeacherDashboardData(user?.id, sessionId);
        if (res.status === 'success') {
            setSessions(res.sessions || []);
            setSelectedSessionId(res.selectedSessionId);
            setCurrentSessionLabel(res.sessionLabel);
            setAssignedCourses(res.courses || []);
        } else {
            setCurrentSessionLabel("No Active Session");
            setAssignedCourses([]);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (!user || !user.id) return;
        fetchData();
    }, [user]);

    const handleSessionChange = (e) => {
        const newSessionId = e.target.value;
        setSelectedSessionId(newSessionId);
        fetchData(newSessionId);
    };

    const getDeptColor = (dept) => {
        const colors = {
            'CSE': 'bg-blue-600',
            'EEE': 'bg-orange-600',
            'BBA': 'bg-purple-600',
            'ENG': 'bg-emerald-600',
            'LLB': 'bg-red-600'
        };
        return colors[dept] || 'bg-slate-600';
    };

    return (
        <Section user={user}>
            <div className="min-h-screen bg-slate-50 font-sans">
                <div className="container mx-auto p-6">

                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800">Exam Controller - Course Marks Overview</h1>
                            <p className="text-slate-500 mt-1">
                                Review and verify student grading submitted by course instructors.
                            </p>
                        </div>

                        {/* Session Selector */}
                        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200">
                            <FaCalendarAlt className="text-indigo-600" />
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Session:</span>
                            <select
                                value={selectedSessionId}
                                onChange={handleSessionChange}
                                className="text-sm font-semibold text-slate-700 bg-transparent border-none focus:outline-none cursor-pointer"
                            >
                                {sessions.map((s) => (
                                    <option key={s.id} value={s.id}>
                                        {s.session_season} {s.session_year} {s.status === 'ACTIVE' ? '(Current)' : ''}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Content Grid */}
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <FaSpinner className="animate-spin text-4xl text-indigo-500" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                            {assignedCourses.length > 0 ? (
                                assignedCourses.map((course) => (
                                    <div key={course.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-slate-100 flex flex-col h-full group">

                                        {/* Card Top */}
                                        <div className={`${getDeptColor(course.dept)} px-6 py-4 text-white relative overflow-hidden`}>
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

                                        {/* Card Body */}
                                        <div className="p-6 flex-grow flex flex-col justify-between">
                                            <div>
                                                <h3 className="text-lg font-bold text-slate-800 mb-2 line-clamp-2" title={course.title}>
                                                    {course.title}
                                                </h3>

                                                <div className="space-y-3 mt-4 border-t border-slate-100 pt-4">
                                                    <div className="flex items-center text-sm text-slate-600">
                                                        <FaChalkboardTeacher className="mr-3 text-indigo-500 flex-shrink-0" />
                                                        <span className="truncate">
                                                            Teacher: <span className="font-semibold text-slate-800">{course.teacher_name}</span>
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center text-sm text-slate-500">
                                                        <FaUsers className="mr-3 text-slate-400 flex-shrink-0" />
                                                        <span>Students with Marks: <span className="font-semibold text-emerald-600">{course.marks_entered_count || 0}</span></span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Action Button */}
                                            <div className="mt-6 pt-4">
                                                <Link
                                                    href={`/exam/marks/${course.subject_id}/marks`}
                                                    className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 px-4 rounded-lg shadow transition-colors"
                                                >
                                                    Review & Edit Marks <FaArrowRight />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full py-16 flex flex-col items-center justify-center text-slate-400 bg-white rounded-xl border border-dashed border-slate-300">
                                    <FaClipboardList className="text-5xl mb-3 text-slate-300" />
                                    <p className="text-lg font-bold text-slate-600">No Courses Assigned in This Session</p>
                                    <p className="text-sm text-slate-400 mt-1">There are no faculty subject allocations for {currentSessionLabel}.</p>
                                </div>
                            )}

                        </div>
                    )}
                </div>
            </div>
        </Section>
    );
};

export default ExamMarksDashboard;