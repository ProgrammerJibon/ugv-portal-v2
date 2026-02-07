"use client";

import Section from '@/Components/Section';
import React, { useState, useEffect } from 'react';
import { getTeachersListAction, submitReviewAction } from './reviewActions';
import { FaStar, FaSearch, FaChalkboardTeacher, FaSpinner, FaPaperPlane, FaBookOpen } from 'react-icons/fa';

const ReviewTeachersPage = ({ user }) => {
    // --- State ---
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // --- Form State ---
    const [selectedAssignment, setSelectedAssignment] = useState(null); // Contains teacher + subject info
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // --- Load Teachers based on Student Context ---
    useEffect(() => {
        if (!user) return;

        const load = async () => {
            // Pass user's academic context to backend
            const studentContext = {
                program: user.program,
                session: user.session,
                current_semester: user.current_semester
            };

            const res = await getTeachersListAction(studentContext);
            if (res.status === 'success') {
                setTeachers(res.data);
            }
            setLoading(false);
        };
        load();
    }, [user]);

    // --- Filter Logic ---
    const filteredTeachers = teachers.filter(t =>
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.subject_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // --- Handlers ---
    const handleSelectTeacher = (assignment) => {
        setSelectedAssignment(assignment);
        setRating(0);
        setComment('');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            alert("Please give a star rating.");
            return;
        }

        setSubmitting(true);
        const formData = new FormData();
        // Identity
        formData.append("studentId", user.user_id);
        formData.append("teacherId", selectedAssignment.teacher_id);
        // Review Content
        formData.append("rating", rating.toString());
        formData.append("comment", comment);
        // Academic Context (For DB)
        formData.append("sessionId", selectedAssignment.session_id);
        formData.append("programId", selectedAssignment.program_id);
        formData.append("semester", selectedAssignment.semester);
        formData.append("subjectId", selectedAssignment.subject_id);

        const res = await submitReviewAction(formData);

        if (res.status === 'success') {
            alert(res.message);
            setSelectedAssignment(null);
        } else {
            alert(res.message);
        }
        setSubmitting(false);
    };

    return (
        <Section user={user}>
            <div className="min-h-screen bg-slate-50 font-sans py-10">
                <div className="container mx-auto px-4 max-w-5xl">

                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-slate-800">Review Teachers</h1>
                        <p className="text-slate-500 text-sm">
                            Showing teachers for <span className="font-bold text-indigo-600">{user.session}</span>, Semester <span className="font-bold text-indigo-600">{user.current_semester}</span>.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* --- Left Column: Teacher List --- */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* Search Bar */}
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                                    <FaSearch />
                                </span>
                                <input
                                    type="text"
                                    placeholder="Search by teacher or subject..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-3 shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                                />
                            </div>

                            {/* Cards Grid */}
                            {loading ? (
                                <div className="text-center py-10 text-slate-400"><FaSpinner className="animate-spin inline" /> Loading Assigned Teachers...</div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {filteredTeachers.map((item, idx) => (
                                        <div
                                            key={idx}
                                            onClick={() => handleSelectTeacher(item)}
                                            className={`p-5 rounded-xl border cursor-pointer transition-all duration-200 flex flex-col gap-3 group ${selectedAssignment?.teacher_id === item.teacher_id && selectedAssignment?.subject_id === item.subject_id
                                                ? 'bg-indigo-50 border-indigo-500 ring-1 ring-indigo-500 shadow-md'
                                                : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-md'
                                                }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold transition-colors ${selectedAssignment?.teacher_id === item.teacher_id ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-600'
                                                    }`}>
                                                    {item.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <h3 className={`font-bold text-sm ${selectedAssignment?.teacher_id === item.teacher_id ? 'text-indigo-900' : 'text-slate-700'}`}>
                                                        {item.name}
                                                    </h3>
                                                    <p className="text-xs text-slate-500">{item.designation || 'Faculty'}</p>
                                                </div>
                                            </div>

                                            {/* Subject Tag */}
                                            <div className="mt-2 pt-3 border-t border-slate-100/50 flex items-center gap-2 text-xs text-slate-500">
                                                <FaBookOpen className="text-indigo-400" />
                                                <span className="font-medium truncate">{item.subject_code} - {item.subject_name}</span>
                                            </div>
                                        </div>
                                    ))}
                                    {filteredTeachers.length === 0 && (
                                        <div className="col-span-full text-center py-8 text-slate-400 text-sm bg-white rounded-xl border border-dashed border-slate-300">
                                            No assigned teachers found for your current session/semester.
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* --- Right Column: Review Form (Sticky) --- */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-6">
                                {selectedAssignment ? (
                                    <div className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden animate-fade-in-up">
                                        <div className="bg-slate-900 px-6 py-4">
                                            <h2 className="text-white font-bold text-sm flex items-center gap-2">
                                                <FaChalkboardTeacher className="text-indigo-400" /> Rate Faculty
                                            </h2>
                                        </div>

                                        <form onSubmit={handleSubmit} className="p-6">
                                            <div className="text-center mb-6">
                                                <div className="w-16 h-16 mx-auto bg-indigo-50 rounded-full flex items-center justify-center text-2xl font-bold text-indigo-600 mb-2">
                                                    {selectedAssignment.name.charAt(0)}
                                                </div>
                                                <h3 className="font-bold text-slate-800">{selectedAssignment.name}</h3>
                                                <p className="text-xs text-slate-500 mb-2">{selectedAssignment.designation}</p>
                                                <span className="inline-block bg-slate-100 text-slate-600 text-[10px] px-2 py-1 rounded font-bold border border-slate-200">
                                                    {selectedAssignment.subject_name}
                                                </span>
                                            </div>

                                            {/* Star Rating */}
                                            <div className="mb-6">
                                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 text-center">Select Rating</label>
                                                <div className="flex justify-center gap-2">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <button
                                                            key={star}
                                                            type="button"
                                                            onClick={() => setRating(star)}
                                                            onMouseEnter={() => setHoverRating(star)}
                                                            onMouseLeave={() => setHoverRating(0)}
                                                            className="focus:outline-none transition-transform active:scale-90"
                                                        >
                                                            <FaStar
                                                                className={`text-3xl transition-colors ${star <= (hoverRating || rating)
                                                                    ? 'text-amber-400 drop-shadow-sm'
                                                                    : 'text-slate-200'
                                                                    }`}
                                                            />
                                                        </button>
                                                    ))}
                                                </div>
                                                <p className="text-center text-xs font-semibold text-slate-400 mt-2 h-4">
                                                    {rating === 1 && "Poor"}
                                                    {rating === 2 && "Fair"}
                                                    {rating === 3 && "Good"}
                                                    {rating === 4 && "Very Good"}
                                                    {rating === 5 && "Excellent!"}
                                                </p>
                                            </div>

                                            {/* Comment Box */}
                                            <div className="mb-6">
                                                <label className="block text-xs font-bold text-slate-500 mb-2">Feedback (Optional)</label>
                                                <textarea
                                                    rows="4"
                                                    value={comment}
                                                    onChange={(e) => setComment(e.target.value)}
                                                    placeholder="Write your constructive feedback here..."
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none"
                                                ></textarea>
                                            </div>

                                            {/* Submit */}
                                            <button
                                                type="submit"
                                                disabled={submitting}
                                                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 rounded-lg shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                            >
                                                {submitting ? <FaSpinner className="animate-spin" /> : <FaPaperPlane />}
                                                Submit Review
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => setSelectedAssignment(null)}
                                                className="w-full text-center text-xs text-slate-400 mt-4 hover:text-slate-600 underline"
                                            >
                                                Cancel
                                            </button>
                                        </form>
                                    </div>
                                ) : (
                                    // Empty State
                                    <div className="bg-white rounded-xl border border-dashed border-slate-300 p-8 text-center h-64 flex flex-col items-center justify-center text-slate-400">
                                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                                            <FaChalkboardTeacher className="text-2xl opacity-50" />
                                        </div>
                                        <p className="text-sm font-medium">Select a teacher from the list to write a review.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </Section>
    );
};

export default ReviewTeachersPage;