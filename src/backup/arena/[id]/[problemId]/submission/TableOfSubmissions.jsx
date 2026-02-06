import { useState } from "react";
import getSubmissionDetails from "./getSubmissionDetails";
import { Editor } from "@monaco-editor/react";
import TableClickSubmissionDetails from "./TableClickSubmissionDetails";
import { formatDate } from "@/app/functions";
import Image from "@/Components/Image";
import Link from "next/link";

export default ({ loading, submissionsList }) => {


    const [picErrors, setPicErrors] = useState([]);
    const [selectedSubmission, setSelectedSubmission] = useState(null);

    



    const StatusBadge = ({ isPassed }) => (
        <span className={`px-2 py-1 text-xs font-bold rounded-full ${isPassed
            ? "bg-green-100 text-green-800 border border-green-200"
            : "bg-red-100 text-red-800 border border-red-200"
            }`}>
            {isPassed ? "ACCEPTED" : "FAILED"}
        </span>
    );

    

    


    


    return <div className=" pb-64">
        <div className="overflow-x-auto border border-gray-300 rounded-lg shadow-sm">
            <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        <th className="px-6 py-3">ID</th>
                        <th className="px-6 py-3">Student ID</th>
                        <th className="px-6 py-3">User</th>
                        <th className="px-6 py-3">Language</th>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3">Submitted On</th>
                        <th className="px-6 py-3">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr><td colSpan="6" className="px-6 py-10 text-center text-gray-500">Loading data...</td></tr>
                    ) : submissionsList?.length > 0 ? (
                        submissionsList.map((sub,i) => (
                            <tr key={sub.id} className="bg-white border-b hover:bg-gray-50 border-b-gray-200">
                                <td className="px-6 py-4 font-mono">{i + 1}#{sub.id}</td>
                                <td className="px-6 py-4 font-mono">
                                    <span className="text-xs text-gray-400">{sub.university_id}#{sub.university_student_id}</span>
                                </td>
                                <td >
                                    <Link href={"/profile/" + sub.user_id} target="_blank" className="px-6 py-4 flex items-center gap-2 hover:opacity-50 text-gray-900">
                                        <div>
                                            <Image src={sub.user_pic} alt={sub.name} className={"w-8 h-8 bg-gray-300 decoration-0 rounded-full overflow-hidden"} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-semibold ">{sub.user_name}</span>
                                        </div>
                                    </Link>
                                </td>
                                <td className="px-6 py-4 font-medium text-gray-900">{sub.code_language || "Unknown"}</td>
                                <td className="px-6 py-4"><StatusBadge isPassed={sub.isPassed} /></td>
                                <td className="px-6 py-4">{formatDate(sub.submitted_on)}</td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => setSelectedSubmission(sub)}
                                        className="font-medium text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                                    >
                                        View Code
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr><td colSpan="6" className="px-6 py-10 text-center text-gray-500">No submissions found.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
        <TableClickSubmissionDetails 
            selectedSubmission={selectedSubmission}
            setSelectedSubmission={setSelectedSubmission}
            />
    </div>
}
