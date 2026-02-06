"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import getSubmissionsCount from "./getSubmissionsCount";

export default function SubmissionCountsNavbar({ arenaId, problemId, currentType = "" }) {


    const [countsOfSubmissionTypes, setCountsOfSubmissionTypes] = useState(null);
    const [loading, setLoading] = useState(true);

    

    const countTypes = [
        {
            key: "allOverSubmission",
            label: "All Submission",
            description: ""
        },
        {
            key: "standings",
            label: "Standings",
            description: ""
        },
        {
            key: "totalSubmissionsPassed",
            label: "All Success",
            description: "Total number of submissions where all testcases have passed successfully"
        },
        {
            key: "totalSubmissionsFailed",
            label: "All Failed",
            description: "Total number of submissions where at least one testcase failed"
        },
        {
            key: "usersWithAtLeastOneSuccess",
            label: "Users with Success",
            description: "Count of unique users who have at least one submission that passed at least one testcase"
        },
        {
            key: "usersWithAtLeastOneFailure",
            label: "Users with Failure",
            description: "Count of unique users who have at least one submission that failed at least one testcase"
        },
        {
            key: "usersWithOnlySuccess",
            label: "Only Success Users",
            description: "Count of users whose all submissions passed successfully with no failures"
        },
        {
            key: "usersWithOnlyFailure",
            label: "Only Failed Users",
            description: "Count of users whose all submissions failed with no successes"
        }
    ];


    useEffect(() => {
        let isMounted = true;
        const fetchData = async () => {
            try {
                setLoading(true);
                const countsData = await getSubmissionsCount(arenaId, problemId);



                if (isMounted) {
                    setCountsOfSubmissionTypes(countsData);
                }
            } catch (error) {
                console.error("Failed to fetch submissions:", error);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        if (arenaId && problemId) fetchData();
        return () => { isMounted = false; };
    }, [arenaId, problemId, currentType]);


    if (!countsOfSubmissionTypes) return null;

    return (
        <div className="flex gap-4 text-sm justify-start p-4 border border-gray-300 bg-gray-100 rounded-lg flex-wrap">
            {countTypes.map(ct => (
                <Link
                    key={ct.key}
                    title={ct.description}
                    href={`/arena/${arenaId}/${problemId}/submission?type=${ct.key}`}
                    className={`px-2 py-1  rounded-lg hover:bg-red-700 hover:text-white whitespace-nowrap ${currentType == ct.key ? "text-red-600 " : ""}`}
                >
                    {ct.label}{countsOfSubmissionTypes[ct.key]? `(${countsOfSubmissionTypes[ct.key] || 0})`:""}
                </Link>
            ))}
        </div>
    );
}
