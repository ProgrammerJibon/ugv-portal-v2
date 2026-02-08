"use client";
import Section from '@/Components/Section';
import React, { useState, useMemo } from 'react';

// --- DATA: Departments ---
const DEPARTMENTS = [
    { id: 'CSE', name: 'Computer Science & Engineering (CSE)' },
    { id: 'EEE', name: 'Electrical & Electronic Engineering (EEE)' },
    { id: 'CIVIL', name: 'Civil Engineering (CE)' },
    { id: 'ME', name: 'Mechanical Engineering (ME)' },
    { id: 'BBA', name: 'Bachelor of Business Administration (BBA)' },
    { id: 'ENG', name: 'English' },
];

const SEMESTERS = [
    { id: 'sem-1', name: '1st Semester' },
    { id: 'sem-2', name: '2nd Semester' },
    { id: 'sem-3', name: '3rd Semester' },
    { id: 'sem-4', name: '4th Semester' },
    { id: 'sem-5', name: '5th Semester' },
    { id: 'sem-6', name: '6th Semester' },
    { id: 'sem-7', name: '7th Semester' },
    { id: 'sem-8', name: '8th Semester' },
];

// --- DATA: Course Database (Mapped by Dept -> Semester) ---
// Note: I've added sample data for Sem 1 & 2 for all, and generic for others to save space.
const COURSE_DB = {
    CSE: {
        'sem-1': [{ id: 'cse103', name: 'Structured Programming' }, { id: 'phy102', name: 'Physics I' }, { id: 'math101', name: 'differential and integral calculus' }, { id: 'cse101', name: 'Computer Fundamentals' }, { id: 'EEE105', name: 'Electrical Circuits' },],
        'sem-2': [{ id: 'cse201', name: 'Digital Logic Design' }, { id: 'math201', name: 'Calculus I' }, { id: 'cse105', name: 'Data Structure' }, { id: 'che201', name: 'Chemistry' }, { id: 'ENG204', name: 'ELP I' }],
        'sem-3': [{ id: 'cse101', name: 'TOC' }, { id: 'CSE103', name: 'Algorithm Design' }, { id: 'math101', name: 'Calculus II' }, { id: 'ENG107', name: 'ELP II' }, { id: 'EEE101', name: 'Principles of Electronics' }],
        'sem-4': [{ id: 'cse202', name: 'Web Programming' }, { id: 'cse205', name: 'Database Management' }, { id: 'cse120', name: 'Object Oriented Programming' }, { id: 'cse220', name: 'Computer Networking & Security' }, { id: 'math201', name: 'Calculus III' }],
        'sem-5': [{ id: 'cse301', name: 'Database Systems' }, { id: 'cse302', name: 'Software Eng' }],
        'sem-6': [{ id: 'cse303', name: 'Computer Networks' }, { id: 'cse304', name: 'Web Tech' }],
        'sem-7': [{ id: 'cse401', name: 'AI & Neural Networks' }, { id: 'cse402', name: 'Compiler Design' }],
        'sem-8': [{ id: 'cse403', name: 'Machine Learning' }, { id: 'prj400', name: 'Final Project' }],
    },
    EEE: {
        'sem-1': [{ id: 'eee101', name: 'Electrical Circuits I' }, { id: 'mat101', name: 'Calculus I' }],
        'sem-2': [{ id: 'eee102', name: 'Electrical Circuits II' }, { id: 'phy102', name: 'Physics II' }],
        'sem-3': [{ id: 'eee201', name: 'Electronics I' }, { id: 'mat201', name: 'Diff Equations' }],
        'sem-4': [{ id: 'eee202', name: 'Digital Logic' }, { id: 'eee203', name: 'Signals & Systems' }],
        'sem-5': [{ id: 'eee301', name: 'Electromagnetic Fields' }, { id: 'eee302', name: 'Power Systems I' }],
        'sem-6': [{ id: 'eee303', name: 'Control Systems' }, { id: 'eee304', name: 'Communication Theory' }],
        'sem-7': [{ id: 'eee401', name: 'Switchgear' }, { id: 'eee402', name: 'VLSI Design' }],
        'sem-8': [{ id: 'eee403', name: 'Power Plant Eng' }, { id: 'prj400', name: 'Capstone Project' }],
    },
    CIVIL: {
        'sem-1': [{ id: 'ce101', name: 'Surveying' }, { id: 'chem101', name: 'Chemistry' }],
        'sem-2': [{ id: 'ce102', name: 'Engineering Mechanics' }, { id: 'mat102', name: 'Calculus II' }],
        'sem-3': [{ id: 'ce201', name: 'Mechanics of Solids' }, { id: 'geo201', name: 'Geology' }],
        'sem-4': [{ id: 'ce202', name: 'Fluid Mechanics' }, { id: 'ce203', name: 'Concrete Tech' }],
        'sem-8': [{ id: 'ce400', name: 'Structural Analysis III' }, { id: 'prj400', name: 'Thesis' }],
    },
    ME: {
        'sem-1': [{ id: 'me101', name: 'Thermal Engineering' }, { id: 'mat101', name: 'Calculus' }],
        'sem-2': [{ id: 'me102', name: 'Thermodynamics' }, { id: 'phy101', name: 'Physics' }],
        'sem-3': [{ id: 'me201', name: 'Fluid Mechanics' }, { id: 'me202', name: 'Manufacturing' }],
        'sem-8': [{ id: 'me400', name: 'Automobile Eng' }, { id: 'prj400', name: 'Project' }],
    },
    BBA: {
        'sem-1': [{ id: 'bba101', name: 'Intro to Business' }, { id: 'eng101', name: 'Business English' }],
        'sem-2': [{ id: 'bba102', name: 'Financial Accounting' }, { id: 'eco101', name: 'Microeconomics' }],
        'sem-3': [{ id: 'bba201', name: 'Marketing Management' }, { id: 'bba202', name: 'Business Math' }],
        'sem-8': [{ id: 'bba401', name: 'Strategic Management' }, { id: 'bba402', name: 'Internship' }],
    },
    ENG: {
        'sem-1': [{ id: 'eng101', name: 'Intro to Poetry' }, { id: 'eng102', name: 'History of English' }],
        'sem-2': [{ id: 'eng103', name: 'Intro to Prose' }, { id: 'eng104', name: 'Phonetics' }],
        'sem-3': [{ id: 'eng201', name: 'Romantic Poetry' }, { id: 'eng202', name: 'Victorian Lit' }],
        'sem-8': [{ id: 'eng400', name: 'Literary Criticism' }, { id: 'eng402', name: 'Thesis' }],
    }
};

