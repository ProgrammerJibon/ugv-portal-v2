"use client";

import Section from '@/Components/Section';
import React, { useState, useEffect, useRef } from 'react';
import { uploadContentAction, getMaterialsAction, deleteContentAction } from './contentActions';
import {
    FaCloudUploadAlt, FaFilePdf, FaFileWord, FaFileVideo,
    FaTrash, FaSpinner, FaFileAlt, FaDownload
} from 'react-icons/fa';
import { useParams } from 'next/navigation';

const ContentUploadPage = ({ user }) => { // Default subjectId for demo

    const params = useParams();
        const subjectId = params.subjectId; // Matches folder name [subjectId]

    // --- State ---
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    // --- Form State ---
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = useRef(null);

    // --- Load Data ---
    const loadMaterials = async () => {
        setLoading(true);
        const res = await getMaterialsAction(subjectId);
        if (res.status === 'success') {
            setMaterials(res.data);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadMaterials();
    }, [subjectId]);

    // --- Handlers ---
    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!selectedFile || !title) {
            alert("Please provide a title and select a file.");
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append("subjectId", subjectId);
        formData.append("teacherId", user.id);
        formData.append("title", title);
        formData.append("description", description);
        formData.append("file", selectedFile);

        const res = await uploadContentAction(formData);

        if (res.status === 'success') {
            // Reset Form
            setTitle('');
            setDescription('');
            setSelectedFile(null);
            if (fileInputRef.current) fileInputRef.current.value = "";

            // Refresh List
            await loadMaterials();
        } else {
            alert(res.message);
        }
        setUploading(false);
    };

    const handleDelete = async (id, path) => {
        if (!confirm("Are you sure you want to delete this material?")) return;

        const res = await deleteContentAction(id, path);
        if (res.status === 'success') {
            setMaterials(materials.filter(m => m.id !== id));
        }
    };

    // --- Helper: File Icon ---
    const getFileIcon = (type) => {
        if (type.includes('pdf')) return <FaFilePdf className="text-red-500 text-xl" />;
        if (type.includes('doc')) return <FaFileWord className="text-blue-500 text-xl" />;
        if (type.includes('mp4') || type.includes('avi')) return <FaFileVideo className="text-purple-500 text-xl" />;
        return <FaFileAlt className="text-gray-400 text-xl" />;
    };

    return (
        <Section user={user}>
            <div className="min-h-screen bg-slate-50 font-sans py-10">
                <div className="container mx-auto px-4 max-w-5xl">

                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-slate-800">Course Materials</h1>
                        <p className="text-slate-500 text-sm">Upload and manage lecture notes, videos, and resources.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* --- Left: Upload Form --- */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-6">
                                <div className="bg-slate-800 px-6 py-4">
                                    <h2 className="text-white font-bold text-sm uppercase tracking-wide flex items-center gap-2">
                                        <FaCloudUploadAlt /> Upload Content
                                    </h2>
                                </div>
                                <form onSubmit={handleUpload} className="p-6 space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1">Content Title</label>
                                        <input
                                            type="text"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            placeholder="e.g. Week 1 Lecture Slides"
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1">Description (Optional)</label>
                                        <textarea
                                            rows="3"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            placeholder="Brief summary..."
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 resize-none"
                                        ></textarea>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1">File Attachment</label>
                                        <div className="relative border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:bg-slate-50 transition-colors">
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                onChange={handleFileChange}
                                                accept=".pdf,.docx,.doc,.mp4,.png,.jpg"
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            />
                                            {selectedFile ? (
                                                <div className="text-sm font-bold text-indigo-600 truncate px-2">
                                                    {selectedFile.name}
                                                </div>
                                            ) : (
                                                <div className="text-slate-400">
                                                    <p className="text-xs">Click or Drag file here</p>
                                                    <p className="text-[10px] mt-1 opacity-70">PDF, DOCX, MP4 (Max 50MB)</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={uploading}
                                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-md shadow-md transition-all active:scale-95 flex justify-center items-center gap-2 disabled:opacity-70"
                                    >
                                        {uploading ? <FaSpinner className="animate-spin" /> : 'Upload Material'}
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* --- Right: Content List --- */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-100 bg-slate-50 flex justify-between items-center">
                                    <h3 className="font-bold text-slate-700 text-sm">Uploaded Materials</h3>
                                    <span className="text-xs font-bold bg-white border px-2 py-1 rounded text-slate-500">
                                        Total: {materials.length}
                                    </span>
                                </div>

                                {loading ? (
                                    <div className="p-10 text-center text-slate-400"><FaSpinner className="animate-spin inline" /> Loading...</div>
                                ) : materials.length === 0 ? (
                                    <div className="p-10 text-center text-slate-400">
                                        <p>No materials uploaded yet.</p>
                                    </div>
                                ) : (
                                    <ul className="divide-y divide-gray-100">
                                        {materials.map((item) => (
                                            <li key={item.id} className="p-4 hover:bg-slate-50 transition-colors flex items-start gap-4 group">
                                                {/* Icon Box */}
                                                <div className="w-12 h-12 bg-white border border-gray-200 rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
                                                    {getFileIcon(item.file_type)}
                                                </div>

                                                {/* Content Details */}
                                                <div className="flex-grow">
                                                    <div className="flex justify-between items-start">
                                                        <h4 className="text-sm font-bold text-slate-800">{item.title}</h4>
                                                        <div className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                                                            {item.upload_date}
                                                        </div>
                                                    </div>

                                                    {item.description && (
                                                        <p className="text-xs text-slate-500 mt-1 line-clamp-2">{item.description}</p>
                                                    )}

                                                    <div className="flex items-center gap-3 mt-2">
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase">{item.file_type.toUpperCase()}</span>
                                                        <span className="text-[10px] text-slate-400">•</span>
                                                        <span className="text-[10px] font-bold text-slate-400">{item.file_size}</span>
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <a
                                                        href={item.file_path}
                                                        download
                                                        className="text-indigo-500 hover:text-indigo-700 bg-indigo-50 p-2 rounded hover:bg-indigo-100"
                                                        title="Download"
                                                    >
                                                        <FaDownload />
                                                    </a>
                                                    <button
                                                        onClick={() => handleDelete(item.id, item.file_path)}
                                                        className="text-red-400 hover:text-red-600 bg-red-50 p-2 rounded hover:bg-red-100"
                                                        title="Delete"
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </Section>
    );
};

export default ContentUploadPage;