"use client";

import Section from '@/Components/Section';
import React, { useState } from 'react';
import { findStudentForPaymentAction, processPaymentAction, getPaymentHistoryAction } from './paymentActions';
import { FaSpinner, FaSearch, FaCheckCircle, FaMoneyBillWave, FaUserGraduate, FaHistory, FaReceipt } from 'react-icons/fa';

const AddPaymentPage = ({ user }) => {
    
    const [searchId, setSearchId] = useState('');
    const [student, setStudent] = useState(null);
    const [history, setHistory] = useState([]); 
    const [loadingSearch, setLoadingSearch] = useState(false);
    const [processing, setProcessing] = useState(false);

    
    const initialFormState = {
        session: 'Summer 2026',
        feeType: 'Tuition Fee',
        amount: '',
        paymentMethod: 'Cash',
        trxId: '',
        remarks: ''
    };
    const [paymentData, setPaymentData] = useState(initialFormState);

    
    const fetchHistory = async (id) => {
        const res = await getPaymentHistoryAction(id);
        if (res.status === 'success') setHistory(res.data);
    };

    
    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchId) return;

        setLoadingSearch(true);
        setStudent(null);
        setHistory([]);
        setPaymentData(prev => ({ ...prev, amount: '' }));

        const res = await findStudentForPaymentAction(searchId);
        if (res.status === 'success') {
            setStudent(res.data);
            await fetchHistory(res.data.user_id); 
        } else {
            alert(res.message);
        }
        setLoadingSearch(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!student) return;
        if (!confirm(`Confirm payment of ৳${paymentData.amount}?`)) return;

        setProcessing(true);
        const formData = new FormData();
        formData.append("studentId", student.user_id);
        formData.append("accountantId", user.id);
        Object.keys(paymentData).forEach(key => formData.append(key, paymentData[key]));

        const res = await processPaymentAction(formData);

        if (res.status === 'success') {
            alert(res.message);
            
            setStudent(prev => ({
                ...prev,
                currentDue: parseFloat(prev.currentDue) - parseFloat(paymentData.amount)
            }));
            
            await fetchHistory(student.user_id);
            
            setPaymentData(prev => ({ ...initialFormState, session: prev.session, feeType: prev.feeType }));
        } else {
            alert(res.message);
        }
        setProcessing(false);
    };

    
    const currentDue = student ? parseFloat(student.currentDue) : 0;
    const payingAmount = parseFloat(paymentData.amount) || 0;
    const remainingBalance = currentDue - payingAmount;

    return (
        <Section user={user}>
            <div className="min-h-screen bg-slate-50 font-sans flex flex-col items-center py-10">
                <div className="w-full container max-w-6xl px-4">

                    {}
                    <div className="mb-8 border-b border-gray-200 pb-4">
                        <h1 className="text-2xl font-bold text-slate-800">Process New Payment</h1>
                        <p className="text-slate-500 text-sm">Collect fees, generate receipts, and view history.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {}
                        <div className="lg:col-span-1 space-y-6">

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
                                    <button type="submit" disabled={loadingSearch} className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-lg transition-colors disabled:opacity-70">
                                        {loadingSearch ? <FaSpinner className="animate-spin" /> : <FaSearch />}
                                    </button>
                                </form>
                            </div>

                            {}
                            {student ? (
                                <div className="bg-white rounded-xl shadow-lg border border-indigo-50 overflow-hidden relative animate-fade-in-up">
                                    <div className="bg-indigo-600 h-20"></div>
                                    <div className="px-6 pb-6 text-center -mt-10">
                                        <div className="w-20 h-20 mx-auto bg-white rounded-full p-1 shadow-md flex items-center justify-center text-slate-300">
                                            <div className="w-full h-full bg-slate-100 rounded-full flex items-center justify-center text-3xl"><FaUserGraduate /></div>
                                        </div>
                                        <h2 className="text-lg font-bold text-slate-800 mt-3">{student.name}</h2>
                                        <p className="text-sm text-slate-500 font-mono font-bold">{student.user_id}</p>
                                        <p className="text-xs text-slate-400 mt-1">{student.dept} • Batch {student.batch}</p>

                                        {}
                                        <div className="mt-6 bg-slate-50 border border-slate-200 rounded-lg p-4 text-left space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-500">Current Due:</span>
                                                <span className="font-bold text-slate-700">৳ {currentDue.toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-emerald-600">Paying Now:</span>
                                                <span className="font-bold text-emerald-600">- ৳ {payingAmount.toLocaleString()}</span>
                                            </div>
                                            <div className="border-t border-slate-200 pt-2 flex justify-between items-center">
                                                <span className="text-xs font-bold uppercase text-slate-400">Remaining</span>
                                                <span className={`font-bold text-lg ${remainingBalance > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                                                    ৳ {remainingBalance.toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-slate-100 border-2 border-dashed border-slate-300 rounded-xl p-8 text-center text-slate-400">
                                    <p className="text-sm">Search for a student ID to begin.</p>
                                </div>
                            )}
                        </div>

                        {}
                        <div className="lg:col-span-2 space-y-8">

                            {}
                            <div className={`bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 ${student ? 'opacity-100' : 'opacity-50 pointer-events-none grayscale'}`}>
                                <div className="bg-slate-50 px-8 py-4 border-b border-gray-200 flex justify-between items-center">
                                    <h3 className="font-bold text-slate-700 flex items-center gap-2"><FaMoneyBillWave className="text-emerald-500" /> New Payment</h3>
                                    <span className="text-xs font-bold text-slate-400 uppercase">Entry</span>
                                </div>
                                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Session</label>
                                            <select value={paymentData.session} onChange={(e) => setPaymentData({ ...paymentData, session: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-indigo-500 bg-white">
                                                <option>Spring 2026</option><option>Summer 2026</option><option>Fall 2026</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Fee Type</label>
                                            <select value={paymentData.feeType} onChange={(e) => setPaymentData({ ...paymentData, feeType: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-indigo-500 bg-white">
                                                <option>Tuition Fee</option><option>Admission Fee</option><option>Semester Fee</option><option>Exam Fee</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Amount (BDT)</label>
                                            <div className="relative">
                                                <span className="absolute left-4 top-3 text-slate-400 font-bold">৳</span>
                                                <input type="number" placeholder="0.00" value={paymentData.amount} onChange={(e) => setPaymentData({ ...paymentData, amount: e.target.value })} className="w-full border border-gray-300 rounded-lg pl-8 pr-4 py-3 font-bold text-lg text-slate-800 focus:outline-none focus:border-indigo-500" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Method</label>
                                            <div className="grid grid-cols-3 gap-2">
                                                {['Cash', 'Bank', 'Online'].map((mode) => (
                                                    <button type="button" key={mode} onClick={() => setPaymentData({ ...paymentData, paymentMethod: mode })} className={`py-3 text-sm font-bold rounded-lg border transition-all ${paymentData.paymentMethod === mode ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-white text-slate-600 border-gray-200 hover:bg-slate-50'}`}>{mode}</button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    {paymentData.paymentMethod !== 'Cash' && (
                                        <div className="animate-fade-in-up">
                                            <label className="block text-sm font-bold text-slate-700 mb-2">TRX ID</label>
                                            <input type="text" placeholder="e.g. TRX-8291002" value={paymentData.trxId} onChange={(e) => setPaymentData({ ...paymentData, trxId: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-indigo-500 font-mono" />
                                        </div>
                                    )}
                                    <div className="pt-6 border-t border-gray-100 flex items-center justify-end gap-4">
                                        <button type="button" onClick={() => setStudent(null)} className="text-slate-500 font-bold hover:text-slate-800 px-4 py-2 transition-colors">Cancel</button>
                                        <button type="submit" disabled={processing} className="bg-emerald-600 hover:bg-emerald-700 text-white text-base font-bold py-3 px-8 rounded-lg shadow-lg shadow-emerald-200 transition-transform active:scale-95 flex items-center gap-2 disabled:opacity-70">
                                            {processing ? <FaSpinner className="animate-spin" /> : <FaCheckCircle />} Confirm
                                        </button>
                                    </div>
                                </form>
                            </div>

                            {}
                            {student && (
                                <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden animate-fade-in-up">
                                    <div className="bg-slate-50 px-8 py-4 border-b border-gray-200 flex justify-between items-center">
                                        <h3 className="font-bold text-slate-700 flex items-center gap-2"><FaHistory className="text-blue-500" /> Transaction History</h3>
                                        <span className="text-xs font-bold text-slate-400 bg-white border px-2 py-1 rounded">Total: {history.length}</span>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold border-b border-slate-200">
                                                <tr>
                                                    <th className="px-6 py-3">Date</th>
                                                    <th className="px-6 py-3">Session</th>
                                                    <th className="px-6 py-3">Type</th>
                                                    <th className="px-6 py-3">Method</th>
                                                    <th className="px-6 py-3 text-right">Amount</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-sm divide-y divide-slate-100">
                                                {history.length > 0 ? history.map((item) => (
                                                    <tr key={item.id} className="hover:bg-slate-50">
                                                        <td className="px-6 py-3 font-mono text-slate-600">{item.payment_date}</td>
                                                        <td className="px-6 py-3">{item.session}</td>
                                                        <td className="px-6 py-3 font-medium text-slate-700">{item.fee_type}</td>
                                                        <td className="px-6 py-3">
                                                            <span className="text-xs font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded border uppercase">{item.payment_method}</span>
                                                            {item.trx_id && <span className="block text-[10px] text-slate-400 mt-1 font-mono">{item.trx_id}</span>}
                                                        </td>
                                                        <td className="px-6 py-3 text-right font-bold text-emerald-600">৳ {Number(item.amount).toLocaleString()}</td>
                                                    </tr>
                                                )) : (
                                                    <tr><td colSpan="5" className="text-center py-6 text-slate-400">No payment history found.</td></tr>
                                                )}
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