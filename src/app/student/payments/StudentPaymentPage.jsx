"use client";

import Section from '@/Components/Section';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getStudentPaymentDataAction } from './studentPaymentActions';
import {
    FaSpinner, FaHistory, FaFileInvoiceDollar, FaCheckCircle,
    FaExclamationCircle, FaFilter, FaWallet, FaReceipt, FaPrint, FaTimes, FaUniversity
} from 'react-icons/fa';

// --- Helper: Number Suffix (1st, 2nd, 3rd) ---
const getOrdinal = (n) => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

// --- Helper: Currency Formatter ---
const formatCurrency = (amount) => {
    return `৳ ${Math.abs(amount).toLocaleString()}`;
};

const StudentPaymentPage = ({ user }) => {
    const router = useRouter();

    // --- State ---
    const [loading, setLoading] = useState(true);
    const [selectedReceipt, setSelectedReceipt] = useState(null);

    // Data Sources
    const [overallBalance, setOverallBalance] = useState(0);
    const [allHistory, setAllHistory] = useState([]);
    const [lifetimeStats, setLifetimeStats] = useState({});
    const [semesterSummary, setSemesterSummary] = useState([]);

    // UI State
    const [selectedSemester, setSelectedSemester] = useState('All');

    // --- Load Data ---
    useEffect(() => {
        if (!user?.user_id) return;

        const loadData = async () => {
            const res = await getStudentPaymentDataAction(user.user_id);
            if (res.status === 'success') {
                setOverallBalance(res.balance);
                setAllHistory(res.history);
                setLifetimeStats(res.lifetime);
                setSemesterSummary(res.semesterSummary);
            }
            setLoading(false);
        };
        loadData();
    }, [user]);

    // --- Computed Logic ---

    // 1. Get Unique Sorted Semesters
    const availableSemesters = semesterSummary
        .map(s => s.semester)
        .filter(s => s && s !== 'null' && s !== '')
        .sort((a, b) => parseInt(a) - parseInt(b));

    // 2. Calculate Dashboard Stats based on Selection
    let displayStats = {
        billed: 0,
        paid: 0,
        due: 0,
        percentage: 0
    };

    if (selectedSemester === 'All') {
        // Lifetime Context
        displayStats.billed = parseFloat(lifetimeStats?.total_invoiced || 0);
        displayStats.paid = Math.abs(parseFloat(lifetimeStats?.total_paid || 0));
        displayStats.due = overallBalance;
    } else {
        // Specific Semester Context
        const semData = semesterSummary.find(s => String(s.semester) === String(selectedSemester));
        if (semData) {
            displayStats.billed = parseFloat(semData.total_billed || 0);
            displayStats.paid = Math.abs(parseFloat(semData.total_paid || 0));
            // Due = Billed - Paid
            displayStats.due = displayStats.billed - displayStats.paid;
        }
    }

    // Calculate Payment Progress Percentage
    if (displayStats.billed > 0) {
        displayStats.percentage = Math.round((displayStats.paid / displayStats.billed) * 100);
    } else {
        displayStats.percentage = displayStats.paid > 0 ? 100 : 0;
    }

    // 3. Filter Table Data
    const displayedHistory = selectedSemester === 'All'
        ? allHistory
        : allHistory.filter(h => String(h.semester) === String(selectedSemester));

    // --- Handlers ---
    const handlePayNow = () => {
        const dueAmount = displayStats.due > 0 ? displayStats.due : '';
        router.push(`/student/online-payments?amount=${dueAmount}`);
    };

    if (loading) {
        return (
            <Section user={user}>
                <div className="min-h-screen flex justify-center items-center text-slate-400">
                    <FaSpinner className="animate-spin text-2xl" />
                </div>
            </Section>
        );
    }

    return (
        <Section user={user}>
            <div className="bg-slate-50 font-sans flex flex-col items-center py-10 min-h-screen">
                <div className="w-full container max-w-6xl px-4">

                    {/* --- Page Header & Actions --- */}
                    <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-6">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-800">Financial Portal</h1>
                            <p className="text-slate-500 mt-1">Track your tuition fees, exam payments, and ledger.</p>
                        </div>

                        <div className="flex flex-wrap gap-3 items-center">
                            {/* Semester Filter Pill */}
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaFilter className="text-slate-400 text-xs group-hover:text-indigo-500 transition-colors" />
                                </div>
                                <select
                                    value={selectedSemester}
                                    onChange={(e) => setSelectedSemester(e.target.value)}
                                    className="pl-8 pr-10 py-2.5 bg-white border border-slate-200 rounded-full text-sm font-bold text-slate-700 shadow-sm hover:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer appearance-none transition-all"
                                >
                                    <option value="All">Lifetime Overview</option>
                                    {availableSemesters.map(sem => (
                                        <option key={sem} value={sem}>{getOrdinal(sem)} Semester</option>
                                    ))}
                                </select>
                                {/* Custom Arrow */}
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>

                            <button
                                onClick={handlePayNow}
                                className="bg-slate-900 hover:bg-indigo-600 text-white text-sm font-bold py-2.5 px-6 rounded-full shadow-lg shadow-slate-200 transition-all active:scale-95 flex items-center gap-2"
                            >
                                <FaWallet /> Pay Dues
                            </button>
                        </div>
                    </div>

                    {/* --- Dashboard Stats Grid --- */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

                        {/* 1. Total Billed */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Billed</p>
                                    <h3 className="text-2xl font-bold text-slate-800 mt-1">{formatCurrency(displayStats.billed)}</h3>
                                </div>
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                                    <FaFileInvoiceDollar className="text-lg" />
                                </div>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-1.5">
                                <div className="bg-slate-300 h-1.5 rounded-full" style={{ width: '100%' }}></div>
                            </div>
                            <p className="text-[10px] text-slate-400 mt-2 text-right">Invoiced Amount</p>
                        </div>

                        {/* 2. Total Paid */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Paid</p>
                                    <h3 className="text-2xl font-bold text-emerald-600 mt-1">{formatCurrency(displayStats.paid)}</h3>
                                </div>
                                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                                    <FaCheckCircle className="text-lg" />
                                </div>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-1.5">
                                <div className="bg-emerald-500 h-1.5 rounded-full transition-all duration-1000" style={{ width: `${displayStats.percentage}%` }}></div>
                            </div>
                            <p className="text-[10px] text-emerald-600 mt-2 text-right font-bold">{displayStats.percentage}% Cleared</p>
                        </div>

                        {/* 3. Net Due */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Net Payable</p>
                                    <h3 className={`text-2xl font-bold mt-1 ${displayStats.due > 0 ? 'text-red-500' : 'text-slate-400'}`}>
                                        {displayStats.due <= 0 ? "Settled" : formatCurrency(displayStats.due)}
                                    </h3>
                                </div>
                                <div className={`p-3 rounded-xl ${displayStats.due > 0 ? 'bg-red-50 text-red-500' : 'bg-slate-50 text-slate-400'}`}>
                                    <FaExclamationCircle className="text-lg" />
                                </div>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-1.5">
                                <div className={`h-1.5 rounded-full ${displayStats.due > 0 ? 'bg-red-500' : 'bg-slate-300'}`} style={{ width: `${100 - displayStats.percentage}%` }}></div>
                            </div>
                            <p className="text-[10px] text-slate-400 mt-2 text-right">Outstanding</p>
                        </div>
                    </div>

                    {/* --- Transaction Ledger --- */}
                    <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
                        <div className="px-8 py-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
                            <div>
                                <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                                    <FaHistory className="text-slate-400" />
                                    {selectedSemester === 'All' ? 'Lifetime Transactions' : `${getOrdinal(selectedSemester)} Semester Ledger`}
                                </h3>
                                <p className="text-xs text-slate-500 mt-1">Showing {displayedHistory.length} records</p>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-white text-slate-500 text-xs uppercase font-bold border-b border-slate-100">
                                    <tr>
                                        <th className="px-8 py-4">Date</th>
                                        <th className="px-6 py-4">Academic Period</th>
                                        <th className="px-6 py-4 w-1/3">Description</th>
                                        <th className="px-6 py-4">Mode</th>
                                        <th className="px-6 py-4 text-right">Amount</th>
                                        <th className="px-6 py-4 text-center">Receipt</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm divide-y divide-slate-50">
                                    {displayedHistory.length > 0 ? displayedHistory.map((item, index) => {
                                        const amount = parseFloat(item.amount);
                                        const isPayment = amount < 0;
                                        return (
                                            <tr key={index} className="hover:bg-slate-50/80 transition-colors group">
                                                <td className="px-8 py-4 whitespace-nowrap">
                                                    <div className="font-mono text-slate-600 text-xs">{item.payment_date}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-bold text-slate-700">{item.session}</span>
                                                        {item.semester && (
                                                            <span className="text-[10px] text-slate-400 font-medium bg-slate-100 px-1.5 py-0.5 rounded w-fit mt-1">
                                                                {getOrdinal(item.semester)} Sem
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-slate-700">{item.fee_type}</span>
                                                        {item.remarks && <span className="text-[11px] text-slate-400 italic mt-0.5">{item.remarks}</span>}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col items-start">
                                                        <span className={`text-[10px] font-bold px-2 py-1 rounded border uppercase ${isPayment
                                                                ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                                                : 'bg-slate-50 text-slate-500 border-slate-200'
                                                            }`}>
                                                            {item.payment_method}
                                                        </span>
                                                        {item.trx_id && (
                                                            <span className="text-[10px] font-mono text-slate-400 mt-1">
                                                                #{item.trx_id}
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className={`px-6 py-4 text-right font-bold ${isPayment ? 'text-emerald-600' : 'text-slate-700'}`}>
                                                    {isPayment ? '-' : '+'} {formatCurrency(amount)}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    {isPayment && (
                                                        <button
                                                            onClick={() => setSelectedReceipt(item)}
                                                            className="text-indigo-600 hover:text-indigo-800 p-2 rounded-lg hover:bg-indigo-50 transition-colors inline-flex items-center gap-1.5 font-semibold text-xs border border-indigo-100 shadow-sm"
                                                            title="View Official Receipt"
                                                        >
                                                            <FaReceipt className="text-sm" /> Receipt
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    }) : (
                                        <tr>
                                            <td colSpan="6" className="text-center py-12">
                                                <div className="flex flex-col items-center justify-center text-slate-300">
                                                    <FaHistory className="text-4xl mb-2 opacity-50" />
                                                    <p className="text-sm">No transactions found for this period.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Footer Note */}
                    <div className="mt-8 text-center border-t border-dashed border-slate-200 pt-6">
                        <p className="text-xs text-slate-400">
                            * Payments may take up to 24 hours to reflect. For discrepancies, please contact the Accounts Office with your Transaction ID.
                        </p>
                    </div>

                </div>
            </div>

            {/* --- Official Money Receipt Modal --- */}
            {selectedReceipt && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-fade-in-up">
                        {/* Receipt Header */}
                        <div className="bg-slate-900 text-white p-6 text-center relative">
                            <button
                                onClick={() => setSelectedReceipt(null)}
                                className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors p-1"
                            >
                                <FaTimes className="text-lg" />
                            </button>
                            <img
                                src="https://ugv.edu.bd/assets/images/logos/UGV-Logo-02.png"
                                alt="UGV Logo"
                                className="h-12 w-auto mx-auto mb-2 bg-white/95 rounded p-1"
                            />
                            <h2 className="text-lg font-bold tracking-tight">UNIVERSITY OF GLOBAL VILLAGE</h2>
                            <p className="text-xs text-indigo-300 font-medium">Office of Accounts & Finance</p>
                            <div className="inline-block mt-3 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                Official Payment Receipt
                            </div>
                        </div>

                        {/* Receipt Body */}
                        <div className="p-6 space-y-4">
                            <div className="flex justify-between items-start border-b border-dashed border-slate-200 pb-3 text-xs">
                                <div>
                                    <span className="text-slate-400 font-bold uppercase">Receipt / Voucher:</span>
                                    <p className="font-mono font-bold text-slate-800 mt-0.5">
                                        {selectedReceipt.trx_id || `REC-${selectedReceipt.id}`}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <span className="text-slate-400 font-bold uppercase">Payment Date:</span>
                                    <p className="font-semibold text-slate-800 mt-0.5">{selectedReceipt.payment_date}</p>
                                </div>
                            </div>

                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Student Name:</span>
                                    <span className="font-bold text-slate-800">{user?.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Student ID:</span>
                                    <span className="font-mono font-bold text-slate-800">{user?.user_id}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Academic Period:</span>
                                    <span className="font-semibold text-slate-700">{selectedReceipt.session} {selectedReceipt.semester ? `(${getOrdinal(selectedReceipt.semester)} Sem)` : ''}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Payment Purpose:</span>
                                    <span className="font-semibold text-slate-800">{selectedReceipt.fee_type}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Payment Mode:</span>
                                    <span className="font-semibold uppercase text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded text-xs">
                                        {selectedReceipt.payment_method}
                                    </span>
                                </div>
                                {selectedReceipt.remarks && (
                                    <div className="flex justify-between text-xs text-slate-400 pt-1 border-t border-slate-200/50">
                                        <span>Remarks:</span>
                                        <span className="italic">{selectedReceipt.remarks}</span>
                                    </div>
                                )}
                            </div>

                            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex justify-between items-center">
                                <div>
                                    <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Total Amount Paid</p>
                                    <p className="text-xs text-emerald-600">Verified and credited</p>
                                </div>
                                <span className="text-2xl font-extrabold text-emerald-700">
                                    {formatCurrency(selectedReceipt.amount)}
                                </span>
                            </div>

                            <div className="pt-2 text-[11px] text-center text-slate-400 italic">
                                Computer-generated official money receipt. No manual signature required.
                            </div>
                        </div>

                        {/* Modal Footer Actions */}
                        <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
                            <button
                                onClick={() => setSelectedReceipt(null)}
                                className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
                            >
                                Close
                            </button>
                            <button
                                onClick={() => window.print()}
                                className="px-5 py-2 rounded-lg text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow"
                            >
                                <FaPrint /> Print Receipt
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </Section>
    );
};

export default StudentPaymentPage;