// --- COMPONENT: Star Rating ---
const StarRating = ({ user, label, rating, setRating, onHover, setHover }) => {
    return (
        <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2 font-sans">
                {label}
            </label>
            <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, index) => {
                    const starValue = index + 1;
                    return (
                        <button
                            type="button"
                            key={starValue}
                            className={`transition-all duration-200 focus:outline-none transform hover:scale-110 ${starValue <= (onHover || rating)
                                    ? "text-yellow-400"
                                    : "text-gray-300"
                                }`}
                            onClick={() => setRating(starValue)}
                            onMouseEnter={() => setHover(starValue)}
                            onMouseLeave={() => setHover(0)}
                        >
                            <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
                                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                            </svg>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

// --- MAIN COMPONENT ---
const CourseFeedback = ({ user }) => {
    const [formData, setFormData] = useState({
        department: '',
        semester: '',
        course: '',
        studentName: '',
        email: '',
        overallRating: 0,
        instructorRating: 0,
        comments: '',
        recommend: 'yes'
    });

    const [hoverOverall, setHoverOverall] = useState(0);
    const [hoverInstructor, setHoverInstructor] = useState(0);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');

    // Helper: Get courses based on current Dept & Semester
    const availableCourses = useMemo(() => {
        if (formData.department && formData.semester) {
            const deptCourses = COURSE_DB[formData.department];
            if (deptCourses && deptCourses[formData.semester]) {
                return deptCourses[formData.semester];
            }
        }
        return [];
    }, [formData.department, formData.semester]);

    // Handlers
    const handleDeptChange = (e) => {
        setFormData({
            ...formData,
            department: e.target.value,
            semester: '', // Reset semester
            course: ''    // Reset course
        });
    };

    const handleSemesterChange = (e) => {
        setFormData({
            ...formData,
            semester: e.target.value,
            course: ''    // Reset course
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.department || !formData.semester || !formData.course) {
            setError('Please select Department, Semester, and Course.');
            return;
        }
        if (formData.overallRating === 0 || formData.instructorRating === 0) {
            setError('Please provide star ratings.');
            return;
        }
        // API Call simulation
        console.log("Feedback Submitted:", formData);
        setError('');
        setIsSubmitted(true);
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md w-full border-t-4 border-green-500 animate-fade-in-up">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Feedback Received!</h2>
                    <p className="text-gray-600 mb-6">
                        Thank you for reviewing <br />
                        <span className="font-bold text-indigo-700">
                            {availableCourses.find(c => c.id === formData.course)?.name}
                        </span>
                    </p>
                    <button onClick={() => window.location.reload()} className="text-indigo-600 hover:text-indigo-800 font-medium underline">
                        Submit Another Review
                    </button>
                </div>
            </div>
        );
    }

    return (
        <Section user={user}>
            <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8 font-sans">
                <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">

                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-8 px-8">
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-3xl font-extrabold text-white tracking-tight">COURSE FEEDBACK</h1>
                                <p className="text-blue-200 mt-1 text-sm font-medium">Academic Course Evaluation Portal</p>
                            </div>
                            {/* Decorative Icon */}
                            <div className="hidden sm:block text-blue-300 opacity-30">
                                <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2L1 7l11 5 9-4.09V17h2V7L12 2zm1 14.82V10.6L5.34 7.12 4 7.74l8 3.63 8-3.63-1.34-.61L13 10.6v6.22l-1 .45-1-.45zM12 22l-6.5-3.5v-5l6.5 3.5 6.5-3.5v5L12 22z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-8">

                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded text-sm flex items-center">
                                <span className="mr-2">⚠️</span> {error}
                            </div>
                        )}

                        {/* --- SECTION 1: ACADEMIC DETAILS --- */}
                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                            <h3 className="text-lg font-bold text-gray-800 mb-5 flex items-center uppercase tracking-wider text-sm">
                                <span className="bg-indigo-600 w-2 h-2 rounded-full mr-2"></span>
                                Academic Selection
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                {/* Department Dropdown */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Department</label>
                                    <select
                                        name="department"
                                        value={formData.department}
                                        onChange={handleDeptChange}
                                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border bg-white"
                                    >
                                        <option value="">-- Select Department --</option>
                                        {DEPARTMENTS.map((dept) => (
                                            <option key={dept.id} value={dept.id}>{dept.name}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Semester Dropdown */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Semester</label>
                                    <select
                                        name="semester"
                                        value={formData.semester}
                                        onChange={handleSemesterChange}
                                        disabled={!formData.department}
                                        className={`block w-full rounded-lg border-gray-300 shadow-sm sm:text-sm p-3 border bg-white transition-colors
                    ${!formData.department ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'focus:border-indigo-500 focus:ring-indigo-500'}`}
                                    >
                                        <option value="">{formData.department ? '-- Select Semester --' : 'Select Dept First'}</option>
                                        {SEMESTERS.map((sem) => (
                                            <option key={sem.id} value={sem.id}>{sem.name}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Course Dropdown */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Course</label>
                                    <select
                                        name="course"
                                        value={formData.course}
                                        onChange={handleChange}
                                        disabled={!formData.semester}
                                        className={`block w-full rounded-lg border-gray-300 shadow-sm sm:text-sm p-3 border bg-white transition-colors
                    ${!formData.semester ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'focus:border-indigo-500 focus:ring-indigo-500'}`}
                                    >
                                        <option value="">
                                            {formData.semester ? (availableCourses.length > 0 ? '-- Select Course --' : 'No courses found') : 'Select Sem First'}
                                        </option>
                                        {availableCourses.map((course) => (
                                            <option key={course.id} value={course.id}>{course.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* --- SECTION 2: RATINGS --- */}
                        <div>
                            <h3 className="text-lg font-bold text-gray-800 mb-5 flex items-center uppercase tracking-wider text-sm">
                                <span className="bg-indigo-600 w-2 h-2 rounded-full mr-2"></span>
                                Evaluation
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                                <StarRating
                                    label="Course Material Quality"
                                    rating={formData.overallRating}
                                    setRating={(val) => setFormData({ ...formData, overallRating: val })}
                                    onHover={hoverOverall}
                                    setHover={setHoverOverall}
                                />
                                <StarRating
                                    label="Instructor Pacing & Clarity"
                                    rating={formData.instructorRating}
                                    setRating={(val) => setFormData({ ...formData, instructorRating: val })}
                                    onHover={hoverInstructor}
                                    setHover={setHoverInstructor}
                                />
                            </div>
                        </div>

                        {/* --- SECTION 3: COMMENTS --- */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Detailed Comments</label>
                            <textarea
                                name="comments"
                                rows={4}
                                value={formData.comments}
                                onChange={handleChange}
                                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-4 border"
                                placeholder="What specifically did you find helpful or difficult?"
                            />
                        </div>

                        {/* Submit Action */}
                        <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between">
                            <div className="text-xs text-gray-500 mb-4 sm:mb-0">
                                * Your feedback is anonymous unless you provide contact info.
                            </div>
                            <button
                                type="submit"
                                className="w-full sm:w-auto px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-md transition-all transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Submit Feedback
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </Section>
    );
};

export default CourseFeedback;