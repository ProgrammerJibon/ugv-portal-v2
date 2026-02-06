import { formatDate } from "@/app/functions"
import { Editor } from "@monaco-editor/react"
import { useEffect, useState } from "react";
import getSubmissionDetails from "./getSubmissionDetails";


export default ({ selectedSubmission, setSelectedSubmission }) => {


    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const [detailedData, setDetailedData] = useState(null);

    const handleViewCode = async (submission) => {
        setIsModalOpen(true);
        setSelectedSubmission(submission);
        setModalLoading(true);
        setDetailedData(null);

        try {
            const details = await getSubmissionDetails(submission.id);

            setDetailedData(details);
        } catch (error) {
            console.error("Error fetching details", error);
        } finally {
            setModalLoading(false);
        }
    };

    useEffect(()=>{
        if (selectedSubmission != null){
            handleViewCode(selectedSubmission);
        }
    }, [selectedSubmission])



    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedSubmission(null);
        setDetailedData(null);
    };

    useState

    return <>
        {isModalOpen && selectedSubmission && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 bg-opacity-50 p-4 animate-in fade-in duration-200">
                <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">

                    {/* Modal Header */}
                    <div className="flex justify-between items-center p-4 border-b bg-gray-50">
                        <div>
                            <h3 className="text-lg font-bold text-gray-800">
                                Submission #{selectedSubmission.id}
                            </h3>
                            <p className="text-sm text-gray-500">
                                By {selectedSubmission.user_name} • {selectedSubmission.code_language} • {formatDate(selectedSubmission.submitted_on)}
                            </p>
                        </div>
                        <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 p-2 text-2xl font-bold">&times;</button>
                    </div>

                    {/* Modal Body */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {modalLoading ? (
                            <div className="flex justify-center items-center h-40">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            </div>
                        ) : detailedData ? (
                            <>
                                {/* Code Section */}
                                <div>
                                    <h4 className="font-semibold text-gray-700 mb-2">Source Code</h4>
                                    {detailedData.code != "HIDDEN BY TEACHER" ? <Editor
                                        height="400px"
                                        defaultLanguage="cpp"
                                        theme="vs-dark"
                                        value={detailedData.code}
                                        className="border border-gray-300 rounded-lg overflow-hidden "
                                        options={{
                                            fontSize: 14,
                                            padding: { top: 32 },
                                            minimap: { enabled: false },
                                            automaticLayout: true,
                                            tabSize: 4,
                                            insertSpaces: true,
                                            readOnly: true,

                                        }}
                                    /> : <div className="text-xs">
                                        <span>Code is hidden by teacher</span>
                                    </div>}
                                </div>

                                {/* Test Cases Section */}
                                <div>
                                    <h4 className="font-semibold text-gray-700 mb-2">Test Case Results</h4>
                                    <div className="space-y-3">
                                        {detailedData.testCases.map((tc, index) => (
                                            <div key={index} className={`border rounded-lg p-3 ${Number(tc.matched) === 1 ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="font-bold text-sm text-gray-600">Test Case #{index + 1}</span>
                                                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${Number(tc.matched) === 1 ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                                                        {Number(tc.matched) === 1 ? 'PASSED' : 'FAILED'}
                                                    </span>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
                                                    <div>
                                                        <span className="block text-gray-500 font-sans mb-1">Input:</span>
                                                        <div className="bg-white border p-2 rounded max-h-20 overflow-y-auto">{tc.testcase_input || "‎"}</div>
                                                    </div>
                                                    <div>
                                                        <span className="block text-gray-500 font-sans mb-1">Expected Output:</span>
                                                        <div className="bg-white border p-2 rounded max-h-20 overflow-y-auto">{tc.expected_output || "‎"}</div>
                                                    </div>
                                                    <div>
                                                        <span className="block text-gray-500 font-sans mb-1">Actual Output:</span>
                                                        <div className="bg-white border p-2 rounded max-h-20 overflow-y-auto whitespace-pre-wrap">
                                                            {tc.actual_output || "‎"}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="text-center text-red-500">Failed to load details.</div>
                        )}
                    </div>

                    {/* Modal Footer */}
                    <div className="p-4 border-t bg-gray-50 flex justify-end">
                        <button
                            onClick={closeModal}
                            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded text-sm font-medium"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        )}
    </>
}
