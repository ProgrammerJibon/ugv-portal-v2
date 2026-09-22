"use client";

import Section from '@/Components/Section';
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { findStudentForPaymentAction, processPaymentAction, getPaymentHistoryAction, getSessionListAction } from './paymentActions';
import {
    FaSpinner, FaSearch, FaCheckCircle, FaMoneyBillWave, FaUserGraduate,
    FaHistory, FaPlusCircle, FaWallet, FaPhone, FaEnvelope, FaUserFriends, FaPercentage
} from 'react-icons/fa';

const AddPaymentPage = ({ user }) => {
    const searchParams = useSearchParams();
    const urlStudentId = searchParams.get('studentId') || '';
    
    const [searchId, setSearchId] = useState(urlStudentId);
    const [student, setStudent] = useState(null);
    const [history, setHistory] = useState([]);
    const [sessionsList, setSessionsList] = useState([]); 
    const [loadingSearch, setLoadingSearch] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [transactionMode, setTransactionMode] = useState('PAYMENT');

    
    const initialFormState = {
        session: '',
        semester: '',
        feeType: 'Tuition Fee',
        amount: '',
        paymentMethod: 'Cash',
        trxId: '',
        remarks: ''
    };
    const [formData, setFormData] = useState(initialFormState);

    
    useEffect(() => {
        const loadSessions = async () => {
            const res = await getSessionListAction();
            if (res.status === 'success') {
                setSessionsList(res.data);
                
                if (res.data.length > 0) {
                    setFormData(prev => ({ ...prev, session: res.data[0].session_name }));
                }
            }
        };
        loadSessions();
    }, []);

    
    const fetchHistory = async (id) => {
        const res = await getPaymentHistoryAction(id);
        if (res.status === 'success') setHistory(res.data);
    };

    const executeSearch = async (idToSearch) => {
        if (!idToSearch) return;

        setLoadingSearch(true);
        setStudent(null);
        setHistory([]);

        const res = await findStudentForPaymentAction(idToSearch);

        if (res.status === 'success') {
            const std = res.data;
            setStudent(std);
            await fetchHistory(std.user_id);

            const defaultSession = std.globalSession || (sessionsList.length > 0 ? sessionsList[0].session_name : '');

            setFormData(prev => ({
                ...prev,
                amount: '',
                session: defaultSession,
                semester: std.current_semester || '1'
            }));
        } else {
            alert(res.message);
        }
        setLoadingSearch(false);
    };

    useEffect(() => {
        if (urlStudentId) {
            executeSearch(urlStudentId);
        }
    }, [urlStudentId]);

    const handleSearch = async (e) => {
        e.preventDefault();
        await executeSearch(searchId);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!student) return;

        const amount = formData.amount;
        const confirmMsg = transactionMode === 'PAYMENT'
            ? `Confirm RECEIVING ৳${amount}?`
            : `Confirm ADDING CHARGE ৳${amount}?`;

        if (!confirm(confirmMsg)) return;

        setProcessing(true);
        const submissionData = new FormData();
        submissionData.append("studentId", student.user_id);
        submissionData.append("accountantId", user.id);
        submissionData.append("mode", transactionMode);

        Object.keys(formData).forEach(key => submissionData.append(key, formData[key]));

        const res = await processPaymentAction(submissionData);

        if (res.status === 'success') {
            alert(res.message);
            
            const impact = transactionMode === 'PAYMENT' ? -parseFloat(amount) : parseFloat(amount);

            setStudent(prev => ({
                ...prev,
                currentDue: parseFloat(prev.currentDue) + impact,
                total_paid: transactionMode === 'PAYMENT' ? (parseFloat(prev.total_paid || 0) + parseFloat(amount)) : prev.total_paid,
                total_billed: transactionMode === 'FEE' ? (parseFloat(prev.total_billed || 0) + parseFloat(amount)) : prev.total_billed
            }));

            await fetchHistory(student.user_id);
            setFormData(prev => ({ ...prev, amount: '' }));
        } else {
            alert(res.message);
        }
        setProcessing(false);
    };

    
    const currentDue = student ? parseFloat(student.currentDue) : 0;
    const inputAmount = parseFloat(formData.amount) || 0;
    let balancePreview = currentDue;
    if (transactionMode === 'PAYMENT') balancePreview -= inputAmount;
    if (transactionMode === 'FEE') balancePreview += inputAmount;

    return (
        <Section user={user}>
            <div className="min-h-screen bg-slate-50  font-sans flex flex-col items-center py-10">
                <div className="w-full container max-w-7xl px-4">

                    <div className="mb-8 border-b border-gray-200 pb-4">
                        <h1 className="text-2xl font-bold text-slate-800">Financial Terminal</h1>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

                        {}
                        <div className="xl:col-span-1 space-y-6">
                            {}
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Find Student</label>
                                <form onSubmit={handleSearch} className="flex gap-2">
                                    <div className="relative flex-grow">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400"><FaSearch /></span>
                                        <input
                                            type="text" placeholder="Enter Student ID" value={searchId}
                                            onChange={(e) => setSearchId(e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-indigo-500 font-mono font-bold text-slate-700"
                                        />
                                    </div>
                                    <button type="submit" disabled={loadingSearch} className="bg-slate-800 hover:bg-slate-700 text-white p-2 rounded-lg transition-colors disabled:opacity-70">
                                        {loadingSearch ? <FaSpinner className="animate-spin" /> : <FaSearch />}
                                    </button>
                                </form>
                            </div>

                            {}
                            {student && (
                                <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden animate-fade-in-up">
                                    <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6 text-white relative">
                                        <h2 className="text-xl font-bold text-gray-800">{student.name}</h2>
                                        <p className="text-sm text-slate-600 font-mono mt-1">{student.user_id}</p>
                                        <div className="flex gap-2 mt-3">
                                            <span className="text-[10px] bg-slate-700 px-2 py-1 rounded">Sem: {student.current_semester}</span>
                                            <span className="text-[10px] bg-slate-700 px-2 py-1 rounded">Sec: {student.section || 'A'}</span>
                                        </div>
                                    </div>

                                    {}
                                    <div className="grid grid-cols-2 divide-x divide-slate-100 border-b border-slate-100">
                                        <div className="p-4 text-center">
                                            <p className="text-[10px] uppercase text-slate-400 font-bold">Lifetime Billed</p>
                                            <p className="text-sm font-bold text-slate-700">৳ {Math.abs(student.total_billed || 0).toLocaleString()}</p>
                                        </div>
                                        <div className="p-4 text-center">
                                            <p className="text-[10px] uppercase text-slate-400 font-bold">Lifetime Paid</p>
                                            <p className="text-sm font-bold text-emerald-600">৳ {Math.abs(student.total_paid || 0).toLocaleString()}</p>
                                        </div>
                                    </div>

                                    <div className="p-6 space-y-2">
                                        <div className="flex justify-between border-b pb-2">
                                            <span className="text-xs text-slate-500 font-bold uppercase">Balance</span>
                                            <span className={`text-xl font-bold ${currentDue > 0 ? 'text-red-600' : 'text-emerald-600'}`}>৳ {currentDue.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {}
                        <div className="xl:col-span-2 space-y-8">
                            <div className={`bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 ${student ? 'opacity-100' : 'opacity-50 pointer-events-none grayscale'}`}>

                                {}
                                <div className="flex border-b border-gray-200">
                                    <button onClick={() => setTransactionMode('PAYMENT')} className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 ${transactionMode === 'PAYMENT' ? 'bg-emerald-50 text-emerald-600 border-b-2 border-emerald-600' : 'text-slate-500'}`}><FaWallet /> Receive Payment</button>
                                    <button onClick={() => setTransactionMode('FEE')} className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 ${transactionMode === 'FEE' ? 'bg-orange-50 text-orange-600 border-b-2 border-orange-600' : 'text-slate-500'}`}><FaPlusCircle /> Add Fee</button>
                                </div>

                                <form onSubmit={handleSubmit} className="p-8 space-y-6">

                                    {}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-4 rounded-lg border border-slate-200">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">For Session</label>
                                            <select
                                                value={formData.session}
                                                onChange={(e) => setFormData({ ...formData, session: e.target.value })}
                                                className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm font-bold text-slate-700 focus:outline-none focus:border-indigo-500"
                                            >
                                                {}
                                                {sessionsList.length > 0 ? (
                                                    sessionsList.map((ses, idx) => (
                                                        <option key={idx} value={ses.session_name}>{ses.session_name}</option>
                                                    ))
                                                ) : (
                                                    <option>Loading Sessions...</option>
                                                )}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">For Semester</label>
                                            <select value={formData.semester} onChange={(e) => setFormData({ ...formData, semester: e.target.value })} className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm font-bold text-slate-700 focus:outline-none focus:border-indigo-500">
                                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(s => <option key={s} value={s}>{s}{['st', 'nd', 'rd'][((s + 90) % 100 - 10) % 10 - 1] || 'th'} Semester</option>)}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Amount (BDT)</label>
                                            <input type="number" placeholder="0.00" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} className="w-full border border-gray-300 rounded-lg pl-4 pr-4 py-3 font-bold text-lg text-slate-800 focus:outline-none focus:border-indigo-500" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Fee Type</label>
                                            <select value={formData.feeType} onChange={(e) => setFormData({ ...formData, feeType: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-indigo-500 bg-white">
                                                {transactionMode === 'PAYMENT' ? (
                                                    <>
                                                        <option>Tuition Fee</option><option>Admission Fee</option><option>Exam Fee</option><option>Semester Fee</option><option>Other</option>
                                                    </>
                                                ) : (
                                                    <>
                                                        <option>Library Fine</option><option>Lab Damage</option><option>Late Fee</option><option>ID Card Re-issue</option><option>Certificate Fee</option><option>Other</option>
                                                    </>
                                                )}
                                            </select>
                                        </div>
                                    </div>

                                    {transactionMode === 'PAYMENT' && (
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Method</label>
                                            <div className="grid grid-cols-3 gap-2">
                                                {['Cash', 'Bank', 'Online'].map((mode) => (
                                                    <button type="button" key={mode} onClick={() => setFormData({ ...formData, paymentMethod: mode })} className={`py-2 text-sm font-bold rounded border ${formData.paymentMethod === mode ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600'}`}>{mode}</button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="pt-4 border-t flex justify-between items-center">
                                        <div className="text-xs text-slate-500">New Balance: <strong className="text-slate-800">৳ {balancePreview.toLocaleString()}</strong></div>
                                        <button type="submit" disabled={processing} className={`text-white font-bold py-3 px-8 rounded-lg shadow-lg flex items-center gap-2 disabled:opacity-70 ${transactionMode === 'PAYMENT' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-orange-600 hover:bg-orange-700'}`}>
                                            {processing ? <FaSpinner className="animate-spin" /> : (transactionMode === 'PAYMENT' ? <FaCheckCircle /> : <FaPlusCircle />)}
                                            {transactionMode === 'PAYMENT' ? "Confirm Payment" : "Add Charge"}
                                        </button>
                                    </div>
                                </form>
                            </div>

                            {}
                            {student && (
                                <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                                    <div className="bg-slate-50 px-6 py-3 border-b flex justify-between items-center">
                                        <h3 className="font-bold text-slate-700 text-sm">Recent Transactions</h3>
                                    </div>
                                    <div className="overflow-x-auto max-h-96 overflow-y-auto">
                                        <table className="w-full text-left text-sm">
                                            <thead className="bg-white text-slate-500 font-bold border-b sticky top-0">
                                                <tr><th className="px-6 py-3">Date</th><th className="px-6 py-3">Sem</th><th className="px-6 py-3">Type</th><th className="px-6 py-3 text-right">Amount</th></tr>
                                            </thead>
                                            <tbody className="divide-y">
                                                {history.map((item) => (
                                                    <tr key={item.id}>
                                                        <td className="px-6 py-3 text-slate-600 text-xs font-mono">{item.payment_date}</td>
                                                        <td className="px-6 py-3 text-xs">{item.semester}</td>
                                                        <td className="px-6 py-3 text-xs">{item.fee_type}</td>
                                                        <td className={`px-6 py-3 text-right font-bold ${item.amount < 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                                            {item.amount < 0 ? '-' : '+'} ৳ {Math.abs(item.amount).toLocaleString()}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Section>
    );
};

export default AddPaymentPage;