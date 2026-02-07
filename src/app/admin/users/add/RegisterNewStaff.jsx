"use client";
import React, { useEffect, useState } from 'react';
import addUserAction, { getProbableId } from './addUserAction';

const AddUserForm = ({ getMajorsData }) => {
    const [role, setRole] = useState('Teacher');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Form State
    const [formData, setFormData] = useState({
        name: 'Test',
        email: 'test@ugv.edu.bd',
        phone: '01888888888',
        prefix: '',
        joiningDate: '2024-01-01',
        facultyId: '', 
        department: 'Computer Science & Engineering',
        designation: 'Lecturer',
        userIdSuffix: '',
        password: '12345678' // Default temporary password
    });

    // Handle Input Change
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    let changing = false;
    useEffect(() => {
        (async () => {
            if(changing) return;
            changing = true;
            let prefix = '---';
            if(role === 'Admin') {
                prefix = 'A-';
            } else if(role == 'Exam') {
                prefix = 'E-';
            } else if(role == 'Admission') {
                prefix = 'AD-'; // admission desk
            } else if(role == 'Teacher') {
                prefix = 'T-';
            } else if(role == 'Accountant') {
                prefix = 'AC-';
            }
            setFormData((prev) => ({ ...prev, prefix }));
            const res = await getProbableId(prefix);
            if (res.status === 'success') {
                setFormData((prev) => ({ ...prev, userIdSuffix: res.nextNumber.toString().padStart(4, '0') }));
            } else {
                setFormData((prev) => ({ ...prev, userIdSuffix: '0001' }));
            }
            setTimeout(() => {changing = false;}, 1000);
        })();
    }, [formData.prefix, role]);

    // Handle Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        // 1. Client-side Validation
        if (!formData.name || !formData.email || !formData.phone || !formData.userIdSuffix) {
            setMessage({ type: 'error', text: 'Please fill in all required fields.' });
            setLoading(false);
            return;
        }

        // 2. Prepare Data for Server Action
        const payload = new FormData();
        payload.append("name", formData.name);
        payload.append("user_type", role?.toUpperCase() || ''); // "Teacher", "Accountant", etc.
        payload.append("email_address", formData.email);
        payload.append("phone_number", formData.phone);
        payload.append("joining_date", formData.joiningDate);

    
        payload.append("prefix", formData.prefix);

        payload.append("password", formData.password);

        // Role specific logic
        if (role === 'Teacher') {
            payload.append("faculty_id", formData.facultyId || "TBA");
            payload.append("designation", formData.designation); // e.g., Lecturer
        } else {
            // For others, designation is their role or specific title
            payload.append("designation", role);
        }

        // 3. Call Server Action
        try {
            const result = await addUserAction(payload);

            
            if (result.status === 'success') {
                setMessage({ type: 'success', text: result.message });
                // Reset form slightly
                setFormData({ ...formData, name: '', email: '', phone: '', userIdSuffix: '' });
            } else {
                setMessage({ type: 'error', text: result.message });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Something went wrong. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Section>
            <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
                <div className="flex-grow container mx-auto py-10 px-4">
                    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">

                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-6 text-white">
                            <h2 className="text-2xl font-bold">Register New Staff</h2>
                            <p className="text-blue-100 text-sm mt-1">Create accounts for Teachers, Accountants, and Admission Officers.</p>
                        </div>

                        {/* Status Message */}
                        {message.text && (
                            <div className={`mx-8 mt-6 p-4 rounded-md ${message.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
                                {message.text}
                            </div>
                        )}

                        <form className="px-8 py-8" onSubmit={handleSubmit}>

                            {/* Section 1: User Role */}
                            <div className="mb-8">
                                <h3 className="text-lg font-bold text-slate-800 border-b border-gray-200 pb-2 mb-4">1. Account Role</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                    {['Admin', 'Exam','Teacher', 'Accountant', 'Admission'].map((r) => (
                                        <label key={r} className={`cursor-pointer border p-4 rounded-lg flex items-center justify-between transition-all ${role === r ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'border-gray-200 hover:border-blue-300'}`}>
                                            <div className="flex items-center gap-3">
                                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${role === r ? 'border-blue-600' : 'border-gray-400'}`}>
                                                    {role === r && <div className="w-2 h-2 rounded-full bg-blue-600"></div>}
                                                </div>
                                                <span className="font-semibold text-slate-700">{r}</span>
                                            </div>
                                            <input type="radio" name="role" value={r} className="hidden" checked={role === r} onChange={() => setRole(r)} />
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Section 2: Personal Details */}
                            <div className="mb-8">
                                <h3 className="text-lg font-bold text-slate-800 border-b border-gray-200 pb-2 mb-4">2. Personal Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-600 mb-1">Full Name</label>
                                        <input required name="name" value={formData.name} onChange={handleChange} type="text" placeholder="e.g. Dr. Md. Rahim Uddin" className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500 transition-colors" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-600 mb-1">Email Address</label>
                                        <input required name="email" value={formData.email} onChange={handleChange} type="email" placeholder="email@ugv.edu.bd" className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500 transition-colors" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-600 mb-1">Phone Number</label>
                                        <input required name="phone" value={formData.phone} onChange={handleChange} type="tel" placeholder="+880 1XXX XXXXXX" className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500 transition-colors" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-600 mb-1">Joining Date</label>
                                        <input required name="joiningDate" value={formData.joiningDate} onChange={handleChange} type="date" className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500 transition-colors" />
                                    </div>
                                </div>
                            </div>

                            {/* Section 3: Role Specific Fields */}
                            {role === 'Teacher' && (
                                <div className="mb-8 p-6 bg-slate-50 rounded-lg border border-slate-200">
                                    <h3 className="text-md font-bold text-slate-700 mb-4 uppercase tracking-wider text-xs">Faculty Assignment</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-600 mb-1">Department</label>
                                            <select name="department" value={formData.department} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500 bg-white">
                                                {getMajorsData?.data?.map((major) => (
                                                    <option key={major.id} value={major.program_short_name}>{major.program_name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-600 mb-1">Designation</label>
                                            <select name="designation" value={formData.designation} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500 bg-white">
                                                <option>Lecturer</option>
                                                <option>Assistant Professor</option>
                                                <option>Associate Professor</option>
                                                <option>Professor</option>
                                                <option>Head of Department</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-600 mb-1">Faculty ID (Optional)</label>
                                            <input name="facultyId" value={formData.facultyId} onChange={handleChange} type="text" placeholder="e.g. FAC-001" className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500 bg-white" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Section 4: Login Credentials */}
                            <div className="mb-8">
                                <h3 className="text-lg font-bold text-slate-800 border-b border-gray-200 pb-2 mb-4">4. Login Credentials</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-600 mb-1">Assign User ID</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-2 text-gray-600 font-bold select-none">
                                                {formData.prefix}
                                            </span>
                                            <input
                                                required
                                                name="userIdSuffix"
                                                disabled
                                                value={formData.userIdSuffix}
                                                onChange={handleChange}
                                                type="text"
                                                placeholder="Auto-generated"
                                                className="w-full border border-gray-300 rounded-md pl-12 pr-4 py-2 focus:outline-none focus:border-blue-500 bg-gray-50 font-mono"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-600 mb-1">Temporary Password</label>
                                        <input
                                            name="password"
                                            value={formData.password}
                                            disabled
                                            type="text"
                                            className="w-full border border-gray-300 rounded-md px-4 py-2 bg-gray-100 text-gray-500 font-bold focus:outline-none focus:bg-white transition-colors"
                                        />
                                        <p className="text-xs text-gray-400 mt-1">* User will be asked to change this on first login.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end gap-4 mt-10 pt-6 border-t border-gray-100">
                                <button type="button" onClick={() => window.history.back()} className="px-6 py-2 rounded-md text-slate-600 hover:bg-slate-100 font-semibold transition-colors">
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded-md shadow-lg transition-transform active:scale-95 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Creating...' : (
                                        <>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                                            </svg>
                                            Create User
                                        </>
                                    )}
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </Section>
    );
};

export default AddUserForm;