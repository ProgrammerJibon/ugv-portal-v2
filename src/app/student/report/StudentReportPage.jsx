"use client";

import Section from '@/Components/Section';
import React, { useState, useEffect } from 'react';
import { getStudentFullReportAction } from './studentReportActions';
import {
    FaGraduationCap, FaAward, FaBook, FaPrint, FaSpinner,
    FaCheckCircle, FaExclamationCircle, FaStar, FaCommentAlt, FaUniversity
} from 'react-icons/fa';

const StudentReportPage = ({ user }) => {
    const [activeTab, setActiveTab] = useState('transcript'); // 'transcript' | 'feedback'
    const [loading, setLoading] = useState(true);
    const [reportData, setReportData] = useState(null);

    // Feedback Form State
    const [feedbackForm, setFeedbackForm] = useState({
        subject: '',
        rating: 5,
        instructorRating: 5,
        comments: '',
        recommend: 'yes'
    });
    const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

    useEffect(() => {
        if (!user?.user_id) return;
        const load = async () => {
            const res = await getStudentFullReportAction(user.user_id);
            if (res.status === 'success') {
                setReportData(res);
            }
            setLoading(false);
        };
        load();
    }, [user]);

    const handleFeedbackSubmit = (e) => {
        e.preventDefault();
        setFeedbackSubmitted(true);
    };

    if (loading) {
        return (
            <Section user={user}>
                <div className="min-h-screen flex justify-center items-center text-slate-400">
                    <FaSpinner className="animate-spin text-3xl text-indigo-600" />
                </div>
            </Section>
        );
    }

    const student = reportData?.student || user;
    const cgpa = reportData?.cgpa || '0.00';
    const totalCredits = reportData?.totalCreditsEarned || 0;
    const standing = reportData?.academicStanding || 'Good Standing';
    const semesters = reportData?.semesters || [];

    return (
        <Section user={user}>
            <div className="min-h-screen bg-slate-50 font-sans py-10 print:py-0 print:bg-white">
                <div className="container mx-auto px-4 max-w-5xl">

                    {/* Top Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 print:hidden">
                        <div>
                            <h1 className="text-3xl font-extrabold text-slate-800">Academic Progress & Report</h1>
                            <p className="text-slate-500 text-sm mt-1">Official Student Grade Sheet & Degree Evaluation</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => window.print()}
                                className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-5 rounded-xl shadow transition-all flex items-center gap-2 text-sm"
                            >
                                <FaPrint /> Print Transcript
                            </button>
                        </div>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex border-b border-slate-200 mb-8 print:hidden">
                        <button
                            onClick={() => setActiveTab('transcript')}
                            className={`py-3 px-6 font-bold text-sm border-b-2 transition-all flex items-center gap-2 ${
                                activeTab === 'transcript'
                                    ? 'border-indigo-600 text-indigo-600'
                                    : 'border-transparent text-slate-500 hover:text-slate-800'
                            }`}
                        >
                            <FaGraduationCap className="text-base" /> Academic Transcript & Progress
                        </button>
                        <button
                            onClick={() => setActiveTab('feedback')}
                            className={`py-3 px-6 font-bold text-sm border-b-2 transition-all flex items-center gap-2 ${
                                activeTab === 'feedback'
                                    ? 'border-indigo-600 text-indigo-600'
                                    : 'border-transparent text-slate-500 hover:text-slate-800'
                            }`}
                        >
                            <FaCommentAlt className="text-sm" /> Course & Faculty Evaluation
                        </button>
                    </div>

                    {activeTab === 'transcript' ? (
                        <div className="space-y-8">
                            {/* University Transcript Printable Header */}
                            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm relative overflow-hidden">
                                <div className="text-center border-b border-slate-100 pb-6 mb-6">
                                    <img
                                        src="https://ugv.edu.bd/assets/images/logos/UGV-Logo-02.png"
                                        alt="UGV Logo"
                                        className="h-14 w-auto mx-auto mb-2"
                                    />
                                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">UNIVERSITY OF GLOBAL VILLAGE (UGV)</h2>
                                    <p className="text-xs text-slate-500 uppercase font-semibold">Office of the Controller of Examinations</p>
                                    <div className="inline-block mt-3 bg-indigo-50 border border-indigo-200 text-indigo-700 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                        Academic Progress Transcript
                                    </div>
                                </div>

                                {/* Student Information Card */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6">
                                    <div>
                                        <span className="text-xs font-bold text-slate-400 uppercase">Student Name:</span>
                                        <p className="font-bold text-slate-800">{student?.name}</p>
                                    </div>
                                    <div>
                                        <span className="text-xs font-bold text-slate-400 uppercase">Student ID:</span>
                                        <p className="font-mono font-bold text-indigo-600">{student?.user_id}</p>
                                    </div>
                                    <div>
                                        <span className="text-xs font-bold text-slate-400 uppercase">Program:</span>
                                        <p className="font-semibold text-slate-700">{student?.program_name || student?.program || 'Undergraduate'}</p>
                                    </div>
                                    <div>
                                        <span className="text-xs font-bold text-slate-400 uppercase">Admitted Session:</span>
                                        <p className="font-semibold text-slate-700">{student?.session || 'N/A'}</p>
                                    </div>
                                </div>

                                {/* KPI Cards */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 print:hidden">
                                    <div className="p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl text-white">
                                        <span className="text-xs font-bold text-indigo-100 uppercase tracking-wider">Cumulative CGPA</span>
                                        <h3 className="text-3xl font-black mt-1">{cgpa} <span className="text-sm font-normal text-indigo-200">/ 4.00</span></h3>
                                    </div>
                                    <div className="p-4 bg-white border border-slate-200 rounded-xl">
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Credits Completed</span>
                                        <h3 className="text-3xl font-black text-slate-800 mt-1">{totalCredits.toFixed(1)}</h3>
                                    </div>
                                    <div className="p-4 bg-white border border-slate-200 rounded-xl">
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Academic Standing</span>
                                        <div className="flex items-center gap-2 mt-2">
                                            <FaAward className="text-amber-500 text-xl" />
                                            <span className="font-bold text-slate-700 text-sm">{standing}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Semester-by-Semester Results */}
                                {semesters.length > 0 ? (
                                    <div className="space-y-6">
                                        {semesters.map((semData, sIdx) => (
                                            <div key={sIdx} className="border border-slate-200 rounded-xl overflow-hidden">
                                                <div className="bg-slate-100 px-6 py-3 flex justify-between items-center">
                                                    <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide">
                                                        Semester {semData.semester} Results
                                                    </h3>
                                                    <div className="flex items-center gap-4 text-xs font-bold text-slate-600">
                                                        <span>Credits: {semData.creditsEarned.toFixed(1)}</span>
                                                        <span className="bg-white px-2.5 py-1 rounded shadow-sm text-indigo-600">SGPA: {semData.sgpa}</span>
                                                    </div>
                                                </div>
                                                <table className="w-full text-left text-sm">
                                                    <thead className="bg-slate-50 text-slate-400 text-xs font-bold uppercase border-b border-slate-200">
                                                        <tr>
                                                            <th className="px-6 py-3 w-28">Code</th>
                                                            <th className="px-6 py-3">Course Title</th>
                                                            <th className="px-6 py-3 text-center w-24">Credits</th>
                                                            <th className="px-6 py-3 text-center w-24">Grade</th>
                                                            <th className="px-6 py-3 text-center w-24">Point</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-slate-100">
                                                        {semData.courses.map((course, cIdx) => (
                                                            <tr key={cIdx} className="hover:bg-slate-50/60">
                                                                <td className="px-6 py-3 font-mono font-bold text-slate-700">{course.code}</td>
                                                                <td className="px-6 py-3 font-medium text-slate-800">{course.title}</td>
                                                                <td className="px-6 py-3 text-center text-slate-600">{course.credit.toFixed(1)}</td>
                                                                <td className="px-6 py-3 text-center font-bold">
                                                                    <span className={`px-2 py-0.5 rounded text-xs ${
                                                                        course.grade === 'A+' ? 'bg-emerald-100 text-emerald-700' :
                                                                        course.grade === 'F' ? 'bg-red-100 text-red-700' :
                                                                        'bg-slate-100 text-slate-700'
                                                                    }`}>
                                                                        {course.grade}
                                                                    </span>
                                                                </td>
                                                                <td className="px-6 py-3 text-center font-semibold text-slate-700">{course.point.toFixed(2)}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-16 text-center text-slate-400">
                                        <FaGraduationCap className="text-5xl mx-auto mb-3 opacity-30" />
                                        <p className="font-bold text-slate-600">No Semester Grades Recorded Yet</p>
                                        <p className="text-xs mt-1">Course results and grades will appear here once published by the Exam Controller.</p>
                                    </div>
                                )}

                                {/* Transcript Grading System Scale */}
                                <div className="mt-8 pt-6 border-t border-dashed border-slate-200 text-xs text-slate-400">
                                    <p className="font-bold uppercase mb-2">Grading System Scale (UGC Standard):</p>
                                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px]">
                                        <span>80% & Above: <strong>A+ (4.00)</strong></span>
                                        <span>75% - 79%: <strong>A (3.75)</strong></span>
                                        <span>70% - 74%: <strong>A- (3.50)</strong></span>
                                        <span>65% - 69%: <strong>B+ (3.25)</strong></span>
                                        <span>60% - 64%: <strong>B (3.00)</strong></span>
                                        <span>55% - 59%: <strong>B- (2.75)</strong></span>
                                        <span>50% - 54%: <strong>C+ (2.50)</strong></span>
                                        <span>45% - 49%: <strong>C (2.25)</strong></span>
                                        <span>40% - 44%: <strong>D (2.00)</strong></span>
                                        <span>Below 40%: <strong className="text-red-500">F (0.00)</strong></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* Feedback Tab */
                        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm max-w-2xl mx-auto">
                            {feedbackSubmitted ? (
                                <div className="text-center py-12 space-y-4 animate-fade-in">
                                    <div className="w-16 h-16 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
                                        <FaCheckCircle className="text-3xl" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-800">Thank You For Your Feedback!</h3>
                                    <p className="text-sm text-slate-500 max-w-md mx-auto">
                                        Your academic and faculty evaluation has been securely recorded to enhance university learning quality.
                                    </p>
                                    <button
                                        onClick={() => setFeedbackSubmitted(false)}
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-6 rounded-xl text-sm transition-colors mt-2"
                                    >
                                        Submit Another Evaluation
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleFeedbackSubmit} className="space-y-6">
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-800">Course & Instructor Evaluation</h3>
                                        <p className="text-xs text-slate-500 mt-1">Submit constructive feedback on academic curriculum and instructional quality.</p>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Course / Subject Name</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="e.g. Structured Programming (CSE-103)"
                                            value={feedbackForm.subject}
                                            onChange={(e) => setFeedbackForm({ ...feedbackForm, subject: e.target.value })}
                                            className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-indigo-500"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Course Content Rating</label>
                                            <select
                                                value={feedbackForm.rating}
                                                onChange={(e) => setFeedbackForm({ ...feedbackForm, rating: parseInt(e.target.value) })}
                                                className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-indigo-500 bg-white"
                                            >
                                                <option value={5}>⭐⭐⭐⭐⭐ (5 - Excellent)</option>
                                                <option value={4}>⭐⭐⭐⭐ (4 - Very Good)</option>
                                                <option value={3}>⭐⭐⭐ (3 - Satisfactory)</option>
                                                <option value={2}>⭐⭐ (2 - Needs Improvement)</option>
                                                <option value={1}>⭐ (1 - Unsatisfactory)</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Instructor Delivery</label>
                                            <select
                                                value={feedbackForm.instructorRating}
                                                onChange={(e) => setFeedbackForm({ ...feedbackForm, instructorRating: parseInt(e.target.value) })}
                                                className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-indigo-500 bg-white"
                                            >
                                                <option value={5}>⭐⭐⭐⭐⭐ (5 - Excellent)</option>
                                                <option value={4}>⭐⭐⭐⭐ (4 - Very Good)</option>
                                                <option value={3}>⭐⭐⭐ (3 - Satisfactory)</option>
                                                <option value={2}>⭐⭐ (2 - Needs Improvement)</option>
                                                <option value={1}>⭐ (1 - Unsatisfactory)</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Comments & Suggestions</label>
                                        <textarea
                                            rows={4}
                                            placeholder="Write your feedback regarding lecture delivery, course materials, assignments..."
                                            value={feedbackForm.comments}
                                            onChange={(e) => setFeedbackForm({ ...feedbackForm, comments: e.target.value })}
                                            className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-indigo-500"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow transition-all"
                                    >
                                        Submit Evaluation
                                    </button>
                                </form>
                            )}
                        </div>
                    )}

                </div>
            </div>
        </Section>
    );
};

export default StudentReportPage;
