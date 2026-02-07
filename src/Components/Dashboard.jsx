"use client";

import React from 'react';
import Link from 'next/link';
import Navbar from './Navbar';
import {actions} from './SideBar';
import Profile from './Profile';



const Dashboard = ({user}) => {
    // defined based on your requirements list
    console.log(user);
    

    return (
        <div className="bg-slate-50 w-full font-sans  flex flex-col">

            <Navbar user={user} />

            <main className=" w-10/12  px-4 pb-10 container mx-auto">

                <div className=' w-full mb-8'>
                    <Profile user={user}/>
                </div>

                <div className='w-full'>
                    <div className="mb-8  w-full ">
                        <h2 className="text-2xl font-bold text-slate-800">Dashboard Overview</h2>
                        <p className="text-slate-500 mt-1">Select an action to manage university data.</p>
                    </div>

                    {/* Grid of Admin Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {user?.user_type?.toLowerCase() in actions && actions[user?.user_type?.toLowerCase()].map((action, index) => (
                            <Link
                                key={index}
                                href={action.link}
                                className="group block bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg hover:border-purple-200 transition-all duration-200 transform hover:-translate-y-1"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-12 h-12 rounded-lg bg-purple-50 text-2xl flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                                        {action.icon}
                                    </div>
                                    <span className="text-gray-300 group-hover:text-purple-400 transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                        </svg>
                                    </span>
                                </div>

                                <h3 className="text-lg font-bold text-slate-800 group-hover:text-purple-700 mb-2 transition-colors">
                                    {action.title}
                                </h3>
                                <p className="text-sm text-slate-500 leading-relaxed">
                                    {action.description}
                                </p>
                            </Link>
                        ))}
                    </div>
                </div>

            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 py-6 mt-auto">
                <div className="container mx-auto px-6 text-center text-xs text-gray-400">
                    <p>Copyright © 2026 University of Global Village, Bangladesh. All rights reserved.</p>
                </div>
            </footer>

        </div>
    );
};

export default Dashboard;