"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; 
import { TiUserAdd } from "react-icons/ti";
import { MdCreateNewFolder } from "react-icons/md";
import { RiFolderSettingsFill } from "react-icons/ri";


import {
    FaUserCog,
    FaGraduationCap,
    FaCalendarAlt,
    FaBook,
    FaRocket,
    FaBars,
    FaSignOutAlt,
    FaUser,
    FaFolder
} from 'react-icons/fa';

export const actions = {
    admin: [
        {
            title: "Add Users",
            description: "Add Main Users (Teachers, Accountants, Admission Officers)",
            link: "/admin/users/add",
            icon: <TiUserAdd />
        },
        {
            title: "Manage Users",
            description: "View/Update Main Users (Teachers, Accountants, Admission Officers)",
            link: "/admin/users",
            icon: <FaUserCog />
        },
        {
            title: "Add Majors/Dept.",
            description: "Add/View Majors (B.Sc, BA, BBA) & Auto-assign Semesters",
            link: "/admin/majors/add",
            icon: <FaGraduationCap />
        },
        {
            title: "Manage Majors/Dept.",
            description: "Add/View Majors (B.Sc, BA, BBA) & Auto-assign Semesters",
            link: "/admin/majors",
            icon: <FaGraduationCap />
        },
        {
            title: "Add Sessions",
            description: "Add New Sessions & Configure Semesters",
            link: "/admin/sessions/add",
            icon: <MdCreateNewFolder />
        },
        {
            title: "Manage Sessions",
            description: "View and manage existing sessions",
            link: "/admin/sessions",
            icon: <RiFolderSettingsFill />
        },
        {
            title: "Manage Subjects",
            description: "Add new subjects to the curriculum",
            link: "/admin/subjects",
            icon: <FaBook />
        }
    ],
    exam: [
        {
            title: "Teachers on Subject",
            description: "See Assigned Teachers in Subjects",
            link: "/exam/subjects",
            icon: <TiUserAdd />
        },
        {
            title: "Mark Update Options",
            description: "Manage mark update options for subjects",
            link: "/exam/result-update",
            icon: <TiUserAdd />
        }
    ],
    teacher: [
        {
            title: "My Subjects",
            description: "View and manage subjects assigned to you",
            link: "/teacher/subjects",
            icon: <TiUserAdd />
        },
    ],
    admission: [
        {
            title: "Admit Student",
            description: "Admit new students to the university",
            link: "/admission/student",
            icon: <TiUserAdd />
        }, {
            title: "Readmit Student",
            description: "Readmit students who have been dropped out",
            link: "/admission/readmission",
            icon: <TiUserAdd />
        },
    ]
};

const Sidebar = ({ user }) => {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <aside
            className={`${isCollapsed ? 'w-20' : 'w-72'
                } bg-slate-100 min-h-screen text-slate-300 flex flex-col transition-all duration-300 relative shadow-xl`}
        >
            {/* Toggle Button */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute -right-3 top-6 bg-purple-600 text-gray-100 p-1.5 rounded-full shadow-lg hover:bg-purple-700 transition-colors z-50 text-xs"
            >
                <FaBars />
            </button>

            {/* Logo Area */}
            <div className={`p-6 flex items-center justify-center ${isCollapsed ? 'mb-4' : 'mb-6 border-b border-slate-700/50'}`}>
                {isCollapsed ? (
                    <img src="https://ugv.edu.bd/assets/images/logos/UGV-Logo-02.png" alt="Logo" className="w-8 h-auto" />
                ) : (
                    <div className="text-center">
                        <img src="https://ugv.edu.bd/assets/images/logos/UGV-Logo-02.png" alt="Logo" className="w-12 h-auto mx-auto mb-2 bg-white rounded-md p-1" />
                        <h1 className="text-lg font-bold text-gray-800 tracking-tight">UGV Admin</h1>
                        <p className="text-[10px] uppercase tracking-widest text-purple-400 font-semibold">Portal</p>
                    </div>
                )}
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 px-3 space-y-2 overflow-y-auto">
                {user?.user_type?.toLowerCase() in actions && actions[user?.user_type?.toLowerCase()].map((item, index) => {
                    const isActive = pathname === item.link;

                    return (
                        <div key={index} className="relative group">
                            <Link
                                href={item.link}
                                className={`flex items-center gap-4 px-3 py-3 rounded-lg transition-all duration-200 ${isActive
                                        ? 'bg-purple-600 text-white shadow-md shadow-purple-900/20'
                                        : 'hover:bg-slate-800 hover:text-white'
                                    }`}
                            >
                                <span className={`text-xl ${isActive ? 'text-white' : 'text-slate-800 group-hover:text-purple-400'}`}>
                                    {item.icon}
                                </span>

                                <span className={`font-medium whitespace-nowrap ${isActive ? 'text-white' : 'text-slate-800 group-hover:text-purple-400'} transition-opacity duration-200 ${isCollapsed ? 'opacity-0 w-0 hidden' : 'opacity-100'
                                    }`}>
                                    {item.title}
                                </span>
                            </Link>

                            {/* Tooltip for collapsed state OR description popup */}
                            {isCollapsed && (
                                <div className="absolute left-16 top-2 z-50 w-max px-3 py-2 bg-slate-800 text-white text-xs rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                    <p className="font-bold">{item.title}</p>
                                    <p className="text-slate-400 text-[10px]">{item.description}</p>
                                </div>
                            )}
                        </div>
                    );
                })}
            </nav>

            {/* Footer / Logout */}
            <div className="p-4 border-t border-slate-700/50">
                <button
                    onClick={() => window.location.href = '/login'}
                    className={`flex items-center gap-3 w-full px-3 py-3 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all ${isCollapsed ? 'justify-center' : ''
                        }`}
                >
                    <FaSignOutAlt className="text-xl" />
                    {!isCollapsed && <span className="font-medium">Logout</span>}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;