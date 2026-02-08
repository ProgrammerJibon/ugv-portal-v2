"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Import specific icons
import {
    FaUserPlus,
    FaUsersCog,
    FaUniversity,
    FaPlusCircle,
    FaCalendarPlus,
    FaCalendarAlt,
    FaBook,
    FaChalkboardTeacher,
    FaEdit,
    FaBookReader,
    FaUserCheck,
    FaClipboardList,
    FaMoneyBillWave,
    FaCreditCard,
    FaStar,
    FaIdCard,
    FaBars,
    FaSignOutAlt,
    FaArrowUp,
    FaFileAlt
} from 'react-icons/fa';

export const actions = {
    admin: [
        {
            title: "Add Users",
            description: "Add Main Users (Teachers, Accountants, Admission Officers)",
            link: "/admin/users/add",
            icon: <FaUserPlus />
        },
        {
            title: "Manage Users",
            description: "View/Update Main Users",
            link: "/admin/users",
            icon: <FaUsersCog />
        },
        {
            title: "Add Majors/Dept.",
            description: "Add New Departments",
            link: "/admin/majors/add",
            icon: <FaPlusCircle />
        },
        {
            title: "Manage Majors/Dept.",
            description: "View Majors & Assign Semesters",
            link: "/admin/majors",
            icon: <FaUniversity />
        },
        {
            title: "Add Sessions",
            description: "Add New Academic Sessions",
            link: "/admin/sessions/add",
            icon: <FaCalendarPlus />
        },
        {
            title: "Manage Sessions",
            description: "View and manage sessions",
            link: "/admin/sessions",
            icon: <FaCalendarAlt />
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
            icon: <FaChalkboardTeacher />
        },
        {
            title: "Mark Update Options",
            description: "Manage mark update options for subjects",
            link: "/exam/result-update",
            icon: <FaEdit />
        },
        {
            title: "All Marks",
            description: "View all student marks",
            link: "/exam/marks",
            icon: <FaBookReader />
        }
    ],
    teacher: [
        {
            title: "My Subjects",
            description: "View and manage subjects assigned to you",
            link: "/teacher/subjects",
            icon: <FaBookReader />
        },
    ],
    admission: [
        {
            title: "Admit Student",
            description: "Admit new students to the university",
            link: "/admission/student",
            icon: <FaUserPlus />
        },
        {
            title: "Readmit Student",
            description: "Readmit students who have been dropped out",
            link: "/admission/readmission",
            icon: <FaUserCheck />
        },
    ],
    student: [
        {
            title: "Results",
            description: "View your academic results",
            link: "/student/results",
            icon: <FaClipboardList />
        },
        {
            title: "Payments",
            description: "View payment history and dues",
            link: "/student/payments",
            icon: <FaMoneyBillWave />
        },
        {
            title: "Online Payments",
            description: "Make payments securely",
            link: "/student/online-payments",
            icon: <FaCreditCard />
        },
        {
            title: "Review Teachers",
            description: "Review and rate your teachers",
            link: "/student/review-teachers",
            icon: <FaStar />
        },
        {
            title: "Registration",
            description: "View and manage your registration details",
            link: "/student/registration",
            icon: <FaIdCard />
        },
        {
            title: "Report",
            description: "View and manage your academic report",
            link: "/student/report",
            icon: <FaFileAlt />
        },
    ],
    accountant:[
        {
            title: "Student Details",
            description: "View and manage student details",
            link: "/accountant/student-details",
            icon: <FaIdCard />
        },
        {
            title: "Promote Students",
            description: "Promote students to the next semester/year",
            link: "/accountant/promote-students",
            icon: <FaArrowUp />
        },
        {
            title: "Making Payment",
            description: "Add payment for a student",
            link: "/accountant/add-payment",
            icon: <FaMoneyBillWave />
        },
    ]
};

const Sidebar = ({ user }) => {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <aside
            className={`${isCollapsed ? 'w-20' : 'w-72'
                } bg-slate-100 min-h-screen text-slate-500 flex flex-col transition-all duration-300 relative shadow-xl border-r border-slate-200`}
        >
            {/* Toggle Button */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute -right-3 z-0 top-6 bg-purple-600 text-white p-1.5 rounded-full shadow-lg hover:bg-purple-700 transition-colors z-50 text-xs border-2 border-white"
            >
                <FaBars />
            </button>

            {/* Logo Area */}
            <div className={`p-6 flex items-center justify-center ${isCollapsed ? 'mb-4' : 'mb-6 border-b border-slate-200'}`}>
                {isCollapsed ? (
                    <img src="https://ugv.edu.bd/assets/images/logos/UGV-Logo-02.png" alt="Logo" className="w-8 h-auto" />
                ) : (
                    <div className="text-center">
                        <img src="https://ugv.edu.bd/assets/images/logos/UGV-Logo-02.png" alt="Logo" className="w-12 h-auto mx-auto mb-2 bg-white rounded-md p-1 shadow-sm" />
                        <h1 className="text-lg font-bold text-gray-800 tracking-tight">{user.name}</h1>
                        <p className="text-[10px] uppercase tracking-widest text-purple-600 font-bold">{user.user_type}</p>
                    </div>
                )}
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 px-3 space-y-2 overflow-y-auto scrollbar-hide">
                {user?.user_type?.toLowerCase() in actions && actions[user?.user_type?.toLowerCase()].map((item, index) => {
                    const isActive = pathname === item.link;

                    return (
                        <div key={index} className="relative group">
                            <Link
                                href={item.link}
                                className={`flex items-center gap-4 px-3 py-3 rounded-lg transition-all duration-200 ${isActive
                                    ? 'bg-purple-600 text-white shadow-md shadow-purple-200'
                                    : 'hover:bg-white hover:text-purple-600 hover:shadow-sm text-slate-600'
                                    }`}
                            >
                                <span className={`text-xl ${isActive ? 'text-white' : 'group-hover:text-purple-600'}`}>
                                    {item.icon}
                                </span>

                                <span className={`font-medium whitespace-nowrap transition-opacity duration-200 ${isCollapsed ? 'opacity-0 w-0 hidden' : 'opacity-100'
                                    }`}>
                                    {item.title}
                                </span>
                            </Link>

                            {/* Tooltip for collapsed state */}
                            {isCollapsed && (
                                <div className="absolute left-14 top-1.5 z-50 w-max px-3 py-2 bg-slate-800 text-white text-xs rounded-md shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                    <p className="font-bold">{item.title}</p>
                                    <p className="text-slate-400 text-[10px]">{item.description}</p>
                                </div>
                            )}
                        </div>
                    );
                })}
            </nav>

            {/* Footer / Logout */}
            <div className="p-4 border-t border-slate-200 bg-slate-50">
                <button
                    onClick={() => window.location.href = '/login'}
                    className={`flex items-center gap-3 w-full px-3 py-3 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-600 transition-all ${isCollapsed ? 'justify-center' : ''
                        }`}
                >
                    <FaSignOutAlt className="text-xl" />
                    {!isCollapsed && <span className="font-bold">Logout</span>}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;