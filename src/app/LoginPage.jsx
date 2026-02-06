"use client";

import React from 'react';

const LoginPage = () => {
    return (
        <div className="min-h-screen bg-white font-sans flex flex-col relative overflow-x-hidden">

            <div className="relative w-full h-[400px] bg-blue-50 overflow-hidden">
                <img
                    src="https:ugv.edu.bd/storage/events/wsZ0rbSnEboFXajDY0l4F7pS9QwMhRut7ptNcTnd.jpg"
                    alt="University Campus"
                    className="w-full h-full object-cover opacity-80"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent"></div>
            </div>


            <div className="fixed right-0 top-1/2 transform -translate-y-1/2 z-50">
                <div className="bg-green-700 text-white font-bold py-4 px-1 rounded-l-md writing-mode-vertical rotate-180 flex items-center justify-center h-32 cursor-pointer hover:bg-green-800 shadow-lg" style={{ writingMode: 'vertical-rl' }}>
                    UGV Portal
                </div>
            </div>

            
            <div className="flex-grow flex flex-col items-center justify-start -mt-28 z-30 pb-10">

                
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-2 overflow-hidden border border-gray-100">

                    
                    <div className="bg-slate-300 rounded-t-lg py-8 flex justify-center items-center relative overflow-hidden">
                        
                        <div className="absolute w-24 h-24 bg-blue-500 rounded-full blur-3xl opacity-20"></div>

                        
                        <div className="relative z-10 flex flex-col items-center">
                            <img
                                src="https://ugv.edu.bd/assets/images/logos/UGV-Logo-02.png"
                                alt="UGV Logo"
                                className="h-30 w-auto drop-shadow-lg"
                            />
                        </div>
                    </div>

                    
                    <div className="px-8 py-8 text-center">
                        <h2 className="text-2xl font-bold text-slate-800 mb-1">University Of Global Village</h2>
                        <p className="text-purple-700 font-medium mb-8 text-sm"></p>

                        <form className="space-y-4">
                            
                            <div>
                                <input
                                    type="text"
                                    placeholder="Enter User ID"
                                    className="w-full bg-yellow-50 border border-yellow-200 text-gray-700 placeholder-gray-400 text-sm rounded-md focus:ring-2 focus:ring-purple-400 focus:outline-none p-3 shadow-sm transition-all"
                                />
                            </div>

                            
                            <div>
                                <input
                                    type="password"
                                    placeholder="Enter Password"
                                    className="w-full bg-yellow-50 border border-yellow-200 text-gray-700 placeholder-gray-400 text-sm rounded-md focus:ring-2 focus:ring-purple-400 focus:outline-none p-3 shadow-sm transition-all"
                                />
                            </div>

                            
                            <button
                                type="button"
                                className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold py-3 px-4 rounded-md shadow-md transition-transform transform active:scale-95 mt-4"
                            >
                                Login
                            </button>
                            <ul className="flex flex-wrap justify-center gap-6 text-sm font-semibold text-slate-600 mb-4">
                                <li><a href="" className="hover:text-purple-700 transition-colors"
                                    onClick={()=>{
                                        alert("Please contact the university administration to reset your password.");
                                    }}
                                >Forgot Password ?</a></li>
                            </ul>
                        </form>
                    </div>
                </div>

            </div>

            
            <footer className="w-full py-8 mt-auto bg-white">
                <div className="container mx-auto flex flex-col items-center">

                    <p className="text-xs text-gray-400 mt-2">
                        Copyright © 2026  University of Global Village, Bangladesh
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default LoginPage;