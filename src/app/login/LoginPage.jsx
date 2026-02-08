"use client";

import React, { useState } from 'react';
import loginAction from './loginAction';
import { verifyStudentAction } from './verifyStudentAction'; 
import { FaSearch, FaTimes, FaUserGraduate, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

const LoginPage = () => {
    // --- Login State ---
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // --- Verification Popup State ---
    const [showVerify, setShowVerify] = useState(false);
    const [verifyId, setVerifyId] = useState('');
    const [verifyData, setVerifyData] = useState(null);
    const [verifyError, setVerifyError] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);

    // --- Login Handler ---
    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        if (!userId || !password) {
            setError("Please enter both User ID/Phone and Password");
            setIsLoading(false);
            return;
        }

        try {
            const res = await loginAction({ userId, password });
            if (res.status === "success") {
                window.location.href = "/";
            } else {
                setError(res.errors ? Object.values(res.errors)[0] : "Login failed.");
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    // --- Verification Handler ---
    const handleVerify = async (e) => {
        e.preventDefault();
        setVerifyError('');
        setVerifyData(null);
        setIsVerifying(true);

        const res = await verifyStudentAction(verifyId);

        if (res.status === 'success') {
            setVerifyData(res.data);
        } else {
            setVerifyError(res.message);
        }
        setIsVerifying(false);
    };

    return (
        <div className="min-h-screen bg-white font-sans flex flex-col relative overflow-x-hidden">

            {/* Background Header */}
            <div className="relative w-full h-[400px] bg-blue-50 overflow-hidden">
                <img
                    src="https://ugv.edu.bd/storage/events/wsZ0rbSnEboFXajDY0l4F7pS9QwMhRut7ptNcTnd.jpg"
                    alt="University Campus"
                    className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent"></div>
            </div>

            {/* --- SIDE BUTTON (Trigger) --- */}
            {/* [FIX] Changed to 'fixed' and 'z-50' to ensure it floats above background but below modal */}
            <div className="fixed right-0 top-1/2 transform -translate-y-1/2 z-50">
                <button 
                    onClick={() => setShowVerify(true)}
                    className="bg-green-700 text-white font-bold py-6 px-2 rounded-l-lg shadow-lg hover:bg-green-800 transition-all active:scale-95 flex items-center justify-center writing-mode-vertical"
                    style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
                >
                    <span className="rotate-180 tracking-widest uppercase text-xs mb-2 opacity-70">Check ID</span>
                    <span className="rotate-180 text-lg">Student Verification</span>
                </button>
            </div>

            {/* Login Card Container */}
            {/* [FIX] kept 'z-10' so it is lower than the popup (z-100) */}
            {!showVerify  && <div className="flex-grow flex flex-col items-center justify-start -mt-28 relative z-10 pb-10">
                {!showVerify  && <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-2 overflow-hidden border border-gray-100">
                    
                    {/* Card Header Image */}
                    {!showVerify  && <div className="bg-slate-300 rounded-t-lg py-8 flex justify-center items-center relative overflow-hidden">
                        <div className="absolute w-24 h-24 bg-blue-500 rounded-full blur-3xl opacity-20"></div>
                        <div className="relative z-10 flex flex-col items-center">
                            <img
                                src="https://ugv.edu.bd/assets/images/logos/UGV-Logo-02.png"
                                alt="UGV Logo"
                                className="h-30 w-auto drop-shadow-lg"
                            />
                        </div>
                    </div>}

                    {!showVerify && <div className="px-8 py-8 text-center">
                        <h2 className="text-2xl font-bold text-slate-800 mb-1">University Of Global Village</h2>
                        <form className="space-y-4 mt-8" onSubmit={handleLogin}>
                            <input
                                type="text" placeholder="Enter User ID" value={userId}
                                onChange={(e) => setUserId(e.target.value)}
                                className="w-full bg-yellow-50 border border-yellow-200 text-gray-700 placeholder-gray-400 text-sm rounded-md focus:ring-2 focus:ring-purple-400 focus:outline-none p-3 shadow-sm"
                            />
                            <input
                                type="password" placeholder="Enter Password" value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-yellow-50 border border-yellow-200 text-gray-700 placeholder-gray-400 text-sm rounded-md focus:ring-2 focus:ring-purple-400 focus:outline-none p-3 shadow-sm"
                            />
                            <button
                                type="submit" disabled={isLoading}
                                className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold py-3 px-4 rounded-md shadow-md transition-transform transform active:scale-95 mt-4 disabled:opacity-50"
                            >
                                {isLoading ? 'Logging in...' : 'Login'}
                            </button>
                            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                            <ul className="flex flex-wrap justify-center gap-6 text-sm font-semibold text-slate-600 mb-4">
                                <li><a href="#" className="hover:text-purple-700 transition-colors" onClick={(e) => { e.preventDefault(); alert("Contact Admin"); }}>Forgot Password ?</a></li>
                            </ul>
                        </form>
                    </div>}
                </div>}
            </div>}

            <footer className="w-full py-8 mt-auto bg-white">
                <div className="container mx-auto flex flex-col items-center">
                    <p className="text-xs text-gray-400 mt-2">Copyright © 2026 University of Global Village, Bangladesh</p>
                </div>
            </footer>

            {/* --- VERIFICATION POPUP MODAL --- */}
            {/* [FIX] Increased Z-Index to z-[999] to guarantee it covers everything */}
            {showVerify && (
                <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative transform transition-all scale-100">
                        
                        {/* Modal Header */}
                        <div className="bg-green-700 p-4 flex justify-between items-center text-white">
                            <div className="flex items-center gap-2">
                                <FaSearch className="text-green-200" />
                                <h3 className="font-bold text-lg">Verify Student ID</h3>
                            </div>
                            <button onClick={() => { setShowVerify(false); setVerifyData(null); setVerifyId(''); setVerifyError(''); }} className="hover:bg-green-800 p-2 rounded-full transition-colors">
                                <FaTimes />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6">
                            <form onSubmit={handleVerify} className="flex gap-2 mb-6">
                                <input 
                                    type="text" 
                                    placeholder="Enter Student ID (e.g. 19100...)" 
                                    value={verifyId}
                                    onChange={(e) => setVerifyId(e.target.value)}
                                    className="flex-grow bg-slate-50 border border-slate-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
                                />
                                <button type="submit" disabled={isVerifying} className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg font-bold transition-colors disabled:opacity-50">
                                    {isVerifying ? '...' : 'Check'}
                                </button>
                            </form>

                            {/* Result Area */}
                            {verifyError && (
                                <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-3 border border-red-100">
                                    <FaExclamationCircle className="text-xl flex-shrink-0" />
                                    <div>
                                        <p className="font-bold text-sm">Not Found</p>
                                        <p className="text-xs">{verifyError}</p>
                                    </div>
                                </div>
                            )}

                            {verifyData && (
                                <div className="bg-white border-2 border-green-500 rounded-xl p-6 relative overflow-hidden text-center shadow-sm">
                                    <div className="absolute top-0 right-0 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">
                                        VERIFIED
                                    </div>
                                    
                                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3 text-green-600 border-2 border-green-100">
                                        <FaUserGraduate className="text-3xl" />
                                    </div>

                                    <h2 className="text-xl font-bold text-slate-800">{verifyData.name}</h2>
                                    <p className="text-green-600 font-mono font-bold text-sm mb-4">{verifyData.user_id}</p>

                                    <div className="grid grid-cols-2 gap-4 text-left bg-slate-50 p-4 rounded-lg border border-slate-100">
                                        <div>
                                            <p className="text-[10px] uppercase text-slate-400 font-bold">Department</p>
                                            <p className="text-sm font-semibold text-slate-700 leading-tight">{verifyData.department || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase text-slate-400 font-bold">Result (CGPA)</p>
                                            <p className="text-sm font-semibold text-slate-700">{verifyData.batch || '0.00'}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-4 flex items-center justify-center gap-2 text-green-600 text-xs font-bold">
                                        <FaCheckCircle /> Student record exists in database.
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default LoginPage;