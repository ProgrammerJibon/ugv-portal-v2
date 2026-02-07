"use client";

import Section from '@/Components/Section';
import React, { useState, useEffect, useRef } from 'react'; // Added useRef
import { getStudentResultsAction } from './studentResultActions';
import { FaSpinner, FaDownload, FaUniversity } from 'react-icons/fa';
import { toPng } from 'html-to-image'; // Add this
import jsPDF from 'jspdf';

const StudentResultPage = ({ user }) => {
    // --- State ---
    const [loading, setLoading] = useState(true);
    const [studentInfo, setStudentInfo] = useState(null);
    const [resultsDB, setResultsDB] = useState({});
    const [selectedSemester, setSelectedSemester] = useState("");
    const [downloading, setDownloading] = useState(false); // New state for button loading

    // --- Ref for the element to download ---
    const resultCardRef = useRef(null);

    // --- Load Data ---
    useEffect(() => {
        if (!user?.user_id) return;

        const loadResults = async () => {
            const res = await getStudentResultsAction(user.user_id);
            if (res.status === 'success') {
                setStudentInfo(res.student);
                setResultsDB(res.results);

                const semesters = Object.keys(res.results);
                if (semesters.length > 0) {
                    setSelectedSemester(semesters[semesters.length - 1]);
                }
            }
            setLoading(false);
        };
        loadResults();
    }, [user]);

    // --- Helpers ---
    const availableSemesters = Object.keys(resultsDB);
    const currentResult = resultsDB[selectedSemester] || null;

    // --- [NEW] Download Handler ---
    // --- [UPDATED] Download Handler using html-to-image ---
    const handleDownload = async () => {
        if (!resultCardRef.current) return;
        setDownloading(true);

        try {
            const element = resultCardRef.current;

            // 1. Generate Image using html-to-image (supports 'lab' colors)
            const dataUrl = await toPng(element, {
                cacheBust: true,
                backgroundColor: '#ffffff' // Ensure white background
            });

            // 2. Initialize PDF
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            // 3. Calculate Image Dimensions to fit PDF width
            const imgProps = pdf.getImageProperties(dataUrl);
            const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

            // 4. Add Image to PDF
            pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, imgHeight);

            // 5. Save
            pdf.save(`${studentInfo.id}_${selectedSemester}_Result.pdf`);

        } catch (error) {
            console.error("Download failed:", error);
            alert("Failed to generate PDF. Please try again.");
        } finally {
            setDownloading(false);
        }
    };

    if (loading) {
        return (
            <Section user={user}>
                <div className="min-h-screen flex items-center justify-center bg-slate-50">
                    <div className="text-slate-500 flex items-center gap-2">
                        <FaSpinner className="animate-spin text-xl" /> Loading Result Data...
                    </div>
                </div>
            </Section>
        );
    }

    if (!studentInfo || availableSemesters.length === 0) {
        return (
            <Section user={user}>
                <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
                    <FaUniversity className="text-6xl text-slate-200 mb-4" />
                    <h2 className="text-xl font-bold text-slate-600">No Results Found</h2>
                    <p className="text-slate-400 text-sm mt-1">Academic records are not available yet.</p>
                </div>
            </Section>
        );
    }

    return (
        <Section user={user}>
            <div className="min-h-screen bg-slate-50 font-sans flex flex-col items-center py-10">

                <div className="w-full container max-w-4xl px-4">

                    {/* --- Page Header --- */}
                    <div className="flex flex-col md:flex-row justify-between items-end mb-6 gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800">Academic Results</h1>
                            <p className="text-slate-500 text-sm">View your grade sheet and academic performance.</p>
                        </div>

                        {/* Semester Filter */}
                        <div className="w-full md:w-auto">
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Select Semester</label>
                            <select
                                value={selectedSemester}
                                onChange={(e) => setSelectedSemester(e.target.value)}
                                className="w-full md:w-48 bg-white border border-slate-300 text-slate-700 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block p-2.5 font-bold shadow-sm"
                            >
                                {availableSemesters.map(sem => (
                                    <option key={sem} value={sem}>{sem} Semester</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* --- Main Result Card (Wrapped with ref) --- */}
                    {currentResult && (
                        <div
                            ref={resultCardRef} // <--- [IMPORTANT] Attach Ref Here
                            className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100 print:shadow-none print:border-2"
                        >

                            {/* 1. Student Info Banner */}
                            <div className="bg-slate-900 text-white px-8 py-6">
                                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-full bg-slate-700 border-2 border-slate-500 flex items-center justify-center text-2xl font-bold text-slate-300 uppercase">
                                            {studentInfo.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold">{studentInfo.name}</h2>
                                            <p className="text-slate-300 font-mono text-sm">ID: {studentInfo.id}</p>
                                        </div>
                                    </div>
                                    <div className="text-right hidden md:block">
                                        <p className="text-sm font-medium text-slate-300">{studentInfo.program}</p>
                                        <p className="text-xs text-slate-500 uppercase tracking-wider mt-1">{studentInfo.batch} Batch</p>
                                    </div>
                                </div>
                            </div>

                            {/* 2. Grade Summary Bar */}
                            <div className="bg-blue-50 px-8 py-4 border-b border-blue-100 flex flex-wrap gap-6 justify-between items-center">
                                <div>
                                    <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block">Semester Status</span>
                                    <span className={`font-bold text-lg ${currentResult.status === 'Passed' ? 'text-emerald-600' : 'text-red-500'}`}>
                                        {currentResult.status}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block">Total Credits</span>
                                    <span className="font-bold text-lg text-slate-700">{currentResult.credits.toFixed(1)} Cr.</span>
                                </div>
                                <div className="bg-white px-6 py-2 rounded-lg shadow-sm border border-blue-100 text-center">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">SGPA</span>
                                    <span className="font-bold text-2xl text-blue-600">{currentResult.sgpa}</span>
                                </div>
                            </div>

                            {/* 3. Detailed Subject Table */}
                            <div className="p-0 overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold border-b border-slate-200">
                                        <tr>
                                            <th className="px-6 py-4">Course Code</th>
                                            <th className="px-6 py-4 w-1/3">Course Title</th>
                                            <th className="px-6 py-4 text-center">Credit</th>
                                            <th className="px-6 py-4 text-center">Letter Grade</th>
                                            <th className="px-6 py-4 text-center">Grade Point</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm divide-y divide-slate-100">
                                        {currentResult.subjects.map((sub, index) => (
                                            <tr key={index} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-4 font-mono font-bold text-slate-600">
                                                    {sub.code}
                                                </td>
                                                <td className="px-6 py-4 font-medium text-slate-700">
                                                    {sub.title}
                                                </td>
                                                <td className="px-6 py-4 text-center text-slate-500">
                                                    {sub.credit.toFixed(1)}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className={`px-2 py-1 rounded text-xs font-bold border ${sub.grade === 'F' ? 'bg-red-50 text-red-600 border-red-200' :
                                                        sub.grade === 'A+' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                                                            'bg-slate-100 text-slate-600 border-slate-200'
                                                        }`}>
                                                        {sub.grade}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center font-bold text-slate-700">
                                                    {sub.point.toFixed(2)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* 4. Footer - Only visible on PDF, hidden in web view via CSS if desired, but kept here for context */}
                            <div className="bg-slate-50 px-8 py-6 border-t border-slate-200 flex justify-between items-center">
                                <p className="text-xs text-slate-400 italic">
                                    * This is a computer generated result. For official transcript contact the registrar office.
                                </p>

                                {/* Download Button: 
                                    We use 'data-html2canvas-ignore' attribute to tell the library 
                                    NOT to include this specific button in the PDF.
                                */}
                                <button
                                    onClick={handleDownload}
                                    disabled={downloading}
                                    data-html2canvas-ignore="true"
                                    className="flex items-center gap-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-sm font-bold py-2 px-4 rounded shadow-sm transition-colors disabled:opacity-50"
                                >
                                    {downloading ? <FaSpinner className="animate-spin" /> : <FaDownload />}
                                    {downloading ? "Generating..." : "Download Result"}
                                </button>
                            </div>

                        </div>
                    )}
                </div>
            </div>
        </Section>
    );
};

export default StudentResultPage;