"use client";

import Section from '@/Components/Section';
import React, { useState, useEffect } from 'react';
import { FaCreditCard, FaMobileAlt, FaLock, FaCheckCircle, FaSpinner, FaArrowLeft, FaReceipt } from 'react-icons/fa';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { processOnlinePaymentAction } from './onlinePaymentActions';

const OnlinePaymentPage = ({ user }) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Get amount passed from previous page or default to empty
    const initialAmount = searchParams.get('amount') || '';

    const [amount, setAmount] = useState(initialAmount);
    const [method, setMethod] = useState('bkash'); // Default
    const [processing, setProcessing] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [receiptData, setReceiptData] = useState(null);

    // --- Real Payment Processing ---
    const handlePay = async (e) => {
        e.preventDefault();

        const numericAmount = parseFloat(amount);
        if (!numericAmount || numericAmount <= 0) {
            alert("Please enter a valid payment amount.");
            return;
        }

        setProcessing(true);

        const res = await processOnlinePaymentAction({
            studentId: user?.user_id,
            amount: numericAmount,
            paymentMethod: method.toUpperCase(),
            session: user?.session || 'Current Session',
            semester: user?.current_semester || '1'
        });

        if (res.status === 'success') {
            setReceiptData(res);
            setPaymentSuccess(true);
        } else {
            alert(res.message);
        }

        setProcessing(false);
    };

    // --- Success Screen ---
    if (paymentSuccess && receiptData) {
        return (
            <Section user={user}>
                <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md w-full animate-fade-in-up border border-slate-100">
                        <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FaCheckCircle className="text-5xl" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">Payment Successful!</h2>
                        <p className="text-slate-500 text-sm mb-6">
                            Transaction <span className="font-mono font-bold text-indigo-600">{receiptData.trxId}</span> has been verified and posted to your ledger.
                        </p>
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6 text-left space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Student ID</span>
                                <span className="font-mono font-bold text-slate-700">{user?.user_id}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Amount Credited</span>
                                <span className="font-bold text-emerald-600">৳ {receiptData.amount.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Payment Channel</span>
                                <span className="font-bold text-slate-700 uppercase">{receiptData.method}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Date</span>
                                <span className="font-medium text-slate-600">{receiptData.date}</span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => router.push('/student/payments')}
                                className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 rounded-lg transition-colors shadow"
                            >
                                Return to Financial Ledger
                            </button>
                            <button
                                onClick={() => window.print()}
                                className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold py-2.5 rounded-lg transition-colors border border-indigo-200 flex items-center justify-center gap-2 text-sm"
                            >
                                <FaReceipt /> Print Payment Slip
                            </button>
                        </div>
                    </div>
                </div>
            </Section>
        );
    }

    // --- Payment Form ---
    return (
        <Section user={user}>
            <div className="min-h-screen bg-slate-100 py-10 flex justify-center items-start">
                <div className="w-full max-w-4xl px-4 grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* Left: Summary */}
                    <div className="md:col-span-1 space-y-6">
                        <Link href="/student/payments" className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-800 mb-4">
                            <FaArrowLeft /> Cancel & Return
                        </Link>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Order Summary</h3>

                            <div className="space-y-3 pb-4 border-b border-dashed border-slate-200">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Student ID</span>
                                    <span className="font-mono font-bold text-slate-700">{user?.user_id || '---'}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Merchant</span>
                                    <span className="font-bold text-slate-700">University Accounts</span>
                                </div>
                            </div>

                            <div className="py-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Subtotal</span>
                                    <span className="font-medium">৳ {amount || 0}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Gateway Fee (1.5%)</span>
                                    <span className="font-medium">৳ {amount ? (amount * 0.015).toFixed(2) : 0}</span>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
                                <span className="font-bold text-slate-800">Total Payable</span>
                                <span className="text-xl font-bold text-indigo-600">
                                    ৳ {amount ? (parseFloat(amount) * 1.015).toFixed(2) : '0.00'}
                                </span>
                            </div>
                        </div>

                        <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 text-xs text-indigo-700 flex items-start gap-2">
                            <FaLock className="mt-0.5" />
                            <p>Your transaction is secured with 256-bit SSL encryption. We do not store your card details.</p>
                        </div>
                    </div>

                    {/* Right: Payment Gateway Interface */}
                    <div className="md:col-span-2 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
                        <div className="bg-slate-50 px-8 py-4 border-b border-slate-200">
                            <h2 className="font-bold text-slate-700">Secure Checkout</h2>
                        </div>

                        <div className="p-8">

                            {/* Amount Input */}
                            <div className="mb-8">
                                <label className="block text-sm font-bold text-slate-700 mb-2">Payment Amount (BDT)</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg">৳</span>
                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        className="w-full pl-10 pr-4 py-4 text-2xl font-bold text-slate-800 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>

                            {/* Method Selection */}
                            <h3 className="text-sm font-bold text-slate-700 mb-4">Select Payment Method</h3>
                            <div className="grid grid-cols-3 gap-4 mb-8">
                                {/* Bkash */}
                                <button
                                    onClick={() => setMethod('bkash')}
                                    className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${method === 'bkash' ? 'border-pink-500 bg-pink-50 text-pink-600' : 'border-slate-100 hover:border-slate-200 text-slate-500'}`}
                                >
                                    <FaMobileAlt className="text-2xl" />
                                    <span className="font-bold text-sm">Bkash</span>
                                </button>

                                {/* Card */}
                                <button
                                    onClick={() => setMethod('card')}
                                    className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${method === 'card' ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-slate-100 hover:border-slate-200 text-slate-500'}`}
                                >
                                    <FaCreditCard className="text-2xl" />
                                    <span className="font-bold text-sm">Card</span>
                                </button>

                                {/* Nagad */}
                                <button
                                    onClick={() => setMethod('nagad')}
                                    className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${method === 'nagad' ? 'border-orange-500 bg-orange-50 text-orange-600' : 'border-slate-100 hover:border-slate-200 text-slate-500'}`}
                                >
                                    <FaMobileAlt className="text-2xl" />
                                    <span className="font-bold text-sm">Nagad</span>
                                </button>
                            </div>

                            {/* Dynamic Fields based on Method */}
                            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-8 animate-fade-in">
                                {method === 'card' ? (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Card Number</label>
                                            <input type="text" placeholder="0000 0000 0000 0000" className="w-full border border-slate-300 rounded p-3 text-sm" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Expiry</label>
                                                <input type="text" placeholder="MM/YY" className="w-full border border-slate-300 rounded p-3 text-sm" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">CVC</label>
                                                <input type="text" placeholder="123" className="w-full border border-slate-300 rounded p-3 text-sm" />
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4 text-center">
                                        <p className="text-sm text-slate-600 mb-2">You will be redirected to the <strong>{method === 'bkash' ? 'Bkash' : 'Nagad'} Payment Gateway</strong> to complete the transaction.</p>
                                        <div className="h-12 bg-white border border-slate-300 rounded flex items-center px-4 text-slate-400 text-sm">
                                            Redirecting securely...
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Pay Button */}
                            <button
                                onClick={handlePay}
                                disabled={processing || !amount}
                                className={`w-full py-4 rounded-xl font-bold text-white text-lg shadow-lg flex items-center justify-center gap-3 transition-all active:scale-95 ${method === 'bkash' ? 'bg-pink-600 hover:bg-pink-700 shadow-pink-200' :
                                        method === 'nagad' ? 'bg-orange-600 hover:bg-orange-700 shadow-orange-200' :
                                            'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200'
                                    }`}
                            >
                                {processing ? <FaSpinner className="animate-spin" /> : <FaLock />}
                                {processing ? 'Processing...' : `Pay ৳ ${amount ? (parseFloat(amount) * 1.015).toFixed(2) : '0.00'}`}
                            </button>

                        </div>
                    </div>

                </div>
            </div>
        </Section>
    );
};

export default OnlinePaymentPage;