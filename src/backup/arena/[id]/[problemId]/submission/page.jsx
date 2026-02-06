"use client";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import getSubmissions from "./getSubmissions";
import getSubmissionsCount from "./getSubmissionsCount";
import SubmissionCountsNavbar from "./SubmissionCountsNavbar";
import TableOfSubmissions from "./TableOfSubmissions";



export default function SubmissionListPage() {
    const { id, problemId } = useParams();
    const params = useSearchParams();
    const type = params.get("type") || "";
    const arenaId = id;
    const router = useRouter();

    if(type == ""){
        router.replace("?type=allOverSubmission");
        return <></>
    }

    const [submissionsList, setSubmissionsList] = useState(null);
    const [loading, setLoading] = useState(true);

    

    useEffect(() => {
        let isMounted = true;
        const fetchData = async () => {
            try {
                setLoading(true);
                const listData = await getSubmissions(arenaId, problemId, type);                

                

                if (isMounted) {
                    setSubmissionsList(listData);
                }
            } catch (error) {
                console.error("Failed to fetch submissions:", error);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        if (arenaId && problemId) fetchData();
        return () => { isMounted = false; };
    }, [arenaId, problemId, type]);

    
    

    return (
        <div className="container w-10/12 mx-auto p-4 space-y-6 relative">
            <h1 className="text-2xl font-bold text-gray-800">Submission Details</h1>

            <SubmissionCountsNavbar
                arenaId={arenaId}
                problemId={problemId}
                currentType={type}
            />

            <div className="bg-white p-4 rounded shadow-sm border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-700">
                    Filter: <span className="text-blue-600">{type || "All Submissions"}</span>
                </h2>
                <p className="text-sm text-gray-500">
                    {loading ? "Loading..." : `Showing ${submissionsList?.length || 0} result(s)`}
                </p>
            </div>

            <TableOfSubmissions 
                loading={loading}
                submissionsList={submissionsList}
                />

        </div>
    );
}